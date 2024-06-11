import React from "react";
import { useState, useEffect } from "react";
import CustomTextField from "./Inputs/CustomTextField";
import {
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
  Select,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import axios from "../services/Api";
import DeleteIcon from "@mui/icons-material/Delete";
import useAlert from "../hooks/useAlert.js";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import { useNavigate } from "react-router-dom";

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

const EmployeeDetailsViewProfessional = ({ empId }) => {
  const navigate = useNavigate();
  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };
  const { setAlertMessage, setAlertOpen } = useAlert();

  const initialPublicationValues = {
    empId: empId,
    journalName: "",
    issueNumber: "",
    date: "",
    paperTitle: "",
    priority: "",
    volume: "",
    type: "",
  };

  const [PublicationValues, setPublicationValues] = useState([
    initialPublicationValues,
  ]);

  const initialConfrencesValues = {
    empId: empId,
    conferenceNatureOfVisit: "",
    state: "",
    city: "",
    fromDate: "",
    toDate: "",
    nationalityType: "",
    conferenceType: "",
    paperTitle: "",
    priority: "",
    organizer: "",
  };

  const [ConfrenceValues, setConfrenceValues] = useState([
    initialConfrencesValues,
  ]);

  const initialMembershipValues = {
    empId: empId,
    society: "",
    yearOfJoining: "",
    natureOdMembership: "",
    priority: "",
  };

  const [MembershipValues, setMembershipValues] = useState([
    initialMembershipValues,
  ]);

  const initialJournalValues = {
    empId: empId,
    conductedBy: "",
    courseTitle: "",
    duration: "",
    institution: "",
    priority: "",
    unit: "",
    year: "",
  };

  const [JournalValues, setJournalValues] = useState([initialJournalValues]);

  const handleInputPublicationChange = (e) => {
    const { name, value } = e.target;
    setPublicationValues({
      ...PublicationValues,
      [name]: value,
    });
  };

  const handleInputConfrenceChange = (e) => {
    const { name, value } = e.target;
    setConfrenceValues({
      ...ConfrenceValues,
      [name]: value,
    });
  };

  const handleInputMembershipChange = (e) => {
    const { name, value } = e.target;
    setMembershipValues({
      ...MembershipValues,
      [name]: value,
    });
  };

  const handleInputJournalChange = (e) => {
    const { name, value } = e.target;
    setJournalValues({
      ...JournalValues,
      [name]: value,
    });
  };

  const handleChangeAdvance = (name, value) => {
    setPublicationValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeAdvanceConfrence = (name, newValue) => {
    setConfrenceValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreatePublications = async () => {
    const temp = {};
    temp.empId = parseInt(initialPublicationValues.empId);
    temp.journalName = PublicationValues.journalName;
    temp.issueNumber = PublicationValues.issueNumber;
    temp.date = moment(PublicationValues.date).format("DD/MM/YYYY");
    temp.paperTitle = PublicationValues.paperTitle;
    temp.priority = parseInt(PublicationValues.priority);
    temp.volume = PublicationValues.volume;
    temp.type = PublicationValues.type;

    await axios
      .post(`api/employee/savePublications`, temp)
      .then((res) => {
        if (res.status === 200) {
          getPublicationData();
          setAlertMessage({
            severity: "success",
            message: "Data updated successfully !!",
          });
          setPublicationValues({
            ...initialPublicationValues,
          });
        }

        setAlertOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          severity: "error",
          message: `An error occurred: ${err.response.data}`,
        });
        setAlertOpen(true);
      });
  };

  const handleCreateMemberships = async () => {
    const temp = {};
    temp.empId = initialMembershipValues.empId;
    temp.society = MembershipValues.society;
    temp.yearOfJoining = MembershipValues.yearOfJoining;
    temp.natureOdMembership = MembershipValues.natureOdMembership;
    temp.priority = MembershipValues.priority;

    await axios
      .post(`/api/employee/saveMemberships`, temp)
      .then((res) => {
        if (res.status === 200) {
          getMembershipData();
          setAlertMessage({
            severity: "success",
            message: "Data updated successfully !!",
          });
          setMembershipValues({
            ...initialMembershipValues,
          });
        }

        setAlertOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          severity: "error",
          message: `An error occurred: ${err.response.data}`,
        });
        setAlertOpen(true);
      });
  };

  const handleCreateConfrences = async () => {
    const temp = {};
    temp.empId = parseInt(initialConfrencesValues.empId);
    temp.conferenceNatureOfVisit = ConfrenceValues.conferenceNatureOfVisit;
    temp.state = ConfrenceValues.state;
    temp.city = ConfrenceValues.city;
    temp.fromDate = moment(ConfrenceValues.fromDate).format("DD/MM/YY");
    temp.toDate = moment(ConfrenceValues.toDate).format("DD/MM/YY");
    temp.nationalityType = ConfrenceValues.nationalityType;
    temp.conferenceType = ConfrenceValues.conferenceType;
    temp.paperTitle = ConfrenceValues.paperTitle;
    temp.priority = parseInt(ConfrenceValues.priority);
    temp.organizer = ConfrenceValues.organizer;

    axios
      .post(`api/employee/saveConferences`, temp)
      .then((res) => {
        if (res.status === 200) {
          getConfrencesData();
          setAlertMessage({
            severity: "success",
            message: "Data updated successfully !!",
          });
          setConfrenceValues({
            ...initialConfrencesValues,
          });
        }

        setAlertOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          severity: "error",
          message: `An error occurred: ${err.response.data}`,
        });
        setAlertOpen(true);
      });
  };

  const handleCreateJournal = async () => {
    const temp = {};
    temp.empId = parseInt(initialJournalValues.empId);
    temp.conductedBy = JournalValues.conductedBy;
    temp.courseTitle = JournalValues.courseTitle;
    temp.duration = JournalValues.duration;
    temp.institution = JournalValues.institution;
    temp.priority = parseInt(JournalValues.priority);
    temp.unit = JournalValues.unit;
    temp.year = parseInt(JournalValues.year);

    await axios
      .post(`api/employee/saveJournal`, temp)
      .then((res) => {
        if (res.status === 200) {
          getJournalData();
          setAlertMessage({
            severity: "success",
            message: "Data updated successfully !!",
          });
          setJournalValues({
            ...initialJournalValues,
          });
        }
        setAlertOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          severity: "error",
          message: `An error occurred: ${err.response.data}`,
        });
        setAlertOpen(true);
      });
  };

  useEffect(() => {
    getPublicationData();
    getMembershipData();
    getConfrencesData();
    getJournalData();
  }, []);

  const [publicationData, setPublicationData] = useState([]);

  const getPublicationData = async () => {
    await axios
      .get(`/api/employee/getPublicationsByEmpId/${empId}`)
      .then((res) => {
        setPublicationData(res.data);
      })
      .catch((err) => console.error(err));
  };

  const [MembershipData, setMembershipData] = useState([]);

  const getMembershipData = async () => {
    await axios
      .get(`/api/employee/getMembershipsByEmpId/${empId}`)
      .then((res) => {
        setMembershipData(res.data);
      })
      .catch((err) => console.error(err));
  };

  const [ConferencesData, setConferencesData] = useState([]);

  const getConfrencesData = async () => {
    await axios
      .get(`/api/employee/getConferencesByEmpId/${empId}`)
      .then((res) => {
        setConferencesData(res.data);
      })
      .catch((err) => console.error(err));
  };

  const [JournalData, setJournalData] = useState([]);

  const getJournalData = async () => {
    await axios
      .get(`api/employee/getJournalByEmpId/${empId}`)
      .then((res) => {
        setJournalData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const deleteJournal = async (i) => {
    const id = JournalData[i].journalId;
    await axios
      .delete(`api/employee/deleteJournalById/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "Data Deleted successfully !!",
          });
          getJournalData();
        }
        setAlertOpen(true);
      })
      .catch((err) => console.error(err));
  };

  const deletePublication = async () => {
    await axios
      .delete(`api/employee/deletePublicationsById/${empId}`)
      .then((res) => {
        if (res.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "Data Deleted successfully !!",
          });
          getPublicationData();
        }
        setAlertOpen(true);
      })
      .catch((err) => console.error(err));
  };

  const deleteMembership = async (i) => {
    const id = MembershipData[i].empId;
    await axios
      .delete(`api/employee/deleteMembershipsById/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "Data Deleted successfully !!",
          });
          getMembershipData();
        }
        setAlertOpen(true);
      })
      .catch((err) => console.error(err));
  };

  const deleteConfrence = async () => {
    await axios
      .delete(`api/employee/deleteConferencesById/${empId}`)
      .then((res) => {
        if (res.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "Data Deleted successfully !!",
          });
          getConfrencesData();
        }
        setAlertOpen(true);
      })
      .catch((err) => console.error(err));
  };

  const [subTab, setSubTab] = useState("Publication");

  const navigateToResearchProfile =(event) => {
    event.preventDefault();
    navigate('/ResearchProfileIndex')
  }
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

            <CustomTab value="Journal" label="Journal" />
            <CustomTab value="Membership" label="Membership" />
            <CustomTab value="Research Profile" label="Research Profile" onClick={(e)=>navigateToResearchProfile(e)}/>
          </CustomTabs>
        </Grid>

        <Grid item xs={8} md={10}>
          <Grid container direction="column">
            {subTab === "Publication" && (
              <>
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
                {publicationData.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Journal Name</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Volume</StyledTableCell>
                        <StyledTableCell>Issue Number</StyledTableCell>
                        <StyledTableCell>Paper Title</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                        <StyledTableCell>Priority</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {publicationData.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <StyledTableCell>{obj.journalName}</StyledTableCell>
                            <StyledTableCell>{obj.date}</StyledTableCell>
                            <StyledTableCell>{obj.volume}</StyledTableCell>
                            <StyledTableCell>{obj.issueNumber}</StyledTableCell>
                            <StyledTableCell>{obj.paperTitle}</StyledTableCell>
                            <StyledTableCell>{obj.type}</StyledTableCell>
                            <StyledTableCell>{obj.priority}</StyledTableCell>
                            <StyledTableCell>
                              <DeleteIcon
                                onClick={() => deletePublication(i)}
                              />
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
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
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Journal Name
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="journalName"
                          handleChange={handleInputPublicationChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Date</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomDatePicker
                          name="date"
                          label="Date"
                          value={PublicationValues.date}
                          handleChangeAdvance={handleChangeAdvance}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Volume</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="volume"
                          handleChange={handleInputPublicationChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Issue Number
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="issueNumber"
                          handleChange={handleInputPublicationChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Paper Title</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="paperTitle"
                          handleChange={handleInputPublicationChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Type</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Select
                          name="type"
                          value={PublicationValues.type}
                          onChange={handleInputPublicationChange}
                          fullWidth
                        >
                          <MenuItem value="INDIAN">INDIAN</MenuItem>
                          <MenuItem value="INTERNATIONAL">
                            INTERNATIONAL
                          </MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Priority</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="priority"
                          handleChange={handleInputPublicationChange}
                          inputProps={{
                            type: "number",
                            min: 0,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} align="right">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleCreatePublications}
                        >
                          Save
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
                    Journal Details
                  </Typography>
                </Grid>

                {JournalData.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Course Title</StyledTableCell>
                        <StyledTableCell>Duration</StyledTableCell>
                        <StyledTableCell>Unit</StyledTableCell>
                        <StyledTableCell>Year</StyledTableCell>
                        <StyledTableCell>Conducted By</StyledTableCell>
                        <StyledTableCell>Institution</StyledTableCell>
                        <StyledTableCell>Priority</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {JournalData.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <StyledTableCell>{obj.courseTitle}</StyledTableCell>
                            <StyledTableCell>{obj.duration}</StyledTableCell>
                            <StyledTableCell>{obj.unit}</StyledTableCell>
                            <StyledTableCell>{obj.year}</StyledTableCell>
                            <StyledTableCell>{obj.conductedBy}</StyledTableCell>
                            <StyledTableCell>{obj.institution}</StyledTableCell>
                            <StyledTableCell>{obj.priority}</StyledTableCell>
                            <StyledTableCell>
                              <DeleteIcon onClick={() => deleteJournal(i)} />
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
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
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Course Title
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="courseTitle"
                          handleChange={handleInputJournalChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Duration</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="duration"
                          handleChange={handleInputJournalChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Unit</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="unit"
                          handleChange={handleInputJournalChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Year</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="year"
                          handleChange={handleInputJournalChange}
                          inputProps={{
                            type: "number",
                            min: 0,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Conducted By
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="conductedBy"
                          handleChange={handleInputJournalChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Institution</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="institution"
                          handleChange={handleInputJournalChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Priority</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="priority"
                          handleChange={handleInputJournalChange}
                          inputProps={{
                            type: "number",
                            min: 0,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} align="right">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleCreateJournal}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              </>
            )}
          </Grid>

          <Grid container direction="column">
            {subTab === "Membership" && (
              <>
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
                    Membership Details
                  </Typography>
                </Grid>
                {MembershipData.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          Professional Body/Society
                        </StyledTableCell>
                        <StyledTableCell> Year of Joining</StyledTableCell>
                        <StyledTableCell>Nature of Membership</StyledTableCell>
                        <StyledTableCell>Priority</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {MembershipData.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <StyledTableCell>{obj.society}</StyledTableCell>
                            <StyledTableCell>
                              {obj.yearOfJoining}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.natureOdMembership}
                            </StyledTableCell>
                            <StyledTableCell>{obj.priority}</StyledTableCell>
                            <StyledTableCell>
                              <DeleteIcon onClick={() => deleteMembership(i)} />
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
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
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Professional Body/Society
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="society"
                          handleChange={handleInputMembershipChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Year of Joining
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="yearOfJoining"
                          handleChange={handleInputMembershipChange}
                          inputProps={{
                            type: "number",
                            min: 0,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Nature of Membership*
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="natureOdMembership"
                          handleChange={handleInputMembershipChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Priority</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="priority"
                          handleChange={handleInputMembershipChange}
                          inputProps={{
                            type: "number",
                            min: 0,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} align="right">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleCreateMemberships}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              </>
            )}
          </Grid>

          <Grid container direction="column">
            {subTab === "Confrences" && (
              <>
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
                    Confrences Details
                  </Typography>
                </Grid>
                {ConferencesData.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>
                          {" "}
                          Paper Title/Confrence Name
                        </StyledTableCell>
                        <StyledTableCell> state</StyledTableCell>
                        <StyledTableCell>City</StyledTableCell>
                        <StyledTableCell>From Date</StyledTableCell>
                        <StyledTableCell> To Date</StyledTableCell>
                        <StyledTableCell> Organizer</StyledTableCell>
                        <StyledTableCell> Conference Type</StyledTableCell>
                        <StyledTableCell>
                          Conference Nature Of Visit
                        </StyledTableCell>
                        <StyledTableCell> Nationality Type</StyledTableCell>
                        <StyledTableCell> Priority</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ConferencesData.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <StyledTableCell>{obj.paperTitle}</StyledTableCell>
                            <StyledTableCell>{obj.state}</StyledTableCell>
                            <StyledTableCell>{obj.city}</StyledTableCell>
                            <StyledTableCell>{obj.fromDate}</StyledTableCell>
                            <StyledTableCell>{obj.toDate}</StyledTableCell>
                            <StyledTableCell>{obj.organizer}</StyledTableCell>
                            <StyledTableCell>
                              {obj.conferenceType}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.conferenceNatureOfVisit}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.nationalityType}
                            </StyledTableCell>
                            <StyledTableCell>{obj.priority}</StyledTableCell>
                            <StyledTableCell>
                              <DeleteIcon onClick={() => deleteConfrence(i)} />
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : null}
                <Grid
                  item
                  xs={12}
                  component={Paper}
                  rowSpacing={2}
                  elevation={3}
                  p={2}
                  marginTop={2}
                >
                  <>
                    <Grid container rowSpacing={1.5} columnSpacing={2}>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Paper Title/Confrence Name
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="paperTitle"
                          handleChange={handleInputConfrenceChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">State</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="state"
                          handleChange={handleInputConfrenceChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">City</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="city"
                          handleChange={handleInputConfrenceChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">from Date</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomDatePicker
                          name="fromDate"
                          label="Date"
                          value={ConfrenceValues.fromDate}
                          handleChangeAdvance={handleChangeAdvanceConfrence}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">To Date</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomDatePicker
                          name="toDate"
                          label="To Date"
                          value={ConfrenceValues.toDate}
                          handleChangeAdvance={handleChangeAdvanceConfrence}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Organizer</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="organizer"
                          handleChange={handleInputConfrenceChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Conference Type
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Select
                          name="conferenceType"
                          value={ConfrenceValues.conferenceType}
                          onChange={handleInputConfrenceChange}
                          fullWidth
                        >
                          <MenuItem value="RESEARCH">CONFERENCE</MenuItem>
                          <MenuItem value="RESEARCH">RESEARCH</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Conference Nature Of Visit
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="conferenceNatureOfVisit"
                          handleChange={handleInputConfrenceChange}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Nationality Type
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Select
                          name="nationalityType"
                          value={ConfrenceValues.nationalityType}
                          onChange={handleInputConfrenceChange}
                          fullWidth
                        >
                          <MenuItem value="INDIAN">INDIAN</MenuItem>
                          <MenuItem value="INTERNATIONAL">
                            INTERNATIONAL
                          </MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Priority</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="priority"
                          handleChange={handleInputConfrenceChange}
                          inputProps={{
                            type: "number",
                            min: 0,
                          }}
                        />
                      </Grid>{" "}
                    </Grid>
                  </>
                </Grid>

                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleCreateConfrences}
                  >
                    Save
                  </Button>
                </Grid>
              </>
            )}
          </Grid>

          

          
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDetailsViewProfessional;
