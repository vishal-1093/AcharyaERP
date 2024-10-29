import { useEffect, useState } from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import numberToWords from "number-to-words";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const breadCrumbsList = [
  { name: "JV Verifier", link: "/journal-verify" },
  { name: "Verify" },
];

function JournalVerifyForm() {
  const [data, setData] = useState(null);
  const [voucherData, setVoucherData] = useState([]);

  const { vcNo, schoolId, fcyearId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/finance/getDraftJournalVoucherData/${vcNo}/${schoolId}/${fcyearId}`
      );
      const responseData = response.data;
      const resData = responseData[0];
      setCrumbs([
        ...breadCrumbsList,
        { name: resData.school_name_short },
        { name: resData.financial_year },
      ]);
      setData(resData);
      setVoucherData(responseData);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    }
  };

  if (!data) return;

  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "#F1FDFE",
              p: 5,
              mb: 3,
              borderRadius: 5,
            }}
          >
            <Grid container rowSpacing={4}>
              <Grid item xs={12}>
                <TableContainer>
                  <Table
                    size="small"
                    sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Particulas</StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "right" }}>
                          Debit
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "right" }}>
                          Credit
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {voucherData.map((obj, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ borderBottom: "hidden" }}>
                            {obj.voucher_head}
                          </TableCell>
                          <StyledTableCellBody
                            sx={{
                              textAlign: "right",
                              borderBottom: "hidden !important",
                            }}
                          >
                            {obj.debit}
                          </StyledTableCellBody>
                          <StyledTableCellBody
                            sx={{
                              textAlign: "right",
                              borderBottom: "hidden !important",
                            }}
                          >
                            {obj.credit}
                          </StyledTableCellBody>
                        </TableRow>
                      ))}
                      <TableRow>
                        <StyledTableCellBody
                          sx={{
                            borderBottom: "hidden !important",
                          }}
                        >
                          Pay To :{` ${data.pay_to}`}
                        </StyledTableCellBody>
                        <StyledTableCellBody
                          sx={{
                            borderBottom: "hidden !important",
                          }}
                        />
                        <StyledTableCellBody
                          sx={{
                            borderBottom: "hidden !important",
                          }}
                        />
                      </TableRow>
                      <TableRow>
                        <StyledTableCellBody
                          sx={{
                            borderBottom: "hidden !important",
                          }}
                        >
                          Department :{` ${data.dept_name_short}`}
                        </StyledTableCellBody>
                        <StyledTableCellBody
                          sx={{
                            borderBottom: "hidden !important",
                          }}
                        />
                        <StyledTableCellBody
                          sx={{
                            borderBottom: "hidden !important",
                          }}
                        />
                      </TableRow>
                      <TableRow>
                        <StyledTableCellBody
                          sx={{
                            borderBottom: "hidden !important",
                          }}
                        >
                          Narration :{` ${data.remarks}`}
                        </StyledTableCellBody>
                        <StyledTableCellBody />
                        <StyledTableCellBody />
                      </TableRow>
                      <TableRow>
                        <StyledTableCellBody
                          sx={{ textTransform: "capitalize" }}
                        >
                          <Typography variant="subtitle2">
                            {`${numberToWords.toWords(
                              Number(data.debit_total)
                            )} rupess`}
                          </Typography>
                        </StyledTableCellBody>
                        <StyledTableCellBody sx={{ textAlign: "right" }}>
                          <Typography variant="subtitle2">
                            {data.debit_total}
                          </Typography>
                        </StyledTableCellBody>
                        <StyledTableCellBody sx={{ textAlign: "right" }}>
                          <Typography variant="subtitle2">
                            {data.credit_total}
                          </Typography>
                        </StyledTableCellBody>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle2">Created By :</Typography>
                  <Typography variant="subtitle2" color="textSecondary">{` ${
                    data.created_username
                  } on ${moment(data.created_date).format(
                    "DD-MM-YYYY LT"
                  )}`}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} align="right">
                <Button variant="contained">Verify</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default JournalVerifyForm;
