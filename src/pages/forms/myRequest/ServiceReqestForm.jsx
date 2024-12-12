import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import DatePicker from "react-multi-date-picker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CustomMonthYearPicker from "../../../components/Inputs/CustomMonthYearPicker";
import moment from "moment";
const CheckboxAutocomplete = lazy(() =>
  import("../../../components/Inputs/CheckboxAutocomplete")
);


const yearSemLists = [
  { label: "Sem 1", value: "Sem 1" },
  { label: "Sem 2", value: "Sem 2" },
  { label: "Sem 3", value: "Sem 3" },
  { label: "Sem 4", value: "Sem 4" },
  { label: "Sem 5", value: "Sem 5" },
  { label: "Sem 6", value: "Sem 6" },
  { label: "Sem 7", value: "Sem 7" },
  { label: "Sem 8", value: "Sem 8" },
  { label: "Sem 9", value: "Sem 9" },
  { label: "Sem 10", value: "Sem 10" },
  { label: "Sem 11", value: "Sem 11" },
  { label: "Sem 12", value: "Sem 12" }
];

const initialValues = {
  complaintType: null,
  blockId: null,
  schoolId: null,
  complaintDetails: "",
  floorAndExtension: "",
  fileName: "",
  date: null,
  fromDate: null,
  toDate: null,
  programList: [],
  yearSemList: yearSemLists,
  programSpecilization: "",
  yearSem: ""
};
let requiredFields = ["complaintType", "complaintDetails"];

function ServiceRequestForm() {
  const [values, setValues] = useState(initialValues);
  const [serviceTypeOptions, setServiceTypeOtions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [deptDetail, setDeptDetail] = useState(null);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [loading, setLoading] = useState(false);
  const [descriptionMaxLength, setDescriptionMaxLength] = useState(200);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
  const empId = JSON.parse(sessionStorage.getItem("empId"));

  const checks = {
    complaintDetails: [values.complaintDetails !== ""],
    complaintType: [values.complaintType !== null],
    fileName: [
      values.fileName,
      values.fileName && values.fileName.size < 2000000,
      values.fileName &&
      (
        values.fileName.name.endsWith(".pdf") ||
        values.fileName.name.endsWith(".PDF"))
      || (values.fileName.name?.endsWith(".jpg") ||
        values.fileName.name?.endsWith(".JPG")) || (values.fileName.name?.endsWith(".jpeg") ||
          values.fileName.name?.endsWith(".JPEG")) || (values.fileName.name?.endsWith(".png") ||
            values.fileName.name?.endsWith(".PNG")),
    ],
  };

  const errorMessages = {
    complaintType: ["This field id required"],
    complaintDetails: ["This field id required"],
    fileName: [
      "This field is requied",
      "File should be less than 2MB",
      "Please upload pdf || png || jpg || jpeg",
    ],
  };

  useEffect(() => {
    !!location.state && setFormValue(location.state);
    getDept(JSON.parse(localStorage.getItem("ticketDeptId"))?.key);
    getBlockData();
    getSchoolData();
  }, []);

  const setFormValue = (formValue) => {
    setValues((prevValue) => ({
      ...prevValue,
      complaintType: formValue.serviceTypeId || null,
      blockId: formValue || null,
      schoolId: formValue || null,
      complaintDetails: formValue.complaintDetails || "",
      floorAndExtension: formValue.floorAndExtension || "",
      programSpecilization: location.state.program_id ? [location.state.program_id][0].split(',')
        .map(num => Number(num.trim())) : "",
      yearSem: formValue.year_sem,
      fromDate: formValue.from_date,
      toDate: formValue.to_date
    }))
  };

  const getDept = async (deptId) => {
    try {
      if (deptId) {
        const res = await axios.get(`/api/getActiveDepartmentAssignmentBasedOnTag`);
        const list = res.data.data.length > 0 && res.data.data.find(ele => ele.id == deptId);
        setDeptDetail(list);
        setCrumbs([{ name: "Service Request", link: "/ServiceRequestDeptWise" },
        { name: (list?.dept_name)?.toUpperCase() },
        { name: location.state ? "Update" : "Create" }
        ]);
        getServiceTypeData(list?.id);
        setDeptName(list?.dept_name);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getServiceTypeData = async (deptId) => {
    await axios
      .get(`/api/ServiceType/getAllServiceByDeptTag/${deptId}`)
      .then((res) => {
        setDeptName(res.data.data[0].dept_name);
        const serviceTypeData = [];
        res.data.data.forEach((obj) => {
          serviceTypeData.push({
            label: obj.serviceTypeName,
            value: obj.id,
            is_attachment: obj.is_attachment,
          });
        });
        setServiceTypeOtions(serviceTypeData);
      })
      .catch((err) => console.error(err));
  };

  const getBlockData = async () => {
    await axios
      .get(`/api/blocks`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.block_id,
            label: obj.block_name,
            school_id: obj.school_id,
          });
        });
        setBlockOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const SchoolData = [];
        res.data.data.forEach((obj) => {
          SchoolData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(SchoolData);
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpecilizationData = async (empId) => {
    await axios
      .get(`/api/academic/getAllActiveProgramDetails/${empId}`)
      .then((res) => {
          setValues((prevState) => ({
            ...prevState,
            programList: res.data.data.map((ele) => ({ label: ele.specialization_with_program, value: ele.program_specialization_id }))
          }))
      })
      .catch((err) => console.error(err));
  };

 

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "complaintDetails") {
      if (value.length <= descriptionMaxLength) {
        setValues((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDatePicker = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const setFormFieldNull = () => {
    setValues((prev) => ({
      ...prev,
      date: null,
      fromDate: null,
      toDate: null,
      programSpecilization: "",
      yearSem: "",
      complaintDetails: "",
      floorAndExtension: ""
    }))
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name == "complaintType") {
      setFormFieldNull();
    if (empId) getProgramSpecilizationData(empId);

    }
    if (name === "blockId") {
      const schoolId = blockOptions.find((obj) => obj.value === newValue);
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        ["schoolId"]: schoolId?.school_id,
      }));
    }

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleChangeDate = async (_, newValue) => {
    setValues((prev) => ({
      ...prev,
      ["dateValue"]: newValue,
    }));
  };

  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value)
    }));
  };
  const handleSelectNone = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    if (location.state) {
      setLoading(true);
      try {
        let payload = {
          complaintDetails: values.complaintDetails,
          attachment_path: values.fileName?.name
        }
        const res = await axios.patch(`api/Maintenance/serviceRequest/${location.state.serviceTicketId}`, payload);
        if (res.status == 200 || res.status == 201) {
          const id = res.data.data.id
          if (values.fileName) {
            try {
              const dataArray = new FormData();
              dataArray.append("id", id);
              dataArray.append("file", values.fileName)
              const res = await axios.post(`/api/Maintenance/maintenanceUploadFile`, dataArray);
              if (res.status == 200 || res.status == 201) {
                setLoading(false);
                setAlertMessage({
                  severity: "success",
                  message: `Service request updated successfully!`,
                });
                navigate("/ServiceRequestDeptWise", { replace: true });
              }
            } catch (error) {
              setLoading(false);
              console.log("error", error)
            }
          } else {
            setLoading(false);
            navigate("/ServiceRequestDeptWise", { replace: true });
          }
        }
      } catch (error) {
        setLoading(false);
        console.log("error", error)
      }
    } else {
      if (!requiredFieldsValid()
        || ((deptName?.toLowerCase().includes("human resource") && values.complaintType == 1 ||
          values.complaintType == 3) && !values?.dateValue?.validatedValue?.length) ||
        (deptName?.toLowerCase().includes("human resource") && values.complaintType == 2 && !values?.date) ||
        (deptName?.toLowerCase().includes("erp") && (values.complaintType == 5 || values.complaintType == 8 || values.complaintType == 9 || values.complaintType == 10 || values.complaintType == 11) && (!values?.fromDate || !values.toDate))) {
        setAlertMessage({
          severity: "error",
          message: "Please fill all fields",
        });
        setAlertOpen(true);
      } else {
        setLoading(true);
        const temp = {};
        temp.active = true;
        temp.floorAndExtension = values.floorAndExtension;
        temp.complaintDetails = values.complaintDetails;
        temp.attendedBy = null;
        temp.userId = userId;
        temp.date = (deptName?.toLowerCase().includes("human resource") && values.complaintType == 1 ||
          values.complaintType == 3) ?
          values?.dateValue?.validatedValue?.map(ele => moment(ele)?.format("DD-MM-YYYY"))?.join(", ") :
          (deptName?.toLowerCase().includes("human resource") && values.complaintType == 2) ?
            moment(values.date)?.format("MM-YYYY") : (deptName?.toLowerCase().includes("erp") &&
              (values.complaintType == 6) || (values.complaintType == 12)) ? values.date : null;
        temp.from_date = values.fromDate;
        temp.to_date = values.toDate;
        temp.program_id = values.programSpecilization ? values.programSpecilization.join(",") : null;
        temp.year_sem = values.yearSem;
        temp.serviceTypeId = values.complaintType;
        temp.complaintStage = "";
        temp.complaintStatus = "PENDING";
        temp.deptId = deptDetail?.id;
        temp.remarks = values.remarks;
        temp.purchaseNeed = null;
        temp.dateOfAttended = null;
        temp.complaintAttendedBy = null;
        temp.dateOfClosed = null;
        temp.instituteId = values.schoolId;
        temp.branchId = null;
        temp.blockId = values.blockId;
        await axios
          .post(`/api/Maintenance`, temp)
          .then(async (res) => {
            if (res.status === 200 || res.status === 201) {
              if (values.fileName !== "") {
                setLoading(true);
                const dataArray = new FormData();
                dataArray.append("id", res.data.data.id);
                dataArray.append("file", values.fileName)
                await axios
                  .post(`/api/Maintenance/maintenanceUploadFile`, dataArray)
                  .then((res) => {
                    navigate("/ServiceRequestDeptWise", { replace: true });
                  });
              } else {
                setLoading(false);
                navigate("/ServiceRequestDeptWise", { replace: true });
              }
              setLoading(false);
              setAlertMessage({
                severity: "success",
                message: `Service request created successfully!`,
              });
            } else {
              setLoading(false);
              setAlertMessage({
                severity: "error",
                message: res.data ? res.data.message : "Error Occured",
              });
            }
            setAlertOpen(true);
          })
          .catch((error) => {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: error.response ? error.response.data.message : "Error",
            });
            setAlertOpen(true);
          });
      }
    }
  };

  const currentDate = new Date();
  const nextDate = new Date(currentDate.getTime());
  nextDate.setHours(0, 0, 0, 0);

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="complaintType"
              label="Service Type"
              value={values.complaintType}
              options={serviceTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={location.state}
              checks={checks.complaintType}
              errors={errorMessages.complaintType}
              required
            />
          </Grid>
          {(deptName?.toLowerCase().includes("erp") && values.complaintType == 8 || values.complaintType == 11 ||
            values.complaintType == 12) && <Grid item xs={12} md={4}>
              <CheckboxAutocomplete
                name="programSpecilization"
                label="Program Specialization"
                value={values.programSpecilization}
                options={values.programList}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                disabled={location.state}
                required
              />
            </Grid>}
          {(deptName?.toLowerCase().includes("erp") && values.complaintType == 8 || values.complaintType == 11 ||
            values.complaintType == 12) && <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="yearSem"
                label="Year/Sem"
                value={values.yearSem}
                options={values.yearSemList}
                handleChangeAdvance={handleChangeAdvance}
                disabled={location.state}
                required
              />
            </Grid>}
          {!location.state && deptName?.toLowerCase().includes("human resource") && (values.complaintType == 1 || values.complaintType == 3) && <Grid item xs={12} md={3} mr={3}>
            <DatePicker
              className="blue"
              inputClass="custom-input"
              multiple={true}
              format="YYYY-MM-DD"
              name="date"
              title="Date"
              placeholder={(deptName?.toLowerCase().includes("human resource") && values.complaintType == 3) ? "Select Date" : "Select Issue Date"}
              value={values.date}
              onChange={handleChangeDate}
              maxDate={(deptName?.toLowerCase().includes("human resource") && values.complaintType != 3) && new Date()}
              required
              plugins={[<DatePanel />]}
            />
          </Grid>}

          {!location.state && (deptName?.toLowerCase().includes("human resource") && values.complaintType == 2) && <Grid item xs={12} md={3} mr={3}>
            <CustomMonthYearPicker
              name="date"
              label="Select Date"
              maxDate={new Date()}
              value={values.date}
              handleChangeAdvance={handleDatePicker}
              required
            />
          </Grid>}

          {!location.state && (deptName?.toLowerCase().includes("erp") && values.complaintType == 6 || values.complaintType == 12) && <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="date"
              label="Select Date"
              value={values.date}
              handleChangeAdvance={handleChangeAdvance}
              required
              helperText=""
            />
          </Grid>}

          {(deptName?.toLowerCase().includes("erp") && (values.complaintType == 5 || values.complaintType == 8 || values.complaintType == 9 || values.complaintType == 10 || values.complaintType == 11)) && <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="fromDate"
              label="From Date"
              value={values.fromDate}
              handleChangeAdvance={handleChangeAdvance}
              disabled={location.state}
              required
              helperText=""
            />
          </Grid>}
          {(deptName?.toLowerCase().includes("erp") && (values.complaintType == 5 || values.complaintType == 8 || values.complaintType == 9 || values.complaintType == 10 || values.complaintType == 11)) && <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="toDate"
              label="To Date"
              value={values.toDate}
              handleChangeAdvance={handleChangeAdvance}
              required
              minDate={values.fromDate}
              disabled={!values.fromDate || location.state}
              helperText=""
            />
          </Grid>}
          {location.state && location.state.date && <Grid item xs={12} md={3}>
            <CustomTextField
              name="date"
              label={(deptName?.toLowerCase().includes("human resource") && values.complaintType == 1) ? "Issue Date" : "Date"}
              value={location.state.date}
              disabled={location.state}
            />
          </Grid>}

          {deptName?.toLowerCase().includes("system") ||
            deptName?.toLowerCase().includes("maintainence") ||
            deptName?.toLowerCase().includes("house keeping") ? (
            <>
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="blockId"
                  label="Block"
                  value={values.blockId}
                  options={blockOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  disabled
                  required
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="complaintDetails"
              label={(deptName?.toLowerCase().includes("erp") && values.complaintType == 5 || values.complaintType == 8
                || values.complaintType == 10 || values.complaintType == 11 || values.complaintType == 12) ? "Description" :
                (deptName?.toLowerCase().includes("erp") && values.complaintType == 9) ? "Event" :
                  (deptName?.toLowerCase().includes("human resource") && values.complaintType == 1) ? "Issue Details" :
                    "Details"}
              value={values.complaintDetails}
              handleChange={handleChange}
              checks={checks.complaintDetails}
              errors={errorMessages.complaintDetails}
              required
            />
            {values.complaintDetails && <Typography variant="body2" color="error">Remaining characters: {descriptionMaxLength - values.complaintDetails.length}</Typography>}
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="floorAndExtension"
              label="Extension No."
              value={values.floorAndExtension}
              disabled={location.state}
              handleChange={handleChange}
            />
          </Grid>

          {values.complaintType ? (
            <Grid item xs={12} md={3} align="right">
              <CustomFileInput
                name="fileName"
                label="PDF or PNG or JPG or JPEG"
                file={values.fileName}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.fileName}
                errors={errorMessages.fileName}
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={!requiredFieldsValid()}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{location.state ? "Update" : "Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ServiceRequestForm;
