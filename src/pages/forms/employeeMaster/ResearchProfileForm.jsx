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
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import { useNavigate } from "react-router-dom";

const initialResearchInterest = {
  keywordsResearch: "",
  currentProfessional: "",
  areasOfExpertise: "",
  techniquesExpert: ""
};

const phdStatusList = [
  { value: "PHDHolder", label: "PHD Holder" },
  { value: "PHDPursuing", label: "PHD Pursuing" },
  {
    value: "IntrestedToPursue",
    label: "Intrested to pursue",
  },
];

const initialValues = {
  phdHolderPursuing: "PHDHolder",
  universityName: "",
  titleOfThesis: "",
  universityRegisterNumber: "",
  phdRegisterDate: "",
  phdCompletedDate: "",
  peerViewed: "",
  googleScholar: "",
  otherCitationDatabase: "",
  noOfConferences: "",
  professionalOrganisation: "",
  partOfResearchProject: "Yes",
  yesNumberOfProjects: "",
  researchForCollaboration: "",
  researchInterests: [initialResearchInterest],
  linkedInLink: "",
  researchAttachment:""
};

const requiredFields = [
  "phdHolderPursuing",
  "universityName",
  "titleOfThesis",
  "universityRegisterNumber",
  "phdRegisterDate",
  "phdCompletedDate",
  "peerViewed",
  "googleScholar",
  "otherCitationDatabase",
  "noOfConferences",
  "professionalOrganisation",
  "partOfResearchProject",
  "yesNumberOfProjects",
  "researchForCollaboration",
  "researchAttachment"
];

const requiredPhdPursuingFields = [
  "phdHolderPursuing",
  "universityName",
  "titleOfThesis",
  "universityRegisterNumber",
  "phdRegisterDate"
]

function ResearchProfileForm() {
  const [values, setValues] = useState(initialValues);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([
      { name: "Research Profile", link: "/ResearchProfileIndex" },
      { name: "Create" },
    ]);
  }, [pathname]);

  const checks = {
    phdHolderPursuing: [values.phdHolderPursuing !== null],
    universityName: [values.universityName !== ""],
    titleOfThesis: [values.titleOfThesis !== ""],
    universityRegisterNumber: [values.universityRegisterNumber !== ""],
    phdRegisterDate: [values.phdRegisterDate !== ""],
    phdCompletedDate: [values.phdCompletedDate !== ""],
    peerViewed: [values.peerViewed !== "",(/^[0-9]+$/).test(values.peerViewed)],
    googleScholar: [values.googleScholar !== ""],
    otherCitationDatabase: [values.otherCitationDatabase !== ""],
    noOfConferences: [values.noOfConferences !== "",(/^[0-9]+$/).test(values.noOfConferences)],
    professionalOrganisation: [values.professionalOrganisation !== "",
      values.professionalOrganisation.replace(/\s/g, '').length <301
    ],
    partOfResearchProject: [values.partOfResearchProject !== ""],
    yesNumberOfProjects: [values.yesNumberOfProjects !== "",(/^[0-9]+$/).test(values.yesNumberOfProjects)],
    researchForCollaboration: [values.researchForCollaboration !== "",
      values.researchForCollaboration.replace(/\s/g, '').length <301

    ],
    researchAttachment: [values.researchAttachment !== "",
      values.researchAttachment && values.researchAttachment.name.endsWith(".pdf"),
      values.researchAttachment && values.researchAttachment.size < 2000000,
    ]
  };

  const checkPhdPursuing = {
    phdHolderPursuing: [values.phdHolderPursuing !== null],
    universityName: [values.universityName !== ""],
    titleOfThesis: [values.titleOfThesis !== ""],
    universityRegisterNumber: [values.universityRegisterNumber !== ""]
  };

  const errorMessages = {
    phdHolderPursuing: ["This field required"],
    universityName: ["This field required"],
    titleOfThesis: ["This field is required"],
    universityRegisterNumber: ["This field is required"],
    phdRegisterDate: ["This field is required"],
    phdCompletedDate: ["This field is required"],
    peerViewed: ["This field is required","Enter only numeric value"],
    googleScholar: ["This field is required"],
    otherCitationDatabase: ["This field is required"],
    noOfConferences: ["This field is required","Enter only numeric value"],
    professionalOrganisation: ["This field is required",
      "Must not be longer than 300 characters",
    ],
    partOfResearchProject: ["This field is required"],
    yesNumberOfProjects: ["This field is required","Enter only numeric value"],
    researchForCollaboration: ["This field is required",
      "Must not be longer than 300 characters",
    ],
    researchAttachment: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  let checkPhdInterest = {};
  let errorMessagePhdInterest = {};
  values.researchInterests.forEach((obj, i) => {
    checkPhdInterest[obj.keywordsResearch] = [obj.keywordsResearch !== ""];
    errorMessagePhdInterest[obj.keywordsResearch] = ["This field is required"];

    checkPhdInterest[obj.currentProfessional] = [obj.currentProfessional !== ""];
    errorMessagePhdInterest[obj.currentProfessional] = ["This field is required"];

    checkPhdInterest[obj.areasOfExpertise] = [obj.areasOfExpertise !== ""];
    errorMessagePhdInterest[obj.areasOfExpertise] = ["This field is required"];

    checkPhdInterest[obj.techniquesExpert] = [obj.techniquesExpert !== ""];
    errorMessagePhdInterest[obj.techniquesExpert] = ["This field is required"];
  });

  const handleChange = (e) => {
    if(e.target.name == "phdHolderPursuing"){
      setValues(initialValues)
    }
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
    setValues((prev) => ({
      ...prev,
      researchInterests: [...values.researchInterests, initialResearchInterest],
    }));
  };

  const handleRemoveResearchInterest = (event, index) => {
    event.preventDefault();
    const filterResearchInterest = [...values.researchInterests];
    filterResearchInterest.splice(index, 1);
    setValues((prev) => ({
      ...prev,
      researchInterests: filterResearchInterest,
    }));
  };

  const handleResearchInterestChange = (event, i) => {
    let { name, value } = event.target;
    const onChangeReqVal = JSON.parse(JSON.stringify(values.researchInterests));
    onChangeReqVal[i][name] = value;
    setValues((prev) => ({
      ...prev,
      researchInterests: onChangeReqVal,
    }));
  };

  const handleFileDrop = (name, newFile) => {
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

  const requiredFieldsValid = () => {
    if (values.phdHolderPursuing == "PHDHolder") {
      for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (Object.keys(checks).includes(field)) {
          const ch = checks[field];
          for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
        } else if (!values[field]) return false;
      }
      return true;
    } else if (values.phdHolderPursuing == "PHDPursuing") {
      for (let i = 0; i < requiredPhdPursuingFields.length; i++) {
        const field = requiredPhdPursuingFields[i];
        if (Object.keys(checkPhdPursuing).includes(field)) {
          const ch = checkPhdPursuing[field];
          for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
        } else if (!values[field]) return false;
      }
      return true;
    } else if (values.phdHolderPursuing == "IntrestedToPursue") {
      for (let i = 0; i < values.researchInterests.length; i++) {
        if (
          values.researchInterests[i].keywordsResearch == "" ||
          values.researchInterests[i].currentProfessional == "" ||
          values.researchInterests[i].areasOfExpertise == "" ||
          values.researchInterests[i].techniquesExpert == ""
        )
          return false;
      }
      return true;
    }
  };

  const tenureStatusForPhdHolder = () => {
    const timeGap = Math.abs(new Date(values.phdCompletedDate) - new Date(values.phdRegisterDate));
    const daysGap = Math.ceil(timeGap / (1000 * 3600 * 24));
    const years = Math.floor(daysGap / 365);
    const remainingDays = daysGap % 365;
    const months = Math.floor(remainingDays / 30);
    const remainingDaysInMonth = remainingDays % 30;
    return `${years}Y  -  ${months}M  -  ${remainingDaysInMonth}D`;
  };

  const tenureStatusForPhdPursuing = () => {
    const timeGap = Math.abs(new Date(new Date()) - new Date(values.phdRegisterDate));
    const daysGap = Math.ceil(timeGap / (1000 * 3600 * 24));
    const years = Math.floor(daysGap / 365);
    const remainingDays = daysGap % 365;
    const months = Math.floor(remainingDays / 30);
    const remainingDaysInMonth = remainingDays % 30;
    return `${years}Y  -  ${months}M  -  ${remainingDaysInMonth}D`;
  };

  const handleUploadAttachment = async (profileResearchId) => {
    const researchAttachmentFile = new FormData();
    researchAttachmentFile.append("profileResearchId", profileResearchId);
    researchAttachmentFile.append("file", values.researchAttachment);
    return await axios
      .post(`/api/employee/profileResearchUploadFile`, researchAttachmentFile)
      .then((res) => {
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
          navigate("/ResearchProfileIndex", { replace: true });
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
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message:
            "Some thing went wrong !! unable to  uploaded the research Attachment",
        });
        setAlertOpen(true);
      });
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      let payload = {
        empId: JSON.parse(sessionStorage.getItem("empId")),
        tenureStatus:
          values.phdHolderPursuing == "PHDHolder"
            ? (tenureStatusForPhdHolder()).replace(/-/g,' ')
            :  values.phdHolderPursuing == "PHDPursuing" ? (tenureStatusForPhdPursuing()).replace(/-/g,' ') :'-',
        active: true,
        phdCount: "phdCount",
        ...values,
        researchAttachment: values.researchAttachment?.name,
      };
      setLoading(true);
      await axios
        .post(`/api/employee/createProfileResearch`, payload)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            if(values.phdHolderPursuing=="PHDHolder"){
              const researchIds = res.data.data.map(item => item.profileResearchId).join(', ');
              handleUploadAttachment(researchIds);
            }else {
              navigate("/ResearchProfileIndex", { replace: true });
            }
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
                label="PhD Status"
                value={values.phdHolderPursuing}
                items={phdStatusList}
                handleChange={handleChange}
                checks={checks.phdHolderPursuing}
                errors={errorMessages.phdHolderPursuing}
                required
              />
            </Grid>
            {(values.phdHolderPursuing !== "IntrestedToPursue") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="universityName"
                  label="Name Of University"
                  value={values.universityName}
                  handleChange={handleChange}
                  checks={checks.universityName}
                  errors={errorMessages.universityName}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing !== "IntrestedToPursue") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="titleOfThesis"
                  label="Title Of Thesis"
                  value={values.titleOfThesis}
                  handleChange={handleChange}
                  checks={checks.titleOfThesis}
                  errors={errorMessages.titleOfThesis}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing !== "IntrestedToPursue") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="universityRegisterNumber"
                  label="University Register Number"
                  value={values.universityRegisterNumber}
                  handleChange={handleChange}
                  checks={checks.universityRegisterNumber}
                  errors={errorMessages.universityRegisterNumber}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing !== "IntrestedToPursue") && (
              <Grid item xs={12} md={4}>
                <CustomDatePicker
                  name="phdRegisterDate"
                  label="Register Date"
                  value={values.phdRegisterDate}
                  disableFuture
                  handleChangeAdvance={handleDatePicker}
                  checks={checks.phdRegisterDate}
                  errors={errorMessages.phdRegisterDate}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomDatePicker
                  name="phdCompletedDate"
                  label="Completed Date"
                  value={values.phdCompletedDate}
                  handleChangeAdvance={handleDatePicker}
                  minDate={dateDisableBeforeRegistered()}
                  disabled={!values.phdRegisterDate}
                  checks={checks.phdCompletedDate}
                  errors={errorMessages.phdCompletedDate}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="peerViewed"
                  label="Number Of Peer-reviewed publication"
                  value={values.peerViewed}
                  handleChange={handleChange}
                  checks={checks.peerViewed}
                  errors={errorMessages.peerViewed}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="googleScholar"
                  label="Google Scholar"
                  value={values.googleScholar}
                  handleChange={handleChange}
                  checks={checks.googleScholar}
                  errors={errorMessages.googleScholar}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="otherCitationDatabase"
                  label="Other Citation Database"
                  value={values.otherCitationDatabase}
                  handleChange={handleChange}
                  checks={checks.otherCitationDatabase}
                  errors={errorMessages.otherCitationDatabase}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="noOfConferences"
                  label="Number Of Conferences"
                  value={values.noOfConferences}
                  handleChange={handleChange}
                  checks={checks.noOfConferences}
                  errors={errorMessages.noOfConferences}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  rows={4}
                  name="linkedInLink"
                  label="Link"
                  value={values.linkedInLink}
                  handleChange={handleChange}
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  name="partOfResearchProject"
                  label="Have you been part of any research Project Other than your Ph.D or Master Thesis ?"
                  value={values.partOfResearchProject}
                  items={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                  handleChange={handleChange}
                  checks={checks.partOfResearchProject}
                  errors={errorMessages.partOfResearchProject}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="yesNumberOfProjects"
                  label={values.partOfResearchProject=="Yes"? "If You Answered Yes In The Above Question, Give The Number Of Projects":"If You Answered No In The Above Question,Type 0"}
                  value={values.yesNumberOfProjects}
                  handleChange={handleChange}
                  checks={checks.yesNumberOfProjects}
                  errors={errorMessages.yesNumberOfProjects}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  multiline
                  rows={4}
                  name="professionalOrganisation"
                  label="Membership Professional Socities/Organisation"
                  value={values.professionalOrganisation}
                  handleChange={handleChange}
                  checks={checks.professionalOrganisation}
                  errors={errorMessages.professionalOrganisation}
                  required
                />
              </Grid>
            )}
            {(values.phdHolderPursuing == "PHDHolder") && (
              <Grid item xs={12} md={4}>
                <CustomTextField
                  multiline
                  rows={4}
                  name="researchForCollaboration"
                  label="Please Include Any Other Information That Can Help Us Assist You In The Search For Collaboration"
                  value={values.researchForCollaboration}
                  handleChange={handleChange}
                  checks={checks.researchForCollaboration}
                  errors={errorMessages.researchForCollaboration}
                  required
                />
              </Grid>
            )}
          </Grid>
        </FormWrapper>
      </Box>
      {values.phdHolderPursuing == "IntrestedToPursue" && (
        <Box component="form" overflow="hidden" p={1}>
          <FormWrapper>
            {values.researchInterests?.map((obj, i) => {
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
                          {!(values.researchInterests.length === 1) && (
                            <IconButton
                              color="error"
                              onClick={(e) =>
                                handleRemoveResearchInterest(e, i)
                              }
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
                          handleChange={(e) =>
                            handleResearchInterestChange(e, i)
                          }
                          checks={checkPhdInterest[obj.keywordsResearch]}
                          errors={errorMessagePhdInterest[obj.keywordsResearch]}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          name="currentProfessional"
                          label="Please Describe Your Current Professional And/Or Research Interest"
                          value={obj.currentProfessional}
                          handleChange={(e) =>
                            handleResearchInterestChange(e, i)
                          }
                          checks={checkPhdInterest[obj.currentProfessional]}
                          errors={errorMessagePhdInterest[obj.currentProfessional]}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          name="areasOfExpertise"
                          label="Describe Other Areas Of Interest/Expertise That You Are Willing To Share"
                          value={obj.areasOfExpertise}
                          handleChange={(e) =>
                            handleResearchInterestChange(e, i)
                          }
                          checks={checkPhdInterest[obj.areasOfExpertise]}
                          errors={errorMessagePhdInterest[obj.areasOfExpertise]}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          name="techniquesExpert"
                          label="List The Techniques You Are An Expert In"
                          value={obj.techniquesExpert}
                          handleChange={(e) =>
                            handleResearchInterestChange(e, i)
                          }
                          checks={checkPhdInterest[obj.techniquesExpert]}
                          errors={errorMessagePhdInterest[obj.techniquesExpert]}
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
      )}

      {values.phdHolderPursuing == "PHDHolder" && (
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
              required
            />
          </Grid>
        </Grid>
      )}

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
