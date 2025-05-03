import React from "react";
import { useState, useEffect } from "react";
import CustomTextField from "./Inputs/CustomTextField";
import {
  CircularProgress,
  Grid,
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
import CustomModal from "./CustomModal.jsx";
import CustomSelect from "./Inputs/CustomSelect.jsx";
import CustomFileInput from "./Inputs/CustomFileInput.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  "conferenceName",
  "paperType",
  "conferenceNatureOfVisit",
  "state",
  "city",
  "fromDate",
  "toDate",
  "nationalityType",
  "conferenceType",
  "paperTitle",
  "priority",
  "organizer",
  "conferencePaper",
  "conferenceCertificate",
  "presentationType",
];

function Conferences({ empId }) {
  const initialConfrencesValues = {
    empId: empId,
    conferenceName: "",
    paperType: "",
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
    conferencePaper: "",
    conferenceCertificate: "",
    presentationType: "",
  };

  const [ConferencesData, setConferencesData] = useState([]);
  const [ConfrenceValues, setConfrenceValues] = useState(
    initialConfrencesValues
  );
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const conferenceChecks = {
    conferenceType: [ConfrenceValues.conferenceType !== ""],
    paperType: [ConfrenceValues.paperType !== ""],
    conferenceName: [ConfrenceValues.conferenceName !== ""],
    paperTitle: [ConfrenceValues.paperTitle !== ""],
    organizer: [ConfrenceValues.organizer !== ""],
    city: [ConfrenceValues.city !== ""],
    presentationType: [ConfrenceValues.presentationType !== ""],
    conferencePaper: [
      ConfrenceValues.conferencePaper,
      ConfrenceValues.conferencePaper &&
        ConfrenceValues.conferencePaper.name.endsWith(".pdf"),
      ConfrenceValues.conferencePaper &&
        ConfrenceValues.conferencePaper.size < 2000000,
    ],
    conferenceCertificate: [
      ConfrenceValues.conferenceCertificate,
      ConfrenceValues.conferenceCertificate &&
        ConfrenceValues.conferenceCertificate.name.endsWith(".pdf"),
      ConfrenceValues.conferenceCertificate &&
        ConfrenceValues.conferenceCertificate.size < 2000000,
    ],
  };

  const conferenceMessages = {
    conferenceType: ["This field is required"],
    paperType: ["This field is required"],
    conferenceName: ["This field is required"],
    paperTitle: ["This field is required"],
    organizer: ["This field is required"],
    city: ["This field is required"],
    presentationType: ["This field is required"],
    conferencePaper: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    conferenceCertificate: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getConfrencesData();
  }, []);

  const getConfrencesData = async () => {
    await axios
      .get(`api/employee/conferenceBasedOnEmpId?emp_id=${empId}`)
      .then((res) => {
        setConferencesData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const deleteConfrence = async (conferencesId) => {
    const handleToggle = async () => {
      await axios
        .delete(`api/employee/deActivateConferences/${conferencesId}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Data Deleted successfully !!",
            });
            getConfrencesData();
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

  const handleDownloadConferencePaper = async (path) => {
    await axios
      .get(`/api/employee/conferenceFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/conferenceCertificateFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleInputConfrenceChange = (e) => {
    setConfrenceValues((prev) => ({
      ...prev,
      [e.target.name]: (e.target.value),
    }));
  };

  const handleChangeAdvanceConfrence = (name, newValue) => {
    setConfrenceValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setConfrenceValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setConfrenceValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const conferenceRowsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(conferenceChecks).includes(field)) {
        const ch = conferenceChecks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![conferenceChecks]) return false;
    }
    return true;
  };

  const handleCreateConfrences = async () => {
    const temp = {};
    const payload = [];
    temp.active = true;
    temp.emp_id = parseInt(initialConfrencesValues.empId);
    temp.conference_type = ConfrenceValues.conferenceType;
    temp.paper_type = ConfrenceValues.paperType;
    temp.conference_name = ConfrenceValues.conferenceName?.replace(/\s+/g, " ");
    temp.from_date = moment(ConfrenceValues.fromDate).format("DD-MM-YY")?.replace(/\s+/g, " ");
    temp.to_date = moment(ConfrenceValues.toDate).format("DD-MM-YY")?.replace(/\s+/g, " ");
    temp.paper_title = ConfrenceValues.paperTitle?.replace(/\s+/g, " ");
    temp.organiser = ConfrenceValues.organizer?.replace(/\s+/g, " ");
    temp.place = ConfrenceValues.city?.replace(/\s+/g, " ");
    temp.presentation_type = ConfrenceValues.presentationType?.replace(/\s+/g, " ");

    payload.push(temp);
    setLoading(true);
    await axios
      .post(`/api/employee/saveConferences`, payload)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          const dataArray = new FormData();
          const dataArray2 = new FormData();
          dataArray.append("multipartFile", ConfrenceValues.conferencePaper);
          dataArray.append("conferences_id", res.data.data[0].conferences_id);

          dataArray2.append(
            "multipartFile",
            ConfrenceValues.conferenceCertificate
          );
          dataArray2.append("conferences_id", res.data.data[0].conferences_id);

          await axios
            .post(`/api/employee/conferenceUploadFile`, dataArray)
            .then(() => {})
            .catch((err) => {
              setAlertMessage({
                severity: "error",
                message: `An error occurred: ${err.response.data}`,
              });
              setAlertOpen(true);
              setLoading(false);
            });

          await axios
            .post(`/api/employee/conferenceCertificateUploadFile`, dataArray2)
            .then(() => {
              getConfrencesData();
              setAlertMessage({
                severity: "success",
                message: "Data updated successfully !!",
              });
              setConfrenceValues({
                ...initialConfrencesValues,
              });
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

        setAlertOpen(true);
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

  return (
    <>
      <Grid item xs={12}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />

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
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell> Conference Type</StyledTableCell>
                <StyledTableCell> Paper Type</StyledTableCell>
                <StyledTableCell> Conference Name</StyledTableCell>
                <StyledTableCell> Paper Title</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>From Date</StyledTableCell>
                <StyledTableCell> To Date</StyledTableCell>
                <StyledTableCell> Organizer</StyledTableCell>
                <StyledTableCell> Presentation Type</StyledTableCell>
                <StyledTableCell>Conference Paper</StyledTableCell>
                <StyledTableCell>Conference Certificate</StyledTableCell>
                  <StyledTableCell>Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ConferencesData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <StyledTableCell>{obj.conference_type}</StyledTableCell>
                    <StyledTableCell>{obj.paper_type}</StyledTableCell>
                    <StyledTableCell>{obj.conference_name}</StyledTableCell>
                    <StyledTableCell>{obj.paper_title}</StyledTableCell>
                    <StyledTableCell>{obj.place}</StyledTableCell>
                    <StyledTableCell>{obj.from_date}</StyledTableCell>
                    <StyledTableCell>{obj.to_date}</StyledTableCell>
                    <StyledTableCell>{obj.organiser}</StyledTableCell>
                    <StyledTableCell>{obj.presentation_type}</StyledTableCell>
                    <StyledTableCell>
                      <VisibilityIcon
                        fontSize="small"
                        color="primary"
                        onClick={() =>
                          handleDownloadConferencePaper(
                            obj.attachment_paper_path
                          )
                        }
                        sx={{ cursor: "pointer" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <VisibilityIcon
                        fontSize="small"
                        color="primary"
                        onClick={() => handleDownload(obj.attachment_cert_path)}
                        sx={{ cursor: "pointer" }}
                      />
                    </StyledTableCell>
                      <StyledTableCell>
                        <IconButton disabled={!!obj.status}>
                        <DeleteIcon
                          onClick={() => deleteConfrence(obj.id)}
                          fontSize="small"
                          color={!!obj.status ?"secondary": "error"}
                          sx={{ cursor: "pointer" }}
                        />
                        </IconButton>
                      </StyledTableCell>
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
        rowSpacing={2}
        elevation={3}
        p={2}
        marginTop={2}
      >
        <>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="conferenceType"
                value={ConfrenceValues.conferenceType}
                label="Conference Type"
                handleChange={handleInputConfrenceChange}
                items={[
                  { label: "INDIAN", value: "INDIAN" },
                  { label: "INTERNATIONAL", value: "INTERNATIONAL" },
                ]}
                checks={ConfrenceValues.conferenceType}
                errors={conferenceMessages.conferenceType}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="paperType"
                value={ConfrenceValues.paperType}
                label="Paper Type"
                handleChange={handleInputConfrenceChange}
                items={[
                  {
                    label: "Postal Presentation",
                    value: "Postal Presentation",
                  },
                  { label: "Paper Presentation", value: "Paper Presentation" },
                ]}
                checks={ConfrenceValues.paperType}
                errors={conferenceMessages.paperType}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="conferenceName"
                label="Conference Name"
                handleChange={handleInputConfrenceChange}
                value={ConfrenceValues.conferenceName}
                checks={conferenceChecks.conferenceName}
                errors={conferenceMessages.conferenceName}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="paperTitle"
                label="Paper Title"
                handleChange={handleInputConfrenceChange}
                value={ConfrenceValues.paperTitle}
                checks={conferenceChecks.paperTitle}
                errors={conferenceMessages.paperTitle}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="fromDate"
                label="from Date"
                value={ConfrenceValues.fromDate}
                handleChangeAdvance={handleChangeAdvanceConfrence}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="toDate"
                label="To Date"
                value={ConfrenceValues.toDate}
                disabled={!ConfrenceValues.fromDate}
                minDate={ConfrenceValues.fromDate}
                handleChangeAdvance={handleChangeAdvanceConfrence}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="organizer"
                label="Organiser"
                handleChange={handleInputConfrenceChange}
                value={ConfrenceValues.organizer}
                checks={conferenceChecks.organizer}
                errors={conferenceMessages.organizer}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="city"
                label="Place"
                handleChange={handleInputConfrenceChange}
                value={ConfrenceValues.city}
                checks={conferenceChecks.city}
                errors={conferenceMessages.city}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="presentationType"
                value={ConfrenceValues.presentationType}
                label="Presentation Type"
                handleChange={handleInputConfrenceChange}
                items={[
                  {
                    label: "Online",
                    value: "Online",
                  },
                  { label: "Offline", value: "Offline" },
                  { label: "Hybrid", value: "Hybrid" },
                ]}
                checks={conferenceChecks.presentationType}
                errors={conferenceMessages.presentationType}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="conferencePaper"
                label="Conference Paper"
                helperText="PDF - smaller than 2 MB"
                file={ConfrenceValues.conferencePaper}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={conferenceChecks.conferencePaper}
                errors={conferenceMessages.conferencePaper}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="conferenceCertificate"
                label="Conference Certificate"
                helperText="PDF - smaller than 2 MB"
                file={ConfrenceValues.conferenceCertificate}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={conferenceChecks.conferenceCertificate}
                errors={conferenceMessages.conferenceCertificate}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              color="success"
              onClick={handleCreateConfrences}
              disabled={!conferenceRowsValid()}
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
        </>
      </Grid>
    </>
  );
}
export default Conferences;
