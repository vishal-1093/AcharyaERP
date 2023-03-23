import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Button, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DesktopStepper from "../../../components/Steppers/DesktopFormStepper";
import AuidPersonalDetailsForm from "./AuidPersonalDetailsForm";
import { Link, useParams, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AuidCorrespondanceDetailsForm from "./AuidCorrespondanceDetailsForm";
import AuidAcademicDetailsForm from "./AuidAcademicDetailsForm";
import AuidDocumentDetailsForm from "./AuidDocumentDetailsForm";
import SchoolIcon from "@mui/icons-material/School";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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
  casteCategory: "",
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
  fatherQualification: "",
  fatherOccupation: "",
  fatherIncome: "",
  motherName: "",
  motherEmail: "",
  motherMobile: "",
  motherQualification: "",
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
  "casteCategory",
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
  "fatherName",
  "fatherEmail",
  "fatherMobile",
  "fatherQualification",
  "fatherOccupation",
  "fatherIncome",
  "motherName",
  "motherEmail",
  "motherMobile",
  "motherQualification",
  "motherOccupation",
  "motherIncome",
];

const frroRequiredFields = [
  "passportName",
  "birthPlace",
  "passportNo",
  "passportPlace",
  "passportIssuedDate",
  "passportExpiryDate",
];

const academicRequiredFields = ["studyIn", "studyMedium"];

const icons = {
  1: <GroupAddIcon />,
  2: <HomeIcon />,
  3: <SchoolIcon />,
  4: <FolderIcon />,
};

function AuidForm() {
  const [values, setValues] = useState(initialValues);
  const [activeStep, setActiveStep] = useState(0);
  const [candidateData, setCandidateData] = useState([]);
  const [candidateProgramData, setCandidateProgramData] = useState([]);
  const [transcriptData, setTranscriptData] = useState([]);
  const [transcriptOptions, setTranscriptOptions] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [message, setMessage] = useState([]);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    // personal details

    studentName: [values.studentName !== ""],
    mobileNo: [values.mobileNo !== ""],
    email: [values.email !== ""],
    religion: [values.religion !== ""],
    casteCategory: [values.casteCategory !== ""],
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
      values.fatherEmail !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.fatherEmail
      ),
    ],
    fatherMobile: [
      values.fatherMobile !== "",
      /^[0-9]{10}$/.test(values.fatherMobile),
    ],
    fatherOccupation: [values.fatherOccupation !== ""],
    fatherQualification: [values.fatherQualification !== ""],
    fatherIncome: [
      values.fatherIncome !== "",
      /^[0-9]{1,100}$/.test(values.fatherIncome),
    ],
    motherName: [values.motherName !== ""],
    motherEmail: [
      values.motherEmail !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.motherEmail
      ),
    ],
    motherMobile: [
      values.motherMobile !== "",
      /^[0-9]{10}$/.test(values.motherMobile),
    ],
    motherOccupation: [values.motherOccupation !== ""],
    motherQualification: [values.motherQualification !== ""],
    motherIncome: [
      values.motherIncome !== "",
      /^[0-9]{1,100}$/.test(values.motherIncome),
    ],
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
    casteCategory: ["This field is required"],
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
    fatherEmail: ["This field required", "Invalid email"],
    fatherMobile: ["This field required", "Invalid Phone"],
    fatherOccupation: ["This field required"],
    fatherQualification: ["This field required"],
    fatherIncome: ["This field required", "Invalid Income"],
    motherName: ["This field required"],
    motherEmail: ["This field required", "Invalid email"],
    motherMobile: ["This field required", "Invalid Phone"],
    motherOccupation: ["This field required"],
    motherQualification: ["This field required"],
    motherIncome: ["This field required", "Invalid Income"],
    guardianEmail: ["Invalid email"],
    guardianMobile: ["Invalid Phone"],
  };

  values.education.forEach((obj, i) => {
    checks["passingYear" + i] = [
      /^[0-9]+$/.test(values.education[i].passingYear),
    ];
    errorMessages["passingYear" + i] = ["Invalid passing year"];
    checks["maxMarks" + i] = [/^[0-9]+$/.test(values.education[i].maxMarks)];
    errorMessages["maxMarks" + i] = ["Invalid marks"];
    checks["scoredMarks" + i] = [
      /^[0-9]+$/.test(values.education[i].scoredMarks),
    ];
    errorMessages["scoredMarks" + i] = ["Invalid marks"];
  });

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
    setCrumbs([{ name: "" }]);
  }, []);

  const getCandidateData = async () => {
    await axios(`/api/student/Candidate_Walkin/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setValues((prev) => ({
          ...prev,
          studentName: res.data.data.candidate_name,
          dob: res.data.data.date_of_birth,
          gender: res.data.data.candidate_sex,
          mobileNo: res.data.data.mobile_number,
          email: res.data.data.candidate_email,
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

        setCandidateData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getCandidateProgramData = async () => {
    const preAdmissionData = await axios(
      `/api/student/findAllDetailsPreAdmission/${id}`
    )
      .then((res) => {
        setCandidateProgramData(res.data.data[0]);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    const programData = await axios
      .get(
        `/api/academic/FetchAcademicProgram/${preAdmissionData.ac_year_id}/${preAdmissionData.program_id}/${preAdmissionData.school_id}`
      )
      .then((res) => {
        //Contains no of year/sem for reporting students

        if (preAdmissionData.year_sem === true) {
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

          if (personalRequiredFileds.includes("currentYearSem") === false) {
            personalRequiredFileds.push("currentYearSem");
          }

          setNoOfYears(yearSem);
        }
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    // Fetching transcript data
    const getTransactipts = await axios
      .get(
        `/api/academic/fetchProgramTranscriptDetails/${preAdmissionData.program_id}`
      )
      .then((res) => {
        const transcriptObj = res.data.data.map((obj, i) => ({
          transcriptId: "",
          lastDate: null,
          submittedStatus: false,
        }));

        setTranscriptOptions(
          res.data.data.map((obj) => ({
            value: obj.transcript_id,
            label: obj.transcript,
          }))
        );

        setTranscriptData(res.data.data);
        return transcriptObj;
      })
      .catch((err) => console.error(err));

    setValues((prev) => ({
      ...prev,
      feeAdmissionCategory: preAdmissionData.fee_admission_category_id,
      programType: programData.program_type.toLowerCase(),
      schoolId: preAdmissionData.school_id,
      acyearId: preAdmissionData.ac_year_id,
      programId: preAdmissionData.program_id,
      programSpecializationId: preAdmissionData.program_specialization_id,
      feeTemplateId: preAdmissionData.fee_template_id,
      transcript: getTransactipts,
    }));
  };

  const academicValidation = () => {
    const academicChecks = [];
    values.education.forEach((obj) => {
      if (
        ((obj.university !== "" && obj.university !== null) ||
          obj.collegeName !== "") &&
        (obj.university === "" ||
          obj.university === null ||
          obj.collegeName === "" ||
          obj.passingYear === "" ||
          obj.maxMarks === "" ||
          obj.scoredMarks === "")
      ) {
        academicChecks.push(false);
      }
    });

    if (academicChecks.includes(false) === true) {
      return false;
    } else {
      return true;
    }
  };

  const handleNext = () => {
    const tab = [
      personalRequiredFileds,
      correspondanceRequiredFileds,
      academicRequiredFields,
    ];

    if (activeStep === 2 && !academicValidation()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields of selected qualification",
      });
      setAlertOpen(true);
      return false;
    }
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
    const personal = {};

    personal.active = true;
    personal.mobile = values.mobileNo;
    personal.email = values.email;
    personal.ac_year_id = values.acyearId;
    personal.school_id = values.schoolId;
    personal.program_id = values.programId;
    personal.program_specialization_id = values.programSpecializationId;
    personal.fee_template_id = values.feeTemplateId;
    personal.fee_admission_category_id = values.feeTemplateId;
    personal.student_name = values.studentName;
    personal.dateofbirth = values.dob;
    personal.candidate_sex = values.gender;
    personal.religion = values.religion;
    personal.caste_category = values.casteCategory;
    personal.caste = values.caste;
    personal.blood_group = values.bloodGroup;
    personal.adhar_number = values.aadhar;
    personal.nationality = values.nationality;
    personal.permanent_address = values.permanentAddress;
    personal.permanant_adress1 = values.permanentAddress1;
    personal.permanant_country = values.permanentCountry;
    personal.permanant_state = values.permanantState;
    personal.permanant_city = values.permanantCity;
    personal.permanant_pincode = values.permanantPincode;
    personal.current_address = values.currentAddress;
    personal.current_adress1 = values.currentAddress1;
    personal.current_country = values.currentCountry;
    personal.current_state = values.currentState;
    personal.current_city = values.currentCity;
    personal.current_pincode = values.currentPincode;
    personal.local_adress1 = values.localAddress + values.localAddress1;
    personal.local_country = values.localCountry;
    personal.local_state = values.localState;
    personal.local_city = values.localPincode;
    personal.local_pincode = values.localPincode;
    personal.account_holder_name = values.accountHolderName;
    personal.account_number = values.accountNumber;
    personal.bank_name = values.bankName;
    personal.ifsc_code = values.ifscCode;

    personal.father_name = values.fatherName;
    personal.father_email = values.fatherEmail;
    // personal.father_mobile = values.fatherMobile;
    personal.father_occupation = values.fatherOccupation;
    personal.father_qualification = values.fatherQualification;
    personal.father_income = values.fatherIncome;
    // father mobile is need to added

    personal.mother_name = values.motherName;
    personal.mother_email = values.motherEmail;
    // personal.mother_mobile = values.motherMobile;
    personal.mother_occupation = values.motherOccupation;
    personal.mother_qualification = values.motherQualification;
    personal.mother_income = values.motherIncome;
    // mother mobile is need to be addedd

    personal.guardian_name = values.guardianName;
    personal.guardian_phone = values.guardianMobile;
    // guradian email and occupation is needed
    personal.candidate_id = id;

    // Academic Data
    const education = [];

    values.education.forEach((obj) => {
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

    // Transcript Data
    const transcript = {};
    const submitted = [];
    const pending = {};

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

    // Creating format for post api
    const temp = {};

    temp.sd = personal;
    temp.ap = education;
    temp.streq = transcript;
    temp.pgapp = {};
    temp.see = {};
    temp.srsh = {};

    const reporting = {};

    if (values.currentYearSem) {
      reporting.active = true;
      if (values.programType.toLowerCase() === "semester") {
        reporting.current_sem = values.currentYearSem;
        reporting.current_year = Math.round(values.currentYearSem / 2);
      } else {
        reporting.current_sem = 0;
        reporting.current_year = values.currentYearSem;
      }

      reporting.distinct_status = true;
      reporting.eligible_reported_status = 1;
    }
    temp.rs = reporting;

    const getStudentId = await axios
      .post(`/api/student/Student_Details`, temp)
      .then((res) => {
        console.log(res);
        setMessage(
          <>
            <Typography variant="subtitle2">
              AUID Created Successfully
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() =>
                navigate(
                  `/studentdocumentcollectionpdf/${res.data.data.student_id}`
                )
              }
            >
              <Typography variant="subtitle1">{res.data.data.auid}</Typography>
            </Button>
          </>
        );
        return res.data.data.auid;
      })
      .catch((err) => console.error(err));

    if (values.isInternational === "true") {
      const frroTemp = {};

      frroTemp.active = true;
      frroTemp.fsis_no = values.fsisNo;
      frroTemp.immigration_date = values.imMigrationDate;
      frroTemp.issue_by = values.issueBy;
      frroTemp.passport_expiry_date = values.passportExpiryDate;
      frroTemp.passport_issue_date = values.passportIssuedDate;
      frroTemp.passport_issue_place = values.passportPlace;
      frroTemp.passport_no = values.passportNo;
      frroTemp.place_of_birth = values.birthPlace;
      frroTemp.place_of_visa_issue = values.visaPlace;
      frroTemp.port_of_arrival = values.arrivalPort;
      frroTemp.port_of_departure = values.departurePort;
      frroTemp.remarks = values.frroRemarks;
      frroTemp.reported_on = values.reportedOn;
      frroTemp.reported_to_india = values.reportedIndia;
      frroTemp.rp_expiry_date = values.rpExpiryDate;
      frroTemp.rp_issue_date = values.rpIssueDate;
      frroTemp.rp_no = values.rpNo;
      frroTemp.student_id = values.fsisNo;
      frroTemp.surname = values.passportName;
      frroTemp.type_of_entry = values.typeofEntry;
      frroTemp.visa_expiry_date = values.visaExpiryDate;
      frroTemp.visa_issue_date = values.visaIssuedDate;
      frroTemp.visa_no = values.visaNo;
      frroTemp.visa_type = values.visaType;

      const frroUpload = new FormData();

      frroUpload.append("passport_copy_document_file", values.passportDocument);
      frroUpload.append("visa_copy_document_file", values.visaDocument);
      frroUpload.append(
        "residential_permit_copy_document_file",
        values.rpDocument
      );
      frroUpload.append("aiu_equivalence_document_file", values.aiuDocument);
      frroUpload.append("student_id", getStudentId);

      await axios
        .post(`/api/student/frroDetails`, frroTemp)
        .then((res) => {
          frroUpload.append("frrod_id", res.data.data.frro_id);

          axios
            .post(`/api/student/FrroDetailsUploadFile`, frroUpload)
            .then((res) => {})
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
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
          message={message}
          icons={icons}
        />
      </Paper>
    </>
  );
}

export default AuidForm;
