import { Grid, Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "5px",
    borderRadius: "2px",
  },
}));

function StudentDetails({ studentData }) {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={1}
        columnSpacing={{ xs: 2, md: 4 }}
      >
        <Grid item xs={12} md={12} mt={2}>
          <Typography className={classes.bg}>Student Details</Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={2}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              rowSpacing={1}
              pl={2}
              pr={2}
              pb={1}
              pt={1}
            >
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">AUID</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.auid}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">School</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.school_name_short}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Name</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.student_name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Program</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.program_name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">DOA</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="body2" color="textSecondary">
                  {moment(studentData.date_of_admission).format("DD-MM-YYYY")}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Admission Category</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.fee_admission_category_type}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Year/Sem</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.current_sem}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Template</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.fee_template_name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Email</Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.acharya_email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2">Mobile</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="textSecondary">
                  {studentData.mobile}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default StudentDetails;
