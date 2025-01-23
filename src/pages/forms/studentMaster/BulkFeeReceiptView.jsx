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

function BulkFeeReceiptView() {
  const [studentData, setStudentData] = useState([]);
  const [data, setData] = useState([]);

  const location = useLocation();

  const { studentId, feeReceiptId, transactionType, financialYearId } =
    location?.state;

  const tableRef = useRef(null);
  const navigate = useNavigate();

  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (studentId) {
      await axios
        .get(
          `/api/finance/getDataForDisplayingBulkFeeReceiptByAuid/${studentId}/${feeReceiptId}/${transactionType}/${financialYearId}`
        )
        .then((resOne) => {
          setData(resOne.data.data.Voucher_Head_Wise_Amount);
          setStudentData(resOne.data.data.student_details[0]);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/finance/getDataForDisplayingBulkFeeReceipt/${feeReceiptId}/${transactionType}/${financialYearId}`
        )
        .then((resOne) => {
          setData(resOne.data.data.Voucher_Head_Wise_Amount);
          setStudentData(resOne.data.data.student_details[0]);
        })
        .catch((err) => console.error(err));
    }
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
              justifyContent="center"
              rowSpacing={1}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} md={12} mt={2}>
                <Typography className={classes.bg}>Bulk Fee Receipt</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Paper elevation={2}>
                  {studentId ? (
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
                          {data.length > 0
                            ? data[0].fee_receipt.split("/").join("-")
                            : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Receipt Date
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.length > 0
                            ? data[0].receipt_date
                                .slice(0, 10)
                                .split("-")
                                .reverse()
                                .join("-")
                            : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">AUID</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.auid ? studentData.auid : ""}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Mobile</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.mobile ? studentData.mobile : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Financial Year
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {studentData.financial_year
                            ? studentData.financial_year
                            : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Cashier</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.length > 0 ? data[0].cashier : "NA"}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
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
                          {data.length > 0
                            ? data[0].fee_receipt.split("/").join("-")
                            : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Receipt Date
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.length > 0
                            ? moment(data[0].receipt_date).format("DD-MM-YYYY")
                            : ""}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Received From
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography variant="body2" color="textSecondary">
                          {data.length > 0 ? data[0].from_name : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Cashier</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.length > 0 ? data[0].cashier : ""}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2"></Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        ></Typography>
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} mt={2}>
                <TableContainer component={Paper}>
                  <Table size="small" ref={tableRef}>
                    <TableHead className={classes.bg}>
                      <TableRow>
                        <TableCell sx={{ color: "white" }}>Fee Heads</TableCell>
                        <TableCell sx={{ color: "white" }}>
                          Paid Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.length > 0 ? (
                        data.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{obj.voucher_head}</TableCell>
                              <TableCell>{obj.amount_in_som}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>
                          {data.length > 0 ? data[0].amount : ""}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {studentId ? (
                <Grid item xs={12} md={12}>
                  <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    rowSpacing={2}
                    columnSpacing={2}
                  >
                    <Grid item xs={12} md={2}>
                      <Typography>Payment Mode : {transactionType}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>
                        Transaction No : &nbsp;
                        {data.length > 0 ? data[0].transaction_no : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography>
                        Transaction Date : &nbsp;
                        {data.length > 0 ? data[0].transaction_date : ""}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography>
                        Remarks : &nbsp;
                        {data.length > 0 ? data[0].remarks : "NA"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={8}
                      align="right"
                      onClick={() =>
                        navigate(`/BulkFeeReceiptPdf`, {
                          state: {
                            studentId: studentId,
                            feeReceiptId: feeReceiptId,
                            transactionType: transactionType,
                            financialYearId: financialYearId,
                          },
                        })
                      }
                    >
                      <Button variant="contained" sx={{ borderRadius: 2 }}>
                        Print
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Grid item xs={12} md={4}>
                    <Typography>
                      Remarks : &nbsp;
                      {data.length > 0 ? data[0].remarks : "NA"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={8}
                    align="right"
                    onClick={() =>
                      navigate(`/BulkFeeReceiptPdf`, {
                        state: {
                          studentId: studentId,
                          feeReceiptId: feeReceiptId,
                          transactionType: transactionType,
                          financialYearId: financialYearId,
                        },
                      })
                    }
                  >
                    <Button variant="contained" sx={{ borderRadius: 2 }}>
                      Print
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default BulkFeeReceiptView;
