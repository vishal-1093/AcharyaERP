import { useState, useEffect } from "react";
import {
  Box, Grid, Typography, Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  styled
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import FormWrapper from "../../components/FormWrapper";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import axios from "../../services/Api.js";
const logos = require.context("../../assets", true);

const style = makeStyles((theme) => ({
  main: {
    borderRadius: "25px",
    backgroundColor: "#f6f6ff"
  },
  logoBox: {
    height: "90px",
    width: "90px",
    borderRadius: "50%",
    background: "#e0e0e0"
  },
  schoolBox: {
    width: "70%",
    height: "50px",
    marginTop: "8px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: "20px"
  },
  empImage: {
    height: "91px",
    width: "91px",
    borderRadius: "50%",
    background: "#e0e0e0",
  },
  empDetailBox: {
    padding: "25px",
    borderRadius: "12px"
  },
  loaderCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "#000000",
    border: "1px solid rgb(203, 202, 202)",
  },
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgb(203, 202, 202)",
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
}));

const initialState = {
  employeeData: null,
  employee: null,
  schoolName: null,
  educationRows: [],
  loading: false
};

const educationHeader = [
  { label: "Course Title" },
  { label: "Year" },
  { label: "Institution" },
  { label: "Duration" }
];

const journalHeader = [
  { label: "Journal Name" },
  { label: "Date" },
  { label: "Volume" },
  { label: "Issue No" },
  { label: "Paper Title" },
  { label: "Type" }
];

const conferenceHeader = [
  { label: "Conference Name" },
  { label: "State" },
  { label: "City" },
  { label: "Date" },
  { label: "Organizer" },
  { label: "Type" }
];

const awardsHeader = [
  { label: "Nature" },
  { label: "Year" },
  { label: "Awarding Organization" }
];

const EmployeeReport = () => {
  const [{ employeeData, employee, schoolName, educationRows, loading }, setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const boxStyle = style();
  const location = useLocation();

  useEffect(() => {
    setCrumbs([{ name: "Employee Report", link: "/employee-report" }]);
    getSchoolData(location.state.schoolId);
    getEmpData(location.state.empDetails);
    (location.state) && setState((prevState) => ({
      ...prevState,
      employee: location.state.empDetails
    }))
  }, [location.state]);

  const getSchoolData = async (schoolValueId) => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          schoolName: res.data.data.find((ele) => ele.school_id == schoolValueId)?.school_name
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getEmpData = async (empDetail) => {
    try {
      const res = await axios.get(`/api/employee/getEmployeeDetailsForWebSite?emp_id=${empDetail?.emp_id}`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          employeeData: res.data.data
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getCapsName = (str) => {
    return str?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  };

  const maskEmail = (email) => {
    const firstTwoChar = email?.slice(0, 2);
    const lastTwoChar = email?.slice(-2);
    const masked = '*'.repeat(email?.length - 4);
    return (`${firstTwoChar}${masked}${lastTwoChar}`)
  };

  return (
    <Box mb={2}>
      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Grid item xs={12} md={9} sx={{ marginTop: { xs: 4, md: 0 } }}>
          <Paper
            sx={{
              p: 1,
              mb: 3,
              backgroundColor: "#f6f6ff",
              borderRadius: 3,
            }}
          >
            <Grid container>
              <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
                <Box className={boxStyle.logoBox}>
                  <img src={`${logos(`./logo1.png`)}`} alt="logo" width="90" height="90" />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ boxShadow: 1 }} className={boxStyle.schoolBox}>
                  <Typography variant="subtitle2">{schoolName ? schoolName : ""}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" } }}>
                <Box className={boxStyle.empImage}>
                  <img src={employee?.webphoto} alt={`${employee?.employee_name} photo`} width="90" height="90" style={{ borderRadius: "50%" }} />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ boxShadow: 1 }} mt={1} className={boxStyle.empDetailBox}>
              <Grid container sx={{ textAlign: "start" }}>
                <Grid item xs={5} md={1.2}><Typography variant="subtitle2">Employee Name </Typography></Grid>
                <Grid item xs={1} md={.2}><Typography variant="subtitle2">:</Typography></Grid>
                <Grid item xs={6} md={2.6}><Typography variant="body2">{getCapsName(employeeData?.personalDetails[0]?.employee_name)}</Typography></Grid>

                <Grid item xs={5} md={1.2} ><Typography variant="subtitle2">Email </Typography></Grid>
                <Grid item xs={1} md={.2} ><Typography variant="subtitle2">:</Typography></Grid>
                <Grid item xs={6} md={2.6} ><Typography sx={{ wordWrap: "break-word" }} variant="body2">{maskEmail(employeeData?.personalDetails[0]?.email)}</Typography></Grid>

                <Grid item xs={5} md={1.2}><Typography variant="subtitle2">DOJ </Typography></Grid>
                <Grid item xs={1} md={.2}><Typography variant="subtitle2">:</Typography></Grid>
                <Grid item xs={6} md={2.6}><Typography variant="body2">{employeeData?.personalDetails[0]?.date_of_joining}</Typography></Grid>

                <Grid mt={3} item xs={5} md={1.2}><Typography variant="subtitle2">Designation </Typography></Grid>
                <Grid mt={3} item xs={1} md={.2}><Typography variant="subtitle2">:</Typography></Grid>
                <Grid mt={3} item xs={6} md={2.6}><Typography sx={{ wordWrap: "break-word" }} variant="body2">{employeeData?.personalDetails[0]?.designation_name}</Typography></Grid>

                <Grid mt={3} item xs={5} md={1.2}><Typography variant="subtitle2">Department </Typography></Grid>
                <Grid mt={3} item xs={1} md={.2}><Typography variant="subtitle2">:</Typography></Grid>
                <Grid mt={3} item xs={6} md={2.6}><Typography sx={{ wordWrap: "break-word" }} variant="body2">{employeeData?.personalDetails[0]?.dept_name}</Typography></Grid>

                <Grid mt={3} item xs={5} md={1.2}><Typography variant="subtitle2">Exp At Acharya </Typography></Grid>
                <Grid mt={3} item xs={1} md={.2}><Typography variant="subtitle2">:</Typography></Grid>
                <Grid mt={3} item xs={6} md={2.6}><Typography variant="body2">{employeeData?.personalDetails[0]?.experience}</Typography></Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={12}>

          {employeeData?.educationDetails?.length > 0 && <FormWrapper>
            <Typography variant="subtitle2" component="span">
              CONTINUING EDUCATION / REFRESHER COURSES UNDERGONE [LAST 3 YEARS]
            </Typography>
            <TableContainer sx={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    {educationHeader.map((obj, index) => (
                      <StyledTableCell key={index} sx={{ color: "white", textAlign: "center" }}>
                        {obj.label}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {employeeData?.educationDetails?.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.course_title}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "right" }}>
                          {obj?.year}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.institution}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "right" }}>
                          {obj?.duration}
                        </StyledTableCell>
                      </StyledTableRow>)
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </FormWrapper>}

          {/* <FormWrapper>
            <Typography variant="subtitle2" component="span">
              INDIAN / INTERNATIONAL JOURNALS
            </Typography>
            <Typography variant="body2" component="span" sx={{ display: "inline-block", width: "80%", textAlign: "center" }}>
              SUMMARY OF RESEARCH PUBLICATIONS
            </Typography>
            <TableContainer sx={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    {journalHeader.map((obj, index) => (
                      <StyledTableCell key={index} sx={{ color: "white", textAlign: "center" }}>
                        {obj.label}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {educationRows?.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {obj}
                        </StyledTableCell>
                      </StyledTableRow>)
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </FormWrapper> */}

          {employeeData?.conferencePublications?.length > 0 && <FormWrapper>
            <Typography variant="subtitle2" component="span">
              INDIAN / INTERNATIONAL CONFERENCE PARTICIPATED
            </Typography>

            <TableContainer sx={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    {conferenceHeader.map((obj, index) => (
                      <StyledTableCell key={index} sx={{ color: "white", textAlign: "center" }}>
                        {obj.label}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {employeeData?.conferencePublications?.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.conference_name}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.state}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.city}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.date}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.organizer}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.type}
                        </StyledTableCell>
                      </StyledTableRow>)
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </FormWrapper>}

          {employeeData?.awards?.length > 0 && <FormWrapper>
            <Typography variant="subtitle2" component="span">
              AWARDS, COMMENDATIONS RECEIVED
            </Typography>
            <TableContainer sx={{ marginTop: "10px" }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    {awardsHeader.map((obj, index) => (
                      <StyledTableCell key={index} sx={{ color: "white", textAlign: "center" }}>
                        {obj.label}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {employeeData?.awards?.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.award_nature}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.year}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "justify" }}>
                          {obj?.awarding_organization}
                        </StyledTableCell>
                      </StyledTableRow>)
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </FormWrapper>}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeReport;
