import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses,
} from "@mui/material";
import dayjs from "dayjs";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import styled from "@emotion/styled";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput")
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function EmpDirectResignationForm({
  values,
  handleChange,
  handleChangeAdvance,
  handleFileDrop,
  handleFileRemove,
  loading,
  requiredFieldsValid,
  checks,
  errorMessages,
  handleCreate,
  handleChangeNodue,
  validateTranscript,
  setEmpData,
}) {
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    getEmployeesOptions();
  }, []);

  const getEmployeesOptions = async () => {
    await axios
      .get(`/api/employee/getEmployeeDetailsData`)
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

  return (
    <Box mt={2} p={2}>
      <Grid container rowSpacing={3} columnSpacing={4}>
        {values.form === "post" ? (
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="empId"
              label="Employee"
              value={values.empId}
              options={employeeOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.empId}
              errors={errorMessages.empId}
              required
            />
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} md={6}>
          <CustomDatePicker
            name="relievingDate"
            label="Relieving Date"
            value={values.relievingDate}
            handleChangeAdvance={handleChangeAdvance}
            checks={checks.relievingDate}
            errors={errorMessages.relievingDate}
            minDate={convertUTCtoTimeZone(dayjs(values.expectedDate))}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextField
            name="reason"
            label="Reason"
            value={values.reason}
            handleChange={handleChange}
            checks={checks.reason}
            errors={errorMessages.reason}
            multiline
            rows={2}
            required
          />
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
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>No Due Department</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {values?.nodue?.map((obj, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{obj.name}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Checkbox
                          name={"submittedStatus-" + obj.id}
                          onChange={handleChangeNodue}
                          sx={{
                            color: "auzColor.main",
                            "&.Mui-checked": {
                              color: "auzColor.main",
                            },
                            padding: 0,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            color="error"
            onClick={handleCreate}
            disabled={
              loading || !requiredFieldsValid() || !validateTranscript()
            }
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <Typography variant="subtitle2">Releive</Typography>
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmpDirectResignationForm;
