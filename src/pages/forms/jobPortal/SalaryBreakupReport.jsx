import React from "react";
import {
  Grid,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

const SalaryBreakupReport = ({ data }) => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} align="center" mt={3}>
        <TableContainer component={Paper} sx={{ width: { md: 500 } }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center" className={classes.bg}>
                  Salary Break Up
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} align="left">
                  <Typography variant="subtitle2">Earnings</Typography>
                </TableCell>
              </TableRow>
              {data.earnings
                .sort((a, b) => {
                  return a.priority - b.priority;
                })
                .map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{val.headName}</TableCell>
                      <TableCell align="right">{val.value.toFixed()}</TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Gross Earning </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">
                    {data.grossEarning.toFixed()}
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} align="left">
                  <Typography variant="subtitle2">Deductions</Typography>
                </TableCell>
              </TableRow>
              {data.deductions
                .sort((a, b) => {
                  return a.priority - b.priority;
                })
                .map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{val.headName}</TableCell>
                      <TableCell align="right">{val.value.toFixed()}</TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Total Deductions</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">
                    {data.totDeduction.toFixed()}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} align="left">
                  <Typography variant="subtitle2">
                    Management Contribution
                  </Typography>
                </TableCell>
              </TableRow>
              {data.management
                .sort((a, b) => {
                  return a.priority - b.priority;
                })
                .map((val, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{val.headName}</TableCell>
                      <TableCell align="right">{val.value.toFixed()}</TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2"> Cost to Company</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">
                    {(data.grossEarning + data.totManagement).toFixed()}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Net Pay</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">
                    {(data.grossEarning - data.totDeduction).toFixed()}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default SalaryBreakupReport;
