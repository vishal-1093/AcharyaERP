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

function AuidPersonalDetailsForm({
  candidateData,
  candidateProgramData,
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
                  {/* <Grid item xs={12} md={12}>
                    <Typography variant="subtitle2" color="primary">
                      Application
                    </Typography>
                  </Grid> */}
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
                    <CustomSelect
                      name="religion"
                      label="Religion"
                      value={values.religion}
                      items={religionList}
                      handleChange={handleChange}
                      checks={checks.dob}
                      errors={errorMessages.religion}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* candidate basic data input ends */}
        </Grid>
      </Box>
    </>
  );
}

export default AuidPersonalDetailsForm;
