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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation } from "react-router-dom";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";

const useStyles = makeStyles((theme) => ({
  table: {
    // width: "100%",
    // borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
    // width: "auto",
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

function StudentRazorPayTransaction() {
  const [transactionData, setTransactionData] = useState([]);
  const [search, setSearch] = useState("");
  const [studentData, setStudentData] = useState([]);

  const classes = useStyles();
  const location = useLocation();
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
          `/api/student/getTransactionDetails?studentId=${studentDataResponse.data.data[0].student_id}`
        );

        const bulkResponse = await axios.get(
          `/api/student/getBulkTransactionDetails${studentDataResponse.data.data[0].student_id}`
        );

        const uniformResposne = await axios.get(
          `/api/student/getUniformTransactionDetails?studentId=${studentDataResponse.data.data[0].student_id}`
        );

        const updatedArray = [
          ...response.data.data,
          ...uniformResposne.data.data,
        ];

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

              {/* <Grid item xs={12} md={2.5} align="right">
                <CustomTextField
                  label="Search"
                  value={search}
                  handleChange={handleSearch}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                />
              </Grid> */}

              <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>SL No.</StyledTableCell>
                        <StyledTableCell>Transaction Date</StyledTableCell>
                        <StyledTableCell>Order Id</StyledTableCell>
                        <StyledTableCell>Payment Id</StyledTableCell>
                        <StyledTableCell>Amount</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {transactionData?.map((obj, i) => {
                        return (
                          <StyledTableRow key={i}>
                            <StyledTableCell>{i + 1}</StyledTableCell>
                            <StyledTableCell>
                              {obj.transactionDate
                                ? moment(obj.transactionDate).format(
                                    "DD-MM-YYYY"
                                  )
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.orderId ?? obj.orderID}
                            </StyledTableCell>
                            <StyledTableCell>{obj.paymentId}</StyledTableCell>
                            <TableCell
                              sx={{
                                color: "black",
                                textAlign: "right",
                              }}
                            >
                              {obj.amount}
                            </TableCell>
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
export default StudentRazorPayTransaction;
