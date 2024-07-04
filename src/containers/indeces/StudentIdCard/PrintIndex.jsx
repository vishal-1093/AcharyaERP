import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
const GridIndex = lazy(() => import("../../../components/GridIndex"));

const initialState = {
  studentLists: [],
  option: [],
  academicYear: null,
  school: null,
  programmeAndSpecialization: null,
  validTill: "",
};

function PrintIndex() {
  const [state, setState] = useState([initialState]);

  const options = [
    { id: 1, value: "test1", label: "testlabel1" },
    { id: 2, value: "test2", label: "testlabel2" },
    { id: 3, value: "test3", label: "testlabel3" },
    { id: 4, value: "test4", label: "testlabel4" },
    { id: 5, value: "test5", label: "testlabel5" },
  ];

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      option: options,
    }));
  }, []);

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

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleDatePicker = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Grid
          container
          justifycontents="flex-start"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="academicYear"
              value={state.academicYear}
              label="Academic Year"
              handleChangeAdvance={handleChangeAdvance}
              options={options}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="school"
              value={state.school}
              label="School"
              handleChangeAdvance={handleChangeAdvance}
              options={options}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programmeAndSpecialization"
              value={state.programmeAndSpecialization}
              label="Programme And Specialization"
              handleChangeAdvance={handleChangeAdvance}
              options={options}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="validTill"
              label="Valid Till"
              value={state.validTill}
              handleChangeAdvance={handleDatePicker}
              required
            />
          </Grid>
          {/* {values.empId ? ( */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              disableElevation
              // sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
            >
              View
            </Button>
            {/* <GridIndex rows={state.studentLists} columns={columns} /> */}
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
