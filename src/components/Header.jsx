import { useState } from "react";
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

const Header = ({
  moduleList,
  activeModule,
  setActiveModule,
  staffDetail,
  photo,
}) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const userName = JSON.parse(
    sessionStorage.getItem("AcharyaErpUser")
  )?.userName;

  const theme = useTheme();
  const navigate = useNavigate();

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
            <IconButton onClick={() => navigate("/Dashboard")}>
              <HomeIcon />
            </IconButton>

            <IconButton>
              <NotificationsNoneRoundedIcon />
            </IconButton>

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
