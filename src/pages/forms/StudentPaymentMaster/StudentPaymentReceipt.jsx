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
        const response = await axios.get(
          `/api/finance/getFeeReceiptDetails?studentId=${studentDataResponse.data.data[0].student_id}`
        );

        const encodeAuid = btoa(username);

        const phpResponse = await Axios.get(
          `https://www.acharyainstitutes.in//index.php?r=acerp-api-std/receipts&code=${encodeAuid}`
        );

        const array = phpResponse.data.data.map((obj) => ({
          ...obj,
          php_status: true,
        }));

        const updatedArray = [...response.data.data, ...array];

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
                            val?.amount?.toString().includes(search) ||
                            val?.orderId?.includes(search) ||
                            val?.year?.includes(search) ||
                            val?.receiptType
                              ?.toLowerCase()
                              .includes(search.toLowerCase()) ||
                            val?.receiptNo?.includes(search)
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
                                {obj.amount}
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
                                  ""
                                )}
                              </StyledTableCell>
                              {/* <StyledTableCell>
                                {obj.receiptType.toLowerCase() === "bulk" &&
                                obj.studentId !== null ? (
                                  <IconButton
                                    onClick={() =>
                                      navigate(
                                        `/BulkFeeReceiptPdf/${obj.student_id}/${obj.fee_receipt_id}/${obj.transaction_type}/${obj.financial_year_id}`
                                      )
                                    }
                                    sx={{ cursor: "pointer" }}
                                    color="primary"
                                  >
                                    <Download fontSize="small" />
                                  </IconButton>
                                ) : obj.receiptType.toLowerCase() === "bulk" &&
                                  obj.student_id === null ? (
                                  <IconButton
                                    onClick={() =>
                                      navigate(
                                        `/BulkFeeReceiptPdf/${obj.fee_receipt_id}/${obj.transaction_type}/${obj.financial_year_id}`
                                      )
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
                                      navigate(
                                        `/HostelFeePdf/${obj.fee_receipt_id}`,
                                        {
                                          state: { replace: false },
                                        }
                                      )
                                    }
                                    color="primary"
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <Download fontSize="small" />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    onClick={() =>
                                      navigate(
                                        `/FeeReceiptDetailsPDF/${obj.auid}/${obj.student_id}/${obj.receiptNo}/${obj.financial_year_id}/${obj.transaction_type}`
                                      )
                                    }
                                    color="primary"
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <Download fontSize="small" />
                                  </IconButton>
                                )}
                              </StyledTableCell> */}
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
