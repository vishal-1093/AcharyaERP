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

const FeeReceiptDetailsPDFNew = () => {
  const [studentData, setStudentData] = useState([]);
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [voucherHeadNames, setVoucherHeadNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [yearSemTotal, setYearSemTotal] = useState([]);
  const [grandTotal, setGrantTotal] = useState("");
  const [email, setEmail] = useState("");
  const [hideButtons, setHideButtons] = useState(false);

  const location = useLocation();
  const setCrumbs = useBreadcrumbs();

  const {
    auid,
    studentId,
    feeReceipt,
    financialYearId,
    transactionType,
    feeReceiptId,
    linkStatus,
    studentStatus,
    receiptStatus,
  } = location?.state;

  useEffect(() => {
    getData();
    if (linkStatus) {
      setCrumbs([
        {
          name: "Payment Master",
          link: "/PaymentMaster/feereceipt",
        },
      ]);
    } else if (studentStatus) {
      setCrumbs([{ name: "Payments", link: "/Feepayment/Receipt" }]);
    } else if (receiptStatus) {
      setCrumbs([{ name: "Fee Receipt", link: "/FeeReceipt" }]);
    } else {
      setCrumbs([]);
    }
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

        setEmail(res.data.data[0]);
        setYearSemTotal(total);
        setGrantTotal(Object.values(total).reduce((a, b) => a + b, 0));
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${studentId}`
      )
      .then((res) => {
        const filterByFeereceiptId =
          res.data.data.fee_receipt_student_pay_his?.filter(
            (item) => Number(item.fee_receipt_id) === Number(feeReceiptId)
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
      })
      .catch((err) => console.error(err));
  };

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

          pdf.save("FeeReceiptDetails.pdf"); // Download PDF file
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
            {studentData?.school_name}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "500" }}
          >
            FEE RECEIPT
          </Typography>

          {/* Student Details */}
          <Box sx={{ mt: 2, justifyContent: "space-between" }}>
            <Grid
              container
              sx={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {/*Row 1 */}

              <Grid
                container
                sx={{
                  width: studentData?.student_name?.length > 29 ? "35%" : "33%",
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
                    {studentData?.student_name}
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
                  <Typography variant="body1">{studentData?.auid}</Typography>
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
                    {studentData?.usn ? studentData?.usn : "NA"}
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
                  <Typography variant="body1">{feeReceipt}</Typography>
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
                    {moment(studentData?.created_date).format("DD-MM-YYYY")}
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
                    {" "}
                    {studentData?.financial_year}
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
                    {email?.fee_template_name ? email?.fee_template_name : "NA"}
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
                    {studentData?.created_username}
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
                    {email.mobile ? email.mobile : "NA"}
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
                  {noOfYears?.map((year, i) => (
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
                {voucherHeadNames?.map((voucher, i) => (
                  <tr key={i} style={{ textAlign: "left" }}>
                    <td style={{ padding: "3px", border: "1px solid black" }}>
                      {voucher?.voucher_head}
                    </td>
                    {noOfYears?.map((year) => (
                      <td
                        key={year}
                        style={{
                          textAlign: "end",
                          padding: "3px",
                          border: "1px solid black",
                        }}
                      >
                        {tableData?.[
                          `${year}-${voucher?.voucher_head_new_id}`
                        ]?.[0]?.inr_value ?? 0}
                      </td>
                    ))}
                    <td
                      style={{
                        textAlign: "end",
                        padding: "3px",
                        border: "1px solid black",
                      }}
                    >
                      {voucherHeads?.[voucher?.voucher_head_new_id]?.reduce(
                        (total, sum) => Number(total) + Number(sum?.inr_value),
                        0
                      )}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr style={{ textAlign: "left" }}>
                  <td
                    style={{
                      fontWeight: "bold",
                      padding: "3px",
                      border: "1px solid black",
                    }}
                  >
                    Total
                  </td>
                  {noOfYears?.map((year, i) => (
                    <td
                      key={i}
                      style={{
                        textAlign: "end",
                        padding: "3px",
                        border: "1px solid black",
                      }}
                    >
                      <strong>{yearSemTotal?.[year]}</strong>
                    </td>
                  ))}
                  <td
                    style={{
                      textAlign: "end",
                      padding: "3px",
                      border: "1px solid black",
                    }}
                  >
                    <strong>{grandTotal}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>

          {/* Payment Details */}
          <Box sx={{ mt: 2 }}>
            {studentData?.transaction_no && studentData.transaction_date && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">
                  <strong>Transaction No. :</strong>{" "}
                  {studentData?.transaction_no ?? "NA"}
                </Typography>
                <Typography variant="body1">
                  <strong>Transaction Date :</strong>{" "}
                  {studentData?.transaction_date
                    ? studentData?.transaction_date
                    : "NA"}
                </Typography>
              </Box>
            )}
            <Typography variant="body1">
              <strong>Remarks : </strong> {studentData?.remarks}
            </Typography>
            <Typography variant="body1">
              <strong>
                Received a sum of Rs.{" "}
                {toUpperCamelCaseWithSpaces(
                  numberToWords.toWords(Number(grandTotal) ?? "")
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

export default FeeReceiptDetailsPDFNew;
