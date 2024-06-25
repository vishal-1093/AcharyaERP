import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import religionList from "../../../utils/ReligionList";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import moment from "moment";

const initialValues = {
  employeeName: "",
  joinDate: new Date(),
  // endDate: null,
  probationary: "",
  currentLocation: "",
  permanentAddress: "",
  phoneNumber: "",
  alternatePhoneNumber: "",
  aadharNumber: "",
  bankId: "",
  bankAccountName: "",
  accountNumber: "",
  bankBranch: "",
  bankIfscCode: "",
  bloodGroup: "",
  caste: "",
  jobCategoryId: null,
  proctorHeadId: null,
  dob: null,
  deptId: null,
  designationId: null,
  dlNo: "",
  dlexpDate: null,
  emptypeId: null,
  employeeName: "",
  gender: "",
  reportId: null,
  leaveApproverOneId: null,
  leaveApproverOneName: "",
  leaveApproverTwoId: null,
  leaveApproverTwoName: "",
  martialStatus: "",
  spouseName: "",
  panNo: "",
  passportNumber: "",
  passportExpiryDate: null,
  pfNo: "",
  phdStatus: "",
  preferredName: "",
  religion: null,
  schoolId: null,
  shiftId: 1,
  shiftName: "",
  storeIndentApproverOne: null,
  storeIndentApproverTwo: null,
  biometricStatus: "",
  uanNo: "",
};

const requiredFields = [
  "employeeName",
  "aadharNumber",
  "alternatePhoneNumber",
  "bloodGroup",
  "caste",
  "jobCategoryId",
  "currentLocation",
  "joinDate",
  "deptId",
  "designationId",
  "emptypeId",
  "gender",
  "permanentAddress",
  "reportId",
  "leaveApproverOneId",
  "leaveApproverTwoId",
  "martialStatus",
  "phoneNumber",
  "panNo",
  "preferredName",
  "religion",
  "schoolId",
  "shiftId",
];

function EmployeeUpdateForm() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    employeeName: [values.employeeName !== ""],
    aadharNumber: [
      values.aadharNumber !== "",
      /^[0-9]{12}$/.test(values.aadharNumber),
    ],
    uanNo: [values.uanNo !== "", /^[0-9]{12}$/.test(values.uanNo)],
    alternatePhoneNumber: [
      values.alternatePhoneNumber !== "",
      /^[0-9]{10}$/.test(values.alternatePhoneNumber),
      values.alternatePhoneNumber != values.phoneNumber,
    ],
    martialStatus: [values.martialStatus !== ""],
    bloodGroup: [values.bloodGroup !== ""],
    caste: [values.caste !== ""],
    jobCategoryId: [values.jobCategoryId !== null],
    currentLocation: [values.currentLocation !== ""],
    joinDate: [values.joinDate !== ""],
    // endDate: [values.endDate !== ""],
    dob: [values.dob !== null],
    dlNo: [values.dlNo !== null],
    dlexpDate: [values.dlexpDate !== null],
    deptId: [values.deptId !== null],
    designationId: [values.designationId !== null],
    emptypeId: [values.emptypeId !== null],
    permanentAddress: [values.permanentAddress !== ""],
    reportId: [values.reportId !== null],
    leaveApproverOneId: [values.leaveApproverOneId !== null],
    leaveApproverTwoId: [values.leaveApproverTwoId !== null],
    phoneNumber: [
      values.phoneNumber !== "",
      /^[0-9]{10}$/.test(values.phoneNumber),
    ],
    panNo: [
      values.panNo !== "",
      /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(values.panNo),
    ],
    preferredName: [
      values.preferredName !== "",
      /^[a-zA-Z0-9]*$/.test(values.preferredName),
    ],
    religion: [values.religion !== null],
    schoolId: [values.schoolId !== null],
    shiftId: [values.shiftId !== null],
  };

  const errorMessages = {
    employeeName: ["This field is required"],
    aadharNumber: ["This field is required", "Invalid Aadhar"],
    uanNo: ["This field is required", "Invalid UAN No"],
    alternatePhoneNumber: [
      "This field is required",
      "Invalid Phone",
      "This number is already given as phone number",
    ],
    martialStatus: ["This field is required"],
    bloodGroup: ["This field is required"],
    caste: ["This field is required"],
    jobCategoryId: ["This field is required"],
    currentLocation: ["This field is required"],
    joinDate: ["This field is required"],
    // endDate: ["This field is required"],
    dlNo: ["This field is required"],
    dob: ["This field is required"],
    dlexpDate: ["This field is required"],
    deptId: ["This field is required"],
    designationId: ["This field is required"],
    emptypeId: ["This field is required"],
    permanentAddress: ["This field is required"],
    leaveApproverOneId: ["This field is required"],
    leaveApproverTwoId: ["This field is required"],
    reportId: ["This field is required"],
    phoneNumber: ["This field is required", "Invalid Phone"],
    panNo: ["This field required", "Invalid PAN No."],
    preferredName: [
      "This field is required",
      "Special characters and space is not allowed",
    ],
    religion: ["This field is required"],
    schoolId: ["This field is required"],
    shiftId: ["This field is required"],
  };

  useEffect(() => {
    getData();
    getJobtypeDetails();
    getProctorDetails();
    getDesignationDetails();
    getEmptypeDetails();
    getSchoolDetails();
    getReportDetails();
    getShiftDetails();
    setCrumbs([
      {
        name: "Employee Details",
        link: "/EmployeeIndex",
      },
    ]);
  }, []);

  useEffect(() => {
    if (values.jobCategoryId && jobTypeOptions.length > 0) {
      const getJobType = jobTypeOptions.filter(
        (obj) => obj.value === values.jobCategoryId
      );

      if (getJobType[0].label.toLowerCase() !== "non teaching") {
        requiredFields.push("proctorHeadId");

        checks["proctorHeadId"] = [values.proctorHeadId !== null];
        errorMessages["proctorHeadId"] = ["This field is required"];
      }
    }
  }, [values.jobCategoryId]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  useEffect(() => {
    if (values.isConsutant === true) {
      setValues((prev) => ({
        ...prev,
        ["leaveApproverOneId"]: values.reportId,
        ["leaveApproverTwoId"]: values.reportId,
      }));
    }
  }, [values.reportId]);

  const getData = async () => {
    const regex = /\([^)]*\)/g;
    await axios
      .get(`/api/employee/EmployeeDetails/${id}`)
      .then((res) => {
        const data = res.data.data[0];
        setCrumbs([
          {
            name: "Employee Details",
            link: "/EmployeeIndex",
          },
          {
            name: data.employee_name,
          },
          {
            name: data.empcode,
          },
          {
            name: "Update",
          },
        ]);

        setValues((prev) => ({
          ...prev,
          employeeName: data.employee_name,
          aadharNumber: data.aadhar,
          alternatePhoneNumber: data.alt_mobile_no,
          bankId: data.bank_id ?? "",
          accountNumber: data.bank_account_no ?? "",
          bankBranch: data.bank_branch ?? "",
          bankIfscCode: data.bank_ifsccode ?? "",
          bloodGroup: data.blood_group,
          caste: data.caste_category,
          jobCategoryId: data.job_type_id,
          proctorHeadId: data.chief_proctor_id,
          currentLocation: data.current_location,
          dob: data.dateofbirth,
          deptId: data.dept_id,
          designationId: data.designation_id,
          dlexpDate: data.dlexpno,
          dlNo: data.dlno ?? "",
          emptypeId: data.emp_type_id,
          gender: data.gender,
          permanentAddress: data.hometown,
          martialStatus: data.martial_status,
          spouseName: data.spouse_name ?? "",
          reportId: parseInt(data.report_id),
          phoneNumber: data.mobile,
          passportNumber: data.passportno ?? "",
          passportExpiryDate: data.passportexpnow ?? "",
          pfNo: data.pf_no ?? "",
          phdStatus: data.phd_status,
          religion: data.religion,
          schoolId: data.school_id,
          shiftId: parseInt(data.shift_category_id),
          shiftName: data?.shift_name,
          panNo: data.pan_no,
          preferredName: data.preferred_name_for_email,
          leaveApproverOneId: data.leave_approver1_emp_id,
          leaveApproverOneName:data.leave_approver1_name,
          leaveApproverTwoId: data.leave_approver2_emp_id,
          leaveApproverTwoName: data.leave_approver2_name,
          storeIndentApproverOne: parseInt(data.store_indent_approver1),
          storeIndentApproverTwo: parseInt(data.store_indent_approver2),
          bankAccountName: data.bank_account_holder_name ?? "",
          uanNo: data.uan_no,
          biometricStatus: data.punched_card_status,
          // endDate: convertUTCtoTimeZone(moment(data.to_date)),
        }));

        setData(data);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
        console.error(err);
      });
  };

  const getJobtypeDetails = async () => {
    await axios
      .get(`/api/employee/JobType`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.job_type_id,
            label: obj.job_type,
          });
        });
        setJobTypeOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getProctorDetails = async () => {
    await axios
      .get(`/api/proctor/getAllActiveProctors`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.id,
            label: obj.concat_employee_name,
          });
        });
        setProctorOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          const optionData = [];
          res.data.data.forEach((obj) => {
            optionData.push({
              value: obj.dept_id,
              label: obj.dept_name,
            });
          });
          setDepartmentOptions(optionData);
        })
        .catch((err) => console.error(err));
    }
  };

  const getDesignationDetails = async () => {
    await axios
      .get(`/api/employee/Designation`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.designation_id,
            label: obj.designation_name,
          });
        });
        setDesignationOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getEmptypeDetails = async () => {
    await axios
      .get(`/api/employee/EmployeeType`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.empTypeId,
            label: obj.empType,
          });
        });
        setEmpTypeOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getReportDetails = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.emp_id,
            label: obj.email,
          });
        });
        setReportOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getShiftDetails = async () => {
    await axios
      .get(`/api/employee/Shift`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.shift_category_id,
            label: obj.shiftName,
          });
        });
        setShiftOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name == "shiftId") {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        shiftName: shiftOptions
          .find((el) => el.value == newValue)
          ?.label,
      }));
    }else if(name == "leaveApproverOneId"){
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        leaveApproverOneName: reportOptions
          .find((el) => el.value == newValue)
          ?.label,
      }));
    }else if(name == "leaveApproverTwoId"){
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        leaveApproverTwoName: reportOptions
          .find((el) => el.value == newValue)
          ?.label,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
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

  const handleCreate = async () => {
    const temp = { ...data };
    const updateData = { ...data };
    updateData.employee_name = values.employeeName;
    // updateData.to_date = values.endDate;
    updateData.current_location = values.currentLocation;
    updateData.hometown = values.permanentAddress;
    updateData.mobile = values.phoneNumber;
    updateData.alt_mobile_no = values.alternatePhoneNumber;
    updateData.gender = values.gender;
    updateData.martial_status = values.martialStatus;
    updateData.spouse_name = values.spouseName;
    updateData.dateofbirth = values.dob;
    updateData.blood_group = values.bloodGroup;
    updateData.religion = values.religion;
    updateData.caste_category = values.caste;
    updateData.leave_approver1_emp_id = values.leaveApproverOneId;
    updateData.leave_approver2_emp_id = values.leaveApproverTwoId;
    temp.leave_approver1_emp_id = values.leaveApproverOneId;
    temp.leave_approver2_emp_id = values.leaveApproverTwoId;
    updateData.shift_category_id = values.shiftId;
    updateData.store_indent_approver1 = values.storeIndentApproverOne;
    updateData.store_indent_approver2 = values.storeIndentApproverTwo;
    updateData.bank_id = values.bankId;
    updateData.bank_branch = values.bankBranch;
    updateData.bank_account_no = values.accountNumber;
    updateData.bank_ifsccode = values.bankIfscCode;
    updateData.bank_account_holder_name = values.bankAccountName;
    updateData.chief_proctor_id = values.proctorHeadId;
    updateData.aadhar = values.aadharNumber;
    updateData.pan_no = values.panNo;
    updateData.pf_no = values.pfNo;
    updateData.dlno = values.dlNo;
    updateData.dlexpno = values.dlexpDate;
    updateData.passportno = values.passportNumber;
    updateData.passportexpno = values.passportExpiryDate;
    updateData.phd_status = values.phdStatus;
    updateData.uan_no = values.uanNo;
    updateData.punched_card_status = values.biometricStatus;
    updateData.employee_name = values.employeeName;

    data.employee_name === values.employeeName
      ? (temp.employee_name = values.employeeName)
      : (temp.employee_name = `<font color='blue'>${values.employeeName}</font>`);

    // data.to_date === values.endDate
    //   ? (temp.to_date = values.endDate)
    //   : (temp.to_date = `<font color='blue'>${values.endDate}</font>`);

    data.current_location === values.currentLocation
      ? (temp.current_location = values.currentLocation)
      : (temp.current_location = `<font color='blue'>${values.currentLocation}</font>`);

    data.hometown === values.permanentAddress
      ? (temp.hometown = values.permanentAddress)
      : (temp.hometown = `<font color='blue'>${values.permanentAddress}</font>`);

    data.mobile === values.phoneNumber
      ? (temp.mobile = values.phoneNumber)
      : (temp.mobile = `<font color='blue'>${values.phoneNumber}</font>`);

    data.alt_mobile_no === values.alternatePhoneNumber
      ? (temp.alt_mobile_no = values.alternatePhoneNumber)
      : (temp.alt_mobile_no = `<font color='blue'>${values.alternatePhoneNumber}</font>`);

    data.gender === values.gender
      ? (temp.gender = values.gender)
      : (temp.gender = `<font color='blue'>${values.gender}</font>`);

    data.martial_status === values.martialStatus
      ? (temp.martial_status = values.martialStatus)
      : (temp.martial_status = `<font color='blue'>${values.martialStatus}</font>`);

    data.spouse_name === values.spouseName
      ? (temp.spouse_name = values.spouseName)
      : (temp.spouse_name = `<font color='blue'>${values.spouseName}</font>`);

    data.dateofbirth === values.dob
      ? (temp.dateofbirth = values.dob)
      : (temp.dateofbirth = `<font color='blue'>${moment(values.dob).format(
          "DD-MM-YYYY"
        )}</font>`);

    data.blood_group === values.bloodGroup
      ? (temp.blood_group = values.bloodGroup)
      : (temp.blood_group = `<font color='blue'>${values.bloodGroup}</font>`);

    data.religion === values.religion
      ? (temp.religion = values.religion)
      : (temp.religion = `<font color='blue'>${values.religion}</font>`);

    data.caste_category === values.caste
      ? (temp.caste_category = values.caste)
      : (temp.caste_category = `<font color='blue'>${values.caste}</font>`);

    data.bank_id === values.bankId
      ? (temp.bank_id = values.bankId)
      : (temp.bank_id = `<font color='blue'>${values.bankId}</font>`);

    data.bank_branch === values.bankBranch
      ? (temp.bank_branch = values.bankBranch)
      : (temp.bank_branch = `<font color='blue'>${values.bankBranch}</font>`);

    data.bank_account_no === values.accountNumber
      ? (temp.bank_account_no = values.accountNumber)
      : (temp.bank_account_no = `<font color='blue'>${values.accountNumber}</font>`);

    data.bank_ifsccode === values.bankIfscCode
      ? (temp.bank_ifsccode = values.bankIfscCode)
      : (temp.bank_ifsccode = `<font color='blue'>${values.bankIfscCode}</font>`);

    data.bank_account_holder_name === values.bankAccountName
      ? (temp.bank_account_holder_name = values.bankAccountName)
      : (temp.bank_account_holder_name = `<font color='blue'>${values.bankAccountName}</font>`);

    data.aadhar === values.aadharNumber
      ? (temp.aadhar = values.aadharNumber)
      : (temp.aadhar = `<font color='blue'>${values.aadharNumber}</font>`);

    data.pan_no === values.panNo
      ? (temp.pan_no = values.panNo)
      : (temp.pan_no = `<font color='blue'>${values.panNo}</font>`);

    data.pf_no === values.pfNo
      ? (temp.pf_no = values.pfNo)
      : (temp.pf_no = `<font color='blue'>${values.pfNo}</font>`);

    data.dlno === values.dlNo
      ? (temp.dlno = values.dlNo)
      : (temp.dlno = `<font color='blue'>${values.dlNo}</font>`);

    data.dlexpno === values.dlexpDate
      ? (temp.dlexpno = values.dlexpDate)
      : (temp.dlexpno = `<font color='blue'>${moment(values.dlexpDate).format(
          "DD-MM-YYYY"
        )}</font>`);

    data.passportno === values.passportNumber
      ? (temp.passportno = values.passportNumber)
      : (temp.passportno = `<font color='blue'>${values.passportNumber}</font>`);

    data.passportexpno === values.passportExpiryDate
      ? (temp.passportexpno = values.passportExpiryDate)
      : (temp.passportexpno = !!values.passportExpiryDate
          ? `<font color='blue'>${moment(values.passportExpiryDate).format(
              "DD-MM-YYYY"
            )}</font>`
          : "");

    data.phd_status === values.phdStatus
      ? (temp.phd_status = values.phdStatus)
      : (temp.phd_status = `<font color='blue'>${values.phdStatus}</font>`);

    data.uan_no === values.uanNo
      ? (temp.uan_no = values.uanNo)
      : (temp.uan_no = `<font color='blue'>${values.uanNo}</font>`);

    data.punched_card_status === values.biometricStatus
      ? (temp.punched_card_status = values.biometricStatus)
      : (temp.punched_card_status = `<font color='blue'>${values.biometricStatus}</font>`);

    data.employee_name === values.employeeName
      ? (temp.employee_name = values.employeeName)
      : (temp.employee_name = `<font color='blue'>${values.employeeName}</font>`);

    temp.shift_name =
      data.shift_name === values.shiftName
        ? values.shiftName
        : `<font color='blue'>${values.shiftName}</font>`;

        temp.leave_approver1_name =
          data.leave_approver1_name === values.leaveApproverOneName
            ? values.leaveApproverOneName
            : `<font color='blue'>${values.leaveApproverOneName}</font>`;

        temp.leave_approver2_name =
          data.leave_approver2_name === values.leaveApproverTwoName
            ? values.leaveApproverTwoName
            : `<font color='blue'>${values.leaveApproverTwoName}</font>`;

    setLoading(true);
    // Moving data to employee history
    await axios
      .post(`/api/employee/employeeDetailsHistory`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          // Update employee details
          axios
            .put(`/api/employee/EmployeeDetails/${id}`, updateData)
            .then((putRes) => {
              setLoading(false);
              setAlertMessage({
                severity: "success",
                message: "Updated successfully !!",
              });
              setAlertOpen(true);
              navigate("/employeeindex", { replace: true });
            })
            .catch((putErr) => {
              setLoading(false);
              setAlertMessage({
                severity: "error",
                message: putErr.response
                  ? putErr.response.data.message
                  : "Error",
              });
              setAlertOpen(true);
              navigate("/employeeindex", { replace: true });
            });
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  return (
    <Box p={1}>
      <FormPaperWrapper>
        <Grid container columnSpacing={2} rowSpacing={3}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="employeeName"
              label="Employee Name"
              value={values.employeeName}
              handleChange={handleChange}
              checks={checks.employeeName}
              errors={errorMessages.employeeName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="joinDate"
              label="Date of joining"
              value={values.joinDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.joinDate}
              errors={errorMessages.joinDate}
              disabled
            />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="endDate"
              label="Probationary End Date"
              value={values.endDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.endDate}
              errors={errorMessages.endDate}
              disablePast
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="probationary"
              label="Probationary Period"
              value={values.probationary}
              helperText="Days"
              disabled
            />
          </Grid> */}

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="currentLocation"
              label="Current Location"
              value={values.currentLocation}
              handleChange={handleChange}
              checks={checks.currentLocation}
              errors={errorMessages.currentLocation}
              multiline
              rows={3}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="permanentAddress"
              label="Permanent Address"
              value={values.permanentAddress}
              handleChange={handleChange}
              checks={checks.permanentAddress}
              errors={errorMessages.permanentAddress}
              multiline
              rows={3}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="phoneNumber"
              label="Phone number"
              value={values.phoneNumber}
              handleChange={handleChange}
              checks={checks.phoneNumber}
              errors={errorMessages.phoneNumber}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="alternatePhoneNumber"
              label="Alternate phone number"
              value={values.alternatePhoneNumber}
              handleChange={handleChange}
              checks={checks.alternatePhoneNumber}
              errors={errorMessages.alternatePhoneNumber}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="gender"
              label="Gender"
              value={values.gender}
              items={[
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="martialStatus"
              label="Martial Status"
              value={values.martialStatus}
              items={[
                { value: "M", label: "Married" },
                { value: "U", label: "Unmarried" },
                { value: "D", label: "Divorced" },
                { value: "W", label: "Widow" },
              ]}
              handleChange={handleChange}
              checks={checks.martialStatus}
              errors={errorMessages.martialStatus}
              required
            />
          </Grid>

          {values.martialStatus === "M" ? (
            <>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="spouseName"
                  label="Spouse Name"
                  value={values.spouseName}
                  handleChange={handleChange}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="dob"
              label="Date of Birth"
              value={values.dob}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.dob}
              errors={errorMessages.dob}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bloodGroup"
              label="Blood Group"
              value={values.bloodGroup}
              handleChange={handleChange}
              checks={checks.bloodGroup}
              errors={errorMessages.bloodGroup}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="religion"
              label="Religion"
              value={values.religion}
              options={religionList}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.religion}
              errors={errorMessages.religion}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="caste"
              label="Caste Category"
              value={values.caste}
              items={[
                { value: "SC", label: "SC" },
                { value: "ST", label: "ST" },
                { value: "General", label: "General" },
                { value: "OBC", label: "OBC" },
              ]}
              handleChange={handleChange}
              checks={checks.caste}
              errors={errorMessages.caste}
              required
            />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.schoolId}
              errors={errorMessages.schoolId}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              options={departmentOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.deptId}
              errors={errorMessages.deptId}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="designationId"
              label="Designation"
              value={values.designationId}
              options={designationOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.designationId}
              errors={errorMessages.designationId}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="jobCategoryId"
              label="Job Category"
              value={values.jobCategoryId}
              options={jobTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.jobCategoryId}
              errors={errorMessages.jobCategoryId}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="emptypeId"
              label="Employment Type"
              value={values.emptypeId}
              options={empTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.emptypeId}
              errors={errorMessages.emptypeId}
              disabled
              required
            />
          </Grid> */}

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="shiftId"
              label="Shift"
              value={values.shiftId}
              options={shiftOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.shiftId}
              errors={errorMessages.shiftId}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="proctorHeadId"
              label="Proctor Head"
              value={values.proctorHeadId}
              options={proctorOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.proctorHeadId}
              errors={errorMessages.proctorHeadId}
              required={requiredFields.includes("proctorHeadId") === true}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="reportId"
              label="Report To"
              value={values.reportId}
              options={reportOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.reportId}
              errors={errorMessages.reportId}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="leaveApproverOneId"
              label="Leave approver 1"
              value={values.leaveApproverOneId}
              options={reportOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.leaveApproverOneId}
              errors={errorMessages.leaveApproverOneId}
              disabled={values.isConsutant}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="leaveApproverTwoId"
              label="Leave approver 2"
              value={values.leaveApproverTwoId}
              options={reportOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.leaveApproverTwoId}
              errors={errorMessages.leaveApproverTwoId}
              disabled={values.isConsutant}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="storeIndentApproverOne"
              label="Store Indent Approver 1"
              value={values.storeIndentApproverOne}
              options={reportOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.storeIndentApproverOne}
              errors={errorMessages.storeIndentApproverOne}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="storeIndentApproverTwo"
              label="Store Indent Approver 2"
              value={values.storeIndentApproverTwo}
              options={reportOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.storeIndentApproverTwo}
              errors={errorMessages.storeIndentApproverTwo}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankAccountName"
              label="Account Holder Name"
              value={values.bankAccountName}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="accountNumber"
              label="Account Number"
              value={values.accountNumber}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankId"
              label="Bank"
              value={values.bankId}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankBranch"
              label="Branch"
              value={values.bankBranch}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="bankIfscCode"
              label="IFSC Code"
              value={values.bankIfscCode}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="aadharNumber"
              label="Aadhar Number"
              value={values.aadharNumber}
              handleChange={handleChange}
              checks={checks.aadharNumber}
              errors={errorMessages.aadharNumber}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="panNo"
              label="PAN No"
              value={values.panNo}
              handleChange={handleChange}
              checks={checks.panNo}
              errors={errorMessages.panNo}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="uanNo"
              label="UAN No"
              value={values.uanNo}
              handleChange={handleChange}
              checks={checks.uanNo}
              errors={errorMessages.uanNo}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="biometricStatus"
              label="Biometric Status"
              value={values.biometricStatus}
              items={[
                { value: "Mandatory", label: "Mandatory" },
                { value: "Optional", label: "Optional" },
                { value: "No Swipe", label: "No Swipe" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="pfNo"
              label="PF No"
              value={values.pfNo}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="dlNo"
              label="DL No"
              value={values.dlNo}
              handleChange={handleChange}
              checks={checks.dlNo}
              errors={errorMessages.dlNo}
            />
          </Grid>

          {values.dlNo ? (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="dlexpDate"
                label="DL Expiry Date"
                value={values.dlexpDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.dlexpDate}
                errors={errorMessages.dlexpDate}
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="passportNumber"
              label="Passport Number"
              value={values.passportNumber}
              handleChange={handleChange}
            />
          </Grid>

          {values.passportNumber ? (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="passportExpiryDate"
                label="Passport Expiry Date"
                value={values.passportExpiryDate}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={4}>
            <CustomSelect
              name="phdStatus"
              label="Phd Status"
              value={values.phdStatus}
              items={[
                { value: "holder", label: "PhD Holder" },
                { value: "pursuing", label: "PhD Pursuing" },
              ]}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="preferredName"
              label="Preferred name for email & name display"
              value={values.preferredName}
              handleChange={handleChange}
              checks={checks.preferredName}
              errors={errorMessages.preferredName}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              disabled={loading || !requiredFieldsValid()}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default EmployeeUpdateForm;
