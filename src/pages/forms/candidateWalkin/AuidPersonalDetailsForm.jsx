import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import ModalWrapper from "../../../components/ModalWrapper";
import FeeTemplateView from "../../../components/FeeTemplateView";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import axios from "../../../services/Api";
import religionList from "../../../utils/ReligionList";
import { maskEmail, maskMobile } from "../../../utils/MaskData";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";

function AuidPersonalDetailsForm({
  candidateData,
  candidateProgramData,
  noOfYears,
  values,
  setValues,
  checks,
  errorMessages,
}) {
  const [country, setCountry] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getCountry();
  }, []);

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

  const displayEmail = (email) => {
    const input = email.split("@");
    let count = "";

    for (let i = 0; i < input[0].length; i++) {
      count += "*";
    }

    return count + input[1];
  };
  // const generateEmail = () => {
  //   const name = candidateData.candidate_name
  //     ? candidateData.candidate_name.toLowerCase().trim().replace(/ +/g, "")
  //     : "";
  //   const candidateFatherName = candidateData.father_name
  //     ? candidateData.father_name
  //     : "";
  //   const year = candidateProgramData.ac_year
  //     ? candidateProgramData.ac_year
  //     : "";
  //   const splitYears = year.split("");
  //   const auidFormat = candidateData.auidFormat ? candidateData.auidFormat : "";

  //   const acharyaMail =
  //     name +
  //     candidateFatherName.split("")[0] +
  //     splitYears[7] +
  //     splitYears[8] +
  //     auidFormat.toLowerCase() +
  //     "@acharya.ac.in";

  //   setValues((prev) => ({
  //     ...prev,
  //     ["acharyaEmail"]: acharyaMail,
  //   }));

  //   return acharyaMail;
  // };

  const handleFeeTemplate = async () => {
    setModalOpen(true);
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

  return (
    <>
      <Box mt={1}>
        <Grid container rowSpacing={3}>
          {/* Registration Details  */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Grid container rowSpacing={1.5}>
                  <Grid item xs={12} md={12}>
                    <Typography variant="subtitle2" color="primary">
                      Registration Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">Applicant Name </Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {candidateData.candidate_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">Applicant No </Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {candidateData.application_no_npf}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">Mobile</Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {maskMobile(candidateData.mobile_number)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">Email</Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {maskEmail(candidateData.candidate_email)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">Registered Date</Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {candidateData.created_date
                        ? convertToDMY(candidateData.created_date.slice(0, 10))
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">AC Year</Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {candidateProgramData.ac_year}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">School</Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {candidateProgramData.school_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">Course</Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {candidateProgramData.program_short_name +
                        " - " +
                        candidateProgramData.program_specialization_short_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">
                      Admission Category
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      {candidateProgramData.fee_admission_category_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={1.5}>
                    <Typography variant="subtitle2">Fee Template</Typography>
                  </Grid>
                  <Grid item xs={12} md={4.5}>
                    <Typography variant="body2">
                      <Button size="small" onClick={handleFeeTemplate}>
                        {candidateProgramData.fee_template_name}
                      </Button>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Registration Details Ends  */}

          {/* View Template  */}
          {modalOpen ? (
            <Grid item xs={12}>
              <ModalWrapper
                open={modalOpen}
                setOpen={setModalOpen}
                maxWidth={1200}
              >
                <Grid item xs={12} mt={3}>
                  <FeeTemplateView
                    feeTemplateId={candidateProgramData.fee_template_id}
                    type={2}
                  />
                </Grid>
              </ModalWrapper>
            </Grid>
          ) : (
            ""
          )}

          {/* View Template Ends  */}

          {/* candidate basic data input */}

          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Grid container rowSpacing={3} columnSpacing={4}>
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
                      checks={checks.dob}
                      errors={errorMessages.dob}
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
                          value: "true",
                          label: "Male",
                        },
                        {
                          value: "false",
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
                      label="Mobile No"
                      value={values.mobileNo}
                      handleChange={handleChange}
                      checks={checks.mobileNo}
                      errors={errorMessages.mobileNo}
                      required
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
                      checks={checks.dob}
                      errors={errorMessages.religion}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="castCategory"
                      label="Caste Category"
                      value={values.castCategory}
                      handleChange={handleChange}
                      checks={checks.castCategory}
                      errors={errorMessages.castCategory}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="caste"
                      label="Caste"
                      value={values.caste}
                      handleChange={handleChange}
                      checks={checks.caste}
                      errors={errorMessages.caste}
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
                    <CustomTextField
                      name="aadhar"
                      label="Aadhar"
                      value={values.aadhar}
                      handleChange={handleChange}
                      checks={checks.aadhar}
                      errors={errorMessages.aadhar}
                      inputProps={{ maxLength: 12 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CustomAutocomplete
                      name="nationality"
                      label="Nationality"
                      value={values.nationality}
                      options={country}
                      handleChangeAdvance={handleChangeAdvance}
                      checks={checks.nationality}
                      errors={errorMessages.nationality}
                      required
                    />
                  </Grid>
                  {candidateProgramData.year_sem === true ? (
                    <Grid item xs={12} md={3}>
                      <CustomAutocomplete
                        name="currentYearSem"
                        label="Current Year/Sem"
                        value={values.currentYearSem}
                        options={noOfYears}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.currentYearSem}
                        errors={errorMessages.currentYearSem}
                        required
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}

                  <Grid item xs={12} md={3}>
                    <CustomRadioButtons
                      name="isInternational"
                      label="Is International Student"
                      value={values.isInternational}
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
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* candidate basic data input ends */}

          {values.isInternational === "true" ? (
            <>
              {/* FRRO details */}

              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Grid container rowSpacing={3} columnSpacing={4}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="primary">
                          FRRO Details
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} align="right">
                        <Typography variant="subtitle2" color="error">
                          * Applicable only for international students
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container rowSpacing={3} columnSpacing={4}>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="passportName"
                              label="Name as per Passport"
                              value={values.passportName}
                              handleChange={handleChange}
                              checks={checks.passportName}
                              errors={errorMessages.passportName}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="birthPlace"
                              label="Birth Place"
                              value={values.birthPlace}
                              handleChange={handleChange}
                              checks={checks.birthPlace}
                              errors={errorMessages.birthPlace}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="arrivalPort"
                              label="Arrival Port"
                              value={values.arrivalPort}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="departurePort"
                              label="Departure Port"
                              value={values.departurePort}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomRadioButtons
                              name="reportedIndia"
                              label="Reported to India"
                              value={values.reportedIndia}
                              items={[
                                {
                                  value: "true",
                                  label: "Yes",
                                },
                                {
                                  value: "false",
                                  label: "No",
                                },
                              ]}
                              handleChange={handleChange}
                            />
                          </Grid>
                          {values.reportedIndia === "true" ? (
                            <Grid item xs={12} md={3}>
                              <CustomDatePicker
                                name="reportedOn"
                                label="Reported On"
                                value={values.reportedOn}
                                handleChangeAdvance={handleChangeAdvance}
                              />
                            </Grid>
                          ) : (
                            <></>
                          )}

                          {/* Passport */}
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="passportNo"
                              label="Passport No"
                              value={values.passportNo}
                              handleChange={handleChange}
                              checks={checks.passportNo}
                              errors={errorMessages.passportNo}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="passportPlace"
                              label="Passport Issued Place"
                              value={values.passportPlace}
                              handleChange={handleChange}
                              checks={checks.passportPlace}
                              errors={errorMessages.passportPlace}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="passportIssuedDate"
                              label="Passport Issued Date"
                              value={values.passportIssuedDate}
                              handleChangeAdvance={handleChangeAdvance}
                              checks={checks.passportIssuedDate}
                              errors={errorMessages.passportIssuedDate}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="passportExpiryDate"
                              label="Passport Expiry Date"
                              value={values.passportExpiryDate}
                              handleChangeAdvance={handleChangeAdvance}
                              checks={checks.passportExpiryDate}
                              errors={errorMessages.passportExpiryDate}
                              required
                            />
                          </Grid>

                          {/* Visa  */}

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="visaNo"
                              label="Visa No"
                              value={values.visaNo}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="visaType"
                              label="Visa Type"
                              value={values.visaType}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="typeofEntry"
                              label="Type of entry"
                              value={values.typeofEntry}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="visaPlace"
                              label="Place of Visa Issue"
                              value={values.visaPlace}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="visaIssuedDate"
                              label="Visa Issued Date"
                              value={values.visaIssuedDate}
                              handleChangeAdvance={handleChangeAdvance}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="visaExpiryDate"
                              label="Visa Expiry Date"
                              value={values.visaExpiryDate}
                              handleChangeAdvance={handleChangeAdvance}
                            />
                          </Grid>

                          {/* FSIS */}

                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="fsisNo"
                              label="FSIS No"
                              value={values.fsisNo}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="imMigrationDate"
                              label="Immigration Date"
                              value={values.imMigrationDate}
                              handleChangeAdvance={handleChangeAdvance}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="issueBy"
                              label="Issue By"
                              value={values.issueBy}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="rpNo"
                              label="RP No"
                              value={values.rpNo}
                              handleChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="rpIssueDate"
                              label="RP Issue Date"
                              value={values.rpIssueDate}
                              handleChangeAdvance={handleChangeAdvance}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomDatePicker
                              name="rpExpiryDate"
                              label="RP Expiry Date"
                              value={values.rpExpiryDate}
                              handleChangeAdvance={handleChangeAdvance}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomTextField
                              name="frroRemarks"
                              label="Remarks"
                              value={values.frroRemarks}
                              handleChange={handleChange}
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container rowSpacing={3} columnSpacing={4}>
                          <Grid item xs={12} md={3}>
                            <CustomFileInput
                              name="aiuDocument"
                              label="AIU equivalence document"
                              helperText="PDF - smaller than 2 MB"
                              file={values.aiuDocument}
                              handleFileDrop={handleFileDrop}
                              handleFileRemove={handleFileRemove}
                              checks={checks.aiuDocument}
                              errors={errorMessages.aiuDocument}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomFileInput
                              name="passportDocument"
                              label="Passport copy document"
                              helperText="PDF - smaller than 2 MB"
                              file={values.passportDocument}
                              handleFileDrop={handleFileDrop}
                              handleFileRemove={handleFileRemove}
                              checks={checks.passportDocument}
                              errors={errorMessages.passportDocument}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomFileInput
                              name="visaDocument"
                              label="Visa Copy document"
                              helperText="PDF - smaller than 2 MB"
                              file={values.visaDocument}
                              handleFileDrop={handleFileDrop}
                              handleFileRemove={handleFileRemove}
                              checks={checks.visaDocument}
                              errors={errorMessages.visaDocument}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <CustomFileInput
                              name="rpDocument"
                              label="Residential permit copy document"
                              helperText="PDF - smaller than 2 MB"
                              file={values.rpDocument}
                              handleFileDrop={handleFileDrop}
                              handleFileRemove={handleFileRemove}
                              checks={checks.rpDocument}
                              errors={errorMessages.rpDocument}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              {/* FRRO details ends */}
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default AuidPersonalDetailsForm;
