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
  Breadcrumbs,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assets/acc.png";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import numberToWords from "number-to-words";
import useAlert from "../../../hooks/useAlert";
import FundTransferPdfAuto from "./FundTransferPdfAuto";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
   breadcrumbsContainer: {
        position: "relative",
        marginBottom: 10,
        width: "fit-content",
        zIndex: theme.zIndex.drawer - 1,
        marginLeft: '-130px'
    },
    link: {
        color: '#4A57A9',
        textDecoration: "none",
        cursor: "pointer",
        "&:hover": { textDecoration: "underline" },
    },
}));

const PaymentVoucherPdf = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);
  const [breadCrumb, setBreadCrumb] = useState([])
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const pathname = useLocation();
  const location = useLocation();
  const grnPdfStatus = location?.state?.grnPdfStatus;
  const directPdfStatus = location?.state?.directPdfStatus;
  const advancePdfStatus = location?.state?.advancePdfStatus;
  const queryValues = location?.state?.query

  useEffect(() => {
    getPaymentVoucherData();
    if(queryValues?.date){
      setCrumbs([])
      setBreadCrumb([
        { name: "Payment Tracker", link: "/Accounts-ledger-day-credit-transaction", state: queryValues }]);
    }else{
    if (grnPdfStatus) {
      setCrumbs([{ name: "Payment Tracker", link: "/journalmaster/grn" }]);
    } else if (directPdfStatus) {
      setCrumbs([{ name: "Payment Tracker", link: "/JournalMaster/Demand" }]);
    } else if (advancePdfStatus) {
      setCrumbs([
        { name: "Payment Tracker", link: "/AdvanceVoucherMaster/Paid" },
      ]);
    } else {
      setCrumbs([{ name: "Payment Tracker", link: "/VoucherMaster/Payment" }]);
    }
  }
  }, []);

  const getPaymentVoucherData = async () => {
    try {
      const response = await axios.get(
        `/api/purchase/getPaymentVoucherDetails?payment_voucher_id=${id}`
      );

      setVoucherData(response.data);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const handleDownloadPdf = () => {
    setHideButtons(true);
    setTimeout(async () => {
      try {
        const pdf = new jsPDF("p", "mm", "a4");

        // 1. Capture and add static voucher (original copy)
        const staticVoucher = document.getElementById("staticVoucher");
        const staticCanvas = await html2canvas(staticVoucher, { scale: 2 });
        const staticImgData = staticCanvas.toDataURL("image/png");
        const imgWidth = 190;
        const staticImgHeight =
          (staticCanvas.height * imgWidth) / staticCanvas.width;

        pdf.addImage(staticImgData, "PNG", 10, 10, imgWidth, staticImgHeight);

        // 2. Capture and add dynamic vouchers (copies)
        const voucherCount = voucherData.length;
        for (let i = 0; i < voucherCount; i++) {
          pdf.addPage(); // New page for each copy
          const dynamicVoucher = document.getElementById(`dynamicVoucher-${i}`);
          const dynamicCanvas = await html2canvas(dynamicVoucher, { scale: 2 });
          const dynamicImgData = dynamicCanvas.toDataURL("image/png");
          const dynamicImgHeight =
            (dynamicCanvas.height * imgWidth) / dynamicCanvas.width;

          pdf.addImage(
            dynamicImgData,
            "PNG",
            10,
            10,
            imgWidth,
            dynamicImgHeight
          );
        }

        // Open PDF in new window for printing
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl, "_blank");

        if (printWindow) {
          printWindow.addEventListener("load", () => {
            printWindow.focus();
            printWindow.print();
          });
        }
      } catch (error) {
        console.error("PDF generation failed:", error);
      } finally {
        setHideButtons(false);
      }
    }, 100);
  };

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
       {queryValues?.date ? (
           <CustomBreadCrumbs crumbs={breadCrumb} />
        ): <></>}
      <Paper
        id="staticVoucher"
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
        {queryValues?.date ? (
           <CustomBreadCrumbs crumbs={breadCrumb} />
        ): <></>}
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
              Fund Transfer Voucher
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
                      borderRight: "1px solid #000",
                      borderBottom: "1px solid #000",
                      textAlign: "center",
                      width: 110,
                      ...headerStyle,
                    }}
                  >
                    Debit (₹)
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
                    Credit (₹)
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
                          borderRight: "1px solid #000",
                          textAlign: "right",
                          verticalAlign: "top",
                          padding: "5px",
                          ...bookmanFont,
                        }}
                      >
                        {item?.debit}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          textAlign: "right",
                          verticalAlign: "top",
                          padding: "5px",
                          ...bookmanFont,
                        }}
                      ></TableCell>
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
                          {`${voucherData?.[0]?.bank_name}`}
                        </Box>
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
                      borderBottom: "none",
                      textAlign: "right",
                      verticalAlign: "top",
                      padding: "5px",
                    }}
                  >
                    {voucherData?.[0]?.credit_total}
                  </TableCell>
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
                          ? ` approved by ${voucherData?.[0]?.created_username}`
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
                      borderRight: "1px solid #000",
                      textAlign: "right",
                      padding: "5px",
                      ...amountStyle,
                    }}
                  >
                    {voucherData?.[0]?.debit_total}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderTop: "1px solid #000",
                      textAlign: "right",
                      padding: "5px",
                      ...amountStyle,
                    }}
                  >
                    {voucherData?.[0]?.credit_total}
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
          <Grid item xs={4}>
            <Typography variant="body1">
              {voucherData?.[0]?.created_name} -{" "}
              {moment(voucherData?.[0]?.created_date).format("DD-MM-YYYY")}{" "}
              <br />
              Created By
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <Typography variant="body1">
              {voucherData?.[0]?.verifyName} -{" "}
              {moment(voucherData?.[0]?.verified_date).format("DD-MM-YYYY")}{" "}
              <br /> Verified By
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Typography variant="body1">
              {voucherData?.[0]?.approverName} -{" "}
              {moment(voucherData?.[0]?.approved_date).format("DD-MM-YYYY")}{" "}
              <br /> Approved By
            </Typography>
          </Grid>
        </Grid>

        {/* */}
      </Paper>

      <Grid mt={2}>
        <FundTransferPdfAuto voucherData={voucherData} />
      </Grid>
    </Container>
  );
};

export default PaymentVoucherPdf;


const CustomBreadCrumbs = ({ crumbs = [] }) => {
    const navigate = useNavigate()
    const classes = useStyles()
    if (crumbs.length <= 0) return null

    return (
        <Box className={classes.breadcrumbsContainer}>
            <Breadcrumbs
                style={{ fontSize: "1.15rem" }}
                separator={<NavigateNextIcon fontSize="small" />}
            >
                {crumbs?.map((crumb, index) => {
                    return (
                        <span key={index}>
                                <Typography
                                    onClick={() => navigate(crumb.link, { state: crumb.state })}
                                    className={classes.link}
                                    fontSize="inherit"
                                >
                                    {crumb.name}
                                </Typography>
                        </span>
                    );
                })}
            </Breadcrumbs>
        </Box>
    )
}

