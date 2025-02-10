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
import CustomModal from "./CustomModal.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import useAlert from "../hooks/useAlert.js";
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
  "membershipType",
  "society",
  "yearOfJoining",
  "natureOfMembership",
  "membershipId",
  "priority",
  "membershipFile",
  "membershipCitation",
];

function EmployeeDetailsMembership({ empId }) {
  const initialMembershipValues = {
    membershipType: "",
    empId: empId,
    society: "",
    yearOfJoining: "",
    natureOfMembership: "",
    membershipId: "",
    priority: "",
    membershipFile: "",
    membershipCitation: "",
  };
  const [MembershipValues, setMembershipValues] = useState(
    initialMembershipValues
  );
  const [MembershipData, setMembershipData] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const membershipChecks = {
    membershipType: [MembershipValues.membershipType !== ""],
    society: [MembershipValues.society !== ""],
    membershipId: [MembershipValues.membershipId !== ""],
    yearOfJoining: [MembershipValues.yearOfJoining !== ""],
    natureOfMembership: [MembershipValues.natureOfMembership !== ""],
    membershipCitation: [MembershipValues.membershipCitation !== ""],
    membershipFile: [
      MembershipValues.membershipFile,
      MembershipValues.membershipFile &&
        MembershipValues.membershipFile.name.endsWith(".pdf"),
      MembershipValues.membershipFile &&
        MembershipValues.membershipFile.size < 2000000,
    ],
  };

  const membershipMessages = {
    membershipType: ["This field is required"],
    society: ["This field is required"],
    membershipId: ["This field is required"],
    yearOfJoining: ["This field is required"],
    natureOfMembership: ["This field is required"],
    membershipCitation: ["This field is required"],
    membershipFile: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getMembershipData();
  }, []);

  const getMembershipData = async () => {
    await axios
      .get(`/api/employee/membershipDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setMembershipData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const deleteMembership = async (membershipId) => {
    const handleToggle = async () => {
      await axios
        .delete(`api/employee/deActivateMembership/${membershipId}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Data Deleted successfully !!",
            });
            getMembershipData();
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
      .get(`/api/employee/membershipFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleInputMembershipChange = (e) => {
    setMembershipValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setMembershipValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setMembershipValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const membershipRowsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(membershipChecks).includes(field)) {
        const ch = membershipChecks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![membershipChecks]) return false;
    }
    return true;
  };

  const handleCreateMemberships = async () => {
    const temp = {};
    const payload = [];
    temp.active = true;
    temp.emp_id = initialMembershipValues.empId;
    temp.membership_type = MembershipValues.membershipType;
    temp.professional_body = MembershipValues.society?.replace(/\s+/g, " ");
    temp.year = MembershipValues.yearOfJoining?.replace(/\s+/g, " ");
    temp.nature_of_membership = MembershipValues.natureOfMembership?.replace(/\s+/g, " ");
    temp.member_id = MembershipValues.membershipId?.replace(/\s+/g, " ");
    temp.priority = MembershipValues.priority?.replace(/\s+/g, " ");
    temp.citation = MembershipValues.membershipCitation?.replace(/\s+/g, " ");

    payload.push(temp);
    setLoading(true);
    await axios
      .post(`/api/employee/saveMembership`, payload)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          const dataArray = new FormData();
          dataArray.append("multipartFile", MembershipValues.membershipFile);
          dataArray.append("membership_id", res.data.data[0].membership_id);

          await axios
            .post(`/api/employee/membershipUploadFile`, dataArray)
            .then((res) => {
              getMembershipData();
              setAlertMessage({
                severity: "success",
                message: "Data updated successfully !!",
              });
              setMembershipValues({
                ...initialMembershipValues,
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
          Membership Details
        </Typography>
      </Grid>
      {MembershipData.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Membership Type</StyledTableCell>
                <StyledTableCell>Professional Body/Society</StyledTableCell>
                <StyledTableCell>Membership ID</StyledTableCell>
                <StyledTableCell>Membership Citation</StyledTableCell>
                <StyledTableCell> Year of Joining</StyledTableCell>
                <StyledTableCell>Nature of Membership</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
                  <StyledTableCell>Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MembershipData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <StyledTableCell>{obj.membership_type}</StyledTableCell>
                    <StyledTableCell>{obj.professional_body}</StyledTableCell>
                    <StyledTableCell>{obj.member_id}</StyledTableCell>
                    <StyledTableCell>{obj.citation}</StyledTableCell>
                    <StyledTableCell>{obj.year}</StyledTableCell>
                    <StyledTableCell>
                      {obj.nature_of_membership}
                    </StyledTableCell>
                    <StyledTableCell>{obj.priority}</StyledTableCell>
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
                          onClick={() => deleteMembership(obj.id)}
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
      <Grid item xs={12} component={Paper} elevation={3} p={4} marginTop={2}>
        <>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="membershipType"
                label="Membership Type"
                value={MembershipValues.membershipType}
                handleChange={handleInputMembershipChange}
                items={[
                  { label: "Annual", value: "Annual" },
                  { label: "Lifetime", value: "Lifetime" },
                ]}
                checks={membershipChecks.membershipType}
                errors={membershipMessages.membershipType}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="society"
                value={MembershipValues.society}
                handleChange={handleInputMembershipChange}
                label="Professional Body/Society"
                checks={membershipChecks.society}
                errors={membershipMessages.society}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="membershipId"
                value={MembershipValues.membershipId}
                handleChange={handleInputMembershipChange}
                label="Membership ID"
                checks={membershipChecks.membershipId}
                errors={membershipMessages.membershipId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomSelect
                name="membershipCitation"
                label="Membership Citation"
                value={MembershipValues.membershipCitation}
                handleChange={handleInputMembershipChange}
                items={[
                  { label: "ORCHID ID", value: "ORCHID ID" },
                  { label: "SCOPUS ID", value: "SCOPUS ID" },
                  { label: "RESEARCH ID", value: "RESEARCH ID" },
                  { label: "VIDHWAN ID", value: "VIDHWAN ID" },
                  { label: "GOOGLE SCHOLAR", value: "GOOGLE SCHOLAR" },
                  { label: "WEB OF SCIENCE ID", value: "WEB OF SCIENCE ID" },
                ]}
                checks={membershipChecks.membershipCitation}
                errors={membershipMessages.membershipCitation}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="yearOfJoining"
                value={MembershipValues.yearOfJoining}
                label="Year of Joining"
                handleChange={handleInputMembershipChange}
                inputProps={{
                  type: "number",
                  min: 0,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                value={MembershipValues.natureOfMembership}
                name="natureOfMembership"
                handleChange={handleInputMembershipChange}
                label="Nature of Membership"
                checks={membershipChecks.natureOfMembership}
                errors={membershipMessages.natureOfMembership}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                value={MembershipValues.priority}
                name="priority"
                label="priority"
                handleChange={handleInputMembershipChange}
                inputProps={{
                  type: "number",
                  min: 0,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="membershipFile"
                label="PDF"
                helperText="PDF - smaller than 2 MB"
                file={MembershipValues.membershipFile}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={membershipChecks.membershipFile}
                errors={membershipMessages.membershipFile}
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="success"
                onClick={handleCreateMemberships}
                disabled={!membershipRowsValid()}
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
export default EmployeeDetailsMembership;
