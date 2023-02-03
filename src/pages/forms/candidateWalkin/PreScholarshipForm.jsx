import {
  Box,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
}));

function PreScholarshipForm({
  scholarshipValues,
  noOfYears,
  feeTemplateData,
  handleChangeSholarship,
  scholarshipTotal,
  feeTemplateSubAmountData,
  programType,
}) {
  const classes = useStyles();

  return (
    <>
      <Box>
        <Grid container rowSpacing={1}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Fee Template
            </Typography>
          </Grid>
          {/* Fee Template Details Display Starts */}
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
                {/* 1st  row  */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Fee Template</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.fee_template_name}
                  </Typography>
                </Grid>
                {/* 2nd row */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Academic Year</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.ac_year}
                  </Typography>
                </Grid>
                {/* 4th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Paid At Board</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.Is_paid_at_board ? "Yes" : "No"}
                  </Typography>
                </Grid>
                {/* 5th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">School</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.school_name_short}
                  </Typography>
                </Grid>
                {/* 6th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Program</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.program_short_name}
                  </Typography>
                </Grid>
                {/* 7th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">
                    Program Specialization
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.program_specialization_short_name}
                  </Typography>
                </Grid>
                {/* 8th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Currency</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.currency_type_name}
                  </Typography>
                </Grid>
                {/* 9th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Nationality</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.nationality}
                  </Typography>
                </Grid>
                {/* 10th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">
                    Admission Category
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.fee_admission_category_short_name}
                  </Typography>
                </Grid>
                {/* 11th */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">
                    Admission Sub Category
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {feeTemplateData.fee_admission_sub_category_name}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Fee Template Details Display Ends */}

          {/* Fee Template Details Sub Amount Details Display Starts */}
          <Grid item xs={12} mt={1}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white" }}>Particulars</TableCell>
                    {noOfYears.map((val, i) => {
                      return (
                        <TableCell
                          key={i}
                          align="right"
                          sx={{ color: "white" }}
                        >
                          {val.value}
                        </TableCell>
                      );
                    })}
                    <TableCell align="right" sx={{ color: "white" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {feeTemplateSubAmountData.map((val, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{val.voucher_head}</TableCell>
                        {noOfYears.map((v, i) => {
                          return (
                            <TableCell key={i} align="right">
                              {val["year" + v.key + "_amt"]}
                            </TableCell>
                          );
                        })}
                        <TableCell align="right">{val.total_amt}</TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">Total</Typography>
                    </TableCell>
                    {noOfYears.map((v, i) => {
                      return (
                        <TableCell key={i} align="right">
                          <Typography variant="subtitle2">
                            {feeTemplateSubAmountData.length > 0 ? (
                              feeTemplateSubAmountData[0][
                                "fee_year" + v.key + "_amt"
                              ]
                            ) : (
                              <></>
                            )}
                          </Typography>
                        </TableCell>
                      );
                    })}
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {feeTemplateData.fee_year_total_amount}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">Scholarship</Typography>
                    </TableCell>

                    {noOfYears.map((val, i) => {
                      return (
                        <TableCell key={i} align="right">
                          <CustomTextField
                            name={val.key}
                            value={
                              scholarshipValues[programType + val.key]
                                ? scholarshipValues[programType + val.key]
                                : 0
                            }
                            handleChange={handleChangeSholarship}
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

                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {scholarshipTotal}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">Grand Total</Typography>
                    </TableCell>
                    {feeTemplateSubAmountData.length > 0
                      ? noOfYears.map((val, i) => {
                          return (
                            <TableCell key={i} align="right">
                              <Typography variant="subtitle2">
                                {feeTemplateSubAmountData.length
                                  ? feeTemplateSubAmountData[0][
                                      "fee_year" + val.key + "_amt"
                                    ] - scholarshipValues[programType + val.key]
                                  : ""}
                              </Typography>
                            </TableCell>
                          );
                        })
                      : ""}
                    <TableCell>
                      <Typography variant="subtitle2">
                        {feeTemplateData.fee_year_total_amount -
                          scholarshipTotal}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* Fee Template Details Sub Amount Details Display Ends */}
        </Grid>
      </Box>
    </>
  );
}

export default PreScholarshipForm;
