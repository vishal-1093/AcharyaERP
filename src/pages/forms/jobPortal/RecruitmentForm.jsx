import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";
import CandidateDetails from "./CandidateDetails";
import CustomModal from "../../../components/CustomModal";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import SalaryBreakupView from "../../../components/SalaryBreakupView";

const initialValues = {
  joinDate: new Date(),
  endDate: new Date().setFullYear(new Date().getFullYear() + 1),
  probationary: "",
  permanentAddress: "",
  currentLocation: "",
  phoneNumber: "",
  alternatePhoneNumber: "",
  designationId: null,
  jobcategoryId: null,
  emptypeId: null,
  schoolId: null,
  deptId: null,
  shiftId: null,
  reportId: null,
  proctorHeadId: null,
  leaveApproverOneId: null,
  leaveApproverTwoId: null,
  bankId: "",
  bloodGroup: "",
  accountNumber: "",
  religion: null,
  caste: "",
  branch: "",
  panNo: "",
  pfNo: "",
  ifscCode: "",
  aadharNumber: "",
  uanNumber: "",
  passportExpiryDate: null,
  passportNumber: "",
  preferredName: "",
  phdStatus: "",
  fileName: "",
  imgFile: "",
};

const userInitialValues = { employeeEmail: "", roleId: "" };

const requiredFields = [
  "joinDate",
  "endDate",
  "permanentAddress",
  "currentLocation",
  "phoneNumber",
  "alternatePhoneNumber",
  "designationId",
  "jobcategoryId",
  "emptypeId",
  "schoolId",
  "deptId",
  "shiftId",
  "reportId",
  "proctorHeadId",
  "leaveApproverOneId",
  "leaveApproverTwoId",
  "bankId",
  "bloodGroup",
  "accountNumber",
  "religion",
  "caste",
  "branch",
  "panNo",
  "ifscCode",
  "aadharNumber",
  "preferredName",
  "comments",
  "fileName",
  "imgFile",
];

function RecruitmentForm() {
  const [values, setValues] = useState(initialValues);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [leaveApproverOptions, setLeaveApproverOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userValues, setUserValues] = useState(userInitialValues);
  const [roleOptions, setRoleOptions] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [salaryBreakupOpen, setSalaryBreakupOpen] = useState(false);

  const { id, offerId } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    joinDate: [values.joinDate !== ""],
    endDate: [values.endDate !== ""],
    permanentAddress: [values.permanentAddress !== ""],
    currentLocation: [values.currentLocation !== ""],
    phoneNumber: [
      values.phoneNumber !== "",
      /^[0-9]{10}$/.test(values.phoneNumber),
    ],
    alternatePhoneNumber: [
      values.alternatePhoneNumber !== "",
      /^[0-9]{10}$/.test(values.alternatePhoneNumber),
      values.alternatePhoneNumber != values.phoneNumber,
    ],
    religion: [values.religion !== ""],
    caste: [values.caste !== "", /^[A-Za-z ]+$/.test(values.caste)],
    designationId: [values.designationId !== ""],
    jobcategoryId: [values.jobcategoryId !== ""],
    employeeId: [values.employeeId !== ""],
    schoolId: [values.schoolId !== ""],
    deptId: [values.deptId !== ""],
    shiftId: [values.shiftId !== ""],
    reportId: [values.reportId !== ""],
    leaveApproverOneId: [values.leaveApproverOneId !== ""],
    leaveApproverTwoId: [values.leaveApproverTwoId !== ""],
    proctorHeadId: [values.proctorHeadId !== ""],
    bloodGroup: [values.bloodGroup !== ""],
    bankId: [values.bankId !== ""],
    branch: [values.branch !== "", /^[A-Za-z ]+$/.test(values.branch)],
    accountNumber: [values.accountNumber !== ""],
    ifscCode: [values.ifscCode !== ""],
    panNo: [values.panNo !== ""],
    aadharNumber: [
      values.aadharNumber !== "",
      /^[0-9]{12}$/.test(values.aadharNumber),
    ],
    preferredName: [values.preferredName !== ""],
    comments: [values.comments !== ""],
    fileName: [
      values.fileName !== "",
      values.fileName && values.fileName.name.endsWith(".pdf"),
      values.fileName && values.fileName.size < 2000000,
    ],
    imgFile: [
      values.imgFile !== "",
      (values.imgFile && values.imgFile.name.endsWith(".jpg")) ||
        (values.imgFile && values.imgFile.name.endsWith(".jpeg")),
      values.imgFile && values.imgFile.size < 2000000,
    ],
  };
  const errorMessages = {
    joinDate: ["This field is required"],
    endDate: ["This field is required"],
    permanentAddress: ["This field is required"],
    currentLocation: ["This field is required"],
    phoneNumber: ["This field is required", "Invalid Phone"],
    alternatePhoneNumber: [
      "This field is required",
      "Invalid Phone",
      "This number is already given as phone number",
    ],
    religion: ["This field is required"],
    caste: ["This field is required", "Enter Only Characters"],
    designationId: ["This field is required"],
    jobcategoryId: ["This field is required"],
    emptypeId: ["This field is required"],
    schoolId: ["This field is required"],
    deptId: ["This field is required"],
    shiftId: ["This field is required"],
    reportId: ["This field is required"],
    leaveApproverOneId: ["This field is required"],
    leaveApproverTwoId: ["This field is required"],
    proctorHeadId: ["This field is required"],
    bloodGroup: ["This field is required"],
    bankId: ["This field is required"],
    branch: ["This field required"],
    accountNumber: ["This field is required"],
    ifscCode: ["This field required"],
    panNo: ["This field required"],
    aadharNumber: ["This field is required", "Invalid Aadhar"],
    preferredName: ["This field is required"],
    comments: ["This field is required"],
    fileName: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    imgFile: [
      "This field is required",
      "Please upload a JPG or JPEG",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getShiftDetails();
    getEmptypeDetails();
    getJobtypeDetails();
    getDesignationDetails();
    getLeaveApprover();
    getProctorDetails();
    getSchoolDetails();
    getReportDetails();
    getOfferDetails();
    handleDetails();
    getDays(new Date(values.endDate));
  }, [pathname]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

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

  const handleDetails = async () => {
    await axios
      .get(`/api/employee/getAllApplicantDetails/${id}`)
      .then((res) => {
        setData(res.data);
        setValues((prev) => ({
          ...prev,
          permanentAddress:
            res.data.Job_Profile.street +
            ", " +
            res.data.Job_Profile.locality +
            ", " +
            res.data.Job_Profile.city_name +
            ", " +
            res.data.Job_Profile.state_name +
            ", " +
            res.data.Job_Profile.country_name +
            " " +
            res.data.Job_Profile.pincode,
          currentLocation:
            res.data.Job_Profile.street +
            ", " +
            res.data.Job_Profile.locality +
            ", " +
            res.data.Job_Profile.city_name +
            ", " +
            res.data.Job_Profile.state_name +
            ", " +
            res.data.Job_Profile.country_name +
            " " +
            res.data.Job_Profile.pincode,
          phoneNumber: res.data.Job_Profile.mobile,
        }));
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: "Something went wrong!!",
        });
        setAlertOpen(true);
      });
  };

  const getOfferDetails = async () => {
    await axios
      .get(`/api/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          designationId: res.data.data[0].designation_id,
          schoolId: res.data.data[0].school_id,
          deptId: res.data.data[0].dept_id,
          reportId: res.data.data[0].report_id,
          jobcategoryId: res.data.data[0].job_type_id,
          emptypeId: res.data.data[0].emp_type_id,
        }));
        setCrumbs([
          {
            name: "Job Portal",
            link: "/jobportal",
          },
          {
            name: "Recruitment",
          },
          {
            name: id,
          },
          {
            name: res.data.data[0].firstname,
          },
        ]);
      })
      .catch((err) => console.error(err));
  };
  const getDays = (newValue) => {
    const fromDate = new Date(
      newValue.getMonth() +
        1 +
        "/" +
        newValue.getDate() +
        "/" +
        newValue.getFullYear()
    );

    const toDate = new Date(
      values.joinDate.getMonth() +
        1 +
        "/" +
        values.joinDate.getDate() +
        "/" +
        values.joinDate.getFullYear()
    );

    const time_difference = fromDate.getTime() - toDate.getTime();

    setValues((prev) => ({
      ...prev,
      probationary: Math.ceil(time_difference / (1000 * 3600 * 24)),
    }));
  };

  const getShiftDetails = async () => {
    await axios
      .get(`/api/employee/Shift`)
      .then((res) => {
        setShiftOptions(
          res.data.data.map((obj) => ({
            value: obj.shiftCategoryId,
            label: obj.shiftName,
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

  const getLeaveApprover = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails`)
      .then((res) => {
        setLeaveApproverOptions(
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

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "roleId") {
      setUserValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    if (name === "endDate") {
      getDays(newValue.$d);
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });

      setAlertOpen(true);
    } else {
      const sendPostData = async () => {
        setLoading(true);
        const temp = {};
        temp.active = true;
        temp.date_of_joining = values.joinDate;
        temp.to_date = values.endDate;
        temp.current_location = values.currentLocation;
        temp.hometown = values.permanentAddress;
        temp.mobile = values.phoneNumber;
        temp.alt_mobile_no = values.alternatePhoneNumber;
        temp.religion = values.religion;
        temp.caste_category = values.caste;
        temp.designation_id = values.designationId;
        temp.job_type_id = values.jobcategoryId;
        temp.emp_type = values.emptypeId;
        temp.school_id = values.schoolId;
        temp.dept_id = values.deptId;
        temp.shift_category_id = values.shiftId;
        temp.report_id = values.reportId;
        temp.leave_approver1 = values.leaveApproverOneId;
        temp.leave_approver2 = values.leaveApproverTwoId;
        temp.store_indent_approver1 = values.leaveApproverTwoId;
        temp.store_indent_approver2 = values.leaveApproverTwoId;
        temp.chief_proctor_id = values.proctorHeadId;
        temp.blood_group = values.bloodGroup;
        temp.bank_name = values.bankId;
        temp.bank_account_no = values.accountNumber;
        temp.bank_branch = values.branch;
        temp.bank_ifsccode = values.ifscCode;
        temp.pan_no = values.panNo;
        temp.aadhar = values.aadharNumber;
        temp.pf_no = values.pfNo;
        temp.uan_no = values.uanNumber;
        temp.passportno = values.passportNumber;
        temp.passportexpno = values.passportExpiryDate;
        temp.preferred_name_for_email = values.preferredName;
        temp.punched_card_status = "mandatory";
        temp.job_id = id;

        const empId = await axios
          .post(`/api/employee/EmployeeDetails`, temp)
          .then((res) => {
            return res.data.data.emp_id;
          })
          .catch((error) => {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: error.response ? error.response.data.message : "Error",
            });
            setAlertOpen(true);
          });

        const dataArray = new FormData();

        dataArray.append("file", values.fileName);
        dataArray.append("emp_id", empId);
        dataArray.append("image_file", values.imgFile);

        await axios
          .post(`/api/employee/employeeDetailsUploadFile`, dataArray)
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              axios
                .get(`/api/Roles`)
                .then((res) => {
                  setRoleOptions(
                    res.data.data.map((obj) => ({
                      value: obj.role_id,
                      label: obj.role_name,
                    }))
                  );
                })
                .catch((err) => console.error(err));

              axios
                .get(`/api/employee/EmployeeDetails/${empId}`)
                .then((res) => {
                  setUserValues((prev) => ({
                    ...prev,
                    employeeEmail: res.data.data.email,
                  }));
                })
                .catch((err) => console.error(err));

              setUserModalOpen(true);
            } else {
              setAlertMessage({
                severity: "error",
                message: res.data ? res.data.message : "Error Occured",
              });
            }
            setAlertOpen(true);
          })
          .catch((err) => console.error(err));
      };

      setConfirmContent({
        title: "",
        message: "Do you want to submit?",
        buttons: [
          { name: "Yes", color: "primary", func: sendPostData },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmOpen(true);
    }
  };

  const handleUserCreate = async () => {
    const getUserName = userValues.employeeEmail.split("@");
    const temp = {};
    temp.active = true;
    temp.username = getUserName[0];
    temp.email = userValues.employeeEmail;
    temp.usertype = "staff";
    temp.role_id = [userValues.roleId];
    setUserLoading(true);
    await axios
      .post(`/api/UserAuthentication`, temp)
      .then((res) => {
        setUserLoading(false);
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/employeeindex", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
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
  };

  const handleSalaryBreakup = () => {};
  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Grid container rowSpacing={1}>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setModalOpen(true)}
                  >
                    Applicant Details
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setSalaryBreakupOpen(true)}
                  >
                    Salary Breakup
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="joinDate"
                label="Date of joining"
                value={values.joinDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.joinDate}
                errors={errorMessages.joinDate}
                required
                maxDate={values.completeDate}
                disablePast
                disableFuture
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="endDate"
                label="Probationary End Date"
                value={values.endDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.endDate}
                errors={errorMessages.endDate}
                // maxDate={new Date(`12/31/${new Date().getFullYear() + 1}`)}
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
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="permanentAddress"
                label="Permanent Address"
                value={values.permanentAddress}
                handleChange={handleChange}
                multiline
                rows={3}
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
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="caste"
                label="Caste Category"
                value={values.caste}
                handleChange={handleChange}
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
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="jobCategoryId"
                label="Job Category"
                value={values.jobcategoryId}
                options={jobTypeOptions}
                handleChangeAdvance={handleChangeAdvance}
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
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="schoolId"
                label="Institute"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
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
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="reportId"
                label="Report To"
                value={values.reportId}
                options={reportOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="leaveApproverOneId"
                label="Leave approver 1"
                value={values.leaveApproverOneId}
                options={leaveApproverOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="leaveApproverTwoId"
                label="Leave approver 2"
                value={values.leaveApproverTwoId}
                options={leaveApproverOptions}
                handleChangeAdvance={handleChangeAdvance}
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
              <CustomTextField
                name="bankId"
                label="Bank"
                value={values.bankId}
                handleChange={handleChange}
                fullWidth
                errors={errorMessages.bankId}
                checks={checks.bankId}
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
                errors={errorMessages.branch}
                checks={checks.branch}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="accountNumber"
                label="Account Number"
                value={values.accountNumber}
                handleChange={handleChange}
                errors={errorMessages.accountNumber}
                checks={checks.accountNumber}
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
                errors={errorMessages.ifscCode}
                checks={checks.ifscCode}
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
                errors={errorMessages.panNo}
                checks={checks.panNo}
                required
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
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="passportExpiryDate"
                label="Passport Expiry Date"
                value={values.passportExpiryDate}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="preferredName"
                label="Preferred name for email & name display"
                value={values.preferredName}
                handleChange={handleChange}
                errors={errorMessages.preferredName}
                checks={checks.preferredName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="comments"
                multiline
                rows={2}
                label="Comments for CC Recipients"
                value={values.comments}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomSelect
                name="phdStatus"
                label="Phd Status"
                value={values.phdStatus}
                items={[
                  { value: "PhD holder", label: "PhD Holder" },
                  { value: "PhD pursuing", label: "PhD Pursuing" },
                ]}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="fileName"
                label="Upload NDA and NCA"
                helperText="PDF - smaller than 2 MB"
                file={values.fileName}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.fileName}
                errors={errorMessages.fileName}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="imgFile"
                label="Upload Photo"
                helperText="JPG - smaller than 2 MB"
                file={values.imgFile}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.imgFile}
                errors={errorMessages.imgFile}
              />
            </Grid>

            <Grid item xs={12} textAlign="right">
              {userValues.employeeEmail ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setUserModalOpen(true)}
                >
                  Assign Role
                </Button>
              ) : (
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
                    "Recruit"
                  )}
                </Button>
              )}
            </Grid>
          </Grid>
        </FormWrapper>
        <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
          <CandidateDetails data={data} />
        </ModalWrapper>
        <ModalWrapper
          open={userModalOpen}
          setOpen={setUserModalOpen}
          maxWidth={800}
          title="User Creation"
        >
          <Grid
            container
            justifyContent="flex-start"
            rowSpacing={3}
            columnSpacing={3}
            mt={2}
          >
            <Grid item xs={12} md={5}>
              <CustomTextField
                name="employeeEmail"
                label="Email"
                value={userValues.employeeEmail}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <CustomAutocomplete
                name="roleId"
                label="Role"
                value={userValues.roleId}
                options={roleOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.roleId}
                errors={errorMessages.roleId}
                required
              />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={userLoading}
                onClick={handleUserCreate}
              >
                {userLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Create"
                )}
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
        <ModalWrapper
          open={salaryBreakupOpen}
          setOpen={setSalaryBreakupOpen}
          maxWidth={800}
        >
          <SalaryBreakupView id={offerId} />
        </ModalWrapper>
      </Box>
    </>
  );
}

export default RecruitmentForm;
