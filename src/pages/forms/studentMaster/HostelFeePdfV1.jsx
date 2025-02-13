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

const HostelFeeReceiptPdfNew = () => {

const [data, setData] = useState([]);
const [studentData, setStudentData] = useState([]);
const [hideButtons, setHideButtons] = useState(false)

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
        link: "/PaymentMaster/feereceipt",
      },
    ]);
  } else {
    setCrumbs([]);
  }
}, []);

const getData = async () => {
  await axios
    .get(
      `/api/finance/hostelFeeReceiptDetailsByFeeReceiptId/${feeReceiptId}/HOS`
    )
    .then((resOne) => {
      setData(resOne.data.data);
      // setStudentData(resOne.data.data.student_details[0]);
    })
    .catch((err) => console.error(err));
};

function toUpperCamelCaseWithSpaces(str) {
  return str
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join the words back together with a space
}


    function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with a space
  }

  
  const handleDownloadPdf = () => {
     setHideButtons(true);
     setTimeout(()=>{
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
    
          pdf.save("HostelFee.pdf"); // Download PDF file
          setHideButtons(false);
        });
      }
     }, 100)
  };

  return (
    <Container>
      <Paper
        id="receipt"
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 800,
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleDownloadPdf}>Print</Button>
        </Box>
      )}
          <Typography variant="h6" align="center" sx={{ fontSize: "14px", fontWeight: "bold" }}>
          {data[0]?.schoolName?.toUpperCase()}
          </Typography>
          <Typography variant="h6" align="center" sx={{ fontSize: "12px", fontWeight: "500" }}>
          HOSTEL FEE RECEIPT
          </Typography>

          {/* Student Details */}
          <Box sx={{ mt: 3 }}>
              <Grid container spacing={2} rowSpacing={0.5}>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Student Name: </strong>{data[0]?.studentName}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Receipt No.:</strong> {data?.[0]?.feeReceiptId}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Created Date:</strong> {moment(data[0]?.created_date).format("DD-MM-YYYY")}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>AUID:</strong> {data[0]?.auid}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Financial Year:</strong> {data[0]?.financialYear}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Created By:</strong> {data[0]?.createdUsername }</Typography>
              </Grid>
                </Grid>
          </Box>

          {/* Fee Details */}
          <Box sx={{ mt: 3, mb: 3 }}>
          <table style={{width:"80%", margin:'auto', border: "1px solid black", borderCollapse:'collapse'}}>
          <thead>
           <tr style={{textAlign: "center"}}>
             <th style={{ border: "1px solid black", padding: "3px 5px", lineHeight: "1.6" }}>Fee Heads</th>
             <th style={{ border: "1px solid black", padding: "3px 5px", lineHeight: "1.2" }}>Paid Amount</th>
           </tr>
         </thead>
         <tbody>
         {data?.map((voucher, i) => (
           <tr style={{textAlign: 'left'}}>
             <td style={{ border: "1px solid black", padding: "3px 5px", lineHeight: "1.6", }}>{voucher.voucherHead}</td>
             <td style={{ border: "1px solid black", padding: "3px 5px", textAlign: 'end', lineHeight: "1.2" }}>{voucher.payingAmount}</td>
           </tr>
         ))}
           <tr style={{textAlign: 'left'}}>
             <td style={{ border: "1px solid black", padding: "3px 5px", lineHeight: "1.6" }}><strong>Total</strong></td>
             <td style={{ border: "1px solid black", padding: "3px 5px", textAlign: 'end', lineHeight: "1.2" }}><strong>{data?.[0]?.totalAmount}</strong></td>
           </tr>
         </tbody>
       </table>
          </Box>

          {/* Payment Details */}
          <Box sx={{ mt: 2 }}>
          {data[0]?.transaction_no && data[0]?.transaction_date && (
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="body1"><strong>Transaction No.:</strong> {data?.[0]?.transaction_no}</Typography>
          <Typography variant="body1"><strong>Transaction Date:</strong> {data?.[0]?.transaction_date ?? "NA"}</Typography>
          </Box>
          )}
           <Typography variant="body1"><strong>Remarks: </strong>{data?.[0]?.remarks}</Typography>
           <Typography variant="body1"><strong>
            Received a sum of Rs. {toUpperCamelCaseWithSpaces(
               numberToWords.toWords(Number(data?.[0]?.totalAmount ?? ""))
             )} /-</strong></Typography>
          </Box>

          {/* Signature */}
          <Box sx={{ mt: 4, textAlign: "right",  right: 20, bottom: 20 }}>
            <Typography variant="body1">Signature</Typography>
            <Typography variant="body1">(cashier)</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default HostelFeeReceiptPdfNew;
