import { useState, useEffect } from "react";
import { Box, Grid, Typography, IconButton, Paper } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UndoIcon from "@mui/icons-material/Undo";
import occupationList from "../../../utils/OccupationList";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

function AuidCorrespondanceDetailsForm({
  values,
  setValues,
  checks,
  errorMessages,
}) {
  const [country, setCountry] = useState([]);
  const [permanantStates, setPermanantStates] = useState([]);
  const [currentStates, setCurrentStates] = useState([]);
  const [localStates, setLocalStates] = useState([]);
  const [permanantCities, setPermanantCities] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);
  const [localCities, setLocalCities] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [copyPermanantStatus, setCopyPermanantStatus] = useState(false);
  const [copyCurrentStatus, setCopyCurrentStatus] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    getCountry();
    getBanks();
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
  }, [values.localState]);

  const getCountry = async () => {
    await axios(`/api/Country`)
      .then((res) => {
        setCountry(
          res.data.map((obj) => ({
            value: obj.id,
            label: obj.name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getState = async () => {
    if (values.permanentCountry) {
      await axios(`/api/State1/${values.permanentCountry}`)
        .then((res) => {
          setPermanantStates(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getCurrentState = async () => {
    if (values.currentCountry) {
      await axios(`/api/State1/${values.currentCountry}`)
        .then((res) => {
          setCurrentStates(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getLocalState = async () => {
    if (values.localCountry) {
      await axios(`/api/State1/${values.localCountry}`)
        .then((res) => {
          setLocalStates(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
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
          setPermanantCities(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getCurrentCity = async () => {
    if (values.currentCountry && values.currentState) {
      await axios(`/api/City1/${values.currentState}/${values.currentCountry}`)
        .then((res) => {
          setCurrentCities(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getLocalCity = async () => {
    if (values.localCountry && values.localState) {
      await axios(`/api/City1/${values.localState}/${values.localCountry}`)
        .then((res) => {
          setLocalCities(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getBanks = async () => {
    await axios(`/api/finance/Bank`)
      .then((res) => {
        setBankOptions(
          res.data.data.map((obj) => ({
            value: obj.bank_id,
            label: obj.bank_name,
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
        currentAddress1: values.permanentAddress1,
        currentCountry: values.permanentCountry,
        currentState: values.permanantState,
        currentCity: values.permanantCity,
        currentPincode: values.permanantPincode,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        currentAddress: "",
        currentAddress1: "",
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
        localAddress1: values.currentAddress1,
        localCountry: values.currentCountry,
        localState: values.currentState,
        localCity: values.currentCity,
        localPincode: values.currentPincode,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        localAddress: "",
        localAddress1: "",
        localCountry: "",
        localState: "",
        localCity: "",
        localPincode: "",
      }));
    }

    setCopyCurrentStatus(status);
  };

  return (
    <>
      <Box mt={1}>
        <Grid container rowSpacing={3}>
          {/* Address  */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Address
            </Typography>
          </Grid>

          <Grid item xs={12} component={Paper} elevation={3} p={2}>
            <>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">Permanent Address</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">
                    Correspondence Address
                  </Typography>
                  <Typography
                    variant="body2"
                    color="secondary"
                    textAlign="left"
                  >
                    {copyPermanantStatus ? (
                      <>
                        <IconButton onClick={() => copyPermanant(false)}>
                          <UndoIcon color="primary" />
                        </IconButton>
                        Undo
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => copyPermanant(true)}>
                          <ContentCopyIcon color="primary" />
                        </IconButton>
                        Copy Permanent Address
                      </>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2">
                    Local / Guardian Address
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    {copyCurrentStatus ? (
                      <>
                        <IconButton onClick={() => copyCurrent(false)}>
                          <UndoIcon color="primary" />
                        </IconButton>
                        Undo
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => copyCurrent(true)}>
                          <ContentCopyIcon color="primary" />
                        </IconButton>
                        Copy Correspondence Address
                      </>
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="permanentAddress"
                    label="Address 1"
                    value={values.permanentAddress}
                    handleChange={handleChange}
                    checks={checks.permanentAddress}
                    errors={errorMessages.permanentAddress}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="currentAddress"
                    label="Address 1"
                    value={values.currentAddress}
                    handleChange={handleChange}
                    checks={checks.currentAddress}
                    errors={errorMessages.currentAddress}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="localAddress"
                    label="Address 1"
                    value={values.localAddress}
                    handleChange={handleChange}
                    checks={checks.localAddress}
                    errors={errorMessages.localAddress}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="permanentAddress1"
                    label="Address 2"
                    value={values.permanentAddress1}
                    handleChange={handleChange}
                    checks={checks.permanentAddress1}
                    errors={errorMessages.permanentAddress1}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="currentAddress1"
                    label="Address 2"
                    value={values.currentAddress1}
                    handleChange={handleChange}
                    checks={checks.currentAddress1}
                    errors={errorMessages.currentAddress1}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="localAddress1"
                    label="Address 2"
                    value={values.localAddress1}
                    handleChange={handleChange}
                    checks={checks.localAddress1}
                    errors={errorMessages.localAddress1}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="currentCountry"
                    label="Country"
                    value={values.currentCountry}
                    options={country}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.currentCountry}
                    errors={errorMessages.currentCountry}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="localCountry"
                    label="Country"
                    value={values.localCountry}
                    options={country}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.localCountry}
                    errors={errorMessages.localCountry}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="currentState"
                    label="State"
                    value={values.currentState}
                    options={currentStates}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.currentState}
                    errors={errorMessages.currentState}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="localState"
                    label="State"
                    value={values.localState}
                    options={localStates}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.localState}
                    errors={errorMessages.localState}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="currentCity"
                    label="City"
                    value={values.currentCity}
                    options={currentCities}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.currentCity}
                    errors={errorMessages.currentCity}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="localCity"
                    label="City"
                    value={values.localCity}
                    options={localCities}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.localCity}
                    errors={errorMessages.localCity}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="permanantPincode"
                    label="Pincode"
                    value={values.permanantPincode}
                    handleChange={handleChange}
                    checks={checks.permanantPincode}
                    errors={errorMessages.permanantPincode}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="currentPincode"
                    label="Pincode"
                    value={values.currentPincode}
                    handleChange={handleChange}
                    checks={checks.currentPincode}
                    errors={errorMessages.currentPincode}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="localPincode"
                    label="Pincode"
                    value={values.localPincode}
                    handleChange={handleChange}
                    checks={checks.localPincode}
                    errors={errorMessages.localPincode}
                    required
                  />
                </Grid>
              </Grid>
            </>
          </Grid>

          {/* address ends */}

          {/* bank details */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Bank Details
            </Typography>
          </Grid>

          <Grid item xs={12} component={Paper} elevation={3} p={2}>
            <>
              <Grid container columnSpacing={2}>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    name="accountHolderName"
                    label="Name As Per Bank"
                    value={values.accountHolderName}
                    handleChange={handleChange}
                    checks={checks.accountHolderName}
                    errors={errorMessages.accountHolderName}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
                  <CustomAutocomplete
                    name="bankName"
                    label="Bank"
                    value={values.bankName}
                    options={bankOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.bankName}
                    errors={errorMessages.bankName}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    name="ifscCode"
                    label="Ifsc Code"
                    value={values.ifscCode}
                    handleChange={handleChange}
                    checks={checks.ifscCode}
                    errors={errorMessages.ifscCode}
                    required
                  />
                </Grid>
              </Grid>
            </>
          </Grid>

          {/* bank details ends */}

          {/* parent details */}

          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Parental
            </Typography>
          </Grid>

          <Grid item xs={12} component={Paper} elevation={3} p={2}>
            <>
              <Grid container rowSpacing={3} columnSpacing={4}>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="fatherName"
                    label="Father Name"
                    value={values.fatherName}
                    handleChange={handleChange}
                    checks={checks.fatherName}
                    errors={errorMessages.fatherName}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="motherName"
                    label="Mother Name"
                    value={values.motherName}
                    handleChange={handleChange}
                    checks={checks.motherName}
                    errors={errorMessages.motherName}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="guardianName"
                    label="Guardian Name"
                    value={values.guardianName}
                    handleChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="fatherEmail"
                    label="Father Email"
                    value={values.fatherEmail}
                    handleChange={handleChange}
                    checks={checks.fatherEmail}
                    errors={errorMessages.fatherEmail}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="motherEmail"
                    label="Mother Email"
                    value={values.motherEmail}
                    handleChange={handleChange}
                    checks={checks.motherEmail}
                    errors={errorMessages.motherEmail}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="guardianEmail"
                    label="Guardian Email"
                    value={values.guardianEmail}
                    handleChange={handleChange}
                    checks={checks.guardianEmail}
                    errors={errorMessages.guardianEmail}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="fatherMobile"
                    label="Father Mobile"
                    value={values.fatherMobile}
                    handleChange={handleChange}
                    checks={checks.fatherMobile}
                    errors={errorMessages.fatherMobile}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="motherMobile"
                    label="Mother Mobile"
                    value={values.motherMobile}
                    handleChange={handleChange}
                    checks={checks.motherMobile}
                    errors={errorMessages.motherMobile}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="guardianMobile"
                    label="Guardian Mobile"
                    value={values.guardianMobile}
                    handleChange={handleChange}
                    checks={checks.guardianMobile}
                    errors={errorMessages.guardianMobile}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="fatherOccupation"
                    label="Father Occupation"
                    value={values.fatherOccupation}
                    options={occupationList}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.fatherOccupation}
                    errors={errorMessages.fatherOccupation}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="motherOccupation"
                    label="Mother Occupation"
                    value={values.motherOccupation}
                    options={occupationList}
                    handleChangeAdvance={handleChangeAdvance}
                    checks={checks.motherOccupation}
                    errors={errorMessages.motherOccupation}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="guardianOccupation"
                    label="Guardian Occupation"
                    value={values.guardianOccupation}
                    options={occupationList}
                    handleChangeAdvance={handleChangeAdvance}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="fatherIncome"
                    label="Father Income"
                    value={values.fatherIncome}
                    handleChange={handleChange}
                    checks={checks.fatherIncome}
                    errors={errorMessages.fatherIncome}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="motherIncome"
                    label="Mother Income"
                    value={values.motherIncome}
                    handleChange={handleChange}
                    checks={checks.motherIncome}
                    errors={errorMessages.motherIncome}
                  />
                </Grid>
              </Grid>
            </>
          </Grid>

          {/* parent details ends  */}
        </Grid>
      </Box>
    </>
  );
}

export default AuidCorrespondanceDetailsForm;
