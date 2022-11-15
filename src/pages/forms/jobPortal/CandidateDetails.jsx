import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { convertToDMY } from "../../../utils/DateTimeUtils";

const CandidateDetails = ({ data }) => {
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Grid container rowSpacing={1.5}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.headerWhite.main,
                padding: 0.5,
              }}
            >
              Applicant Details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={1}>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Name</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.firstname}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Marital Status</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.martial_status}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Email</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.email}
                </Typography>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Link (Git,Drive)</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.linkedin_id}
                </Typography>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Gender</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.gender}
                </Typography>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">LinkedIn</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.linkedin_id}
                </Typography>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Date of Birth</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {`${convertToDMY(data.Job_Profile.dateofbirth)}`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Key Skills</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.key_skills}
                </Typography>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Mobile</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.mobile}
                </Typography>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <Typography variant="subtitle2">Address</Typography>
              </Grid>
              <Grid item xs={12} md={4.5}>
                <Typography variant="body2" color="textSecondary">
                  {data.Job_Profile.street + ", "}
                  {data.Job_Profile.locality + ", "}
                  {data.Job_Profile.city_name + ", "}
                  {data.Job_Profile.state_name + ", "}
                  {data.Job_Profile.country_name + " "}
                  {data.Job_Profile.pincode}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.headerWhite.main,
                padding: 0.5,
              }}
            >
              Educational Details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={1} columnSpacing={2}>
              {data.Job_Profile.Educational_Details.length > 0
                ? data.Job_Profile.Educational_Details.map((e, i) => {
                    return (
                      <Grid item xs={12} md={4} key={i}>
                        <Card>
                          <CardContent>
                            <Grid container rowSpacing={1}>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2">
                                  {e.graduation}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Graduaction Name : {e.graduation_name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Graduation Institute : {e.school_name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  University Name : {e.university_name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  University Score : {e.academic_score}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Joining Date Score :
                                  {` ${convertToDMY(e.academic_year_joining)}`}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
                : "no"}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.headerWhite.main,
                padding: 0.5,
              }}
            >
              Experience Details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={1} columnSpacing={2}>
              {data.Job_Profile.Experience_Details.length > 0
                ? data.Job_Profile.Experience_Details.map((e, i) => {
                    return (
                      <Grid item xs={12} md={4} key={i}>
                        <Card>
                          <CardContent>
                            <Grid container rowSpacing={1}>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2">
                                  {e.employer_name}
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Designation : {e.designation}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  CTC Drawn : {e.annual_salary_lakhs}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Experience :
                                  {" " +
                                    e.exp_in_years +
                                    " Years " +
                                    e.exp_in_months +
                                    " Months"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
                : "no"}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.headerWhite.main,
                padding: 0.5,
              }}
            >
              Documents
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={1} columnSpacing={2}>
              <Grid item xs={12} md={3}>
                <Link
                  to={`/CandidateAttachment/${data.Job_Profile.job_id}/1`}
                  style={{ textDecoration: "none" }}
                  target="blank"
                >
                  <IconButton>
                    <DescriptionOutlined />
                    <Typography variant="body2">Resume</Typography>
                  </IconButton>
                </Link>
              </Grid>
              <Grid item xs={12} md={3}>
                <Link
                  to={`/CandidateAttachment/${data.Job_Profile.job_id}/2`}
                  style={{ textDecoration: "none" }}
                  target="blank"
                >
                  <IconButton>
                    <DescriptionOutlined />
                    <Typography variant="body2">Higher Education</Typography>
                  </IconButton>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CandidateDetails;
