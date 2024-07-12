import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import religionList from "../../../utils/ReligionList";

const FormPaperWrapper = lazy(() =>
  import("../../../components/FormPaperWrapper")
);

const initialValues = {
  employeeName: "",
  doj: null,
  shiftId: null,
  proctorHeadId: null,
  reportId: null,
  leaveApproverOneId: null,
  leaveApproverTwoId: null,
  storeIndentApproverOne: null,
  storeIndentApproverTwo: null,
  phdStatus: "",
  preferredName: "",
  currentLocation: "",
  permanentAddress: "",
  phoneNumber: "",
  alternatePhoneNumber: "",
  gender: "",
  martialStatus: "",
  spouseName: "",
  dob: null,
  bloodGroup: "",
  religion: null,
  caste: "",
  bankId: "",
  accountNumber: "",
  bankAccountName: "",
  bankBranch: "",
  bankIfscCode: "",
  aadharNumber: "",
  panNo: "",
  uanNo: "",
  biometricStatus: "",
  pfNo: "",
  dlNo: "",
  dlexpDate: null,
  passportNumber: "",
  passportExpiryDate: null,
};

const requiredFields = [
  "employeeName",
  "doj",
  "shiftId",
  "reportId",
  "leaveApproverOneId",
  "leaveApproverTwoId",
  "storeIndentApproverOne",
  "storeIndentApproverTwo",
  "preferredName",
  "currentLocation",
  "permanentAddress",
  "phoneNumber",
  "alternatePhoneNumber",
  "gender",
  "martialStatus",
  "dob",
  "bloodGroup",
  "religion",
  "caste",
  "aadharNumber",
  "panNo",
  "uanNo",
  "biometricStatus",
];

function EmployeeUpdateForm() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id, offerId, jobId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    employeeName: [values.employeeName !== ""],
    preferredName: [
      values.preferredName !== "",
      /^[a-zA-Z0-9]*$/.test(values.preferredName),
    ],
    currentLocation: [values.currentLocation !== ""],
    permanentAddress: [values.permanentAddress !== ""],
    phoneNumber: [
      values.phoneNumber !== "",
      /^[0-9]{10}$/.test(values.phoneNumber),
    ],
    alternatePhoneNumber: [
      values.alternatePhoneNumber !== "",
      /^[0-9]{10}$/.test(values.alternatePhoneNumber),
      values.alternatePhoneNumber != values.phoneNumber,
    ],
    bloodGroup: [values.bloodGroup !== ""],
    caste: [values.caste !== ""],
    aadharNumber: [
      values.aadharNumber !== "",
      /^[0-9]{12}$/.test(values.aadharNumber),
    ],
    uanNo: [values.uanNo !== "", /^[0-9]{12}$/.test(values.uanNo)],
    panNo: [
      values.panNo !== "",
      /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(values.panNo),
    ],
  };

  const errorMessages = {
    employeeName: ["This field is required"],
    preferredName: [
      "This field is required",
      "Special characters and space is not allowed",
    ],
    currentLocation: ["This field is required"],
    permanentAddress: ["This field is required"],
    phoneNumber: ["This field is required", "Invalid Phone"],
    alternatePhoneNumber: [
      "This field is required",
      "Invalid Phone",
      "This number is already given as phone number",
    ],
    bloodGroup: ["This field is required"],
    caste: ["This field is required"],
    aadharNumber: ["This field is required", "Invalid Aadhar"],
    uanNo: ["This field is required", "Invalid UAN No"],
    panNo: ["This field required", "Invalid PAN No."],
  };

  useEffect(() => {
    getData();
    getJobtypeDetails();
    getProctorDetails();
    getReportDetails();
    setCrumbs([
      {
        name: "Employee Details",
        link: "/EmployeeIndex",
      },
    ]);
  }, []);

  useEffect(() => {
    getShiftDetails();
  }, [values.schoolId]);

  useEffect(() => {
    if (values.jobCategoryId && jobTypeOptions.length > 0) {
      const getJobType = jobTypeOptions.filter(
        (obj) => obj.value === values.jobCategoryId
      );

      console.log("getJobType", getJobType);
      if (getJobType[0].label.toLowerCase() !== "non teaching") {
        requiredFields.push("proctorHeadId");

        checks["proctorHeadId"] = [values.proctorHeadId !== null];
        errorMessages["proctorHeadId"] = ["This field is required"];
      }
    }
  }, [values.jobCategoryId]);

  console.log("values", jobTypeOptions);
  const getData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${id}`)
      .then((res) => {
        const data = res.data.data[0];
        console.log("data", data);

        setValues((prev) => ({
          ...prev,
          employeeName: data.employee_name,
          doj: data.date_of_joining,
          schoolId: data.school_id,
          shiftId: parseInt(data.shift_category_id),
          jobCategoryId: data.job_type_id,
          proctorHeadId: data.chief_proctor_id,
          reportId: parseInt(data.report_id),
          leaveApproverOneId: data.leave_approver1_emp_id,
          leaveApproverTwoId: data.leave_approver2_emp_id,
          storeIndentApproverOne: parseInt(data.store_indent_approver1),
          storeIndentApproverTwo: parseInt(data.store_indent_approver2),
          phdStatus: data.phd_status,
          preferredName: data.preferred_name_for_email,
          currentLocation: data.current_location,
          permanentAddress: data.hometown,
          phoneNumber: data.mobile,
          alternatePhoneNumber: data.alt_mobile_no,
          gender: data.gender,
          martialStatus: data.martial_status,
          spouseName: data.spouse_name ?? "",
          dob: data.dateofbirth,
          bloodGroup: data.blood_group,
          religion: data.religion,
          caste: data.caste_category,
          bankId: data.bank_id ?? "",
          accountNumber: data.bank_account_no ?? "",
          bankAccountName: data.bank_account_holder_name ?? "",
          bankBranch: data.bank_branch ?? "",
          bankIfscCode: data.bank_ifsccode ?? "",
          aadharNumber: data.aadhar,
          panNo: data.pan_no,
          uanNo: data.uan_no,
          biometricStatus: data.punched_card_status,
          pfNo: data.pf_no ?? "",
          dlNo: data.dlno ?? "",
          dlexpDate: data.dlexpno,
          passportNumber: data.passportno ?? "",
          passportExpiryDate: data.passportexpno ?? "",
        }));

        setData(data);
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

  const getShiftDetails = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/employee/shiftDetailsBasedOnSchoolId/${values.schoolId}`)
        .then((res) => {
          const optionData = [];
          res.data.data.forEach((obj) => {
            optionData.push({
              value: obj.id,
              label:
                obj.shiftName +
                " ( " +
                obj.shiftStartTime?.slice(0, 5) +
                " - " +
                obj.shiftEndTime?.slice(0, 5) +
                " ) ",
            });
          });
          setShiftOptions(optionData);
        })
        .catch((err) => console.error(err));
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

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) {
        console.log("field", field);
        return false;
      }
    }
    return true;
  };

  const handleCreate = async () => {
    const updateData = { ...data };
    updateData.employee_name = values.employeeName;
    updateData.shift_category_id = values.shiftId;
    updateData.chief_proctor_id = values.proctorHeadId;
    updateData.report_id = values.reportId;
    updateData.leave_approver1_emp_id = values.leaveApproverOneId;
    updateData.leave_approver2_emp_id = values.leaveApproverTwoId;
    updateData.store_indent_approver1 = values.storeIndentApproverOne;
    updateData.store_indent_approver2 = values.storeIndentApproverTwo;
    updateData.phd_status = values.phdStatus;
    updateData.preferred_name_for_email = values.preferredName;
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
    updateData.bank_id = values.bankId;
    updateData.bank_account_no = values.accountNumber;
    updateData.bank_account_holder_name = values.bankAccountName;
    updateData.bank_branch = values.bankBranch;
    updateData.bank_ifsccode = values.bankIfscCode;
    updateData.aadhar = values.aadharNumber;
    updateData.pan_no = values.panNo;
    updateData.uan_no = values.uanNo;
    updateData.punched_card_status = values.biometricStatus;
    updateData.pf_no = values.pfNo;
    updateData.dlno = values.dlNo;
    updateData.dlexpno = values.dlexpDate;
    updateData.passportno = values.passportNumber;
    updateData.passportexpno = values.passportExpiryDate;

    const temp = { ...data };

    // data.employee_name === values.employeeName
    //   ? (temp.employee_name = values.employeeName)
    //   : (temp.employee_name = `<font color='blue'>${values.employeeName}</font>`);

    // data.shift_category_id === values.shiftId
    //   ? (temp.employee_name = values.employeeName)
    //   : (temp.employee_name = `<font color='blue'>${values.employeeName}</font>`);

    await axios
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
          message: putErr.response ? putErr.response.data.message : "Error",
        });
        setAlertOpen(true);
        navigate("/employeeindex", { replace: true });
      });
  };

  return (
    <Box p={1}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10}>
          <FormPaperWrapper>
            <Grid container rowSpacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Employment Details"
                    titleTypographyProps={{ variant: "subtitle2" }}
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      padding: 1,
                    }}
                  />
                  <CardContent sx={{ padding: { md: 3 } }}>
                    <Grid container columnSpacing={2} rowSpacing={4}>
                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
                        <CustomDatePicker
                          name="doj"
                          label="Date of joining"
                          value={values.doj}
                          handleChangeAdvance={handleChangeAdvance}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="shiftId"
                          label="Shift"
                          value={values.shiftId}
                          options={shiftOptions}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="proctorHeadId"
                          label="Proctor Head"
                          value={values.proctorHeadId}
                          options={proctorOptions}
                          handleChangeAdvance={handleChangeAdvance}
                          required={
                            requiredFields.includes("proctorHeadId") === true
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="reportId"
                          label="Report To"
                          value={values.reportId}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="leaveApproverOneId"
                          label="Leave approver 1"
                          value={values.leaveApproverOneId}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeAdvance}
                          disabled={values.isConsutant}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="leaveApproverTwoId"
                          label="Leave approver 2"
                          value={values.leaveApproverTwoId}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeAdvance}
                          disabled={values.isConsutant}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="storeIndentApproverOne"
                          label="Store Indent Approver 1"
                          value={values.storeIndentApproverOne}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="storeIndentApproverTwo"
                          label="Store Indent Approver 2"
                          value={values.storeIndentApproverTwo}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Additional Personal Details"
                    titleTypographyProps={{ variant: "subtitle2" }}
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      padding: 1,
                    }}
                  />
                  <CardContent sx={{ padding: { md: 3 } }}>
                    <Grid container columnSpacing={2} rowSpacing={4}>
                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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
                          <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                          name="religion"
                          label="Religion"
                          value={values.religion}
                          options={religionList}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="bankId"
                          label="Bank"
                          value={values.bankId}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="accountNumber"
                          label="Account Number"
                          value={values.accountNumber}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="bankAccountName"
                          label="Account Holder Name"
                          value={values.bankAccountName}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="bankBranch"
                          label="Bank Branch"
                          value={values.bankBranch}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="bankIfscCode"
                          label="IFSC Code"
                          value={values.bankIfscCode}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="panNo"
                          label="PAN No"
                          value={values.panNo}
                          handleChange={handleChange}
                          checks={
                            values.panNo === "PANAPPLIED" ? [] : checks.panNo
                          }
                          errors={
                            values.panNo === "PANAPPLIED"
                              ? []
                              : errorMessages.panNo
                          }
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
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

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="pfNo"
                          label="PF No"
                          value={values.pfNo}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="dlNo"
                          label="DL No"
                          value={values.dlNo}
                          handleChange={handleChange}
                        />
                      </Grid>

                      {values.dlNo ? (
                        <Grid item xs={12} md={3}>
                          <CustomDatePicker
                            name="dlexpDate"
                            label="DL Expiry Date"
                            value={values.dlexpDate}
                            handleChangeAdvance={handleChangeAdvance}
                          />
                        </Grid>
                      ) : (
                        <></>
                      )}

                      <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="passportNumber"
                          label="Passport Number"
                          value={values.passportNumber}
                          handleChange={handleChange}
                        />
                      </Grid>

                      {values.passportNumber ? (
                        <Grid item xs={12} md={3}>
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
                    </Grid>
                  </CardContent>
                </Card>
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmployeeUpdateForm;
