import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assets/acc.png";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import numberToWords from "number-to-words";
import useAlert from "../../../hooks/useAlert";

const PaymentVoucherPdf = ({ voucherData }) => {
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();

  useEffect(() => {
    getPaymentVoucherData();
  }, []);

  const getPaymentVoucherData = async () => {};

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const bookmanFont = {
    fontFamily: "Bookman Old Style, serif",
    fontSize: "14px",
  };

  const headerStyle = {
    ...bookmanFont,
    fontWeight: "bold",
    fontSize: "14px",
  };

  const amountStyle = {
    ...bookmanFont,
    fontWeight: "bold",
    fontSize: "14px",
  };

  return (
    <Container>
      <Paper
        id="receipt"
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 880,
          margin: "0 auto",
          position: "relative",
          ...bookmanFont,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Watermark Logo"
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "25%",
            height: "auto",
            opacity: 0.35, // Very light watermark
            fontSize: 14,
          }}
        />

        <Box sx={{ border: "1px solid #000", ...bookmanFont }}>
          {/* Institution Header */}
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ ...headerStyle, textTransform: "uppercase" }}
            >
              {voucherData?.[0]?.school_name || ""}
            </Typography>
            <Typography sx={bookmanFont}>
              Acharya Dr. Sarvepalli Radhakrishna Road, Bengaluru, Karnataka
              560107
            </Typography>
          </Box>

          {/* Journal Voucher Heading */}
          <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
            <Typography variant="h6" sx={headerStyle}>
              Fund Transfer
            </Typography>
          </Box>

          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 10px",
            }}
          >
            <Grid item xs={4}>
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: "600" }}>
                  Voucher No:{" "}
                </Box>{" "}
                {voucherData?.[0]?.voucher_no}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: "600" }}>
                  FC Year:{" "}
                </Box>{" "}
                {voucherData?.[0]?.financial_year}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: "600" }}>
                  Date:{" "}
                </Box>{" "}
                {voucherData?.[0]?.date}
              </Typography>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderRight: "1px solid #000",
                      borderBottom: "1px solid #000",
                      textAlign: "center",
                      ...headerStyle,
                    }}
                  >
                    Particulars
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",

                      borderBottom: "1px solid #000",
                      textAlign: "center",
                      width: 110,
                      ...headerStyle,
                    }}
                  >
                    Amount (₹)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {voucherData?.map((item) => {
                  return (
                    <TableRow sx={{ borderBottom: "none" }}>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          padding: "3px",
                          ...bookmanFont,
                        }}
                      >
                        <>
                          <Typography variant="body1" sx={bookmanFont}>
                            {`${item?.interschool_name} - ${item?.Inter_bank_name}`}
                          </Typography>
                        </>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          textAlign: "right",
                          verticalAlign: "top",
                          padding: "5px",
                          ...bookmanFont,
                        }}
                      >
                        {item?.debit}
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableRow sx={{ borderBottom: "none" }}>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      padding: "3px",
                    }}
                  >
                    <>
                      <Typography variant="body1">
                        <Box sx={{ mb: 2.2, ...bookmanFont }}>
                          {/* {`${voucherData?.[0]?.school_name} - ${voucherData?.[0]?.bank_name}`} */}
                        </Box>
                      </Typography>
                    </>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      textAlign: "right",
                      verticalAlign: "top",
                      padding: "5px",
                    }}
                  ></TableCell>
                </TableRow>

                <TableRow sx={{ borderBottom: "none" }}>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      padding: "3px",
                    }}
                  >
                    <>
                      <Box sx={{ height: "80px" }} />
                      <Typography
                        variant="body1"
                        gutterBottom={true}
                        sx={bookmanFont}
                      >
                        Through : {voucherData?.[0]?.bank_name}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom={true}
                        sx={bookmanFont}
                      >
                        Chq No. : {voucherData?.[0]?.cheque_dd_no}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom={true}
                        sx={bookmanFont}
                      >
                        Paid To : {voucherData?.[0]?.pay_to}
                      </Typography>

                      <Typography
                        variant="body1"
                        gutterBottom={true}
                        sx={bookmanFont}
                      >
                        Narration: Paid to {voucherData?.[0]?.voucher_head}{" "}
                        {voucherData?.[0]?.remarks
                          ? ` ${voucherData?.[0]?.remarks}`
                          : ""}{" "}
                        {voucherData?.[0]?.created_username
                          ? ` created by ${voucherData?.[0]?.created_username}`
                          : ""}
                      </Typography>
                    </>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #000",
                      textAlign: "right",
                      verticalAlign: "top",
                    }}
                  ></TableCell>
                </TableRow>
                <TableRow
                  sx={{ border: "none", height: "30px", padding: "0px" }}
                >
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      paddingTop: 0,
                      padding: "3px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, ...bookmanFont }}
                    >
                      {" "}
                      {toUpperCamelCaseWithSpaces(
                        numberToWords.toWords(
                          Number(voucherData?.[0]?.debit_total ?? "")
                        )
                      )}{" "}
                      rupees
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "right",
                      padding: "5px",
                      ...amountStyle,
                    }}
                  >
                    {voucherData?.[0]?.debit_total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentVoucherPdf;
