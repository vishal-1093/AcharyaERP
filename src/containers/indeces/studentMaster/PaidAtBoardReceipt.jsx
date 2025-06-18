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
  fontFamily: "Bookman Old Style, serif",
  fontSize: 14,
};

const PaidAtBoardReceipt = () => {
  const [studentData, setStudentData] = useState([]);
  const [data, setData] = useState([]);
  const [grandTotal, setGrandTotal] = useState("");
  const [hideButtons, setHideButtons] = useState(false);

  const location = useLocation();
  const { rowData, studentId } = location?.state;
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Paid at board index", link: "/paid-at-board-index" }]);
  }, []);

  const getData = async () => {
    const response = await axios
      .get(
        `/api/finance/tagReceiptOfStudent?studentId=${studentId}&yearSem=${rowData?.yearSem}`
      )
      .then((res) => {
        const total = res.data.data.feeTemplate.reduce(
          (total, sum) => Number(total) + Number(sum.fixedAmount),
          0
        );
        setGrandTotal(total);
        setStudentData(res.data.data);
        return res.data.data;
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/student/studentDetailsByAuid/${response.auid}`)
      .then((res) => {
        setData(res.data.data[0]);
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
            {data?.school_name}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ fontSize: "12px", fontWeight: "600", ...bookmanFont }}
          >
            FEE RECEIPT
          </Typography>
          <Box sx={{ mt: 2, justifyContent: "space-between" }}>
            <Grid
              container
              sx={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Grid
                container
                sx={{
                  width: studentData?.student_name?.length > 29 ? "35%" : "33%",
                }}
                rowSpacing={0.5}
                columnSpacing={1}
              >
                <Grid item xs={1.7}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {data?.student_name}
                  </Typography>
                </Grid>

                <Grid item xs={1.7}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    AUID
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {data?.auid}
                  </Typography>
                </Grid>

                <Grid item xs={1.7}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    USN
                  </Typography>
                </Grid>
                <Grid item xs={0.2}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.8}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {data?.usn ? data?.usn : ""}
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
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    Receipt No.
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {rowData?.bulkReceiptNo}/a
                  </Typography>
                </Grid>

                <Grid item xs={4.6}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    Receipt Date
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {moment(rowData?.receivedDate).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>

                <Grid item xs={4.6}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    FC Year
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {" "}
                    {data?.financial_year}
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
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    Fee Category
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={6.8}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {data?.fee_template_name ? data?.fee_template_name : "NA"}
                  </Typography>
                </Grid>

                <Grid item xs={4.7}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    Created By
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={6.9}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {rowData?.createdUsername}
                  </Typography>
                </Grid>

                <Grid item xs={4.7}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    Mobile
                  </Typography>
                </Grid>
                <Grid item xs={0.1}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "600", ...bookmanFont }}
                  >
                    :
                  </Typography>
                </Grid>
                <Grid item xs={6.8}>
                  <Typography variant="body1" sx={bookmanFont}>
                    {data.mobile ? data.mobile : ""}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
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
                      ...bookmanFont,
                    }}
                  >
                    Particulars
                  </th>
                  {rowData?.yearSem
                    ?.toString()
                    ?.split("")
                    ?.map((year, i) => (
                      <th
                        style={{
                          border: "1px solid black",
                          padding: "3px 5px",
                          lineHeight: "1.6",
                          ...bookmanFont,
                        }}
                        key={i}
                      >{`Sem-${year}`}</th>
                    ))}
                  <th
                    style={{
                      border: "1px solid black",
                      padding: "3px 5px",
                      lineHeight: "1.2",
                      ...bookmanFont,
                    }}
                  >
                    Total (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentData?.feeTemplate?.map((voucher, i) => (
                  <tr key={i} style={{ textAlign: "left" }}>
                    <td
                      style={{
                        padding: "3px",
                        border: "1px solid black",
                        ...bookmanFont,
                      }}
                    >
                      {voucher?.voucher_head}
                    </td>
                    <td
                      style={{
                        textAlign: "end",
                        padding: "3px",
                        border: "1px solid black",
                        ...bookmanFont,
                      }}
                    >
                      {voucher?.fixedAmount}
                    </td>

                    <td
                      style={{
                        textAlign: "end",
                        padding: "3px",
                        border: "1px solid black",
                        ...bookmanFont,
                      }}
                    >
                      {voucher?.fixedAmount}
                    </td>
                  </tr>
                ))}
                <tr style={{ textAlign: "left" }}>
                  <td
                    style={{
                      fontWeight: "bold",
                      padding: "3px",
                      border: "1px solid black",
                      ...bookmanFont,
                    }}
                  >
                    Total
                  </td>

                  <td
                    style={{
                      textAlign: "end",
                      padding: "3px",
                      border: "1px solid black",
                      fontWeight: 600,
                      ...bookmanFont,
                    }}
                  >
                    {grandTotal}
                  </td>

                  <td
                    style={{
                      textAlign: "end",
                      padding: "3px",
                      border: "1px solid black",
                      fontWeight: 600,
                      ...bookmanFont,
                    }}
                  >
                    {grandTotal}
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
          <Box sx={{ mt: 2 }}>
            {studentData?.transaction_no && studentData.transaction_date && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: "600" }}>
                    Transaction No. :{" "}
                  </Box>{" "}
                  {studentData?.transaction_no ?? ""}
                </Typography>

                {/* <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: "600" }}>
                    Payment Mode :{" "}
                  </Box>
                  {studentData?.transaction_type === "ONLINE"
                    ? `${studentData?.transaction_mode}`
                    : studentData?.transaction_type}
                </Typography> */}

                <Typography variant="body1" sx={bookmanFont}>
                  <strong>Trn_date :</strong>{" "}
                  {studentData?.transaction_date
                    ? moment(studentData?.transaction_date).format("DD-MM-YYYY")
                    : "NA"}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 0 }}>
              {!studentData?.transaction_no &&
                !studentData.transaction_date &&
                studentData?.transaction_type === "DD" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: "600" }}>
                        Payment Mode :{" "}
                      </Box>
                      {studentData?.transaction_type === "ONLINE"
                        ? `${studentData?.transaction_mode}`
                        : studentData?.transaction_type}
                    </Typography>
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box
                        component="span"
                        sx={{ fontWeight: "600", ...bookmanFont }}
                      >
                        DD No. :{" "}
                      </Box>{" "}
                      {studentData?.dd_number ?? ""}
                    </Typography>
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box
                        component="span"
                        sx={{ fontWeight: "600", ...bookmanFont }}
                      >
                        DD Date :{" "}
                      </Box>{" "}
                      {moment(studentData?.dd_date).format("DD-MM-YYYY")}
                    </Typography>
                  </Box>
                )}
            </Box>

            {studentData?.transaction_type === "DD" && (
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: "600" }}>
                  Bank Name :{" "}
                </Box>{" "}
                {studentData?.dd_bank_name ?? ""}
              </Typography>
            )}

            {/* {!studentData?.transaction_no &&
              !studentData.transaction_date &&
              studentData?.transaction_type !== "DD" && (
                <Typography variant="body1" sx={bookmanFont}>
                  <Box component="span" sx={{ fontWeight: "600" }}>
                    Payment Mode :{" "}
                  </Box>
                  {studentData?.transaction_type === "ONLINE"
                    ? `${studentData?.transaction_mode}`
                    : studentData?.transaction_type}
                </Typography>
              )} */}
            <Typography variant="body1" sx={bookmanFont}>
              <Box component="span" sx={{ fontWeight: "600", ...bookmanFont }}>
                Remarks :{" "}
              </Box>{" "}
              {rowData?.remarks ?? ""}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "600", ...bookmanFont }}
            >
              Received a sum of Rupees{" "}
              {toUpperCamelCaseWithSpaces(
                numberToWords.toWords(Number(grandTotal) ?? "")
              )}{" "}
            </Typography>
          </Box>
          <Box sx={{ mt: 4, textAlign: "right", right: 20, bottom: 20 }}>
            <Typography variant="body1" sx={bookmanFont}>
              Signature
            </Typography>
            <Typography variant="body1" sx={bookmanFont}>
              (cashier)
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaidAtBoardReceipt;
