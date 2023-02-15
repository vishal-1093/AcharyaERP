import { Box, Grid, IconButton, Typography } from "@mui/material";
import jobPortalIndexSnap from "../../assets/JobPortalSnaps/jobPortalIndex.JPG";
import interviewSchedule from "../../assets/JobPortalSnaps/interviewSchedule.JPG";
import sendMailInterviewer from "../../assets/JobPortalSnaps/sendMailInterviewer.JPG";
import rescheduleInterview from "../../assets/JobPortalSnaps/rescheduleInterview.JPG";
import resultForm from "../../assets/JobPortalSnaps/resultForm.JPG";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";

function JobPortalDoc() {
  return (
    <>
      <Box>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary">
              Job Portal
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontSize="0.90rem">
              HR department gets all Job Application in this index. This is the
              base screen for on-boarding candidate.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <img src={jobPortalIndexSnap} alt="screenshot" width="100%" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary">
              Interview schedule
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">
              Interview schedule is used to schedule interview for the
              candidate, mail triggers to the interviewers first and then to the
              candidate.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <img src={interviewSchedule} alt="screenshot" width="100%" />
            <Typography variant="subtitle2">
              After entering all the records click on save button
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <img src={sendMailInterviewer} alt="screenshot" width="100%" />
            <Typography variant="subtitle2">
              After data saved successfully, Send mail to Interviewer and
              candidate, Interview is scheduled successfully.Interview can be
              rescheduled before Interviewer and HR comments by clicking on
              <IconButton>
                <EventRepeatIcon color="primary" />
              </IconButton>
              icon.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <img src={rescheduleInterview} alt="screenshot" width="100%" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">
              In the result form Interviewer and HR will give comments and will
              get result whether selected or rejected.
            </Typography>
            <img src={resultForm} alt="screenshot" width="100%" />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default JobPortalDoc;
