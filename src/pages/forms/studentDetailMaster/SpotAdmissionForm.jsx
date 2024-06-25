import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import religionList from "../../../utils/ReligionList";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UndoIcon from "@mui/icons-material/Undo";

const initialValues = {
  studentName: "",
  dob: null,
  gender: "",
  mobileNo: "",
  parentMobile: "",
  fatherName: "",
  motherName: "",
  religion: "",
  casteCategory: "",
  caste: "",
  bloodGroup: "",
  guardianName: "",
  guardianMobile: "",
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
  SpecializationID: null,
};

const requiredFields = ["studentName"];

function SpotAdmissionForm() {
  const [values, setValues] = useState(initialValues);
  const [isLoading, setisLoading] = useState(false);
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
  const [copyPermanantStatus, setCopyPermanantStatus] = useState(false);
  const [copyCurrentStatus, setCopyCurrentStatus] = useState(false);

  const setCrumbs = useBreadcrumbs();

  const checks = {
    studentName: [values.studentName !== ""],
    mobileNo: [/^[0-9]{10}$/.test(values.mobileNo)],
    parentMobile: [/^[0-9]{10}$/.test(values.parentMobile)],
    guardianMobile: [/^[0-9]{10}$/.test(values.guardianMobile)],
  };

  const errorMessages = {
    studentName: ["This field is required"],
    mobileNo: ["Invalid Mobile No."],
    parentMobile: ["Invalid Mobile No."],
    guardianMobile: ["Invalid Mobile No."],
  };

  useEffect(() => {
    setCrumbs([]);
    getCountry();
    getAcyears();
    getSchools();
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

  const handleCreate = async () => {
    setisLoading(true);
  };

  return (
    <Box m={3}>
      <Grid container justifyContent="center">
        <Grid item xs={10}>
          <Card elevation={4}>
            <CardHeader
              title="Quick Admission"
              titleTypographyProps={{ variant: "subtitle2", fontSize: 16 }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
                padding: 1,
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
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <CustomTextField
                            name="parentMobile"
                            label="Parent Mobile No."
                            value={values.parentMobile}
                            handleChange={handleChange}
                            checks={checks.parentMobile}
                            errors={errorMessages.parentMobile}
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
                            name="caste"
                            label="Caste"
                            value={values.caste}
                            handleChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <CustomTextField
                            name="guardianName"
                            label="Guardian Name"
                            value={values.guardianName}
                            handleChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <CustomTextField
                            name="guardianMobile"
                            label="Guardian Mobile"
                            value={values.guardianMobile}
                            handleChange={handleChange}
                            checks={checks.guardianMobile}
                            errors={errorMessages.guardianMobile}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <CustomAutocomplete
                            name="acyearId"
                            label="Ac Year"
                            options={acyearOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            value={values.acyearId}
                          />
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <CustomAutocomplete
                            name="schoolId"
                            label="School"
                            options={schoolOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            value={values.schoolId}
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
                                checks={checks.permanentAddress}
                                errors={errorMessages.permanentAddress}
                                required
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <CustomAutocomplete
                                name="permanentCountry"
                                label="Country"
                                value={values.permanentCountry}
                                options={country}
                                handleChangeAdvance={handleChangeAdvance}
                                checks={checks.permanentCountry}
                                errors={errorMessages.permanentCountry}
                                required
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <CustomAutocomplete
                                name="permanantState"
                                label="State"
                                value={values.permanantState}
                                options={permanantStates}
                                handleChangeAdvance={handleChangeAdvance}
                                checks={checks.permanantState}
                                errors={errorMessages.permanantState}
                                required
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <CustomAutocomplete
                                name="permanantCity"
                                label="City"
                                value={values.permanantCity}
                                options={permanantCities}
                                handleChangeAdvance={handleChangeAdvance}
                                checks={checks.permanantCity}
                                errors={errorMessages.permanantCity}
                                required
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
                            value={values.aadharno}
                            handleChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={isLoading || !requiredFieldsValid()}
                  >
                    <Typography>Create</Typography>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SpotAdmissionForm;
