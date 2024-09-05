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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import FormWrapper from "../../../components/FormWrapper.jsx";
import moment from "moment";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
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
  //   { label: "Fine Waiver", value: "Fine Waiver" },
];

const initialState = {
  permissionType: "Attendance",
  permissionList: permissionLists,
  auid: "",
  tillDate: "",
  allowTillSem: "",
  studentDues: "",
  permittedBy: "",
  remarks: "",
  attachment: "",
  loading: false,
  studentDetail: null,
  allowTillSemList: [],
  permittedByList: [],
};

const requiredFieldsWithoutExam = ["auid", "tillDate", "remarks"];

const requiredFieldsWithExam = [
  "auid",
  "allowTillSem",
  "studentDues",
  "permittedBy",
  "remarks",
];

const PermissionForm = () => {
  const [
    {
      permissionType,
      permissionList,
      auid,
      tillDate,
      allowTillSem,
      permittedBy,
      studentDues,
      remarks,
      attachment,
      loading,
      studentDetail,
      allowTillSemList,
      permittedByList,
    },
    setState,
  ] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Permission", link: "/PermissionIndex" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
    !!location.state && setFormField();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      !!auid && permissionType == "Examination" && getStudentDetailByAuid(auid);
    }, 1500);
    return () => {
      clearTimeout(handler);
    };
  }, [auid]);

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
    }));
  };

  const getStudentDetailByAuid = async (studentAuid) => {
    try {
      const res = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${studentAuid}`
      );
      if (res.status === 200 || res.status === 201) {
        if (permissionType === "Examination")
          getAllowTillSemList(res.data.data[0]);
        setState((prevState) => ({
          ...prevState,
          studentDetail: res.data.data[0],
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

  const handleChangeAdvance = (name, newValue) => {
    if (name === "permissionType") {
      setState((prev) => ({
        ...prev,
        [name]: newValue,
        auid: "",
        tillDate: "",
        remarks: "",
        allowTillSem: "",
        studentDues: "",
        permittedBy: "",
      }));
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

  const checkWithoutExam = {
    auid: [auid !== ""],
    tillDate: [tillDate !== ""],
    remarks: [remarks !== ""],
  };

  const checkWithExam = {
    auid: [auid !== null],
    allowTillSem: [allowTillSem !== ""],
    studentDues: [studentDues !== ""],
    permittedBy: [permittedBy !== ""],
    remarks: [remarks !== ""],
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
      if (permissionType != "Examination") {
        payload = {
          auid: auid,
          studentName: studentDetail?.student_name || "",
          currentYear: studentDetail?.current_year || null,
          currentSem: studentDetail?.current_sem || null,
          permissionType: permissionType,
          tillDate: tillDate || "",
          attachment: !!fileUploadResponse
            ? fileUploadResponse?.attachmentPath
            : "",
          remarks: remarks,
        };
      } else {
        payload = {
          auid: auid,
          studentName: studentDetail?.student_name || "",
          currentYear: studentDetail?.current_year || null,
          currentSem: studentDetail?.current_sem || null,
          permissionType: permissionType,
          totalDue: studentDues,
          permittedBy: permittedBy,
          allowSem: allowTillSem,
          attachment: !!fileUploadResponse
            ? fileUploadResponse?.attachmentPath
            : "",
          remarks: remarks,
        };
      }
      if (location.state.studentPermissionId) {
        const res = await axios.post(
          `/api/student/updateStudentForPermission`,
          payload
        );
        if (res.status == 200 || res.status == 201) {
          actionAfterResponse();
        }
      } else {
        const res = await axios.post(
          `/api/student/saveStudentForPermission?studentId=${studentDetail?.id}`,
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
            actionAfterResponse();
          }
        }
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

  const actionAfterResponse = () => {
    setLoading(false);
    navigate("/PermissionIndex", { replace: true });
    setAlertMessage({
      severity: "success",
      message: `Permission successfully given to student !!`,
    });
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
              disabled={!!location.state}
              required
            />
          </Grid>
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
          {permissionType !== "Examination" && (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="tillDate"
                label="Till Date"
                value={tillDate || ""}
                handleChangeAdvance={handleChangeAdvance}
                minDate={new Date()}
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
          {permissionType == "Examination" && (
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="studentDues"
                label="Dues"
                value={studentDues || ""}
                handleChange={handleChange}
                required
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
              rows={4}
            />
          </Grid>
          <Grid item xs={12} md={4} mt={-3}>
            <CustomFileInput
              name="attachment"
              label="Pdf File Attachment"
              helperText="PDF - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              required
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={permissionType == "Examination" ? 8 : 4}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={
                loading ||
                (permissionType === "Examination" &&
                  !requiredFieldsWithExamValid()) ||
                (permissionType !== "Examination" &&
                  !requiredFieldsWithoutExamValid())
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
      {!!auid && !!studentDetail && (
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
                    <DisplayContent label="AUID" value={studentDetail?.auid} />
                    <DisplayContent
                      label="Student Name"
                      value={studentDetail?.student_name}
                    />
                    <DisplayContent
                      label="USN"
                      value={studentDetail?.usn ?? "-"}
                    />
                    <DisplayContent
                      label="Father Name"
                      value={studentDetail?.father_name}
                    />
                    <DisplayContent
                      label="DOA"
                      value={moment(studentDetail?.date_of_admission).format(
                        "DD-MM-YYYY"
                      )}
                    />
                    <DisplayContent
                      label="Program"
                      value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                    />
                    <DisplayContent
                      label="Current Year/Sem"
                      value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                    />
                    <DisplayContent
                      label="Academic Batch"
                      value={studentDetail?.academic_batch}
                    />

                    <DisplayContent
                      label="Fee Template Name"
                      value={studentDetail?.fee_template_name || "-"}
                    />
                    <DisplayContent
                      label="Admission Category"
                      value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PermissionForm;
