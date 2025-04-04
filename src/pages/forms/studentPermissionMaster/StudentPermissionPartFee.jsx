import { useState, lazy, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
import moment from "moment";
const GridIndex = lazy(() => import("../../../components/GridIndex"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput.jsx")
);

const permissionLists = [
  { label: "Examination", value: "Examination" },
  { label: "Part Fee", value: "Part Fee" },
  { label: "Attendance", value: "Attendance" },
  { label: "Fine Concession", value: "Fine Waiver" },
];

const initialState = {
  permissionType: "Part Fee",
  permissionList: permissionLists,
  auidOrFeeTemplate: "",
  auid: "",
  feeTemplate: "",
  feeTemplateList: [],
  tillDate: "",
  allowTillSem: "",
  studentDues: "",
  studentFineConcession: "",
  permittedBy: "",
  remarks: "",
  checked: false,
  attachment: "",
  loading: false,
  studentDetail: [],
  studentAuidDetail: null,
  allowTillSemList: [],
  permittedByList: [],
};

const requiredAttachment = ["attachment"];

const requiredFieldsWithoutExam = ["auid", "remarks", "attachment"];

const requiredFieldsWithExam = [
  "auid",
  "allowTillSem",
  "tillDate",
  "studentDues",
  "permittedBy",
  "remarks",
];

let requiredFieldsWithFineWaiver = [];

const StudentPermissionPartFee = () => {
  const [
    {
      permissionType,
      auidOrFeeTemplate,
      permissionList,
      auid,
      feeTemplate,
      feeTemplateList,
      tillDate,
      allowTillSem,
      permittedBy,
      studentDues,
      studentFineConcession,
      remarks,
      checked,
      attachment,
      loading,
      studentDetail,
      studentAuidDetail,
      allowTillSemList,
      permittedByList,
    },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      sortable: false,
      renderHeader: () => (
        <FormGroup>
          {" "}
          <FormControlLabel control={headerCheckbox} />
        </FormGroup>
      ),
      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={params.value}
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1 },
    {
      field: "student_name",
      headerName: "Student",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ textTransform: "capitalize" }}>
          {params.row.student_name?.toLowerCase()}
        </Typography>
      ),
    },
    { field: "usn", headerName: "USN", flex: 1 },
    {
      field: "current_sem",
      headerName: "Year/Sem",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>{`${params.row?.current_year}/${params.row?.current_sem}`}</Typography>
        );
      },
    },
  ];

  useEffect(() => {
    requiredFieldsWithFineWaiver = [
      "auid",
      "tillDate",
      "studentFineConcession",
      "remarks",
    ];
    setCrumbs([
      { name: "Permission", link: "/permission-index-partfee" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
    getFeeTemplate();
    !!location.state && setFormField();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      !!feeTemplate && getStudentDetailByFeeTemplate(feeTemplate);
    }, 1500);
    return () => {
      clearTimeout(handler);
    };
  }, [feeTemplate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      !!auid && getStudentDetailByAuid(auid);
    }, 1500);
    return () => {
      clearTimeout(handler);
    };
  }, [auid]);

  const getFeeTemplate = async () => {
    try {
      const res = await axios.get("api/finance/getAllFeeTemplate");
      setState((prevState) => ({
        ...prevState,
        feeTemplateList: res.data.data.map((ele, index) => ({
          value: ele.split("-")[1],
          label: ele,
        })),
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const setFormField = () => {
    setState((prevState) => ({
      ...prevState,
      auid: location.state.auid || " ",
      permissionType: location.state.permissionType || " ",
      tillDate: location.state?.tillDate || " ",
      allowTillSem: location.state?.allowSem || " ",
      studentDues: location.state?.totalDue || "",
      permittedBy: location.state?.permittedBy || "",
      remarks: location.state?.remarks || "",
      studentFineConcession: location.state?.concessionAmount || "",
      auidOrFeeTemplate: "auid",
    }));
  };

  const getStudentDetailByFeeTemplate = async (feeTemplateId) => {
    try {
      const res = await axios.get(
        `/api/finance/FetchStudentDetailsByFeeTemplateId/${feeTemplateId}`
      );
      if (res.status === 200 || res.status === 201) {
        if (permissionType === "Examination")
          getAllowTillSemList(res.data.data[0]);
        setState((prevState) => ({
          ...prevState,
          studentDetail: res.data.data.map((ele, index) => ({
            id: index + 1,
            ...ele,
            isSelected: false,
          })),
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getStudentDetailByAuid = async (studentAuid) => {
    try {
      const res = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${studentAuid}`
      );
      if (res.status === 200 || res.status === 201) {
        if (permissionType === "Examination")
          getAllowTillSemList(res.data.data[0]);
        if (studentAuid && permissionType == "Fine Waiver")
          getTotalFine(studentAuid);

        setState((prevState) => ({
          ...prevState,
          studentAuidDetail: res.data.data[0],
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getAllowTillSemList = (studentDetails) => {
    if (studentDetails?.current_sem != 0) {
      const semLists = Array.from(
        { length: studentDetails?.current_sem },
        (_, i) => ({
          label: `Sem ${i + 1}`,
          value: i + 1,
        })
      );
      setState((prevState) => ({
        ...prevState,
        allowTillSemList: semLists,
      }));
    }
    getStudentDues(studentDetails);
  };

  const getStudentDues = async (studentDetails) => {
    try {
      const res = await axios.get(
        `/api/student/getTotalDueofStudent?studentId=${studentDetails?.id}&currentSem=${studentDetails?.current_sem}`
      );
      if (res.status === 200 || res.status === 201) {
        getPermittedByEmployees();
        setState((prevState) => ({
          ...prevState,
          studentDues: res.data.data,
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getPermittedByEmployees = async () => {
    try {
      const res = await axios.get(`/api/employee/EmployeeDetails`);
      if (res.status === 200 || res.status === 201) {
        const employeeList = res.data?.data?.map((ele) => ({
          label: ele?.employee_name,
          value: ele?.empcode,
        }));
        setState((prevState) => ({
          ...prevState,
          permittedByList: employeeList,
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const setNullFormField = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
      auidOrFeeTemplate: "",
      auid: "",
      tillDate: "",
      remarks: "",
      allowTillSem: "",
      studentDues: "",
      permittedBy: "",
      attachment: null,
    }));
  };

  const getTotalFine = async (auid) => {
    try {
      const res = await axios.get(`api/student/getTotalLateFee?auid=${auid}`);
      if (res.status == 200) {
        const {
          sem1,
          sem2,
          sem3,
          sem4,
          sem5,
          sem6,
          sem7,
          sem8,
          sem9,
          sem10,
          sem11,
          sem12,
        } = res.data.data;
        setState((prevState) => ({
          ...prevState,
          studentDues:
            (sem1 ? sem1 : 0) +
              (sem2 ? sem2 : 0) +
              (sem3 ? sem3 : 0) +
              (sem4 ? sem4 : 0) +
              (sem5 ? sem5 : 0) +
              (sem6 ? sem6 : 0) +
              (sem7 ? sem7 : 0) +
              (sem8 ? sem8 : 0) +
              (sem9 ? sem9 : 0) +
              (sem10 ? sem10 : 0) +
              (sem11 ? sem11 : 0) +
              (sem12 ? sem12 : 0) || 0,
        }));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "permissionType") {
      setNullFormField(name, newValue);
    } else {
      setState((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: name == "auid" ? value.trim() : value,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const headerCheckbox = (
    <Checkbox
      checked={checked ? true : false}
      onClick={(e) => handleHeaderCheckboxChange(e)}
      indeterminate={studentDetail?.some((row) => row.isSelected)}
    />
  );

  const handleHeaderCheckboxChange = (event) => {
    event.stopPropagation();
    let updatedLists = studentDetail.map((el) => ({
      ...el,
      isSelected: event.target.checked,
    }));
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      studentDetail: updatedLists,
    }));
  };

  const handleCellCheckboxChange = (id) => (event) => {
    let updatedLists = studentDetail.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      studentDetail: updatedLists,
    }));
  };

  const errorAttachmentMessages = {
    attachment: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const checkAttachment = {
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".pdf"),
      attachment?.size < 2000000,
    ],
  };

  const checkWithoutExam = {
    auid: [auid !== ""],
    tillDate: [tillDate !== ""],
    remarks: [remarks !== ""],
  };

  const checkWithExam = {
    auid: [auid !== ""],
    allowTillSem: [allowTillSem !== ""],
    studentDues: [studentDues !== ""],
    permittedBy: [permittedBy !== ""],
    remarks: [remarks !== ""],
  };

  const checkWithFineWaiver = {
    auid: [auid !== ""],
    tillDate: [tillDate !== ""],
    studentFineConcession: [studentFineConcession !== ""],
    remarks: [remarks !== ""],
    attachment: [
      attachment !== "",
      attachment?.name?.endsWith(".pdf"),
      attachment?.size < 2000000,
    ],
  };

  const isAttachmentValid = () => {
    for (let i = 0; i < requiredAttachment.length; i++) {
      const field = requiredAttachment[i];
      if (Object.keys(checkAttachment).includes(field)) {
        const ch = checkAttachment[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const requiredFieldsWithoutExamValid = () => {
    for (let i = 0; i < requiredFieldsWithoutExam.length; i++) {
      const field = requiredFieldsWithoutExam[i];
      if (Object.keys(checkWithoutExam).includes(field)) {
        const ch = checkWithoutExam[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const requiredFieldsWithExamValid = () => {
    for (let i = 0; i < requiredFieldsWithExam.length; i++) {
      const field = requiredFieldsWithExam[i];
      if (Object.keys(checkWithExam).includes(field)) {
        const ch = checkWithExam[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const requiredFieldsWithFineWaiverValid = () => {
    for (let i = 0; i < requiredFieldsWithFineWaiver.length; i++) {
      const field = requiredFieldsWithFineWaiver[i];
      if (Object.keys(checkWithFineWaiver).includes(field)) {
        const ch = checkWithFineWaiver[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      !!attachment ? uploadAttachment() : createPermission("");
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const uploadAttachment = async () => {
    try {
      const formData = new FormData();
      formData.append("file", attachment);
      formData.append("fileType", permissionType);
      formData.append("studentId", studentDetail?.id);
      const res = await axios.post(
        `api/student/uploadStudentPermissionFile`,
        formData
      );
      if (res.status == 200 || res.status == 201) {
        createPermission(res.data.data);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const createPermission = async (fileUploadResponse) => {
    try {
      let payload = {};
      if (
        permissionType == "Examination" ||
        location.state?.permissionType == "Examination"
      ) {
        payload = {
          studentPermissionDTO: [
            {
              auid: auid,
              studentName: studentAuidDetail?.student_name || "",
              currentYear: studentAuidDetail?.current_year || null,
              currentSem: studentAuidDetail?.current_sem || null,
              permissionType: permissionType,
              totalDue: studentDues || 0,
              tillDate: tillDate || "",
              permittedBy: permittedBy,
              allowSem: allowTillSem,
              attachment: !!fileUploadResponse
                ? fileUploadResponse?.attachmentPath
                : !!location.state?.attachment
                ? location.state?.attachment
                : "",
              remarks: remarks,
            },
          ],
        };
      } else if (permissionType == "Fine Waiver" && !location.state) {
        payload = {
          auid: auid,
          currentYear: studentAuidDetail?.current_year || null,
          currentSem: studentAuidDetail?.current_sem || null,
          permissionType: permissionType,
          totalDue: studentDues,
          concessionAmount: +studentFineConcession,
          tillDate: tillDate || "",
          file: !!fileUploadResponse
            ? fileUploadResponse?.attachmentPath
            : !!location.state?.file
            ? location.state?.file
            : "",
          remarks: remarks,
        };
      } else {
        if (auidOrFeeTemplate == "feeTemplate") {
          payload = {
            studentPermissionDTO: studentDetail
              .filter((obj) => !!obj.isSelected)
              .map((ele) => ({
                auid: ele.auid,
                studentName: ele.student_name,
                currentYear: ele.current_year,
                currentSem: ele.current_sem,
                tillDate: tillDate,
                permissionType: permissionType,
                attachment: !!fileUploadResponse
                  ? fileUploadResponse?.attachmentPath
                  : !!location.state?.attachment
                  ? location.state?.attachment
                  : "",
                remarks: remarks,
              })),
          };
        } else {
          payload = {
            studentPermissionDTO: [
              {
                auid: auid,
                studentName: studentAuidDetail?.student_name || "",
                currentYear: studentAuidDetail?.current_year || null,
                currentSem: studentAuidDetail?.current_sem || null,
                tillDate: tillDate || "",
                permissionType: permissionType,
                attachment: !!fileUploadResponse
                  ? fileUploadResponse?.attachmentPath
                  : !!location.state?.attachment
                  ? location.state?.attachment
                  : "",
                remarks: remarks,
              },
            ],
          };
        }
      }
      if (!!location.state) {
        let updateFinePayload = {
          auid: auid,
          currentYear: studentAuidDetail?.current_year || null,
          currentSem: studentAuidDetail?.current_sem || null,
          permissionType: permissionType,
          totalDue: studentDues,
          concessionAmount: +studentFineConcession,
          tillDate: tillDate || "",
          file: !!fileUploadResponse
            ? fileUploadResponse?.attachmentPath
            : !!location.state?.file
            ? location.state?.file
            : "",
          remarks: remarks,
        };
        if (location.state.permissionType == "Fine Waiver") {
          const res = await axios.put(
            `/api/student/updateFineConcessionByAuid`,
            updateFinePayload
          );
          if (res.status == 200 || res.status == 201) {
            actionAfterResponse("fine");
          }
        } else {
          let updatePayload = {
            auid: auid,
            studentName: studentAuidDetail?.student_name || "",
            currentYear: studentAuidDetail?.current_year || null,
            currentSem: studentAuidDetail?.current_sem || null,
            tillDate: tillDate || "",
            permissionType: permissionType,
            attachment: !!fileUploadResponse
              ? fileUploadResponse?.attachmentPath
              : !!location.state?.attachment
              ? location.state?.attachment
              : "",
            remarks: remarks,
          };

          const res = await axios.post(
            `/api/student/updateStudentForPermission`,
            updatePayload
          );
          if (res.status == 200 || res.status == 201) {
            actionAfterResponse("");
          }
        }
      } else {
        if (permissionType == "Fine Waiver") {
          const res = await axios.post(
            `/api/student/saveFineConcession`,
            payload
          );
          if (res.status == 200) {
            if (!!res.data.data) {
              setAlertMessage({
                severity: "error",
                message: res.data.data,
              });
              setAlertOpen(true);
              setLoading(false);
            } else {
              actionAfterResponse("fine");
            }
          }
        } else {
          const res = await axios.post(
            `/api/student/saveStudentForPermission`,
            payload
          );
          if (res.status == 200 || res.status == 201) {
            if (!!res.data.data) {
              setAlertMessage({
                severity: "error",
                message: res.data.data,
              });
              setAlertOpen(true);
              setLoading(false);
            } else {
              actionAfterResponse("");
            }
          }
        }
      }
    } catch (error) {
      if (!!error.response.data.data) {
        setAlertMessage({
          severity: "error",
          message: error.response
            ? error.response.data.data
            : "An error occured !!",
        });
      } else {
        setAlertMessage({
          severity: "error",
          message: error.response
            ? error.response.data.message
            : "An error occured !!",
        });
      }
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = (type) => {
    setLoading(false);
    navigate("/permission-index-partfee", { replace: true });
    setAlertMessage({
      severity: "success",
      message: `Permission successfully given to student !!`,
    });
    setAlertOpen(true);
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="permissionType"
              label="Permission Type"
              value={permissionType || ""}
              options={permissionList || []}
              handleChangeAdvance={handleChangeAdvance}
              disabled
              required
            />
          </Grid>
          {permissionType == "Attendance" && (
            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="auidOrFeeTemplate"
                label="Student Detail by auid or Fee Template"
                value={auidOrFeeTemplate}
                items={[
                  {
                    value: "auid",
                    label: "Auid",
                  },
                  {
                    value: "feeTemplate",
                    label: "Fee Template",
                  },
                ]}
                handleChange={handleChange}
                disabled={location.state}
              />
            </Grid>
          )}

          {permissionType != "Attendance" && (
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="auid"
                label="Auid"
                value={auid || ""}
                handleChange={handleChange}
                disabled={!!location.state}
                required
              />
            </Grid>
          )}

          {auidOrFeeTemplate == "auid" && permissionType == "Attendance" && (
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="auid"
                label="Auid"
                value={auid || ""}
                handleChange={handleChange}
                disabled={!!location.state}
                required
              />
            </Grid>
          )}

          {auidOrFeeTemplate == "feeTemplate" &&
            permissionType == "Attendance" && (
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="feeTemplate"
                  label="Fee Template"
                  value={feeTemplate || ""}
                  options={feeTemplateList || []}
                  handleChangeAdvance={handleChangeAdvance}
                  disabled={!!location.state}
                  required
                />
              </Grid>
            )}
          {(permissionType == "Examination" ||
            permissionType == "Fine Waiver" ||
            permissionType == "Attendance" ||
            permissionType == "Part Fee") && (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="tillDate"
                label="Till Date"
                value={tillDate || ""}
                handleChangeAdvance={handleChangeAdvance}
                minDate={
                  (new Date() && !location.state) ||
                  (location.state && location.state.tillDate)
                }
                required
              />
            </Grid>
          )}
          {permissionType == "Examination" && (
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="allowTillSem"
                label="Allow Till Sem"
                value={allowTillSem || ""}
                options={allowTillSemList || []}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
          {(permissionType == "Examination" ||
            permissionType == "Fine Waiver") && (
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="studentDues"
                label={permissionType == "Fine Waiver" ? "Total Fine" : "Dues"}
                value={studentDues ?? studentDues}
                disabled
              />
            </Grid>
          )}
          {permissionType == "Fine Waiver" && (
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="studentFineConcession"
                label="Fine Concession"
                value={studentFineConcession ?? studentFineConcession}
                handleChange={handleChange}
                type="number"
              />
            </Grid>
          )}
          {permissionType == "Examination" && (
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="permittedBy"
                label="Permitted By"
                value={permittedBy || ""}
                options={permittedByList || []}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={remarks || ""}
              handleChange={handleChange}
              required
              multiline
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomFileInput
              name="attachment"
              label="Pdf File Attachment"
              helperText="PDF - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              checks={checkAttachment.attachment}
              errors={errorAttachmentMessages.attachment}
              required
            />
          </Grid>
          <Grid
            item
            align="right"
            xs={12}
            md={permissionType != "Fine Waiver" ? 12 : 8}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={
                loading ||
                (permissionType == "Part Fee" &&
                  !requiredFieldsWithoutExamValid()) ||
                (permissionType == "Examination" &&
                  !requiredFieldsWithExamValid()) ||
                (permissionType == "Fine Waiver" &&
                  !requiredFieldsWithFineWaiverValid()) ||
                (!!attachment && !isAttachmentValid()) ||
                (permissionType == "Attendance" && !auidOrFeeTemplate) ||
                (permissionType == "Attendance" &&
                  auidOrFeeTemplate == "auid" &&
                  !auid) ||
                (permissionType == "Attendance" &&
                  auidOrFeeTemplate == "auid" &&
                  !isAttachmentValid() &&
                  !location.state?.attachment) ||
                (permissionType == "Attendance" &&
                  auidOrFeeTemplate == "feeTemplate" &&
                  !feeTemplate) ||
                (permissionType == "Attendance" &&
                  auidOrFeeTemplate == "feeTemplate" &&
                  !isAttachmentValid() &&
                  !location.state?.attachment)
              }
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{!!location.state ? "Update" : "Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
      {!!auid &&
        !!studentAuidDetail &&
        (permissionType != "Attendance" || auidOrFeeTemplate == "auid") && (
          <Grid item xs={12} md={12} mt={2}>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Card>
                  <CardHeader
                    title="Student Details"
                    titleTypographyProps={{
                      variant: "subtitle2",
                    }}
                    sx={{
                      backgroundColor: "tableBg.main",
                      color: "tableBg.textColor",
                      textAlign: "center",
                      padding: 1,
                    }}
                  />
                  <CardContent>
                    <Grid container columnSpacing={2} rowSpacing={1}>
                      <DisplayContent
                        label="AUID"
                        value={studentAuidDetail?.auid}
                      />
                      <DisplayContent
                        label="Student Name"
                        value={studentAuidDetail?.student_name}
                      />
                      <DisplayContent
                        label="USN"
                        value={studentAuidDetail?.usn ?? "-"}
                      />
                      <DisplayContent
                        label="Father Name"
                        value={studentAuidDetail?.father_name}
                      />
                      <DisplayContent
                        label="DOA"
                        value={moment(
                          studentAuidDetail?.date_of_admission
                        ).format("DD-MM-YYYY")}
                      />
                      <DisplayContent
                        label="Program"
                        value={`${studentAuidDetail?.program_short_name} - ${studentAuidDetail?.program_specialization_short_name}`}
                      />
                      <DisplayContent
                        label="Current Year/Sem"
                        value={`${studentAuidDetail?.current_year}/${studentAuidDetail?.current_sem}`}
                      />
                      <DisplayContent
                        label="Academic Batch"
                        value={studentAuidDetail?.academic_batch}
                      />

                      <DisplayContent
                        label="Fee Template Name"
                        value={studentAuidDetail?.fee_template_name || "-"}
                      />
                      <DisplayContent
                        label="Admission Category"
                        value={`${studentAuidDetail?.fee_admission_category_short_name} - ${studentAuidDetail?.fee_admission_sub_category_short_name}`}
                      />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

      {!!studentDetail &&
        studentDetail.length > 0 &&
        auidOrFeeTemplate == "feeTemplate" && (
          <GridIndex rows={studentDetail} columns={columns} />
        )}
    </Box>
  );
};

export default StudentPermissionPartFee;
