import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { convertToDMY } from "../../../utils/DateTimeUtils";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

const ResultReport = ({ data }) => {
  const classes = useStyles();
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              RESULT
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              rowSpacing={1}
              component={Paper}
              elevation={3}
              mt={1}
              p={2}
            >
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Applicant Name</Typography>
              </Grid>
              <Grid item xs={12} md={10.5}>
                <Typography variant="body2" color="textSecondary">
                  {data[0].firstname}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Email</Typography>
              </Grid>
              <Grid item xs={12} md={10.5}>
                <Typography variant="body2" color="textSecondary">
                  {data[0].email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Interview Date</Typography>
              </Grid>
              <Grid item xs={12} md={10.5}>
                <Typography variant="body2" color="textSecondary">
                  {`${convertToDMY(data[0].interview_date.slice(0, 10))}`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Status</Typography>
              </Grid>
              <Grid item xs={12} md={10.5}>
                <Typography variant="body2" color="textSecondary">
                  {data[0].approve === true ? (
                    <Typography variant="subtitle2" color="success.main">
                      Selected
                    </Typography>
                  ) : (
                    <Typography variant="subtitle2" color="error.main">
                      Rejected
                    </Typography>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={1} columnSpacing={2}>
              {data.map((val, i) => {
                return (
                  <Grid item xs={12} md={4} key={i}>
                    <Card elevation={3}>
                      <CardContent>
                        <Grid container rowSpacing={1}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2">
                              Interviewer
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {val.interviewer_name + " - " + val.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>

                          <Grid item xs={12}>
                            <Typography variant="body2" color="success">
                              {val.interviewer_comments}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Grid container rowSpacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">HR</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {data[0].hr_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {data[0].hr_remarks}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ResultReport;
