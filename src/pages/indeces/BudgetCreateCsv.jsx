import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  tableCellClasses,
  styled,
} from "@mui/material";
import axios from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import CustomFileInput from "../../components/Inputs/CustomFileInput";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import moment from "moment";

const initialValues = {
  monthAndYear: null,
  department: "",
  employeeName: "",
  designation: "",
  dateofJoining: "",
  email: "",
  institute: "AUZ",
  document: "",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const requiredFields = ["monthAndYear"];

function BudgetCreateCsv() {
  const [values, setValues] = useState(initialValues);
  const [isSubmit, setIsSubmit] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a CSV",
      "Maximum size 2 MB",
    ],
    monthAndYear: ["This field is required"],
  };

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".csv"),
      values.document && values.document.size < 2000000,
    ],
    monthAndYear: [values.monthAndYear !== null],
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

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const month = moment(values?.monthAndYear).format("M");
  const year = moment(values?.monthAndYear).format("YYYY");

  const getCsvData = async () => {
    await axios
      .get(`/api/incrementCreation/getTemporaryIncrementCreationList`)
      .then((res) => {
        setCsvData(res.data.data);
      })
      .catch((err) => console.error(err));
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const dataArray = new FormData();
      dataArray.append("active", true);
      dataArray.append("file", values.document);

      await axios
        .post(
          `/api/incrementCreation/uploadIncrementCreationFile?month=${month}&year=${year}`,
          dataArray
        )
        .then((res) => {
          getCsvData();
          setIsSubmit(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error Occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    await axios
      .post(`/api/incrementCreation/saveIncrementCreationDetailsList`, csvData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Submitted Successfully",
          });
          navigate("/IncrementIndex", { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "Error Occured",
          });
        }
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="flex-start">
        {!isSubmit ? (
          <>
            <Grid item xs={12} md={2} mb={2}>
              <CustomDatePicker
                views={["month", "year"]}
                openTo="month"
                name="monthAndYear"
                label="Month and Year"
                inputFormat="MM/YYYY"
                helperText="mm/yyyy"
                value={values.monthAndYear}
                handleChangeAdvance={handleChangeAdvance}
                minDate={new Date().setMonth(new Date().getMonth() - 1)}
                checks={checks.monthAndYear}
                errors={errorMessages.monthAndYear}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Budget Create CSV"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "auzColor.main",
                    color: "headerWhite.main",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <CustomFileInput
                    name="document"
                    label="Document"
                    file={values.document}
                    helperText="CSV - smaller than 2 MB"
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                  />
                </CardContent>
                <CardActions sx={{ padding: 2 }}>
                  <Grid container justifyContent="flex-end">
                    <Grid item xs={12} md={3} align="right">
                      <Button
                        size="small"
                        href={""}
                        variant="contained"
                        download="Document Format"
                      >
                        Download Format
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={3} align="right">
                      <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={
                          checks.document.includes(false) === true ||
                          values.monthAndYear === null
                        }
                      >
                        Import
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          </>
        ) : (
          <>
            {isSubmit ? (
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                rowSpacing={2}
                marginTop={2}
              >
                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setIsSubmit(false)}
                    style={{ marginRight: "10px", borderRadius: 10 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    style={{ borderRadius: 10 }}
                    onClick={handleUpdate}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={12} md={10} mt={2}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Empcode</StyledTableCell>
                          <StyledTableCell>Emp Name</StyledTableCell>
                          <StyledTableCell>
                            Proposed Designation
                          </StyledTableCell>
                          <StyledTableCell>Proposed Department</StyledTableCell>
                          <StyledTableCell>Proposed Structure</StyledTableCell>
                          <StyledTableCell>Proposed Basic</StyledTableCell>
                          <StyledTableCell>Proposed Gross Pay</StyledTableCell>
                          <StyledTableCell>Proposed CTC</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {csvData?.map((obj, i) => {
                          return (
                            <StyledTableRow key={i}>
                              <TableCell>{obj.empCode}</TableCell>
                              <TableCell>{obj.employeeName}</TableCell>
                              <TableCell>{obj.proposedDesignation}</TableCell>
                              <TableCell>{obj.proposedDepartment}</TableCell>
                              <TableCell>
                                {obj.proposedSalaryStructure}
                              </TableCell>
                              <TableCell>{obj.proposedBasic}</TableCell>
                              <TableCell>{obj.proposedGrosspay}</TableCell>
                              <TableCell>{obj.proposedCtc}</TableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </>
        )}
      </Grid>
    </>
  );
}

export default BudgetCreateCsv;
