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
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
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
  complaintType: "",
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
  programId: "",
  programSpecilizationId: "",
  yearSem: ""
};
let requiredFields = ["complaintType", "complaintDetails"];
const previousPath = localStorage.getItem("previousPath") || "";
const eventId = localStorage.getItem("event_id") || "";

function ServiceRequestForm() {
  const [values, setValues] = useState(initialValues);
  const [serviceTypeOptions, setServiceTypeOtions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [deptDetail, setDeptDetail] = useState(null);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [serviceTypeName, setServiceTypeName] = useState("");
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
    date: [values.date !== null],
    fromDate: [values.fromDate !== null],
    toDate: [values.toDate !== null],
    programSpecilizationId: [values.programSpecilizationId !== ""],
    programId: [values.programId !== ""],
    yearSem: [values.yearSem !== ""],
    fileName: [
      values.fileName,
      values.fileName && values.fileName.size < 2000000,
      values.fileName &&
      (
        values.fileName?.name.endsWith(".pdf") ||
        values.fileName?.name.endsWith(".PDF"))
      || (values.fileName?.name?.endsWith(".jpg") ||
        values.fileName?.name?.endsWith(".JPG")) || (values.fileName?.name?.endsWith(".jpeg") ||
          values.fileName?.name?.endsWith(".JPEG")) || (values.fileName?.name?.endsWith(".png") ||
            values.fileName?.name?.endsWith(".PNG")),
    ],
  };

  const errorMessages = {
    complaintType: ["This field is required"],
    complaintDetails: ["This field is required"],
    date: ["This field is required"],
    fromDate: ["This field is required"],
    toDate: ["This field is required"],
    programSpecilization: ["This field is required"],
    yearSem: ["This field is required"],
    fileName: [
      "This field is required",
      "File should be less than 2MB",
      "Please upload pdf || png || jpg || jpeg",
    ],
  };

  useEffect(() => {
    if (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") {
      getAllServiceTypeData();
      setCrumbs([
        { name: "EventMaster", link: previousPath },
      ]);
      return;
    }
    !!location.state && setFormValue(location.state);
    getDept(JSON.parse(localStorage.getItem("ticketDeptId"))?.key);
    getBlockData();
    getSchoolData();
    !(location.state) ? getProgramSpecilizationData(empId, null) : getProgramSpecilizationData(empId, location.state?.serviceTypeId);
  }, []);

  const setFormValue = (formValue) => {
    setServiceTypeName(formValue.serviceTypeName);
    setValues((prevValue) => ({
      ...prevValue,
      complaintType: formValue.serviceTypeId || null,
      blockId: formValue || null,
      schoolId: formValue || null,
      complaintDetails: formValue.complaintDetails || "",
      floorAndExtension: formValue.floorAndExtension || "",
      yearSem: formValue.year_sem,
      date: formValue.date,
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
        if (previousPath?.toLowerCase() !== "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") getServiceTypeData(list?.id);
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
  const getAllServiceTypeData = async () => {
    try {
      if (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") {
        const res = await axios.get(`/api/ServiceType/getAllActiveServiceTypeOnlyevent`);

        if (res.data?.data?.length) {
          const serviceTypeData = res?.data?.data?.map((obj) => ({
            label: obj?.serviceTypeName,
            value: obj?.id,
            is_attachment: obj.is_attachment,
          }));

          setServiceTypeOtions(serviceTypeData);
        }

      }
    } catch (err) {
      console.error("Error fetching service type data:", err);
    }
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

  const getProgramSpecilizationData = async (empId, complaintType) => {
    if (deptName?.toLowerCase().includes("erp") && (serviceTypeOptions.find((ele) => ele.value == complaintType)?.label)?.toLowerCase().includes("exam fee window")
      || (serviceTypeOptions.find((ele) => ele.value == complaintType)?.label)?.toLowerCase().includes("revaluation/photo copy")) {
      await axios
        .get(`/api/academic/getAllActiveProgramDetailsUnique/${empId}`)
        .then((res) => {
          setValues((prevState) => ({
            ...prevState,
            programList: res.data.data.map((ele) => ({ label: ele.program_short_name, value: ele.program_id }))
          }))
          if (!!location.state) {
            setValues((prevValue) => ({
              ...prevValue,
              programId: location.state.program_id ? [location.state.program_id][0].split(',')
                .map(num => Number(num.trim())) : "",
            }))
          }
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(`/api/academic/getAllActiveProgramDetails/${empId}`)
        .then((res) => {
          setValues((prevState) => ({
            ...prevState,
            programList: res.data.data.map((ele) => ({ label: ele.specialization_with_program, value: ele.program_specialization_id }))
          }))
          if (!!location.state) {
            setValues((prevValue) => ({
              ...prevValue,
              programSpecilizationId: location.state.program_specialization_id ? [location.state.program_specialization_id][0].split(',')
                .map(num => Number(num.trim())) : "",
            }))
          }
        })
        .catch((err) => console.error(err));
    }
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
      programSpecilizationId: "",
      programId: "",
      yearSem: "",
      complaintDetails: "",
      floorAndExtension: "",
      programList: [],
      fileName: ""
    }))
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name == "complaintType") {
      setFormFieldNull();
      if (empId) getProgramSpecilizationData(empId, newValue);
      setServiceTypeName(serviceTypeOptions.find((ele) => ele.value == newValue)?.label);
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
        const res = await axios.patch((previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") ? `/api/Maintenance/createMaintenance/${location.state.serviceTicketId}` : `api/Maintenance/serviceRequest/${location.state.serviceTicketId}`, payload);
        if (res.status == 200 || res.status == 201) {
          const id = (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") ? res.data.data[0].id : res.data.data.id 
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
                if (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") {
                  navigate(previousPath, { replace: true });
                  return;
                }
                navigate("/ServiceRequestDeptWise", { replace: true });
              }
            } catch (error) {
              setLoading(false);
              console.log("error", error)
            }
          } else {
            setLoading(false);
            if (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") {
              navigate(previousPath, { replace: true });
              return;
            }
            navigate("/ServiceRequestDeptWise", { replace: true });
          }
        }
      } catch (error) {
        setLoading(false);
        console.log("error", error)
      }
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.floorAndExtension = values.floorAndExtension;
      temp.complaintDetails = values.complaintDetails;
      temp.attendedBy = null;
      temp.userId = userId;
      temp.date = (deptName?.toLowerCase().includes("human resource") && (serviceTypeName?.toLowerCase().includes("biometric/attendance") ||
        (serviceTypeName?.toLowerCase().includes("leaves")))) ?
        values?.dateValue?.validatedValue?.map(ele => moment(ele)?.format("DD-MM-YYYY"))?.join(", ") :
        (deptName?.toLowerCase().includes("human resource") && (serviceTypeName?.toLowerCase().includes("payslip"))) ?
          moment(values.date)?.format("MM-YYYY") : (deptName?.toLowerCase().includes("erp") &&
            (serviceTypeName?.toLowerCase().includes("lesson plan")) || (serviceTypeName?.toLowerCase().includes("class commencement"))) ? values.date : null;
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.program_id = values.programId ? values.programId.join(",") : null;
      temp.program_specialization_id = values.programSpecilizationId ? values.programSpecilizationId.join(",") : null;
      temp.year_sem = values.yearSem && Array.isArray(values.yearSem) ? values.yearSem.join(",") : values.yearSem;
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
      if (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") {
        temp.event_status = true;
        temp.event_id = Number(eventId)
        temp.serviceRequests = values.complaintType.map((obj) => ({ ...temp, serviceTypeId: obj }));
      }

      await axios
        .post((previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") ? `/api/Maintenance/createMaintenance` : `/api/Maintenance`, (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") ? temp.serviceRequests : temp)
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            const id = (previousPath.toLowerCase() === "/eventmaster/events" || previousPath.toLowerCase() === "/eventmaster/events-user") ? res.data.data[0].id : res.data.data.id 
            if (values.fileName !== "") {
              setLoading(true);
              const dataArray = new FormData();
              dataArray.append("id", id);
              dataArray.append("file", values.fileName)
              await axios
                .post(`/api/Maintenance/maintenanceUploadFile`, dataArray)
                .then((res) => {
                  if (previousPath.toLowerCase() === "/eventmaster/events"|| previousPath.toLowerCase() === "/eventmaster/events-user") {
                    navigate(previousPath, { replace: true });
                    return;
                  }
                  navigate("/ServiceRequestDeptWise", { replace: true });
                });
            } else {
              setLoading(false);
              if (previousPath.toLowerCase() === "/eventmaster/events"|| previousPath.toLowerCase() === "/eventmaster/events-user") {
                navigate(previousPath, { replace: true });
                return;
              }
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
          <Grid item xs={12} md={(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("exam fee window")) || (serviceTypeName?.toLowerCase().includes("revaluation/photo copy"))) ? 4 : 3}>

            {(previousPath.toLowerCase() === "/eventmaster/events"|| previousPath.toLowerCase() === "/eventmaster/events-user") ? <CheckboxAutocomplete
              name="complaintType"
              label="Service Type"
              value={values.complaintType}
              options={serviceTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              checks={checks.complaintType}
              errors={errorMessages.complaintType}
              required
            /> :
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
              />}
          </Grid>
          {(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("exam fee window")) || (serviceTypeName?.toLowerCase().includes("revaluation/photo copy"))) && <Grid item xs={12} md={4}>
            <CheckboxAutocomplete
              name="programId"
              label="Program"
              value={values.programId}
              options={values.programList}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              disabled={location.state}
              checks={checks.programId}
              errors={errorMessages.programId}
              required
            />
          </Grid>}
          {(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("feedback window")) || (serviceTypeName?.toLowerCase().includes("class commencement"))) && <Grid item xs={12} md={4}>
            <CheckboxAutocomplete
              name="programSpecilizationId"
              label="Program Specialization"
              value={values.programSpecilizationId}
              options={values.programList}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              disabled={location.state}
              checks={checks.programSpecilizationId}
              errors={errorMessages.programSpecilizationId}
              required
            />
          </Grid>}
          {(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("feedback window")) || (serviceTypeName?.toLowerCase().includes("class commencement"))) && <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="yearSem"
              label="Year/Sem"
              value={values.yearSem}
              options={values.yearSemList}
              handleChangeAdvance={handleChangeAdvance}
              disabled={location.state}
              checks={checks.yearSem}
              errors={errorMessages.yearSem}
              required
            />
          </Grid>}
          {(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("exam fee window")) || (serviceTypeName?.toLowerCase().includes("revaluation/photo copy"))) && <Grid item xs={12} md={4}>
            <CheckboxAutocomplete
              name="yearSem"
              label="Year/Sem"
              value={values.yearSem}
              options={values.yearSemList}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll} s
              handleSelectNone={handleSelectNone}
              disabled={location.state}
              checks={checks.yearSem}
              errors={errorMessages.yearSem}
              required
            />
          </Grid>}
          {!location.state && deptName?.toLowerCase().includes("human resource") && (serviceTypeName?.toLowerCase().includes("biometric/attendance") || (serviceTypeName?.toLowerCase().includes("leaves"))) && <Grid item xs={12} md={3} mr={3}>
            <DatePicker
              className="blue"
              inputClass="custom-input"
              multiple={true}
              format="YYYY-MM-DD"
              name="date"
              title="Date"
              placeholder={(deptName?.toLowerCase().includes("human resource") && (serviceTypeName?.toLowerCase().includes("leaves"))) ? "Select Date" : "Select Issue Date"}
              value={values.date}
              onChange={handleChangeDate}
              maxDate={(deptName?.toLowerCase().includes("human resource") && !(serviceTypeName?.toLowerCase().includes("leaves"))) && new Date()}
              required
              plugins={[<DatePanel />]}
            />
          </Grid>}

          {!location.state && (deptName?.toLowerCase().includes("human resource") && (serviceTypeName?.toLowerCase().includes("payslip"))) && <Grid item xs={12} md={3} mr={3}>
            <CustomMonthYearPicker
              name="date"
              label="Select Date"
              maxDate={new Date()}
              value={values.date}
              handleChangeAdvance={handleDatePicker}
              required
            />
          </Grid>}

          {(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("lesson plan")) || (serviceTypeName?.toLowerCase().includes("class commencement"))) && <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="date"
              label="Select Date"
              value={values.date}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.date}
              errors={errorMessages.date}
              disabled={location.state}
              required
            />
          </Grid>}

          {(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("time table")) ||
            (serviceTypeName?.toLowerCase().includes("exam fee window")) ||
            (serviceTypeName?.toLowerCase().includes("payment link")) ||
            (serviceTypeName?.toLowerCase().includes("revaluation/photo copy")) ||
            (serviceTypeName?.toLowerCase().includes("feedback window"))
          ) && <Grid item xs={12} md={3}>
              <CustomDatePicker
                name="fromDate"
                label="From Date"
                value={values.fromDate}
                handleChangeAdvance={handleChangeAdvance}
                disabled={location.state}
                checks={checks.fromDate}
                errors={errorMessages.fromDate}
                required
              />
            </Grid>}
          {(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("time table")) ||
            (serviceTypeName?.toLowerCase().includes("exam fee window")) ||
            (serviceTypeName?.toLowerCase().includes("payment link")) ||
            (serviceTypeName?.toLowerCase().includes("revaluation/photo copy")) ||
            (serviceTypeName?.toLowerCase().includes("feedback window"))
          ) && <Grid item xs={12} md={3}>
              <CustomDatePicker
                name="toDate"
                label="To Date"
                value={values.toDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.toDate}
                errors={errorMessages.toDate}
                required
                minDate={values.fromDate}
                disabled={!values.fromDate || location.state}
              />
            </Grid>}

          {(location.state && deptName?.toLowerCase().includes("human resource") && (values.complaintType == 1 || values.complaintType == 2 || values.complaintType == 3)) && <Grid item xs={12} md={3}>
            <CustomTextField
              name="date"
              label="Date"
              value={values.date}
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
              label={(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("Time table")) ||
                (serviceTypeName?.toLowerCase().includes("exam fee window")) ||
                (serviceTypeName?.toLowerCase().includes("revaluation/photo copy")) ||
                (serviceTypeName?.toLowerCase().includes("feedback window")) ||
                (serviceTypeName?.toLowerCase().includes("class commencement"))
              ) ? "Description" :
                (deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("payment link"))) ? "Event Title" :
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

          {!(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("exam fee window")) || (serviceTypeName?.toLowerCase().includes("revaluation/photo copy"))) && <Grid item xs={12} md={3}>
            <CustomTextField
              name="floorAndExtension"
              label={(deptName?.toLowerCase().includes("erp") && (serviceTypeName?.toLowerCase().includes("payment link"))) ? "Event Description" : (deptName?.toLowerCase().includes("system department") || deptName?.toLowerCase().includes("house keeping")) ? "Floor/Extension no." : "Block/Floor/Extension no."}
              value={values.floorAndExtension}
              disabled={location.state}
              handleChange={handleChange}
              required
            />
          </Grid>}

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
              <Typography variant="body2" color="error" align="center">Attachment is non mandatory</Typography>
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
