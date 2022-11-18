import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },

  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const FeeTemplateView = ({
  feeTemplateData,
  subAmountData,
  totalYearSem,
  scholarshipStatus,
  handleChangee,
  values,
  handleSave,
  scholarshipValues,
}) => {
  const temp = [];
  totalYearSem.forEach((val) => {
    temp.push(parseInt(scholarshipValues["year" + val.key]));
  });

  const classes = useStyles();
  return (
    <>
      <Box pt={3}>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Fee Template - {feeTemplateData.fee_template_name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Grid item xs={12} p={1.5}>
                <Grid container alignItems="center" rowSpacing={1}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Academic Year</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.ac_year}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Fee Template Id</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.fee_template_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Paid At Board</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.Is_paid_at_board ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">School</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.school_name_short}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Program</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.program_short_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">
                      Program Specialization
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.program_specialization_short_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Currency</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.currency_type_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Nationality</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.nationality}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">
                      Admission Category
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.fee_admission_category_short_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">
                      Admission Sub Category
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      {feeTemplateData.fee_admission_sub_category_name}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#d3d3d3",
                      color: "white",
                    }}
                  >
                    <TableCell align="center">Particulars</TableCell>
                    {totalYearSem.map((val, i) => {
                      return (
                        <TableCell key={i} align="right">
                          {val.value}
                        </TableCell>
                      );
                    })}
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subAmountData.map((val, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{val.voucher_head}</TableCell>
                        {totalYearSem.map((v, i) => {
                          return (
                            <TableCell key={i} align="right">
                              {val["year" + v.key + "_amt"]}
                            </TableCell>
                          );
                        })}
                        <TableCell>{val.total_amt}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">Total</Typography>
                    </TableCell>
                    {totalYearSem.map((v, i) => {
                      return (
                        <TableCell key={i} align="right">
                          <Typography variant="subtitle2">
                            {subAmountData[0]["fee_year" + v.key + "_amt"]}
                          </Typography>
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Typography variant="subtitle2">
                        {feeTemplateData.fee_year_total_amount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {scholarshipStatus === "true" ? (
                    <>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">
                            Scholarship
                          </Typography>
                        </TableCell>
                        {totalYearSem.map((val, i) => {
                          return (
                            <TableCell key={i}>
                              <CustomTextField
                                name={val.key}
                                label=""
                                value={scholarshipValues["year" + val.key]}
                                handleChange={handleChangee}
                                // checks={checks.studentName}
                                // errors={errorMessages.studentName}
                                // required
                                InputProps={{ textAlign: "center" }}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    "& input": {
                                      textAlign: "right",
                                    },
                                  },
                                }}
                              />
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Typography variant="subtitle2">
                            {temp.reduce((a, b) => a + b)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">
                            Grand Total
                          </Typography>
                        </TableCell>
                        {totalYearSem.map((val, i) => {
                          return (
                            <TableCell key={i} align="right">
                              <Typography variant="subtitle2">
                                {scholarshipValues["grandTotal" + val.key]}
                              </Typography>
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Typography variant="subtitle2">
                            {feeTemplateData.fee_year_total_amount -
                              temp.reduce((a, b) => a + b)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    ""
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} align="right">
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default FeeTemplateView;
