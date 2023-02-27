import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Box,
  Grid,
  Typography,
  Paper,
  FormGroup,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { convertToDMY } from "../utils/DateTimeUtils";
import SalaryBreakupView from "./SalaryBreakupView";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

function EmployeeDetailsView({ empId, offerId }) {
  const [values, setValues] = useState({
    showPersonal: true,
    showEmployment: false,
    showBreakup: false,
  });
  const [data, setData] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const types = [
    {
      value: "showPersonal",
      label: "Personal Details",
    },
    {
      value: "showEmployment",
      label: "Employment Details",
    },
    {
      value: "showBreakup",
      label: "Salary Breakup",
    },
  ];

  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${empId}`)
      .then((res) => {
        axios
          .get(
            `/api/employee/getAllApplicantDetails/${res.data.data[0].job_id}`
          )
          .then((res) => {
            setJobDetails(res.data);
          })
          .catch((err) => console.error(err));
        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (value, name) => {
    setValues((prev) => ({
      ...prev,
      [name]: !value,
    }));
  };

  return (
    <>
      {Object.keys(data).length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Grid container rowSpacing={1.5}>
            <Grid
              item
              xs={12}
              sx={{ position: "sticky", top: 10, mb: 3, zIndex: 1 }}
            >
              <Paper elevation={3} sx={{ padding: "5px" }}>
                <FormGroup row>
                  {types.map((obj, i) => {
                    return (
                      <IconButton
                        onClick={() =>
                          handleChange(values[obj.value], obj.value)
                        }
                        key={i}
                      >
                        <RadioButtonCheckedIcon
                          color={values[obj.value] ? "primary" : ""}
                        />
                        <Typography variant="subtitle2">{obj.label}</Typography>
                      </IconButton>
                    );
                  })}
                </FormGroup>
              </Paper>
            </Grid>

            {values.showPersonal ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" className={classes.bg}>
                    Personal Details
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
                          {data.employee_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Gender</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.gender}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Marital Status
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.martial_status}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">DOB</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.dateofbirth}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Father Name</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.father_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Mobile No</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.mobile}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Alternative Mobile No
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.alt_mobile_no}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Blood Group</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.blood_group}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Aadhar No</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.aadhar}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Pan No</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.pan_no}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Permanant Address
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.hometown}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Current Address
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.current_location}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" className={classes.bg}>
                    Educational Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container rowSpacing={1} columnSpacing={2}>
                    {Object.keys(jobDetails).length > 0 ? (
                      jobDetails.Job_Profile.Educational_Details.map((e, i) => {
                        return (
                          <Grid item xs={12} md={4} key={i}>
                            <Card elevation={3}>
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
                                      Graduaction Name: {e.graduation_name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Graduation Institute: {e.school_name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      University Name: {e.university_name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      University Score: {e.academic_score}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Joining Date Score :
                                      {` ${convertToDMY(
                                        e.academic_year_joining
                                      )}`}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" className={classes.bg}>
                    Experience Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container rowSpacing={1} columnSpacing={2}>
                    {Object.keys(jobDetails).length > 0 ? (
                      jobDetails.Job_Profile.Experience_Details.map((e, i) => {
                        return (
                          <Grid item xs={12} md={4} key={i}>
                            <Card elevation={3}>
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
                                      Designation: {e.designation}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      CTC Drawn: {e.annual_salary_lakhs}
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
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </>
            ) : (
              <></>
            )}

            {values.showEmployment ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" className={classes.bg}>
                    Employment Details
                  </Typography>
                </Grid>
                <Grid item xs={12} component={Paper} elevation={3} p={2}>
                  <>
                    <Grid container rowSpacing={1.5} columnSpacing={2}>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Employee Code
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.empcode}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Email</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Employee Type
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.emp_type_short_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">DOJ</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {`${convertToDMY(data.date_of_joining.slice(0, 10))}`}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Designation</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.designation_short_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Salary Structure
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.salary_structure}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">PF No</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.pf_no}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">UAN No</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.uan_no}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">School</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.school}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Department</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.dept_name_short}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Leave Approver 1
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.leave_approver1_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Leave Approver 2
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.leave_approver2_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Preferred Name
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.preferred_name_for_email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Biometric Status
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.punched_card_status}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              </>
            ) : (
              <></>
            )}

            {values.showBreakup ? (
              <>
                <Grid item xs={12} md={6}>
                  <SalaryBreakupView id={offerId} />
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

export default EmployeeDetailsView;
