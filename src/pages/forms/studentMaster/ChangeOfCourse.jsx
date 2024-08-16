import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { useParams } from "react-router-dom";
import StudentDetails from "../../../components/StudentDetails";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  acYearId: "",
};

const requiredFields = ["fileName"];

function ChangeOfCourse() {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { studentId } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Student Master", link: "/StudentDetailsMaster" },
      { name: "Change of course" },
    ]);
    getStudentData();
    getAcYearData();
  }, []);

  const getStudentData = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      response.data.data.forEach((obj) => {
        optionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });
      setAcyearOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "An error occurred while fetching the academic years.",
      });
      setAlertOpen(true);
    }
  };

  const getAcYearData = async () => {
    try {
      const response = await axios.get("/api/academic/acadmic_year");
      const optionData = [];
      response.data.data.forEach((obj) => {
        optionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });
      setAcyearOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "An error occurred while fetching the academic years.",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = async (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <Box sx={{ margin: { md: "20px 60px 10px 60px", xs: "1px 1px 1px 1px" } }}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <StudentDetails id={studentId} />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="acYearId"
            value={values.acYearId}
            label="Ac Year"
            options={acyearOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
            disabled
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChangeOfCourse;
