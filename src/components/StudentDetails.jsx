import { useState, useEffect } from "react";
import axios from "../services/Api";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { convertToDMY } from "../utils/DateTimeUtils";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

function StudentDetails({ id }) {
  const [studentDetails, setStudentDetails] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/student/Student_DetailsAuid/${id}`)
      .then((res) => {
        setStudentDetails(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Student Details
            </Typography>
          </Grid>

          <Grid item xs={12} component={Paper} elevation={3} p={2}>
            <>
              <Grid container rowSpacing={1.5} columnSpacing={2}>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.student_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">AUID</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.auid}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">USN</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.usn}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Date of Admission</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.date_of_admission}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">DOB</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {convertToDMY(studentDetails.dateofbirth)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Gender</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.candidate_sex}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Father Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.father_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Mobile</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.mobile}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">School</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.school_name_short}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Program</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.program_short_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Specialization</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.program_specialization_short_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">
                    Admission Category
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.fee_admission_category_type}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Fee Template</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {studentDetails.fee_template_name}
                  </Typography>
                </Grid>
              </Grid>
            </>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default StudentDetails;
