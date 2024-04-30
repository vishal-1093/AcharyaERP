import { useState, useEffect } from "react";
import { Box, Grid, Typography, Paper, Button } from "@mui/material";
import SalaryBreakupView from "../../components/SalaryBreakupView";
import { makeStyles } from "@mui/styles";
import axios from "../../services/Api";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

function EmployeeSalaryApprove({ empId, offerId }) {
  const [data, setData] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    getEmployeeData();
  }, []);

  const getEmployeeData = async () => {
    await axios
      .get(`/api/employee/getNewJoineeDetailsByEmpID/${empId}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={1}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              New Joinee Employees
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Grid
                container
                alignItems="center"
                rowSpacing={1}
                pl={2}
                pr={2}
                pb={1}
                pt={1}
              >
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Staff Code</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {data?.empcode}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Staff Name</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {data?.employee_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Date of joining</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {moment(data?.date_of_joining).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Department</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {data?.dept_name_short}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Designation</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {data?.designation_short_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Salary Structure</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {data?.salary_structure}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <SalaryBreakupView id={offerId} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default EmployeeSalaryApprove;
