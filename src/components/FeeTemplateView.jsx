import { useState, useEffect } from "react";
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
import axios from "../services/Api";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

function FeeTemplateView({ feeTemplateId, candidateId, type }) {
  const [feeTemplateData, setFeeTemplateData] = useState({});
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [scholarshipData, setScholarshipData] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // FeeTemplate
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${feeTemplateId}`)
      .then((res) => {
        const templateData = res.data.data[0];

        axios
          .get(
            `/api/academic/FetchAcademicProgram/${templateData.ac_year_id}/${templateData.program_id}/${templateData.school_id}`
          )
          .then((res) => {
            const yearSem = [];

            if (templateData.program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                yearSem.push({ key: i, value: "Year " + i });
              }
            } else if (
              templateData.program_type_name.toLowerCase() === "semester"
            ) {
              for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
                yearSem.push({ key: i, value: "Sem " + i });
              }
            }

            setNoOfYears(yearSem);
          })
          .catch((err) => console.error(err));

        setFeeTemplateData(templateData);
      })
      .catch((err) => console.error(err));

    //   FeeTemplateSubAmount
    await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${feeTemplateId}`)
      .then((res) => {
        setFeeTemplateSubAmountData(res.data.data);
      })
      .catch((err) => console.error(err));

    if (type === 3) {
      //Scholarship
      await axios
        .get(`/api/student/fetchscholarship/${candidateId}`)
        .then((res) => {
          const scholarshipData = res.data.data[0];
          axios
            .get(
              `/api/student/fetchScholarship2/${scholarshipData.scholarship_id}`
            )
            .then((res) => {
              setScholarshipData(res.data.data[0]);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={1}>
          {/* Fee Template Details Display Starts */}
          {type === 1 || type === 2 || type === 3 ? (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle2" className={classes.bg}>
                  Fee Template
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
                        {feeTemplateData.program_specialization}
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
            </>
          ) : (
            <></>
          )}
          {/* Fee Template Details Display Ends */}

          {/* Fee Template Details Sub Amount Details Display Starts */}

          <Grid item xs={12} mt={1}>
            {type === 2 || type === 3 || type === 4 ? (
              <TableContainer component={Paper} elevation={3}>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.bg} sx={{ color: "white" }}>
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
                    {type === 3 ? (
                      <>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Scholarship
                            </Typography>
                          </TableCell>
                          {noOfYears.map((v, i) => {
                            return (
                              <TableCell key={i} align="right">
                                <Typography variant="subtitle2">
                                  {scholarshipData["year" + v.key + "_amount"]}
                                </Typography>
                              </TableCell>
                            );
                          })}
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              {scholarshipData.requested_scholarship}
                            </Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Grand Total
                            </Typography>
                          </TableCell>

                          {noOfYears.map((v, i) => {
                            return (
                              <TableCell key={i} align="right">
                                <Typography variant="subtitle2">
                                  {feeTemplateSubAmountData.length > 0
                                    ? (
                                        feeTemplateSubAmountData[0][
                                          "fee_year" + v.key + "_amt"
                                        ] -
                                        scholarshipData[
                                          "year" + v.key + "_amount"
                                        ]
                                      ).toString()
                                    : 0}
                                </Typography>
                              </TableCell>
                            );
                          })}

                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              {(
                                feeTemplateData.fee_year_total_amount -
                                scholarshipData.requested_scholarship
                              ).toString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <></>
            )}
          </Grid>

          {/* Fee Template Details Sub Amount Details Display Ends */}
        </Grid>
      </Box>
    </>
  );
}

export default FeeTemplateView;
