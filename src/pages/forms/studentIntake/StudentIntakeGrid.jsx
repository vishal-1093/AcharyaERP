import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "8px",
    textAlign: "center",
    borderRadius: 4,
  },
  border: {
    borderRight: "1px solid rgba(0,0,0,0.2)",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
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

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const initialValues = {
  acYearId: null,
  schoolId: null,
  graduationId: null,
};

function StudentIntakeSummary({}) {
  const [values, setValues] = useState(initialValues);
  const [editValues, setEditValues] = useState({
    maximumIntake: "",
    actualIntake: "",
    remarks: "",
  });

  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [graduationOptions, setGraduationOptions] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [admSubCategoryData, setAdmSubCategoryData] = useState([]);
  const [admSubCategoryName, setAdmSubCategoryName] = useState([]);
  const [programSpecializationName, setProgramSpecializationName] =
    useState("");
  const [intakeData, setIntakeData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [intakeAssignmentData, setIntakeAssignmentData] = useState([]);
  const [permitId, setPermitId] = useState();
  const [rowData, setRowData] = useState([]);
  const [intakePermitHistory, setIntakePermitHistory] = useState([]);
  const [validation, setValidation] = useState(false);

  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    if (pathname.toLowerCase() === "/studentintakemaster/summary") {
      setCrumbs([
        { name: "Student Intake", link: "/StudentIntakeMaster/Summary" },
      ]);
    }
    getAcademicYearOptions();
    getSchoolData();
    getGraduationData();
    getIntakeData();
  }, [values.acYearId, values.schoolId, values.graduationId]);

  useEffect(() => {
    handleAdd();
  }, [admSubCategoryData]);

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getGraduationData = async () => {
    await axios
      .get(`/api/employee/graduation`)
      .then((res) => {
        setGraduationOptions(
          res.data.data.map((obj) => ({
            value: obj.graduation_id,
            label: obj.graduation_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getIntakeData = async () => {
    if (values.acYearId && values.schoolId && values.graduationId)
      await axios
        .get(
          `/api/academic/intakeAssignmentDetailsForGridView/${values.acYearId}/${values.schoolId}/${values.graduationId}`
        )
        .then((res) => {
          setSummaryData(res.data.data);
          const arr = [];
          res.data.data.forEach((obj) => {
            arr.push(obj.intake_id);
          });
          axios
            .get(
              `/api/academic/getIntakePermitDetailsForGridView/${arr.toString()}`
            )
            .then((res) => {
              setIntakeData(res.data.data);
              const temp = [];

              Object.values(res.data.data).forEach((obj) => {
                obj.forEach((obj1) => {
                  if (
                    temp.filter(
                      (fil) => fil.id === obj1.fee_admission_category_id
                    ).length === 0
                  ) {
                    temp.push({
                      id: obj1.fee_admission_category_id,
                      name: obj1.fee_admission_category_short_name,
                    });
                    setAdmSubCategoryName(temp);
                  }
                });
              });
            });
        });
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleDetails = async (id) => {
    await axios
      .get(`/api/academic/intakeAssignmentDetails/${id}`)
      .then((res) => {
        const row = [];
        row.push(res.data.data[0]);
        setRowData(row);
        setProgramSpecializationName(
          res.data.data[0].program_specialization_short_name
        );
        setIntakeAssignmentData(res.data.data[0]);
        setEditValues({
          maximumIntake: res.data.data[0].maximum_intake,
          actualIntake: res.data.data[0].actual_intake,
          remarks: res.data.data[0].remarks,
        });
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/academic/getIntakePermitByIntakeId/${id}`)
      .then((res) => {
        const ids = [];
        res.data.data.forEach((obj) => {
          ids.push(obj.id);
        });
        setPermitId(ids);
        const tempData = [];

        for (let i = 0; i < res.data.data.length; i++) {
          tempData.push({
            intakePermit: res.data.data[i].intake_permit,
            subCategory: res.data.data[i].fee_admission_category_short_name,
            intakePermitId: res.data.data[i].id,
            subCategoryId: res.data.data[i].fee_admission_category_id,
            intakeId: res.data.data[i].intake_id,
            active: true,
          });
        }
        setAdmSubCategoryData(tempData);
        setIntakePermitHistory(tempData);
      })
      .catch((err) => console.error(err));

    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditValues((prev) => ({
      ...prev,
      maximumIntake: admSubCategoryData
        .map((obj) => obj.intakePermit)
        .reduce((a, b) => Number(a) + Number(b), 0),
    }));
  };

  const handleSubCategory = (e, index) => {
    setAdmSubCategoryData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleEdit = (e) => {
    setEditValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (editValues.actualIntake > editValues.maximumIntake) {
      setValidation(true);
    } else {
      const temp = {};
      temp.intake_id = intakeAssignmentData.intake_id;
      temp.school_id = intakeAssignmentData.school_id;
      temp.program_id = intakeAssignmentData.program_id;
      temp.program_specialization_id =
        intakeAssignmentData.program_specialization_id;
      temp.program_assignment_id = intakeAssignmentData.program_assignment_id;
      temp.ac_year_id = intakeAssignmentData.ac_year_id;
      temp.maximum_intake = Number(editValues.maximumIntake);
      temp.actual_intake = Number(editValues.actualIntake);
      temp.remarks = editValues.remarks;
      temp.active = true;

      await axios
        .put(
          `/api/academic/intakeAssignment/${intakeAssignmentData.intake_id}`,
          temp
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated",
            });
            window.location.reload();
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

      const tempOneData = [];
      admSubCategoryData.forEach((obj) => {
        tempOneData.push({
          intake_permit_id: obj.intakePermitId,
          intake_permit: obj.intakePermit,
          intake_id: obj.intakeId,
          fee_admission_category_id: obj.subCategoryId,
          active: true,
        });
      });

      await axios
        .put(`/api/academic/intakePermit/${permitId.toString()}`, tempOneData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated",
            });
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

      const tempAssignmentHistory = [];
      rowData.forEach((obj) => {
        tempAssignmentHistory.push({
          intake_id: obj.intake_id,
          school_id: obj.school_id,
          program_id: obj.program_id,
          program_specialization_id: obj.program_specialization_id,
          program_assignment_id: obj.program_assignment_id,
          ac_year_id: obj.ac_year_id,
          maximum_intake: obj.maximum_intake,
          actual_intake: obj.actual_intake,
          remarks: obj.remarks,
          active: true,
        });
      });

      await axios
        .post(`/api/academic/intakeAssignmentHistory`, tempAssignmentHistory)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated",
            });
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

      const tempIntakePermitHistory = [];
      intakePermitHistory.forEach((obj) => {
        tempIntakePermitHistory.push({
          intake_permit_id: obj.intakePermitId,
          intake_id: obj.intakeId,
          fee_admission_category_id: obj.subCategoryId,
          intake_permit: obj.intakePermit,
          active: true,
        });
      });

      await axios
        .post(`/api/academic/intakePermitHistory`, tempIntakePermitHistory)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setModalOpen(false);
            getIntakeData();
            setValidation(false);
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
    }
  };

  return (
    <>
      <Box component="form" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={12}>
              <ModalWrapper
                maxWidth={1000}
                open={modalOpen}
                setOpen={setModalOpen}
              >
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table size="small" className={classes.table}>
                    <TableHead className={classes.bg}>
                      <TableRow>
                        <TableCell sx={{ color: "white", width: 25 }}>
                          Specialization
                        </TableCell>
                        <TableCell sx={{ color: "white", width: 80 }}>
                          Approved Intake
                        </TableCell>
                        {admSubCategoryData.map((obj, i) => {
                          return (
                            <TableCell
                              sx={{ color: "white", width: 80 }}
                              key={i}
                            >
                              {obj.subCategory}
                            </TableCell>
                          );
                        })}
                        <TableCell sx={{ color: "white", width: 80 }}>
                          Maximum Intake
                        </TableCell>
                        <TableCell sx={{ color: "white", width: 80 }}>
                          Remarks
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{programSpecializationName}</TableCell>
                        <TableCell>
                          <CustomTextField
                            name="actualIntake"
                            value={editValues.actualIntake}
                            handleChange={handleEdit}
                            inputProps={{
                              style: {
                                height: "15px",
                              },
                            }}
                          />
                        </TableCell>
                        {admSubCategoryData.map((obj, i) => {
                          return (
                            <TableCell key={i}>
                              <CustomTextField
                                name="intakePermit"
                                value={obj.intakePermit}
                                inputProps={{
                                  style: {
                                    height: "15px",
                                  },
                                }}
                                handleChange={(e) => handleSubCategory(e, i)}
                              />
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <CustomTextField
                            name="maximumIntake"
                            value={editValues.maximumIntake}
                            handleChange={handleEdit}
                            inputProps={{
                              style: {
                                height: "15px",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name="remarks"
                            value={editValues.remarks}
                            handleChange={handleEdit}
                            inputProps={{
                              style: {
                                height: "15px",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Grid item xs={12} md={12} mt={4} align="center">
                  {validation ? (
                    <Typography color="red">
                      Maximum Intake Should be greater than or equal to Approved
                      intake !!
                    </Typography>
                  ) : (
                    <></>
                  )}
                </Grid>
                <Grid item mt={2} xs={12} md={1} onClick={handleSubmit}>
                  <Button variant="contained">SUBMIT</Button>
                </Grid>
              </ModalWrapper>
            </Grid>

            <Grid item xs={12} md={3} textAlign="center">
              <CustomAutocomplete
                name="acYearId"
                label="Academic Year"
                value={values.acYearId}
                options={academicYearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <CustomAutocomplete
                name="graduationId"
                label="Graduation"
                value={values.graduationId}
                options={graduationOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-start">
            {values.acYearId && values.schoolId && values.graduationId ? (
              <>
                <Grid item xs={12} md={12} mt={2}>
                  <TableContainer component={Paper} className={classes.border}>
                    <Table size="small">
                      <TableHead className={classes.bg}>
                        <StyledTableRow>
                          <StyledTableCell>SL.No</StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "left" }}>
                            Branch
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              textAlign: "right",
                            }}
                          >
                            Approved Intake
                          </StyledTableCell>

                          {admSubCategoryName.map((val, i) => {
                            if (val.id !== undefined)
                              return (
                                <StyledTableCell
                                  key={i}
                                  sx={{ textAlign: "right" }}
                                >
                                  {val.name}
                                </StyledTableCell>
                              );
                          })}

                          <StyledTableCell sx={{ textAlign: "right" }}>
                            Maximum Intake
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {summaryData.map((obj, i) => {
                          return (
                            <StyledTableRow key={i}>
                              <StyledTableCell>{i + 1}</StyledTableCell>
                              <StyledTableCell sx={{ textAlign: "left" }}>
                                {obj.program_specialization_name}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ textAlign: "right", cursor: "pointer" }}
                                onClick={() => handleDetails(obj.intake_id)}
                              >
                                {obj.actual_intake}
                              </StyledTableCell>
                              {intakeData?.[obj.intake_id]?.map((val, i) => {
                                return (
                                  <StyledTableCell
                                    key={i}
                                    sx={{
                                      textAlign: "right",
                                      cursor: "pointer",
                                    }}
                                    onClick={
                                      val.intake_permit > 0
                                        ? () => handleDetails(obj.intake_id)
                                        : () => {}
                                    }
                                  >
                                    {val.intake_permit ?? 0}
                                  </StyledTableCell>
                                );
                              })}

                              <StyledTableCell sx={{ textAlign: "right" }}>
                                {obj.maximum_intake}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default StudentIntakeSummary;
