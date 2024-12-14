import { useRef, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";

const initialValues = {
  relievingDate: null,
  comments: "",
  document: "",
};

const requiredFields = ["relievingDate", "comments"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

function EmpRelieveForm({
  rowData,
  noDueData,
  setAlertMessage,
  setAlertOpen,
  setModalOpen,
  getData,
  noDueApproved,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const totalCharacters = 200;
  const remainingCharacter = useRef(200);

  const checks = {
    relievingDate: [values.comments !== null],
    comments: [values.comments !== ""],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    relievingDate: ["This field is required"],
    comments: ["This field is required"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const handleChange = (e) => {
    if (e.target.value.length > totalCharacters) return;

    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    remainingCharacter.current = totalCharacters - e.target.value.length;
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
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
    const resignationData = await axios
      .get(`api/employee/resignation/${rowData.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    const temp = { ...resignationData };
    temp.reason = values.reason;
    temp.relieving_date = moment(values.relievingDate).format("YYYY-MM-DD");
    temp.status = 1;

    const dataArray = new FormData();
    dataArray.append("rad[" + 0 + "].file", values.document);
    dataArray.append("resignation_id", resignationData.resignation_id);
    dataArray.append("active", true);
    dataArray.append("emp_id", resignationData.emp_id);

    setLoading(true);

    await axios
      .delete(`/api/employee/resignationAttachment/${rowData.id}`)
      .then((res) => res.data.success)
      .catch((err) => console.error(err));

    await axios
      .post("/api/employee/uploadFileResignationAttachment", dataArray)
      .then((docuRes) => {})
      .catch((err) => console.error(err));

    //   deactivate user
    await axios
      .delete(`/api/UserAuthentication/${rowData.user_id}`)
      .then((res) => {})
      .catch((err) => console.error(err));

    await axios
      .put(`/api/employee/resignation/${rowData.id}`, temp)
      .then((res) => {
        if (res.data.success === true) {
          axios
            .delete(
              `/api/employee/deactivateEmployeeDetails/${resignationData.emp_id}`
            )
            .then((resEmp) => {})
            .catch((errEmp) => console.error(errEmp));

          setAlertMessage({
            severity: "success",
            message: "Relieved successfully !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setModalOpen(false);
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box p={2}>
      <Card elevation={4}>
        <CardHeader
          title={rowData.employee_name + " ( " + rowData.empcode + " )"}
          titleTypographyProps={{ variant: "subtitle2" }}
          sx={{
            backgroundColor: "primary.main",
            color: "headerWhite.main",
            textAlign: "center",
            padding: 1,
          }}
        />
        <CardContent sx={{ padding: 3 }}>
          <Grid container rowSpacing={4} columnSpacing={4}>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="relievingDate"
                label="Relieving Date"
                value={values.relievingDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.relievingDate}
                errors={errorMessages.relievingDate}
                // minDate={moment(rowData.requested_relieving_date)}
                // disableFuture
                required
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container>
                <Grid item xs={12}>
                  <CustomTextField
                    name="comments"
                    label="Comments"
                    value={values.comments}
                    handleChange={handleChange}
                    checks={checks.comments}
                    errors={errorMessages.comments}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Typography variant="body2">
                    Characters Remaining {remainingCharacter.current}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TableContainer elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Sl No</StyledTableCell>
                      <StyledTableCell>Department</StyledTableCell>
                      <StyledTableCell>HOD</StyledTableCell>
                      <StyledTableCell>No Due Date</StyledTableCell>
                      <StyledTableCell>IP Address</StyledTableCell>
                      <StyledTableCell>Comments</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {noDueData?.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <StyledTableCellBody>{i + 1}</StyledTableCellBody>
                          <StyledTableCellBody>
                            {obj.dept_name_short}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {obj.noDueApproverName}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {obj.approver_date
                              ? moment(obj.approver_date).format(
                                  "DD-MM-YYYY LT"
                                )
                              : "Pending"}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {obj.ip_address}
                          </StyledTableCellBody>
                          <StyledTableCellBody
                            sx={{ textAlign: "justify !important" }}
                          >
                            {obj.noDueComments}
                          </StyledTableCellBody>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="document"
                label="Document"
                helperText="PDF - smaller than 2 MB"
                file={values.document}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.document}
                errors={errorMessages.document}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="error"
                onClick={handleCreate}
                disabled={loading || !requiredFieldsValid() || !noDueApproved}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Relieve"
                )}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmpRelieveForm;
