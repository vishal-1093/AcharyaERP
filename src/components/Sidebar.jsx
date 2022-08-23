import { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  ListItemText,
  ListItemIcon,
  ListItemButton,
  CssBaseline,
  List,
  Box,
  Collapse,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  listItemButton: {
    minHeight: 48,
    px: 2.5,

    "&:hover": { background: `#fff1 !important` },
  },
  listItemIcon: {
    minWidth: "0 !important",
    color: "white !important",
  },
  listItemTextContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pagesContainer: {
    fontSize: "10px !important",
    background: `#ffffff0a !important`,
    padding: "10px !important",
  },
  pageButton: {
    borderRadius: "7px !important",
    padding: "2px 0 2px 60px !important",
    margin: "4px auto !important",

    "&:hover": { background: `#fff1 !important` },
  },
  selectedPage: {
    background: "#fff1 !important",
    borderRadius: "7px !important",
    borderRight: `5px solid ${theme.palette.primary.light} !important`,
    padding: "2px 0 2px 60px !important",
    margin: "4px auto !important",
  },
}));

const drawerWidth = 300;

const drawerOpenedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})(({ theme, drawerOpen }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(drawerOpen && {
    ...drawerOpenedMixin(theme),
    "& .MuiDrawer-paper": drawerOpenedMixin(theme),
  }),
  ...(!drawerOpen && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const subMenuItems = [
    "Approver Menu",
    "Employee Master",
    "Admin",
    "Accounts Menu",
  ];
  const pageItems = [
    "Cancel Leaves",
    "Employee Attendance",
    "Holiday Calendar",
    "Designation Priority",
    "Self Assessment",
    "Staff Assessment",
  ];

  const classes = useStyles();

  const handleDrawerdrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        drawerOpen={drawerOpen}
        onMouseEnter={handleDrawerdrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <List sx={{ mt: 7 }}>
          <div>
            <ListItemButton
              onClick={() => setSubMenuOpen((prev) => !prev)}
              className={classes.listItemButton}
              sx={{
                justifyContent: drawerOpen ? "initial" : "center",
              }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <GroupRoundedIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  ml: drawerOpen ? 3 : 0,
                  opacity: drawerOpen ? 1 : 0,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <div className={classes.listItemTextContainer}>
                  HR Menu
                  {subMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </div>
              </ListItemText>
            </ListItemButton>
            <Collapse in={subMenuOpen} timeout="auto" unmountOnExit>
              <List disablePadding className={classes.pagesContainer}>
                <ListItemButton className={classes.selectedPage}>
                  <ListItemText primary="Job Portal" />
                </ListItemButton>
                {pageItems.map((pageName, index) => (
                  <ListItemButton key={index} className={classes.pageButton}>
                    <ListItemText primary={pageName} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>

          {subMenuItems.map((text, index) => (
            <ListItemButton
              key={index}
              className={classes.listItemButton}
              sx={{
                justifyContent: drawerOpen ? "initial" : "center",
              }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <GroupRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{
                  ml: drawerOpen ? 3 : 0,
                  opacity: drawerOpen ? 1 : 0,
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} />
    </Box>
  );
}

export default Sidebar;
