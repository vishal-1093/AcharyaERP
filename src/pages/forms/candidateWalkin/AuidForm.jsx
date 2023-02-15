import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DesktopStepper from "../../../components/Steppers/DesktopFormStepper";
import AuidPersonalDetailsForm from "./AuidPersonalDetailsForm";
import { useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AuidCorrespondanceDetailsForm from "./AuidCorrespondanceDetailsForm";
import AuidAcademicDetailsForm from "./AuidAcademicDetailsForm";
import AuidDocumentDetailsForm from "./AuidDocumentDetailsForm";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "20px",

    [theme.breakpoints.down("md")]: {
      width: "90vw",
    },
  },
}));

const initialValues = {
  studentName: "",
  dob: null,
  gender: "",
  mobileNo: "",
  email: "",
  religion: "",
  castCategory: "",
  caste: "",
  bloodGroup: "",
  aadhar: "",
  nationality: "",
  currentYearSem: "",
  isInternational: false,
  passportName: "",
  birthPlace: "",
  arrivalPort: "",
  departurePort: "",
  reportedIndia: "",
  reportedOn: null,
  frroRemarks: "",
  passportNo: "",
  passportPlace: "",
  passportIssuedDate: null,
  passportExpiryDate: null,
  visaNo: "",
  visaType: "",
  typeofEntry: "",
  visaPlace: "",
  visaIssuedDate: null,
  visaExpiryDate: null,
  fsisNo: "",
  imMigrationDate: null,
  issueBy: "",
  rpNo: "",
  rpIssueDate: null,
  rpExpiryDate: null,
  aiuDocument: "",
  passportDocument: "",
  visaDocument: "",
  rpDocument: "",
  permanentAddress: "",
  permanentAddress1: "",
  currentAddress: "",
  currentAddress1: "",
  localAddress: "",
  localAddress1: "",
  permanentCountry: "",
  currentCountry: "",
  localCountry: "",
  permanantState: "",
  currentState: "",
  localState: "",
  permanantCity: "",
  currentCity: "",
  localCity: "",
  permanantPincode: "",
  currentPincode: "",
  localPincode: "",
  accountHolderName: "",
  accountNumber: "",
  bankName: "",
  ifscCode: "",
  fatherName: "",
  fatherEmail: "",
  fatherMobile: "",
  fatherOccupation: "",
  fatherIncome: "",
  motherName: "",
  motherEmail: "",
  motherMobile: "",
  motherOccupation: "",
  motherIncome: "",
  guardianName: "",
  guardianEmail: "",
  guardianMobile: "",
  guardianOccupation: "",
  schoolId: "",
  acyearId: "",
  feeAdmissionCategory: "",
  programId: "",
  programSpecializationId: "",
  feeTemplateId: "",
  education: [
    {
      qualification: "",
      passingYear: "",
      university: "",
      collegeName: "",
      subject: "",
      maxMarks: "",
      scoredMarks: "",
      percentage: "",
      label: "SSLC / Intermediate",
    },
    {
      qualification: "",
      passingYear: "",
      university: "",
      collegeName: "",
      subject: "",
      maxMarks: "",
      scoredMarks: "",
      percentage: "",
      label: "PUC / 12TH",
    },
  ],
  studyIn: "",
  studyMedium: "",
  transcriptId: [],
  submitBy: null,
  transcript: [],
  collectedBy: "",
};

const personalRequiredFileds = [
  "studentName",
  "dob",
  "gender",
  "mobileNo",
  "email",
  "religion",
  "castCategory",
  "bloodGroup",
  "aadhar",
  "nationality",
];

const correspondanceRequiredFileds = [
  "permanentAddress",
  "permanentAddress1",
  "currentAddress",
  "currentAddress1",
  "localAddress",
  "localAddress1",
  "permanentCountry",
  "currentCountry",
  "localCountry",
  "permanantState",
  "currentState",
  "localState",
  "permanantCity",
  "currentCity",
  "localCity",
  "permanantPincode",
  "currentPincode",
  "localPincode",
  "accountHolderName",
  "accountNumber",
  "bankName",
  "ifscCode",
  "fatherName",
  "fatherMobile",
  "fatherOccupation",
  "motherName",
  "motherMobile",
  "motherOccupation",
];

const frroRequiredFields = [
  "passportName",
  "birthPlace",
  "passportNo",
  "passportPlace",
  "passportIssuedDate",
  "passportExpiryDate",
];

function AuidForm() {
  const [values, setValues] = useState(initialValues);
  const [activeStep, setActiveStep] = useState(3);
  const [candidateData, setCandidateData] = useState([]);
  const [candidateProgramData, setCandidateProgramData] = useState([]);
  const [transcriptData, setTranscriptData] = useState([]);
  const [transcriptOptions, setTranscriptOptions] = useState([]);
  const [academicRequiredFields, setacademicRequiredFields] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    // personal details

    studentName: [values.studentName !== ""],
    mobileNo: [values.mobileNo !== ""],
    email: [values.email !== ""],
    religion: [values.religion !== ""],
    castCategory: [values.castCategory !== ""],
    caste: [values.caste !== ""],
    bloodGroup: [values.bloodGroup !== ""],
    aadhar: [values.aadhar !== "", /^[0-9]{12}$/.test(values.aadhar)],
    nationality: [values.nationality !== ""],

    // FRRO details
    passportName: [values.passportName !== ""],
    birthPlace: [values.birthPlace !== ""],
    passportNo: [values.passportNo !== ""],
    passportPlace: [values.passportPlace !== ""],
    passportIssuedDate: [values.passportIssuedDate !== null],
    passportExpiryDate: [values.passportExpiryDate !== null],
    aiuDocument: [
      values.aiuDocument && values.aiuDocument.name.endsWith(".pdf"),
      values.aiuDocument && values.aiuDocument.size < 2000000,
    ],
    passportDocument: [
      values.passportDocument && values.passportDocument.name.endsWith(".pdf"),
      values.passportDocument && values.passportDocument.size < 2000000,
    ],
    visaDocument: [
      values.visaDocument && values.visaDocument.name.endsWith(".pdf"),
      values.visaDocument && values.visaDocument.size < 2000000,
    ],
    rpDocument: [
      values.rpDocument && values.rpDocument.name.endsWith(".pdf"),
      values.rpDocument && values.rpDocument.size < 2000000,
    ],

    // address details

    permanentAddress: [values.permanentAddress !== ""],
    currentAddress: [values.currentAddress !== ""],
    localAddress: [values.localAddress !== ""],
    permanentAddress1: [values.permanentAddress1 !== ""],
    currentAddress1: [values.currentAddress1 !== ""],
    localAddress1: [values.localAddress1 !== ""],
    permanentCountry: [values.permanentCountry !== ""],
    currentCountry: [values.currentCountry !== ""],
    localCountry: [values.localCountry !== ""],
    permanantState: [values.permanantState !== ""],
    currentState: [values.currentState !== ""],
    localState: [values.localState !== ""],
    permanantCity: [values.permanantCity !== ""],
    currentCity: [values.currentCity !== ""],
    localCity: [values.localCity !== ""],
    permanantPincode: [values.permanantPincode !== ""],
    currentPincode: [values.currentPincode !== ""],
    localPincode: [values.localPincode !== ""],
    accountHolderName: [values.accountHolderName !== ""],
    accountNumber: [values.accountNumber !== ""],
    bankName: [values.bankName !== ""],
    ifscCode: [values.ifscCode !== ""],
    fatherName: [values.fatherName !== ""],
    fatherEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.fatherEmail
      ),
    ],
    fatherMobile: [
      values.fatherMobile !== "",
      /^[0-9]{10}$/.test(values.fatherMobile),
    ],
    fatherOccupation: [values.fatherOccupation !== ""],
    fatherIncome: [/^[0-9]{1,100}$/.test(values.fatherIncome)],
    motherName: [values.motherName !== ""],
    motherEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.motherEmail
      ),
    ],
    motherMobile: [
      values.motherMobile !== "",
      /^[0-9]{10}$/.test(values.motherMobile),
    ],
    motherOccupation: [values.motherOccupation !== ""],
    motherIncome: [/^[0-9]{1,100}$/.test(values.motherIncome)],
    guardianEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.guardianEmail
      ),
    ],
    guardianMobile: [/^[0-9]{10}$/.test(values.guardianMobile)],
  };

  const errorMessages = {
    // Personal Details

    studentName: ["This field is required"],
    mobileNo: ["This field is required"],
    email: ["This field is required"],
    religion: ["This field is required"],
    castCategory: ["This field is required"],
    caste: ["This field is required"],
    bloodGroup: ["This field is required"],
    aadhar: ["This field is required", "Invalid Aadhar"],
    nationality: ["This field is required"],

    // FRRO details
    passportName: ["This field is required"],
    birthPlace: ["This field is required"],
    passportNo: ["This field is required"],
    passportPlace: ["This field is required"],
    passportIssuedDate: ["This field is required"],
    passportExpiryDate: ["This field is required"],
    aiuDocument: ["Please upload a PDF", "Maximum size 2 MB"],
    passportDocument: ["Please upload a PDF", "Maximum size 2 MB"],
    visaDocument: ["Please upload a PDF", "Maximum size 2 MB"],
    rpDocument: ["Please upload a PDF", "Maximum size 2 MB"],

    // Address Details

    permanentAddress: ["This field required"],
    currentAddress: ["This field required"],
    localAddress: ["This field required"],
    permanentAddress1: ["This field required"],
    currentAddress1: ["This field required"],
    localAddress1: ["This field required"],
    permanentCountry: ["This field required"],
    currentCountry: ["This field required"],
    localCountry: ["This field required"],
    permanantState: ["This field required"],
    currentState: ["This field required"],
    localState: ["This field required"],
    permanantCity: ["This field required"],
    currentCity: ["This field required"],
    localCity: ["This field required"],
    permanantPincode: ["This field required"],
    currentPincode: ["This field required"],
    localPincode: ["This field required"],
    accountHolderName: ["This field required"],
    accountNumber: ["This field required"],
    bankName: ["This field required"],
    ifscCode: ["This field required"],
    fatherName: ["This field required"],
    fatherEmail: ["Invalid email"],
    fatherMobile: ["This field required", "Invalid Phone"],
    fatherOccupation: ["This field required"],
    fatherIncome: ["Invalid Income"],
    motherName: ["This field required"],
    motherEmail: ["Invalid email"],
    motherMobile: ["This field required", "Invalid Phone"],
    motherOccupation: ["This field required"],
    motherIncome: ["Invalid Income"],
    guardianEmail: ["Invalid email"],
    guardianMobile: ["Invalid Phone"],
  };

  const requiredFieldsValid = (fields) => {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const classes = useStyles();

  const steps = [
    {
      label: "Personal Details",
      form: (
        <AuidPersonalDetailsForm
          candidateData={candidateData}
          candidateProgramData={candidateProgramData}
          noOfYears={noOfYears}
          values={values}
          setValues={setValues}
          checks={checks}
          errorMessages={errorMessages}
        />
      ),
    },
    {
      label: "Address Details",
      form: (
        <AuidCorrespondanceDetailsForm
          values={values}
          setValues={setValues}
          checks={checks}
          errorMessages={errorMessages}
        />
      ),
    },
    {
      label: "Academic Background",
      form: (
        <AuidAcademicDetailsForm
          values={values}
          setValues={setValues}
          checks={checks}
          errorMessages={errorMessages}
        />
      ),
    },
    {
      label: "Documents",
      form: (
        <AuidDocumentDetailsForm
          values={values}
          setValues={setValues}
          transcriptData={transcriptData}
          transcriptOptions={transcriptOptions}
        />
      ),
    },
  ];

  useEffect(() => {
    if (values.isInternational === "true") {
      frroRequiredFields.forEach((obj) => {
        if (personalRequiredFileds.includes(obj) === false) {
          personalRequiredFileds.push(obj);
        }
      });
    } else {
      frroRequiredFields.forEach((obj) => {
        if (personalRequiredFileds.includes(obj) === true) {
          personalRequiredFileds.splice(personalRequiredFileds.indexOf(obj), 1);
        }
      });
    }
  }, [values.isInternational]);

  useEffect(() => {
    getCandidateData();
    getCandidateProgramData();
  }, []);

  const getCandidateData = async () => {
    await axios(`/api/student/Candidate_Walkin/${id}`)
      .then((res) => {
        const data = res.data.data;

        setValues((prev) => ({
          ...prev,
          studentName: res.data.data.candidate_name,
          dob: res.data.data.date_of_birth,
          gender: res.data.data.candidate_sex,
          mobileNo: res.data.data.mobile_number,
          email: res.data.data.candidate_email,
          schoolId: res.data.data.schoo_id,
          acyearId: res.data.data.schoo_id,
          feeAdmissionCategory: res.data.data.schoo_id,
          programId: res.data.data.program_id,
          programSpecializationId: res.data.data.program_specialization_id,
          feeTemplateId: res.data.data.fee_template_id,
        }));

        axios
          .get(
            `/api/academic/fetchProgramTranscriptDetails/${res.data.data.program_id}`
          )
          .then((res) => {
            setTranscriptOptions(
              res.data.data.map((obj) => ({
                value: obj.transcript_id,
                label: obj.transcript,
              }))
            );
            const transcriptObj = res.data.data.map((obj, i) => ({
              transcriptId: "",
              lastDate: null,
              submittedStatus: false,
            }));

            setValues((prev) => ({
              ...prev,
              transcript: transcriptObj,
            }));
            setTranscriptData(res.data.data);
          })
          .catch((err) => console.error(err));

        setCandidateData(data);
      })
      .catch((err) => console.error(err));
  };

  const getCandidateProgramData = async () => {
    await axios(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCandidateProgramData(res.data.data[0]);

        axios
          .get(
            `/api/academic/FetchAcademicProgram/${res.data.data[0].ac_year_id}/${res.data.data[0].program_id}/${res.data.data[0].school_id}`
          )
          .then((res) => {
            const yearSem = [];

            if (res.data.data[0].program_type.toLowerCase() === "yearly") {
              for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                yearSem.push({ value: i, label: "Year " + i });
              }
            } else if (
              res.data.data[0].program_type.toLowerCase() === "semester"
            ) {
              for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
                yearSem.push({ value: i, label: "Sem " + i });
              }
            }

            setNoOfYears(yearSem);
          })
          .catch((err) => console.error(err));

        axios
          .get(
            `/api/academic/fetchProgramTranscriptDetails/${res.data.data[0].program_id}`
          )
          .then((res) => {
            setTranscriptOptions(
              res.data.data.map((obj) => ({
                value: obj.transcript_id,
                label: obj.transcript,
              }))
            );

            const transcriptObj = res.data.data.map((obj, i) => ({
              transcriptId: "",
              lastDate: null,
              submittedStatus: false,
            }));

            setValues((prev) => ({
              ...prev,
              transcript: transcriptObj,
            }));
            // values["transcript"] = res.data.data.map((obj) => ({
            //   transcriptId: "",
            //   lastDate: "",
            // }));
            setTranscriptData(res.data.data);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleNext = () => {
    const tab = [
      personalRequiredFileds,
      correspondanceRequiredFileds,
      academicRequiredFields,
    ];

    if (activeStep !== 3 && !requiredFieldsValid(tab[activeStep])) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }

    if (activeStep === 3) {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    const temp = {};

    const personal = {};
    const education = [];
    const transcript = {};
    const submitted = [];
    const pending = {};

    personal.acharya_email = values.acharyaEmail;
    personal.adhar_number = values.aadhar;
    personal.student_name = values.studentName;
    personal.candidate_sex = values.gender;
    personal.nationality = values.nationality;
    personal.mobile = values.mobileNo;
    personal.dateofbirth = values.dob;
    personal.father_name = values.fatherName;
    personal.mother_name = values.motherName;
    personal.current_address = values.currentAddress;
    personal.permanent_address = values.permanentAddress;
    personal.guardian_name = values.guardianName;
    personal.blood_group = values.bloodGroup;
    personal.religion = values.religion;
    personal.caste = values.castCategory;
    personal.permanant_country = values.permanentCountry;
    personal.permanant_pincode = values.permanantPincode;
    personal.permanant_city = values.permanantCity;
    personal.local_state = values.localState;
    personal.local_city = values.localCity;
    personal.current_city = values.currentCity;
    personal.current_state = values.currentState;
    personal.current_country = values.localPincode;
    personal.local_pincode = values.currentCountry;
    personal.current_pincode = values.currentPincode;
    personal.permanant_state = values.permanantState;
    personal.account_holder_name = values.accountHolderName;
    personal.bank_name = values.bankName;
    personal.account_number = values.accountNumber;
    personal.ifsc_code = values.ifscCode;
    personal.father_occupation = values.fatherOccupation;
    personal.mother_occupation = values.motherOccupation;
    personal.candidate_id = values.id;
    personal.school_id = values.schoolId;
    personal.ac_year_id = values.acyearId;
    personal.program_id = values.programId;
    personal.program_specialization_id = values.programSpecializationId;
    personal.fee_template_id = values.feeTemplateId;

    values.education.forEach((obj) => {
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
    });

    transcript.active = true;
    if (values.collectedBy === "institute") {
      transcript.collected_by_institute = true;
    }

    values.transcript.forEach((obj) => {
      if (obj.submittedStatus === true) {
        submitted.push(obj.transcriptId);
      }

      if (obj.submittedStatus === false && obj.lastDate !== null) {
        pending[obj.transcriptId] = obj.lastDate;
      }
    });

    transcript.transcript_id = submitted;
    transcript.will_submit_by = pending;

    temp.sd = personal;
    temp.ap = education;
    temp.streq = transcript;
    temp.pgapp = {};
    temp.see = {};
    temp.rs = {};
    temp.srsh = {};

    await axios
      .post(`/api/student/Student_Details`, temp)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <>
      <Paper
        elevation={3}
        className={classes.paper}
        sx={{ backgroundColor: "#f7f7f7", borderRadius: 3 }}
      >
        <DesktopStepper
          steps={steps}
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          message="AUID created successfully !!"
        />
      </Paper>
    </>
  );
}

export default AuidForm;
