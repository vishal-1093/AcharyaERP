import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Divider, TableRow, TableCell, Chip, TableContainer, Table, TableHead, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import axios from "../services/Api";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ComputerIcon from "@mui/icons-material/Computer";
import TaskIcon from "@mui/icons-material/Task";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import useAlert from "../hooks/useAlert";
import ReactApexcharts from 'react-apexcharts'
import PeopleIcon from '@mui/icons-material/People';
import NoDataFound from '../assets/NoDataFound.jpg'
import QuizIcon from '@mui/icons-material/Quiz';
import { GreetingWithTime } from "./EmpDashboard";

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId
const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName



const AnalyticMyEmployee = ({ employeeList }) => {
  const navigate = useNavigate();

  // Calculate totals for statistical summary
  const totalMale = employeeList?.reduce((acc, cur) => acc + (cur.male_count || 0), 0);
  const totalFemale = employeeList?.reduce((acc, cur) => acc + (cur.female_count || 0), 0);
  const totalCount = employeeList?.reduce((acc, cur) => acc + (cur.counts || 0), 0);

  const handleRowClick = (task) => {
    navigate("/employee-detail", { state: task, })
  };

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          padding: '24px',
          background: 'linear-gradient(145deg, #b3d4fc, #e3f2fd)', /* Soft pastel blues */
          boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', /* Subtle shadow for depth */
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: 500,
          overflow: 'auto'
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600" color="#333">
            Active Employee
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <Chip
              label={`Male: ${totalMale}`}
              sx={{ backgroundColor: '#e3f2fd', color: '#1e88e5', fontWeight: 'bold' }}
            />
            <Chip
              label={`Female: ${totalFemale}`}
              sx={{ backgroundColor: '#fce4ec', color: '#d81b60', fontWeight: 'bold' }}
            />
            <Chip
              label={`Total: ${totalCount}`}
              sx={{ backgroundColor: '#e8f5e9', color: '#388e3c', fontWeight: 'bold' }}
            />
          </Box>
        </Box>
        <Divider />

        {/* Table Section */}
        <TableContainer sx={{
          mt: 3,
          overflow: 'hidden',
          '&:hover': {
            overflow: 'auto',  // Makes the scrollbar visible on hover
          },
          '&::-webkit-scrollbar': {
            width: '6px',  // Adjust this value to reduce the scrollbar width
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',  // Customize thumb color
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',  // Change color on hover
          },
        }}>
          <Table>
            {employeeList && employeeList.length > 0 ? (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Designation
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Male
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Female
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeList.map((task, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(task)}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#ffffff',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                          transition: 'all 0.3s ease',
                        },
                        background: 'linear-gradient(145deg, #d4e1f5, #f5f0e1)', // Soft pastel blue and beige gradient
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="500">
                          {task.designation_name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" color="#1e88e5" fontWeight="500">
                          {task.male_count || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" color="#d81b60" fontWeight="500">
                          {task.female_count || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<PeopleIcon />}
                          label={task.counts || 0}
                          sx={{
                            backgroundColor: '#e8f5e9',
                            color: '#388e3c',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 3,
                        color: '#999',
                      }}
                    >
                      No Data Found
                    </Typography>
                    <img
                      src={NoDataFound}
                      alt="No data available"
                      style={{
                        maxWidth: '60%',
                        height: 'auto',
                        marginTop: '20px',
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>
    </Grid>
  );
};


const AnalyticMyStudent = ({ studentList }) => {
  // Calculate totals for statistical summary
  const totalMale = studentList?.reduce((acc, cur) => acc + (cur.maleStudentCount || 0), 0);
  const totalFemale = studentList?.reduce((acc, cur) => acc + (cur.femaleStudentCount || 0), 0);
  const totalCount = studentList?.reduce((acc, cur) => acc + (cur.reportingStudent || 0), 0);

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          padding: '24px',
          background: 'linear-gradient(145deg, #b3d4fc, #e3f2fd)', /* Soft pastel blues */
          boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', /* Subtle shadow for depth */
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: 500,
          overflow: 'auto'
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600" color="#333">
            Active Students
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <Chip
              label={`Male: ${totalMale}`}
              sx={{ backgroundColor: '#e3f2fd', color: '#1e88e5', fontWeight: 'bold' }}
            />
            <Chip
              label={`Female: ${totalFemale}`}
              sx={{ backgroundColor: '#fce4ec', color: '#d81b60', fontWeight: 'bold' }}
            />
            <Chip
              label={`Total: ${totalCount}`}
              sx={{ backgroundColor: '#e8f5e9', color: '#388e3c', fontWeight: 'bold' }}
            />
          </Box>
        </Box>
        <Divider />

        {/* Table Section */}

        <TableContainer sx={{
          mt: 3,
          overflow: 'hidden',
          '&:hover': {
            overflow: 'auto',  // Makes the scrollbar visible on hover
          },
          '&::-webkit-scrollbar': {
            width: '6px',  // Adjust this value to reduce the scrollbar width
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',  // Customize thumb color
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',  // Change color on hover
          },
        }}>
          <Table>
            {studentList && studentList?.length > 0 ? (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Semester
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Male
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Female
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: '#555',
                        borderBottom: '2px solid #ddd',
                      }}
                    >
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList.map((task) => (
                    <TableRow
                      key={task?.id || task?.semester} // Use a unique key
                      sx={{
                        backgroundColor: task?.index % 2 === 0 ? '#f7f7f7' : '#ffffff',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                          transition: 'all 0.3s ease',
                        },
                        background: 'linear-gradient(145deg, #d4e1f5, #f5f0e1)', // Soft pastel blue and beige gradient
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="500">
                          {task?.semester || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" color="#1e88e5" fontWeight="500">
                          {task?.maleStudentCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" color="#d81b60" fontWeight="500">
                          {task?.femaleStudentCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<PeopleIcon />}
                          label={task?.reportingStudent || 0}
                          sx={{
                            backgroundColor: '#e8f5e9',
                            color: '#388e3c',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 3,
                        color: '#999',
                      }}
                    >
                      No Data Found
                    </Typography>
                    <img
                      src={NoDataFound}
                      alt="No data available"
                      style={{
                        maxWidth: '60%',
                        height: 'auto',
                        marginTop: '20px',
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>
    </Grid>
  );
};


const AnalyticMyTeamTotal = ({ employeeAndStrudent }) => {

  const piedata = [employeeAndStrudent?.employeeCount || 0, employeeAndStrudent?.studentCount || 0];

  const options = {
    chart: {
      type: "pie",
    },
    labels: ["Employee", "Students"], // Updated labels for gender representation
    colors: ["#3A446D", "#EDB374"], // Distinct colors for male and female
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: { width: 10, height: 10 },
      itemMargin: { horizontal: 5, vertical: 0 },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return `${value}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom", horizontalAlign: "center" },
        },
      },
    ],
  };

  return (
    <Card
      sx={{
        padding: '24px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: 500,
        overflow: 'auto',
        background: 'linear-gradient(145deg, #f8b3b3, #fde3e3)', /* Soft pastel reds */
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)'/* Subtle shadow for depth */
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="600" color="#333" sx={{ textAlign: 'center' }}>
          Employee and Students
        </Typography>
        {piedata?.reduce((a, b) => a + b, 0) === 0 ? ( // Check for empty data
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography
                  variant="h6"
                  sx={{
                    mt: 3,
                    color: '#999',
                  }}
                >
                  No Data Found
                </Typography>
                <img
                  src={NoDataFound}
                  alt="No data available"
                  style={{
                    maxWidth: '60%',
                    height: 'auto',
                    marginTop: '20px',
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <ReactApexcharts type="pie" series={piedata} options={options} height={350} />
        )}
      </CardContent>
    </Card>
  );
};





const GradientCard = styled(Card)(({ color1, color2 }) => ({
  background: `linear-gradient(135deg, ${color1} 30%, ${color2} 90%)`,
  color: "white",
  height: "180px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: "15px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
  },
}));



const IconWrapper = styled(Box)({
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  padding: "10px",
  borderRadius: "50%",
  marginBottom: "10px",
  zIndex: 1,
});

const StatCard = ({ title, value, icon: Icon, color1, color2, onClick }) => {
  return (
    <GradientCard color1={color1} color2={color2} onClick={onClick}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* <IconWrapper> */}
        {Icon && <Icon sx={{ fontSize: 50, color: "white" }} />}
        {/* </IconWrapper> */}
        <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
          {title}
        </Typography>
        {value !== undefined && (
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "white", mt: 1 }}
          >
            {value}
          </Typography>
        )}
      </CardContent>
    </GradientCard>
  );
};


const HodDashboard = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [employeeAndStrudent, setEmployeeAndStrudent] = useState({});

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();



  useEffect(() => {
    getCountOfCourseBasedOnUserId();
    getHodStudentCount()
    getCountOfEmployeeAndStrudent();
    setCrumbs([]);
  }, []);

  const handleClick = async (moduleName) => {
    const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token;
    try {
      const url = `https://lms.alive.university/session/${token}?module=${moduleName}`;
      window.open(url, '_blank');
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occurred",
      });
      setAlertOpen(true);
    }
  };

  const getCountOfCourseBasedOnUserId = async () => {
    try {
      const response = await axios.get(
        `/api/employee/getcountOfDesignationBasedOnHod/${userID}`
      );
      setEmployeeList(response?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };
  const getHodStudentCount = async () => {
    try {
      const response = await axios.get(
        `/api/employee/getHodStudentCount/${userID}`
      );
      setStudentList(response?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };
  const getCountOfEmployeeAndStrudent = async () => {
    try {
      const response = await axios.get(`/api/employee/getCountOfEmployeeAndStrudent/${userID}`);
      console.log(response?.data?.data, "response");

      setEmployeeAndStrudent(response?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Box sx={{
        padding: 3,
        backgroundColor: "#f9f9f9"
      }}>
       <GreetingWithTime userName={userName} />
        {/* Statistic Cards */}
        <Grid container spacing={3} mt={2} justifyContent="space-between">
          {[
            {
              title: "Calendar",
              color1: "#86A39F",
              color2: "#86A39F",
              icon: CalendarTodayIcon,
              onClick: () => navigate("/Dashboard"),
            },
            {
              title: "My Profile",
              color1: "#E27E7E",
              color2: "#E27E7E",
              icon: AccountCircleIcon,
              onClick: () => navigate("/MyProfile"),
            },
            {
              title: "Online Class",
              color1: "#517789",
              color2: "#517789",
              icon: ComputerIcon, // Updated icon
              onClick: () => handleClick("online_class"),
            },
            {
              title: "Assignments",
              color1: "#B8D59A",
              color2: "#B8D59A",
              icon: TaskIcon, // Updated icon
              onClick: () => handleClick("assignment"),
            },
             // {
          //   title: "Study Material",
          //   color1: "#BEB549",
          //   color2: "#BEB549",
          //   icon: LibraryBooksIcon, // Updated icon
          //   onClick: () => handleClick("material"),

          // },
          {
            title: "Quizzes",
            color1: "#BEB549",
            color2: "#BEB549",
            icon: QuizIcon, // Updated icon
            onClick: () => handleClick("quizzes"),
          },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <StatCard
                title={card.title}
                value={card.value}
                color1={card.color1}
                color2={card.color2}
                icon={card.icon}
                onClick={card.onClick}
              />
            </Grid>
          ))}
        </Grid>
        <Box display="flex" gap={2} sx={{ width: '100%', height: '100%' }} mt={5}>
          {/* Container for both components */}
          <Box flex={1} height="100%">
            <AnalyticMyEmployee employeeList={employeeList} />
          </Box>
          <Box flex={1} height="100%">
            <AnalyticMyTeamTotal employeeAndStrudent={employeeAndStrudent} />
          </Box>
          <Box flex={1} height="100%">
            <AnalyticMyStudent studentList={studentList} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HodDashboard;
