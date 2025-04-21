import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import axios from "../../services/Api";
import { makeStyles } from "@mui/styles";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const logos = require.context("../../assets", true);

const style = makeStyles((theme) => ({
  main: {
    height: "230px",
    boxShadow:
      "0px 8px 8px 0px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  gap: {
    display: "flex",
    gap: "40px"
  },
  flexEnd: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
  },
}));

const initialState = {
  employeeList: [],
  loading: false,
  schoolId: null,
  deptId: null,
  schoolList: [],
  deptList: []
};

function PhotoIdCard() {
  const [{ employeeList, loading, schoolId, deptId, schoolList, deptList }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const boxStyle = style();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([{ name: "ID Card", link: '/IdCardPrint' }, { name: "Photo" }]);
    getSchoolData();
  }, []);

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
          deptList: res.data.data.map((ele) => ({ value: ele.dept_id, label: ele.dept_name_short }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      getDeptData(newValue);
    };
    setState((prev) => ({ ...prev, [name]: newValue }));
  };

  const getAllEmpPhoto = async () => {
    try {
      const res = await axios.get(`/api/employee/getEmployeeDetailsForIdCardWoHistory?deptId=${deptId}&schoolId=${schoolId}`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data;
        if (list.length > 0) {
          getImageUrl(list)
        } else {
          setAlertMessage({
            severity: "error",
            message:
              "No employee found !!",
          });
          setAlertOpen(true);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const getImageUrl = async (employees) => {
    const employeeData = [];
    const notFoundEmployeeData = [];
    employees.forEach(async (employee) => {
      setLoading(true);
      await axios.get(`/api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${employee?.emp_image_attachment_path}`, { responseType: "blob" }).then((res) => {
        const obj = {
          name: employee?.employee_name,
          desig: employee?.designation_short_name,
          gender: employee?.gender,
          phdStatus:employee.phd_status,
          imageUrl: URL.createObjectURL(res.data)
        };
        employeeData.push(obj);
      }).catch((error) => {
        const obj = {
          name: employee?.employee_name,
          desig: employee?.designation_short_name,
          gender: employee?.gender,
          phdStatus:employee.phd_status,
          imageUrl: null
        };
        notFoundEmployeeData.push(obj);
      })
      setState((prevState) => ({
        ...prevState,
        employeeList: [...employeeData, ...notFoundEmployeeData]
      }));
      setLoading(false)
    })
  };

  const getCapsName = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={{ xs: 1, md: 0 }} columnSpacing={{ xs: 3 }} sx={{ marginTop: { xs: 2, md: -5 } }} className={boxStyle.flexEnd}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              value={schoolId}
              label="School"
              handleChangeAdvance={handleChangeAdvance}
              options={schoolList || []}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="deptId"
              value={deptId}
              label="Department"
              disabled={!schoolId}
              options={deptList || []}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              disableElevation
              disabled={!(schoolId && deptId) || loading}
              onClick={getAllEmpPhoto}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {!loading ? <Box mt={1} mb={2}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 3 }}>
          {employeeList.map((employee, index) => (<Grid item xs={12} md={2} key={index}>
            <Box className={boxStyle.main}>
              {employee?.imageUrl ? (
                <img
                  src={employee?.imageUrl}
                  alt={`${employee.employee_name} photo`}
                  style={{ width: "100%", height: (employee.name.length > 24 || employee.desig.length > 24) ? "160px" : "180px" }}
                />
              ) : (employee.gender == "M" && !employee?.imageUrl ? <img
                src={`${logos(`./maleplaceholderimage.jpeg`)}`}
                alt={`${employee.employee_name} photo`}
                style={{ width: "100%", height: (employee.name.length > 26 || employee.desig.length > 24) ? "160px" : "180px" }}
              /> : (employee.gender == "F" && !employee?.imageUrl ? <img
                src={`${logos(`./femalePlaceholderImage.jpg`)}`}
                alt={`${employee.employee_name} photo`}
                style={{ width: "100%", height: (employee.name.length > 26 || employee.desig.length > 24) ? "160px" : "180px" }}
              /> : <></>))}
              <Typography sx={{ textAlign: "center", fontWeight: '500' }}>{employee.phdStatus === "holder" ? `Dr. ${getCapsName(employee.name)}`: getCapsName(employee.name)}</Typography>
              <Typography sx={{ textAlign: "center" }}>{employee.desig}</Typography>
            </Box>
          </Grid>
          ))}
        </Grid>
      </Box>
        :
        <Box className={boxStyle.flex} sx={{ marginTop: { xs: 10, md: 30 } }}>
          <CircularProgress
            size={40}
            color="primary"
            style={{ margin: "2px 13px" }}
          />
        </Box>
      }
    </>
  );
}

export default PhotoIdCard;