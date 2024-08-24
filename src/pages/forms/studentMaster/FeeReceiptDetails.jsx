import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "5px",
    borderRadius: "2px",
  },
  yearSem: {
    color: theme.palette.error.main,
    border: "1px solid rgba(0, 0, 0, 1)",
    padding: "2px",
    borderRadius: "2px",
  },

  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}));

function FeeReceiptDetails() {
  const [studentData, setStudentData] = useState([]);
  const [data, setData] = useState([]);
  const [voucherHeadIds, setVoucherHeadIds] = useState([]);
  const [total, setTotal] = useState();
  const [noOfYears, setNoOfYears] = useState([]);
  const [programType, setProgramType] = useState();

  const { auid } = useParams();
  const { studentId } = useParams();
  const { feeReceipt } = useParams();
  const { financialYearId } = useParams();
  const { transactionType } = useParams();
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      const b = Object.keys(data);
      const c = Object.keys(data).indexOf("student_details");
      b.splice(c, 1);

      b.forEach((obj) => {
        let temp = 0;
        temp += Object.values(data[obj]).reduce((a, b) => {
          const x = Number(a) > 0 ? Number(a) : 0;
          const y = Number(b) > 0 ? Number(b) : 0;
          return x + y;
        });
        setTotal(temp);
      });
    }
  }, [data]);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/getDataForDisplayingFeeReceipt/${studentId}/${financialYearId}/${feeReceipt}/${transactionType}/${0}`
      )
      .then((resOne) => {
        console.log(resOne);

        setData(resOne.data.data);
        setStudentData(resOne.data.data.student_details[0]);

        axios
          .get(
            `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${studentId}`
          )
          .then(async (res) => {
            const Ids = [];
            res.data.data.fee_template_sub_amount_info.forEach((obj) => {
              Object.keys(resOne.data.data).forEach((obj1) => {
                if (Number(obj1) === obj.voucher_head_new_id) {
                  Ids.push({
                    id: obj.voucher_head_new_id,
                    label: obj.voucher_head,
                  });
                }
              });
            });
            setVoucherHeadIds(Ids);

            Ids.forEach((obj) => {
              setNoOfYears(Object.keys(resOne.data.data[obj.id]));
            });

            await axios
              .get(`/api/student/studentDetailsByAuid/${auid}`)
              .then((res) => {
                const years = [];
                const yearsValue = {};
                const showTable = {};

                if (
                  res.data.data[0].program_type_name.toLowerCase() === "yearly"
                ) {
                  for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                    setProgramType("year");
                    years.push({ key: i, label: "Year" + i });
                    yearsValue["year" + i] = 0;
                    showTable[i] = true;
                  }
                } else if (
                  res.data.data[0].program_type_name.toLowerCase() ===
                  "semester"
                ) {
                  setProgramType("sem");
                  for (
                    let i = 1;
                    i <= res.data.data[0].number_of_semester;
                    i++
                  ) {
                    years.push({ key: i, label: "Sem" + i });
                    yearsValue["year" + i] = 0;
                    showTable[i] = true;
                  }
                }
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormPaperWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={0}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-start"
              rowSpacing={1}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} md={12} mt={2}>
                <Typography className={classes.bg}>Fee Receipt</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Paper elevation={2}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    rowSpacing={1}
                    pl={2}
                    pr={2}
                    pb={1}
                    pt={1}
                  >
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">Receipt No</Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Typography variant="body2" color="textSecondary">
                        {feeReceipt.split("_").join("-")}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">Receipt Date</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {studentData.created_date
                          ? moment(studentData.created_date).format(
                              "DD-MM-YYYY"
                            )
                          : ""}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">Name</Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Typography variant="body2" color="textSecondary">
                        {studentData.student_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">AUID</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {studentData.auid}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">
                        Academic Batch
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Typography variant="body2" color="textSecondary">
                        {"NA"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">
                        Financial Year
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {studentData.financial_year
                          ? studentData.financial_year
                          : "NA"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">Cashier</Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Typography variant="body2" color="textSecondary">
                        {studentData.created_username
                          ? studentData.created_username
                          : "NA"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">
                        Transaction Type
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {transactionType}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                  <Table size="small" ref={tableRef}>
                    <TableHead className={classes.bg}>
                      <TableRow>
                        <TableCell sx={{ color: "white" }}>Fee Heads</TableCell>
                        {programType === "year"
                          ? noOfYears.map((obj, i) => {
                              return (
                                <TableCell sx={{ color: "white" }} key={i}>
                                  {"Year" + obj}
                                </TableCell>
                              );
                            })
                          : noOfYears.map((obj, i) => {
                              return (
                                <TableCell sx={{ color: "white" }} key={i}>
                                  {"Sem" + obj}
                                </TableCell>
                              );
                            })}

                        <TableCell sx={{ color: "white" }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {voucherHeadIds.length > 0 ? (
                        voucherHeadIds.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{obj.label}</TableCell>
                              {noOfYears.map((obj1, j) => {
                                return (
                                  <TableCell key={j}>
                                    {data[obj.id] !== undefined &&
                                    data[obj.id][obj1]
                                      ? data[obj.id][obj1]
                                      : 0}
                                  </TableCell>
                                );
                              })}
                              <TableCell>
                                {Object.values(data[obj.id]).length > 0
                                  ? Object.values(data[obj.id]).reduce(
                                      (a, b) => {
                                        const x = Number(a) > 0 ? Number(a) : 0;
                                        const y = Number(b) > 0 ? Number(b) : 0;
                                        return x + y;
                                      }
                                    )
                                  : 0}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      <TableRow>
                        <TableCell>Total</TableCell>
                        {noOfYears.length > 0 ? (
                          noOfYears.map((obj, i) => {
                            return (
                              <TableCell key={i}>
                                {Object.values(data)
                                  .map((obj1) => obj1[obj])
                                  .reduce((a, b) => {
                                    const x = Number(a) > 0 ? Number(a) : 0;
                                    const y = Number(b) > 0 ? Number(b) : 0;
                                    return x + y;
                                  })}
                              </TableCell>
                            );
                          })
                        ) : (
                          <></>
                        )}
                        <TableCell>{total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                  }}
                  onClick={() =>
                    navigate(
                      `/FeeReceiptDetailsPDF/${auid}/${studentId}/${feeReceipt}/${financialYearId}/${transactionType}`
                    )
                  }
                >
                  Print
                </Button>
              </Grid>
              <Grid item xs={12} md={12} align="right">
                <Typography variant="subtitle2">
                  Remarks : {studentData.remarks ? studentData.remarks : "NA"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default FeeReceiptDetails;
