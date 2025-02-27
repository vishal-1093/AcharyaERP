import React from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  AddHomeOutlined as RoomIcon,
  VisibilityOutlined as EyeIcon,
} from "@mui/icons-material";
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
const useStyles = makeStyles((theme) => ({
  legendContainer: {
    display: "flex",
    justifyContent: "space-around",
    gap: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  statusBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  boxContainer: {
    position: "relative",
    width: 40,
    height: 40,
    background: "linear-gradient(to right, #a5d6a7 50%, #ef9a9a 50%)", // Half green, half red
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  freeFull: {
    backgroundColor: "#a5d6a7",
  },
  bookedFull: {
    backgroundColor: "#ef9a9a",
  },
  iconStyle: {
    fontSize: "2rem",
    color: "#fff",
  },
  statusLabel: {
    marginTop: theme.spacing(1),
    fontWeight: 500,
  },
  fullBox: {
    position: "relative",
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const EventStatus = () => {
  const classes = useStyles();

  return (
    <Box className={classes.legendContainer}>
      {/* Free Status */}
      <Box className={classes.statusBox}>
        <Typography className={classes.statusLabel} variant="body1">
          Free
        </Typography>
        <Box className={`${classes.fullBox} ${classes.freeFull}`}>
          <BookmarkAddOutlinedIcon className={classes.iconStyle} />
        </Box>
      </Box>
      <Box className={classes.statusBox}>
        <Typography className={classes.statusLabel} variant="body1">
        Partially Booked - Booked
        </Typography>
        <Box className={`${classes.fullBox} ${classes.bookedFull}`}>
        <BookmarkAddOutlinedIcon className={classes.iconStyle} />
        </Box>
      </Box>
      {/* Booked Status */}
      {/* <Box className={classes.statusBox}>
        <Typography className={classes.statusLabel} variant="body1">
          Booked
        </Typography>
        <Box className={`${classes.fullBox} ${classes.bookedFull}`}>
          <BookmarkAddedOutlinedIcon className={classes.iconStyle} />
        </Box>
      </Box> */}

      {/* Half Free/Half Booked Status */}
      {/* <Box className={classes.statusBox}>
        <Typography className={classes.statusLabel} variant="body1">
          Partially Booked
        </Typography>
        <Box className={classes.boxContainer}>
        <BookmarkAddedOutlinedIcon className={classes.iconStyle} />
        </Box>
      </Box> */}
    </Box>
  );
};

export default EventStatus;
