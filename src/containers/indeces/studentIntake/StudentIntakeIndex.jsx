import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TableCell,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import Add from "@mui/icons-material/Add";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    background: theme.palette.primary.main,
  },
  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}));

const initialValues = {
  acYearId: null,
  categoryIds: [],
  maximumIntake: "",
  actualIntake: "",
  remarks: "",
  country: null,
  people: [],
};

function StudentIntakeIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [programSpeName, setProgramSpeName] = useState();
  const [admSubCategoryData, setAdmSubCategoryData] = useState([]);
  const [intakePermitHistory, setIntakePermitHistory] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [permitId, setPermitId] = useState([]);
  const [intakeAssignmentData, setIntakeAssignmentData] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [modalCopyDetailsOpen, setModalCopyDetailsOpen] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [validation, setValidation] = useState(false);
  const [rowCopyData, setRowCopyData] = useState([]);
  const [acYear, setAcYear] = useState([]);
  const [admCategoryData, setAdmCategoryData] = useState([]);
  const [alert, setAlert] = useState("");

  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [permitHistory, setPermitHistory] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "ac_year", headerName: "AC Year", flex: 1 },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
    },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "maximum_intake",
      headerName: "Maximum Intake",
      flex: 1,
    },
    {
      field: "actual_intake",
      headerName: "Actual Intake",
      flex: 1,
    },
    {
      field: "update",
      headerName: "Update",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleDetails(params)}>
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "history",
      type: "actions",
      flex: 1,
      headerName: "History",
      getActions: (params) => [
        <IconButton onClick={() => handleHistory(params)} color="primary">
          <HistoryIcon />
        </IconButton>,
      ],
    },
    {
      field: "copy",
      type: "actions",
      flex: 1,
      headerName: "COPY",
      getActions: (params) => [
        <IconButton onClick={() => handleCopyDetails(params)} color="primary">
          <ContentCopyOutlinedIcon />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllIntakeAssignment?page=0&page_size=100&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
    getAcYearData();
    handleAdd();
    handleValidation();
  }, [admSubCategoryData]);

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        axios
          .delete(`/api/academic/intakeAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/academic/activateIntakeAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleValidation = () => {
    // Check if values and programData are defined
    if (!values || !admSubCategoryData) {
      console.error("Program data is not available.");
      return false; // or handle accordingly
    }

    let validationFailed = false; // Flag to track if any validation fails

    for (const program of admSubCategoryData) {
      const actual = Number(values.actualIntake);
      const sum = admSubCategoryData
        .filter((category) => !category.overandabove)
        .reduce((total, category) => total + Number(category.intakePermit), 0);

      if (sum > actual) {
        setAlert(
          "Sum of intake cannot exceed approved if category status over & above is no."
        );

        validationFailed = true; // Set the flag if validation fails
        break; // Exit early if you find any failure
      } else {
        setAlert("");
      }
    }

    return validationFailed; // Return the validation result
  };

  const handleConcat = async (newValue) => {
    const subIds = [];

    admSubCategoryData.forEach((obj) => {
      subIds.push(obj.subCategoryId);
    });
    const concat = [...admSubCategoryData];
    admCategoryData.forEach((obj) => {
      if (
        newValue.includes(obj.subCategoryId) &&
        !subIds.includes(obj.subCategoryId)
      ) {
        concat.push(obj);
      } else if (
        !newValue.includes(obj.subCategoryId) &&
        subIds.includes(obj.subCategoryId)
      ) {
        const index = concat.findIndex(
          (item) => item.subCategoryId === obj.subCategoryId
        );
        if (index !== -1) {
          concat.splice(index, 1);
        }
      }
    });
    setAdmSubCategoryData(concat);
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "categoryIds") {
      handleConcat(newValue);
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAdd = () => {
    setValues((prev) => ({
      ...prev,
      maximumIntake: admSubCategoryData
        .map((obj) => obj.intakePermit)
        .reduce((a, b) => Number(a) + Number(b), 0),
    }));
  };

  const handleHistory = async (params) => {
    setHistoryOpen(true);
    await axios
      .get(`/api/academic/intakeAssignmentHistoryDetails/${params.row.id}`)
      .then((res) => {
        const temp = [];
        res.data.data.map((val) => {
          temp.push(val.intake_history_id);
        });
        axios
          .get(`/api/academic/getIntakePermitHistoryDetails/${temp.toString()}`)
          .then((res) => {
            const tempOne = [];
            temp.map((val) => {
              res.data.data.filter((val1) =>
                val1.intake_permit_id === val ? tempOne.push(val1) : ""
              );
            });
          })
          .catch((err) => console.error(err));
        setAssignmentHistory(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleCopyDetails = async (params) => {
    setAcYear(params.row.current_year);
    setIntakeAssignmentData(params.row);

    await axios
      .get(`/api/academic/intakeAssignment/${params.row.id}`)
      .then((res) => {
        setRowCopyData(res.data.data);
        setProgramSpeName(params.row.program_specialization_short_name);
        setValues({
          maximumIntake: res.data.data.maximum_intake,
          actualIntake: res.data.data.actual_intake,
          acYearId: res.data.data.ac_year_id,
          remarks: res.data.data.remarks,
        });
      })
      .catch((err) => console.error(err));
    await axios
      .get(`/api/academic/getIntakePermitByIntakeId/${params.row.id}`)
      .then((res) => {
        const ids = [];
        res.data.data.map((obj) => {
          ids.push(obj.id);
        });
        setPermitId(ids);

        const sortedCategories = res.data.data.sort((a, b) => {
          return a.year_sem === b.year_sem ? 0 : a.year_sem ? 1 : -1;
        });

        const tempData = [];
        for (let i = 0; i < sortedCategories.length; i++) {
          tempData.push({
            intakePermit: res.data.data[i].intake_permit,
            subCategory: res.data.data[i].fee_admission_category_short_name,
            intakePermitId: res.data.data[i].id,
            subCategoryId: res.data.data[i].fee_admission_category_id,
            intakeId: res.data.data[i].intake_id,
            active: true,
            overandabove: res.data.data[i].year_sem,
          });
        }
        setIntakePermitHistory(tempData);
        setAdmSubCategoryData(tempData);
      })
      .catch((err) => console.error(err));
    setModalCopyDetailsOpen(true);
  };

  const handleDetails = async (params) => {
    setIntakeAssignmentData(params.row);
    const row = [];
    row.push(params.row);
    setRowData(row);

    await axios
      .get(
        `/api/academic/intakeNotAssignedfeeAdmissionCategory/${params.row.ac_year_id}/${params.row.school_id}/${params.row.program_specialization_id}`
      )
      .then((res) => {
        setAdmCategoryData(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_short_name,
            active: true,
            intakePermit: 0,
            intakePermitId: null,
            subCategory: obj.fee_admission_category_short_name,
            subCategoryId: obj.fee_admission_category_id,
          }))
        );
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/academic/intakeAssignment/${params.row.id}`)
      .then((res) => {
        setProgramSpeName(params.row.program_specialization_short_name);
        setValues((prev) => ({
          ...prev,
          acYearIds: [],
          maximumIntake: res.data.data.maximum_intake,
          actualIntake: res.data.data.actual_intake,
          remarks: res.data.data.remarks,
        }));
      })
      .catch((err) => console.error(err));
    await axios
      .get(`/api/academic/getIntakePermitByIntakeId/${params.row.id}`)
      .then((res) => {
        const ids = [];
        res.data.data.map((obj) => {
          ids.push(obj.id);
        });

        setPermitId(ids);

        const sortedCategories = res.data.data.sort((a, b) => {
          return a.year_sem === b.year_sem ? 0 : a.year_sem ? 1 : -1;
        });

        const tempData = [];
        for (let i = 0; i < sortedCategories.length; i++) {
          tempData.push({
            intakePermit: res.data.data[i].intake_permit,
            subCategory: res.data.data[i].fee_admission_category_short_name,
            intakePermitId: res.data.data[i].id,
            subCategoryId: res.data.data[i].fee_admission_category_id,
            intakeId: res.data.data[i].intake_id,
            active: true,
            overandabove: res.data.data[i].year_sem,
          });
        }
        setIntakePermitHistory(tempData);
        setAdmSubCategoryData(tempData);
      })
      .catch((err) => console.error(err));
    setModalDetailsOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubCategory = (e, index) => {
    setAdmSubCategoryData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const getAcYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const test = res.data.data.filter((val) => {
          return val.current_year > acYear;
        });

        setAcademicYearOptions(
          test.map((obj) => ({
            label: obj.ac_year,
            value: obj.ac_year_id,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = async () => {
    const postData = [];

    admSubCategoryData.map((obj) => {
      if (obj.intakePermitId === null)
        postData.push({
          ac_year_id: intakeAssignmentData.ac_year_id,
          fee_admission_category_id: obj.subCategoryId,
          program_assignment_id: intakeAssignmentData.program_assignment_id,
          intake_permit_id: obj.intakePermitId,
          intake_permit: obj.intakePermit,
          intake_id: intakeAssignmentData.id,
          fee_admission_category_id: obj.subCategoryId,
          active: true,
        });
    });

    if (postData.length > 0) {
      await axios
        .post(`/api/academic/copiedIntakePermitDetails`, postData)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Updated",
          });
          setAlertOpen(true);
        })
        .catch((error) => {
          setAlertMessage({
            severity: "success",
            message: error,
          });
          setAlertOpen(true);
        });
    }

    const temp = {};
    temp.intake_id = intakeAssignmentData.id;
    temp.school_id = intakeAssignmentData.school_id;
    temp.program_id = intakeAssignmentData.program_id;
    temp.program_specialization_id =
      intakeAssignmentData.program_specialization_id;
    temp.program_assignment_id = intakeAssignmentData.program_assignment_id;
    temp.ac_year_id = intakeAssignmentData.ac_year_id;
    temp.maximum_intake = Number(values.maximumIntake);
    temp.actual_intake = Number(values.actualIntake);
    temp.remarks = values.remarks;
    temp.active = true;

    await axios
      .put(`/api/academic/intakeAssignment/${intakeAssignmentData.id}`, temp)
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

    const tempOneData = [];

    admSubCategoryData.map((obj) => {
      if (obj.intakePermit)
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
    rowData.map((obj) => {
      tempAssignmentHistory.push({
        intake_id: obj.id,
        school_id: obj.school_id,
        program_id: obj.program_id,
        program_assignment_id: obj.program_assignment_id,
        program_specialization_id: obj.program_specialization_id,
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
          const tempIntakePermitHistory = [];
          intakePermitHistory.map((obj) => {
            tempIntakePermitHistory.push({
              intake_permit_id: obj.intakePermitId,
              intake_id: obj.intakeId,
              fee_admission_category_id: obj.subCategoryId,
              intake_permit: obj.intakePermit,
              intake_history_id: res.data.data[0].intake_history_id,
              active: true,
            });
          });

          axios
            .post(`/api/academic/intakePermitHistory`, tempIntakePermitHistory)
            .then((res) => {
              if (res.status === 200 || res.status === 201) {
                setModalDetailsOpen(false);
              }
              setAlertOpen(true);
              getData();
            })
            .catch((error) => {
              setAlertMessage({
                severity: "error",
                message: error.response ? error.response.data.message : "Error",
              });
              setAlertOpen(true);
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
  };

  const handleSubmitCopy = async () => {
    // if (values.actualIntake > values.maximumIntake) {
    //   setValidation(true);
    // } else {
    const tempCopiedIntake = {};
    tempCopiedIntake.ac_year_id = values.acYearId;
    tempCopiedIntake.active = true;
    tempCopiedIntake.actual_intake = values.actualIntake;
    tempCopiedIntake.maximum_intake = values.maximumIntake;
    tempCopiedIntake.program_id = rowCopyData.program_id;
    tempCopiedIntake.program_specialization_id =
      rowCopyData.program_specialization_id;
    tempCopiedIntake.school_id = rowCopyData.school_id;
    tempCopiedIntake.remarks = rowCopyData.remarks;
    tempCopiedIntake.program_assignment_id = rowCopyData.program_assignment_id;

    await axios
      .post(`/api/academic/copiedIntakeAssignment`, tempCopiedIntake)
      .then((res) => {
        const tempOneData = [];

        admSubCategoryData.map((obj) => {
          tempOneData.push({
            intake_permit: obj.intakePermit,
            intake_id: res.data.data.intake_id,
            fee_admission_category_id: obj.subCategoryId,
            active: true,
          });
        });

        if (res.status === 200 || res.status === 201) {
          axios
            .post(`/api/academic/copiedIntakePermitDetails`, tempOneData)
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
              setValidation(false);
              setAlertOpen(true);
              window.location.reload();
            })
            .catch((error) => {
              setAlertMessage({
                severity: "error",
                message: error.response ? error.response.data.message : "Error",
              });
              setAlertOpen(true);
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
    // }
  };

  return (
    <>
      <ModalWrapper
        open={modalCopyDetailsOpen}
        setOpen={setModalCopyDetailsOpen}
      >
        <Grid
          container
          justifycontents="flex-start"
          rowSpacing={2}
          columnSpacing={4}
        >
          <Grid item xs={12} md={2.5}>
            <CustomAutocomplete
              name="acYearId"
              label="Ac Year"
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              value={values.acYearId}
              required
            />
          </Grid>

          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead className={classes.bg}>
                  <TableRow>
                    <TableCell sx={{ color: "white", width: 80 }}>
                      Specialization
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 80 }}>
                      Approved Intake
                    </TableCell>
                    {admSubCategoryData.map((obj, i) => {
                      return (
                        <TableCell sx={{ color: "white", width: 40 }} key={i}>
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
                    <TableCell>{programSpeName}</TableCell>
                    <TableCell>
                      <CustomTextField
                        name="actualIntake"
                        value={values.actualIntake}
                        handleChange={handleChange}
                      />
                    </TableCell>
                    {admSubCategoryData.map((obj, i) => {
                      return (
                        <TableCell key={i}>
                          <CustomTextField
                            name="intakePermit"
                            value={obj.intakePermit}
                            handleChange={(e) => handleSubCategory(e, i)}
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <CustomTextField
                        name="maximumIntake"
                        value={values.maximumIntake}
                        handleChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name="remarks"
                        value={values.remarks}
                        handleChange={handleChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} md={12} mt={4} align="center">
              {alert !== "" && (
                <Typography color="red" variant="subtitle2">
                  {alert}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={handleSubmitCopy}
              disabled={alert !== ""}
            >
              COPY
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper open={modalDetailsOpen} setOpen={setModalDetailsOpen}>
        <Grid container justifycontents="flex-start" rowSpacing={2}>
          <Grid item xs={12} md={2.5}>
            <CustomMultipleAutocomplete
              name="categoryIds"
              label="Add Category"
              options={admCategoryData}
              handleChangeAdvance={handleChangeAdvance}
              value={values.categoryIds}
              required
            />
          </Grid>
          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead className={classes.bg}>
                  <TableRow>
                    <TableCell sx={{ color: "white", width: 80 }}>
                      Specialization
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 80 }}>
                      Approved Intake
                    </TableCell>
                    {admSubCategoryData.map((obj, i) => {
                      return (
                        <TableCell sx={{ color: "white", width: 40 }} key={i}>
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
                    <TableCell>{programSpeName}</TableCell>
                    <TableCell>
                      <CustomTextField
                        name="actualIntake"
                        value={values.actualIntake}
                        handleChange={handleChange}
                      />
                    </TableCell>
                    {admSubCategoryData.map((obj, i) => {
                      return (
                        <TableCell key={i}>
                          <CustomTextField
                            name="intakePermit"
                            value={obj.intakePermit}
                            handleChange={(e) => handleSubCategory(e, i)}
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <CustomTextField
                        name="maximumIntake"
                        value={values.maximumIntake}
                        handleChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        name="remarks"
                        value={values.remarks}
                        handleChange={handleChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} md={12} mt={4} align="center">
              {alert !== "" && (
                <Typography color="red" variant="subtitle2">
                  {alert}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={handleSubmit}
              disabled={alert !== ""}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper title="History" open={historyOpen} setOpen={setHistoryOpen}>
        <Grid container justifycontents="flex-start" rowSpacing={2}>
          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead className={classes.bg}>
                  <TableRow>
                    <TableCell sx={{ color: "white", width: 100 }}>
                      Ac Year
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 100 }}>
                      School
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 100 }}>
                      Specialization
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 100 }}>
                      Approved Intake
                    </TableCell>
                    {permitHistory.length > 0
                      ? permitHistory.map((val, i) => {
                          return (
                            <TableCell
                              sx={{ color: "white", width: 100 }}
                              key={i}
                            >
                              {val.fee_admission_sub_category_short_name}
                            </TableCell>
                          );
                        })
                      : ""}
                    <TableCell sx={{ color: "white", width: 100 }}>
                      Maximum Intake
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 100 }}>
                      Remarks
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 100 }}>
                      Created By
                    </TableCell>
                    <TableCell sx={{ color: "white", width: 100 }}>
                      Created Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignmentHistory.map((obj, i) => {
                    return (
                      <>
                        <TableRow key={i}>
                          <TableCell>{obj.ac_year}</TableCell>
                          <TableCell>{obj.school_name_short}</TableCell>
                          <TableCell>
                            {obj.program_specialization_short_name}
                          </TableCell>
                          <TableCell>{obj.actual_intake}</TableCell>
                          {permitHistory.length > 0
                            ? permitHistory.map((val, j) => {
                                return (
                                  <TableCell key={i}>
                                    {val.intake_permit}
                                  </TableCell>
                                );
                              })
                            : ""}
                          <TableCell>{obj.maximum_intake}</TableCell>
                          <TableCell>{obj.remarks}</TableCell>
                          <TableCell>{obj.created_username}</TableCell>
                          <TableCell>
                            {obj.created_date
                              ? moment(obj.created_date).format("DD-MM-YYYY")
                              : ""}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>

      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/StudentIntakeSelection")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default StudentIntakeIndex;
