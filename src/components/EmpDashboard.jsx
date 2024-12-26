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
import CampaignIcon from '@mui/icons-material/Campaign';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import QuizIcon from '@mui/icons-material/Quiz';
import useAlert from "../hooks/useAlert";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutline } from '@mui/icons-material';
import dayjs from "dayjs";
import AttachmentIcon from "@mui/icons-material/Attachment";

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId
const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName



export const GreetingWithTime = ({ userName }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(formattedTime);
    };

    // Update time immediately and every minute
    updateTime(); // Initial time set
    const intervalId = setInterval(updateTime, 60000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to get greeting based on time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'morning';
    if (hours < 18) return 'afternoon';
    return 'evening';
  };

  // Function to get greeting badge based on time of day
  const getGreetingBadge = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "☀️"; // Morning
    if (hours < 18) return "🌤️"; // Afternoon
    return "🌙"; // Evening
  };

  return (
    <Typography
      variant="h5"
      sx={{
        fontWeight: '600',
        color: '#2e3b55',
        fontSize: '2rem',
        textTransform: 'capitalize',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '8px',
        position: 'relative',
        '& span:first-of-type': {
          fontStyle: 'italic',
        },
      }}
      gutterBottom
    >
      <span>{`Good ${getGreeting()}, ${userName}! 👋`}</span>
      <span
        style={{
          backgroundColor: '#6c7cfc',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '500',
        }}
      >
        {`${currentTime} ${getGreetingBadge()}`}
      </span>
    </Typography>
  );
};


const GradientCard = styled(Card)(({ color1, color2 }) => ({
  background: `linear-gradient(135deg, ${color1} 30%, ${color2} 90%)`,
  color: "white",
  height: "140px",
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
const DepartmentalTask = ({ tasks = [] }) => {
  const [expanded, setExpanded] = useState({});

  const handleExpandClick = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          padding: "24px",
          background: "linear-gradient(145deg, #7D7FB4, #b3d4fc, #e3f2fd)", // Soft pastel blues
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          height: 550,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <CampaignIcon sx={{ color: "#000000", fontSize: 28 }} />
            <Typography variant="h6" fontWeight="600">
              Departmental Tasks
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List
          sx={{
            padding: 1,
            maxHeight: 480,
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
          }}
        >
          {tasks?.map((task) => (
            <Box key={task.id} sx={{ mb: 2 }}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  padding: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(145deg, #d4e1f5, #f5f0e1)", // Soft pastel blue and beige gradient
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      {task?.type === "Faculty" ? <Typography variant="subtitle1" fontWeight="600">
                        {task.contribution_type}
                      </Typography> : <Typography variant="subtitle1" fontWeight="600">
                        {task.type}
                      </Typography>}
                      <Chip
                        label={task.task_priority}
                        size="small"
                        color={task.task_priority === "Primary" ? "error" : "default"}
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  }
                  secondary={
                    task?.type === "Faculty" ?
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {`${task.task_type} • ${dayjs(task?.from_date, "DD-MM-YYYY").format("DD MMM, YYYY")} to ${dayjs(task?.to_date, "DD-MM-YYYY").format("DD MMM, YYYY")}`}
                      </Typography> :
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {`Assigned by: ${task.employee_name} • ${dayjs(task?.from_date, "DD-MM-YYYY").format("DD MMM, YYYY")} to ${dayjs(task?.to_date, "DD-MM-YYYY").format("DD MMM, YYYY")}`}
                      </Typography>
                  }
                />
                <IconButton
                  size="small"
                  onClick={() => handleExpandClick(task.id)}
                  sx={{
                    transform: expanded[task.id] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </ListItem>
              <Collapse in={expanded[task.id]} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    padding: 1.5,
                    borderLeft: "4px solid #2196f3",
                    mt: 1,
                    background: "#fdfdfd",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Task Title:</strong> {task.task_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Description:</strong> {task.description}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          ))}
        </List>
      </Card>
    </Grid>
  );
};


const NotificationCard = ({ notificationList = [], handleView }) => {
  const [expanded, setExpanded] = useState({});

  const handleExpandClick = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          padding: '24px',
          background: 'linear-gradient(145deg, #7D7FB4, #b3d4fc, #e3f2fd)', /* Soft pastel blues */
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
            <NotificationsActiveIcon sx={{ color: "#000000", fontSize: 28 }} />
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
          {notificationList?.map((notification) => (
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
                  <Avatar>
                    {notification?.photo ? (
                      <img
                        src={notification?.photo}
                        alt={notification?.created_username}
                        height={45}
                      />
                    ) : (
                      notification?.created_username?.substr(0, 1)
                    )}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="600">
                          {notification.title}
                        </Typography>
                        {notification.notification_attach_path && (
                          <AttachmentIcon
                            sx={{
                              fontSize: 18,
                              color: "text.secondary",
                              cursor: "pointer",
                              ml: 1,
                              "&:hover": { color: "primary.main" },
                            }}
                            onClick={() => handleView(notification.notification_attach_path)}
                          />
                        )}
                      </Box>
                      <Chip
                        label={notification?.notification_type}
                        size="small"
                        color={
                          notification.notification_type === "Event"
                            ? "primary"
                            : notification.notification_type === "Reminder"
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
                      {`${notification?.created_username?.toUpperCase() || ""} - 
    ${notification?.schools_short_names?.toUpperCase() || ""} - 
    ${notification?.departments?.toUpperCase() || ""} • 
    ${notification?.notification_date &&
                          dayjs(notification.notification_date, "DD-MM-YYYY").isValid()
                          ? dayjs(notification.notification_date, "DD-MM-YYYY").format("DD MMM, YYYY")
                          : "Invalid Date"
                        }`}
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
                    {notification?.description?.split(/(\bhttps?:\/\/\S+\b)/g)?.map((part, index) =>
                      /^https?:\/\/\S+$/.test(part) ? (
                        <a
                          key={index}
                          href={part}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2196f3', textDecoration: 'underline' }}
                        >
                          {part}
                        </a>
                      ) : (
                        part
                      )
                    )}
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

const EmpDashboard = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [proctorList, setProctorList] = useState([]);
  const [notification, setNotification] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [dailyPlanner, setDailyPlanner] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [userData, setUserData] = useState([]);

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
    return () => {
      notificationList.forEach((notification) => {
        if (notification.photo) URL.revokeObjectURL(notification.photo);
      });
    };
  }, [notificationList]);

  useEffect(() => {
    getCountOfCourseBasedOnUserId();
    getProctorStatusAssignedStudentDetailsListByUserId();
    getAllActiveDailyPlannerBasedOnEmpId()
    fetchAllData()
    setCrumbs([]);
  }, []);

  // const getUserSchoolDetails = async () => {
  //   await axios
  //     .get(`/api/employee/getDeptIdAndSchoolIdBasedOnUser/${userID}`)
  //     .then((res) => {
  //       setUserData(res?.data?.data)
  //     })
  //     .catch((err) => console.error(err));
  // };

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
  const fetchAllData = async () => {
    try {
      // Fetch user details
      const userDetailsResponse = await axios.get(
        `/api/employee/getDeptIdAndSchoolIdBasedOnUser/${userID}`
      );
      const userData = userDetailsResponse?.data?.data;

      if (userData?.dept_id) {
        // Fetch notification list
        const notificationListResponse = await axios.get(
          `/api/institute/getNotificationDataBasedOnDept/${userData.dept_id}`
        );
        const notificationList = notificationListResponse?.data?.data;

        let processedNotifications = [];
        if (Array.isArray(notificationList)) {
          processedNotifications = await Promise.all(
            notificationList.map(async (notification) => {
              if (notification?.photo) {
                try {
                  const photoUrl = `api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${notification?.photo}`; // Adjusted API endpoint for the photo
                  const blobResponse = await axios.get(photoUrl, {
                    responseType: "blob",
                  });
                  const blobUrl = URL.createObjectURL(blobResponse.data);
                  return { ...notification, photo: blobUrl };
                } catch (error) {
                  console.error("Error fetching photo blob:", error);
                  return { ...notification, photo: null };
                }
              }
              return { ...notification, photo: null };
            })
          );
        }

        setNotificationList(processedNotifications);
      } else {
        console.error("User data is incomplete or missing.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllActiveDailyPlannerBasedOnEmpId = async () => {
    try {
      const response = await axios.get(`/api/getAllActiveDailyPlannerBasedOnEmpId/${userID}`);
      console.log(response.data.data, "response.data.data");

      setDailyPlanner(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleView = async (filePath) => {
    if (filePath.endsWith(".jpg")) {
      await axios
        .get(
          `/api/institute/notificationFileviews?fileName=${filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg");
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/institute/notificationFileviews?fileName=${filePath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          window.open(url);
        })
        .catch((err) => console.error(err));
    }
  };
  return (
    <Box sx={{
      backgroundColor: "#f9f9f9"
    }}>
      <GreetingWithTime userName={userName} />
      <Grid container spacing={3} justifyContent="space-between">
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
            // onClick: () => handleClick("online_class"),
          },
          {
            title: "Assignments",
            color1: "#B8D59A",
            color2: "#B8D59A",
            icon: TaskIcon, // Updated icon
            // onClick: () => handleClick("assignment"),
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
            // onClick: () => handleClick("quizzes"),
          },

        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={2.3} key={index}>
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

      <Box display="flex" gap={2} sx={{ width: '100%', height: '100%' }} mt={3}>
        {/* Container for both components */}
        <Box flex={1} height="100%">
          <NotificationCard notificationList={notificationList} handleView={handleView} />
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
                  <DeleteOutline sx={{ color: "#000000", fontSize: 28 }} />
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
          <DepartmentalTask tasks={dailyPlanner} />
        </Box>

      </Box>
    </Box>
  );
};

export default EmpDashboard;
