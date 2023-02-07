import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DesktopStepper from "../../../components/Steppers/DesktopFormStepper";
import AuidPersonalDetailsForm from "./AuidPersonalDetailsForm";
import { useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";

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
  bloodGroup: "",
  aadhar: "",
  nationality: "",
  acharyaEmail: "",
  permanentAddress: "",
  currentAddress: "",
  localAdress1: "",
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
  fatherOccupation: "",
  motherName: "",
  motherEmail: "",
  motherOccupation: "",
  guardianName: "",
  guardianEmail: "",
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
    },
  ],
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

function AuidForm() {
  const [values, setValues] = useState(initialValues);
  const [activeStep, setActiveStep] = useState(0);
  const [candidateData, setCandidateData] = useState([]);
  const [candidateProgramData, setCandidateProgramData] = useState([]);
  const [transcriptData, setTranscriptData] = useState([]);
  const [transcriptOptions, setTranscriptOptions] = useState([]);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    studentName: [values.studentName !== ""],
    mobileNo: [values.mobileNo !== ""],
    email: [values.email !== ""],
    religion: [values.religion !== ""],
    castCategory: [values.castCategory !== ""],
    bloodGroup: [values.bloodGroup !== ""],
    aadhar: [values.aadhar !== "", /^[0-9]{12}$/.test(values.aadhar)],
    nationality: [values.nationality !== ""],
  };
  const errorMessages = {
    studentName: ["This field is required"],
    mobileNo: ["This field is required"],
    email: ["This field is required"],
    religion: ["This field is required"],
    castCategory: ["This field is required"],
    bloodGroup: ["This field is required"],
    aadhar: ["This field is required", "Invalid Aadhar"],
    nationality: ["This field is required"],
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
          values={values}
          setValues={setValues}
          checks={checks}
          errorMessages={errorMessages}
        />
      ),
    },
  ];

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
            `/api/academic/ProgramSpecilization/${res.data.data.program_specilaization_id}`
          )
          .then((res) => {
            data["auidFormat"] = res.data.data.auid_format;
          })
          .catch((err) => console.error(err));

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

        axios
          .get(`/api/student/findAllDetailsPreAdmission/${id}`)
          .then((res) => {
            const splitYears = res.data.data[0].ac_year.split("");

            const acharyaMail =
              data.candidate_name.toLowerCase().trim().replace(/ +/g, "") +
              data.father_name.split("")[0] +
              splitYears[7] +
              splitYears[8] +
              data.auidFormat.toLowerCase() +
              "@acharya.ac.in";

            data["acharyaEmail"] = acharyaMail;
            setValues((prev) => ({
              ...prev,
              acharyaEmail: acharyaMail,
            }));
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
      //   correspondanceRequiredFileds,
      //   academicRequiredFields,
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

  const handleCreate = async () => {};

  const handleBack = () => {};

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
        />
      </Paper>
    </>
  );
}

export default AuidForm;
