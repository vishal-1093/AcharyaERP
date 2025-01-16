import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const [yearSemTotal, setYearSemTotal] = useState([]);
  const [grandTotal, setGrantTotal] = useState("");
  const [email, setEmail] = useState("");
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [voucherHeadNames, setVoucherHeadNames] = useState([]);
  const [tableData, setTableData] = useState([]);

  const location = useLocation();

  const {
    auid,
    studentId,
    feeReceipt,
    financialYearId,
    transactionType,
    feeReceiptId,
  } = location?.state;

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
        setYearSemTotal(total);
        setGrantTotal(Object.values(total).reduce((a, b) => a + b));
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${studentId}`
      )
      .then((res) => {
        console.log("res", res.data);

        const filterByFeereceiptId =
          res.data.data.fee_receipt_student_pay_his?.filter(
            (item) => item.fee_receipt_id === feeReceiptId
          );

        const voucherIds = filterByFeereceiptId?.map(
          (vouchers) => vouchers.voucher_head_new_id
        );

        const paidYears = filterByFeereceiptId?.map(
          (vouchers) => vouchers.paid_year
        );

        const uniqueVoucherHeads = filterByFeereceiptId?.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.voucher_head_new_id === value.voucher_head_new_id
            )
        );

        const filteredVoucherIds = [...new Set(voucherIds)];

        const filteredYears = [...new Set(paidYears)];

        setVoucherHeadNames(uniqueVoucherHeads);

        setNoOfYears(filteredYears);

        const dataByVoucher = {};

        filterByFeereceiptId?.forEach((item) => {
          const key = `${item.paid_year}-${item.voucher_head_new_id}`;

          if (!dataByVoucher[key]) {
            dataByVoucher[key] = [];
          }

          dataByVoucher[key]?.push(item);

          return dataByVoucher;
        });

        setTableData(dataByVoucher);

        const VoucherWiseData = filteredVoucherIds.reduce((acc, voucherId) => {
          const value = filterByFeereceiptId.filter(
            (item) => item.voucher_head_new_id === voucherId
          );

          acc[voucherId] = value;
          return acc;
        }, {});

        setVoucherHeads(VoucherWiseData);

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

                        {noOfYears.map((year, i) => {
                          return (
                            <>
                              <TableCell sx={{ color: "white" }} key={i}>
                                {`Sem-${year}`}
                              </TableCell>
                            </>
                          );
                        })}

                        <TableCell sx={{ color: "white" }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {voucherHeadNames.map((obj) => {
                        return (
                          <>
                            <TableRow>
                              <TableCell>{obj.voucher_head}</TableCell>
                              {noOfYears?.map((year) => {
                                return (
                                  <>
                                    <TableCell>
                                      {tableData?.[
                                        `${year}-${obj.voucher_head_new_id}`
                                      ]?.[0]?.paid_amount ?? 0}
                                    </TableCell>
                                  </>
                                );
                              })}

                              <TableCell>
                                {voucherHeads?.[
                                  obj.voucher_head_new_id
                                ]?.reduce(
                                  (total, sum) =>
                                    Number(total) + Number(sum.paid_amount),
                                  0
                                )}
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                      <TableRow>
                        <TableCell>Total</TableCell>
                        {noOfYears.length > 0 ? (
                          noOfYears.map((obj, i) => {
                            return (
                              <TableCell key={i}>{yearSemTotal[obj]}</TableCell>
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
                    navigate(`/FeeReceiptDetailsPDF`, {
                      state: {
                        auid: auid,
                        studentId: studentId,
                        feeReceipt: feeReceipt,
                        transactionType: transactionType,
                        feeReceiptId: feeReceiptId,
                        financialYearId: financialYearId,
                      },
                    })
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
