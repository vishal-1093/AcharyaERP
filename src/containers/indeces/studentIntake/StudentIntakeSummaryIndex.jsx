import { useState, useEffect } from "react";
import { Box, Grid, Button, IconButton, Typography } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import GridIndex from "../../../components/GridIndex";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";

function StudentIntakeSummaryIndex() {
  const [values, setValues] = useState({ acYearId: 2 });
  const [academicYearOptions, setAcademicYearOptions] = useState([]);

  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  const columns = [
    {
      field: "fee_admission_sub_category_short_name",
      headerName: "Sub Category",
      flex: 1,
    },
    {
      field: "intake_permit",
      headerName: "Intake",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              {params.row.intake_permit}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "admitted",
      headerName: "Admitted",
      flex: 1,
      valueGetter: (params) => (params.row.admitted ? params.row.admitted : 0),
    },
    {
      field: "vacant",
      headerName: "Vacant",
      flex: 1,
      valueGetter: (params) => (params.row.vacant ? params.row.vacant : 0),
    },
  ];

  useEffect(() => {
    getData();
    getAcademicYearData();
  }, [values.acYearId]);

  const getAcademicYearData = async () => {
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

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getData = async () => {
    if (values.acYearId)
      await axios
        .get(
          `/api/academic/intakeAssignmentAndPermitDetails/${values.acYearId}`
        )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="acYearId"
                label="Academic Year"
                value={values.acYearId}
                options={academicYearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <GridIndex
                components={{
                  Toolbar: false,
                }}
                rows={rows}
                columns={columns}
              />
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default StudentIntakeSummaryIndex;
