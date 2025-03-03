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

const ExamReceiptPDFNew = () => {
  const [receiptData, setReceiptData] = useState([]);
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [data, setData] = useState([]);
  const [tableResponse, setTableResponse] = useState();
  const [yearsTotal, setYearsTotal] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);

  const location = useLocation();
  const { feeReceiptId, studentStatus, receiptStatus, linkStatus } =
    location?.state;
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getExamFeeReceipt();

    if (studentStatus) {
      setCrumbs([{ name: "Payments", link: "/Feepayment/Receipt" }]);
    } else if (receiptStatus) {
      setCrumbs([{ name: "Fee Receipt", link: "/FeeReceipt" }]);
    } else if (linkStatus) {
      setCrumbs([
        {
          name: "Payment Master",
          link: "/PaymentMaster/feereceipt",
        },
      ]);
    } else {
      setCrumbs([]);
    }
  }, []);

  const getExamFeeReceipt = async () => {
    const examResponse = await axios.get(
      `/api/finance/getExamFeeReceiptForRceiptByFeeRceiptId/${feeReceiptId}`
    );
    setReceiptData(examResponse.data.data);

    const years =
      examResponse?.data?.data?.feeReceiptWithStudentDetails?.[0]?.paid_year.split(
        ","
      );

    setVoucherHeads(Object.keys(examResponse.data.data.examFeeReceipt));

    const yearsData = {};

    years?.forEach((year) => {
      yearsData[year] = [];
    });

    examResponse?.data?.data?.examFeeReceiptForSem.forEach((voucher) => {
      if (yearsData[voucher.paidYear]) {
        yearsData[voucher.paidYear].push(voucher);
      }
    });

    const testData = {};

    Object.keys(examResponse.data.data.examFeeReceipt).forEach((voucher) => {
      const value = examResponse.data.data.examFeeReceipt[voucher];
      years.forEach((year) => {
        const filter = value.filter((obj) => obj.paidYear === Number(year));
        testData[`${voucher}-${year}`] =
          filter.length > 0 ? filter[0].amount : 0;
      });
    });

    setTableResponse(testData);

    setYearsTotal(yearsData);

    setData(examResponse.data.data.examFeeReceipt);
  };

  const years =
    receiptData?.feeReceiptWithStudentDetails?.[0]?.paid_year.split(",");

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with a space
  }

  const handleDownloadPdf = () => {
    setHideButtons(true);
    setTimeout(() => {
      const receiptElement = document.getElementById("receipt");
      if (receiptElement) {
        html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size

          const imgWidth = 190; // PDF width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

          let yPosition = 10; // Start position for the image in PDF

          pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);

          pdf.save("ExamReceipt.pdf"); // Download PDF file
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
        {/* Content Above Logo */}
        <Box>
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
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "14px", fontWeight: "bold" }}
          >
            {receiptData?.feeReceiptWithStudentDetails?.[0]?.school_name}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "500" }}
          >
            EXAM FEE RECEIPT
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
                  width:
                    receiptData?.feeReceiptWithStudentDetails?.[0]?.student_name
                      ?.length > 29
                      ? "35%"
                      : "33%",
                }}
                rowSpacing={0.5}
                columnSpacing={1}
              >
                <Grid item xs={1.7}>
                  <Typography variant="body1">
                    <strong>Name</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1">
                    {
                      receiptData?.feeReceiptWithStudentDetails?.[0]
                        ?.student_name
                    }
                  </Typography>
                </Grid>

                <Grid item xs={1.7}>
                  <Typography variant="body1">
                    <strong>AUID</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1">
                    {" "}
                    {receiptData?.feeReceiptWithStudentDetails?.[0]?.auid}
                  </Typography>
                </Grid>

                <Grid item xs={1.7}>
                  <Typography variant="body1">
                    <strong>USN</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1">
                    {receiptData?.feeReceiptWithStudentDetails?.[0]?.usn}
                  </Typography>
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
                  <Typography variant="body1">
                    <strong>Receipt No.</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {" "}
                    {
                      receiptData?.feeReceiptWithStudentDetails?.[0]
                        ?.fee_receipt
                    }
                  </Typography>
                </Grid>

                <Grid item xs={4.6}>
                  <Typography variant="body1">
                    <strong>Receipt Date</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {moment(
                      receiptData?.feeReceiptWithStudentDetails?.[0]
                        ?.created_date
                    ).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>

                <Grid item xs={4.6}>
                  <Typography variant="body1">
                    <strong>FC Year</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1">
                    {
                      receiptData?.feeReceiptWithStudentDetails?.[0]
                        ?.financial_year
                    }
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
                <Grid item xs={4.7}>
                  <Typography variant="body1">
                    <strong>Fee Category</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={6.8}>
                  <Typography variant="body1">
                    {
                      receiptData?.feeReceiptWithStudentDetails?.[0]
                        ?.fee_admission_category_short_name
                    }
                  </Typography>
                </Grid>

                <Grid item xs={4.7}>
                  <Typography variant="body1">
                    <strong>Created By</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={6.9}>
                  <Typography variant="body1">
                    {
                      receiptData?.feeReceiptWithStudentDetails?.[0]
                        ?.created_username
                    }
                  </Typography>
                </Grid>

                <Grid item xs={4.7}>
                  <Typography variant="body1">
                    <strong>Mobile</strong>
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography variant="body1">
                    <strong>: </strong>
                  </Typography>
                </Grid>
                <Grid item xs={6.8}>
                  <Typography variant="body1">
                    {receiptData?.feeReceiptWithStudentDetails?.[0]?.mobile}
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
                    }}
                  >
                    Particulars
                  </th>
                  {years?.map((year, i) => (
                    <th
                      style={{
                        border: "1px solid black",
                        padding: "3px 5px",
                        lineHeight: "1.6",
                      }}
                      key={i}
                    >{`Sem-${year}`}</th>
                  ))}
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.2",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {voucherHeads?.map((voucher, i) => (
                  <tr key={i} style={{ textAlign: "left" }}>
                    <td style={{ padding: "4px", border: "1px solid black" }}>
                      {voucher}
                    </td>
                    {years?.map((year) => (
                      <td
                        key={year}
                        style={{
                          textAlign: "end",
                          padding: "4px",
                          border: "1px solid black",
                        }}
                      >
                        {tableResponse[`${voucher}-${year}`]}
                      </td>
                    ))}
                    <td
                      style={{
                        textAlign: "end",
                        padding: "4px",
                        border: "1px solid black",
                      }}
                    >
                      {data?.[voucher]?.[0]?.totalAmount}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr style={{ textAlign: "left" }}>
                  <td
                    style={{
                      fontWeight: "bold",
                      padding: "4px",
                      border: "1px solid black",
                    }}
                  >
                    Total
                  </td>
                  {years?.map((year, i) => (
                    <td
                      key={i}
                      style={{
                        textAlign: "end",
                        padding: "4px",
                        border: "1px solid black",
                      }}
                    >
                      <strong>
                        {yearsTotal?.[year]?.reduce(
                          (total, sum) => Number(total) + Number(sum.amount),
                          0
                        )}
                      </strong>
                    </td>
                  ))}
                  <td
                    style={{
                      textAlign: "end",
                      padding: "4px",
                      border: "1px solid black",
                    }}
                  >
                    <strong>{receiptData?.totalPaidAmount}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>

          {/* Payment Details */}
          <Box sx={{ mt: 2 }}>
            {receiptData?.feeReceiptWithStudentDetails?.[0]?.transaction_no &&
              receiptData?.feeReceiptWithStudentDetails?.[0]
                ?.transaction_date && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Transaction No. :</strong>{" "}
                    {receiptData?.feeReceiptWithStudentDetails?.[0]
                      ?.transaction_no ?? "NA"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Transaction Date :</strong>{" "}
                    {receiptData?.feeReceiptWithStudentDetails?.[0]
                      ?.transaction_date ?? "NA"}
                  </Typography>
                </Box>
              )}

            <Typography variant="body1">
              <strong>Payment Mode : </strong>{" "}
              {receiptData?.feeReceiptWithStudentDetails?.[0]
                ?.transaction_type === "ONLINE"
                ? `${receiptData?.feeReceiptWithStudentDetails?.[0]?.transaction_mode}-${receiptData?.feeReceiptWithStudentDetails?.[0]?.transaction_no}`
                : receiptData?.feeReceiptWithStudentDetails?.[0]
                    ?.transaction_type}
            </Typography>

            <Typography variant="body1">
              <strong>Remarks : </strong>{" "}
              {receiptData?.feeReceiptWithStudentDetails?.[0]?.remarks}
            </Typography>
            <Typography variant="body1">
              <strong>
                Received a sum of Rs.{" "}
                {toUpperCamelCaseWithSpaces(
                  numberToWords.toWords(
                    Number(
                      receiptData?.feeReceiptWithStudentDetails?.[0]
                        ?.paid_amount ?? ""
                    )
                  )
                )}{" "}
                /-
              </strong>
            </Typography>
          </Box>

          {/* Signature */}
          <Box sx={{ mt: 4, textAlign: "right", right: 20, bottom: 20 }}>
            <Typography variant="body1">Signature</Typography>
            <Typography variant="body1">(cashier)</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ExamReceiptPDFNew;
