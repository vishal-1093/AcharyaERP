import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Container, Grid } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assets/acc.png";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { useLocation } from "react-router-dom";
import numberToWords from "number-to-words";

const bookmanFont = {
  fontFamily: 'Bookman Old Style, serif',
  fontSize: 14
};

const HostelFeeReceiptPdfNew = () => {
  const [data, setData] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);

  const location = useLocation();

  const { feeReceiptId, studentStatus, receiptStatus, linkStatus } =
    location?.state;

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();

    if (studentStatus) {
      setCrumbs([{ name: "Payments", link: "/Feepayment/Receipt" }]);
    } else if (receiptStatus) {
      setCrumbs([{ name: "Fee Receipt", link: "/FeeReceipt" }]);
    } else if (linkStatus) {
      setCrumbs([
        {
          name: "Payment Master",
          link: "/feereceipt-daybook-index",
        },
      ]);
    } else {
      setCrumbs([]);
    }
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/finance/hostelFeeReceiptDetailsByFeeReceiptId/${feeReceiptId}`)
      .then((resOne) => {
        setData(resOne.data.data);
        // setStudentData(resOne.data.data.student_details[0]);
      })
      .catch((err) => console.error(err));
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

  // const handleDownloadPdf = () => {
  //   setHideButtons(true);
  //   setTimeout(() => {
  //     const receiptElement = document.getElementById("receipt");
  //     if (receiptElement) {
  //       html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
  //         const imgData = canvas.toDataURL("image/png");
  //         const pdf = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size

  //         const imgWidth = 190; // PDF width in mm
  //         const pageHeight = 297; // A4 height in mm
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

  //         let yPosition = 10; // Start position for the image in PDF

  //         pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);

  //         pdf.save("HostelFee.pdf"); // Download PDF file
  //         setHideButtons(false);
  //       });
  //     }
  //   }, 100);
  // };

  return (
    <Container>
      <Paper
        id="receipt"
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 940,
          // height: "100vh",
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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "20%",
            height: "auto",
            opacity: 0.6, // Light watermark effect
          }}
        />
        <Box>
          <Box
            sx={{
              display: hideButtons ? 'none' : "flex",
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
            sx={{ fontSize: "14px", fontWeight: "bold", ...bookmanFont }}
          >
            {data[0]?.schoolName?.toUpperCase()}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "600", ...bookmanFont }}
          >
            FEE RECEIPT
          </Typography>

          {/* Student Details */}
          <Box sx={{ mt: 2 }}>
            <Grid
              container
              sx={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {/*Row 1 */}

              <Grid
                container
                sx={{
                  width: data[0]?.studentName?.length > 29 ? "35%" : "33%",
                }}
                rowSpacing={0.5}
                columnSpacing={1}
              >
                <Grid item xs={1.7}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {data[0]?.studentName}
                  </Typography>
                </Grid>

                <Grid item xs={1.7}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    AUID
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1" sx={bookmanFont}>{data[0]?.auid}</Typography>
                </Grid>
              </Grid>

              {/*Row 2 */}

              <Grid
                container
                sx={{ width: "33%" }}
                rowSpacing={0.5}
                columnSpacing={1}
              >
                <Grid item xs={4.6}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    Receipt No.
                  </Typography>
                </Grid>
                <Grid item xs={0.1} sx={{ fontWeight: "600", ...bookmanFont }}>
                  <Typography variant="body1">
                    :
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {" "}
                    HOS - {data?.[0]?.feeReceiptId}
                  </Typography>
                </Grid>

                <Grid item xs={4.6}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    Receipt Date
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {moment(data[0]?.created_date).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>
              </Grid>

              {/*Row 3 */}
              <Grid
                container
                spacing={2}
                sx={{ width: "33%" }}
                rowSpacing={0.5}
                columnSpacing={1}
              >
                <Grid item xs={4}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    FC Year
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={7.3}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {" "}
                    {data[0]?.financialYear}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    Created By
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1" sx={{ fontWeight: "600", ...bookmanFont }}>
                    :
                  </Typography>
                </Grid>
                <Grid item xs={7.3}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {data[0]?.createdUsername}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          {/* Fee Details */}
          <Box sx={{ mt: 3, mb: 3 }}>
            <table
              style={{
                width: "80%",
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
                      lineHeight: "1.6",
                      fontWeight: "600",
                      ...bookmanFont
                    }}
                  >
                    Fee Heads
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.2",
                      fontWeight: "600",
                      ...bookmanFont
                    }}
                  >
                    Paid Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((voucher, i) => (
                  <tr style={{ textAlign: "left" }}>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px 5px",
                        lineHeight: "1.6",
                        ...bookmanFont
                      }}
                    >
                      {voucher.voucherHead}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "3px 5px",
                        textAlign: "end",
                        lineHeight: "1.2",
                        ...bookmanFont
                      }}
                    >
                      {voucher.payingAmount}
                    </td>
                  </tr>
                ))}
                <tr style={{ textAlign: "left" }}>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.6",
                      fontWeight: "600",
                      ...bookmanFont
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      textAlign: "end",
                      lineHeight: "1.2",
                      fontWeight: "600",
                      ...bookmanFont
                    }}
                  >
                    {data?.[0]?.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>

          {/* Payment Details */}
          <Box sx={{ mt: 2 }}>
            {data[0]?.transactionNo && data[0]?.transactionDate && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <Typography variant="body1">
                  <strong>Transaction No. :</strong> {data?.[0]?.transactionNo}
                </Typography> */}
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: '600' }}>Transaction No. : </Box> {data?.[0]?.transaction_no ?? ""}
                </Typography>
                {/* <Typography variant="body1">
                  <strong>Payment Mode : </strong>{" "}
                  {data?.[0]?.transactionType === "ONLINE"
                    ? `${data?.[0]?.transactionMode}`
                    : data?.[0]?.transactionType}
                </Typography> */}
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: '600' }}>Payment Mode : </Box>
                  {data?.[0]?.transactionType === "ONLINE"
                    ? `${data?.[0]?.transactionMode}`
                    : data?.[0]?.transactionType}
                </Typography>
                {/* <Typography variant="body1">
                  <strong>Trn_date :</strong>{" "}
                  {data?.[0]?.transactionDate ?? "NA"}
                </Typography> */}
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: '600' }}>Trn_date : </Box> {data?.[0]?.transactionDate ?? "NA"}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 0 }}>
              {!data[0]?.transactionNo &&
                !data[0]?.transactionDate &&
                data?.[0]?.transactionType === "DD" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <Typography variant="body1">
                      <strong>Payment Mode : </strong>{" "}
                      {data?.[0]?.transactionType === "ONLINE"
                        ? `${data?.[0]?.transactionMode}`
                        : data?.[0]?.transactionType}
                    </Typography> */}
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: '600' }}>Payment Mode : </Box>
                      {data?.[0]?.transactionType === "ONLINE"
                        ? `${data?.[0]?.transactionMode}`
                        : data?.[0]?.transactionType}
                    </Typography>
                    {/* <Typography variant="body1">
                      <strong>DD No. : </strong> {data?.[0]?.dd_number}
                    </Typography> */}
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: '600' }}>DD No : </Box> {data?.[0]?.dd_number ?? ""}
                    </Typography>
                    {/* <Typography variant="body1">
                      <strong>DD Date : </strong>{" "}
                      {moment(data?.[0]?.dd_date).format("DD-MM-YYYY")}
                    </Typography> */}
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: '600' }}>DD Date : </Box>
                      {moment(data?.[0]?.dd_date).format("DD-MM-YYYY")}
                    </Typography>
                  </Box>
                )}
            </Box>

            {data?.[0]?.transactionType === "DD" && (
              // <Typography variant="body1">
              //   <strong>Bank Name : </strong> {data?.[0]?.bank_name}
              // </Typography>
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: '600' }}>Bank Name : </Box>
                {data?.[0]?.bank_name}
              </Typography>
            )}

            {!data[0]?.transactionNo &&
              !data[0]?.transactionDate &&
              data?.[0]?.transactionType !== "DD" && (
                // <Typography variant="body1">
                //   <strong>Payment Mode : </strong>{" "}
                // {data?.[0]?.transactionType === "ONLINE"
                //   ? `${data?.[0]?.transactionMode}`
                //   : data?.[0]?.transactionType}
                // </Typography>

                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: '600' }}>Payment Mode : </Box>
                  {data?.[0]?.transactionType === "ONLINE"
                    ? `${data?.[0]?.transactionMode}`
                    : data?.[0]?.transactionType}
                </Typography>
              )}

            {/* <Typography variant="body1">
              <strong>Remarks : </strong>
              {data?.[0]?.remarks}
            </Typography> */}
            <Typography variant="body1" sx={bookmanFont}>
              <Box component="span" sx={{ fontWeight: '600' }}>Remarks : </Box>
              {data?.[0]?.remarks}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: '600', ...bookmanFont }}>
              Received a sum of Rs.{" "}
              {toUpperCamelCaseWithSpaces(
                numberToWords.toWords(Number(data?.[0]?.totalAmount ?? ""))
              )}{" "}
              /-
            </Typography>
          </Box>

          {/* Signature */}
          <Box sx={{ mt: 4, textAlign: "right", right: 20, bottom: 20 }}>
            <Typography variant="body1" sx={bookmanFont}>Signature</Typography>
            <Typography variant="body1" sx={bookmanFont}>(cashier)</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default HostelFeeReceiptPdfNew;
