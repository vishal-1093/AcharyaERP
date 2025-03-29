import { useState, useEffect, lazy } from "react";
import { Box, Button, IconButton, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const initialState = {
  acYearId: "",
  schoolId: "",
  programSpecializationId: "",
  programAndProgramSpecializationId: "",
  academicYearList: [],
  programList: [],
  programId: "",
  schoolList: [],
  programmeSpecializationList: [],
  loading: false,
  yearSem: "",
  yearSemList: []
};

function ClassCommencementIndex() {
  const [rows, setRows] = useState([]);
  const [{ acYearId, schoolId, programSpecializationId, programAndProgramSpecializationId, programList, programId, academicYearList, schoolList, programmeSpecializationList, loading, yearSem, yearSemList }, setState] = useState([initialState]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const columns = [
    { field: "commencement_type", headerName: "Commencement", flex: 2.5 },
    { field: "ac_year", headerName: "AC Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 0.5 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "year_sem",
      headerName: "Year/Sem",
      flex: 1,
    },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      valueGetter: (value, row) => convertToDMY(row.from_date),
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.to_date
          ? convertToDMY(row.to_date)
          : convertToDMY(row.from_date),
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
     // type: "date",
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
        disabled={!params.row.active}
          onClick={() =>
            navigate(`/CalendarAcademic/Commencement/Update/${params.row.id}`)
          }
        >
          <EditIcon color={params.row.active ? "primary":"secondary"}/>
        </IconButton>,
      ],
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
  useEffect(() => {
    setCrumbs([{}]);
    getData();
    getAcademicYearData();
    getSchoolData();
  }, []);

  const getAcademicYearData = async () => {
    await axios
      .get(`api/academic/academic_year`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          academicYearList: res?.data?.data.map((el) => ({
            label: el.ac_year,
            value: el.ac_year_id,
          })),
        }));
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`api/institute/school`);
      if (res?.data?.data?.length) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res?.data?.data.map((el) => ({
            label: el.school_name_short,
            value: el.school_id,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProgramData = async (schoolId) => {
    try {
      if (schoolId) {
        const res = await axios.get(
          `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
        );
        if (res?.data?.data?.length) {
          setState((prevState) => ({
            ...prevState,
            programmeSpecializationList: res?.data?.data.map((el) => ({
              label: el.specialization_with_program,
              value: el.program_specialization_id,
              numberOfSem: el.number_of_semester,
              numberOfYear: el.number_of_years,
              programTypeName: el.program_type_name,
              programId: el.program_assignment_id,
              programSpecializationId: el.program_specialization_id
            })),
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      handleProgram();
      getProgramData(newValue);
    } else if (name == "programAndProgramSpecializationId") {
      getYearSem(newValue)
    }
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getYearSem = (id) => {
    const programDetails = programmeSpecializationList.find((ele) => ele.value == id);
    let { programTypeName, numberOfSem, numberOfYear, programSpecializationId, programId } = programDetails;
    if (programTypeName == "SEMESTER") {
      const yearSemLists = Array.from(
        { length: numberOfSem },
        (_, i) => ({
          label: `Sem ${i + 1}`,
          value: Number(`${i + 1}`)
        })
      );
      setState((prevState) => ({
        ...prevState,
        yearSemList: yearSemLists,
        programId: programId,
        programSpecializationId: programSpecializationId
      }));
    } else {
      const yearSemLists = Array.from(
        { length: numberOfYear },
        (_, i) => ({
          label: `Year ${i + 1}`,
          value: Number(`${i + 1}`)
        })
      );
      setState((prevState) => ({
        ...prevState,
        yearSemList: yearSemLists,
        programId: programId,
        programSpecializationId: programSpecializationId
      }));
    }
  };

  const handleProgram = () => {
    setState((prevState) => ({
      ...prevState,
      programmeSpecializationList: [],
      programSpecializationId: [],
    }));
  };

  const handleFilter = () => {
    let formValue = {
      "acYearId": acYearId || "",
      "schoolId": schoolId || "",
      "programSpecializationId": programSpecializationId || "",
      "programId": programId || "",
      "yearSem": yearSem || ""
    };
    getData(formValue)
  }

  const getData = async (value) => {
    let params = {};
    if (value) {
      params = `page=${0}&page_size=${1000000}&sort=created_date&ac_year_id=${value.acYearId}&school_id=${value.schoolId}&program_assignment_id=${value.programId}&program_specialization_id=${value.programSpecializationId}&year_sem=${value.yearSem}`
    } else {
      params = `page=${0}&page_size=${1000000}&sort=created_date`
    }
    await axios
      .get(
        `/api/academic/fetchAllClassCommencementDetails?${params}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/deactivateClassCommencementDetails/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateclassCommencementDetails/${id}`)
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
        title: "Deactivate",
        message: "Do you want to make it Inactive?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      });
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={acYearId}
              options={academicYearList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={schoolId}
              options={schoolList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programAndProgramSpecializationId"
              label="Program Specialization"
              value={programAndProgramSpecializationId}
              options={programmeSpecializationList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="yearSem"
              label="Year/Sem"
              value={yearSem}
              options={yearSemList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              onClick={handleFilter}
              variant="contained"
              disableElevation
            >
              Filter
            </Button>
          </Grid>
          <Grid item xs={12} md={2} align="right">
            <Button
              onClick={() => navigate("/CalendarAcademic/commencement/New")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default ClassCommencementIndex;