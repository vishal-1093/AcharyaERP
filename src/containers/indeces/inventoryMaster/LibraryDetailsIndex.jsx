import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Grid, Button, Box, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../../components/ModalWrapper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initialValues = {
  schoolId: null,
  specializationId: null,
  yearsemId: null,
  renewalPeriod: null,
  totalRenewals: "",
  totalCheckouts: "",
  finePerDay: "",
  dueDate: "",
  issuedStatus: false,
};

function LibraryDetailsIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [openWrapper, setOpenWrapper] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programType, setProgramType] = useState("Sem");
  const [programAssigmentId, setProgramAssignmentId] = useState([]);
  const [dataOne, setDataOne] = useState([]);
  const [assigmentId, setAssignmentId] = useState(null);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "item_serial_no", headerName: "Sl.No", flex: 1 },
    { field: "item_names", headerName: "Item Name", flex: 1 },
    { field: "title_of_book", headerName: "Title", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
    { field: "isbn_code", headerName: "ISBN Code", flex: 1 },
    { field: "measure_name", headerName: "Units", flex: 1 },
    {
      field: "yr_of_Publish",
      headerName: "Year of publish",
      flex: 1,
      hide: true,
    },
    {
      field: "edition",
      headerName: "Edition",
      flex: 1,
      hide: true,
    },
    {
      field: "available_books",
      headerName: "Count of books",
      flex: 1,
      hide: true,
    },
    { field: "opening_balance", headerName: "OB", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        row?.created_date
          ? moment(row?.created_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "modified_date",
      headerName: "Update OB",
      renderCell: (params) => {
        return (
          <IconButton label="OB" onClick={() => handleOpeningBalance(params)}>
            <AddCircleOutlineIcon />
          </IconButton>
        );
      },
    },

    {
      field: "specialization",
      headerName: "Assign",
      renderCell: (params) => {
        return (
          <IconButton label="OB" onClick={() => handleAssignOpen(params)}>
            <AddCircleOutlineIcon />
          </IconButton>
        );
      },
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/InventoryMaster/Assignment/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
    getSchoolData();
  }, []);

  useEffect(() => {
    getProgramSpeData();
    getSpecialization();
  }, [values.schoolId]);

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/fetchOnlyLibraryBooksEnvItemsStores?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleOpeningBalance = async (params) => {
    setOpenWrapper(true);
    await axios
      .get(`/api/inventory/envItemsStores/${params.row.id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => console.error(error));
  };

  const handleAssignOpen = async (params) => {
    setAssignOpen(true);
    setDataOne(params.row);
    setValues([]);

    await axios
      .get(
        `/api/libraryInv/getLibraryAssigmentByLibraryId?libraryId=${params.row.id}`
      )
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          schoolId: res.data.data?.instituteId,
          finePerDay: res.data.data?.finePerDay,
          renewalPeriod: res.data.data?.renewalPeriod,
          yearsemId: res.data.data?.currentSem,
          totalRenewals: res.data.data?.totalRenewals,
          specializationId: res.data.data?.programSpecailizationId,
          dueDate: res.data.data?.dueDate,
          issuedStatus: res.data.data?.isIssueAvailable,
        }));
        setAssignmentId(res.data.data?.libraryAssigmentId);
      })
      .catch((err) => console.error(err));
  };

  const getSpecialization = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === values.specializationId) {
              yearsem.push(obj);
              setProgramAssignmentId(obj.program_assignment_id);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });
          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const handleOb = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "specializationId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === newValue) {
              yearsem.push(obj);
              setProgramAssignmentId(obj.program_assignment_id);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });
          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
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

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateOb = async () => {
    await axios
      .put(`/api/inventory/envItemsStores/${data.item_id}`, data)
      .then((res) => {
        if (res.status === 200) {
          getData();
          setOpenWrapper(false);
        }
      })
      .catch((error) => console.error(error));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setSpecializationOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleAssign = async () => {
    const temp = {};
    temp.libraryId = dataOne.id;
    temp.currentSem = values.yearsemId;
    temp.programSpecailizationId = values.specializationId;
    temp.instituteId = values.schoolId;
    temp.renewalPeriod =
      moment(values.renewalPeriod).format("YYYY-MM-DD") + "T00:00:00Z";
    temp.totalRenewals = values.totalRenewals;
    temp.createdBy = dataOne.created_by;
    temp.finePerDay = parseInt(values.finePerDay);
    temp.dueDate = values.dueDate;
    temp.isIssueAvailable = JSON.parse(values.issuedStatus);

    await axios
      .post(`/api/libraryInv/libraryAssigment`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Assigned Successfully",
          });
          setAlertOpen(true);
          setAssignOpen(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  const handleUpdate = async () => {
    const temp = {};
    temp.libraryId = dataOne.id;
    temp.currentSem = values.yearsemId;
    temp.programSpecailizationId = values.specializationId;
    temp.instituteId = values.schoolId;
    temp.renewalPeriod =
      moment(values.renewalPeriod).format("YYYY-MM-DD") + "T00:00:00Z";
    temp.totalRenewals = values.totalRenewals;
    temp.createdBy = dataOne.created_by;
    temp.finePerDay = parseInt(values.finePerDay);
    temp.dueDate = values.dueDate;
    temp.isIssueAvailable = JSON.parse(values.issuedStatus);

    await axios
      .put(
        `/api/libraryInv/updateLibraryAssigment?libraryAssigmentId=${assigmentId}`,
        temp
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Assigned Successfully",
          });
          setAlertOpen(true);
          setAssignOpen(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  return (
    <>
      <ModalWrapper
        open={assignOpen}
        title="Library Assignment"
        maxWidth={800}
        setOpen={setAssignOpen}
      >
        <Box component="form">
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="specializationId"
                label="Specialization"
                value={values.specializationId}
                options={specializationOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="yearsemId"
                label="Year/Sem"
                value={values.yearsemId}
                options={yearSemOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={4} mt={2}>
              <CustomDatePicker
                name="renewalPeriod"
                label="Invoice Date*"
                value={values.renewalPeriod ? values.renewalPeriod : null}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                label="Fine (per day)"
                name="finePerDay"
                handleChange={handleChange}
                value={values.finePerDay}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                label="Total Renewal Count"
                name="totalRenewals"
                handleChange={handleChange}
                value={values.totalRenewals}
              />
            </Grid>

            <Grid item xs={12} md={4} mt={2}>
              <CustomTextField
                name="dueDate"
                label="Due Date Period(In Days)"
                handleChange={handleChange}
                value={values.dueDate}
              />
            </Grid>

            <Grid item xs={12} md={4} mt={2}>
              <CustomRadioButtons
                name="issuedStatus"
                label="Issue Status"
                value={values.issuedStatus ?? null}
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                handleChange={handleChange}
                required
              />
            </Grid>

            <Grid item textAlign="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={
                  assigmentId === undefined ? handleAssign : handleUpdate
                }
              >
                Assign
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <ModalWrapper
        open={openWrapper}
        title=""
        maxWidth={500}
        setOpen={setOpenWrapper}
      >
        <Box component="form">
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12}>
              <Typography variant="subtitle2">Update OB</Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="Quantity"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                name="opening_balance"
                handleChange={handleOb}
                value={data.opening_balance}
              />
            </Grid>

            <Grid item textAlign="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={updateOb}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default LibraryDetailsIndex;
