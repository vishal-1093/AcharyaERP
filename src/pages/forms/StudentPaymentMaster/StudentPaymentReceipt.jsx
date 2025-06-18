import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableHead,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import Axios from "axios";
import { Download } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
    width: "33.33%",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "1px solid #DCDCDC",
    textAlign: "center",
  },
}));

const StyledTableCells = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "white",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center",
    width: "33.33%",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function StudentPaymentReceipt() {
  const [transactionData, setTransactionData] = useState([]);
  const [search, setSearch] = useState("");
  const [studentData, setStudentData] = useState([]);

  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getStudentTransactionData();
  }, []);

  const getStudentTransactionData = async () => {
    try {
      const studentDataResponse = await axios.get(
        `/api/student/studentDetailsByAuid/${username}`
      );

      if (studentDataResponse.data.data.length > 0) {
        setStudentData(studentDataResponse.data.data[0]);
        let updatedArray = []; // Initialize an empty array to always ensure a value.

        try {
          // Fetch fee receipt details (first request)
          const response = await axios.get(
            `/api/finance/getFeeReceiptDetails?studentId=${studentDataResponse.data?.data?.[0]?.student_id}`
          );

          const filteredArray = response.data?.data.filter(
            (obj) => obj.receiptNo
          );

          updatedArray = [...filteredArray]; // Default to empty array if no data
        } catch (error) {
          console.error("Error in fetching fee receipt details:", error);
          // Handle error - response will be undefined or fail gracefully
          // You can either leave updatedArray as it is (empty array) or provide fallback data
        }

        try {
          // Fetch fee receipt details (first request)
          const response = await axios.get(
            `/api/getUniformCmaReceipt/${studentDataResponse.data?.data?.[0]?.student_id}`
          );

          const data = [];

          response.data.data.forEach((ele) => {
            data.push({
              studentName: ele.studentName,
              college: ele.college,
              totalAmount: null,
              receiptType:
                ele.receiptType === "cma" ? "Add on fee" : "Uniform fee",
              receiptDate: ele.createdDate,
              receiptNo: ele.receiptNo,
              amount: ele.amount,
              auid: ele.auid,
              fcYear: ele.fcYear,
              course: ele.course,
            });
          });

          // If the response is successful, append its data to the updatedArray
          updatedArray = [...updatedArray, ...data]; // Default to empty array if no data
        } catch (error) {
          console.error("Error in fetching fee receipt details:", error);
          // Handle error - response will be undefined or fail gracefully
          // You can either leave updatedArray as it is (empty array) or provide fallback data
        }

        // Now proceed with fetching the PHP API data
        try {
          // Encode username to Base64
          const encodeAuid = btoa(username);

          // Fetch additional data from PHP API (second request)
          const phpResponse = await Axios.get(
            `https://www.acharyainstitutes.in/index.php?r=acerp-api-std/receipts&code=${encodeAuid}`
          );

          // Map through the PHP API data and add 'php_status'
          const array =
            phpResponse.data?.data?.map((obj) => ({
              ...obj,
              php_status: true,
            })) || [];

          // Append this data to the updatedArray
          updatedArray = [...updatedArray, ...array];
        } catch (error) {
          console.error("Error in fetching PHP API data:", error);
          // Handle error - phpResponse will be undefined or fail gracefully
          // You can either leave updatedArray as it is or provide fallback data
        }

        setTransactionData(updatedArray);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDownload = (viewlink) => {
    window.open(viewlink, "_blank", "noopener,noreferrer");
  };

  console.log(transactionData);

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container justifyContent="center" alignItems="center" mt={2}>
          <Grid item xs={12} md={8}>
            <Grid
              container
              justifyContent="flex-start"
              rowSpacing={2}
              alignItems="center"
            >
              <Grid item xs={12} md={12}>
                <Typography
                  sx={{
                    backgroundColor: "tableBg.main",
                    color: "tableBg.textColor",
                    textAlign: "center",
                    padding: 1,
                  }}
                  variant="subtitle2"
                >
                  Transaction Details
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCells>
                          NAME : {studentData?.student_name}
                        </StyledTableCells>
                        <StyledTableCells>
                          AUID : {studentData?.auid}
                        </StyledTableCells>
                        <StyledTableCells>
                          EMAIL : {studentData?.acharya_email}
                        </StyledTableCells>
                      </StyledTableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={2.5} align="right">
                <CustomTextField
                  label="Search"
                  value={search}
                  handleChange={handleSearch}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>SL No.</StyledTableCell>
                        <StyledTableCell>Receipt No.</StyledTableCell>
                        <StyledTableCell> Date</StyledTableCell>
                        <StyledTableCell>Amount</StyledTableCell>
                        <StyledTableCell>Fc Year</StyledTableCell>
                        <StyledTableCell>Fee Type</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {transactionData
                        ?.filter((val) => {
                          if (search === "") {
                            return val;
                          } else if (
                            val?.amount?.toString()?.includes(search) ||
                            val?.orderId?.includes(search) ||
                            val?.year?.includes(search) ||
                            val?.receiptType
                              ?.toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return val;
                          }
                        })
                        ?.map((obj, i) => {
                          return (
                            <StyledTableRow key={i}>
                              <StyledTableCell>{i + 1}</StyledTableCell>
                              <StyledTableCell>{obj.receiptNo}</StyledTableCell>
                              <StyledTableCell>
                                {obj.createdDate
                                  ? moment(obj.createdDate).format("DD-MM-YYYY")
                                  : moment(obj.receiptDate).format(
                                      "DD-MM-YYYY"
                                    )}
                              </StyledTableCell>
                              <TableCell
                                sx={{
                                  color: "black",
                                  textAlign: "right",
                                }}
                              >
                                {obj.inr_value ?? obj.amount}
                              </TableCell>
                              <StyledTableCell>
                                {obj.year ? obj.year : obj.fcYear}
                              </StyledTableCell>

                              <StyledTableCell>
                                {obj.receiptType}
                              </StyledTableCell>
                              <StyledTableCell>
                                {obj.php_status ? (
                                  <Download
                                    onClick={() => handleDownload(obj.viewlink)}
                                    sx={{ cursor: "pointer" }}
                                    color="primary"
                                    fontSize="small"
                                  />
                                ) : (
                                  <>
                                    {(obj.receiptType.toLowerCase() ===
                                      "bulk" ||
                                      obj.receiptType.toLowerCase() ===
                                        "bulk fee") &&
                                    obj.studentId !== null ? (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/BulkFeeReceiptPdfV1`, {
                                            state: {
                                              studentId:
                                                studentData?.student_id,
                                              feeReceiptId: obj.fee_receipt_id,
                                              transactionType:
                                                obj.transaction_type,
                                              financialYearId:
                                                obj.financial_year_id,
                                              studentStatus: true,
                                            },
                                          })
                                        }
                                        sx={{ cursor: "pointer" }}
                                        color="primary"
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    ) : (obj.receiptType.toLowerCase() ===
                                        "bulk" ||
                                        obj.receiptType.toLowerCase() ===
                                          "bulk fee") &&
                                      obj.student_id === null ? (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/BulkFeeReceiptPdfV1`, {
                                            state: {
                                              studentId: obj.student_id,
                                              feeReceiptId: obj.fee_receipt_id,
                                              transactionType:
                                                obj.transaction_type,
                                              financialYearId:
                                                obj.financial_year_id,
                                              studentStatus: true,
                                            },
                                          })
                                        }
                                        sx={{ cursor: "pointer" }}
                                        color="primary"
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    ) : obj.receiptType.toLowerCase() ===
                                      "hostel fee" ? (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/HostelFeePdfV1`, {
                                            state: {
                                              feeReceiptId: obj.fee_receipt_id,
                                              studentStatus: true,
                                            },
                                          })
                                        }
                                        color="primary"
                                        sx={{ cursor: "pointer" }}
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    ) : obj.receiptType.toLowerCase() ===
                                      "hos" ? (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/HostelFeePdfV1`, {
                                            state: {
                                              feeReceiptId: obj.fee_receipt_id,
                                              studentStatus: true,
                                            },
                                          })
                                        }
                                        color="primary"
                                        sx={{ cursor: "pointer" }}
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    ) : obj.receiptType.toLowerCase() ===
                                        "exam" ||
                                      obj.receiptType.toLowerCase() ===
                                        "exam fee" ? (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/ExamReceiptPdfV1`, {
                                            state: {
                                              feeReceiptId: obj.fee_receipt_id,
                                              studentStatus: true,
                                            },
                                          })
                                        }
                                        color="primary"
                                        sx={{ cursor: "pointer" }}
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    ) : obj.receiptType.toLowerCase() ===
                                      "add on fee" ? (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/NiniskillPdf`, {
                                            state: {
                                              rowData: obj,
                                            },
                                          })
                                        }
                                        color="primary"
                                        sx={{ cursor: "pointer" }}
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    ) : obj.receiptType.toLowerCase() ===
                                      "uniform fee" ? (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/UniformReceiptPdf`, {
                                            state: {
                                              rowData: obj,
                                            },
                                          })
                                        }
                                        color="primary"
                                        sx={{ cursor: "pointer" }}
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        onClick={() =>
                                          navigate(`/FeeReceiptDetailsPDFV1`, {
                                            state: {
                                              auid: studentData.auid,
                                              studentId: studentData.student_id,
                                              feeReceipt: Number(obj.receiptNo),
                                              transactionType:
                                                obj.transaction_type,
                                              feeReceiptId: obj.fee_receipt_id,
                                              financialYearId:
                                                obj.financial_year_id,
                                              studentStatus: true,
                                            },
                                          })
                                        }
                                        color="primary"
                                        sx={{ cursor: "pointer" }}
                                      >
                                        <Download fontSize="small" />
                                      </IconButton>
                                    )}
                                  </>
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
export default StudentPaymentReceipt;
