import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  Avatar,
  Badge,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import AcharyaLogo from "../assets/logo.jpg";
import { useTheme } from "@mui/styles";
import axios from "../services/Api";
import useRoleBasedNavigation from "./useRoleBasedNavigation";
import dayjs from "dayjs";
import AttachmentIcon from "@mui/icons-material/Attachment";

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId
const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName

const Header = ({
  moduleList,
  activeModule,
  setActiveModule,
  staffDetail,
  photo,
}) => {
  const navigateBasedOnRole = useRoleBasedNavigation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchAllData()
  }, []);


  const fetchAllData = async () => {
    try {
      // Fetch user details
      const userDetailsResponse = await axios.get(
        `/api/employee/getDeptIdAndSchoolIdBasedOnUser/${userID}`
      );
      const userData = userDetailsResponse?.data?.data;
      sessionStorage.setItem("userData", JSON.stringify(userData));

      if (userData?.dept_id) {
        const notificationDataOfToday = await axios.get(
          `/api/institute/getNotificationDataOfToday/${userData?.dept_id}`
        );

        let notificationDataList = notificationDataOfToday?.data?.data;
      
        const uniqueEmpObjects = notificationDataList.filter(
          (obj, index, self) =>
            self.findIndex((item) => item.emp_id === obj.emp_id) === index
        );
        
        let processedNotifications = [];
        if (Array.isArray(uniqueEmpObjects)) {
          processedNotifications = await Promise.all(
            uniqueEmpObjects.map(async (notification) => {
              if (notification?.photo) {
                try {
                  const photoUrl = `api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${notification?.photo}`;
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
  
        // Merge photos into the original notification list
        const notificationsWithPhotos = notificationDataList.map((notification) => {
          const processedNotification = processedNotifications.find(
            (item) => item.emp_id === notification.emp_id
          );
          return {
            ...notification,
            photo: processedNotification?.photo || null,
          };
        });
  
        setNotifications(notificationsWithPhotos);
      } else {
        console.error("User data is incomplete or missing.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
    <AppBar
      sx={{ zIndex: theme.zIndex.drawer + 1 }}
      elevation={2}
      color="headerWhite"
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: "57px !important",
            height: 50,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              pr: 1.3,
              mr: 1.5,
              height: 27,
              borderRight: "1px solid #aaa",
            }}
          >
            <Link to="/Dashboard">
              <img src={AcharyaLogo} alt="Acharya Institutes" />
            </Link>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {moduleList.map((mod) => (
                <MenuItem
                  key={mod}
                  onClick={(e) => {
                    handleCloseNavMenu();
                    setActiveModule(e.target.innerText.toLowerCase());
                  }}
                >
                  <Typography textAlign="center" textTransform="capitalize">
                    {mod}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1, height: 27 }}>
            <Link to="/">
              <img src={AcharyaLogo} alt="Acharya Institutes" />
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {moduleList.map((mod) => (
              <Button
                key={mod}
                onClick={(e) =>
                  setActiveModule(e.target.innerText.toLowerCase())
                }
                variant={mod === activeModule.trim() ? "contained" : "text"}
                color="secondary"
                sx={{
                  px: 1.2,
                  py: 0.2,
                  mx: 0.2,
                  textTransform: "capitalize",
                }}
              >
                {mod}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex" }}>
            <IconButton onClick={() => navigateBasedOnRole()}>
              <HomeIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <Badge
                badgeContent={notifications?.length}
                max={99}
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "green",
                    color: "white",
                  },
                }}
              >
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>

            {/* Notification Dropdown */}
            {notifications?.length > 0 && <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                mt: 1,
                "& .MuiMenu-paper": {
                  borderRadius: 2,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                  minWidth: 300,
                },
              }}
            >
              {notifications?.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    padding: 1.5,
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: "#f9f9fc", // Soft background color
                    "&:hover": {
                      backgroundColor: "#e6f0ff", // Light blue on hover
                    },
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
                        {`${notification?.created_username?.toUpperCase() || ""} • ${notification?.notification_date && dayjs(notification.notification_date, "DD-MM-YYYY").isValid()
                          ? dayjs(notification.notification_date, "DD-MM-YYYY").format("DD MMM, YYYY")
                          : "Invalid Date"
                          }`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </Menu>}



            <Tooltip title={userName}>
              <Button
                onClick={handleOpenUserMenu}
                color="secondary"
                sx={{ borderRadius: 50, minWidth: 0, p: 0, ml: 1.5 }}
              >
                <Avatar>
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={userName}
                      height={45}
                    />
                  ) : (
                    userName?.substr(0, 1)
                  )}
                </Avatar>
              </Button>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <Box sx={{ paddingLeft: 1, color: "grey" }}>
                  <Typography>{staffDetail.email}</Typography>
                  <Typography>{staffDetail.mobileNumber}</Typography>
                </Box>
              </MenuItem>
              <MenuItem>
                <Typography
                  sx={{ color: "grey" }}
                  onClick={() => navigate(`/MyProfile`)}
                >
                  <AccountCircleIcon sx={{ verticalAlign: "top" }} /> Profile
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/ChangePassword");
                  handleCloseUserMenu();
                }}
              >
                <Typography sx={{ color: "grey" }}>
                  <LockResetIcon sx={{ verticalAlign: "top" }} /> Change
                  Password
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  sessionStorage.setItem("AcharyaErpUser", null);
                  sessionStorage.setItem("empId", null);
                  sessionStorage.setItem("usertype", null);
                  navigate("/Login");
                  handleCloseUserMenu();
                }}
              >
                <Typography sx={{ color: "grey" }}>
                  <LogoutIcon sx={{ verticalAlign: "bottom" }} /> Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          {staffDetail.preferredName !== null && (
            <Typography
              sx={{ color: "grey", p: 2, textTransform: "capitalize" }}
            >
              {staffDetail.preferredName}
            </Typography>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
