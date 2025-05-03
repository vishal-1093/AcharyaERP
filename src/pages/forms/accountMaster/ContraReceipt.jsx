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

function ContraReceipt({ voucherData }) {
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

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

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
                maxWidth: 880,
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
                    Receipt
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
                        FC Year:{" "}
                      </Box>{" "}
                      {obj?.financial_year}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: "600" }}></Box>{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body1" sx={bookmanFont}>
                      <Box component="span" sx={{ fontWeight: "600" }}>
                        Date:{" "}
                      </Box>{" "}
                      {obj?.date}
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
                        >
                          {obj?.debit?.slice(0, -2)}
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
                          }}
                        >
                          <>
                            <Typography variant="body1">
                              <Box sx={{ mb: 2.2, ...bookmanFont }}>
                                CASH-INR
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
                            ...bookmanFont,
                          }}
                        >
                          {obj?.credit}
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
                              Narration: Being fund transferred.Inter College
                              transaction
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
                              numberToWords.toWords(Number(obj?.debit ?? ""))
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
                          {obj?.debit?.slice(0, -2)}
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
                    {obj?.created_name} -{" "}
                    {moment(obj?.created_date).format("DD-MM-YYYY")} <br />
                    Created By
                  </Typography>
                </Grid>
                <Grid item xs={4} textAlign="center"></Grid>
                <Grid item xs={4} textAlign="right">
                  <Typography variant="body1"></Typography>
                </Grid>
              </Grid>
            </Paper>
          </>
        );
      })}
    </>
  );
}

export default ContraReceipt;
