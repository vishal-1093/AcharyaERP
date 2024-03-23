import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Stack,
} from "@mui/material";
import logo from "../../../assets/logo1.png";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router";
import useAlert from "../../../hooks/useAlert";
import religionList from "../../../utils/ReligionList";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));
const CustomModal = lazy(() => import("../../../components/CustomModal"));
const CandidateDetailsView = lazy(() =>
  import("../../../components/CandidateDetailsView")
);
const SalaryBreakupView = lazy(() =>
  import("../../../components/SalaryBreakupView")
);

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
  bloodGroup: "",
  religion: null,
  caste: "",
  panNo: "",
  aadharNumber: "",
  uanNumber: "",
  preferredName: "",
  phdStatus: "",
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
  "bloodGroup",
  "religion",
  "caste",
  "panNo",
  "aadharNumber",
  "preferredName",
];

function RecruitmentForm() {
  const [values, setValues] = useState(initialValues);
  const [salaryBreakupOpen, setSalaryBreakupOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [empTypeOptions, setEmpTypeOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [salaryBreakUpData, setSalaryBreakUpData] = useState([]);
  const [data, setData] = useState([]);
  const [userValues, setUserValues] = useState(userInitialValues);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const { id, offerId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

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
    panNo: [
      values.panNo !== "",
      /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(values.panNo),
    ],
    aadharNumber: [
      values.aadharNumber !== "",
      /^[0-9]{12}$/.test(values.aadharNumber),
    ],
    uanNumber: [values.uanNumber !== "", /^[0-9]{12}$/.test(values.uanNumber)],
    preferredName: [
      values.preferredName !== "",
      /^[a-zA-Z0-9]*$/.test(values.preferredName),
    ],
    comments: [values.comments !== ""],
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
    panNo: ["This field required", "Invalid PAN No."],
    aadharNumber: ["This field is required", "Invalid Aadhar"],
    uanNumber: ["This field is required", "Invalid UAN No."],
    preferredName: [
      "This field is required",
      "Special characters and space is not allowed",
    ],
    comments: ["This field is required"],
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
  }, [pathname]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  useEffect(() => {
    if (values.jobCategoryId && jobTypeOptions.length > 0) {
      const getJobType = jobTypeOptions.filter(
        (obj) => obj.value === values.jobCategoryId
      );

      if (getJobType[0].label.toLowerCase() !== "non teaching") {
        ["proctorHeadId"].forEach((obj) => {
          requiredFields.push(obj);
        });
      }
    }
  }, [values.jobCategoryId]);

  useEffect(() => {
    if (values.joinDate && values.endDate) {
      const oneDay = 1000 * 60 * 60 * 24;

      const timeDifference =
        new Date(values.endDate).getTime() -
        new Date(values.joinDate).getTime();

      const dateDifference = Math.round(timeDifference / oneDay) + 1;

      setValues((prev) => ({
        ...prev,
        probationary: dateDifference,
      }));
    }
  }, [values.joinDate, values.endDate]);

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

  const getOfferDetails = async () => {
    await axios
      .get(`/api/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => {
        const offerTempData = res.data.data[0];

        setValues((prev) => ({
          ...prev,
          designationId: offerTempData.designation_id,
          schoolId: offerTempData.school_id,
          deptId: offerTempData.dept_id,
          reportId: offerTempData.report_id,
          jobCategoryId: offerTempData.job_type_id,
          emptypeId: offerTempData.emp_type_id,
          fromDate: offerTempData.from_date,
          toDate: offerTempData.to_date,
          salaryStructure: offerTempData.salary_structure_id,
          isConsutant: offerTempData.employee_type === "CON" ? true : false,
          consolidatedAmount: offerTempData.consolidated_amount,
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
            name: offerTempData.firstname,
          },
        ]);

        if (offerTempData.employee_type !== "CON") {
          axios
            .get(
              `/api/finance/getFormulaDetails/${offerTempData.salary_structure_id}`
            )
            .then((formulaRes) => {
              const earningTemp = [];
              const deductionTemp = [];
              const managementTemp = [];

              formulaRes.data.data
                .sort((a, b) => {
                  return a.priority - b.priority;
                })
                .forEach((obj) => {
                  if (obj.category_name_type === "Earning") {
                    earningTemp.push({
                      name: obj.voucher_head,
                      monthly: Math.round(
                        offerTempData[obj.salaryStructureHeadPrintName]
                      ),
                      yearly: Math.round(
                        offerTempData[obj.salaryStructureHeadPrintName] * 12
                      ),
                      priority: obj.priority,
                    });
                  } else if (obj.category_name_type === "Deduction") {
                    deductionTemp.push({
                      name: obj.voucher_head,
                      monthly: Math.round(
                        offerTempData[obj.salaryStructureHeadPrintName]
                      ),
                      yearly: Math.round(
                        offerTempData[obj.salaryStructureHeadPrintName] * 12
                      ),
                      priority: obj.priority,
                    });
                  } else if (obj.category_name_type === "Management") {
                    managementTemp.push({
                      name: obj.voucher_head,
                      monthly: Math.round(
                        offerTempData[obj.salaryStructureHeadPrintName]
                      ),
                      yearly: Math.round(
                        offerTempData[obj.salaryStructureHeadPrintName] * 12
                      ),
                      priority: obj.priority,
                    });
                  }
                });

              const temp = {};
              temp["earnings"] = earningTemp;
              temp["deductions"] = deductionTemp;
              temp["management"] = managementTemp;

              let grossEarningAmt = 0;
              let totDeductionAmt = 0;
              let totManagementAmt = 0;

              if (temp.earnings.length > 0) {
                const tempAmt = [];
                temp.earnings.forEach((te) => {
                  tempAmt.push(te.monthly);
                });
                grossEarningAmt = tempAmt.reduce((a, b) => a + b);
              }

              if (temp.deductions.length > 0) {
                const tempAmt = [];
                temp.deductions.forEach((te) => {
                  tempAmt.push(te.monthly);
                });
                totDeductionAmt = tempAmt.reduce((a, b) => a + b);
              }

              if (temp.management.length > 0) {
                const tempAmt = [];
                temp.management.forEach((te) => {
                  tempAmt.push(te.monthly);
                });
                totManagementAmt = tempAmt.reduce((a, b) => a + b);
              }

              temp["grossEarning"] = grossEarningAmt;
              temp["totDeduction"] = totDeductionAmt;
              temp["totManagement"] = totManagementAmt;
              setSalaryBreakUpData(temp);
            })
            .catch((err) => console.error(err));
        }

        setOfferData(offerTempData);
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
<table border='1' style='border-collapse:collapse'>
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
        temp.preferred_name_for_email = values.preferredName;
        temp.punched_card_status = "mandatory";
        temp.religion = values.religion;
        temp.report_id = values.reportId;
        temp.salary_structure_id = values.salaryStructure;
        temp.school_id = values.schoolId;
        const schoolData = schoolOptions.filter(
          (fil) => fil.value === values.schoolId
        );
        temp.school = schoolData[0].label;
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
                        const optionData = [];
                        res2.data.data.forEach((obj) => {
                          optionData.push({
                            value: obj.role_id,
                            label: obj.role_name,
                          });
                        });
                        setRoleOptions(optionData);
                      })
                      .catch((err2) => {
                        setAlertMessage({
                          severity: "error",
                          message: err2.response
                            ? err2.response.data.message
                            : "Error",
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
                      .catch((err3) => {
                        setAlertMessage({
                          severity: "error",
                          message: err3.response
                            ? err3.response.data.message
                            : "Error",
                        });
                        setAlertOpen(true);
                        setLoading(false);
                      });

                    setUserModalOpen(true);
                  }
                })
                .catch((err1) => {
                  setAlertMessage({
                    severity: "error",
                    message: err1.response
                      ? err1.response.data.message
                      : "Error",
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
      {/* Recruitment Form  */}
      <Box mt={2}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Card elevation={3}>
              <CardHeader
                avatar={<Avatar alt="Acharya universiteti" src={logo} />}
                title="Acharya University"
                titleTypographyProps={{ variant: "h6" }}
                sx={{
                  backgroundColor: "blue.main",
                  color: "headerWhite.main",
                }}
              />
              <CardContent>
                <Grid container columnSpacing={2} rowSpacing={4}>
                  <Grid item xs={12} mb={2}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        startIcon={<FolderSharedIcon />}
                        onClick={() => setModalOpen(true)}
                      >
                        Applicant Details
                      </Button>

                      {values.isConsutant === false ? (
                        <Grid item xs={12} md={2}>
                          <Button
                            variant="contained"
                            startIcon={<SummarizeIcon />}
                            onClick={() => setSalaryBreakupOpen(true)}
                          >
                            Salary Breakup
                          </Button>
                        </Grid>
                      ) : (
                        <></>
                      )}
                    </Stack>
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
                    <CustomAutocomplete
                      name="schoolId"
                      label="School"
                      value={values.schoolId}
                      options={schoolOptions}
                      handleChangeAdvance={handleChangeAdvance}
                      checks={checks.schoolId}
                      errors={errorMessages.schoolId}
                      disabled={true}
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

                  <Grid item xs={12} md={4}>
                    <CustomAutocomplete
                      name="proctorHeadId"
                      label="Proctor Head"
                      value={values.proctorHeadId}
                      options={proctorOptions}
                      handleChangeAdvance={handleChangeAdvance}
                      checks={checks.proctorHeadId}
                      errors={errorMessages.proctorHeadId}
                      required={
                        requiredFields.includes("proctorHeadId") === true
                      }
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
                          name="uanNumber"
                          label="UAN Number"
                          value={values.uanNumber}
                          handleChange={handleChange}
                          checks={checks.uanNumber}
                          errors={errorMessages.uanNumber}
                        />
                      </Grid>
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
                          "Recruit"
                        )}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Confirm Modal  */}
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      {/* Candidate Details  */}
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <CandidateDetailsView id={id} />
      </ModalWrapper>

      {/* Salary Breakup */}
      <ModalWrapper
        open={salaryBreakupOpen}
        setOpen={setSalaryBreakupOpen}
        maxWidth={800}
      >
        <SalaryBreakupView id={offerId} />
      </ModalWrapper>

      {/* User Creation  */}
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
    </>
  );
}

export default RecruitmentForm;
