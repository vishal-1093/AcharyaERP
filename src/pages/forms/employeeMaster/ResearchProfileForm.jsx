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
  keywordsResearch: "",
  currentProfessional: "",
  areasOfExpertise: "",
  techniquesExpert: "",
};

const phdStatusList = [
  { value: "PHD_Holder", label: "PHD Holder" },
  { value: "PHD_Pursuing", label: "PHD Pursuing" },
  {
    value: "Intrested_to_pursue",
    label: "Intrested to pursue",
  },
];

const initialValues = {
  phdHolderPursuing: null,
  instituteAffiliation: "",
  titleOfThesis: "",
  universityRegisterNumber: "",
  phdRegisterDate: null,
  phdCompletedDate: null,
  peerViewed: "",
  googleScholar: "",
  googleScholar1: "",
  noOfConferences: "",
  professionalOrganisation: "",
  partOfResearchProject: "",
  yesNumberOfProjects: "",
  researchForCollaboration: "",
  researchAttachment: null,
};

const requiredFields = [
  "phdHolderPursuing",
  "instituteAffiliation",
  "titleOfThesis",
  "universityRegisterNumber",
  "phdRegisterDate",
  "phdCompletedDate",
  "peerViewed",
  "googleScholar",
  "googleScholar1",
  "noOfConferences",
  "professionalOrganisation",
  "partOfResearchProject",
  "yesNumberOfProjects",
  "researchForCollaboration",
  "researchAttachment",
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
    phdHolderPursuing: [values.phdHolderPursuing !== null],
    instituteAffiliation: [values.instituteAffiliation !== ""],
    titleOfThesis: [values.titleOfThesis !== ""],
    universityRegisterNumber: [values.universityRegisterNumber !== ""],
    phdRegisterDate: [values.phdRegisterDate !== null],
    phdCompletedDate: [values.phdCompletedDate !== null],
    peerViewed: [values.peerViewed !== ""],
    googleScholar: [values.googleScholar !== ""],
    googleScholar1: [values.googleScholar1 !== ""],
    noOfConferences: [values.noOfConferences !== ""],
    professionalOrganisation: [values.professionalOrganisation !== ""],
    partOfResearchProject: [values.partOfResearchProject !== ""],
    yesNumberOfProjects: [values.yesNumberOfProjects !== ""],
    researchForCollaboration: [values.researchForCollaboration !== ""],
  };

  const errorMessages = {
    phdHolderPursuing: ["This field required"],
    instituteAffiliation: ["This field required"],
    titleOfThesis: ["This field is required"],
    universityRegisterNumber: ["This field is required"],
    phdRegisterDate: ["This field is required"],
    phdCompletedDate: ["This field is required"],
    peerViewed: ["This field is required"],
    googleScholar: ["This field is required"],
    googleScholar1: ["This field is required"],
    noOfConferences: ["This field is required"],
    professionalOrganisation: ["This field is required"],
    partOfResearchProject: ["This field is required"],
    yesNumberOfProjects: ["This field is required"],
    researchForCollaboration: ["This field is required"],
    researchAttachment: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDatePicker = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddResearchInterest = () => {
    setResearchInterest([...researchInterest, initialResearchInterest]);
  };

  const handleRemoveResearchInterest = (event, index) => {
    event.preventDefault();
    const filterResearchInterest = [...researchInterest];
    filterResearchInterest.splice(index, 1);
    setResearchInterest(filterResearchInterest);
  };

  const handleResearchInterestChange = (event, i) => {
    let { name, value } = event.target;
    const onChangeReqVal = JSON.parse(JSON.stringify(researchInterest));
    onChangeReqVal[i][name] = value;
    setResearchInterest(onChangeReqVal);
  };

  const handleFileDrop = (name, newFile) => {
    console.log("newFile====", name, newFile);
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    console.log("handleFileRemove====", name);
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
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

  const handleUploadAttachment = async () => {
    const researchAttachmentFile = new FormData();
    researchAttachmentFile.append("profileResearchId", 1);
    researchAttachmentFile.append("file", values.researchAttachment);
    return await axios
      .post(`/api/employee/profileResearchUploadFile`, researchAttachmentFile)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Research Attachment Uploaded Successfully",
          });
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message:
            "Some thing went wrong !! unable to  uploaded the research Attachment",
        });
        setAlertOpen(true);
      });
  };

  const handleCreate = async () => {
    let payload = [];
    let researchProfileFormData = {};
    researchInterest.forEach((ele) => {
      researchProfileFormData["empId"] = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
      )?.userId;
      researchProfileFormData["instituteAffiliation"] =
        values?.instituteAffiliation;
      researchProfileFormData["universityRegisterNumber"] =
        values?.universityRegisterNumber;
      researchProfileFormData["titleOfThesis"] = values?.titleOfThesis;
      researchProfileFormData["peerViewed"] = values?.peerViewed;
      researchProfileFormData["noOfConferences"] = values?.noOfConferences;
      researchProfileFormData["professionalOrganisation"] =
        values?.professionalOrganisation;
      researchProfileFormData["partOfResearchProject"] =
        values?.partOfResearchProject;
      researchProfileFormData["yesNumberOfProjects"] =
        values?.yesNumberOfProjects;
      researchProfileFormData["phdRegisterDate"] = values?.phdRegisterDate;
      researchProfileFormData["phdCompletedDate"] = values?.phdCompletedDate;
      researchProfileFormData["googleScholar"] = values?.googleScholar;
      researchProfileFormData["googleScholar1"] = values?.googleScholar1;
      researchProfileFormData["phdHolderPursuing"] = values?.phdHolderPursuing;
      researchProfileFormData["researchForCollaboration"] =
        values?.researchForCollaboration;
      researchProfileFormData["keywordsResearch"] = ele?.keywordsResearch;
      researchProfileFormData["techniquesExpert"] = ele?.techniquesExpert;
      researchProfileFormData["currentProfessional"] = ele?.currentProfessional;
      researchProfileFormData["areasOfExpertise"] = ele?.areasOfExpertise;
    });
    payload.push(researchProfileFormData);
    // console.log('researchProfileFormData====',payload);
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      await axios
        .post(`/api/employee/createProfileResearch`, payload)
        .then((res) => {
          handleUploadAttachment();
          //  console.log('form value====',values)
          // setLoading(false);
          // if (res.status === 200 || res.status === 201) {
          //   navigate("/ResearchProfile", { replace: true });
          //   setAlertMessage({
          //     severity: "success",
          //     message: "Form Submitted Successfully",
          //   });
          // } else {
          //   setAlertMessage({
          //     severity: "error",
          //     message: res.data ? res.data.message : "An error occured",
          //   });
          // }
          // setAlertOpen(true);
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

  const dateDisableBeforeRegistered = () => {
    let date = new Date(values.phdRegisterDate);
    date.setDate(date.getDate() + 1);
    return date;
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
                name="phdHolderPursuing"
                label="PHD Status"
                value={values.phdHolderPursuing}
                items={phdStatusList}
                handleChange={handleChange}
                checks={checks.phdHolderPursuing}
                errors={errorMessages.phdHolderPursuing}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="instituteAffiliation"
                label="Name Of University"
                value={values.instituteAffiliation}
                handleChange={handleChange}
                checks={checks.instituteAffiliation}
                errors={errorMessages.instituteAffiliation}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="titleOfThesis"
                label="Title Of Thesis"
                value={values.titleOfThesis}
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
                name="phdRegisterDate"
                label="Registered Date"
                value={values.phdRegisterDate}
                handleChangeAdvance={handleDatePicker}
                // checks={checks.joinDate}
                // errors={errorMessages.joinDate}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="phdCompletedDate"
                label="Completed Date"
                value={values.phdCompletedDate}
                handleChangeAdvance={handleDatePicker}
                minDate={dateDisableBeforeRegistered()}
                // checks={checks.joinDate}
                // errors={errorMessages.joinDate}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="peerViewed"
                label="Number Of Peer-reviewed publication"
                value={values.peerViewed}
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
                name="googleScholar1"
                label="Other Citation Database"
                value={values.googleScholar1}
                handleChange={handleChange}
                // checks={checks.name}
                // errors={errorMessages.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="noOfConferences"
                label="Number If Conferences"
                value={values.noOfConferences}
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
                name="professionalOrganisation"
                label="Membership Professional Socities/Organisation"
                value={values.professionalOrganisation}
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
                name="yesNumberOfProjects"
                label="If You Answered Yes In The Above Question, Give The Number Of Projects"
                value={values.yesNumberOfProjects}
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
                name="researchForCollaboration"
                label="Please Include Any Other Information That Can Help Us Assist You In The Search For Collaboration"
                value={values.researchForCollaboration}
                handleChange={handleChange}
                // checks={checks.notes}
                // errors={errorMessages.notes}
                required
              />
            </Grid>
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
                        {!(researchInterest.length === 1) && (
                          <IconButton
                            color="error"
                            onClick={(e) => handleRemoveResearchInterest(e, i)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="keywordsResearch"
                        label="Five Key Words Related To Your Research Or Areas Of Interest"
                        value={obj.keywordsResearch}
                        handleChange={(e) => handleResearchInterestChange(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="currentProfessional"
                        label="Please Describe Your Current Professional And/Or Research Interest"
                        value={obj.currentProfessional}
                        handleChange={(e) => handleResearchInterestChange(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="areasOfExpertise"
                        label="Describe Other Areas Of Interest/Expertise That You Are Willing To Share"
                        value={obj.areasOfExpertise}
                        handleChange={(e) => handleResearchInterestChange(e, i)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="techniquesExpert"
                        label="List The Techniques You Are An Expert In"
                        value={obj.techniquesExpert}
                        handleChange={(e) => handleResearchInterestChange(e, i)}
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
            name="researchAttachment"
            label="Pdf File Attachment"
            helperText="PDF - smaller than 2 MB"
            file={values.researchAttachment}
            handleFileDrop={handleFileDrop}
            handleFileRemove={handleFileRemove}
            checks={checks.researchAttachment}
            errors={errorMessages.researchAttachment}
          />
        </Grid>
      </Grid>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
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
      </div>
    </>
  );
}

export default ResearchProfileForm;
