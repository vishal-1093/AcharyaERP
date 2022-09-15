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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import AcharyaLogo from "../assets/logo.jpg";
import profilePic from "../assets/logo1.png";

import { useTheme } from "@mui/styles";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = ({ moduleList, activeModule, setActiveModule }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const theme = useTheme();

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
      color="white"
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
                variant={mod === activeModule ? "contained" : "text"}
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

          <Box>
            <IconButton>
              <NotificationsNoneRoundedIcon />
            </IconButton>

            <Tooltip title="Vignesh">
              <Button
                onClick={handleOpenUserMenu}
                color="secondary"
                sx={{ borderRadius: 50, minWidth: 0, p: 0, ml: 1.5 }}
              >
                {/* <AccountCircleIcon sx={{ fontSize: "3rem" }} /> */}
                <img src={profilePic} width={47} height={47} />
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
