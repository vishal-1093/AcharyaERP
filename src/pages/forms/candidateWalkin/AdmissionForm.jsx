import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import useAlert from "../../../hooks/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const PersonalDetailsForm = lazy(() => import("./PersonalDetailsForm"));
const AdditionalDetailsForm = lazy(() => import("./AdditionalDetailsForm"));
const AddressDetailsForm = lazy(() => import("./AddressDetailsForm"));
const BankDetailsForm = lazy(() => import("./BankDetailsForm"));
const ProgramDetailsForm = lazy(() => import("./ProgramDetailsForm"));
const TranscriptDetailsForm = lazy(() => import("./TranscriptDetailsForm"));
const AcademicDetailsForm = lazy(() => import("./AcademicDetailsForm"));

const initialValues = {
  studentName: "",
  dob: null,
  gender: "",
  mobileNo: "",
  alternateMobile: "",
  whatsAppNo: "",
  email: "",
  religion: null,
  casteCategory: "",
  bloodGroup: "",
  nationality: null,
};

const additionalInitialValues = {
  fatherName: "",
  fatherMobile: "",
  fatherEmail: "",
  fatherOccupation: null,
  fatherQualification: "",
  fatherIncome: "",
  motherName: "",
  motherMobile: "",
  motherEmail: "",
  motherOccupation: "",
  motherQualification: "",
  motherIncome: "",
  guardianName: "",
  guardianMobile: "",
  guardianEmail: "",
  guardianOccupation: "",
};

const addressInitialValues = {
  permanentAddress: "",
  permanentAddressTwo: "",
  permanentCountry: "",
  permanantState: "",
  permanantCity: "",
  permanentPincode: "",
  currentAddress: "",
  currentAddressTwo: "",
  currentCountry: "",
  currentState: "",
  currentCity: "",
  currentPincode: "",
  localAddress: "",
  localAddressTwo: "",
  localCountry: "",
  localState: "",
  localCity: "",
  localPincode: "",
};

const bankInitialValues = {
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  bankBranch: "",
  ifscCode: "",
  aadharNo: "",
};

const programInitialValues = {
  currentYearSem: "",
  preferredName: "",
  acYearId: null,
  schoolId: null,
  programId: null,
  programAssignmentId: null,
  prgId: null,
  admissionCategory: null,
  admissionSubCategory: null,
  feeTemplateId: null,
  isNri: false,
};

const academicInitialValues = [
  {
    qualification: "SSLC",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
  {
    qualification: "PUC",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
  {
    qualification: "UG",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
  {
    qualification: "PG",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
];

const requiredFields = [
  "studentName",
  "dob",
  "gender",
  "mobileNo",
  "alternateMobile",
  "whatsAppNo",
  "email",
  "religion",
  "casteCategory",
  "bloodGroup",
  "nationality",
];

const additionalRequired = [
  "fatherName",
  "fatherMobile",
  "fatherEmail",
  "motherName",
  "motherMobile",
  "motherEmail",
];

const addressRequired = [
  "permanentAddress",
  "permanentCountry",
  "permanantState",
  "permanantCity",
  "permanentPincode",
  "currentAddress",
  "currentCountry",
  "currentState",
  "currentCity",
  "currentPincode",
  "localAddress",
  "localCountry",
  "localState",
  "localCity",
  "localPincode",
];

const bankRequired = ["aadharNo"];

function AdmissionForm() {
  const [values, setValues] = useState(initialValues);
  const [additionalValues, setAdditionalValues] = useState(
    additionalInitialValues
  );
  const [addressValues, setAddressValues] = useState(addressInitialValues);
  const [bankValues, setBankValues] = useState(bankInitialValues);
  const [programValues, setProgramValues] = useState(programInitialValues);
  const [academicValues, setAcademicValues] = useState(academicInitialValues);
  const [transcriptValues, setTranscriptValues] = useState([]);
  const [noStatuData, setNoStatusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const [data, setData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);

  const { id, type } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const maxLength = 100;

  const checks = {
    studentName: [values.studentName !== ""],
    mobileNo: [
      programValues.admissionCategory !== 2
        ? /^[0-9]{10}$/.test(values.mobileNo)
        : true,
    ],
    alternateMobile: [
      programValues.admissionCategory !== 2
        ? /^[0-9]{10}$/.test(values.alternateMobile)
        : true,
    ],
    whatsAppNo: [
      programValues.admissionCategory !== 2
        ? /^[0-9]{10}$/.test(values.whatsAppNo)
        : true,
    ],
    email: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
    ],
    religion: [values.religion !== ""],
    casteCategory: [values.casteCategory !== ""],
    bloodGroup: [values.bloodGroup !== ""],
  };

  const errorMessages = {
    studentName: ["This field is required"],
    mobileNo: ["Invalid Mobile No."],
    alternateMobile: ["Invalid Mobile No."],
    whatsAppNo: ["Invalid Mobile No."],
    email: ["Invalid email"],
    religion: ["This field is required"],
    casteCategory: ["This field is required"],
    bloodGroup: ["This field is required"],
  };

  const additonalChecks = {
    fatherMobile: [
      additionalValues.fatherMobile && programValues.admissionCategory !== 2
        ? /^[0-9]{10}$/.test(additionalValues.fatherMobile)
        : true,
    ],
    fatherEmail: [
      additionalValues.fatherEmail
        ? /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            additionalValues.fatherEmail
          )
        : true,
    ],
    motherMobile: [
      additionalValues.motherMobile && programValues.admissionCategory !== 2
        ? /^[0-9]{10}$/.test(additionalValues.motherMobile)
        : true,
    ],
    motherEmail: [
      additionalValues.motherEmail
        ? /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            additionalValues.motherEmail
          )
        : true,
    ],
    guardianMobile: [
      additionalValues.guardianMobile && programValues.admissionCategory !== 2
        ? /^[0-9]{10}$/.test(additionalValues.guardianMobile)
        : true,
    ],
    guardianEmail: [
      additionalValues.guardianEmail
        ? /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            additionalValues.guardianEmail
          )
        : true,
    ],
  };

  const additionalErrorMessages = {
    fatherMobile: ["Invalid Mobile No."],
    fatherEmail: ["Invalid email"],
    motherMobile: ["Invalid Mobile No."],
    motherEmail: ["Invalid email"],
    guardianMobile: ["Invalid Mobile No."],
    guardianEmail: ["Invalid email"],
  };

  const addressChecks = {
    permanentAddress: [addressValues.permanentAddress !== ""],
    permanentPincode: [addressValues.permanentPincode !== ""],
    currentAddress: [addressValues.currentAddress !== ""],
    currentPincode: [addressValues.currentPincode !== ""],
    localAddress: [addressValues.localAddress !== ""],
    localPincode: [addressValues.localPincode !== ""],
  };

  const addressErrorMessages = {
    permanentAddress: ["This field is required"],
    permanentPincode: ["This field is required"],
    currentAddress: ["This field is required"],
    currentPincode: ["This field is required"],
    localAddress: ["This field is required"],
    studelocalPincodentName: ["This field is required"],
  };

  const bankChecks = {
    aadharNo: [/^[0-9]{12}$/.test(bankValues.aadharNo)],
  };

  const bankErrorMessages = {
    aadharNo: ["Invalid Aadhar"],
  };

  useEffect(() => {
    getData();
    setCrumbs([]);
  }, []);

  useEffect(() => {
    updatePreferredName();
  }, [values.studentName, additionalValues.fatherName]);

  const updatePreferredName = () => {
    const { studentName } = values;
    const { fatherName } = additionalValues;
    if (studentName && fatherName) {
      const firstName = studentName.split(" ");
      const firstFatherLetter = fatherName?.slice(0, 1);
      const generateName = `${firstName[0]}${firstFatherLetter}`.toLowerCase();
      setProgramValues((prev) => ({
        ...prev,
        ["preferredName"]: generateName,
      }));
    }
  };

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/findAllDetailsPreAdmission/${id}`
      );
      const responseData = response.data[0];
      const { data: transcriptRes } = await axios.get(
        `/api/academic/fetchProgramTranscriptDetails/${responseData.program_id}`
      );
      const transcriptData = transcriptRes.data;
      const status = transcriptData.filter((fil) => fil.show_status === true);
      const noStatus = transcriptData.filter((fil) => !fil.show_status);
      const transcriptObj = [];

      status.forEach((obj, i) => {
        transcriptObj.push({
          transcriptId: obj.transcript_id,
          transcript: obj.transcript,
          lastDate: null,
          submittedStatus: false,
          notRequied: false,
          submittedStatusDisabled: false,
          notRequiedDisabled: false,
          lastDateDisabled: false,
          showStatus: obj.show_status,
        });
      });

      const {
        program_type: programType,
        candidateName: studentName,
        dateOfBirth: dob,
        candidateSex: gender,
        mobileNumber: mobileNo,
        whatsapp_number: whatsAppNo,
        candidateEmail: email,
        religion,
        caste: casteCategory,
        bloodGroup,
        nationality,
        lat_year_sem: latYear,
        fatherName,
        fatherMobile,
        fatherEmail,
        fatherOccupation,
        father_annual_income: fatherIncome,
        father_qualification: fatherQualification,
        motherName,
        motherMobile,
        mother_email: motherEmail,
        mother_occupation: motherOccupation,
        mother_qualification: motherQualification,
        mother_annual_income: motherIncome,
        guardianName,
        guardianMobile,
        guardian_email: guardianEmail,
        guardian_occupation: guardianOccupation,
        ac_year_id: acYearId,
        school_id: schoolId,
        program_specialization_id: programId,
        program_assignment_id: programAssignmentId,
        program_id: prgId,
        fee_template_id: feeTemplateId,
        fee_admission_category_id: admissionCategory,
        fee_admission_sub_category_id: admissionSubCategory,
        is_regular: isRegular,
        permanentAddress,
        permanentCountry,
        permanentCity,
        permanentPincode,
        permanentState,
        presentAddress,
        presentPincode,
        presentCountry,
        presentState,
      } = responseData;

      const count =
        programType === "Yearly"
          ? responseData.number_of_years
          : responseData.number_of_semester;
      const yearSem = [];

      for (let i = 1; i <= count; i++) {
        yearSem.push({
          value: i,
          label: programType === "Yearly" ? `Year ${i}` : `Sem ${i}`,
        });
      }

      setValues((prev) => ({
        ...prev,
        studentName,
        dob: moment(dob, "DD-MM-YYYY"),
        gender,
        mobileNo,
        alternateMobile: mobileNo,
        email,
        religion: religion ?? "",
        casteCategory: casteCategory ?? "",
        bloodGroup: bloodGroup ?? "",
        nationality,
      }));

      setAdditionalValues((prev) => ({
        ...prev,
        fatherName,
        fatherMobile: fatherMobile ?? "",
        fatherEmail: fatherEmail ?? "",
        fatherOccupation: fatherOccupation ?? "",
        fatherIncome: fatherIncome ?? "",
        fatherQualification,
        motherName: motherName ?? "",
        motherMobile: motherMobile ?? "",
        motherEmail,
        motherOccupation,
        motherQualification,
        motherIncome: motherIncome ?? "",
        guardianName: guardianName ?? "",
        guardianMobile: guardianMobile ?? "",
        guardianEmail,
        guardianOccupation,
      }));

      setAddressValues((prev) => ({
        ...prev,
        permanentAddress: permanentAddress ?? "",
        permanentCountry: permanentCountry,
        permanantState: permanentState,
        permanantCity: permanentCity,
        permanentPincode: permanentPincode ?? "",
        currentAddress: presentAddress ?? "",
        currentCountry: presentCountry,
        currentState: presentState,
        currentPincode: presentPincode ?? "",
      }));

      setProgramValues((prev) => ({
        ...prev,
        acYearId,
        schoolId,
        programId,
        programAssignmentId,
        prgId,
        feeTemplateId,
        admissionCategory,
        admissionSubCategory,
        isRegular,
        latYear,
        currentYearSem: latYear,
      }));

      setData(responseData);
      setNoOfYears(yearSem);
      setTranscriptValues(transcriptObj);
      setNoStatusData(noStatus);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to fetch the data",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length > maxLength) return;
    setNotes(value);
  };

  const getRemainingCharacters = () => maxLength - notes.length;

  const requiredFieldsValid = (array, value, checksList) => {
    for (let i = 0; i < array.length; i++) {
      const field = array[i];
      if (Object.keys(checksList).includes(field)) {
        const ch = checksList[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!value[field]) return false;
    }
    return true;
  };

  const validateAllFields = () => {
    const isPersonalValid = requiredFieldsValid(requiredFields, values, checks);
    const isAdditionalValid = requiredFieldsValid(
      additionalRequired,
      additionalValues,
      additonalChecks
    );
    const isAddressRequired = requiredFieldsValid(
      addressRequired,
      addressValues,
      addressChecks
    );
    const isBankRequired = requiredFieldsValid(
      bankRequired,
      bankValues,
      bankChecks
    );

    return (
      !isPersonalValid ||
      !isAdditionalValid ||
      !isAddressRequired ||
      !isBankRequired
    );
  };

  const validateChecks = () =>
    Object.values({
      ...checks,
      ...additonalChecks,
      ...addressChecks,
      bankChecks,
    })
      .flat()
      .includes(false);

  const academicMandatory = () => {
    const universities = [];
    academicValues.forEach((obj) => {
      universities.push(obj.university);
    });
    const hasValue = universities.some((item) => item !== "" && item !== null);
    return hasValue;
  };

  const academicValidation = () => {
    return academicValues.every((obj) => {
      const isFilled = obj.university || obj.collegeName;
      if (isFilled) {
        return (
          obj.university &&
          obj.collegeName &&
          obj.passingYear &&
          obj.maxMarks &&
          obj.scoredMarks
        );
      }
      return true;
    });
  };

  const validateTranscript = () => {
    return transcriptValues
      .filter((fil) => fil.transcriptId !== null)
      .every((obj) => {
        return (
          obj.submittedStatus === true ||
          obj.lastDate !== null ||
          obj.notRequied === true
        );
      });
  };

  const CustomAccordianSummary = ({ Icon, title }) => (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton sx={{ padding: 0 }}>
          <Icon color="primary" sx={{ fontSize: 30 }} />
        </IconButton>
        <Typography variant="subtitle2" color="primary" sx={{ fontSize: 14 }}>
          {title}
        </Typography>
      </Box>
    </AccordionSummary>
  );

  const handleCreate = async () => {
    if (!academicValidation()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all the qualification details !!",
      });
      setAlertOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const {
        studentName,
        dob,
        gender,
        mobileNo,
        email,
        religion,
        casteCategory,
        bloodGroup,
        nationality,
        whatsAppNo,
      } = values;

      const {
        fatherName,
        fatherMobile,
        fatherEmail,
        fatherOccupation,
        fatherQualification,
        fatherIncome,
        motherName,
        motherMobile,
        motherEmail,
        motherOccupation,
        motherQualification,
        motherIncome,
      } = additionalValues;

      const {
        permanentAddress,
        permanentCountry,
        permanantState,
        permanantCity,
        permanentPincode,
        currentAddress,
        currentCountry,
        currentState,
        currentCity,
        currentPincode,
        localAddress,
        localCountry,
        localState,
        localCity,
        localPincode,
      } = addressValues;

      const {
        bankName,
        accountHolderName,
        accountNumber,
        bankBranch,
        ifscCode,
        aadharNo,
      } = bankValues;

      const {
        acYearId,
        schoolId,
        programId,
        programAssignmentId,
        prgId,
        feeTemplateId,
        admissionCategory,
        isRegular,
        latYear,
      } = programValues;

      const std = {};

      std.active = true;
      std.student_name = studentName;
      std.dateofbirth = dob;
      std.candidate_sex = gender;
      std.mobile = mobileNo;
      std.student_email = email;
      std.religion = religion;
      std.caste_category = casteCategory;
      std.blood_group = bloodGroup;
      std.nationality = nationality;
      std.whatsapp_number = whatsAppNo;

      std.father_name = fatherName;
      std.father_mobile = fatherMobile;
      std.father_email = fatherEmail;
      std.father_occupation = fatherOccupation;
      std.father_qualification = fatherQualification;
      std.father_income = fatherIncome;

      std.mother_name = motherName;
      std.mother_mobile = motherMobile;
      std.mother_email = motherEmail;
      std.mother_occupation = motherOccupation;
      std.mother_qualification = motherQualification;
      std.mother_income = motherIncome;

      std.guardian_name = motherName;
      std.guardian_phone = motherMobile;

      std.permanent_address = permanentAddress;
      std.permanant_country = permanentCountry;
      std.permanant_state = permanantState;
      std.permanant_city = permanantCity;
      std.permanant_pincode = permanentPincode;

      std.current_address = currentAddress;
      std.current_country = currentCountry;
      std.current_state = currentState;
      std.current_city = currentCity;
      std.current_pincode = currentPincode;

      std.local_adress1 = localAddress;
      std.local_country = localCountry;
      std.local_state = localState;
      std.local_city = localCity;
      std.local_pincode = localPincode;

      std.bank_name = bankName;
      std.account_holder_name = accountHolderName;
      std.account_number = accountNumber;
      std.bank_branch = bankBranch;
      std.ifsc_code = ifscCode;
      std.adhar_number = aadharNo;

      std.ac_year_id = acYearId;
      std.school_id = schoolId;
      std.program_id = prgId;
      std.program_assignment_id = programAssignmentId;
      std.program_specialization_id = programId;
      std.fee_template_id = feeTemplateId;
      std.fee_admission_category_id = admissionCategory;
      std.email_preferred_name = programValues.preferredName.trim();
      std.candidate_id = id;

      const reporting = {};
      reporting.current_year = !isRegular ? 1 : latYear;
      reporting.current_sem = !isRegular ? 1 : latYear;
      reporting.distinct_status = true;
      reporting.eligible_reported_status = 1;

      const education = [];
      academicValues.forEach((obj) => {
        if (obj.university !== "" || obj.collegeName !== "") {
          education.push({
            applicant_id: id,
            board_university: obj.university,
            college_name: obj.collegeName,
            subjects_studied: obj.subject,
            marks_total: obj.maxMarks,
            course: obj.qualification,
            total_obtained: obj.scoredMarks,
            percentage_scored: obj.percentage,
            passed_year: obj.passingYear,
          });
        }
      });

      const transcript = {};
      const submitted = [];
      const pending = {};
      const notApplicable = [];

      transcript.active = true;

      transcriptValues.forEach((obj) => {
        if (obj.submittedStatus === true) {
          submitted.push(obj.transcriptId);
        }

        if (obj.lastDate !== null) {
          pending[obj.transcriptId] = obj.lastDate;
        }

        if (obj.notRequied === true) {
          notApplicable.push(obj.transcriptId);
        }
      });

      transcript.transcript_id = submitted;
      transcript.will_submit_by = pending;
      transcript.not_applicable = notApplicable;

      const temp = {};

      temp.sd = std;
      temp.ap = education;
      temp.streq = transcript;
      temp.pgapp = {};
      temp.see = {};
      temp.srsh = {};
      temp.rs = reporting;

      const { data: response } = await axios.post(
        `/api/student/Student_Details`,
        temp
      );
      if (response.success) {
        setAlertMessage({
          severity: "success",
          message: "AUID has been created successfully",
        });
        setAlertOpen(true);
        navigate("/candidatewalkin", { replace: true });
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to create AUID !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    setConfirmContent({
      title: "",
      message: "Would you like to confirm?",
      buttons: [
        { name: "Yes", color: "primary", func: handleCreate },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const handleBack = () => {
    navigate(
      type === "user"
        ? "/candidatewalkin-userwise"
        : type === "admin"
        ? "/candidatewalkin"
        : ""
    );
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

      <Box
        sx={{
          margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" },
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Paper
              elevation={4}
              sx={{
                padding: 4,
                borderRadius: 4,
                backgroundColor: "#f7f7f7",
              }}
            >
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Divider sx={{ color: "primary.main" }}>
                      <Chip
                        label={
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ fontSize: 16 }}
                          >
                            ADMISSION
                          </Typography>
                        }
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Divider>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {/* Personal */}
                  <Accordion
                    sx={{ borderLeft: 4, borderColor: "primary.main" }}
                  >
                    <CustomAccordianSummary
                      Icon={ContactPageIcon}
                      title="Personal Details"
                    />
                    <AccordionDetails>
                      <Box sx={{ padding: 2 }}>
                        <PersonalDetailsForm
                          values={values}
                          setValues={setValues}
                          checks={checks}
                          errorMessages={errorMessages}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Additional  */}
                  <Accordion
                    sx={{ borderLeft: 4, borderColor: "primary.main" }}
                  >
                    <CustomAccordianSummary
                      Icon={PersonAddAlt1Icon}
                      title="Additional Information"
                    />
                    <AccordionDetails>
                      <Box sx={{ padding: 2 }}>
                        <AdditionalDetailsForm
                          additionalValues={additionalValues}
                          setAdditionalValues={setAdditionalValues}
                          additonalChecks={additonalChecks}
                          additionalErrorMessages={additionalErrorMessages}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                  {/* Address  */}
                  <Accordion
                    sx={{ borderLeft: 4, borderColor: "primary.main" }}
                  >
                    <CustomAccordianSummary Icon={HomeIcon} title="Address" />
                    <AccordionDetails>
                      <Box sx={{ padding: 2 }}>
                        <AddressDetailsForm
                          addressValues={addressValues}
                          setAddressValues={setAddressValues}
                          addressChecks={addressChecks}
                          addressErrorMessages={addressErrorMessages}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                  {/* Bank  */}
                  <Accordion
                    sx={{ borderLeft: 4, borderColor: "primary.main" }}
                  >
                    <CustomAccordianSummary
                      Icon={AccountBalanceIcon}
                      title="Bank Details"
                    />
                    <AccordionDetails>
                      <Box sx={{ padding: 2 }}>
                        <BankDetailsForm
                          bankValues={bankValues}
                          setBankValues={setBankValues}
                          bankChecks={bankChecks}
                          bankErrorMessages={bankErrorMessages}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                  {/* Academic  */}
                  <Accordion
                    sx={{ borderLeft: 4, borderColor: "primary.main" }}
                  >
                    <CustomAccordianSummary
                      Icon={SchoolIcon}
                      title="Academic Background"
                    />
                    <AccordionDetails>
                      <Box sx={{ padding: 2 }}>
                        <AcademicDetailsForm
                          academicValues={academicValues}
                          setAcademicValues={setAcademicValues}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                  {/* Program  */}
                  <Accordion
                    sx={{ borderLeft: 4, borderColor: "primary.main" }}
                  >
                    <CustomAccordianSummary
                      Icon={MenuBookIcon}
                      title="Program Details"
                    />
                    <AccordionDetails>
                      <Box sx={{ padding: 2 }}>
                        <ProgramDetailsForm
                          programValues={programValues}
                          setProgramValues={setProgramValues}
                          data={data}
                          noOfYears={noOfYears}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                  {/* Transcript  */}
                  <Accordion
                    sx={{ borderLeft: 4, borderColor: "primary.main" }}
                    defaultExpanded
                  >
                    <CustomAccordianSummary
                      Icon={FolderCopyIcon}
                      title="Document Collection"
                    />
                    <AccordionDetails>
                      <Box sx={{ padding: 2 }}>
                        <TranscriptDetailsForm
                          transcriptValues={transcriptValues}
                          setTranscriptValues={setTranscriptValues}
                          noStatuData={noStatuData}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    name="note"
                    label="Note"
                    value={notes}
                    handleChange={handleChange}
                    helperText={`Remaining characters : ${getRemainingCharacters(
                      "note"
                    )}`}
                    multiline
                  />
                </Grid>

                <Grid item xs={12} align="right" mt={2}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: "right",
                      justifyContent: "right",
                    }}
                  >
                    <Button variant="contained" onClick={() => handleBack()}>
                      GO BACK
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={
                        validateAllFields() ||
                        validateChecks() ||
                        !academicMandatory() ||
                        !validateTranscript()
                      }
                    >
                      {isLoading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AdmissionForm;
