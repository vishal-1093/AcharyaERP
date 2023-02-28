import { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  fromYearId: "",
  toYearId: "",
  schoolId: "",
};

const requiredFields = ["fromYearId", "toYearId", "schoolId"];

function LeavePatternCopy() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [employementTypeOptions, setEmployementTypeOptions] = useState([]);
  const [JobTypes, setJobTypes] = useState([]);
  const [leavePatternData, setLeavePatternData] = useState([]);
  const [filteredLeave, setFilteredLeave] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    await axios(
      `/api/fetchLeavePatternByYear/${values.fromYearId}/${values.schoolId}`
    )
      .then((res) => {
        setLeavePatternData(res.data.data);

        const temp = [];

        res.data.data.map((obj) => {
          if (
            temp.filter((fil) => fil.leave_id === obj.leave_id).length === 0
          ) {
            temp.push({ leave_id: obj.leave_id, leaveType: obj.leave_type });
          }
        });
        setFilteredLeave(temp);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getEmployementTypeOptions();
    getJobTypes();
    getLeaveTypeOptions();
    getAcademicYearOptions();
    getSchoolNameOptions();
    getData();
  }, [values.fromYearId, values.toYearId, values.schoolId]);

  const getEmployementTypeOptions = async () => {
    await axios
      .get(`/api/employee/EmployeeType`)
      .then((res) => {
        setEmployementTypeOptions(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getJobTypes = async () => {
    await axios
      .get(`/api/employee/JobType`)
      .then((res) => {
        setJobTypes(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getLeaveTypeOptions = async () => {
    await axios
      .get(`/api/LeaveType`)
      .then((res) => {})
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "toYearId") {
      if (newValue <= values.fromYearId) {
        setAlertMessage({
          severity: "error",
          message:
            "From Year and To Year cannot be same ,To Year greater than From Year",
        });
        setAlertOpen(true);
      }
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/CalenderYear`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.calender_year.toString(),
            label: obj.calender_year.toString(),
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const checks = {};
  const errorMessages = {};

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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      await axios
        .post(
          `/api/copyLeavePattern/${values.fromYearId}/${values.toYearId}/${values.schoolId}`
        )
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/LeavePatternMaster/LeavePatterns", { replace: true });
          setAlertOpen(true);
          window.location.reload();
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="fromYearId"
              label="From Year"
              options={academicYearOptions}
              value={values.fromYearId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="toYearId"
              label="To Year"
              options={academicYearOptions}
              value={values.toYearId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="Institute"
              options={SchoolNameOptions}
              value={values.schoolId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              <strong>{"Copy"}</strong>
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <Divider></Divider>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ alignItems: "center", justifyContent: "flex-start" }}
          >
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
                backgroundColor: "rgba(74, 87, 169, 0.1)",
              }}
            >
              {leavePatternData.map((obj, i) => {
                if (i === 0) {
                  const value = obj.school_name;
                  const result = value.toUpperCase();
                  return (
                    <Typography sx={{ fontSize: 30 }}>{result}</Typography>
                  );
                }
              })}
            </Grid>
            <Box>
              <TableContainer
                sx={{
                  padding: "5px 5px",
                  border: 1,
                  fontSize: "1.1rem",
                  borderColor: "grey.300",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "grey.300",
                        }}
                      ></TableCell>
                      {employementTypeOptions.map((obj, i) => {
                        return (
                          <TableCell
                            key={i}
                            colSpan={JobTypes.length}
                            sx={{
                              borderRight: 1,
                              borderColor: "grey.300",
                              textAlign: "center",
                            }}
                          >
                            {obj.empType}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ borderRight: 1, borderColor: "lightgray" }}
                      >
                        Leaves
                      </TableCell>
                      {employementTypeOptions.map((obj, i) => {
                        return (
                          <>
                            {JobTypes.map((obj, i) => {
                              return (
                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    borderRight: 1,
                                    borderColor: "grey.300",
                                  }}
                                  key={i}
                                >
                                  {obj.job_type}
                                </TableCell>
                              );
                            })}
                          </>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLeave.map((obj) => {
                      return (
                        <TableRow>
                          <TableCell
                            sx={{
                              typography: "subtitle2",
                            }}
                          >
                            {obj.leaveType}
                          </TableCell>
                          {employementTypeOptions.map((obj1, i) => {
                            return (
                              <>
                                {JobTypes.map((obj2, i) => {
                                  const leaves = leavePatternData.filter(
                                    (fil) =>
                                      fil.leave_id === parseInt(obj.leave_id) &&
                                      fil.emp_type_id ===
                                        parseInt(obj1.empTypeId) &&
                                      fil.job_type_id ===
                                        parseInt(obj2.job_type_id)
                                  );

                                  return (
                                    <TableCell
                                      onClick={() => {
                                        navigate(
                                          "/LeavePatternMaster/LeavePatterns/Update/1"
                                        );
                                      }}
                                      key={i}
                                      sx={{
                                        backgroundColor: "white",
                                        textAlign: "center",
                                        borderRight: 1,
                                        borderColor: "grey.300",
                                      }}
                                    >
                                      {leaves.length > 0
                                        ? leaves[0].leave_days_permit
                                        : 0}
                                    </TableCell>
                                  );
                                })}
                              </>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default LeavePatternCopy;
