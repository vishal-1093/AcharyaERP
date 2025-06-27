import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import axios from "../../services/Api.js";
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const logos = require.context("../../assets", true);

const style = makeStyles((theme) => ({
  main: {
    height: "230px",
    boxShadow:
      "0px 8px 8px 0px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  loaderCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

const initialState = {
  schoolId: null,
  schoolList: [],
  deptId: null,
  deptList: [],
  empList: [],
  loading: false
};

const EmployeeReport = () => {
  const [{ schoolId, schoolList, deptId, deptList, empList, loading }, setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const boxStyle = style();

  useEffect(() => {
    setCrumbs([]);
    getSchoolData();
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    (name == "schoolId") && getDeptData(newValue);
    (name == "deptId") && getEmpData(newValue);
    setState((prev) => ({ ...prev, [name]: newValue }))
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res.data.data.map((ele) => ({ value: ele.school_id, label: ele.school_name }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getDeptData = async (schoolId) => {
    try {
      const res = await axios.get(`/api/fetchdept1/${schoolId}`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          deptList: res.data.data.map((ele) => ({ value: ele.dept_id, label: ele.dept_name }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getEmpData = async (deptValueId) => {
    try {
      setLoading(true);
      const res = await axios.get(`api/employee/getEmployeeAttachmentWithDetails?school_id=${schoolId}&dept_id=${deptValueId}`);
      if (res.status == 200 || res.status == 201) {
        console.log("res========", res)
        setLoading(false)
        setState((prevState) => ({
          ...prevState,
          empList: res.data.data
        }))
      }
    } catch (error) {
      setLoading(false)
    }
  };

  const getCapsName = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  };

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="schoolId"
            value={schoolId}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
            required
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="deptId"
            value={deptId}
            label="Department"
            handleChangeAdvance={handleChangeAdvance}
            options={deptList || []}
            disabled={!schoolId}
            required
          />
        </Grid>
      </Grid>
      {!loading ? <Box mt={1} mb={2}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 3 }}>
          {empList.map((employee, index) => (<Grid item xs={12} md={2} key={index}>
            <Box className={boxStyle.main}>
              {employee?.webphoto ? (
                <img
                  src={employee?.webphoto}
                  alt={`${employee.employee_name} photo`}
                  style={{ width: "100%", height: (employee.employee_name.length > 24 || employee.designation_name.length > 24) ? "160px" : "180px" }}
                />
              ) : (employee.gender == "M" && !employee?.webphoto ? <img
                src={`${logos(`./maleplaceholderimage.jpeg`)}`}
                alt={`${employee.employee_name} photo`}
                style={{ width: "100%", height: (employee.employee_name.length > 24 || employee.designation_name.length > 24) ? "160px" : "180px" }}
              /> : (employee.gender == "F" && !employee?.webphoto ? <img
                src={`${logos(`./femalePlaceholderImage.jpg`)}`}
                alt={`${employee.employee_name} photo`}
                style={{ width: "100%", height: (employee.employee_name.length > 24 || employee.designation_name.length > 24) ? "160px" : "180px" }}
              /> : <></>))}
              <Typography sx={{ textAlign: "center", fontWeight: '500' }}>{employee.phdStatus === "holder" ? `Dr. ${getCapsName(employee.employee_name)}` : getCapsName(employee.employee_name)}</Typography>
              <Typography sx={{ textAlign: "center" }}>{employee.designation_name}</Typography>
            </Box>
          </Grid>
          ))}
        </Grid>
      </Box>
        :
        <Box className={boxStyle.loaderCenter} sx={{ marginTop: { xs: 10, md: 30 } }}>
          <CircularProgress
            size={40}
            color="primary"
            style={{ margin: "2px 13px" }}
          />
        </Box>}
    </Box>
  );
};

export default EmployeeReport;
