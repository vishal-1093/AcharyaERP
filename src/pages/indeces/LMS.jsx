import { Card, CardContent, Grid, IconButton, Typography,Button } from "@mui/material";
import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import iconsList from "../../utils/MenuIcons";

const getIcon = (iName) => {
  const object = iconsList.filter((obj) => obj.name === iName)[0];
  return object
    ? object.icon
    : iconsList.filter((obj) => obj.name === "Default")[0].icon;
};

const LMS = () => {
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const [CardNameList,setCardNameList] = useState([]);

  useEffect(()=>{
    setCrumbs([{}]);
    setCardNameList([
      { name: "Question Banks", icon: "ListAltIcon",desc:"Create and manage question banks for each subject, where each question belongs to a particular topic. Use question banks to create quizzes." },
      { name: "Quizzes", icon: "QuizIcon",desc:"Assign quizzes to classes. Quizzes can be created from the question banks instantly. The same quiz can be used for multiple classes." },
      { name: "Discussions", icon: "HandshakeIcon",desc:"Engage in discussions on various topics related to specific subjects. These forums allow participants to share their opinions, ask questions, and collaborate academically. The forums are open for all students to view, like, and comment on, fostering a dynamic and interactive learning environment." },
      { name: "Resume Builder", icon: "LibraryBooksIcon",desc:" Build your resume by just filling in your details in a simple form." }
    ])
  },[])

  return (
    <Grid container alignItems="flex-start" spacing={3} mt={1}>
      {CardNameList?.map((obj, i) => {
        return (
          <Grid item sm={12} md={4} key={i}>
            <Card sx={{ backgroundColor: "#F0F0F0", cursor: "pointer" }}>
              <CardContent>
                <Grid container justifyContent="flex-start" rowSpacing={2}>
                  <Grid item xs={12} sx={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"flex-start", gap:"10px"}}>
                    <IconButton color="primary">{getIcon(obj.icon)}</IconButton>
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
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "auzColor.main",
                        textAlign: "center",
                        textAlign:"justify"
                      }}
                      gutterBottom
                      variant="paragraph"
                    >
                      <p>{obj.desc.length > 250 ? obj.desc.substring(0, 158) + "..." : obj.desc}</p>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} align="right" mt={1}>
                <Button variant="contained" color="primary"> Click</Button>
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
