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
  IconButton,
  Stack,
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
import EditIcon from "@mui/icons-material/Edit";

const FormPaperWrapper = lazy(() =>
  import("../../../components/FormPaperWrapper")
);
const SalaryBreakupView = lazy(() =>
  import("../../../components/SalaryBreakupViewByEmpId")
);
const SalaryBreakupReport = lazy(() => import("./SalaryBreakupReport"));
const CustomModal = lazy(() => import("../../../components/CustomModal"));

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

const offerInitialValues = {
  salaryStructure: null,
  isPf: "true",
  isPt: "true",
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
  "uanNo",
  "biometricStatus",
];

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const columns = [
  "basic",
  "da",
  "hra",
  "ta",
  "spl_1",
  "pf",
  "management_pf",
  "pt",
  "cca",
  "esi",
  "esic",
];

function EmployeeUpdateForm() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [proctorOptions, setProctorOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [offerValues, setOfferValues] = useState(offerInitialValues);
  const [salaryStructureOptions, setSalaryStructureOptions] = useState([]);
  const [ctcData, setCtcData] = useState();
  const [formulaData, setFormulaData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [headValues, setHeadValues] = useState();
  const [slabData, setSlabData] = useState([]);
  const [offerConfirmContent, setOfferConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [actualData, setActualData] = useState([]);
  const [empHistoryData, setEmpHistoryData] = useState([]);
  const [offerConfirmOpen, setOfferConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOfferEdit, setIsOfferEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const getShiftName = shiftOptions.find((obj) => obj.value === values.shiftId);

  const getProctorName = proctorOptions.find(
    (obj) => obj.value === values.proctorHeadId
  );

  const getReporterName = reportOptions.find(
    (obj) => obj.value === values.reportId
  );

  const getLaOneName = reportOptions.find(
    (obj) => obj.value === values.leaveApproverOneId
  );

  const getLaTwoName = reportOptions.find(
    (obj) => obj.value === values.leaveApproverTwoId
  );

  const getSiOneName = reportOptions.find(
    (obj) => obj.value === values.storeIndentApproverOne
  );

  const getSiTwoName = reportOptions.find(
    (obj) => obj.value === values.storeIndentApproverTwo
  );

  const getStructureName = salaryStructureOptions.find(
    (obj) => obj.value === offerValues.salaryStructure
  );

  const actualValues = [
    { value: "employeeName", dbValue: "employee_name", id: false, fuc: "" },
    {
      value: "shiftId",
      dbValue: "shift_name",
      id: true,
      fuc: getShiftName?.label,
    },
    {
      value: "proctorHeadId",
      dbValue: "chief_proctor_id",
      id: true,
      fuc: getProctorName?.employeeName,
    },
    {
      value: "reportId",
      dbValue: "report_id",
      id: true,
      fuc: getReporterName?.employeeName,
    },
    {
      value: "leaveApproverOneId",
      dbValue: "leave_approver1_emp_id",
      id: true,
      fuc: getLaOneName?.employeeName,
    },
    {
      value: "leaveApproverTwoId",
      dbValue: "leave_approver2_emp_id",
      id: true,
      fuc: getLaTwoName?.employeeName,
    },
    {
      value: "storeIndentApproverOne",
      dbValue: "store_indent_approver1",
      id: true,
      fuc: getSiOneName?.employeeName,
    },
    {
      value: "storeIndentApproverTwo",
      dbValue: "store_indent_approver2",
      id: true,
      fuc: getSiTwoName?.employeeName,
    },
    { value: "phdStatus", dbValue: "phd_status", id: false, fuc: "" },
    {
      value: "preferredName",
      dbValue: "preferred_name_for_email",
      id: false,
      fuc: "",
    },
    {
      value: "currentLocation",
      dbValue: "current_location",
      id: false,
      fuc: "",
    },
    {
      value: "permanentAddress",
      dbValue: "hometown",
      id: false,
      fuc: "",
    },
    {
      value: "phoneNumber",
      dbValue: "mobile",
      id: false,
      fuc: "",
    },
    {
      value: "alternatePhoneNumber",
      dbValue: "alt_mobile_no",
      id: false,
      fuc: "",
    },
    {
      value: "gender",
      dbValue: "gender",
      id: false,
      fuc: "",
    },
    {
      value: "martialStatus",
      dbValue: "martial_status",
      id: false,
      fuc: "",
    },
    {
      value: "dob",
      dbValue: "dateofbirth",
      id: false,
      fuc: "",
    },
    {
      value: "bloodGroup",
      dbValue: "blood_group",
      id: false,
      fuc: "",
    },
    {
      value: "religion",
      dbValue: "religion",
      id: false,
      fuc: "",
    },
    {
      value: "caste",
      dbValue: "caste_category",
      id: false,
      fuc: "",
    },
    {
      value: "bankId",
      dbValue: "bank_id",
      id: false,
      fuc: "",
    },
    {
      value: "accountNumber",
      dbValue: "bank_account_no",
      id: false,
      fuc: "",
    },
    {
      value: "bankAccountName",
      dbValue: "bank_account_holder_name",
      id: false,
      fuc: "",
    },
    {
      value: "bankBranch",
      dbValue: "bank_branch",
      id: false,
      fuc: "",
    },
    {
      value: "bankIfscCode",
      dbValue: "bank_ifsccode",
      id: false,
      fuc: "",
    },
    {
      value: "aadharNumber",
      dbValue: "aadhar",
      id: false,
      fuc: "",
    },
    {
      value: "panNo",
      dbValue: "pan_no",
      id: false,
      fuc: "",
    },
    {
      value: "uanNo",
      dbValue: "uan_no",
      id: false,
      fuc: "",
    },
    {
      value: "biometricStatus",
      dbValue: "punched_card_status",
      id: false,
      fuc: "",
    },
    {
      value: "pfNo",
      dbValue: "pf_no",
      id: false,
      fuc: "",
    },
    {
      value: "dlNo",
      dbValue: "dlno",
      id: false,
      fuc: "",
    },
    {
      value: "dlexpDate",
      dbValue: "dlexpno",
      id: false,
      fuc: "",
    },
    {
      value: "passportNumber",
      dbValue: "passportno",
      id: false,
      fuc: "",
    },
    {
      value: "passportExpiryDate",
      dbValue: "passportexpno",
      id: false,
      fuc: "",
    },
  ];

  useEffect(() => {
    getData();
    getJobtypeDetails();
    getProctorDetails();
    getReportDetails();
    getOfferDetails();
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

      if (getJobType[0].label.toLowerCase() !== "non teaching") {
        requiredFields.push("proctorHeadId");

        checks["proctorHeadId"] = [values.proctorHeadId !== null];
        errorMessages["proctorHeadId"] = ["This field is required"];
      }
    }
  }, [values.jobCategoryId]);

  useEffect(() => {
    getSalaryStructureOptions();
  }, [isOfferEdit]);

  useEffect(() => {
    getFormulaData();
    getSlabDetails();
    setShowDetails(false);
  }, [offerValues.salaryStructure]);

  const getData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${id}`)
      .then((res) => {
        const data = res.data.data[0];

        setValues((prev) => ({
          ...prev,
          employeeName: data.employee_name,
          doj: data.date_of_joining?.split("-")?.reverse()?.join("-"),
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
          martialStatus: data.martial_status ?? "",
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
          employeeType: data.emp_type_short_name,
        }));

        setActualData((prev) => ({
          ...prev,
          employeeName: data.employee_name,
          doj: data.date_of_joining?.split("-")?.reverse()?.join("-"),
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
          martialStatus: data.martial_status ?? "",
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
          employeeType: data.emp_type_short_name,
        }));

        setOfferValues((prev) => ({
          ...prev,
          salaryStructure: data.salary_structure_id,
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

    await axios
      .get(`/api/employee/employeeDetailsHistoryOnEmpId/${id}`)
      .then((res) => {
        setEmpHistoryData(res.data.data);
      })
      .catch((err) => console.error(err));
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
            employeeName: obj.employee_name,
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
            employeeName: obj.employee_name,
          });
        });
        setReportOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getSalaryStructureOptions = async () => {
    if (isOfferEdit === true) {
      await axios
        .get(`/api/finance/SalaryStructure`)
        .then((res) => {
          setSalaryStructureOptions(
            res.data.data.map((obj) => ({
              value: obj.salary_structure_id,
              label: obj.salary_structure,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getFormulaData = async () => {
    if (
      offerValues.salaryStructure &&
      (values.employeeType === "FTE" || values.employeeType === "ORR")
    ) {
      await axios
        .get(`/api/finance/getFormulaDetails/${offerValues.salaryStructure}`)
        .then((res) => {
          setFormulaData(res.data.data);

          // filtering lumspsum data
          const getLumpsum = [];
          res.data.data
            .filter((fil) => fil.salary_category === "Lumpsum")
            .forEach((obj) => {
              getLumpsum.push(obj.salaryStructureHeadPrintName);
            });

          const newFormulaValues = {};

          // validation: removing required fileds based on salary structure
          if ("lumpsum" in offerValues === true) {
            Object.keys(offerValues.lumpsum).forEach((obj) => {
              if (requiredFields.includes(obj) === true) {
                const getIndex = requiredFields.indexOf(obj);
                requiredFields.splice(getIndex, 1);
              }
            });
          }

          getLumpsum.forEach((obj) => {
            if (Object.keys(offerData).length > 0) {
              newFormulaValues[obj] = offerData[obj];
            } else {
              newFormulaValues[obj] = "";
            }
          });

          setOfferValues((prev) => ({
            ...prev,
            lumpsum: newFormulaValues,
            ctc: Object.keys(offerData).length > 0 ? offerData["ctc"] : "",
          }));

          const headsTemp = {};
          res.data.data.forEach((obj) => {
            headsTemp[obj.salaryStructureHeadPrintName] =
              offerData[obj.salaryStructureHeadPrintName];
          });
          setHeadValues(headsTemp);
        })
        .catch((err) => console.error(err));
    }
  };

  const getSlabDetails = async () => {
    await axios
      .get(`/api/getAllValues`)
      .then((res) => {
        setSlabData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getOfferDetails = async () => {
    await axios
      .get(`/api/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => {
        setOfferValues((prev) => ({
          ...prev,
          isPf: res.data.data[0].isPf,
          isPt: res.data.data[0].isPt,
        }));

        setOfferData(res.data.data[0]);
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

  const handleChangeOffer = (e) => {
    const splitName = e.target.name.split("-");

    if (splitName[1] === "lumpsum") {
      const checkValues = offerValues.lumpsum;
      checkValues[splitName[0]] = e.target.value;
      setOfferValues((prev) => ({
        ...prev,
        lumpsum: checkValues,
      }));
    } else {
      setOfferValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
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

    const temp = { ...empHistoryData };

    delete temp.emp_history_id;

    actualValues.forEach((obj) => {
      if (values[obj.value] !== actualData[obj.value] && obj.id) {
        temp[obj.dbValue] = `<font color='blue'>${obj.fuc}</font>`;
      } else if (values[obj.value] !== actualData[obj.value]) {
        temp[obj.dbValue] = `<font color='blue'>${values[obj.value]}</font>`;
      }
    });

    await axios
      .post(`/api/employee/employeeDetailsHistory`, temp)
      .then((res) => {
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
              message: putErr.response ? putErr.response.data.message : "Error",
            });
            setAlertOpen(true);
            navigate("/employeeindex", { replace: true });
          });
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
        navigate("/employeeindex", { replace: true });
      });
  };

  const generateCtc = () => {
    const tempData = {};
    const tempValues = {};
    const earningData = [];
    const deductionData = [];
    const managementData = [];

    function calculate(catType, name, value, type, priority, head) {
      if (catType === "e") {
        earningData.push({
          headName: name,
          value: value,
          type: type,
          priority: priority,
        });
      } else if (catType === "d") {
        deductionData.push({
          headName: name,
          value: value,
          type: type,
          priority: priority,
        });
      } else if (catType === "m") {
        managementData.push({
          headName: name,
          value: value,
          type: type,
          priority: priority,
        });
      }

      tempValues[head] = value;
    }

    let filterFormulaData = formulaData;
    if (offerValues.isPf === "false") {
      filterFormulaData = filterFormulaData.filter(
        (obj) =>
          obj.salaryStructureHeadPrintName !== "pf" &&
          obj.salaryStructureHeadPrintName !== "management_pf"
      );
    }

    if (offerValues.isPt === "false") {
      filterFormulaData = filterFormulaData.filter(
        (obj) => obj.salaryStructureHeadPrintName !== "pt"
      );
    }

    filterFormulaData
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .map((fil) => {
        if (fil.salary_category === "Lumpsum") {
          calculate(
            "e",
            fil.voucher_head,
            Math.round(offerValues.lumpsum[fil.salaryStructureHeadPrintName]),
            fil.category_name_type,
            fil.priority,
            fil.salaryStructureHeadPrintName
          );
        } else if (fil.salary_category === "Formula") {
          const formulas = fil.formula_name.split(",");
          const formulaAmt = [];
          formulas.forEach((val) => {
            formulaAmt.push(tempValues[val]);
          });
          const amt = formulaAmt.reduce((a, b) => a + b);

          if (fil.category_name_type === "Earning") {
            calculate(
              "e",
              fil.voucher_head,
              Math.round((amt * fil.percentage) / 100),
              fil.category_name_type,
              fil.priority,
              fil.salaryStructureHeadPrintName
            );
          }

          if (fil.category_name_type === "Deduction") {
            const esiEarnings = [];
            earningData.forEach((te) => {
              esiEarnings.push(te.value);
            });
            const esiEarningAmt = esiEarnings.reduce((a, b) => a + b);

            switch (fil.salaryStructureHeadPrintName) {
              case "pf":
                amt <= fil.gross_limit
                  ? calculate(
                      "d",
                      fil.voucher_head,
                      Math.round((amt * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    )
                  : calculate(
                      "d",
                      fil.voucher_head,
                      Math.round((fil.gross_limit * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    );
                break;
              case "esi":
                if (esiEarningAmt < fil.gross_limit) {
                  calculate(
                    "d",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                }
                break;
              case "pt":
                calculate(
                  "d",
                  fil.voucher_head,
                  Math.round((amt * fil.percentage) / 100),
                  fil.category_name_type,
                  fil.priority,
                  fil.salaryStructureHeadPrintName
                );
                break;
            }
          }

          if (fil.category_name_type === "Management") {
            const esicEarnings = [];
            earningData.forEach((te) => {
              esicEarnings.push(te.value);
            });
            const esicEarningAmt = esicEarnings.reduce((a, b) => a + b);

            switch (fil.salaryStructureHeadPrintName) {
              case "management_pf":
                amt <= fil.gross_limit
                  ? calculate(
                      "m",
                      fil.voucher_head,
                      Math.round((amt * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    )
                  : calculate(
                      "m",
                      fil.voucher_head,
                      Math.round((fil.gross_limit * fil.percentage) / 100),
                      fil.category_name_type,
                      fil.priority,
                      fil.salaryStructureHeadPrintName
                    );
                break;
              case "esic":
                if (esicEarningAmt < fil.gross_limit) {
                  calculate(
                    "m",
                    fil.voucher_head,
                    Math.round((amt * fil.percentage) / 100),
                    fil.category_name_type,
                    fil.priority,
                    fil.salaryStructureHeadPrintName
                  );
                }

                break;
            }
          }
        } else if (fil.salary_category === "slab") {
          const slots = slabData.filter(
            (sd) => sd.slab_details_id === fil.slab_details_id
          );

          const slotPrintNames = slots[0]["print_name"].split(",");
          const slotAmt = [];
          slotPrintNames.forEach((m) => {
            slotAmt.push(tempValues[m] ? tempValues[m] : 0);
          });
          const amt = slotAmt.reduce((a, b) => a + b);

          slots.forEach((rs) => {
            if (amt >= rs.min_value && amt <= rs.max_value) {
              calculate(
                fil.category_name_type[0].toLowerCase(),
                fil.voucher_head,
                rs.head_value,
                fil.category_name_type,
                fil.priority,
                fil.salaryStructureHeadPrintName
              );
            }
          });
        }
      });

    tempData["earnings"] = earningData;
    tempData["deductions"] = deductionData;
    tempData["management"] = managementData;

    let grossEarningAmt = 0;
    let totDeductionAmt = 0;
    let totManagementAmt = 0;

    if (tempData.earnings.length > 0) {
      const temp = [];
      tempData.earnings.forEach((te) => {
        temp.push(te.value);
      });
      grossEarningAmt = temp.reduce((a, b) => a + b);
    }

    if (tempData.deductions.length > 0) {
      const temp = [];
      tempData.deductions.forEach((te) => {
        temp.push(te.value);
      });
      totDeductionAmt = temp.reduce((a, b) => a + b);
    }

    if (tempData.management.length > 0) {
      const temp = [];
      tempData.management.forEach((te) => {
        temp.push(te.value);
      });
      totManagementAmt = temp.reduce((a, b) => a + b);
    }

    tempData["grossEarning"] = grossEarningAmt;
    tempData["totDeduction"] = totDeductionAmt;
    tempData["totManagement"] = totManagementAmt;

    setCtcData(tempData);
    setOfferValues((prev) => ({
      ...prev,
      ctc: Math.round(tempData.grossEarning + tempData.totManagement),
    }));

    tempValues["gross"] = tempData.grossEarning;
    tempValues["net_pay"] = tempData.grossEarning - tempData.totDeduction;
    setHeadValues(tempValues);
    setShowDetails(true);
  };

  const handleUpdateOffer = () => {
    const updateSalarybreakup = async () => {
      const temp = { ...offerData };
      temp.salary_structure_id = offerValues.salaryStructure;
      temp.salary_structure = getStructureName?.label;
      temp.gross = headValues.gross;
      temp.net_pay = headValues.net_pay;
      temp.ctc = offerValues.ctc;
      temp.isPf = offerValues.isPf === "true" ? true : false;
      temp.isPt = offerValues.isPt === "true" ? true : false;

      const updateData = { ...data };
      const historyData = { ...empHistoryData };

      updateData.salary_structure_id = offerValues.salaryStructure;
      updateData.grosspay_ctc = headValues.gross;
      updateData.net_pay = headValues.net_pay;
      updateData.ctc = offerValues.ctc;

      if (offerValues.salaryStructure !== historyData.salary_structure_id) {
        historyData.salary_structure_id = `<font color='blue'>${getStructureName?.label}</font>`;
      }

      if (headValues.gross !== historyData.grosspay_ctc) {
        historyData.grosspay_ctc = `<font color='blue'>${headValues.gross}</font>`;
      }

      if (headValues.net_pay !== historyData.net_pay) {
        historyData.net_pay = `<font color='blue'>${headValues.net_pay}</font>`;
      }

      if (offerValues.ctc !== historyData.ctc) {
        historyData.ctc = `<font color='blue'>${offerValues.ctc}</font>`;
      }

      columns.map((col) => {
        temp[col] = headValues[col];
        updateData[col] = headValues[col];
        if (headValues[col] !== historyData[col]) {
          historyData[col] = `<font color='blue'>${headValues[col]}</font>`;
        }
      });

      const OfferHistory = new Promise(async (resolve, reject) => {
        await axios
          .post(`/api/employee/offerHistory`, offerData)
          .then((res) => resolve(res.success))
          .catch((err) => reject(err));
      });

      const OfferUpdate = new Promise(async (resolve, reject) => {
        await axios
          .put(`/api/employee/Offer/${offerId}`, temp)
          .then((res) => resolve(res.success))
          .catch((err) => reject(err));
      });

      const EmployeeHistory = new Promise(async (resolve, reject) => {
        await axios
          .post(`/api/employee/employeeDetailsHistory`, historyData)
          .then((res) => resolve(res.success))
          .catch((err) => reject(err));
      });

      const EmployeeUpdate = new Promise(async (resolve, reject) => {
        await axios
          .put(`/api/employee/EmployeeDetails/${id}`, updateData)
          .then((res) => resolve(res.success))
          .catch((err) => reject(err));
      });

      Promise.all([OfferHistory, OfferUpdate, EmployeeHistory, EmployeeUpdate])
        .then((res) => {
          if (res) {
            setAlertMessage({
              severity: "success",
              message: "Offer updated successfully",
            });
            setAlertOpen(true);
            setIsOfferEdit(false);
          } else {
            setAlertMessage({
              severity: "error",
              message: "Something went wrong !!",
            });
            setAlertOpen(true);
            setIsOfferEdit(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setIsOfferEdit(false);
        });
    };

    setOfferConfirmContent({
      title: "",
      message: "You are updating master offer !! Do you want to submit?",
      buttons: [
        { name: "Yes", color: "primary", func: updateSalarybreakup },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setOfferConfirmOpen(true);
  };

  if (values.panNo) {
    const getIndex = requiredFields.indexOf("panNo");
    if (values.panNo === "PANAPPLIED" && getIndex > -1) {
      requiredFields.splice(getIndex, 1);
    } else if (values.panNo !== "PANAPPLIED") {
      requiredFields.push("panNo");
    }
  }

  return (
    <>
      <CustomModal
        open={offerConfirmOpen}
        setOpen={setOfferConfirmOpen}
        title={offerConfirmContent.title}
        message={offerConfirmContent.message}
        buttons={offerConfirmContent.buttons}
      />

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

                {roleShortName === "SAA" ? (
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader
                        title="Offer Details"
                        titleTypographyProps={{ variant: "subtitle2" }}
                        action={
                          <IconButton onClick={() => setIsOfferEdit(true)}>
                            <EditIcon />
                          </IconButton>
                        }
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                          padding: 1,
                        }}
                      />

                      <CardContent sx={{ padding: { md: 3 } }}>
                        <Grid container columnSpacing={2} rowSpacing={4}>
                          {isOfferEdit ? (
                            <>
                              <Grid item xs={12} md={3}>
                                <CustomAutocomplete
                                  name="salaryStructure"
                                  label="Salary Structure"
                                  value={offerValues.salaryStructure}
                                  options={salaryStructureOptions}
                                  handleChangeAdvance={handleChangeOffer}
                                  required
                                />
                              </Grid>

                              {formulaData.length > 0 ? (
                                formulaData
                                  .filter(
                                    (fil) => fil.salary_category === "Lumpsum"
                                  )
                                  .map((lu, i) => {
                                    return (
                                      <Grid item xs={12} md={3} key={i}>
                                        <CustomTextField
                                          name={
                                            lu.salaryStructureHeadPrintName +
                                            "-" +
                                            "lumpsum"
                                          }
                                          label={lu.voucher_head}
                                          value={
                                            offerValues.lumpsum[
                                              lu.salaryStructureHeadPrintName
                                            ]
                                          }
                                          handleChange={handleChangeOffer}
                                          checks={
                                            checks[
                                              lu.salaryStructureHeadPrintName
                                            ]
                                          }
                                          errors={
                                            errorMessages[
                                              lu.salaryStructureHeadPrintName
                                            ]
                                          }
                                          required
                                        />
                                      </Grid>
                                    );
                                  })
                              ) : (
                                <></>
                              )}

                              {offerValues.ctc ? (
                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name={offerValues.ctc.toString()}
                                    label="CTC"
                                    value={offerValues.ctc}
                                    disabled
                                  />
                                </Grid>
                              ) : (
                                <></>
                              )}

                              {"lumpsum" in offerValues === true &&
                              Object.keys(offerValues.lumpsum).length > 0 &&
                              Object.keys(offerValues.lumpsum)
                                .map((obj) =>
                                  parseInt(offerValues.lumpsum[obj]) >= 0
                                    ? true
                                    : false
                                )
                                .includes(false) === false ? (
                                <>
                                  <Grid item xs={12} md={2}>
                                    <CustomRadioButtons
                                      name="isPf"
                                      label="Is PF"
                                      value={offerValues.isPf}
                                      items={[
                                        { label: "Yes", value: "true" },
                                        { label: "No", value: "false" },
                                      ]}
                                      handleChange={handleChangeOffer}
                                      required
                                    />
                                  </Grid>

                                  <Grid item xs={12} md={2}>
                                    <CustomRadioButtons
                                      name="isPt"
                                      label="Is PT"
                                      value={offerValues.isPt}
                                      items={[
                                        { label: "Yes", value: true },
                                        { label: "No", value: false },
                                      ]}
                                      handleChange={handleChangeOffer}
                                      required
                                    />
                                  </Grid>

                                  <Grid item xs={12} md={2}>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      onClick={generateCtc}
                                      sx={{
                                        backgroundColor: "auzColor.main",
                                        ":hover": {
                                          bgcolor: "auzColor.main",
                                        },
                                      }}
                                    >
                                      Generate CTC
                                    </Button>
                                  </Grid>
                                </>
                              ) : (
                                <></>
                              )}

                              {showDetails ? (
                                <Grid item xs={12} align="center" mt={3}>
                                  <SalaryBreakupReport data={ctcData} />
                                </Grid>
                              ) : (
                                <></>
                              )}

                              <Grid item xs={12} align="right">
                                <Stack
                                  direction="row"
                                  justifyContent="right"
                                  spacing={2}
                                >
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setIsOfferEdit(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleUpdateOffer}
                                    disabled={!showDetails}
                                  >
                                    Submit
                                  </Button>
                                </Stack>
                              </Grid>
                            </>
                          ) : (
                            <Grid item xs={12}>
                              <Box
                                sx={{ width: { md: "50%" }, margin: "auto" }}
                              >
                                <SalaryBreakupView id={offerId} />
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  <></>
                )}

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
    </>
  );
}

export default EmployeeUpdateForm;
