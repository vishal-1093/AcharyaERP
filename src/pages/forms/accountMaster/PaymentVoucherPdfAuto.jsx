import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
} from "@mui/material";
import logo from "../../../assets/acc.png";
import moment from "moment";
import numberToWords from "number-to-words";

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

function PaymentVoucherPdfAuto({ voucherData }) {
  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const convertToRupeesAndPaise = (amount) => {
    const [rupees, paise] = Number(amount)?.toFixed(2)?.split(".");

    let result = "";
    if (parseInt(rupees) > 0) {
      result += numberToWords.toWords(parseInt(rupees)) + " rupees";
    }
    if (parseInt(paise) > 0) {
      if (result) result += " and ";
      result += numberToWords.toWords(parseInt(paise)) + " paise";
    }
    if (!result) result = "zero rupees";

    return result;
  };

  return (
    <>
      {voucherData?.map((obj, index) => {
        return (
          <>
            <Paper
              key={`dynamic-${index}`}
              id={`dynamicVoucher-${index}`}
              elevation={3}
              sx={{
                p: 3,
                maxWidth: 840,
                margin: "0 auto",
                position: "relative",
                marginTop: 2,
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

              <Box sx={{ border: "1px solid #000", ...bookmanFont }}>
                {/* Institution Header */}
                <Box sx={{ textAlign: "center", mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ ...headerStyle, textTransform: "uppercase" }}
                  >
                    {obj?.interschool_name || ""}
                  </Typography>
                  <Typography sx={bookmanFont}>
                    Acharya Dr. Sarvepalli Radhakrishna Road, Bengaluru,
                    Karnataka 560107
                  </Typography>
                </Box>

                {/* Journal Voucher Heading */}
                <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
                  <Typography variant="h6" sx={headerStyle}>
                    Journal Voucher-Inter School
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
                      {obj?.voucher_no}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: "600" }}>
                        FC Year:{" "}
                      </Box>{" "}
                      {obj?.financial_year}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: "600" }}>
                        Date:{" "}
                      </Box>{" "}
                      {moment(obj?.created_date).format("DD-MM-YYYY")}
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
                              <Box sx={{ ...bookmanFont }}>
                                {obj?.voucher_head}
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
                        >
                          {obj?.credit}
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
                              {`${obj?.school_name} `}
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
                        ></TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "none",
                            textAlign: "right",
                            verticalAlign: "top",
                            padding: "5px",
                            ...bookmanFont,
                          }}
                        >
                          {obj?.debit}
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
                              Narration: Paid to{" "}
                              {voucherData?.[0]?.voucher_head}{" "}
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
                            {toUpperCamelCaseWithSpaces(
                              convertToRupeesAndPaise(Number(obj?.debit ?? 0))
                            )}{" "}
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
                          {obj?.debit}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderTop: "1px solid #000",
                            textAlign: "right",
                            padding: "5px",
                            ...amountStyle,
                          }}
                        >
                          {obj?.credit}
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
                    {voucherData?.[0]?.created_name}
                    <br />
                    Created By
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="center">
                  <Typography variant="body1">
                    {voucherData?.[0]?.verifyName}
                    {/* -{" "}
                            {moment(voucherData?.[0]?.verified_date).format("DD-MM-YYYY")}{" "} */}
                    <br /> Verified By
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="right">
                  <Typography variant="body1">
                    {voucherData?.[0]?.approverName}
                    {/* -{" "}
                            {moment(voucherData?.[0]?.approved_date).format("DD-MM-YYYY")}{" "} */}
                    <br /> Approved By
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </>
        );
      })}
    </>
  );
}

export default PaymentVoucherPdfAuto;
