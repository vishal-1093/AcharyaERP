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
import { useLocation, useParams } from "react-router-dom";
import numberToWords from "number-to-words";
import useAlert from "../../../hooks/useAlert";

const JournalVoucherPdf = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const pathname = useLocation();
  const {schoolId, fcYearId} = pathname.state

  useEffect(() => {
    getPaymentVoucherData();
    setCrumbs([{ name: "Payment Tracker", link: "/journal-grn" }]);
  }, []);

  const getPaymentVoucherData = async () => {
    try {
      const response = await axios.get(
        // `/api/purchase/getPaymentVoucherDetails?payment_voucher_id=${id}`
        `/api/finance/getJournalVoucherByVoucherNumber/${id}/${schoolId}/${fcYearId}`
      );
     const {data} = response?.data
      setVoucherData(data || []);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  const handleDownloadPdf = () => {
    setHideButtons(true);
    setTimeout(() => {
      const receiptElement = document.getElementById("receipt");
      if (receiptElement) {
        html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4

          const imgWidth = 190; // PDF width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let yPosition = 10; // Start position in PDF

          pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
          pdf.save("JournalVoucher.pdf");
          setHideButtons(false);
        });
      }
    }, 100);
  };

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <Container>
      <Paper
        id="receipt"
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 840,
          margin: "0 auto",
          position: "relative",
        }}
      >
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
        {!hideButtons && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPdf}
            >
              Print
            </Button>
          </Box>
        )}
        <Box sx={{ border: "1px solid #000" }}>
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textTransform: "uppercase" }}
            >
              {voucherData?.[0]?.school_name || ""}
            </Typography>
            <Typography variant="body1">
              Acharya Dr. Sarvepalli Radhakrishna Road, Bengaluru, Karnataka
              560107
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Journal Voucher
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
                {voucherData?.[0]?.journal_voucher_number}
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
                {voucherData?.map((item) => {
                  return (
                    <TableRow sx={{ borderBottom: "none" }}>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          paddingBottom: 0,
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
                        {item?.debit || ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "right",
                          borderBottom: "none",
                          verticalAlign: "top",
                          padding: "5px",
                        }}
                      >
                        <br />
                        {item?.credit || ""}
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableRow sx={{ borderBottom: "none" }}>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      paddingBottom: 0,
                    }}
                  >
                    <>
                      <Typography variant="body1">
                        {voucherData?.[0]?.vendor_bank_name}
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
                      paddingBottom: 0,
                    }}
                  >
                    <>
                      <Box sx={{ height: "80px" }} />
                      <Typography variant="body1" gutterBottom={true}>
                       Pay To : {voucherData?.[0]?.pay_to}
                      </Typography>
                      <Typography variant="body1" gutterBottom={true}>
                        Department: {voucherData?.[0]?.dept_name}
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
                <TableRow
                  sx={{ border: "none", height: "30px", padding: "0px" }}
                >
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      paddingTop: 0,
                      paddingBottom: 0,
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
                    <strong>{voucherData?.[0]?.credit_total}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 10px",
            marginTop: "10px",
          }}
        >
          <Grid item xs={6}>
            <Typography variant="body1" textAlign="left">
              Created By
              <br />
              {voucherData?.[0]?.created_username}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="body1">
             Verified By
              <br />
              {voucherData?.[0]?.verifier_name}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default JournalVoucherPdf;


