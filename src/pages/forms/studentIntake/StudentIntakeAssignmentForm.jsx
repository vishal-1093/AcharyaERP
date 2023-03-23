import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "../../../services/Api";
import { Button, Grid, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";

const useStyles = makeStyles((theme) => ({
  tableHead: {
    background: theme.palette.primary.main,
  },
  bg: {
    borderRadius: 2,
    background: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "10px",
  },
  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}));

const requiredFields = [];

function StudentIntakeAssignmentForm({ data, programAssigmentId, programId }) {
  const [values, setValues] = useState([]);
  const [admSubCategory, setAdmSubCategory] = useState([]);
  const [programSpecialization, setProgramSpecialization] = useState([]);
  const [status, setStatus] = useState();

  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getProgramSpecialization();
  }, []);

  useEffect(() => {
    statusCheck();
  }, [values]);

  const checks = {};
  const errorMessages = {};

  const getProgramSpecialization = async () => {
    if (data.acYearId && data.schoolId && programId) {
      const subCategory = await axios
        .get(`/api/student/FeeAdmissionSubCategory`)
        .then((res) => {
          const temp = [];
          res.data.data.filter((obj) => {
            data.admSubCategoryId.map((val) => {
              if (obj.fee_admission_sub_category_id === val) {
                temp.push(obj);
              }
            });
          });
          setAdmSubCategory(
            temp.map((obj) => ({
              value: obj.fee_admission_sub_category_id,
              label: obj.fee_admission_sub_category_short_name,
            }))
          );

          return temp;
        })
        .catch((err) => console.error(err));

      const test = await axios
        .get(
          `/api/academic/intakeAssignmentProgramSpecializationDetails/${data.acYearId}/${data.schoolId}/${programId}`
        )
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => console.error(err));

      await axios
        .get(
          `/api/academic/FetchProgramSpecialization/${data.schoolId}/${programId}`
        )
        .then((res) => {
          const temp = [];
          const subCategoryTemp = [];

          subCategory.forEach((obj) => {
            subCategoryTemp.push({
              id: obj.fee_admission_sub_category_id,
              value: "0",
            });
          });

          const tempOne = [];
          res.data.data.forEach((obj) => {
            if (test.includes(obj.program_specialization_id) === false) {
              tempOne.push(obj);
              temp.push({
                programId: obj.program_id,
                programSpeId: obj.program_specialization_id,
                actualIntake: 0,
                maximumIntake: 0,
                remarks: "",
                subAdmissionCategory: subCategoryTemp,
              });
            }
          });

          setValues((prev) => ({
            ...prev,
            ["programData"]: temp,
          }));

          setProgramSpecialization(tempOne);
        })
        .catch((err) => console.error(err));
    }
  };

  if (values.programData !== undefined) {
    values.programData.map((obj, i) => {
      checks["actualIntake" + i] = [
        /[0-9]/.test(values.programData[i]["actualIntake"]),
      ];
      errorMessages["actualIntake" + i] = ["Enter Only Numbers"];
      if (obj.subAdmissionCategory !== undefined)
        obj.subAdmissionCategory.map((obj1, j) => {
          checks["subCategory" + i + j] = [
            /[0-9]/.test(
              values["programData"][i]["subAdmissionCategory"][j].value
            ),
          ];
          errorMessages["subCategory" + i + j] = ["Enter Only Numbers"];
        });
    });
  }

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");
    if (splitName[0] === "subCategoryId") {
      setValues((prev) => ({
        ...prev,
        programData: prev.programData.map((obj, i) => {
          const updated = obj["subAdmissionCategory"].map((obj1, j) => {
            if (i === parseInt(splitName[1]) && j === parseInt(splitName[2]))
              return { ...obj1, ["value"]: e.target.value };
            return obj1;
          });
          return {
            ...obj,
            ["subAdmissionCategory"]: updated,
          };
        }),
      }));
    } else {
      const splitName = e.target.name.split("-");
      const keyName = splitName[0];
      setValues((prev) => ({
        ...prev,
        programData: prev.programData.map((obj, i) => {
          if (i === parseInt(splitName[1]))
            return { ...obj, [keyName]: e.target.value };
          return obj;
        }),
      }));
    }
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

  const statusCheck = () => {
    if (values.programData !== undefined) {
      const checkStatus = [];
      values.programData.map((obj, i) => {
        if (
          values.programData[i]["actualIntake"] >
          values.programData[i]["subAdmissionCategory"]
            .map((obj) => obj.value)
            .reduce((a, b) => {
              const x = Number(a) > 0 ? Number(a) : 0;
              const y = Number(b) > 0 ? Number(b) : 0;
              return x + y;
            })
        ) {
          checkStatus.push("false");
          setStatus(checkStatus);
        } else if (
          values.programData[i]["actualIntake"] <=
          values.programData[i]["subAdmissionCategory"]
            .map((obj) => obj.value)
            .reduce((a, b) => {
              const x = Number(a) > 0 ? Number(a) : 0;
              const y = Number(b) > 0 ? Number(b) : 0;
              return x + y;
            })
        ) {
          checkStatus.push("true");
          setStatus(checkStatus);
        }
      });
    }
  };

  const handleSubmit = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      const tempOne = [];
      const tempTwo = [];

      values.programData.map((obj, i) => {
        const c = obj.subAdmissionCategory
          .map((obj1) => obj1.value)
          .reduce((a, b) => {
            const x = Number(a) > 0 ? Number(a) : 0;
            const y = Number(b) > 0 ? Number(b) : 0;
            return x + y;
          });
        if (c > 0) {
          const b = obj.subAdmissionCategory.reduce(
            (obj1, item) => Object.assign(obj1, { [item.id]: item.value }),
            {}
          );
          tempOne.push(b);
          tempTwo.push({
            ac_year_id: data.acYearId,
            school_id: data.schoolId,
            active: true,
            actual_intake: obj.actualIntake,
            maximum_intake:
              values.programData.length > 0
                ? values.programData[i]["subAdmissionCategory"]
                    .map((obj) => obj.value)
                    .reduce((a, b) => {
                      const x = Number(a) > 0 ? Number(a) : 0;
                      const y = Number(b) > 0 ? Number(b) : 0;
                      return x + y;
                    })
                    .toString()
                : "",
            program_id: obj.programId,
            program_specialization_id: obj.programSpeId,
            program_assignment_id: programAssigmentId,
            remarks: obj.remarks,
          });
        }
      });

      temp.active = true;
      temp.fee_admission_sub_category_id = tempOne;
      temp.intake_assignment = tempTwo;

      if (status.includes("false")) {
        setAlertMessage({
          severity: "error",
          message:
            "Maximum intake should be greater than or equal to actual intake",
        });
        setAlertOpen(true);
      } else {
        await axios
          .post(`/api/academic/intakeAssignment`, temp)
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              navigate("/StudentIntakeMaster/Studentintake", { replace: true });
              setAlertMessage({
                severity: "success",
                message: "Successfully Created",
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
      }
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
        rowSpacing={2}
        columnSpacing={2}
      >
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.bg}>
            Intake Assignment
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid rgba(0,0,0,0.2)" }}
          >
            <Table className={classes.table}>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell sx={{ color: "white", width: 100 }}>
                    Branch
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", textAlign: "center", width: 80 }}
                  >
                    Approved Intake
                  </TableCell>
                  {admSubCategory.map((val, i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{ color: "white", textAlign: "center", width: 80 }}
                      >
                        {val.label}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    sx={{ color: "white", textAlign: "center", width: 100 }}
                  >
                    Maximum Intake
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", textAlign: "center", width: 100 }}
                  >
                    Remarks
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programSpecialization.map((val, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {val.program_specialization_short_name}
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name={"actualIntake" + "-" + i}
                        value={values.programData[i].actualIntake}
                        handleChange={(e) => handleChange(e, i)}
                        checks={checks["actualIntake" + i]}
                        errors={errorMessages["actualIntake" + i]}
                      />
                    </TableCell>
                    {admSubCategory.map((obj, j) => {
                      return (
                        <TableCell key={j}>
                          <CustomTextField
                            name={
                              "subCategoryId" +
                              "-" +
                              i +
                              "-" +
                              j +
                              "-" +
                              obj.value
                            }
                            value={
                              values["programData"][i]["subAdmissionCategory"][
                                j
                              ].value
                            }
                            handleChange={handleChange}
                            checks={checks["subCategory" + i + j]}
                            errors={errorMessages["subCategory" + i + j]}
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <CustomTextField
                        name={"maximumIntake" + "-" + i}
                        value={
                          values.programData.length > 0
                            ? values.programData[i]["subAdmissionCategory"]
                                .map((obj) => obj.value)
                                .reduce((a, b) => {
                                  const x = Number(a) > 0 ? Number(a) : 0;
                                  const y = Number(b) > 0 ? Number(b) : 0;
                                  return x + y;
                                })
                            : 0
                        }
                        handleChange={(e) => handleChange(e, i)}
                        checks={checks["maximumIntake" + i]}
                        errors={errorMessages["maximumIntake" + i]}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name={"remarks" + "-" + i}
                        value={values.programData[i].remarks}
                        handleChange={(e) => handleChange(e, i)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid item xs={12} mt={2} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              <strong>Submit</strong>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
export default StudentIntakeAssignmentForm;
