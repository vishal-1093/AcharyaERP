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
import useAlert from "../../../hooks/useAlert";

const bookmanFont = {
  fontFamily: 'Bookman Old Style, serif',
  fontSize: 14
};

const BulkFeeReceiptPdfNew = () => {
  const [data, setData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);

  const location = useLocation();

  const {
    studentId,
    feeReceiptId,
    transactionType,
    financialYearId,
    studentStatus,
    linkStatus,
    receiptStatus,
    bulkId,
    BulkFeeReceiptId,
  } = location?.state;

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    if (studentStatus) {
      setCrumbs([{ name: "Payments", link: "/Feepayment/Receipt" }]);
    } else if (receiptStatus) {
      setCrumbs([{ name: "Fee Receipt", link: "/FeeReceipt" }]);
    } else if (linkStatus) {
      setCrumbs([
        {
          name: "Fee Receipt",
          link: "/feereceipt-daybook",
        },
      ]);
    } else {
      setCrumbs([]);
    }
  }, []);

  const getData = async () => {
    if (receiptStatus) {
      try {
        const response = await axios.get(
          `/api/finance/getFeeReceiptId?feeReceipt=${feeReceiptId}&fcYear=${financialYearId}&bulkId=${bulkId}`
        );
        if (response.status === 200 || response.status === 201) {
          if (studentId) {
            const feeDetailsResponse = await axios.get(
              `/api/finance/getDataForDisplayingBulkFeeReceiptByAuid/${studentId}/${response?.data?.data}/${transactionType}/${financialYearId}`
            );

            setData(feeDetailsResponse.data.data.Voucher_Head_Wise_Amount);
            setStudentData(feeDetailsResponse.data.data.student_details[0]);
          } else {
            const feeDetailsResponse = await axios.get(
              `/api/finance/getDataForDisplayingBulkFeeReceipt/${response?.data?.data}/${transactionType}/${financialYearId}`
            );

            setData(feeDetailsResponse.data.data.Voucher_Head_Wise_Amount);
            setStudentData(feeDetailsResponse.data.data.student_details[0]);
          }
        }
      } catch (error) {
        setAlertMessage({ severity: "error", message: "Error Occured" });
        setAlertOpen(true);
      }
    } else {
      if (studentId) {
        const feeDetailsResponse = await axios.get(
          `/api/finance/getDataForDisplayingBulkFeeReceiptByAuid/${studentId}/${feeReceiptId}/${transactionType}/${financialYearId}`
        );

        setData(feeDetailsResponse.data.data.Voucher_Head_Wise_Amount);
        setStudentData(feeDetailsResponse.data.data.student_details[0]);
      } else {
        const feeDetailsResponse = await axios.get(
          `/api/finance/getDataForDisplayingBulkFeeReceipt/${feeReceiptId}/${transactionType}/${financialYearId}`
        );

        setData(feeDetailsResponse.data.data.Voucher_Head_Wise_Amount);
        setStudentData(feeDetailsResponse.data.data.student_details[0]);
      }
    }
  };

  const grandTotal = data.reduce(
    (sum, total) => Number(sum) + Number(total.amount),
    0
  );

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

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
              mb: 2
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
            {studentData?.school_name}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "600", ...bookmanFont }}
          >
            FEE RECEIPT
          </Typography>
          <Box sx={{ mt: 2 }}>
            {studentId ? (
              <Grid
                container
                sx={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <Grid
                  container
                  sx={{
                    width:
                      studentData?.student_name?.length > 29 ? "35%" : "33%",
                  }}
                  rowSpacing={0.5}
                  columnSpacing={1}
                >
                  <Grid item xs={1.7}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Name
                    </Typography>
                  </Grid>
                  <Grid item xs={0.2}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={9.8}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {studentData?.student_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={1.7}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      AUID
                    </Typography>
                  </Grid>
                  <Grid item xs={0.2}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={9.8}>
                    <Typography variant="body1" sx={bookmanFont}>{studentData?.auid}</Typography>
                  </Grid>

                  <Grid item xs={1.7}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      USN
                    </Typography>
                  </Grid>
                  <Grid item xs={0.2}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={9.8}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {studentData?.usn ? studentData?.usn : "NA"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ width: "33%" }}
                  rowSpacing={0.5}
                  columnSpacing={1}
                >
                  <Grid item xs={4.6}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Receipt No.
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {" "}
                      B - {data?.[0]?.fee_receipt}
                    </Typography>
                  </Grid>

                  <Grid item xs={4.6}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Receipt Date
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {moment(studentData?.created_date).format("DD-MM-YYYY")}
                    </Typography>
                  </Grid>

                  <Grid item xs={4.6}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      FC Year
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {" "}
                      {studentData?.financial_year}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  sx={{ width: "33%" }}
                  rowSpacing={0.5}
                  columnSpacing={1}
                >
                  <Grid item xs={4.7}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Fee Category
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={6.8}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {studentData?.fee_template_name
                        ? studentData?.fee_template_name
                        : "NA"}
                    </Typography>
                  </Grid>

                  <Grid item xs={4.7}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Created By
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={6.9}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {studentData?.created_username}
                    </Typography>
                  </Grid>

                  <Grid item xs={4.7}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Mobile
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={6.8}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {studentData.mobile ? studentData.mobile : "NA"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                sx={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <Grid
                  container
                  sx={{
                    width: "40%",
                  }}
                  rowSpacing={0.5}
                  columnSpacing={1}
                >
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Received From
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={7.5}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {data[0]?.from_name ?? "NA"}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Cashier
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={7.5}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {data[0]?.cashier ?? "NA"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  sx={{ width: "30%" }}
                  rowSpacing={0.5}
                  columnSpacing={1}
                >
                  <Grid item xs={4.2}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Receipt No.
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={5.6}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {data?.[0]?.fee_receipt}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{ width: "28%" }}
                  rowSpacing={0.5}
                  columnSpacing={1}
                >
                  <Grid item xs={5}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      Receipt Date
                    </Typography>
                  </Grid>
                  <Grid item xs={0.1}>
                    <Typography variant="body1" sx={{ fontWeight: 600, ...bookmanFont }}>
                      :
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={bookmanFont}>
                      {moment(studentData?.created_date).format("DD-MM-YYYY")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Box>
          <Box sx={{ mt: 3, mb: 3 }}>
            <table
              style={{
                width: "80%",
                margin: "auto",
                border: "1px solid black",
                borderCollapse: "collapse",
                ...bookmanFont
              }}
            >
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.6",
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
                      {voucher.voucher_head}
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
                      {voucher.amount}
                    </td>
                  </tr>
                ))}
                <tr style={{ textAlign: "left" }}>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.6",
                      fontWeight: 600,
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
                      fontWeight: 600,
                      ...bookmanFont
                    }}
                  >
                    {grandTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
          <Box sx={{ mt: 2 }}>
            {data[0]?.transaction_no && data[0]?.transaction_date && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: '600' }}>Transaction No. : </Box> {data?.[0]?.transaction_no ?? ""}
                </Typography>
                {/* <Typography variant="body1" sx={bookmanFont}>
                  <strong>Payment Mode : </strong>{" "}
                  {data?.[0]?.transaction_type === "ONLINE"
                    ? `${data?.[0]?.transaction_mode}`
                    : data?.[0]?.transaction_type}
                </Typography> */}
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: '600' }}>Payment Mode : </Box>
                  {data?.[0]?.transaction_type === "ONLINE"
                    ? `${data?.[0]?.transaction_mode}`
                    : data?.[0]?.transaction_type}
                </Typography>
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: '600' }}>Transaction Date : </Box> {data?.[0]?.transaction_date ?? ""}
                </Typography>

              </Box>
            )}

            <Box sx={{ mt: 0 }}>
              {!data[0]?.transaction_no &&
                !data[0]?.transaction_date &&
                data?.[0]?.transaction_type === "DD" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: '600' }}>Payment Mode : </Box>
                      {data?.[0]?.transaction_type === "ONLINE"
                        ? `${data?.[0]?.transaction_mode}`
                        : data?.[0]?.transaction_type}
                    </Typography>
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: '600' }}>DD No. : </Box>
                      {data?.[0]?.transaction_type === "ONLINE"
                        ? `${data?.[0]?.transaction_mode}`
                        : data?.[0]?.transaction_type}
                    </Typography>
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: '600' }}>DD Date : </Box>
                      {data?.[0]?.transaction_type === "ONLINE"
                        ? `${data?.[0]?.transaction_mode}`
                        : data?.[0]?.transaction_type}
                    </Typography>
                  </Box>
                )}
            </Box>

            {!data[0]?.transaction_no &&
              !data[0]?.transaction_date &&
              data?.[0]?.transaction_type !== "DD" && (
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{fontWeight: '600' }}>DD No. : </Box>
                  {data?.[0]?.transaction_type === "ONLINE"
                    ? `${data?.[0]?.transaction_mode}`
                    : data?.[0]?.transaction_type}
                </Typography>
              )}
            <Typography variant="body1" sx={bookmanFont}>
              <Box component="span" sx={{fontWeight: '600' }}>Remarks : </Box>
              {data?.[0]?.remarks}
            </Typography>
            <Typography sx={{fontWeight: '600', ...bookmanFont }}>
              Received a sum of Rs.{" "}
              {toUpperCamelCaseWithSpaces(
                numberToWords.toWords(Number(grandTotal ?? ""))
              )}{" "}
              /-
            </Typography>
          </Box>

          {/* Signature */}
          <Box sx={{ mt: 4, textAlign: "right", right: 20, bottom: 20 }}>
            <Typography sx={bookmanFont}>Signature</Typography>
            <Typography sx={bookmanFont}>(cashier)</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BulkFeeReceiptPdfNew;
