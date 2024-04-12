import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token;

const types = [
  {
    label: "Online Class",
    value: "onlineClass",
    icon: <VideocamIcon />,
    btnLabel: "Join",
    disable: false,
    body: "Join online classes with strict attendance monitoring. Stay attentive to ensure your attendance is updated accurately.",
  },
  {
    label: "Assignments",
    value: "assignment",
    icon: <AssignmentIcon />,
    btnLabel: "Click",
    disable: false,
    body: "Submit assignments online or upload PDFs seamlessly. Simplify the submission process for students.",
  },
  {
    label: "Study Material",
    value: "material",
    icon: <CastForEducationIcon />,
    btnLabel: "Click",
    disable: false,
    body: " Access study materials uploaded by our faculty. Download any materials you need for your academic journey.",
  },
  {
    label: "Exam MCQ",
    value: "exams",
    icon: <QuestionAnswerIcon />,
    btnLabel: "Click",
    disable: false,
    body: "Take faculty-conducted multiple-choice exams with locked windows, ensuring a fair assessment environment for all students. During Exam Students can't minimize the window.",
  },
];

const lmsUrl = "https://lms-uz.alive.university/session/";

function StudentOnlineClass() {
  const handleCreate = async (type) => {
    if (type === "onlineClass") {
      window.open(lmsUrl + token);
    } else {
      window.open(lmsUrl + token + "?module=" + type);
    }
  };

  return (
    <Box m={{ md: 2 }}>
      <Grid container rowSpacing={4} columnSpacing={3}>
        {types.map((obj, i) => {
          return (
            <Grid item xs={12} md={4} key={i}>
              <Card
                elevation={3}
                sx={{ padding: 2, backgroundColor: "#f3f6f9" }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor: "auzColor.main",
                        color: "#f3f6f9",
                      }}
                    >
                      {obj.icon}
                    </Avatar>
                  }
                  title={obj.label}
                  titleTypographyProps={{ variant: "h6" }}
                  sx={{ color: "auzColor.main", padding: 1 }}
                />
                <CardContent>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography color="textSecondary" textAlign="justify">
                        {obj.body}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item xs={12} align="right">
                      <Button
                        variant="contained"
                        onClick={() => handleCreate(obj.value)}
                        sx={{
                          backgroundColor: "secondary.main",
                          ":hover": {
                            bgcolor: "auzColor.main",
                          },
                        }}
                        disabled={obj.disable}
                      >
                        <Typography variant="subtitle2">
                          {obj.btnLabel}
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default StudentOnlineClass;
