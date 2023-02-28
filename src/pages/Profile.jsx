import { useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { makeStyles } from "@mui/styles";
import profileImage from "../assets/Profile.jpg";
import background from "../assets/ProfileBackground.jpg";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

const useStyles = makeStyles((theme) => ({
  container: {
    background: `url(${background})`,
    backgroundSize: 200,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    borderRadius: 7,
    padding: 10,
  },
  card: {
    borderRadius: 7,
    overflow: "hidden",
    backgroundColor: "#fff4",
    backdropFilter: "blur(13px)",
  },
  cardHeader: {
    backgroundColor: theme.palette.blue.main,
    color: "white",
    padding: "5px 10px",
  },
  optionContainer: {
    width: 100,
    flex: "2 1 auto",
    textAlign: "center",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    margin: "5px 10px",
  },
  optionButton: {
    position: "relative",
    backgroundColor: theme.palette.blue.main,
    color: "white",
    width: 50,
    height: 50,
    borderRadius: 7,
    transform: "rotate(45deg)",
    margin: "15px 0 10px 0",
    transition: "all 0.1s linear",

    "&:hover": {
      transform: "rotate(0)",

      "& $icon": {
        transform: "translate(-50%, -50%) rotate(0)",
      },
    },
  },
  icon: {
    fontSize: "2.7rem !important",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    transition: "all 0.1s linear !important",
  },
}));

function Profile() {
  const classes = useStyles();

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([]), []);

  return (
    <Grid
      container
      className={classes.container}
      columnSpacing={2}
      rowSpacing={2}
    >
      <Grid item xs={12} sm={6} md={3}>
        <Box className={classes.card} fontSize="1rem" pb={2}>
          <img
            src={profileImage}
            alt="profile"
            style={{
              width: "100%",
            }}
          />
          <Box px={1}>
            <Typography variant="h4" component="h4">
              Bharat Kumar
            </Typography>
            <Typography variant="h6" component="h6">
              AI00023
            </Typography>
            <Typography variant="p" component="p" my={0.5}>
              Designation: <span style={{ fontWeight: 500 }}>Manager</span>
            </Typography>
            <Typography variant="p" component="p" my={0.5}>
              Department: <span style={{ fontWeight: 500 }}>ERP</span>
            </Typography>
            <Typography variant="p" component="p" my={0.5}>
              Institute:{" "}
              <span style={{ fontWeight: 500 }}>Acharya Polytechnic</span>
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Box className={classes.card} fontSize="1rem">
          <Typography
            component="h6"
            variant="h6"
            className={classes.cardHeader}
          >
            Contact
          </Typography>
          <Box p={1}>
            <Typography component="h6" variant="h6">
              Address
            </Typography>
            <Typography component="p" variant="p" mb={2}>
              #232, 4th cross, 2nd main, 6th block, shivajinagar, bangalore
            </Typography>
            <Typography component="h6" variant="h6">
              Phone number
            </Typography>
            <Typography component="p" variant="p" mb={2}>
              +91 2323454587
            </Typography>
            <Typography component="h6" variant="h6">
              Email address
            </Typography>
            <Typography component="p" variant="p" mb={2}>
              example.email@acharya.ac.in
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={12} md={5}>
        <Box className={classes.card} fontSize="1rem">
          <Typography
            component="h6"
            variant="h6"
            className={classes.cardHeader}
          >
            Expereince
          </Typography>
          <Box mx={1} mt={1}>
            <Typography component="h6" variant="h6">
              Skills
            </Typography>
            <Typography component="p" variant="p" mb={2}>
              Javascript, React, Typescript, Node, Mongo
            </Typography>
          </Box>

          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2,
              },
            }}
          >
            <TimelineItem>
              <TimelineOppositeContent fontWeight={500}>
                2021
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="blue" />
                <TimelineConnector sx={{ bgcolor: "blue.main" }} />
              </TimelineSeparator>
              <TimelineContent>
                <Typography component="p" variant="p" fontWeight={600}>
                  Tech Lead
                </Typography>
                <Typography component="p" variant="p" fontSize="0.8rem">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui
                  nesciunt nostrum similique enim exercitationem animi molestias
                  explicabo, hic aut quas.
                </Typography>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent fontWeight={500}>
                2018
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="blue" />
                <TimelineConnector sx={{ bgcolor: "blue.main" }} />
              </TimelineSeparator>
              <TimelineContent>
                <Typography component="p" variant="p" fontWeight={600}>
                  Frontend Developer
                </Typography>
                <Typography component="p" variant="p" fontSize="0.8rem">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Officia illo alias sint? Optio laborum minima dignissimos
                  suscipit illum corporis molestiae.
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box className={classes.card} p={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            flexWrap="wrap"
          >
            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <PersonRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Details
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Education
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <PersonRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Expereince
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Attendance
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <PersonRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Punching
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Leave Kitty
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <PersonRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Salary
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Increment
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <PersonRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Personal
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Research Profile
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <PersonRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Academic Assessment
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                HR Attachments
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <PersonRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Assessment Review
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Profile Addon
              </Typography>
            </Box>

            <Box className={classes.optionContainer}>
              <Box className={classes.optionButton}>
                <SchoolRoundedIcon className={classes.icon} />
              </Box>
              <Typography variant="p" component="p">
                Student Feedback
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Profile;
