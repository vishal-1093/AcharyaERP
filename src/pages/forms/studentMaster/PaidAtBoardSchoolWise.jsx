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
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function PaidAtBoardSchoolWise() {
  const [schoolWiseDue, setSchoolWiseDue] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const location = useLocation();
  const state = location?.state;

  useEffect(() => {
    getSchoolWiseDue();
  }, []);

  const getSchoolWiseDue = async () => {
    try {
      const boardWiseResponse = await axios.get(
        `/api/finance/paidBoardReportBasedOnFeeAdmissionCategory`
      );
      setSchoolWiseDue(boardWiseResponse.data.data);
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  console.log(state);

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
                    borderRadius: 10,
                  }}
                  variant="h6"
                >
                  Paid At Board
                </Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>SL No.</StyledTableCell>
                        <StyledTableCell>School Name</StyledTableCell>
                        <StyledTableCell>Due Total</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {schoolWiseDue?.map((obj, i) => {
                        return (
                          <StyledTableRow key={i}>
                            <StyledTableCell>{i + 1}</StyledTableCell>
                            <StyledTableCell>
                              {obj.board_unique_name}
                            </StyledTableCell>
                            <TableCell
                              sx={{
                                fontSize: 14,
                                border: "1px solid #DCDCDC",
                                textAlign: "right",
                                cursor: "pointer",
                              }}
                            >
                              <span style={{ color: "#0000FF" }}>
                                {obj.balance}
                              </span>
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
export default PaidAtBoardSchoolWise;
