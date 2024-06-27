import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
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
import moment from "moment";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
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
  specializationId: null,
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
  motherMobile: "",
  motherOccupation: null,
  motherQualification: "",
  motherIncome: "",
  guardianName: "",
  guardianMobile: "",
  guardianEmail: "",
  guardianOccupation: null,
};

const requiredFields = [
  "studentName",
  "dob",
  "gender",
  "mobileNo",
  "preferredName",
  "acyearId",
  "schoolId",
  "programId",
  "specializationId",
  "admissionCategory",
  "admissionSubCategory",
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
  const [specialization, setSpecialization] = useState([]);
  const [programData, setProgramData] = useState();
  const [nationality, setNationality] = useState([]);
  const [admissionCategoryOptions, setAdmissionCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [feeTemplateOptions, setFeeTemplateOptions] = useState([]);
  const [copyPermanantStatus, setCopyPermanantStatus] = useState(false);
  const [copyCurrentStatus, setCopyCurrentStatus] = useState(false);
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    studentName: [values.studentName !== ""],
    mobileNo: [/^[0-9]{10}$/.test(values.mobileNo)],
    alternateMobile: [/^[0-9]{10}$/.test(values.alternateMobile)],
    email: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
    ],
    preferredName: [values.preferredName !== ""],
  };

  const errorMessages = {
    studentName: ["This field is required"],
    mobileNo: ["Invalid Mobile No."],
    alternateMobile: ["Invalid Mobile No."],
    email: ["Invalid email"],
    preferredName: ["This field is required"],
  };

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
    getSpecialization();
  }, [values.schoolId, values.programId]);

  useEffect(() => {
    getFeeTemplates();
  }, [values.admissionSubCategory]);

  useEffect(() => {
    getAdmissionSubCategory();
  }, [values.admissionCategory]);

  useEffect(() => {
    getTranscripts();
  }, [values.programId]);

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
        .get(`/api/academic/fetchAllProgramsWithProgramType/${values.schoolId}`)
        .then((res) => {
          const programTemp = {};
          res.data.data.forEach((obj) => {
            programTemp[obj.program_assignment_id] = obj.program_id;
          });

          setProgramData(programTemp);
          setProgram(
            res.data.data.map((obj) => ({
              value: obj.program_assignment_id,
              label: obj.program_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getSpecialization = async () => {
    if (values.schoolId && values.programId) {
      await axios
        .get(
          `/api/academic/FetchProgramSpecialization/${values.schoolId}/${
            programData[values.programId]
          }`
        )
        .then((res) => {
          setSpecialization(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.program_specialization_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getNationality = async () => {
    await axios(`/api/nationality`)
      .then((res) => {
        const data = [];
        res.data.forEach((obj) => {
          data.push({
            value: obj.nationality_id,
            label: obj.nationality,
          });
        });
        setNationality(data);
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
    if (values.admissionSubCategory) {
      await axios
        .get(
          `/api/finance/FetchAllFeeTemplateDetails/${values.acyearId}/${
            values.schoolId
          }/${programData[values.programId]}/${values.specializationId}/${
            values.admissionCategory
          }/${values.admissionSubCategory}`
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
            programData[values.programId]
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

  const handleCreate = async () => {
    const std = {};
    std.student_name = values.studentName;
    std.dateofbirth = values.dob;
    std.candidate_sex = values.gender;
    std.mobile = values.mobileNo;
    std.email = values.email;
    std.blood_group = values.bloodGroup;
    std.nationality = values.nationality;
    std.ac_year_id = values.acyearId;
    std.school_id = values.schoolId;
    std.program_id = programData[values.programId];
    std.program_assignment_id = values.programId;
    std.program_specialization_id = values.specializationId;
    std.fee_template_id = values.feetemplateId;
    std.fee_admission_category_id = values.admissionCategory;

    const reporting = {};

    reporting.active = true;
    // if (applicantData.program_type.toLowerCase() === "semester") {
    //   reporting.current_sem = 1;
    //   reporting.current_year = 1;
    // } else {
    reporting.current_sem = 0;
    reporting.current_year = 1;
    // }

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
    const candidate = {
      active: true,
      candidate_email: values.email,
      candidate_name: values.studentName,
      candidate_sex: values.gender,
      date_of_birth: moment(values.dob).format("DD-MM-YYYY"),
      mobile_number: values.mobileNo,
      nationality: values.nationality,
      npf_status: 1,
      program_id: programData[values.programId],
      program_assignment_id: values.programId,
      program_specialization_id: values.specializationId,
      school_id: values.schoolId,
    };

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
      .post(`/api/student/Student_Details`, temp)
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

  return (
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
                              new Date(`12/31/${new Date().getFullYear() - 15}`)
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
                                value: "M",
                                label: "Male",
                              },
                              {
                                value: "F",
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
                            label="Email"
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
                            value={values.guardianName}
                            handleChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <CustomAutocomplete
                            name="nationality"
                            label="Nationality"
                            value={values.nationality}
                            options={nationality}
                            handleChangeAdvance={handleChangeAdvance}
                          />
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
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card elevation={4}>
                    <CardHeader
                      title="Parental"
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
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <CustomTextField
                                name="fatherEmail"
                                label="Father Email"
                                value={values.fatherEmail}
                                handleChange={handleChange}
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
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <CustomTextField
                                name="motherEmail"
                                label="Mother Email"
                                value={values.motherEmail}
                                handleChange={handleChange}
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
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <CustomTextField
                                name="guardianEmail"
                                label="Guardian Email"
                                value={values.guardianEmail}
                                handleChange={handleChange}
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
                            name="specializationId"
                            label="Specialization"
                            options={specialization}
                            handleChangeAdvance={handleChangeAdvance}
                            value={values.specializationId}
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
                            name="preferredName"
                            label="Preffered Name For Email"
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

                {values.programId ? (
                  <Grid item xs={12}>
                    <TableContainer component={Paper} elevation={3}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Transcript</StyledTableCell>
                            <StyledTableCell>Is Submitted</StyledTableCell>
                            <StyledTableCell>Date of Submision</StyledTableCell>
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
                                      handleChangeAdvance={handleChangeLastDate}
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
                    <Typography>Create</Typography>
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
  );
}

export default SpotAdmissionForm;
