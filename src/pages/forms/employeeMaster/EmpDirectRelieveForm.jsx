import { useEffect, useRef, useState } from "react";
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
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  empId: null,
  relievingDate: null,
  comments: "",
  document: "",
};

const requiredFields = ["empId", "relievingDate", "comments", "document"];

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

function EmpDirectRelieveForm({
  setAlertMessage,
  setAlertOpen,
  setRelieveModalOpen,
  getData,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [empData, setEmpData] = useState([]);

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

  useEffect(() => {
    getEmployeesOptions();
  }, []);

  const getEmployeesOptions = async () => {
    await axios
      .get(`/api/employee/getAllActiveEmployeeDetailsWithUserId`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.emp_id,
            label: obj.employee_name + " - " + obj.empcode,
          });
        });

        setEmployeeOptions(data);
        setEmpData(res.data.data);
      })
      .catch((err) => console.error(err));
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
    const temp = {};

    temp.active = true;
    temp.emp_id = values.empId;
    temp.comments =
      "<p style='margin-bottom: 15px;'>Dear Sir/Madam,</p><p style='margin-bottom: 8px;'>It is with regret that I tender my resignation as &nbsp;&nbsp;<b>" +
      empData?.designation_name +
      "</b></p><p style='margin-bottom: 15px;text-align:justify'>May I take this opportunity to thank you for all of the invaluable help, advice and encouragement that you have given me during my service in your esteemed organisation. I have thoroughly enjoyed my time here but I feel the moment is now right for me to take up new responsibilities and challenges.</p><p>Yours sincerely</p>";
    temp.nodues_approve_status = 0;
    temp.status = 1;

    setLoading(true);

    //   deactivate user
    await axios
      .delete(`/api/UserAuthentication/${empData.id}`)
      .then((res) => {})
      .catch((err) => console.error(err));

    await axios
      .post(`/api/employee/resignation`, temp)
      .then((res) => {
        if (res.data.success === true) {
          axios
            .delete(`/api/employee/deactivateEmployeeDetails/${values.empId}`)
            .then((resEmp) => {})
            .catch((errEmp) => console.error(errEmp));

          const dataArray = new FormData();
          dataArray.append("rad[" + 0 + "].file", values.document);
          dataArray.append("resignation_id", res.data.data[0].resignation_id);
          dataArray.append("active", true);
          dataArray.append("emp_id", values.empId);

          axios
            .post("/api/employee/uploadFileResignationAttachment", dataArray)
            .then((docuRes) => {})
            .catch((err) => console.error(err));

          setAlertMessage({
            severity: "success",
            message: "Relieved successfully !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setRelieveModalOpen(false);
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box p={2}>
      <Card elevation={4}>
        <CardHeader
          title="Relieve Employee"
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
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="empId"
                label="Employee"
                value={values.empId}
                options={employeeOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomDatePicker
                name="relievingDate"
                label="Relieving Date"
                value={values.relievingDate}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.relievingDate}
                errors={errorMessages.relievingDate}
                disablePast
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Typography variant="body2">
                    Characters Remaining {remainingCharacter.current}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
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
                disabled={loading || !requiredFieldsValid()}
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

export default EmpDirectRelieveForm;
