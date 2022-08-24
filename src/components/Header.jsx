import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AcharyaLogo from "../assets/logo.jpg";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: `${theme.zIndex.drawer + 1} !important`,
  },
}));

const pages = ["Employee", "Inventory", "Academic", "Institute"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [activeMenu, setActiveMenu] = useState("Employee");

  const classes = useStyles();

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
    <AppBar className={classes.appBar} elevation={2} color="white">
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
          <Link
            href="/"
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 2,
              height: 27,
              borderRight: "1px solid #aaa",
            }}
          >
            <img src={AcharyaLogo} alt="Acharya Institutes" />
          </Link>

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
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Link
            href="/"
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              height: 27,
            }}
          >
            <img src={AcharyaLogo} alt="Acharya Institutes" />
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={(e) => setActiveMenu(e.target.innerText)}
                variant={page === activeMenu ? "contained" : "text"}
                color="secondary"
                sx={{ px: 1.2, py: 0.2, mx: 0.2, textTransform: "capitalize" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box>
            <IconButton>
              <NotificationsNoneRoundedIcon />
            </IconButton>
            <Tooltip title="Open settings">
              <Button
                onClick={handleOpenUserMenu}
                startIcon={
                  <Avatar alt="Remy Sharp" src="/static/assets/avatar/2.jpg" />
                }
                sx={{ textTransform: "capitalize", mx: 0.7 }}
                color="secondary"
              >
                Remy Sharp
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
