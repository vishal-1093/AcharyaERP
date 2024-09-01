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
  const [noOfYears, setNoOfYears] = useState([]);
  const [programType, setProgramType] = useState();
  const [particularsData, setParticularsData] = useState([]);
  const [particularsTotal, setParticularsTotal] = useState([]);
  const [yearSemTotal, setYearSemTotal] = useState([]);
  const [grandTotal, setGrantTotal] = useState("");
  const [email, setEmail] = useState("");

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

  const getData = async () => {
    const feeReceiptData = await axios
      .get(
        `/api/finance/getDataForDisplayingFeeReceipt/${studentId}/${financialYearId}/${feeReceipt}/${transactionType}/${0}`
      )
      .then((res) => {
        setStudentData(res.data.data.student_details[0]);
        return res.data.data;
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/student/studentDetailsByAuid/${auid}`)
      .then((res) => {
        const { student_details, ...rest } = feeReceiptData;
        let totalYearSem = [];
        let totalYearSemTemp = [];
        const total = {};

        Object.values(rest).forEach((obj) => {
          if (totalYearSem.length < Object.keys(obj).length) {
            totalYearSem = Object.keys(obj);
          }
        });

        if (res.data.data[0].program_type_name.toLowerCase() === "yearly") {
          totalYearSem.forEach((obj) => {
            totalYearSemTemp.push({ key: obj, value: "Year" + obj });
          });
        } else if (
          res.data.data[0].program_type_name.toLowerCase() === "semester"
        ) {
          totalYearSem.forEach((obj) => {
            totalYearSemTemp.push({ key: obj, value: "Sem" + obj });
          });
        }

        totalYearSem.forEach((obj) => {
          total[obj] = Object.values(rest)
            .map((item) => item[obj])
            .reduce((a, b) => a + b);
        });

        setData(rest);
        setNoOfYears(totalYearSemTemp);
        setYearSemTotal(total);
        setGrantTotal(Object.values(total).reduce((a, b) => a + b));
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${studentId}`
      )
      .then((res) => {
        const { student_details, ...rest } = feeReceiptData;
        const total = {};
        Object.keys(rest).forEach((obj) => {
          total[obj] = Object.values(rest[obj]).reduce((a, b) => a + b);
        });

        const particularsTemp = [];

        res.data.data.fee_template_sub_amount_info.forEach((obj) => {
          if (Object.keys(rest).includes(obj.voucher_head_new_id.toString())) {
            particularsTemp.push(obj);
          }
        });

        setParticularsTotal(total);
        setParticularsData(particularsTemp);
        setEmail(res.data.data.Student_info?.[0]?.acharya_email);
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
                        {studentData?.created_date
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
                        {studentData?.student_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">AUID</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {studentData?.auid}
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
                        {studentData?.financial_year
                          ? studentData.financial_year
                          : "NA"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">Cashier</Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Typography variant="body2" color="textSecondary">
                        {studentData?.created_username
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
                                  {obj.value}
                                </TableCell>
                              );
                            })
                          : noOfYears.map((obj, i) => {
                              return (
                                <TableCell sx={{ color: "white" }} key={i}>
                                  {obj.value}
                                </TableCell>
                              );
                            })}

                        <TableCell sx={{ color: "white" }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {particularsData.length > 0 ? (
                        particularsData.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{obj.voucher_head}</TableCell>
                              {noOfYears.map((obj1, j) => {
                                return (
                                  <TableCell key={j}>
                                    {
                                      data?.[obj?.voucher_head_new_id]?.[
                                        obj1.key
                                      ]
                                    }
                                  </TableCell>
                                );
                              })}
                              <TableCell>
                                {particularsTotal?.[obj?.voucher_head_new_id]}
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
                                {yearSemTotal[obj.key]}
                              </TableCell>
                            );
                          })
                        ) : (
                          <></>
                        )}
                        <TableCell>{grandTotal}</TableCell>
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
                  Remarks : {studentData?.remarks ? studentData.remarks : "NA"}
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
