import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomModal from "../../../components/CustomModal";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import SalaryBreakupView from "../../../components/SalaryBreakupView";
import CandidateDetailsView from "../../../components/CandidateDetailsView";
import religionList from "../../../utils/ReligionList";

const initialValues = {
  joinDate: new Date(),
  endDate: new Date().setFullYear(new Date().getFullYear() + 1),
  probationary: "",
  permanentAddress: "",
  currentLocation: "",
  phoneNumber: "",
  alternatePhoneNumber: "",
  designationId: null,
  jobCategoryId: null,
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
  accountHolderName: "",
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
  fromDate: "",
  toDate: "",
  salaryStructure: "",
  isConsutant: false,
  consolidatedAmount: "",
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
  "jobCategoryId",
  "emptypeId",
  "schoolId",
  "deptId",
  "shiftId",
  "reportId",
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
];

function RecruitmentForm() {
  const [values, setValues] = useState(initialValues);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
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
  const [offerData, setOfferData] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [salaryBreakUpData, setSalaryBreakUpData] = useState([]);

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
    religion: [values.religion !== null],
    caste: [values.caste !== ""],
    designationId: [values.designationId !== null],
    jobCategoryId: [values.jobCategoryId !== null],
    emptypeId: [values.emptypeId !== null],
    schoolId: [values.schoolId !== null],
    deptId: [values.deptId !== null],
    shiftId: [values.shiftId !== null],
    reportId: [values.reportId !== null],
    leaveApproverOneId: [values.leaveApproverOneId !== null],
    leaveApproverTwoId: [values.leaveApproverTwoId !== null],
    bloodGroup: [values.bloodGroup !== ""],
    bankId: [values.bankId !== ""],
    branch: [values.branch !== "", /^[A-Za-z ]+$/.test(values.branch)],
    accountHolderName: [values.accountHolderName !== ""],
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
    caste: ["This field is required"],
    designationId: ["This field is required"],
    jobCategoryId: ["This field is required"],
    emptypeId: ["This field is required"],
    schoolId: ["This field is required"],
    deptId: ["This field is required"],
    shiftId: ["This field is required"],
    reportId: ["This field is required"],
    leaveApproverOneId: ["This field is required"],
    leaveApproverTwoId: ["This field is required"],
    bloodGroup: ["This field is required"],
    bankId: ["This field is required"],
    branch: ["This field required"],
    accountHolderName: ["This field is required"],
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

  if (values.isConsutant === false) {
    checks["proctorHeadId"] = [values.proctorHeadId !== null];
    errorMessages["proctorHeadId"] = ["This field is required"];
  }

  useEffect(() => {
    getShiftDetails();
    getEmptypeDetails();
    getJobtypeDetails();
    getDesignationDetails();
    getProctorDetails();
    getSchoolDetails();
    getReportDetails();
    getOfferDetails();
    handleDetails();
    getDays(new Date(values.endDate));
    getBankDetails();
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

  const handleDetails = async () => {
    await axios
      .get(`/api/employee/getAllApplicantDetails/${id}`)
      .then((res) => {
        setData(res.data.Job_Profile);

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
        navigate("/jobportal", { replace: true });
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
          jobCategoryId: res.data.data[0].job_type_id,
          emptypeId: res.data.data[0].emp_type_id,
          fromDate: res.data.data[0].from_date,
          toDate: res.data.data[0].to_date,
          salaryStructure: res.data.data[0].salary_structure_id,
          isConsutant: res.data.data[0].employee_type === "CON" ? true : false,
          consolidatedAmount: res.data.data[0].consolidated_amount,
          leaveApproverOneId: res.data.data[0].report_id,
          leaveApproverTwoId: res.data.data[0].report_id,
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

        if (res.data.data[0].employee_type !== "CON") {
          ["proctorHeadId", "fileName", "imgFile"].forEach((obj) => {
            requiredFields.push(obj);
          });
        }

        if (res.data.data[0].employee_type !== "CON") {
          axios
            .get(
              `/api/finance/getFormulaDetails/${res.data.data[0].salary_structure_id}`
            )
            .then((res) => {
              const earningTemp = [];
              const deductionTemp = [];
              const managementTemp = [];

              res.data.data
                .sort((a, b) => {
                  return a.priority - b.priority;
                })
                .map((obj) => {
                  if (obj.category_name_type === "Earning") {
                    earningTemp.push({
                      name: obj.voucher_head,
                      monthly: Math.round(
                        offerData[obj.salaryStructureHeadPrintName]
                      ),
                      yearly: Math.round(
                        offerData[obj.salaryStructureHeadPrintName] * 12
                      ),
                      priority: obj.priority,
                    });
                  } else if (obj.category_name_type === "Deduction") {
                    deductionTemp.push({
                      name: obj.voucher_head,
                      monthly: Math.round(
                        offerData[obj.salaryStructureHeadPrintName]
                      ),
                      yearly: Math.round(
                        offerData[obj.salaryStructureHeadPrintName] * 12
                      ),
                      priority: obj.priority,
                    });
                  } else if (obj.category_name_type === "Management") {
                    managementTemp.push({
                      name: obj.voucher_head,
                      monthly: Math.round(
                        offerData[obj.salaryStructureHeadPrintName]
                      ),
                      yearly: Math.round(
                        offerData[obj.salaryStructureHeadPrintName] * 12
                      ),
                      priority: obj.priority,
                    });
                  }
                });

              const temp = {};
              temp["earnings"] = earningTemp;
              temp["deductions"] = deductionTemp;
              temp["management"] = managementTemp;
              temp["grossEarning"] =
                temp.earnings.length > 0
                  ? temp.earnings
                      .map((te) => te.monthly)
                      .reduce((a, b) => a + b)
                  : 0;
              temp["totDeduction"] =
                temp.deductions.length > 0
                  ? temp.deductions
                      .map((te) => te.monthly)
                      .reduce((a, b) => a + b)
                  : 0;
              temp["totManagement"] =
                temp.management.length > 0
                  ? temp.management
                      .map((te) => te.monthly)
                      .reduce((a, b) => a + b)
                  : 0;
              setSalaryBreakUpData(temp);
            })
            .catch((err) => console.error(err));
        }

        setOfferData(res.data.data[0]);
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
            value: obj.shift_category_id,
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
            label: obj.empType,
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
            label: obj.job_type,
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

    if (name === "reportId" && values.isConsutant === true) {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
        ["leaveApproverOneId"]: newValue,
        ["leaveApproverTwoId"]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
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

  const html =
    Object.values(salaryBreakUpData).length > 0
      ? `
<html>
<head>
</head>
<body>
<table>
<tr><th colspan='2' style='text-align:center;background-color: #4A57A9;color:white;'>Salary Breakup</th></tr>
<tr><th colspan='2'>Earnings</th></tr>` +
        salaryBreakUpData.earnings
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .map((obj) => {
            return `<tr><td style='text-transform: capitalize;'>${obj.name.toLowerCase()}</td><td style='text-align:right'>${obj.monthly.toFixed()}</td></tr>`;
          })
          .join("") +
        `
<tr><th>Gross Earning</th><td style='text-align:right'>` +
        salaryBreakUpData.grossEarning.toFixed() +
        `</tr>
<tr><th colspan='2'>Deductions</th></tr>` +
        salaryBreakUpData.deductions
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .map((obj) => {
            return `<tr><td style='text-transform: capitalize;'>${obj.name.toLowerCase()}</td><td style='text-align:right'>${obj.monthly.toFixed()}</td></tr>`;
          })
          .join("") +
        `<tr><th>Total Deductions</th><td style='text-align:right'>` +
        salaryBreakUpData.totDeduction.toFixed() +
        `</td><tr><th colspan='2'> Management Contribution</th></tr> ` +
        salaryBreakUpData.management
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .map((obj) => {
            return `<tr><td style='text-transform: capitalize;'>${obj.name.toLowerCase()}</td><td style='text-align:right'>${obj.monthly.toFixed()}</td></tr>`;
          })
          .join("") +
        ` <tr><th>Cost to Company</th><td style='text-align:right'>` +
        (
          salaryBreakUpData.grossEarning + salaryBreakUpData.totManagement
        ).toFixed() +
        `</tr><tr><th>Net Pay</th><td style='text-align:right'>` +
        (
          salaryBreakUpData.grossEarning - salaryBreakUpData.totDeduction
        ).toFixed() +
        `</tr>
</table>

</html>
</body>
`
      : "";

  const handleCreate = (e) => {
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
        temp.aadhar = values.aadharNumber;
        temp.alt_mobile_no = values.alternatePhoneNumber;
        temp.annual_salary = offerData["basic"];
        temp.bank_account_holder_name = values.accountHolderName;
        temp.bank_account_no = values.accountNumber;
        temp.bank_branch = values.branch;
        temp.bank_ifsccode = values.ifscCode;
        temp.bank_id = values.bankId;
        temp.blood_group = values.bloodGroup;
        temp.caste_category = values.caste;
        temp.cca = offerData["cca"];
        temp.cea = offerData["cea"];
        temp.cha = offerData["cha"];
        temp.chief_proctor_id = values.proctorHeadId;
        if (values.isConsutant === true) {
          temp.consolidated_amount = offerData["consolidated_amount"];
          temp.contract_emp_type = offerData["consultant_emp_type"];
        }
        temp.ctc = offerData["ctc"];
        temp.current_location = values.currentLocation;
        temp.da = offerData["da"];
        temp.date_of_joining = values.joinDate;
        temp.dateofbirth = data.dateofbirth;
        temp.dept_id = values.deptId;
        temp.designation_id = values.designationId;
        temp.emp_type_id = values.emptypeId;
        temp.employee_name = data.firstname;
        temp.father_name = data.father_name;
        temp.fr = offerData["fr"];
        temp.from_date = values.fromDate;
        temp.to_date = values.toDate;
        temp.gender = data.gender;
        temp.grosspay_ctc = offerData["gross"];
        temp.hometown = values.permanentAddress;
        temp.hra = offerData["hra"];
        temp.job_id = id;
        temp.job_type_id = values.jobCategoryId;
        temp.key_skills = data.key_skills;
        temp.leave_approver1_emp_id = values.leaveApproverOneId;
        temp.leave_approver2_emp_id = values.leaveApproverTwoId;
        temp.martial_status = data.martial_status;
        temp.me = offerData["me"];
        temp.mobile = values.phoneNumber;
        temp.mr = offerData["mr"];
        temp.net_pay = offerData["net_pay"];
        temp.other_allow = offerData["other_allow"];
        temp.pan_no = values.panNo;
        temp.passportno = values.passportNumber;
        temp.passportexpno = values.passportExpiryDate;
        temp.pf_no = values.pfNo;
        temp.preferred_name_for_email = values.preferredName;
        temp.punched_card_status = "mandatory";
        temp.religion = values.religion;
        temp.report_id = values.reportId;
        temp.salary_structure_id = values.salaryStructure;
        temp.school_id = values.schoolId;
        temp.school = schoolOptions
          .filter((fil) => fil.value === values.schoolId)
          .map((obj) => obj.label)
          .toString();
        temp.shift_category_id = values.shiftId;
        temp.spl_1 = offerData["spl_1"];
        temp.store_indent_approver1 = values.leaveApproverTwoId;
        temp.store_indent_approver2 = values.leaveApproverTwoId;
        temp.ta = offerData["ta"];
        temp.uan_no = values.uanNumber;
        temp.phd_status = values.phdStatus;
        temp.salary_approve_status = true;

        await axios
          .post(`/api/employee/EmployeeDetails`, temp)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              if (values.fileName && values.imgFile) {
                const dataArray = new FormData();

                dataArray.append("file", values.fileName);
                dataArray.append("emp_id", res.data.data.emp_id);
                dataArray.append("image_file", values.imgFile);

                axios
                  .post(`/api/employee/employeeDetailsUploadFile`, dataArray)
                  .then((res) => {})
                  .catch((err) => {
                    setAlertMessage({
                      severity: "error",
                      message:
                        "Some thing went wrong !! unable to  uploaded the documents",
                    });
                    setAlertOpen(true);
                    setLoading(false);
                  });
              }

              const salaryTemp = {};
              salaryTemp.job_id = id;
              salaryTemp.emp_id = res.data.data.emp_id;
              salaryTemp.salary_structure_email_content = html;

              axios
                .post(
                  `/api/employee/emailToStaffsRegardingNewRecruit`,
                  salaryTemp
                )
                .then((res1) => {
                  if (res1.status === 200) {
                    axios
                      .get(`/api/Roles`)
                      .then((res2) => {
                        setRoleOptions(
                          res2.data.data.map((obj) => ({
                            value: obj.role_id,
                            label: obj.role_name,
                          }))
                        );
                      })
                      .catch((err) => {
                        setAlertMessage({
                          severity: "error",
                          message:
                            "Some thing went wrong !! unable to  load  role deatils",
                        });
                        setAlertOpen(true);
                        setLoading(false);
                      });

                    axios
                      .get(
                        `/api/employee/EmployeeDetails/${res.data.data.emp_id}`
                      )
                      .then((res3) => {
                        setUserValues((prev) => ({
                          ...prev,
                          employeeEmail: res3.data.data[0].email,
                        }));
                      })
                      .catch((err) => {
                        setAlertMessage({
                          severity: "error",
                          message:
                            "Some thing went wrong !! unable to  load Employee Details",
                        });
                        setAlertOpen(true);
                        setLoading(false);
                      });

                    setUserModalOpen(true);
                  }
                })
                .catch((err) => {
                  setAlertMessage({
                    severity: "error",
                    message:
                      "Some thing went wrong !! unable to  send the mail",
                  });
                  setAlertOpen(true);
                  setLoading(false);
                });
            } else {
              setLoading(false);
              setAlertMessage({
                severity: "error",
                message: "Something went wrong !!",
              });
              setAlertOpen(true);
            }
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response ? err.response.data.message : "Error",
            });
            setAlertOpen(true);
          });
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
          setAlertOpen(true);
          navigate("/employeeindex", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
          setAlertOpen(true);
        }
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

                {values.isConsutant === false ? (
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setSalaryBreakupOpen(true)}
                    >
                      Salary Breakup
                    </Button>
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="joinDate"
                label="Date of joining"
                value={values.joinDate}
                handleChangeAdvance={handleChangeAdvance}
                maxDate={values.completeDate}
                disablePast
                disableFuture
                checks={checks.joinDate}
                errors={errorMessages.joinDate}
                required
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
                label="WhatsApp number"
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
                options={religionList}
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
                name="reportId"
                label="Report To"
                value={values.reportId}
                options={reportOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.reportId}
                errors={errorMessages.reportId}
                disabled={values.isConsutant}
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

            {jobTypeOptions
              .filter((obj) => obj.value === values.jobCategoryId)
              .map((obj1) => obj1.label)
              .toString()
              .toLowerCase() !== "non teaching" ? (
              <>
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
              </>
            ) : (
              <></>
            )}

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
                checks={checks.bankId}
                errors={errorMessages.bankId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="branch"
                label="Bank Branch Name"
                value={values.branch}
                handleChange={handleChange}
                checks={checks.branch}
                errors={errorMessages.branch}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="accountHolderName"
                label="Account Holder Name"
                value={values.accountHolderName}
                handleChange={handleChange}
                checks={checks.accountHolderName}
                errors={errorMessages.accountHolderName}
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
                name="ifscCode"
                label="IFSC Code"
                value={values.ifscCode}
                handleChange={handleChange}
                checks={checks.ifscCode}
                errors={errorMessages.ifscCode}
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
                name="aadharNumber"
                label="Aadhar Number"
                value={values.aadharNumber}
                handleChange={handleChange}
                checks={checks.aadharNumber}
                errors={errorMessages.aadharNumber}
                inputProps={{ maxLength: 12 }}
                required
              />
            </Grid>

            {values.isConsutant === false ? (
              <>
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

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="comments"
                label="Comments for CC Recipients"
                value={values.comments}
                handleChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

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

            {values.isConsutant ? (
              <>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="consolidatedAmount"
                    label="Consolidated Amount"
                    value={values.consolidatedAmount}
                    handleChange={handleChange}
                    disabled
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}

            <Grid item xs={12}>
              <Grid container rowSpacing={3} columnSpacing={4}>
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
              </Grid>
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
          <CandidateDetailsView id={id} />
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
