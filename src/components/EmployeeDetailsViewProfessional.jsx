import React from "react";
import { useState, useEffect } from "react";
import CustomTextField from "./Inputs/CustomTextField";
import {
  CircularProgress,
  Grid,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableBody,
  TableContainer,
  IconButton
} from "@mui/material";
import moment from "moment";
import axios from "../services/Api";
import DeleteIcon from "@mui/icons-material/Delete";
import useAlert from "../hooks/useAlert.js";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "./Inputs/CustomSelect.jsx";
import CustomFileInput from "./Inputs/CustomFileInput.jsx";
import EmployeeDetailConference from "./EmployeeDetailConference.jsx";
import EmployeeDetailsMembership from "./EmployeeDetailsMembership.jsx";
import CustomModal from "./CustomModal.jsx";
import EmployeeDetailsJournal from "./EmployeeDetailsJournal.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmployeeDetailsGrant from "./EmployeeDetailsGrant.jsx";
import EmployeeDetailsPatent from "./EmployeeDetailsPatent.jsx";
import { checkAdminAccess } from "../utils/DateTimeUtils.js";
import useBreadcrumbs from "../hooks/useBreadcrumbs.js";

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const requiredFields = [
  "journalName",
  "issueNumber",
  "date",
  "pageNumber",
  "paperTitle",
  "priority",
  "volume",
  "type",
  "issn",
  "issnType",
  "doiLink",
  "publicationFile",
];

const EmployeeDetailsViewProfessional = ({ data, state, type, empId }) => {
  const navigate = useNavigate();
  const params = useParams();

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const initialPublicationValues = {
    empId: empId,
    journalName: "",
    issueNumber: "",
    date: "",
    pageNumber: "",
    paperTitle: "",
    priority: "",
    volume: "",
    type: "",
    issn: "",
    issnType: "",
    doiLink: "",
    publicationFile: "",
  };

  const [PublicationValues, setPublicationValues] = useState(
    initialPublicationValues
  );
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const publicationChecks = {
    type: [PublicationValues.type !== ""],
    journalName: [PublicationValues.journalName !== ""],
    paperTitle: [PublicationValues.paperTitle !== ""],
    volume: [PublicationValues.volume !== ""],
    issueNumber: [PublicationValues.issueNumber !== ""],
    pageNumber: [PublicationValues.pageNumber !== ""],
    issnType: [PublicationValues.issnType !== ""],
    issn: [PublicationValues.issn !== ""],
    doiLink: [PublicationValues.doiLink !== ""],
    publicationFile: [
      PublicationValues.publicationFile,
      PublicationValues.publicationFile &&
        PublicationValues.publicationFile.name.endsWith(".pdf"),
      PublicationValues.publicationFile &&
        PublicationValues.publicationFile.size < 2000000,
    ],
  };

  const publicationMessages = {
    type: ["This field is required"],
    journalName: ["This field is required"],
    paperTitle: ["This field is required"],
    volume: ["This field is required"],
    issueNumber: ["This field is required"],
    pageNumber: ["This field is required"],
    issnType: ["This field is required"],
    issn: ["This field is required"],
    doiLink: ["This field is required"],
    publicationFile: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setPublicationValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setPublicationValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleInputPublicationChange = (e) => {
    setPublicationValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, value) => {
    setPublicationValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const publicationsRowValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(publicationChecks).includes(field)) {
        const ch = publicationChecks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![publicationChecks]) return false;
    }
    return true;
  };

  const handleCreatePublications = async () => {
    const payload = [];
    const temp = {};
    temp.active = true;
    temp.emp_id = parseInt(initialPublicationValues.empId);
    temp.type = PublicationValues.type;
    temp.journal_name = PublicationValues.journalName;
    temp.issue_number = PublicationValues.issueNumber;
    temp.date = moment(PublicationValues.date).format("DD/MM/YYYY");
    temp.paper_title = PublicationValues.paperTitle;
    temp.volume = PublicationValues.volume;
    temp.page_number = PublicationValues.pageNumber;
    temp.issn_type = PublicationValues.issnType;
    temp.issn = PublicationValues.issn;
    temp.doi = PublicationValues.doiLink;

    payload.push(temp);
    setLoading(true);
    await axios
      .post(`/api/employee/savePublication`, payload)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          const dataArray = new FormData();

          dataArray.append("multipartFile", PublicationValues.publicationFile);
          dataArray.append("publications_id", res.data.data[0].publications_id);

          await axios
            .post(`/api/employee/publicationUploadFile`, dataArray)
            .then(async (res) => {
              if (res.status === 200 || res.status === 201) {
                getPublicationData();
                setAlertMessage({
                  severity: "success",
                  message: "Data updated successfully !!",
                });
              }
              setPublicationValues({ ...initialPublicationValues });
              setAlertOpen(true);
              setLoading(false);
            })
            .catch((err) => {
              setLoading(false);
              setAlertMessage({
                severity: "error",
                message: err.response.data.message ? err.response.data.message : `An error occurred!`,
              });
              setAlertOpen(true);
            });
        }
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response.data.message ? err.response.data.message : `An error occurred!`,
        });
        setAlertOpen(true);
      });
  };

  useEffect(() => {
    getPublicationData();
    if (state) {
      setCrumbs([
        {
          name: "Employee Index",
          link: type === "user" ? "/employee-userwiseindex" : "/EmployeeIndex",
        },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    } else {
      setCrumbs([
        { name: "Employee Profile" },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    }
  }, []);

  const [publicationData, setPublicationData] = useState([]);

  const getPublicationData = async () => {
    await axios
      .get(`/api/employee/publicationDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setPublicationData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/publicationsFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const deletePublication = async (publicationId) => {
    const handleToggle = async () => {
      await axios
        .delete(`api/employee/deActivatePublication/${publicationId}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Data Deleted successfully !!",
            });
            getPublicationData();
          }
          setModalOpen(false);
          setAlertOpen(true);
        })
        .catch((err) => console.error(err));
    };

    setModalOpen(true);
    setModalContent({
      message: "Are you sure you want to delete ??",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const [subTab, setSubTab] = useState("Publication");

  const navigateToResearchProfile = (event) => {
    event.preventDefault();
    navigate("/ResearchProfileIndex", {
      state: params,
    });
  };
  return (
    <>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Publication" label="Publication" />
            <CustomTab value="Confrences" label="Conferences" />

            <CustomTab value="Journal" label="Book Chapter" />
            <CustomTab value="Membership" label="Membership" />
            <CustomTab value="Grants" label="Grants" />
            <CustomTab value="Patent" label="Patent" />
            <CustomTab
              value="Research Profile"
              label="Research Profile"
              onClick={(e) => navigateToResearchProfile(e)}
            />
          </CustomTabs>
        </Grid>

        <Grid item xs={8} md={10}>
          <Grid container direction="column">
            {subTab === "Publication" && (
              <>
                <CustomModal
                  open={modalOpen}
                  setOpen={setModalOpen}
                  title={modalContent.title}
                  message={modalContent.message}
                  buttons={modalContent.buttons}
                />

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
                    Publication Details
                  </Typography>
                </Grid>
                {publicationData?.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Type</StyledTableCell>
                          <StyledTableCell>Journal Name</StyledTableCell>
                          <StyledTableCell>Date</StyledTableCell>
                          <StyledTableCell>Volume</StyledTableCell>
                          <StyledTableCell>Issue Number</StyledTableCell>
                          <StyledTableCell>Paper Title</StyledTableCell>
                          <StyledTableCell>Paper Number</StyledTableCell>
                          <StyledTableCell>ISSN</StyledTableCell>
                          <StyledTableCell>ISSN Type</StyledTableCell>
                          <StyledTableCell>View</StyledTableCell>
                          {checkAdminAccess() && (
                            <StyledTableCell>Delete</StyledTableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {publicationData.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <StyledTableCell>{obj.Type}</StyledTableCell>
                              <StyledTableCell>
                                {obj.journal_name}
                              </StyledTableCell>
                              <StyledTableCell>{obj.date}</StyledTableCell>
                              <StyledTableCell>{obj.volume}</StyledTableCell>
                              <StyledTableCell>
                                {obj.issue_number}
                              </StyledTableCell>
                              <StyledTableCell>
                                {obj.paper_title}
                              </StyledTableCell>
                              <StyledTableCell>
                                {obj.page_number}
                              </StyledTableCell>
                              <StyledTableCell>{obj.issn}</StyledTableCell>
                              <StyledTableCell>{obj.issn_type}</StyledTableCell>
                              <StyledTableCell>
                                <VisibilityIcon
                                  fontSize="small"
                                  color="primary"
                                  onClick={() =>
                                    handleDownload(obj.attachment_path)
                                  }
                                  sx={{ cursor: "pointer" }}
                                />
                              </StyledTableCell>
                              {checkAdminAccess() && (
                                <StyledTableCell>
                                  <IconButton disabled={!!obj.status}>
                                   <DeleteIcon
                                    onClick={() => deletePublication(obj.id)}
                                    fontSize="small"
                                    color={!!obj.status ?"secondary": "error"}
                                    sx={{ cursor: "pointer" }}
                                    
                                  />
                                  </IconButton>
                                </StyledTableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : null}
                <Grid
                  item
                  xs={12}
                  component={Paper}
                  elevation={3}
                  p={4}
                  marginTop={2}
                >
                  <>
                    <Grid container rowSpacing={1.5} columnSpacing={2}>
                      <Grid item xs={12} md={4}>
                        <CustomSelect
                          name="type"
                          label="Type"
                          value={PublicationValues.type}
                          handleChange={handleInputPublicationChange}
                          items={[
                            { label: "INDIAN", value: "INDIAN" },
                            { label: "INTERNATIONAL", value: "INTERNATIONAL" },
                          ]}
                          checks={publicationChecks.type}
                          errors={publicationMessages.type}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="journalName"
                          label="Journal Name"
                          handleChange={handleInputPublicationChange}
                          value={PublicationValues.journalName}
                          checks={publicationChecks.journalName}
                          errors={publicationMessages.journalName}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomDatePicker
                          name="date"
                          label="Date"
                          value={PublicationValues.date}
                          handleChangeAdvance={handleChangeAdvance}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="paperTitle"
                          handleChange={handleInputPublicationChange}
                          label="Paper Title"
                          value={PublicationValues.paperTitle}
                          checks={publicationChecks.paperTitle}
                          errors={publicationMessages.paperTitle}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="volume"
                          label="Volume"
                          handleChange={handleInputPublicationChange}
                          value={PublicationValues.volume}
                          checks={publicationChecks.volume}
                          errors={publicationMessages.volume}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="issueNumber"
                          handleChange={handleInputPublicationChange}
                          label="Issue Number"
                          value={PublicationValues.issueNumber}
                          checks={publicationChecks.issueNumber}
                          errors={publicationMessages.issueNumber}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="pageNumber"
                          handleChange={handleInputPublicationChange}
                          label="Page Number"
                          value={PublicationValues.pageNumber}
                          checks={publicationChecks.pageNumber}
                          errors={publicationMessages.pageNumber}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomSelect
                          name="issnType"
                          handleChange={handleInputPublicationChange}
                          label="ISSN Type"
                          items={[
                            { label: "Q1", value: "Q1" },
                            { label: "Q2", value: "Q2" },
                            { label: "Q3", value: "Q3" },
                            { label: "Q4", value: "Q4" },
                            { label: "SCOPUS INDEX", value: "SCOPUS INDEX" },
                            { label: "WOS", value: "WOS" },
                            {
                              label: "GOOGLE SCHOLAR",
                              value: "GOOGLE SCHOLAR",
                            },
                            { label: "NON-INDEX", value: "NON-INDEX" },
                          ]}
                          value={PublicationValues.issnType}
                          checks={publicationChecks.issnType}
                          errors={publicationMessages.issnType}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="issn"
                          handleChange={handleInputPublicationChange}
                          label="ISSN"
                          value={PublicationValues.issn}
                          checks={publicationChecks.issn}
                          errors={publicationMessages.issn}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="doiLink"
                          handleChange={handleInputPublicationChange}
                          label="DOI (Digital Object Identifier) Link"
                          value={PublicationValues.doiLink}
                          checks={publicationChecks.doiLink}
                          errors={publicationMessages.doiLink}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomFileInput
                          name="publicationFile"
                          label="PDF"
                          helperText="PDF - smaller than 2 MB"
                          file={PublicationValues.publicationFile}
                          handleFileDrop={handleFileDrop}
                          handleFileRemove={handleFileRemove}
                          checks={publicationChecks.publicationFile}
                          errors={publicationMessages.publicationFile}
                        />
                      </Grid>

                      <Grid item xs={12} align="right">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleCreatePublications}
                          disabled={!publicationsRowValid()}
                        >
                          {loading ? (
                            <CircularProgress
                              size={25}
                              color="blue"
                              style={{ margin: "2px 13px" }}
                            />
                          ) : (
                            <strong>SUBMIT</strong>
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              </>
            )}
          </Grid>
          <Grid container direction="column">
            {subTab === "Journal" && (
              <>
                <EmployeeDetailsJournal empId={empId} />
              </>
            )}
          </Grid>

          <Grid container direction="column">
            {subTab === "Membership" && (
              <>
                <EmployeeDetailsMembership empId={empId} />
              </>
            )}
          </Grid>

          <Grid container direction="column">
            {subTab === "Grants" && (
              <>
                <EmployeeDetailsGrant empId={empId} />
              </>
            )}
          </Grid>

          <Grid container direction="column">
            {subTab === "Patent" && (
              <>
                <EmployeeDetailsPatent empId={empId} />
              </>
            )}
          </Grid>

          <Grid container direction="column">
            {subTab === "Confrences" && (
              <>
                <EmployeeDetailConference empId={empId} />
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDetailsViewProfessional;
