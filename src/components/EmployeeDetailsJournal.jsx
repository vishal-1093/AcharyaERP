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
} from "@mui/material";
import CustomModal from "./CustomModal.jsx";
import axios from "../services/Api";
import DeleteIcon from "@mui/icons-material/Delete";
import useAlert from "../hooks/useAlert.js";
import CustomSelect from "./Inputs/CustomSelect.jsx";
import CustomFileInput from "./Inputs/CustomFileInput.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { checkAdminAccess } from "../utils/DateTimeUtils.js";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function EmployeeDetailsJournal({ empId }) {
  const initialJournalValues = {
    empId: empId,
    conductedBy: "",
    courseTitle: "",
    duration: "",
    institution: "",
    priority: "",
    unit: "",
    authorName: "",
    year: "",
    isbnNo: "",
    doi: "",
    journalPdf: "",
  };

  const [JournalValues, setJournalValues] = useState(initialJournalValues);

  const [journalRowsValid, setJournalRowsValid] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const journalChecks = {
    courseTitle: [JournalValues.courseTitle !== ""],
    authorName: [JournalValues.authorName !== ""],
    publisher: [JournalValues.publisher !== ""],
    year: [JournalValues.year !== ""],
    isbnNo: [JournalValues.isbnNo !== ""],
    doi: [JournalValues.doi !== ""],
    unit: [JournalValues.unit !== ""],
    journalPdf: [
      JournalValues.journalPdf,
      JournalValues.journalPdf &&
        JournalValues.journalPdf.name.endsWith(".pdf"),
      JournalValues.journalPdf && JournalValues.journalPdf.size < 2000000,
    ],
  };

  const journalMessages = {
    courseTitle: ["This field is required"],
    authorName: ["This field is required"],
    publisher: ["This field is required"],
    year: ["This field is required"],
    isbnNo: ["This field is required"],
    doi: ["This field is required"],
    unit: ["This field is required"],
    journalPdf: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getJournalData();
  }, []);

  const [JournalData, setJournalData] = useState([]);

  const getJournalData = async () => {
    await axios
      .get(`api/employee/bookChapterDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setJournalData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const journalRows =
      JournalValues.courseTitle &&
      JournalValues.authorName &&
      JournalValues.publisher &&
      JournalValues.year &&
      JournalValues.isbnNo &&
      JournalValues.doi &&
      JournalValues.journalPdf;

    setJournalRowsValid(journalRows);
  }, [JournalValues]);

  const deleteJournal = async (bookChapterId) => {
    const handleToggle = async () => {
      await axios
        .delete(`api/employee/deActivateBookChapter/${bookChapterId}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Data Deleted successfully !!",
            });
            getJournalData();
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

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/bookChapterFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleInputJournalChange = (e) => {
    setJournalValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setJournalValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setJournalValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleCreateJournal = async () => {
    const temp = {};
    const payload = [];
    temp.active = true;
    temp.emp_id = parseInt(initialJournalValues.empId);
    temp.book_chapter = JournalValues.bookChapter;
    temp.book_title = JournalValues.courseTitle;
    temp.authore = JournalValues.authorName;
    temp.publisher = JournalValues.publisher;
    temp.published_year = JournalValues.year;
    temp.isbn_number = JournalValues.isbnNo;
    temp.doi = JournalValues.doi;

    payload.push(temp);
    setLoading(true);
    await axios
      .post(`api/employee/saveBookChapter`, payload)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          const dataArray = new FormData();
          dataArray.append("multipartFile", JournalValues.journalPdf);
          dataArray.append("book_chapter_id", res.data.data[0].book_chapter_id);

          await axios
            .post(`/api/employee/bookChapterUploadFile`, dataArray)
            .then((res) => {
              getJournalData();
              setAlertMessage({
                severity: "success",
                message: "Data updated successfully !!",
              });
              setJournalValues({
                ...initialJournalValues,
              });
              setLoading(false);
            })
            .catch((err) => {
              setLoading(false);
              setAlertMessage({
                severity: "error",
                message: `An error occurred: ${err.response.data}`,
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
          message: `An error occurred: ${err.response.data}`,
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
          Journal Details
        </Typography>
      </Grid>

      {JournalData.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Book Title</StyledTableCell>
                <StyledTableCell>Author</StyledTableCell>
                <StyledTableCell>Published</StyledTableCell>
                <StyledTableCell>Published Year</StyledTableCell>
                <StyledTableCell>ISBN No.</StyledTableCell>
                <StyledTableCell>DOI</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
                {checkAdminAccess() && (
                  <StyledTableCell>Delete</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {JournalData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <StyledTableCell>{obj.book_title}</StyledTableCell>
                    <StyledTableCell>{obj.authore}</StyledTableCell>
                    <StyledTableCell>{obj.publisher}</StyledTableCell>
                    <StyledTableCell>{obj.published_year}</StyledTableCell>
                    <StyledTableCell>{obj.isbn_number}</StyledTableCell>
                    <StyledTableCell>{obj.doi}</StyledTableCell>
                    <StyledTableCell>
                      <VisibilityIcon
                        fontSize="small"
                        color="primary"
                        onClick={() => handleDownload(obj.attachment_path)}
                        sx={{ cursor: "pointer" }}
                      />
                    </StyledTableCell>
                    {checkAdminAccess() && (
                      <StyledTableCell>
                        <DeleteIcon
                          onClick={() => deleteJournal(obj.id)}
                          fontSize="small"
                          color="error"
                          sx={{ cursor: "pointer" }}
                        />
                      </StyledTableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}

      <Grid item xs={12} component={Paper} elevation={3} p={4} marginTop={2}>
        <>
          <Grid container rowSpacing={1.5} columnSpacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="courseTitle"
                label="Book Title"
                value={JournalValues.courseTitle}
                handleChange={handleInputJournalChange}
                checks={journalChecks.courseTitle}
                errors={journalMessages.courseTitle}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="authorName"
                label="Author Name"
                value={JournalValues.authorName}
                handleChange={handleInputJournalChange}
                checks={journalChecks.authorName}
                errors={journalMessages.authorName}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomSelect
                name="publisher"
                label="Publisher"
                value={JournalValues.publisher}
                handleChange={handleInputJournalChange}
                items={[
                  { label: "National", value: "National" },
                  { label: "International", value: "International" },
                ]}
                checks={journalChecks.publisher}
                errors={journalMessages.publisher}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="year"
                label="Published year"
                handleChange={handleInputJournalChange}
                value={JournalValues.year}
                inputProps={{
                  type: "number",
                  min: 0,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="isbnNo"
                label="ISBN No."
                handleChange={handleInputJournalChange}
                value={JournalValues.isbnNo}
                checks={journalChecks.isbnNo}
                errors={journalMessages.isbnNo}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="doi"
                label="DOI"
                handleChange={handleInputJournalChange}
                value={JournalValues.doi}
                checks={journalChecks.doi}
                errors={journalMessages.doi}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="unit"
                label="Unit"
                value={JournalValues.unit}
                handleChange={handleInputJournalChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="journalPdf"
                label="Book Pdf"
                helperText="PDF - smaller than 2 MB"
                file={JournalValues.journalPdf}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={journalChecks.membershipFile}
                errors={journalChecks.membershipFile}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="success"
                onClick={handleCreateJournal}
                disabled={!journalRowsValid}
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
  );
}
export default EmployeeDetailsJournal;
