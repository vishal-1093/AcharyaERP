import { useState, useEffect, useRef } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableHead,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import { useDownloadExcel } from "react-export-table-to-excel";

const useStyles = makeStyles((theme) => ({
  slNo: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "right",
    width: "5% !important",
  },
  auid: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "10% !important",
  },
  studentName: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "15% !important",
  },
  category: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "15% !important",
  },
  board: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "10% !important",
  },
  pattern: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "8% !important",
  },
  yearsem: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "5% !important",
  },
  topay: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "10% !important",
  },
  received: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "10% !important",
  },
  balance: {
    backgroundColor: "#edeff7",
    color: "black",
    border: "1px solid #DCDCDC",
    textAlign: "center !important",
    width: "10% !important",
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
    fontSize: 12,
    border: "1px solid #DCDCDC",
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function PaidAtBoardStdList() {
  const [stdList, setStdList] = useState([]);
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  const tableRef = useRef(null);
  const location = useLocation();

  const schoolId = location?.state?.school_id;
  const boardUniqueId = location?.state?.board_unique_id;
  const acYearId = location?.state?.ac_year_id;

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Student List",
    sheet: "Student List",
  });

  useEffect(() => {
    getBoardWiseDue();
  }, []);

  const getBoardWiseDue = async () => {
    try {
      const stdWiseResponse = await axios.get(
        `/api/finance/studentDetailsByBoardSchoolAcademicYear/${boardUniqueId}/${schoolId}/${acYearId}`
      );

      setStdList(stdWiseResponse.data.data);
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container justifyContent="center" alignItems="center" mt={2}>
          <Grid item xs={12} md={8}>
            <Grid
              container
              justifyContent="flex-start"
              rowSpacing={2}
              alignItems="center"
            >
              <Grid item xs={12} md={12}>
                <Button variant="contained" onClick={onDownload}>
                  Export to Excel
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                  <Table size="small" ref={tableRef}>
                    <TableHead>
                      <StyledTableRow>
                        <TableCell className={classes.slNo}>SL No.</TableCell>
                        <TableCell className={classes.auid}>AUID</TableCell>
                        <TableCell className={classes.studentName}>
                          Student Name
                        </TableCell>
                        <TableCell className={classes.category}>
                          Category
                        </TableCell>
                        <TableCell className={classes.board}>Board</TableCell>
                        <TableCell className={classes.pattern}>
                          Pattern
                        </TableCell>
                        <TableCell className={classes.yearsem}>
                          Current Year
                        </TableCell>
                        <TableCell className={classes.yearsem}>
                          Current Sem
                        </TableCell>
                        <TableCell className={classes.topay}>To pay</TableCell>
                        <TableCell className={classes.received}>
                          Received
                        </TableCell>
                        <TableCell className={classes.balance}>
                          Balance
                        </TableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {stdList?.map((obj, i) => {
                        return (
                          <StyledTableRow key={i}>
                            <StyledTableCell>{i + 1}</StyledTableCell>
                            <StyledTableCell>{obj.auid}</StyledTableCell>
                            <TableCell
                              sx={{
                                fontSize: 12,
                                border: "1px solid #DCDCDC",
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                navigate(`/paid-at-board-school-wise`, {
                                  state: obj.board_unique_id,
                                })
                              }
                            >
                              {obj.student_name}
                            </TableCell>
                            <StyledTableCell>
                              {obj.fee_admission_category_short_name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.board_unique_short_name}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.program_type_code}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.current_year}
                            </StyledTableCell>
                            <StyledTableCell>{obj.current_sem}</StyledTableCell>
                            <TableCell
                              sx={{
                                fontSize: 12,
                                border: "1px solid #DCDCDC",
                                textAlign: "right",
                                cursor: "pointer",
                              }}
                            >
                              {obj.toPay}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: 12,
                                border: "1px solid #DCDCDC",
                                textAlign: "right",
                                cursor: "pointer",
                              }}
                            >
                              {obj.received}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: 12,
                                border: "1px solid #DCDCDC",
                                textAlign: "right",
                                cursor: "pointer",
                              }}
                            >
                              {obj.balance}
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
export default PaidAtBoardStdList;
