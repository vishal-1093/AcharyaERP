import {
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  tableCellClasses,
  styled,
} from "@mui/material";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
}));
function BankImportedDataById({
  values,
  receiptDetails,
  bankImportedDataById,
  bankName,
}) {
  return (
    <>
      <Grid item xs={12} ml={2}>
        <TableContainer component={Paper} sx={{ position: "relative" }}>
          <Table size="small">
            <TableHead>
              <StyledTableRow>
                <TableCell sx={{ width: "5%" }}>Import Date</TableCell>
                <TableCell sx={{ width: "5%" }}>CHQ/DD No.</TableCell>
                <TableCell sx={{ width: "5%" }}>Transaction No.</TableCell>
                <TableCell sx={{ width: "5%" }}>Transaction Date</TableCell>
                <TableCell sx={{ width: "5%" }}>Deposited In</TableCell>
                <TableCell sx={{ width: "5%" }}>Amount</TableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {moment(bankImportedDataById.created_Date).format(
                    "DD-MM-YYYY"
                  )}
                </TableCell>
                <TableCell
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {bankImportedDataById.cheque_dd_no}
                </TableCell>
                <TableCell>{bankImportedDataById.transaction_no}</TableCell>
                <TableCell>{bankImportedDataById.transaction_date}</TableCell>
                <TableCell>{bankName}</TableCell>
                <TableCell>{bankImportedDataById.amount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} md={6} mt={2} ml={2}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <StyledTableRow>
                <TableCell>Receipt No.</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {receiptDetails.length > 0 ? (
                receiptDetails.map((obj, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{obj.receipt_no}</TableCell>
                      <TableCell>
                        {obj.created_date
                          ? moment(obj.created_date).format("DD-MM-YYYY")
                          : "NA"}
                      </TableCell>

                      <TableCell>{obj.rtgs_net_amount}</TableCell>
                      <TableCell>{obj.paid}</TableCell>
                      <TableCell>{obj.rtgs_balance_amount}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
export default BankImportedDataById;
