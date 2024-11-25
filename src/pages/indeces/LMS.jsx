import { Card, CardContent, Grid, IconButton, Typography, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import iconsList from "../../utils/MenuIcons";

const getIcon = (iName) => {
  const object = iconsList.filter((obj) => obj.name === iName)[0];
  return object
    ? object.icon
    : iconsList.filter((obj) => obj.name === "Default")[0].icon;
};

const LMS = () => {
  const [loading, setLoading] = useState(Array(8).fill(false));
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const [CardNameList, setCardNameList] = useState([]);

  useEffect(() => {
    setCrumbs([{}]);
    setCardNameList([
      { name: "Question Banks", icon: "ListAltIcon", desc: "Create and manage question banks for each subject, where each question belongs to a particular topic. Use question banks to create quizzes.", module: "questionbank" },
      { name: "Quizzes", icon: "QuizIcon", desc: "Assign quizzes to classes. Quizzes can be created from the question banks instantly. The same quiz can be used for multiple classes.", module: "quizzes" },
      { name: "Discussions", icon: "HandshakeIcon", desc: "Engage in discussions on various topics related to specific subjects. These forums allow participants to share their opinions, ask questions, and collaborate academically. The forums are open for all students to view, like, and comment on, fostering a dynamic and interactive learning environment.", module: "discussions" },
      { name: "Resume Builder", icon: "LibraryBooksIcon", desc: " Build your resume by just filling in your details in a simple form.", module: "resume-builder" },
      { name: "Online Class", icon: "VideoCameraFrontIcon", desc: "Join online classes with strict attendance monitoring. Stay attentive to ensure your attendance is updated accurately.", module: "online_classes" },
      { name: "Assignments", icon: "AssignmentIcon", desc: "Submit assignments online or upload PDFs seamlessly. Simplify the submission process for students.", module: "assignment" },
      { name: "Study Material", icon: "MenuBookIcon", desc: "Access study materials uploaded by our faculty. Download any materials you need for your academic journey.", module: "material" },
      { name: "Exam MCQ", icon: "ChecklistIcon", desc: "Take faculty-conducted multiple-choice exams with locked windows, ensuring a fair assessment environment for all students. During Exam Students can't minimize the window.", module: "exams" }
    ])
  }, []);

  const handleClick = async (moduleName, index) => {
    try {
      setLoading((prevLoading => prevLoading.map((ele, i) => (i == index ? true : false))));
      let payload = {
        token: JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.token
      }
      const res = await axios.post(`api/lms/login`, payload);
      if (res.status == 200) {
        navigate(`/alive.university/session/${res.data.data.accessToken}?module=${moduleName}`)
      }
    } catch (err) {
      setLoading([false]);
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
    }
  }

  return (
    <Grid container alignItems="flex-start" spacing={1.5} mb={2}>
      {CardNameList?.map((obj, i) => {
        return (
          <Grid item sm={12} md={4} key={i}>
            <Card sx={{ backgroundColor: "#F0F0F0", cursor: "pointer", height: "180px" }}>
              <CardContent>
                <Grid container justifyContent="flex-start" rowSpacing={2}>
                  <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px" }}>
                    <IconButton style={{ padding: "0px 8px 8px 0px" }} color="primary">{getIcon(obj.icon)}</IconButton>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "auzColor.main",
                        textAlign: "center",
                      }}
                      gutterBottom
                      variant="subtitle2"
                    >
                      <p>{obj.name}</p>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ paddingTop: "6px", height: "70px" }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "auzColor.main",
                        textAlign: "center",
                        textAlign: "justify"
                      }}
                      gutterBottom
                      variant="paragraph"
                    >
                      <p>{obj.desc.length > 150 ? obj.desc.substring(0, 142) + "..." : obj.desc}</p>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} align="right" mt={1}>
                  <Button variant="contained" color="primary" onClick={() => handleClick(obj.module, i)}>
                    {loading[i] ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      "Click"
                    )}</Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LMS;
