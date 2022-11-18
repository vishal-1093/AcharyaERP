import React from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@mui/material";

const SalaryBreakupDetails = ({ data }) => {
  return (
    <>
      <Grid item xs={12} align="center" mt={3}>
        <TableContainer component={Paper} sx={{ width: { md: 500 } }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                  sx={{
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: (theme) => theme.palette.headerWhite.main,
                  }}
                  //   sx={{
                  //     backgroundColor: `${theme.palette.primary.main}`,
                  //   }}
                >
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

export default SalaryBreakupDetails;
