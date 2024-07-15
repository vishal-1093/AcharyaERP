import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import religionList from "../../../utils/ReligionList";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UndoIcon from "@mui/icons-material/Undo";
import Visibility from "@mui/icons-material/Visibility";
import ModalWrapper from "../../../components/ModalWrapper";
import FeeTemplateView from "../../../components/FeeTemplateView";
import occupationList from "../../../utils/OccupationList";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";
import Backdrop from "@mui/material/Backdrop";

const initialValues = {
  auid: "",
  studentName: "",
  dob: null,
  gender: "",
  mobileNo: "",
  alternateMobile: "",
  email: "",
  religion: "",
  casteCategory: "",
  bloodGroup: "",
  permanentCountry: null,
  permanantState: null,
  permanantCity: null,
  permanentAddress: "",
  permanentPincode: "",
  currentCountry: null,
  currentState: null,
  currentCity: null,
  currentAddress: "",
  currentPincode: "",
  localAddress: "",
  localCountry: null,
  localState: null,
  localCity: null,
  localPincode: "",
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  bankBranch: "",
  ifscCode: "",
  aadharNo: "",
  acyearId: null,
  schoolId: null,
  programId: null,
  nationality: null,
  admissionCategory: null,
  admissionSubCategory: null,
  feetemplateId: null,
  preferredName: "",
  fatherName: "",
  fatherEmail: "",
  fatherMobile: "",
  fatherOccupation: null,
  fatherQualification: "",
  fatherIncome: "",
  motherName: "",
  motherEmail: "",
  motherMobile: "",
  motherOccupation: null,
  motherQualification: "",
  motherIncome: "",
  guardianName: "",
  guardianMobile: "",
  guardianEmail: "",
  guardianOccupation: null,
  isNri: false,
  acharyaEmail: "",
};

const requiredFields = [
  "auid",
  "studentName",
  "dob",
  "gender",
  "mobileNo",
  "preferredName",
  "acyearId",
  "schoolId",
  "programId",
  "admissionCategory",
  "admissionSubCategory",
  "nationality",
  "feetemplateId",
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function SpotAdmissionForm() {
  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [permanantStates, setPermanantStates] = useState([]);
  const [permanantCities, setPermanantCities] = useState([]);
  const [currentStates, setCurrentStates] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);
  const [localStates, setLocalStates] = useState([]);
  const [localCities, setLocalCities] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [program, setProgram] = useState([]);
  const [programData, setProgramData] = useState();
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [feeTemplateOptions, setFeeTemplateOptions] = useState([]);
  const [copyPermanantStatus, setCopyPermanantStatus] = useState(false);
  const [copyCurrentStatus, setCopyCurrentStatus] = useState(false);
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [prefferedCheck, setPrefferedCheck] = useState(false);
  const [backDropOpen, setBackDropOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    auid: [
      values.auid !== "",
      /^[a-zA-Z0-9]*$/.test(values.auid),
      /^[A-Za-z]{3}\d{2}[A-Za-z]{4}\d{3}$/.test(values.auid),
    ],
    studentName: [
      values.studentName !== "",
      /^[a-zA-Z0-9 ]*$/.test(values.studentName),
    ],
    mobileNo: [/^[0-9]{10}$/.test(values.mobileNo)],
    alternateMobile: [/^[0-9]{10}$/.test(values.alternateMobile)],
    email: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
    ],
    fatherEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.fatherEmail
      ),
    ],
    motherEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.motherEmail
      ),
    ],
    guardianEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.guardianEmail
      ),
    ],
    fatherMobile: [/^[0-9]{10}$/.test(values.fatherMobile)],
    motherMobile: [/^[0-9]{10}$/.test(values.motherMobile)],
    guardianMobile: [/^[0-9]{10}$/.test(values.guardianMobile)],
    aadharNo: [/^[0-9]{12}$/.test(values.aadharNo)],
  };

  const errorMessages = {
    auid: [
      "This field is required",
      "Special characters and space is not allowed",
      "Invalid AUID",
    ],
    studentName: [
      "This field is required",
      "Special characters and space is not allowed",
    ],
    mobileNo: ["Invalid Mobile No."],
    alternateMobile: ["Invalid Mobile No."],
    email: ["Invalid email"],
    fatherEmail: ["Invalid email"],
    motherEmail: ["Invalid email"],
    guardianEmail: ["Invalid email"],
    fatherMobile: ["Invalid Mobile No."],
    motherMobile: ["Invalid Mobile No."],
    guardianMobile: ["Invalid Mobile No."],
    aadharNo: ["Invalid Aadhar"],
  };

  if (prefferedCheck) {
    checks["preferredName"] = [
      values.preferredName !== "",
      /^[a-zA-Z0-9]*$/.test(values.preferredName),
      !prefferedCheck,
    ];
    errorMessages["preferredName"] = [
      "This field is required",
      "Special characters and space is not allowed",
      "Preffered name is taken please alter !!",
    ];
  } else {
    checks["preferredName"] = [
      values.preferredName !== "",
      /^[a-zA-Z0-9]*$/.test(values.preferredName),
    ];
    errorMessages["preferredName"] = [
      "This field is required",
      "Special characters and space is not allowed",
    ];
  }

  useEffect(() => {
    setCrumbs([]);
    getCountry();
    getAcyears();
    getSchools();
    getNationality();
    getAdmissionCategory();
  }, []);

  useEffect(() => {
    getState();
  }, [values.permanentCountry]);

  useEffect(() => {
    getCurrentState();
  }, [values.currentCountry]);

  useEffect(() => {
    getLocalState();
  }, [values.localCountry]);

  useEffect(() => {
    getCity();
  }, [values.permanantState]);

  useEffect(() => {
    getCurrentCity();
  }, [values.currentState]);

  useEffect(() => {
    getLocalCity();
  }, [values.localCity]);

  useEffect(() => {
    getProgram();
  }, [values.schoolId]);

  useEffect(() => {
    getFeeTemplates();
  }, [
    values.acyearId,
    values.schoolId,
    values.programId,
    values.admissionCategory,
    values.admissionSubCategory,
    values.nationality,
    values.isNri,
  ]);

  useEffect(() => {
    getAdmissionSubCategory();
  }, [values.admissionCategory]);

  useEffect(() => {
    getTranscripts();
  }, [values.programId]);

  useEffect(() => {
    checkPrefferedName();
  }, [values.preferredName]);

  useEffect(() => {
    validateAuid();
  }, [values.auid]);

  const getCountry = async () => {
    await axios(`/api/Country`)
      .then((res) => {
        const data = [];
        res.data.forEach((obj) => {
          data.push({
            value: obj.id,
            label: obj.name,
          });
        });
        setCountry(data);
      })
      .catch((err) => console.error(err));
  };

  const getState = async () => {
    if (values.permanentCountry) {
      await axios(`/api/State1/${values.permanentCountry}`)
        .then((res) => {
          const data = [];
          res.data.forEach((obj) => {
            data.push({
              value: obj.id,
              label: obj.name,
            });
          });
          setPermanantStates(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getCurrentState = async () => {
    if (values.currentCountry) {
      await axios(`/api/State1/${values.currentCountry}`)
        .then((res) => {
          const data = [];
          res.data.forEach((obj) => {
            data.push({
              value: obj.id,
              label: obj.name,
            });
          });
          setCurrentStates(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getLocalState = async () => {
    if (values.localCountry) {
      await axios(`/api/State1/${values.localCountry}`)
        .then((res) => {
          const data = [];
          res.data.forEach((obj) => {
            data.push({
              value: obj.id,
              label: obj.name,
            });
          });
          setLocalStates(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getCity = async () => {
    if (values.permanentCountry && values.permanantState) {
      await axios(
        `/api/City1/${values.permanantState}/${values.permanentCountry}`
      )
        .then((res) => {
          const data = [];
          res.data.forEach((obj) => {
            data.push({
              value: obj.id,
              label: obj.name,
            });
          });
          setPermanantCities(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getCurrentCity = async () => {
    if (values.currentCountry && values.currentState) {
      await axios(`/api/City1/${values.currentState}/${values.currentCountry}`)
        .then((res) => {
          const data = [];
          res.data.forEach((obj) => {
            data.push({
              value: obj.id,
              label: obj.name,
            });
          });
          setCurrentCities(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getLocalCity = async () => {
    if (values.localCountry && values.localState) {
      await axios(`/api/City1/${values.localState}/${values.localCountry}`)
        .then((res) => {
          const data = [];
          res.data.forEach((obj) => {
            data.push({
              value: obj.id,
              label: obj.name,
            });
          });
          setLocalCities(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getAcyears = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcyearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchools = async () => {
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

  const getProgram = async () => {
    if (values.schoolId) {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const programTemp = {};
          res.data.data.forEach((obj) => {
            programTemp[obj.program_specialization_id] = obj;
          });

          setProgramData(programTemp);
          setProgram(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label:
                obj.program_short_name +
                " - " +
                obj.program_specialization_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getNationality = async () => {
    await axios(`/api/getAllActiveNationality`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.nationality_id,
            label: obj.nationality,
          });
        });
        setNationalityOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionCategory = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        setAdmissionCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getAdmissionSubCategory = async () => {
    if (values.admissionCategory) {
      await axios
        .get(
          `/api/student/FetchFeeAdmissionSubCategory/${values.admissionCategory}`
        )
        .then((res) => {
          setSubCategoryOptions(
            res.data.data.map((obj) => ({
              value: obj.fee_admission_sub_category_id,
              label: obj.fee_admission_sub_category_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getFeeTemplates = async () => {
    if (
      values.acyearId &&
      values.schoolId &&
      values.programId &&
      values.admissionCategory &&
      values.admissionSubCategory &&
      values.nationality
    ) {
      await axios
        .get(
          `/api/finance/FetchAllFeeTemplateDetails/${values.acyearId}/${
            values.schoolId
          }/${programData[values.programId].program_id}/${
            programData[values.programId].program_specialization_id
          }/${values.admissionCategory}/${values.admissionSubCategory}/${
            values.isNri
          }`
        )
        .then((res) => {
          setFeeTemplateOptions(
            res.data.data.map((obj) => ({
              value: obj.fee_template_id,
              label: obj.fee_template_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getTranscripts = async () => {
    if (values.programId)
      await axios
        .get(
          `/api/academic/fetchProgramTranscriptDetails/${
            programData[values.programId].program_id
          }`
        )
        .then((res) => {
          const transcriptObj = res.data.data.map((obj, i) => ({
            transcriptId: obj.transcript_id,
            transcript: obj.transcript,
            lastDate: null,
            submittedStatus: false,
            notRequied: false,
            submittedStatusDisabled: false,
            notRequiedDisabled: false,
            lastDateDisabled: false,
          }));

          setValues((prev) => ({
            ...prev,
            transcript: transcriptObj,
          }));
        })
        .catch((err) => console.error(err));
  };

  const checkPrefferedName = async () => {
    if (values.preferredName)
      await axios
        .get(`/api/student/checkPreferredNameForEmail/${values.preferredName}`)
        .then((res) => {
          setPrefferedCheck(false);
        })
        .catch((err) => {
          setPrefferedCheck(true);
        });
  };

  const validateAuid = async () => {
    if (values.auid) {
      {
        setBackDropOpen(true);

        let status = false;

        await axios
          .get(`/api/student/checkAuidIsAlreadyPresentOrNot/${values.auid}`)
          .then((res) => {
            status = false;
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
            setBackDropOpen(false);
            status = true;
          });

        if (!status) {
          fetch(
            `https://acharyainstitutes.in/index.php?r=acerp-api-std/student_info_migrate&auid=${values.auid}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (Object.keys(data.data).length > 0) {
                const responseData = data.data;

                const getEmail = responseData.acerp_email.split(".");

                setValues((prev) => ({
                  ...prev,
                  studentName: responseData.student_name ?? "",
                  dob: responseData.dateofbirth ?? "",
                  gender: responseData.candidate_sex ?? "",
                  mobileNo: responseData.mobile ?? "",
                  alternateMobile: responseData.mobile ?? "",
                  email: responseData.local_email ?? "",
                  casteCategory: responseData.caste ?? "",
                  bloodGroup: responseData.blood_group ?? "",
                  permanentAddress: responseData.permanant_adress1 ?? "",
                  currentAddress: responseData.current_adress1 ?? "",
                  localAddress: responseData.local_adress1 ?? "",
                  fatherName: responseData.father_name ?? "",
                  fatherMobile: responseData.parents_mobile ?? "",
                  fatherEmail: responseData.father_email ?? "",
                  fatherIncome: responseData.father_income ?? "",
                  motherName: responseData.mother_name ?? "",
                  motherMobile: responseData.parents_mobile ?? "",
                  motherEmail: responseData.mother_email ?? "",
                  motherIncome: responseData.mother_income ?? "",
                  guardianName: responseData.guardian_name ?? "",
                  guardianMobile: responseData.guardian_phone ?? "",
                  bankName: responseData.bank_name ?? "",
                  accountHolderName: responseData.account_holder_name ?? "",
                  accountNumber: responseData.account_number ?? "",
                  bankBranch: responseData.bank_branch ?? "",
                  guardianName: responseData.guardian_name ?? "",
                  ifscCode: responseData.ifsc_code ?? "",
                  aadharNo: responseData.aadhaar_no ?? "",
                  disableAuid: true,
                  acharyaEmail: responseData.acerp_email ?? "",
                  preferredName: getEmail[0].replace(/ /g, ""),
                }));
              }
              setBackDropOpen(false);
            })
            .catch((err) => {
              setAlertMessage({
                severity: "error",
                message: err.response
                  ? err.response.data.message
                  : "An error occured",
              });
              setAlertOpen(true);
              setBackDropOpen(false);
            });
        }
      }
    }
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeTranscript = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      transcript: prev.transcript.map((obj, i) => {
        if (obj.transcriptId === Number(splitName[1])) {
          const temp = { ...obj };

          if (splitName[0] === "submittedStatus") {
            temp.lastDate = null;
            temp.notRequied = false;
            temp.submittedStatus = e.target.checked;
            temp.notRequiedDisabled = e.target.checked ? true : false;
            temp.lastDateDisabled = e.target.checked ? true : false;
          } else if (splitName[0] === "notRequied") {
            temp.lastDate = null;
            temp.notRequied = e.target.checked;
            temp.submittedStatus = false;
            temp.submittedStatusDisabled = e.target.checked ? true : false;
            temp.lastDateDisabled = e.target.checked ? true : false;
          }
          return temp;
        }

        return obj;
      }),
    }));
  };

  const handleChangeLastDate = (name, newValue) => {
    const splitName = name.split("-");
    setValues((prev) => ({
      ...prev,
      transcript: prev.transcript.map((obj, i) => {
        if (obj.transcriptId === Number(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: newValue,
          };
        return obj;
      }),
    }));
  };

  const copyPermanant = (status) => {
    if (status === true) {
      setValues((prev) => ({
        ...prev,
        currentAddress: values.permanentAddress,
        currentCountry: values.permanentCountry,
        currentState: values.permanantState,
        currentCity: values.permanantCity,
        currentPincode: values.permanentPincode,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        currentAddress: "",
        currentCountry: "",
        currentState: "",
        currentCity: "",
        currentPincode: "",
      }));
    }
    setCopyPermanantStatus(status);
  };

  const copyCurrent = (status) => {
    if (status === true) {
      setValues((prev) => ({
        ...prev,
        localAddress: values.currentAddress,
        localCountry: values.currentCountry,
        localState: values.currentState,
        localCity: values.currentCity,
        localPincode: values.currentPincode,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        localAddress: "",
        localCountry: "",
        localState: "",
        localCity: "",
        localPincode: "",
      }));
    }
    setCopyCurrentStatus(status);
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

  const validateTranscript = () => {
    let status = true;
    values.transcript?.forEach((obj) => {
      if (
        obj.submittedStatus === false &&
        obj.lastDate === null &&
        obj.notRequied === false
      )
        status = false;
    });
    return status;
  };

  const handleCreate = () => {
    const postData = async () => {
      const std = {};

      std.active = true;
      std.auid = values.auid;
      std.student_name = values.studentName;
      std.dateofbirth = values.dob;
      std.candidate_sex = values.gender;
      std.mobile = values.mobileNo;
      std.email = values.email;
      std.religion = values.religion;
      std.caste_category = values.casteCategory;
      std.blood_group = values.bloodGroup;
      std.nationality = values.nationality;

      std.permanent_address = values.permanentAddress;
      std.permanant_country = values.permanentCountry;
      std.permanant_state = values.permanantState;
      std.permanant_city = values.permanantCity;
      std.permanant_pincode = values.permanentPincode;

      std.current_address = values.currentAddress;
      std.current_country = values.currentCountry;
      std.current_state = values.currentState;
      std.current_city = values.currentCity;
      std.current_pincode = values.currentPincode;

      std.local_adress1 = values.localAddress;
      std.local_country = values.localCountry;
      std.local_state = values.localState;
      std.local_city = values.localCity;
      std.local_pincode = values.localPincode;

      std.father_name = values.fatherName;
      std.father_mobile = values.fatherMobile;
      std.father_email = values.fatherEmail;
      std.father_occupation = values.fatherOccupation;
      std.father_qualification = values.fatherQualification;
      std.father_income = values.fatherIncome;

      std.mother_name = values.motherName;
      std.mother_mobile = values.motherMobile;
      std.mother_email = values.motherEmail;
      std.mother_occupation = values.motherOccupation;
      std.mother_qualification = values.motherQualification;
      std.mother_income = values.motherIncome;

      std.guardian_name = values.motherName;
      std.guardian_phone = values.motherMobile;

      std.bank_name = values.bankName;
      std.account_holder_name = values.accountHolderName;
      std.account_number = values.accountNumber;
      std.bank_branch = values.bankBranch;
      std.ifsc_code = values.ifscCode;
      std.adhar_number = values.aadharNo;

      std.ac_year_id = values.acyearId;
      std.school_id = values.schoolId;
      std.program_id = programData[values.programId].program_id;
      std.program_assignment_id =
        programData[values.programId].program_assignment_id;
      std.program_specialization_id = values.programId;
      std.fee_template_id = values.feetemplateId;
      std.fee_admission_category_id = values.admissionCategory;
      std.acharya_email = values.acharyaEmail;
      std.email_preferred_name = values.preferredName.trim();

      const reporting = {};

      reporting.active = true;
      if (
        programData[values.programId].program_type_name.toLowerCase() ===
        "yearly"
      ) {
        reporting.current_sem = 1;
        reporting.current_year = 1;
      } else {
        reporting.current_sem = 0;
        reporting.current_year = 1;
      }

      reporting.distinct_status = true;
      reporting.eligible_reported_status = 1;

      // Transcript Data
      const transcript = {};
      const submitted = [];
      const pending = {};
      const notApplicable = [];

      transcript.active = true;

      values.transcript.forEach((obj) => {
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

      // Candidate Walkin
      const candidate = {};

      candidate.active = true;
      candidate.candidate_name = values.studentName;
      candidate.date_of_birth = values.dob;
      candidate.candidate_sex = values.gender;
      candidate.father_name = values.fatherName;
      candidate.program_assignment_id =
        programData[values.programId].program_assignment_id;
      candidate.program_id = programData[values.programId].program_id;
      candidate.candidate_email = values.email;
      candidate.mobile_number = values.mobileNo;
      candidate.school_id = values.schoolId;
      candidate.program_specilaization_id = values.programId;
      candidate.ac_year_id = values.acyearId;

      const temp = {};

      temp.sd = std;
      temp.ap = [];
      temp.streq = transcript;
      temp.pgapp = {};
      temp.see = {};
      temp.srsh = {};
      temp.rs = reporting;
      temp.cw = candidate;

      setIsLoading(true);

      await axios
        .post(`/api/student/spotStudent_Details`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "AUID created successfully !!",
          });
          setAlertOpen(true);
          setIsLoading(false);
          // navigate("/StudentDetailsMaster/StudentsDetails", {
          //   replace: true,
          // });
          setValues(initialValues);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setIsLoading(false);
        });
    };

    setConfirmContent({
      title: "",
      message: "Do you want to submit?",
      buttons: [
        { name: "Yes", color: "primary", func: postData },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const nationalityName = nationalityOptions.find(
    (f) => f.value === values.nationality
  );

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box m={{ md: 3, xs: 1 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Card elevation={4}>
              <CardHeader
                title="Quick Admission"
                titleTypographyProps={{ variant: "subtitle2", fontSize: 20 }}
                sx={{
                  backgroundColor: "primary.main",
                  color: "headerWhite.main",
                  textAlign: "center",
                  padding: 2,
                }}
              />

              <CardContent sx={{ padding: 4 }}>
                <Grid container rowSpacing={4}>
                  <Grid item xs={12}>
                    <Card elevation={4}>
                      <CardContent>
                        <Grid container columnSpacing={2} rowSpacing={3}>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="auid"
                              label="AUID"
                              value={values.auid}
                              handleChange={handleChange}
                              checks={checks.auid}
                              errors={errorMessages.auid}
                              disabled={values.disableAuid}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="studentName"
                              label="Applicant Name"
                              value={values.studentName}
                              handleChange={handleChange}
                              checks={checks.studentName}
                              errors={errorMessages.studentName}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="dob"
                              label="Date of Birth"
                              value={values.dob}
                              handleChangeAdvance={handleChangeAdvance}
                              maxDate={
                                new Date(
                                  `12/31/${new Date().getFullYear() - 15}`
                                )
                              }
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomRadioButtons
                              name="gender"
                              label="Gender"
                              value={values.gender}
                              items={[
                                {
                                  value: "Male",
                                  label: "Male",
                                },
                                {
                                  value: "Female",
                                  label: "Female",
                                },
                              ]}
                              handleChange={handleChange}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="mobileNo"
                              label="Mobile No."
                              value={values.mobileNo}
                              handleChange={handleChange}
                              checks={checks.mobileNo}
                              errors={errorMessages.mobileNo}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="alternateMobile"
                              label="Alternate Mobile No."
                              value={values.alternateMobile}
                              handleChange={handleChange}
                              checks={checks.alternateMobile}
                              errors={errorMessages.alternateMobile}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="email"
                              label="Personal Email"
                              value={values.email}
                              handleChange={handleChange}
                              checks={checks.email}
                              errors={errorMessages.email}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="religion"
                              label="Religion"
                              value={values.religion}
                              options={religionList}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="casteCategory"
                              label="Caste Category"
                              value={values.casteCategory}
                              handleChange={handleChange}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="bloodGroup"
                              label="Blood Group"
                              value={values.bloodGroup}
                              handleChange={handleChange}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card elevation={4}>
                      <CardHeader
                        title="Additional Information"
                        titleTypographyProps={{ variant: "subtitle2" }}
                        sx={{
                          backgroundColor: "primary.main",
                          color: "headerWhite.main",
                          padding: 1,
                        }}
                      />

                      <CardContent>
                        <Grid container rowSpacing={2} columnSpacing={2}>
                          <Grid item xs={12} md={4}>
                            <Grid container rowSpacing={2} columnSpacing={2}>
                              <Grid item xs={12}>
                                <CustomTextField
                                  name="fatherName"
                                  label="Father Name"
                                  value={values.fatherName}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="fatherMobile"
                                  label="Father Mobile"
                                  value={values.fatherMobile}
                                  handleChange={handleChange}
                                  checks={checks.fatherMobile}
                                  errors={errorMessages.fatherMobile}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="fatherEmail"
                                  label="Father Email"
                                  value={values.fatherEmail}
                                  handleChange={handleChange}
                                  checks={checks.fatherEmail}
                                  errors={errorMessages.fatherEmail}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="fatherOccupation"
                                  label="Father Occupation"
                                  value={values.fatherOccupation}
                                  options={occupationList}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="fatherQualification"
                                  label="Father Qualification"
                                  value={values.fatherQualification}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="fatherIncome"
                                  label="Father Income"
                                  value={values.fatherIncome}
                                  handleChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Grid container rowSpacing={2} columnSpacing={2}>
                              <Grid item xs={12}>
                                <CustomTextField
                                  name="motherName"
                                  label="Mother Name"
                                  value={values.motherName}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="motherMobile"
                                  label="Mother Mobile"
                                  value={values.motherMobile}
                                  handleChange={handleChange}
                                  checks={checks.motherMobile}
                                  errors={errorMessages.motherMobile}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="motherEmail"
                                  label="Mother Email"
                                  value={values.motherEmail}
                                  handleChange={handleChange}
                                  checks={checks.motherEmail}
                                  errors={errorMessages.motherEmail}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="motherOccupation"
                                  label="Mother Occupation"
                                  value={values.motherOccupation}
                                  options={occupationList}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="motherQualification"
                                  label="Mother Qualification"
                                  value={values.motherQualification}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="motherIncome"
                                  label="Mother Income"
                                  value={values.motherIncome}
                                  handleChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Grid container rowSpacing={2} columnSpacing={2}>
                              <Grid item xs={12}>
                                <CustomTextField
                                  name="guardianName"
                                  label="Guardian Name"
                                  value={values.guardianName}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="guardianMobile"
                                  label="Guardian Mobile"
                                  value={values.guardianMobile}
                                  handleChange={handleChange}
                                  checks={checks.guardianMobile}
                                  errors={errorMessages.guardianMobile}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="guardianEmail"
                                  label="Guardian Email"
                                  value={values.guardianEmail}
                                  handleChange={handleChange}
                                  checks={checks.guardianEmail}
                                  errors={errorMessages.guardianEmail}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="guardianOccupation"
                                  label="Guardian Occupation"
                                  value={values.guardianOccupation}
                                  options={occupationList}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card elevation={4}>
                      <CardHeader
                        title="Address"
                        titleTypographyProps={{ variant: "subtitle2" }}
                        sx={{
                          backgroundColor: "primary.main",
                          color: "headerWhite.main",
                          padding: 1,
                        }}
                      />

                      <CardContent>
                        <Grid container rowSpacing={2} columnSpacing={4}>
                          <Grid item xs={12} md={4}>
                            <Grid container rowSpacing={3} columnSpacing={4}>
                              <Grid item xs={12} p={2}>
                                <Typography variant="subtitle2" align="center">
                                  Permanent
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="permanentAddress"
                                  label="Address"
                                  value={values.permanentAddress}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="permanentCountry"
                                  label="Country"
                                  value={values.permanentCountry}
                                  options={country}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="permanantState"
                                  label="State"
                                  value={values.permanantState}
                                  options={permanantStates}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="permanantCity"
                                  label="City"
                                  value={values.permanantCity}
                                  options={permanantCities}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="permanentPincode"
                                  label="Pincode"
                                  value={values.permanentPincode}
                                  handleChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Grid container rowSpacing={3} columnSpacing={4}>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" align="center">
                                  Correspondence
                                  {copyPermanantStatus ? (
                                    <>
                                      <IconButton
                                        onClick={() => copyPermanant(false)}
                                      >
                                        <UndoIcon
                                          sx={{ color: "auzColor.main" }}
                                        />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton
                                        onClick={() => copyPermanant(true)}
                                      >
                                        <ContentCopyIcon
                                          sx={{ color: "auzColor.main" }}
                                        />
                                      </IconButton>
                                    </>
                                  )}
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="currentAddress"
                                  label="Address"
                                  value={values.currentAddress}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="currentCountry"
                                  label="Country"
                                  value={values.currentCountry}
                                  options={country}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="currentState"
                                  label="State"
                                  value={values.currentState}
                                  options={currentStates}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="currentCity"
                                  label="City"
                                  value={values.currentCity}
                                  options={currentCities}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="currentPincode"
                                  label="Pincode"
                                  value={values.currentPincode}
                                  handleChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Grid container rowSpacing={3} columnSpacing={4}>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" align="center">
                                  Local
                                  {copyCurrentStatus ? (
                                    <>
                                      <IconButton
                                        onClick={() => copyCurrent(false)}
                                      >
                                        <UndoIcon
                                          sx={{ color: "auzColor.main" }}
                                        />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton
                                        onClick={() => copyCurrent(true)}
                                      >
                                        <ContentCopyIcon
                                          sx={{ color: "auzColor.main" }}
                                        />
                                      </IconButton>
                                    </>
                                  )}
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="localAddress"
                                  label="Address"
                                  value={values.localAddress}
                                  handleChange={handleChange}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="localCountry"
                                  label="Country"
                                  value={values.localCountry}
                                  options={country}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="localState"
                                  label="State"
                                  value={values.localState}
                                  options={localStates}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomAutocomplete
                                  name="localCity"
                                  label="City"
                                  value={values.localCity}
                                  options={localCities}
                                  handleChangeAdvance={handleChangeAdvance}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <CustomTextField
                                  name="localPincode"
                                  label="Pincode"
                                  value={values.localPincode}
                                  handleChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card elevation={4}>
                      <CardHeader
                        title="Bank Details"
                        titleTypographyProps={{ variant: "subtitle2" }}
                        sx={{
                          backgroundColor: "primary.main",
                          color: "headerWhite.main",
                          padding: 1,
                        }}
                      />

                      <CardContent>
                        <Grid container rowSpacing={2} columnSpacing={2}>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="bankName"
                              label="Bank Name"
                              value={values.bankName}
                              handleChange={handleChange}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="accountHolderName"
                              label="Name As Per Bank"
                              value={values.accountHolderName}
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
                              name="bankBranch"
                              label="Branch"
                              value={values.bankBranch}
                              handleChange={handleChange}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="ifscCode"
                              label="Ifsc Code"
                              value={values.ifscCode}
                              handleChange={handleChange}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="aadharNo"
                              label="Aadhar No."
                              value={values.aadharNo}
                              handleChange={handleChange}
                              checks={checks.aadharNo}
                              errors={errorMessages.aadharNo}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card elevation={4}>
                      <CardHeader
                        title="Program Details"
                        titleTypographyProps={{ variant: "subtitle2" }}
                        sx={{
                          backgroundColor: "primary.main",
                          color: "headerWhite.main",
                          padding: 1,
                        }}
                      />
                      <CardContent>
                        <Grid container rowSpacing={2} columnSpacing={2}>
                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="acyearId"
                              label="Ac Year"
                              options={acyearOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              value={values.acyearId}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="schoolId"
                              label="School"
                              options={schoolOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              value={values.schoolId}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="programId"
                              label="Program"
                              options={program}
                              handleChangeAdvance={handleChangeAdvance}
                              value={values.programId}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="admissionCategory"
                              label="Admission Category"
                              value={values.admissionCategory}
                              options={admissionCategoryOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="admissionSubCategory"
                              label="Admission Sub Category"
                              value={values.admissionSubCategory}
                              options={subCategoryOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="nationality"
                              label="Nationality"
                              value={values.nationality}
                              options={nationalityOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              required
                            />
                          </Grid>

                          {values.admissionSubCategory &&
                          nationalityName?.label === "Indian" ? (
                            <Grid item xs={12} md={3}>
                              <CustomRadioButtons
                                name="isNri"
                                label="Is NRI"
                                value={values.isNri}
                                items={[
                                  {
                                    value: true,
                                    label: "Yes",
                                  },
                                  {
                                    value: false,
                                    label: "No",
                                  },
                                ]}
                                handleChange={handleChange}
                                required
                              />
                            </Grid>
                          ) : (
                            <></>
                          )}

                          <Grid item xs={12} md={3}>
                            <CustomAutocomplete
                              name="feetemplateId"
                              label="Fee Template"
                              value={values.feetemplateId}
                              options={feeTemplateOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              required
                            />
                          </Grid>

                          {values.feetemplateId ? (
                            <Grid item xs={12} md={3}>
                              <Typography variant="body2" color="textSecondary">
                                <Button
                                  size="small"
                                  startIcon={<Visibility />}
                                  onClick={() => setTemplateWrapperOpen(true)}
                                >
                                  View Fee Template
                                </Button>
                              </Typography>
                            </Grid>
                          ) : (
                            <></>
                          )}

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="acharyaEmail"
                              label="Acharya Mail"
                              value={values.acharyaEmail}
                              handleChange={handleChange}
                              disabled
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="preferredName"
                              label="Preffered Name For Email"
                              value={values.preferredName}
                              handleChange={handleChange}
                              checks={checks.preferredName}
                              errors={errorMessages.preferredName}
                              highlightError={prefferedCheck}
                              disabled
                              required
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {values.programId ? (
                    <Grid item xs={12}>
                      <TableContainer component={Paper} elevation={3}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Transcript</StyledTableCell>
                              <StyledTableCell>Is Submitted</StyledTableCell>
                              <StyledTableCell>
                                Date of Submision
                              </StyledTableCell>
                              <StyledTableCell>Not Applicable</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {values?.transcript?.length > 0 ? (
                              values.transcript.map((obj, i) => {
                                return (
                                  <TableRow key={i}>
                                    <TableCell>{obj.transcript}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                      <Checkbox
                                        name={
                                          "submittedStatus-" + obj.transcriptId
                                        }
                                        onChange={handleChangeTranscript}
                                        sx={{
                                          color: "auzColor.main",
                                          "&.Mui-checked": {
                                            color: "auzColor.main",
                                          },
                                        }}
                                        disabled={obj.submittedStatusDisabled}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <CustomDatePicker
                                        name={"lastDate-" + obj.transcriptId}
                                        value={obj.lastDate}
                                        handleChangeAdvance={
                                          handleChangeLastDate
                                        }
                                        disabled={obj.lastDateDisabled}
                                        disablePast
                                      />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                      <Checkbox
                                        name={"notRequied-" + obj.transcriptId}
                                        onChange={handleChangeTranscript}
                                        sx={{
                                          padding: 0,
                                          color: "auzColor.main",
                                          "&.Mui-checked": {
                                            color: "auzColor.main",
                                          },
                                        }}
                                        disabled={obj.notRequiedDisabled}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  sx={{ textAlign: "center" }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    No Records
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  ) : (
                    <></>
                  )}

                  <Grid item xs={12} align="right">
                    <Button
                      variant="contained"
                      onClick={handleCreate}
                      disabled={
                        isLoading ||
                        !requiredFieldsValid() ||
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
                        <Typography>Create</Typography>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Fee Template Wrapper  */}
        <Grid item xs={12}>
          <ModalWrapper
            open={templateWrapperOpen}
            setOpen={setTemplateWrapperOpen}
            maxWidth={1200}
          >
            <Grid item xs={12} mt={3}>
              <FeeTemplateView feeTemplateId={values.feetemplateId} type={2} />
            </Grid>
          </ModalWrapper>
        </Grid>
      </Box>
    </>
  );
}

export default SpotAdmissionForm;
