import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Toolbar,
  Paper,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import axios from "../../../services/Api";
import { useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import { useNavigate } from "react-router-dom";

const initialResearchInterest = {
  name: "",
  relationship: "",
  contactDetails: "",
  age: "",
};

const initialValues = {
  phdStatus: null,
  universityName: "",
  thesisTitle: "",
  universityRegisterNumber: "",
  registeredDate: null,
  completedDate: null,
  peerViewedPublication: "",
  googleScholar: "",
  otherCitationDatabase: "",
  numberIfConferences: "",
  membershipProfessionalOrganisation: "",
  partOfResearchProject: "",
  yesThenNumberOfProjects: "",
  otherInformation: "",
  remarks: "",
};

const requiredFields = [
  "phdStatus",
  "universityName",
  "thesisTitle",
  "universityRegisterNumber",
  "registeredDate",
  "completedDate",
  "peerViewedPublication",
  "googleScholar",
  "otherCitationDatabase",
  "numberIfConferences",
  "membershipProfessionalOrganisation",
  "partOfResearchProject",
  "yesThenNumberOfProjects",
  "otherInformation",
];

function ResearchProfileForm() {
  const [values, setValues] = useState(initialValues);
  const [researchInterest, setResearchInterest] = useState([
    initialResearchInterest,
  ]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([
      { name: "Research Profile", link: "/ResearchProfile" },
      { name: "Create" },
    ]);
  }, [pathname]);

  const checks = {
    phdStatus: [values.phdStatus !== null],
    universityName: [values.universityName !== ""],
    thesisTitle: [values.thesisTitle !== null],
    universityRegisterNumber: [values.universityRegisterNumber !== null],
    registeredDate: [values.registeredDate !== null],
    completedDate: [values.registeredDate !== null],
    peerViewedPublication: [values.peerViewedPublication !== null],
    googleScholar: [values.googleScholar !== null],
    otherCitationDatabase: [values.otherCitationDatabase !== null],
    numberIfConferences: [values.numberIfConferences !== null],
    membershipProfessionalOrganisation: [
      values.membershipProfessionalOrganisation !== null,
    ],
    partOfResearchProject: [values.partOfResearchProject !== null],
    yesThenNumberOfProjects: [values.yesThenNumberOfProjects !== null],
    otherInformation: [values.otherInformation !== null],
  };

  const errorMessages = {
    phdStatus: ["This field required"],
    universityName: ["This field required"],
    thesisTitle: ["This field is required"],
    universityRegisterNumber: ["This field is required"],
    registeredDate: ["This field is required"],
    completedDate: ["This field is required"],
    peerViewedPublication: ["This field is required"],
    googleScholar: ["This field is required"],
    otherCitationDatabase: ["This field is required"],
    numberIfConferences: ["This field is required"],
    membershipProfessionalOrganisation: ["This field is required"],
    partOfResearchProject: ["This field is required"],
    yesThenNumberOfProjects: ["This field is required"],
    otherInformation: ["This field is required"],
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

  const handleAddResearchInterest = () => {
    setResearchInterest([...researchInterest, initialResearchInterest]);
  };

  const handleRemoveResearchInterestBox = (event, index) => {
    event.preventDefault();
    const filterResearchInterest = [...researchInterest];
    filterResearchInterest.splice(index, 1);
    setResearchInterest(filterResearchInterest);
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      await axios
        .post(`/api/employee/createProfileResearch`, values)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/ResearchProfile", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="phdStatus"
                label="PHD Status"
                value={values.phdStatus}
                items={[
                  { value: "PHD_Holder", label: "PHD Holder" },
                  { value: "PHD_Pursuing", label: "PHD Pursuing" },
                  {
                    value: "Intrested_to_pursue",
                    label: "Intrested to pursue",
                  },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="universityName"
                label="Name Of University"
                value={values.universityName}
                handleChange={handleChange}
                // checks={checks.universityName}
                // errors={errorMessages.universityName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="thesisTitle"
                label="Title Of Thesis"
                value={values.thesisTitle}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="universityRegisterNumber"
                label="University Register Number"
                value={values.universityRegisterNumber}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="registeredDate"
                label="Registered Date"
                value={values.registeredDate}
                handleChangeAdvance={handleChangeAdvance}
                // checks={checks.joinDate}
                // errors={errorMessages.joinDate}
                // required
                // disableFuture
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="completedDate"
                label="Completed Date"
                value={values.completedDate}
                handleChangeAdvance={handleChangeAdvance}
                // checks={checks.joinDate}
                // errors={errorMessages.joinDate}
                // required
                // disableFuture
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="peerViewedPublication"
                label="Number Of Peer-reviewed publication"
                value={values.peerViewedPublication}
                handleChange={handleChange}
                // checks={checks.name}
                // errors={errorMessages.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="googleScholar"
                label="Google Scholar"
                value={values.googleScholar}
                handleChange={handleChange}
                // checks={checks.name}
                // errors={errorMessages.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="otherCitationDatabase"
                label="Other Citation Database"
                value={values.otherCitationDatabase}
                handleChange={handleChange}
                // checks={checks.name}
                // errors={errorMessages.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="numberIfConferences"
                label="Number If Conferences"
                value={values.numberIfConferences}
                handleChange={handleChange}
                // checks={checks.name}
                // errors={errorMessages.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                multiline
                rows={4}
                name="membershipProfessionalOrganisation"
                label="Membership Professional Socities/Organisation"
                value={values.membershipProfessionalOrganisation}
                handleChange={handleChange}
                // checks={checks.name}
                // errors={errorMessages.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="partOfResearchProject"
                label="Have you been part of any research Project Other than your Ph.D or Master Thesis ?"
                value={values.partOfResearchProject}
                items={[
                  { value: "Y", label: "Yes" },
                  { value: "N", label: "No" },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                multiline
                rows={4}
                name="yesThenNumberOfProjects"
                label="If You Answered Yes In The Above Question, Give The Number Of Projects"
                value={values.yesThenNumberOfProjects}
                handleChange={handleChange}
                // checks={checks.notes}
                // errors={errorMessages.notes}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                multiline
                rows={4}
                name="otherInformation"
                label="Please Include Any Other Information That Can Help Us Assist You In The Search For Collaboration"
                value={values.otherInformation}
                handleChange={handleChange}
                // checks={checks.notes}
                // errors={errorMessages.notes}
                required
              />
            </Grid>
            {/* <Grid item xs={12} textAlign="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                //   disabled={loading}
                //   onClick={isNew ? handleCreate : handleUpdate}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong>{isNew ? "Create" : "Update"}</strong>
                )}
              </Button>
            </Grid> */}
          </Grid>
        </FormWrapper>
      </Box>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          {researchInterest?.map((obj, i) => {
            return (
              <Grid
                item
                xs={12}
                component={Paper}
                rowSpacing={2}
                elevation={3}
                p={2}
                marginTop={2}
                key={i}
              >
                <>
                  <Grid container rowSpacing={1.5} columnSpacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                          padding: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Research Interest
                        {!(i == 0) && (
                          <IconButton
                            color="error"
                            onClick={(e) =>
                              handleRemoveResearchInterestBox(e, i)
                            }
                            // disabled={
                            //   familyData.length === 1 ||
                            //   obj.name !== "" ||
                            //   obj.relationship !== ""
                            // }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="name"
                        label="Five Key Words Related To Your Research Or Areas Of Interest"
                        // value={obj.name}
                        // handleChange={(e) => handleFamilyChange(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="contactDetails"
                        label="Please Describe Your Current Professional And/Or Research Interest"
                        // value={obj.contactDetails}
                        // handleChange={(e) => handleFamilyChange(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="age"
                        label="Describe Other Areas Of Interest/Expertise That You Are Willing To Share"
                        // value={obj.age}
                        // handleChange={(e) => handleFamilyChange(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="age"
                        label="List The Techniques You Are An Expert In"
                        // value={obj.age}
                        // handleChange={(e) => handleFamilyChange(e, i)}
                        required
                      />
                    </Grid>
                  </Grid>
                </>
              </Grid>
            );
          })}
          <Toolbar style={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddResearchInterest}
              align="right"
              sx={{ borderRadius: 2, marginTop: "10px" }}
            >
              Add
            </Button>
          </Toolbar>
        </FormWrapper>
      </Box>

      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={4}
        columnSpacing={{ xs: 2, md: 4 }}
        mb={2}
      >
        <Grid item xs={12} md={4}>
          <CustomFileInput
            name="coverLetter"
            label="Cover Letter"
            helperText="PDF - smaller than 2 MB"
            // file={values.coverLetter}
            // handleFileDrop={handleFileDrop}
            // handleFileRemove={handleFileRemove}
          />
        </Grid>
      </Grid>

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        rowSpacing={4}
        columnSpacing={{ xs: 2, md: 4 }}
        mb={2}
      >
        <Grid item xs={12} md={2}>
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleCreate}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>Submit</strong>
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ResearchProfileForm;
