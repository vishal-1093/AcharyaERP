import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initialValues = {
  employeeName: "",
  empCode: "",
  email: "",
  dob: null,
  joinDate: null,
  gender: "",
  martialStatus: "",
  spouseName: "",
  permanentAddress: "",
  currentLocation: "",
  phoneNumber: "",
  alternatePhoneNumber: "",
  bloodGroup: "",
  religion: "",
  caste: "",
  aadhar: "",
  panNo: "",
  bankId: "",
  accountNumber: "",
  branch: "",
  ifscCode: "",
  schoolId: null,
  deptId: null,
  designationId: null,
  jobCategoryId: null,
  emptypeId: null,
  leaveApproverOneId: null,
  leaveApproverTwoId: null,
  reportId: null,
  proctorHeadId: null,
  shiftId: "",
  pfNo: "",
  uanNumber: "",
  preferredName: "",
  passportNumber: "",
  passportExpiryDate: null,
  phdStatus: "",
  punchCard: "",
  isConsutant: false,
};

const requiredFields = [
  "employeeName",
  "permanentAddress",
  "currentLocation",
  "aadhar",
  "phoneNumber",
  "alternatePhoneNumber",
  "bankId",
  "bloodGroup",
  "accountHolderName",
  "accountNumber",
  "religion",
  "caste",
  "branch",
  "dob",
  "deptId",
  "schoolId",
  "designationId",
  "jobCategoryId",
  "emptypeId",
  "gender",
  "leaveApproverOneId",
  "leaveApproverTwoId",
  "martialStatus",
  "panNo",
  "preferredName",
  "reportId",
];

function EmployeeUpdateForm() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    employeeName: [values.employeeName !== ""],
    permanentAddress: [values.permanentAddress !== ""],
    currentLocation: [values.currentLocation !== ""],
    aadhar: [values.aadhar !== "", /^[0-9]{12}$/.test(values.aadhar)],
    phoneNumber: [
      values.phoneNumber !== "",
      /^[0-9]{10}$/.test(values.phoneNumber),
    ],
    alternatePhoneNumber: [
      values.alternatePhoneNumber !== "",
      /^[0-9]{10}$/.test(values.alternatePhoneNumber),
      values.alternatePhoneNumber != values.phoneNumber,
    ],
    bankId: [values.bankId !== ""],
    branch: [values.branch !== "", /^[A-Za-z ]+$/.test(values.branch)],
    accountNumber: [values.accountNumber !== ""],
    ifscCode: [values.ifscCode !== ""],
    dob: [values.dob !== null],
    schoolId: [values.schoolId !== ""],
    deptId: [values.deptId !== ""],
    schoolId: ["This field is required"],
    deptId: ["This field is required"],
    designationId: [values.designationId !== ""],
    jobCategoryId: [values.jobCategoryId !== ""],
    emptypeId: [values.emptypeId !== ""],
    leaveApproverOneId: [values.leaveApproverOneId !== ""],
    leaveApproverTwoId: [values.leaveApproverTwoId !== ""],
    panNo: [values.panNo !== ""],
    preferredName: [values.preferredName !== ""],
    reportId: [values.reportId !== ""],
    shiftId: [values.shiftId !== ""],
  };

  const errorMessages = {
    employeeName: ["This field is required"],
    permanentAddress: ["This field is required"],
    currentLocation: ["This field is required"],
    aadhar: ["This field is required", "Invalid Aadhar"],

    phoneNumber: ["This field is required", "Invalid Phone"],
    alternatePhoneNumber: [
      "This field is required",
      "Invalid Phone",
      "This number is already given as phone number",
    ],
    bankId: ["This field is required"],
    branch: ["This field required"],
    accountNumber: ["This field is required"],
    ifscCode: ["This field required"],
    dob: ["This field is required"],
    designationId: ["This field is required"],
    jobCategoryId: ["This field is required"],
    emptypeId: ["This field is required"],
    leaveApproverOneId: ["This field is required"],
    leaveApproverTwoId: ["This field is required"],
    panNo: ["This field required"],
    preferredName: ["This field is required"],
    reportId: ["This field is required"],
    shiftId: ["This field is required"],
  };

  if (values.isConsutant === false) {
    checks["proctorHeadId"] = [values.proctorHeadId !== ""];
    errorMessages["proctorHeadId"] = ["This field is required"];
  }

  useEffect(() => {
    getData();
    getShiftDetails();
    getProctorDetails();
    getReportDetails();
    getBankDetails();
    getSchoolDetails();
    getDesignationDetails();
    getJobtypeDetails();
    getEmptypeDetails();
  }, [pathname]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  const getData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${id}`)
      .then((res) => {
        setCrumbs([
          {
            name: "Employee Index",
            link: "/employeeindex",
          },
          {
            name: res.data.data[0].employee_name,
          },
          {
            name: "Employee Update",
          },
        ]);

        const data = res.data.data[0];

        setValues((prev) => ({
          ...prev,
          employeeName: data.employee_name,
          empCode: data.empcode,
          aadhar: data.aadhar,
          phoneNumber: data.mobile,
          alternatePhoneNumber: data.alt_mobile_no,
          permanentAddress: data.hometown,
          currentLocation: data.current_location,
          reportId: data.report_id,
          leaveApproverOneId: data.leave_approver1,
          leaveApproverTwoId: data.leave_approver2,
          proctorHeadId: data.chief_proctor_id,
          bloodGroup: data.blood_group,
          bankId: data.bank_id,
          branch: data.bank_branch,
          accountNumber: data.bank_account_no,
          ifscCode: data.bank_ifsccode,
          passportNumber: data.passportno,
          passportExpiryDate: data.passportexpno,
          phdStatus: data.phd_status === null ? "" : data.phd_status,
          dob: data.dateofbirth,
          schoolId: data.school_id,
          deptId: data.dept_id,
          designationId: data.designation_id,
          joinDate: data.date_of_joining,
          email: data.email,
          jobCategoryId: data.job_type_id,
          emptypeId: data.emp_type_id,
          gender: data.gender,
          leaveApproverOneId: data.leave_approver1_emp_id,
          leaveApproverTwoId: data.leave_approver2_emp_id,
          martialStatus: data.martial_status,
          pfNo: data.pf_no,
          preferredName: data.preferred_name_for_email,
          punchCard: data.punched_card_status,
          shiftId: data.shift_category_id,
          uanNumber: data.uan_no,
          spouseName: data.spouse_name,
          isConsutant: data.emp_type_short_name === "CON" ? true : false,
          panNo: data.pan_no,
          caste: data.caste_category,
          religion: data.religion,
        }));

        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getShiftDetails = async () => {
    await axios
      .get(`/api/employee/Shift`)
      .then((res) => {
        setShiftOptions(
          res.data.data.map((obj) => ({
            value: obj.shift_category_id,
            label: obj.shiftName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getReportDetails = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails`)
      .then((res) => {
        setReportOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.email,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProctorDetails = async () => {
    await axios
      .get(`/api/proctor/getAllActiveProctors`)
      .then((res) => {
        setProctorOptions(
          res.data.data.map((obj) => ({
            value: obj.id,
            label: obj.concat_employee_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getBankDetails = async () => {
    await axios
      .get(`/api/finance/Bank`)
      .then((res) => {
        setBankOptions(
          res.data.data.map((obj) => ({
            value: obj.bank_id,
            label: obj.bank_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          setDepartmentOptions(
            res.data.data.map((obj) => ({
              value: obj.dept_id,
              label: obj.dept_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getDesignationDetails = async () => {
    await axios
      .get(`/api/employee/Designation`)
      .then((res) => {
        setDesignationOptions(
          res.data.data.map((obj) => ({
            value: obj.designation_id,
            label: obj.designation_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getJobtypeDetails = async () => {
    await axios
      .get(`/api/employee/JobType`)
      .then((res) => {
        setJobTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.job_type_id,
            label: obj.job_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getEmptypeDetails = async () => {
    await axios
      .get(`/api/employee/EmployeeType`)
      .then((res) => {
        setEmpTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.empTypeId,
            label: obj.empTypeShortName,
          }))
        );
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
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async () => {
    const temp = data;
    temp.employee_name = values.employeeName;
    temp.gender = values.gender;
    temp.martial_status = values.martialStatus;
    temp.hometown = values.permanentAddress;
    temp.current_location = values.currentLocation;
    temp.mobile = values.phoneNumber;
    temp.alt_mobile_no = values.alternatePhoneNumber;
    temp.blood_group = values.bloodGroup;
    temp.religion = values.religion;
    temp.caste_category = values.caste;
    temp.aadhar = values.aadhar;
    temp.pan_no = values.panNo;
    temp.bank_id = values.bankId;
    temp.bank_branch = values.branch;
    temp.bank_account_no = values.accountNumber;
    temp.bank_ifsccode = values.ifscCode;
    temp.school_id = values.schoolId;
    temp.school = schoolOptions
      .filter((fil) => fil.value === values.schoolId)
      .map((obj) => obj.label)
      .toString();
    temp.dept_id = values.deptId;
    temp.designation_id = values.designationId;
    temp.job_type_id = values.jobCategoryId;
    temp.emp_type_id = values.emptypeId;
    temp.leave_approver1 = values.leaveApproverOneId;
    temp.leave_approver2 = values.leaveApproverTwoId;
    temp.report_id = values.reportId;
    temp.shift_category_id = values.shiftId;
    temp.chief_proctor_id = values.proctorHeadId;
    temp.pf_no = values.pfNo;
    temp.uan_no = values.uanNumber;
    temp.preferred_name_for_email = values.preferredName;
    temp.passportno = values.passportNumber;
    temp.passportexpno = values.passportExpiryDate;
    temp.phd_status = values.phdStatus;

    setLoading(true);
    await axios
      .post(`/api/employee/employeeDetailsHistory`, data)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          axios
            .put(`/api/employee/EmployeeDetails/${id}`, temp)
            .then((res) => {
              setLoading(false);
              setAlertMessage({
                severity: "success",
                message: "Updated Successfully",
              });
              setAlertOpen(true);
              navigate("/employeeindex", { replace: true });
            })
            .catch((err) => {
              setLoading(false);
              setAlertMessage({
                severity: "error",
                message: "Something went wrong !!!",
              });
              setAlertOpen(true);
              navigate("/employeeindex", { replace: true });
            });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
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
              <CustomTextField
                name="empcode"
                label="Employee Code"
                value={values.empCode}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="email"
                label="Email"
                value={values.email}
                handleChange={handleChange}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="joinDate"
                label="Date of joining"
                value={values.joinDate}
                handleChangeAdvance={handleChangeAdvance}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="dob"
                label="Date of Birth"
                value={values.dob}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} md={1.9}>
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

            <Grid item xs={12} md={2.1}>
              <CustomRadioButtons
                name="martialStatus"
                label="Martial Status"
                value={values.martialStatus}
                items={[
                  { value: "U", label: "Single" },
                  { value: "M", label: "Married" },
                ]}
                handleChange={handleChange}
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
              <CustomTextField
                name="permanentAddress"
                label="Permanent Address"
                value={values.permanentAddress}
                handleChange={handleChange}
                multiline
                rows={3}
                checks={checks.permanentAddress}
                errors={errorMessages.permanentAddress}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="currentLocation"
                label="Current Location"
                value={values.currentLocation}
                handleChange={handleChange}
                multiline
                rows={3}
                checks={checks.currentLocation}
                errors={errorMessages.currentLocation}
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
                options={[
                  { value: "Hindus", label: "Hindu" },
                  { value: "Muslims", label: "Muslim" },
                  { value: "Christians", label: "Christian" },
                  { value: "Sikhs", label: "Sikh" },
                  { value: "Buddhists", label: "Buddhist" },
                  { value: "Jains ", label: "Jain" },
                ]}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.religion}
                errors={errorMessages.religion}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="caste"
                label="Caste Category"
                value={values.caste}
                handleChange={handleChange}
                checks={checks.caste}
                errors={errorMessages.caste}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="aadhar"
                label="Aadhar Number"
                value={values.aadhar}
                handleChange={handleChange}
                checks={checks.aadhar}
                errors={errorMessages.aadhar}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="panNo"
                label="PAN No"
                value={values.panNo}
                handleChange={handleChange}
                fullWidth
                checks={checks.panNo}
                errors={errorMessages.panNo}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="bankId"
                label="Bank"
                value={values.bankId}
                options={bankOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.bankId}
                errors={errorMessages.bankId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="accountNumber"
                label="Account Number"
                value={values.accountNumber}
                handleChange={handleChange}
                checks={checks.accountNumber}
                errors={errorMessages.accountNumber}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="branch"
                label="Bank Branch Name"
                value={values.branch}
                handleChange={handleChange}
                fullWidth
                checks={checks.branch}
                errors={errorMessages.branch}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="ifscCode"
                label="IFSC Code"
                value={values.ifscCode}
                handleChange={handleChange}
                fullWidth
                checks={checks.ifscCode}
                errors={errorMessages.ifscCode}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.schoolId}
                errors={errorMessages.schoolId}
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
                required={!values.isConsutant}
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

            {values.isConsutant === false ? (
              <>
                {" "}
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="pfNo"
                    label="PF No."
                    value={values.pfNo}
                    handleChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="uanNumber"
                    label="UAN Number"
                    value={values.uanNumber}
                    handleChange={handleChange}
                  />
                </Grid>
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
              </>
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

            <Grid item xs={12} textAlign="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading}
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
        </FormWrapper>
      </Box>
    </>
  );
}

export default EmployeeUpdateForm;
