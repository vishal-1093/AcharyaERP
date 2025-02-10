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
import axios from "../services/Api";
import DeleteIcon from "@mui/icons-material/Delete";
import useAlert from "../hooks/useAlert.js";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomModal from "./CustomModal.jsx";
import CustomSelect from "./Inputs/CustomSelect.jsx";
import CustomFileInput from "./Inputs/CustomFileInput.jsx";
import CustomRadioButtons from "./Inputs/CustomRadioButtons.jsx";

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
  "nationality",
  "patentTitle",
  "referenceNumber",
  "publicationStatus",
  "patentPdf",
];

function EmployeeDetailsPatent({ empId }) {
  const initialPatentValues = {
    empId: empId,
    nationality: "",
    patentTitle: "",
    referenceNumber: "",
    publicationStatus: "",
    patentPdf: "",
  };

  const [patentData, setPatentData] = useState([]);
  const [patentValues, setPatentValues] = useState(initialPatentValues);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const patentChecks = {
    nationality: [patentValues.nationality !== ""],
    patentTitle: [patentValues.patentTitle !== ""],
    referenceNumber: [patentValues.referenceNumber !== ""],
    publicationStatus: [patentValues.publicationStatus !== ""],
    patentPdf: [
      patentValues.patentPdf,
      patentValues.patentPdf && patentValues.patentPdf.name.endsWith(".pdf"),
      patentValues.patentPdf && patentValues.patentPdf.size < 2000000,
    ],
  };

  const patentMessages = {
    nationality: ["This field is required"],
    patentTitle: ["This field is required"],
    referenceNumber: ["This field is required"],
    publicationStatus: ["This field is required"],
    patentPdf: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getPatentData();
  }, []);

  const getPatentData = async () => {
    await axios
      .get(`/api/employee/patentDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setPatentData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const deletePatent = async (patentId) => {
    const handleToggle = async () => {
      await axios
        .delete(`api/employee/deActivatePatent/${patentId}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Data Deleted successfully !!",
            });
            getPatentData();
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
      .get(`/api/employee/patentFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleInputPatentChange = (e) => {
    setPatentValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setPatentValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setPatentValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const patentRowsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(patentChecks).includes(field)) {
        const ch = patentChecks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![patentChecks]) return false;
    }
    return true;
  };

  const handleCreatePatent = async () => {
    const temp = {};
    const payload = [];
    temp.active = true;
    temp.emp_id = parseInt(patentValues.empId);
    temp.patent_name = patentValues.nationality;
    temp.patent_title = patentValues.patentTitle?.replace(/\s+/g, " ");
    temp.reference_number = patentValues.referenceNumber?.replace(/\s+/g, " ");
    temp.publication_status = patentValues.publicationStatus;

    payload.push(temp);
    setLoading(true);
    await axios
      .post(`/api/employee/savePatent`, payload)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          const dataArray = new FormData();

          dataArray.append("multipartFile", patentValues.patentPdf);
          dataArray.append("patent_id", res.data.data[0].patent_id);

          await axios
            .post(`/api/employee/patentUploadFile`, dataArray)
            .then(() => {
              getPatentData();
              setAlertMessage({
                severity: "success",
                message: "Data updated successfully !!",
              });
              setPatentValues({
                ...initialPatentValues,
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
          Grant Details
        </Typography>
      </Grid>
      {patentData.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>National / International</StyledTableCell>
                <StyledTableCell>Patent Title</StyledTableCell>
                <StyledTableCell>Reference No.</StyledTableCell>
                <StyledTableCell>Publication Status</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
                  <StyledTableCell>Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patentData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <StyledTableCell>{obj.patent_name}</StyledTableCell>
                    <StyledTableCell>{obj.patent_title}</StyledTableCell>
                    <StyledTableCell>{obj.reference_number}</StyledTableCell>
                    <StyledTableCell>{obj.publication_status}</StyledTableCell>
                    <StyledTableCell>
                      <VisibilityIcon
                        fontSize="small"
                        color="primary"
                        onClick={() => handleDownload(obj.attachment_path)}
                        sx={{ cursor: "pointer" }}
                      />
                    </StyledTableCell>
                      <StyledTableCell>
                        <IconButton disabled={!!obj.status}>
                         <DeleteIcon
                          onClick={() => deletePatent(obj.id)}
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
              <CustomRadioButtons
                name="nationality"
                value={patentValues.nationality}
                label=""
                handleChange={handleInputPatentChange}
                items={[
                  { label: "NATIONAL", value: "NATIONAL" },
                  { label: "INTERNATIONAL", value: "INTERNATIONAL" },
                ]}
                checks={patentChecks.publicationStatus}
                errors={patentMessages.publicationStatus}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="patentTitle"
                label="Patent Title"
                handleChange={handleInputPatentChange}
                value={patentValues.patentTitle}
                checks={patentChecks.patentTitle}
                errors={patentMessages.patentTitle}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="referenceNumber"
                label="Reference No."
                handleChange={handleInputPatentChange}
                value={patentValues.referenceNumber}
                checks={patentChecks.referenceNumber}
                errors={patentMessages.referenceNumber}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomSelect
                name="publicationStatus"
                value={patentValues.publicationStatus}
                label="Publication Status"
                handleChange={handleInputPatentChange}
                items={[
                  { label: "PUBLISHED", value: "PUBLISHED" },
                  { label: "FILED", value: "FILED" },
                  { label: "GRANTED", value: "GRANTED" },
                ]}
                checks={patentChecks.publicationStatus}
                errors={patentMessages.publicationStatus}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="patentPdf"
                label="Patent PDF"
                helperText="PDF - smaller than 2 MB"
                file={patentValues.patentPdf}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={patentChecks.patentPdf}
                errors={patentMessages.patentPdf}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              color="success"
              onClick={handleCreatePatent}
              disabled={!patentRowsValid()}
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
export default EmployeeDetailsPatent;
