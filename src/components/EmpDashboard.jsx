import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Paper, Divider, Stack, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Avatar, Chip, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import axios from "../services/Api";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import FunnelChart from "../containers/examples/FunnelChart";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ComputerIcon from "@mui/icons-material/Computer";
import TaskIcon from "@mui/icons-material/Task";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import useAlert from "../hooks/useAlert";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutline } from '@mui/icons-material';


const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId
const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName

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

const EmpDashboard = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [proctorList, setProctorList] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const funnelData = [
    ["Courses", employeeList?.count || 0],
    ["Mentee", proctorList?.studentCount || 0],
    ["Farm", 0],
    ["Feedback", 0],
  ];
  const handleFunnelClick = (block, data) => {
    console.log("Clicked Block:", data);
    if (data?.label?.raw === "Courses") {
      navigate("/Courseassignmentemployeeindex");
    } else if (data?.label?.raw === "Mentee") {
      navigate("/ProctorStudentMaster/Proctor");
    }
  };


  const funnelOptions = {
    chart: {
      width: 450,
      height: 450,
      curve: { enabled: true },
    },
    block: {
      dynamicHeight: false,
      minHeight: 15,
      fill: {
        scale: [
          "#EB8126", // Light Blue
          "#AB5A74", // Light Red
          "#BEB549", // Light Green
          "#374D6E", // Light Yellow
        ],
      },
    },
    label: {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#4a4a4a",
      format: (label, value) => `${label}: ${value}`,
    },
    events: {
      click: {
        block: (event, d) => {
          handleFunnelClick(event, d);
        },
      },
    },
  };


  useEffect(() => {
    getCountOfCourseBasedOnUserId();
    getProctorStatusAssignedStudentDetailsListByUserId();
    setCrumbs([]);
  }, []);

  const handleClick = async (moduleName) => {
    const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token
    try {
      window.open(`https:lms.alive.university/session/${token}?module=${moduleName}`, '_blank');
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
    }
  };
  const getCountOfCourseBasedOnUserId = async () => {
    try {
      const response = await axios.get(
        `/api/academic/getCountOfCourseBasedOnUserId/${userID}`
      );
      setEmployeeList(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getProctorStatusAssignedStudentDetailsListByUserId = async () => {
    try {
      const response = await axios.get(`/api/proctor/getCountOfStudentBasedOnUserId/${userID}`);
      setProctorList(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };



  const DepartmentalTask = () => {
    const mockNotifications = [
      { id: 1, message: "Meeting at 3:00 PM with the management team.", time: "2 hours ago" },
      { id: 2, message: "New policy updates have been released. Check the portal for details.", time: "5 hours ago" },
      { id: 3, message: "Your leave request has been approved.", time: "1 day ago" },
      { id: 4, message: "System maintenance is scheduled for this weekend.", time: "2 days ago" },
      { id: 5, message: "System maintenance is scheduled for this weekend.", time: "2 days ago" },
      { id: 6, message: "System maintenance is scheduled for this weekend.", time: "2 days ago" },
    ];

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
            height: 550,
          }}
        >
          {/* <CardContent> */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <TaskIcon sx={{ color: "#2196f3", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="600">
                Departmental Task
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Notification List */}
          <Box
            sx={{
              padding: 1,
              maxHeight: 480, // Adjust height as needed
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#b0bec5",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#eceff1",
              },
              overflow: 'hidden',
              '&:hover': {
                overflow: 'auto',  // Makes the scrollbar visible on hover
              },
            }}
          >
            <List disablePadding>
              {mockNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  disableGutters
                  sx={{
                    padding: "10px 0",
                    borderBottom: "1px solid #f0f0f0",
                    "&:last-child": { borderBottom: "none" },
                    transition: "background 0.3s",
                    "&:hover": {
                      background: "#f5f5f5",
                      cursor: "pointer",
                    },
                    
                  }}
                >
                  <ListItemIcon>
                    <CircleIcon sx={{ fontSize: 10, color: "#90ee90" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "#333",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.8rem",
                      color: "#999",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          {/* </CardContent> */}
        </Card>
      </Grid>
    );
  };

  const notifications = [
    {
      id: 1,
      title: "HABBA PRO NIGHT - 1",
      sender: "TEJAS K",
      date: "10 May, 2024",
      avatar: "https://via.placeholder.com/50",
      details: "Additional details about HABBA PRO NIGHT - 1.",
      type: "Event",
    },
    {
      id: 2,
      title: "ONLINE FEE PAYMENT",
      sender: "DIVYA KUMARI H",
      date: "03 Apr, 2023",
      avatar: "https://via.placeholder.com/50",
      details: "Detailed instructions for online fee payment.",
      type: "Reminder",
    },
    {
      id: 3,
      title: "ATTENDANCE FOR SEP 2022",
      sender: "Shafiulla Papabhai",
      date: "16 Sep, 2022",
      avatar: "https://via.placeholder.com/50",
      details: "Steps to verify and correct attendance records.",
      type: "Notice",
    },
    {
      id: 4,
      title: "UPDATE ACERP APP!!",
      sender: "DIVYA KUMARI H",
      date: "12 Jul, 2022",
      avatar: "https://via.placeholder.com/50",
      details: "New features include faster performance and bug fixes.",
      type: "Update",
    },
  ];

  const NotificationCard = () => {
    const [expanded, setExpanded] = useState({});

    const handleExpandClick = (id) => {
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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
            height: 550,
          }}
        >
          {/* <CardContent> */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <NotificationsActiveIcon sx={{ color: "#2196f3", fontSize: 28 }} />
              <Typography variant="h6" fontWeight="600">
                Notifications
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List
            sx={{
              padding: 1,
              maxHeight: 480, // Adjust height as needed
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#b0bec5",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#eceff1",
              },
              overflow: 'hidden',
              '&:hover': {
                overflow: 'auto',  // Makes the scrollbar visible on hover
              },
            }}
          >
            {notifications.map((notification) => (
              <Box key={notification.id} sx={{ mb: 2 }}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    padding: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, #d4e1f5, #f5f0e1)', // Soft pastel blue and beige gradient
                    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={notification.avatar} alt={notification.sender} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="600">
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.type}
                          size="small"
                          color={
                            notification.type === "Event"
                              ? "primary"
                              : notification.type === "Reminder"
                                ? "secondary"
                                : "default"
                          }
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {`${notification.sender} • ${notification.date}`}
                      </Typography>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleExpandClick(notification.id)}
                    sx={{
                      transform: expanded[notification.id] ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </ListItem>
                <Collapse in={expanded[notification.id]} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      padding: 1.5,
                      borderLeft: "4px solid #2196f3",
                      mt: 1,
                      background: "#fdfdfd",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {notification.details}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </List>
          {/* </CardContent> */}
        </Card>
      </Grid>
    );
  };


  return (
    <Box sx={{
      padding: 3,
      backgroundColor: "#f9f9f9"
    }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#2e3b55',
          fontSize: '3rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          position: 'relative',
          display: 'inline-block',
          paddingBottom: '5px',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: '#6c7cfc',
            borderRadius: '2px',
            transform: 'scaleX(0)',
            transformOrigin: 'right',
            transition: 'transform 0.3s ease-out',
          },
          '&:hover::after': {
            transform: 'scaleX(1)',
            transformOrigin: 'left',
          },
        }}
        gutterBottom
      >
        Hello, {userName}! 👋
      </Typography>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {/* Employee Dashboard */}
      </Typography>

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
          {
            title: "Study Material",
            color1: "#BEB549",
            color2: "#BEB549",
            icon: LibraryBooksIcon, // Updated icon
            onClick: () => handleClick("material"),

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
     
      <Box display="flex" gap={2} sx={{ width: '100%', height: '100%' }} mt={7}>
        {/* Container for both components */}
        <Box flex={1} height="100%">
          <NotificationCard />
        </Box>
        <Box flex={1} height="100%">
          <Grid item xs={12}>
            <Card
              sx={{
                padding: '24px',
                background: 'linear-gradient(145deg, #b3d4fc, #e3f2fd)', /* Soft pastel blues */
                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', /* Subtle shadow for depth */
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                height: 550,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DeleteOutline sx={{ color: "#2196f3", fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="600">
                    My Bucket
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />
              <FunnelChart data={funnelData} options={funnelOptions} />
            </Card>
          </Grid>
        </Box>

        <Box flex={1} height="100%">
          <DepartmentalTask />
        </Box>

      </Box>
    </Box>
  );
};

export default EmpDashboard;
