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
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../services/Api";
import DeleteIcon from "@mui/icons-material/Delete";
import useAlert from "../hooks/useAlert.js";
import CustomModal from "./CustomModal.jsx";
import CustomSelect from "./Inputs/CustomSelect.jsx";
import CustomFileInput from "./Inputs/CustomFileInput.jsx";

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
  "titleOftheProject",
  "fundingAgency",
  "nameOffundingAgency",
  "sanctionAmount",
  "tenure",
  "principalInvestigator",
  "copi",
  "grantPdf",
];

function EmployeeDetailsGrant({ empId }) {
  const initialGrantValues = {
    empId: empId,
    titleOftheProject: "",
    fundingAgency: "",
    nameOffundingAgency: "",
    sanctionAmount: "",
    tenure: "",
    principalInvestigator: "",
    copi: "",
    grantPdf: "",
  };

  const [grantData, setGrantData] = useState([]);
  const [grantValues, setGrantValues] = useState(initialGrantValues);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const grantChecks = {
    titleOftheProject: [grantValues.titleOftheProject !== ""],
    fundingAgency: [grantValues.fundingAgency !== ""],
    nameOffundingAgency: [grantValues.nameOffundingAgency !== ""],
    sanctionAmount: [grantValues.sanctionAmount !== ""],
    tenure: [grantValues.tenure !== ""],
    principalInvestigator: [grantValues.principalInvestigator !== ""],
    copi: [grantValues.copi !== ""],
    grantPdf: [
      grantValues.grantPdf,
      grantValues.grantPdf && grantValues.grantPdf.name.endsWith(".pdf"),
      grantValues.grantPdf && grantValues.grantPdf.size < 2000000,
    ],
  };

  const grantMessages = {
    titleOftheProject: ["This field is required"],
    fundingAgency: ["This field is required"],
    nameOffundingAgency: ["This field is required"],
    sanctionAmount: ["This field is required"],
    tenure: ["This field is required"],
    principalInvestigator: ["This field is required"],
    copi: ["This field is required"],
    grantPdf: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getGrantData();
  }, []);

  const getGrantData = async () => {
    await axios
      .get(`/api/employee/grantsBasedOnEmpId?emp_id=${empId}`)
      .then((res) => {
        setGrantData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const deleteGrant = async (grantId) => {
    const handleToggle = async () => {
      await axios
        .delete(`api/employee/deActivateGrant/${grantId}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Data Deleted successfully !!",
            });
            getGrantData();
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
      .get(`/api/employee/grantFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleInputGrantChange = (e) => {
    setGrantValues((prev) => ({
      ...prev,
      [e.target.name]: (e.target.value),
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setGrantValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setGrantValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const grantRowsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(grantChecks).includes(field)) {
        const ch = grantChecks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![grantChecks]) return false;
    }
    return true;
  };

  const handleCreateConfrences = async () => {
    const temp = {};
    const payload = [];
    temp.active = true;
    temp.emp_id = parseInt(grantValues.empId);
    temp.title = grantValues.titleOftheProject?.replace(/\s+/g, " ");
    temp.funding = grantValues.fundingAgency?.replace(/\s+/g, " ");
    temp.funding_name = grantValues.nameOffundingAgency?.replace(/\s+/g, " ");;
    temp.sanction_amount = grantValues.sanctionAmount?.replace(/\s+/g, " ");
    temp.tenure = grantValues.tenure?.replace(/\s+/g, " ");
    temp.co_pi = grantValues.copi?.replace(/\s+/g, " ");
    temp.pi = grantValues.principalInvestigator?.replace(/\s+/g, " ");

    payload.push(temp);
    setLoading(true);
    await axios
      .post(`/api/employee/savGrant`, payload)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          const dataArray = new FormData();

          dataArray.append("multipartFile", grantValues.grantPdf);
          dataArray.append("grant_id", res.data.data[0].grant_id);

          await axios
            .post(`/api/employee/grantUploadFile`, dataArray)
            .then(() => {
              getGrantData();
              setAlertMessage({
                severity: "success",
                message: "Data updated successfully !!",
              });
              setGrantValues({
                ...initialGrantValues,
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
      {grantData.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title of the project</StyledTableCell>
                <StyledTableCell>Funding Agency</StyledTableCell>
                <StyledTableCell>Name of the funding agency</StyledTableCell>
                <StyledTableCell>Sanction Amount</StyledTableCell>
                <StyledTableCell>Tenure</StyledTableCell>
                <StyledTableCell>Principal Investigator</StyledTableCell>
                <StyledTableCell> Copi</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
                  <StyledTableCell>Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grantData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <StyledTableCell>{obj.title}</StyledTableCell>
                    <StyledTableCell>{obj.funding}</StyledTableCell>
                    <StyledTableCell>{obj.funding_name}</StyledTableCell>
                    <StyledTableCell>{obj.sanction_amount}</StyledTableCell>
                    <StyledTableCell>{obj.tenure}</StyledTableCell>
                    <StyledTableCell>{obj.pi}</StyledTableCell>
                    <StyledTableCell>{obj.co_pi}</StyledTableCell>
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
                          onClick={() => deleteGrant(obj.id)}
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
              <CustomTextField
                name="titleOftheProject"
                label="Title of the project"
                handleChange={handleInputGrantChange}
                value={grantValues.titleOftheProject}
                checks={grantChecks.titleOftheProject}
                errors={grantMessages.titleOftheProject}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomSelect
                name="fundingAgency"
                value={grantValues.fundingAgency}
                label="Funding Agency"
                handleChange={handleInputGrantChange}
                items={[
                  { label: "UNIVERSITY", value: "UNIVERSITY" },
                  { label: "STATE GOV", value: "STATE GOV" },
                  { label: "CENTRAL GOV", value: "CENTRAL GOV" },
                ]}
                checks={grantValues.fundingAgency}
                errors={grantMessages.fundingAgency}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="nameOffundingAgency"
                label="Name of the funding agency"
                handleChange={handleInputGrantChange}
                value={grantValues.nameOffundingAgency}
                checks={grantChecks.nameOffundingAgency}
                errors={grantMessages.nameOffundingAgency}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="sanctionAmount"
                label="Sanction Amount"
                handleChange={handleInputGrantChange}
                value={grantValues.sanctionAmount}
                checks={grantChecks.sanctionAmount}
                errors={grantMessages.sanctionAmount}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="tenure"
                label="Tenure"
                handleChange={handleInputGrantChange}
                value={grantValues.tenure}
                checks={grantChecks.tenure}
                errors={grantMessages.tenure}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="principalInvestigator"
                label="Principal Investigator"
                handleChange={handleInputGrantChange}
                value={grantValues.principalInvestigator}
                checks={grantChecks.principalInvestigator}
                errors={grantMessages.principalInvestigator}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="copi"
                label="CO_PI"
                handleChange={handleInputGrantChange}
                value={grantValues.copi}
                checks={grantChecks.copi}
                errors={grantMessages.copi}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="grantPdf"
                label="Grant PDF"
                helperText="PDF - smaller than 2 MB"
                file={grantValues.grantPdf}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={grantChecks.grantPdf}
                errors={grantMessages.grantPdf}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              color="success"
              onClick={handleCreateConfrences}
              disabled={!grantRowsValid()}
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
export default EmployeeDetailsGrant;
