import React, { useEffect } from "react";
import {
  Box,
  Typography,
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
import logo from "../../../assets/acc.png";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import numberToWords from "number-to-words";

const DraftPaymentVoucherView = ({ voucherData }) => {
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([{ name: "Payment Tracker", link: "/payment-voucher-index" }]);
  }, []);

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <Container>
      {/* Watermark Logo */}
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
          fontFamily: "Times-Roman !important",
        }}
      />

      <Box sx={{ border: "1px solid #000" }}>
        {/* Institution Header */}
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
          >
            {voucherData?.responseData?.school_name || ""}
          </Typography>
          <Typography variant="body1">
            Acharya Dr. Sarvepalli Radhakrishna Road, Bengaluru, Karnataka
            560107
          </Typography>
        </Box>

        {/* Journal Voucher Heading */}
        <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Draft Payment Voucher
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
            <Typography variant="body2">
              <strong>Voucher No: </strong>
              {voucherData?.[0]?.voucher_no}
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="body2">
              {" "}
              <strong>FC Year: </strong>
              {voucherData?.[0]?.financial_year}
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Typography variant="body2">
              <strong>Date: </strong>
              {voucherData?.[0]?.date}
            </Typography>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            {/* Table Header */}
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
                  }}
                >
                  Particulars
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #000",
                    borderBottom: "1px solid #000",
                    textAlign: "center",
                    width: 100,
                  }}
                >
                  Debit (Rs)
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    borderBottom: "1px solid #000",
                  }}
                >
                  Credit (Rs)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {voucherData.map((item) => {
                return (
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
                          {item?.voucher_head}
                        </Typography>
                      </>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #000",
                        borderBottom: "none",
                        textAlign: "right",
                        verticalAlign: "top",
                        padding: "5px",
                      }}
                    >
                      {item?.debit}
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "right",
                        borderBottom: "none",
                        padding: "5px",
                      }}
                    >
                      <Box sx={{ mt: 1.2 }}>{item?.debit}</Box>
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
                      {voucherData?.[0]?.bank_name}
                    </Typography>
                  </>
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #000",
                    borderBottom: "none",
                    textAlign: "right",
                    verticalAlign: "top",
                    padding: "5px",
                  }}
                ></TableCell>
                <TableCell
                  sx={{
                    textAlign: "right",
                    borderBottom: "none",
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
                    <Typography variant="body1" gutterBottom={true}>
                      Online Transaction
                    </Typography>
                    <Typography variant="body1" gutterBottom={true}>
                      Beneficiary Name: {voucherData?.[0]?.vendor_name}
                    </Typography>
                    <Typography variant="body1" gutterBottom={true}>
                      Beneficiary A/c No: {voucherData?.[0]?.vendoe_account_no}
                    </Typography>
                    <Typography variant="body1" gutterBottom={true}>
                      Beneficiary IFSC Code:{" "}
                      {voucherData?.[0]?.vendor_bank_ifsc_code}
                    </Typography>
                    <Typography variant="body1" gutterBottom={true}>
                      Narration: Paid to {voucherData?.[0]?.voucher_head}{" "}
                      {voucherData?.[0]?.remarks
                        ? `- ${voucherData?.[0]?.remarks}`
                        : ""}{" "}
                      {voucherData?.[0]?.created_username
                        ? `- created by ${voucherData?.[0]?.created_username}`
                        : ""}
                    </Typography>
                  </>
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #000",
                    borderBottom: "1px solid #000",
                    textAlign: "right",
                    verticalAlign: "top",
                  }}
                ></TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid #000",
                    textAlign: "right",
                    verticalAlign: "top",
                  }}
                ></TableCell>
              </TableRow>
              <TableRow sx={{ border: "none", height: "30px", padding: "0px" }}>
                <TableCell
                  sx={{
                    borderRight: "1px solid #000",
                    borderBottom: "none",
                    paddingTop: 0,
                    padding: "3px",
                  }}
                >
                  <Typography variant="body2">
                    <strong>
                      {" "}
                      {toUpperCamelCaseWithSpaces(
                        numberToWords.toWords(
                          Number(voucherData?.[0]?.debit_total ?? "")
                        )
                      )}{" "}
                      rupees
                    </strong>
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    borderRight: "1px solid #000",
                    textAlign: "right",
                    padding: "5px",
                  }}
                >
                  <strong>{voucherData?.[0]?.debit_total}</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "right", padding: "5px" }}>
                  <strong>{voucherData?.[0]?.debit_total}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default DraftPaymentVoucherView;
