import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
const GridIndex = lazy(() => import("../../../components/GridIndex"));

const initialState = {
  studentLists: [],
  schoolList: [],
  programmeSpecializationList: [],
  academicYearList: [],
  academicYearId: null,
  schoolId: null,
  programSpecializationId: null,
  loading: false,
};

function PrintIndex() {
  const [state, setState] = useState([initialState]);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getSchoolData();
    getAcademicYearData();
  }, []);

  const getAcademicYearData = async () => {
    await axios
      .get(`api/academic/academic_year`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          academicYearList: res?.data?.data.map((el) => ({
            ...el,
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
            ...el,
            label: el.school_name,
            value: el.school_id,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProgrammeAndSpecializationData = async (schoolId) => {
    try {
      if (!!schoolId) {
        const res = await axios.get(
          `api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
        );
        if (res?.data?.data?.length) {
          setState((prevState) => ({
            ...prevState,
            programmeSpecializationList: res?.data?.data.map((el) => ({
              ...el,
              label: el.specialization_with_program1,
              value: el.program_specialization_id,
            })),
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { field: "Auid", headerName: "AUID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },

    { field: "program", headerName: "Programme", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "photo", headerName: "Photo", flex: 1 },
    { field: "createdUsername", headerName: "Created By", flex: 1, hide: true },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      type: "date",
    },
  ];

  const handleProgramSpecialization = () => {
    setState((prevState) => ({
      ...prevState,
      programmeSpecializationList: [],
      programSpecializationId: null,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      handleProgramSpecialization();
      getProgrammeAndSpecializationData(newValue);
    }
    setState((prev) => ({ ...prev, [name]: newValue }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const onFilter = async () => {
    setLoading(true);
    try {
      if (
        !!(
          state.schoolId &&
          state.programSpecializationId &&
          state.academicYearId
        )
      ) {
        const res = await axios.get(
          `/api/student/studenDetailsForIdCard?schoolId=${state.schoolId}&programSpecializationId=${state.programSpecializationId}&academicYearId=${state.academicYearId}`
        );
        if (res.status === 200 || res.status === 201) {
          setLoading(false);
        }
      }
    } catch (err) {
      setLoading(false);
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const onClearFilter = () => {
    setState((prevState) => ({
      ...prevState,
      schoolId: null,
      academicYearId: null,
      programSpecializationId: null,
    }));
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1} mt={2}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="academicYearId"
              value={state.academicYearId}
              label="Academic Year"
              handleChangeAdvance={handleChangeAdvance}
              options={state.academicYearList || []}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              value={state.schoolId}
              label="School"
              handleChangeAdvance={handleChangeAdvance}
              options={state.schoolList || []}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpecializationId"
              value={state.programSpecializationId}
              label="Programme And Specialization"
              disabled={!state.schoolId}
              handleChangeAdvance={handleChangeAdvance}
              options={state.programmeSpecializationList || []}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              disableElevation
              disabled={
                !(
                  state.academicYearId &&
                  state.schoolId &&
                  state.programSpecializationId
                )
              }
              onClick={onFilter}
            >
              Filter
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              disableElevation
              disabled={
                !(
                  state.academicYearId &&
                  state.schoolId &&
                  state.programSpecializationId
                )
              }
              onClick={onClearFilter}
            >
              Clear
            </Button>
          </Grid>
          {/* {values.empId ? ( */}
          <Grid item xs={12}>
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" disableElevation disabled={true}>
                View
              </Button>
            </div>
            <GridIndex rows={[]} columns={columns} />
          </Grid>
          {/* ) : (
          <></>
        )} */}
        </Grid>
      </Box>
    </>
  );
}

export default PrintIndex;
