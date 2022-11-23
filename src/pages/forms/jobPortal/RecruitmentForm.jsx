import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";
import CandidateDetails from "./CandidateDetails";

const initialValues = {
  joinDate: new Date(),
  endDate: null,
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
  bankId: null,
  bloodGroup: "",
  accountNumber: "",
  religion: null,
  caste: "",
  chiefProctorId: null,
  branch: "",
  panNo: "",
  pfNo: "",
  ifscCode: "",
  aadharNumber: "",
  uanNumber: "",
  passportExpiryDate: null,
  passportNumber: "",
  email: "",
  comments: "",
  competency: "",
  agreement: "",
  biometricStatus: "",
  fileName: "",
  imgFile: "",
};
const requiredFields = [
  "ifscCode",
  "panNo",
  "bankId",
  "aadharNumber",
  "phoneNumber",
  "emptypeId",
  "designationId",
  "reportId",
  "leaveApproverOneId",
  "leaveApproverTwoId",
  "schoolId",
  "bloodGroup",
  "jobcategoryId",
  "religion",
];

function RecruitmentForm() {
  const [values, setValues] = useState(initialValues);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [leaveApproverOneOptions, setLeaveApproverOneOptions] = useState([]);
  const [leaveApproverTwoOptions, setLeaveApproverTwoOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const { id, offerId } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    branch: [values.branch !== "", /^[A-Za-z ]+$/.test(values.branch)],
    ifscCode: [
      values.ifscCode !== "",
      /^[0-9a-zA-Za-z]{11}$/.test(values.ifscCode),
    ],
    panNo: [
      values.panNo !== "",
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNo),
    ],

    email: [
      values.email !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
    ],
    accountNumber: [
      values.accountNumber !== "",
      /^[0-9a-zA-Za-z]{8,18}$/.test(values.accountNumber),
    ],
    phoneNumber: [
      values.phoneNumber !== "",
      /^[0-9]{10}$/.test(values.phoneNumber),
    ],

    aadharNumber: [
      values.aadharNumber !== "",
      /^[0-9]{12}$/.test(values.aadharNumber),
    ],
    bloodGroup: [values.bloodGroup !== ""],
  };
  const errorMessages = {
    branch: ["This field required", "Enter Only Characters"],
    ifscCode: ["This field required", "Invalid IFSC"],
    panNo: ["This field required", "Invalid PAN"],
    email: ["This field is required", "Invalid email"],
    accountNumber: ["This field is required", "Invalid account number"],
    phoneNumber: ["This field is required", "Invalid Phone"],

    aadharNumber: ["This field is required", "Invalid Aadhar"],
    bloodGroup: ["This field is required"],
  };

  useEffect(() => {
    getShiftDetails();
    getEmptypeDetails();
    getJobtypeDetails();
    getBankDetails();
    getDesignationDetails();
    getLeaveApproverOne();
    getLeaveApproverTwo();
    getProctorDetails();
    getSchoolDetails();
    getReportDetails();
    getOfferDetails();
    handleDetails();
  }, [pathname]);

  const handleDetails = async () => {
    await axios
      .get(`${ApiUrl}/employee/getAllApplicantDetails/${id}`)
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
        }));
      })
      .catch((err) => console.error(err));
  };

  const getOfferDetails = async () => {
    await axios
      .get(`${ApiUrl}/employee/fetchAllOfferDetails/${offerId}`)
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
        getDepartmentDetails(res.data.data[0].school_id);
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

  const getShiftDetails = async () => {
    await axios
      .get(`${ApiUrl}/employee/Shift`)
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
      .get(`${ApiUrl}/employee/EmployeeType`)
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
      .get(`${ApiUrl}/employee/JobType`)
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

  const getBankDetails = async () => {
    await axios
      .get(`${ApiUrl}/finance/Bank`)
      .then((res) => {
        setBankOptions(
          res.data.data.map((obj) => ({
            value: obj.bank_id,
            label: obj.bank_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getDesignationDetails = async () => {
    await axios
      .get(`${ApiUrl}/employee/Designation`)
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
      .get(`${ApiUrl}/employee/EmployeeDetails`)
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

  const getLeaveApproverOne = async () => {
    await axios
      .get(`${ApiUrl}/employee/EmployeeDetails`)
      .then((res) => {
        setLeaveApproverOneOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.leave_approver1,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getLeaveApproverTwo = async () => {
    await axios
      .get(`${ApiUrl}/employee/EmployeeDetails`)
      .then((res) => {
        setLeaveApproverTwoOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.leave_approver2,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProctorDetails = async () => {
    await axios
      .get(`${ApiUrl}/employee/activeEmployeeDetailsForProctor`)
      .then((res) => {
        setProctorOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employee_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`${ApiUrl}/institute/school`)
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

  const getDepartmentDetails = async (id) => {
    await axios
      .get(`${ApiUrl}/fetchdept1/${id}`)
      .then((res) => {
        setDepartmentOptions(
          res.data.data.map((obj) => ({
            value: obj.dept_id,
            label: obj.dept_name,
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
    if (name === "endDate") {
      const fromDate = new Date(
        newValue.$d.getMonth() +
          1 +
          "/" +
          newValue.$d.getDate() +
          "/" +
          newValue.$d.getFullYear()
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
    }

    if (name === "schoolId") {
      await axios
        .get(`${ApiUrl}/fetchdept1/${newValue}`)
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
      temp.email = values.email;
      temp.punched_card_status = "mandatory";

      const employeeId = await axios
        .post(`${ApiUrl}/employee/EmployeeDetails`, temp)
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
      dataArray.append("emp_id", employeeId);
      dataArray.append("image_file", values.imgFile);

      await axios
        .post(`${ApiUrl}/employee/employeeDetailsUploadFile`, dataArray, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/EmployeeIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Bank Created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
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
                <Link
                  to={`/SalaryBreakupPrint/${id}/${offerId}`}
                  target="blank"
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="contained" size="small">
                    Salary Breakup
                  </Button>
                </Link>
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
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="probationary"
              label="Probationary Period"
              value={values.probationary}
              handleChange={handleChange}
              helperText="Days"
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
              options={leaveApproverOneOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="leaveApproverTwoId"
              label="Leave approver 2"
              value={values.leaveApproverTwoId}
              options={leaveApproverTwoOptions}
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
              name="bankId"
              label="Bank"
              value={values.bankId}
              options={bankOptions}
              handleChangeAdvance={handleChangeAdvance}
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
              name="email"
              label="Preferred name for email & display"
              value={values.email}
              handleChange={handleChange}
              errors={errorMessages.email}
              checks={checks.email}
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
            <CustomFileInput
              name="fileName"
              label="Upload NDA and NCA"
              helperText="PDF - smaller than 2 MB"
              file={values.fileName}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomFileInput
              name="imgFile"
              label="Upload Photo"
              helperText="PDF - smaller than 2 MB"
              file={values.imgFile}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="success"
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
                <strong>Recruit</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <CandidateDetails data={data} />
      </ModalWrapper>
    </Box>
  );
}

export default RecruitmentForm;
