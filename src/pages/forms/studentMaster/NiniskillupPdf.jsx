import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assets/nini.png";
import { useLocation } from "react-router-dom";
import numberToWords from "number-to-words";
import moment from "moment";
import axios from "../../../services/Api";

const bookmanFont = {
  fontFamily: "Bookman Old Style, serif",
  fontSize: 14,
};

const NiniskillPdf = () => {
  const [receiptData, setReceiptData] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);

  const location = useLocation();
  const state = location?.state?.res;

  useEffect(() => {
    getExamFeeReceipt();
  }, []);

  const getExamFeeReceipt = async () => {
    const response = await axios.get(
      `/api/finance/getCmaFeeReceiptByReceiptId/${state.cma_receipt_id}/${state.financial_year_id}/${state.student_id}`
    );

    setReceiptData(response.data.data[0]);
  };

  const handleDownloadPdf = () => {
    setHideButtons(true);
    setTimeout(() => {
      const receiptElement = document.getElementById("receipt");
      if (receiptElement) {
        html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

          // Open in new window as Blob URL and trigger print
          const pdfBlob = pdf.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);

          const printWindow = window.open(pdfUrl, "_blank");
          if (printWindow) {
            printWindow.addEventListener("load", () => {
              printWindow.focus();
              printWindow.print();
            });
          }

          setHideButtons(false);
        });
      }
    }, 100);
  };

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with a space
  }

  return (
    <Container>
      <Paper
        id="receipt"
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 940,
          //   height: "60vh",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Watermark Logo"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "15%",
            height: "auto",
            opacity: 0.6, // Light watermark effect
          }}
        />
        <Box>
          <Box
            sx={{
              display: hideButtons ? "none" : "flex",
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
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "14px", fontWeight: "600", ...bookmanFont }}
          >
            {receiptData?.school_name}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "600", ...bookmanFont }}
          >
            Nini Skillup Private Limited
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "600", ...bookmanFont }}
          >
            Achit Nagar, Soldevanahalli, Bangalore 560107
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{ fontSize: "10px", fontWeight: "600", ...bookmanFont }}
          >
            GSTIN: 29AAICN2650C1ZL
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "520", ...bookmanFont }}
          >
            Order Form
          </Typography>

          <Box sx={{ mt: 3, mb: 3 }}>
            <table
              style={{
                width: "65%",
                margin: "auto",
                border: "1px solid black",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    Order No.
                  </th>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    {receiptData?.cma_receipt_id}
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    Order Date
                  </th>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    {moment(receiptData?.created_date).format("DD-MM-YYYY")}
                  </td>
                </tr>

                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    Order Amount
                  </th>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    {receiptData?.total_amount}
                  </td>
                </tr>

                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    AUID
                  </th>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    {receiptData?.auid}
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    Student Name
                  </th>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    {receiptData?.student_name}
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    College
                  </th>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    {receiptData?.school_name}
                  </td>
                </tr>

                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    Course
                  </th>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.8",
                    }}
                  >
                    {receiptData?.program_specialization_name}
                  </td>
                </tr>
              </thead>
            </table>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <Box component="span" sx={{ fontWeight: "600" }}>
                Received with thanks Rs. {`${state?.total_amount} /-`}{" "}
                {toUpperCamelCaseWithSpaces(
                  numberToWords.toWords(Number(state?.total_amount) ?? "")
                )}{" "}
                towards Training fee.
              </Box>{" "}
              {receiptData?.remarks ?? ""}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", color: "grey", marginTop: 2 }}
            >
              * This is electronically generated receipt signature not required
            </Typography>
          </Box>
          <Box sx={{ mt: 4, textAlign: "right", right: 20, bottom: 20 }}>
            <Typography variant="body1" sx={bookmanFont}>
              Nini Skillup Private Limited
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NiniskillPdf;
