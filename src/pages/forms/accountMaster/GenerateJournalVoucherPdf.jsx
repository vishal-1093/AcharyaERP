// import {
//   Document,
//   Page,
//   pdf,
//   StyleSheet,
//   Text,
//   View,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   pageLayout: {
//     fontSize: 10,
//     fontFamily: "Times-Roman",
//   },
//   layout: { margin: "20px 20px 20px 40px" },
//   box: {
//     border: "1px solid black",
//     padding: "5px",
//   },
//   school: {
//     textAlign: "center",
//     fontFamily: "Times-Bold",
//     fontSize: 11,
//   },
//   address: { textAlign: "center", marginBottom: "15px" },
//   label: {
//     textAlign: "center",
//     marginBottom: "10px",
//     fontFamily: "Times-Bold",
//     fontSize: 11,
//   },
//   row: { display: "flex", flexDirection: "row" },
//   table: {
//     display: "table",
//     width: "95%",
//     borderStyle: "solid",
//     borderWidth: 0.5,
//     borderColor: "#000",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderColor: "#000",
//   },
// });

// export const GenerateJournalVoucherPdf = async (data, responseData) => {
//   const CustomRow = ({ children }) => (
//     <View style={styles.tableRow}>{children}</View>
//   );

//   const CustomCell = ({
//     label,
//     borderRight,
//     borderBottom,
//     fontFamily,
//     width,
//     align = "center",
//     color = "transparent",
//   }) => (
//     <Text
//       style={{
//         padding: 3,
//         borderRightWidth: borderRight,
//         borderBottomWidth: borderBottom,
//         borderColor: "#000",
//         fontFamily,
//         width: `${width}%`,
//         textAlign: align,
//         textTransform: "capitalize",
//         backgroundColor: color,
//       }}
//     >
//       {label}
//     </Text>
//   );

//   return new Promise(async (resolve, reject) => {
//     try {
//       const generateDocument = (
//         <Document title="Journal Voucher">
//           <Page size="A4" style={styles.pageLayout}>
//             <View style={styles.layout}>
//               <View style={styles.box}>
//                 <View>
//                   <Text style={styles.school}>{data.schoolName}</Text>
//                 </View>
//                 <View>
//                   <Text style={styles.address}>
//                     Acharya Dr.Sarvepalli Radhakrishnan Road,Bengaluru,Karnataka
//                     560107
//                   </Text>
//                 </View>
//                 <View>
//                   <Text style={styles.label}>Journal Voucher</Text>
//                 </View>
//                 <View style={styles.row}>
//                   <View style={{ flex: 1 }}>
//                     <View style={styles.row}>
//                       <Text>Voucher No : </Text>
//                       <Text>{data.voucherNo}</Text>
//                     </View>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <View style={{ ...styles.row, justifyContent: "center" }}>
//                       <Text>Fc Year : </Text>
//                       <Text>{data.fcYear}</Text>
//                     </View>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <View style={{ ...styles.row, justifyContent: "flex-end" }}>
//                       <Text>Date : </Text>
//                       <Text>{data.date}</Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.table}>
//                 <CustomRow>
//                   <CustomCell
//                     label="Particulars"
//                     borderRight={0.5}
//                     borderBottom={0.5}
//                     fontFamily="Times-Bold"
//                     width={3}
//                   />
//                 </CustomRow>
//               </View>
//             </View>
//           </Page>
//         </Document>
//       );
//       const blob = await pdf(generateDocument).toBlob();
//       resolve(blob);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };


import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Container, Grid, Table, TableContainer, TableCell, TableBody, TableRow, TableHead } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assets/acc.png";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import numberToWords from "number-to-words";
import useAlert from "../../../hooks/useAlert";

const JournalVoucherPdf = (data, responseData) => {
    const [voucherData, setVoucherData] = useState({});
    const [hideButtons, setHideButtons] = useState(false);
    const { setAlertMessage, setAlertOpen } = useAlert();
    const setCrumbs = useBreadcrumbs();
    const { id } = useParams()
    const pathname = useLocation()

    useEffect(() => {
        getJournalVocherData();
        setCrumbs([{ name: "Payment Tracker", link: "/journal-grn" }]);
    }, []);

    const getJournalVocherData = async (journalId) => {
        try {
            const response = await axios.get(
                `/api/purchase/getJournalVoucherData?journal_voucher_id=${id}` 
            );
            const responseData = response.data;

            const {
                school_name: schoolName,
                financial_year: fcYear,
                pay_to: payTo,
                dept_name: dept,
                remarks,
                debit_total: debitTotal,
                credit_total: creditTotal,
                created_username: createdBy,
                created_date: createdDate,
                journal_voucher_number: voucherNo,
                verifier_name: verifierName,
                date,
            } = responseData[0];
            const data = {
                schoolName,
                fcYear,
                payTo,
                dept,
                remarks,
                debitTotal,
                creditTotal,
                createdBy,
                createdDate,
                voucherNo,
                fcYear,
                date,
                verifierName,
            };
            setVoucherData({ data, responseData })
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

    return (
        <Container>
            <Paper
                id="receipt"
                elevation={3}
                sx={{
                    p: 3,
                    maxWidth: 940,
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
                        width: "25%",
                        height: "auto",
                        opacity: 0.15, // Very light watermark
                    }}
                />

                {/* Print Button */}
                {!hideButtons && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
                            Print
                        </Button>
                    </Box>
                )}
                <Box sx={{ border: "1px solid #000" }}>
                    {/* Institution Header */}
                    <Box sx={{ textAlign: "center", mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                            {voucherData?.data?.schoolName || ""}
                        </Typography>
                        <Typography variant="body2">
                            Acharya Dr. Sarvepalli Radhakrishna Road, Bengaluru, Karnataka 560107
                        </Typography>
                    </Box>

                    {/* Journal Voucher Heading */}
                    <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Journal Voucher
                        </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
                        <Grid item xs={4}>
                            <Typography variant="body2">
                                <strong>Voucher No: </strong>{voucherData?.data?.voucherNo}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body2"> <strong>FC Year: </strong>{voucherData?.data?.financial_year}</Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="right">
                            <Typography variant="body2">
                                <strong>Date: </strong>{voucherData?.data?.date}
                            </Typography>
                        </Grid>
                    </Grid>

                    <TableContainer component={Paper}>
                        <Table>
                            {/* Table Header */}
                            <TableHead>
                                <TableRow sx={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
                                    <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #000", borderBottom: "1px solid #000", textAlign: "center", }}>Particulars</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", borderRight: "1px solid #000", borderBottom: "1px solid #000", textAlign: "center", width: 100 }}>Debit</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", textAlign: "center", width: 100, borderBottom: "1px solid #000" }}>Credit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ borderBottom: "none" }}>
                                    <TableCell sx={{ borderRight: "1px solid #000", borderBottom: "none", paddingBottom: 0 }}>
                                        <Typography variant="body1">
                                            REGISTRATION & RENEWALS - <br />
                                            MANJUNATH H S
                                        </Typography>

                                        {/* Vertical Gap between "Pay To" and "Department" */}
                                        <Box sx={{ height: "100px" }} />
                                        {/* <Typography variant="body1"><strong>Pay To:</strong>{voucherData?.data?.payTo}</Typography>
                                     <Typography variant="body1"><strong>Department:</strong>{voucherData?.data?.dept}</Typography>
                                     <Typography variant="body1"><strong>Narration:</strong> EXPENSES INCURRED FOR HOSTEL ADMIN / SUN FEE</Typography>
                                     <Typography variant="body1"><strong>HELINET FEE DT:</strong> 25/03/2025 REF NO: 235</Typography> */}
                                    </TableCell>
                                    <TableCell sx={{ borderRight: "1px solid #000", borderBottom: "1px solid #000", textAlign: "right", verticalAlign: "top" }}>13962.00</TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid #000", textAlign: "right", verticalAlign: "top" }}>13962.00</TableCell>
                                </TableRow>
                                <TableRow sx={{ border: "none", height: "30px", padding: "0px" }}>
                                    <TableCell sx={{ borderRight: "1px solid #000", borderBottom: "none", paddingTop: 0, paddingBottom: 0 }}>
                                        <Typography variant="body2"><strong>Thirteen Thousand Nine Hundred And Sixty-Two Rupees</strong></Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderRight: "1px solid #000", textAlign: "right", padding: "0px" }}><strong>13962.00</strong></TableCell>
                                    <TableCell sx={{ textAlign: "right", padding: "0px" }}><strong> 13962.00 </strong></TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </TableContainer>
                </Box>
                {/* <Box sx={{ display: "flex", marginTop: '20px' }}>
                    <Box sx={{ flex: 1, p: 1 }}>
                        <Typography variant="body1"> <span style={{fontWeight: '500'}}>Created By:</span> <br />{voucherData?.data?.createdBy}</Typography>
                    </Box>
                    <Box sx={{ width: 100, p: 1 }} />
                    <Box sx={{ width: 100, p: 1, textAlign: "right" }}>
                        <Typography variant="body1"> <span style={{fontWeight: '500'}}>Verified By:</span> <br />{voucherData?.data?.verifierName}</Typography>
                    </Box>
                </Box> */}
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px", marginTop: "10px" }}>
                    <Grid item xs={4}>
                        <Typography variant="body1">
                            {voucherData?.data?.createdBy || ""} <br />
                            Created By
                        </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                        <Typography variant="body1">
                            {voucherData?.data?.verifierName || ""} <br /> Verified By
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default JournalVoucherPdf;

