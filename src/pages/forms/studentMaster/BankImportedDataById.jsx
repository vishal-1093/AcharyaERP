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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function BankImportedDataById({
  values,
  receiptDetails,
  bankImportedDataById,
}) {
  return (
    <>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ position: "relative" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: "5%" }}>
                  Import Date
                </StyledTableCell>
                <StyledTableCell sx={{ width: "5%" }}>
                  CHQ/DD No.
                </StyledTableCell>
                <StyledTableCell sx={{ width: "5%" }}>
                  Transaction No.
                </StyledTableCell>
                <StyledTableCell sx={{ width: "5%" }}>
                  Transaction Date
                </StyledTableCell>
                <StyledTableCell sx={{ width: "5%" }}>
                  Deposited In
                </StyledTableCell>
                <StyledTableCell sx={{ width: "5%" }}>Amount</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell>26-05-2023</StyledTableCell>
                <StyledTableCell
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {bankImportedDataById.cheque_dd_no}
                </StyledTableCell>
                <StyledTableCell>
                  {bankImportedDataById.transaction_no}
                </StyledTableCell>
                <StyledTableCell>
                  {bankImportedDataById.transaction_date}
                </StyledTableCell>
                <StyledTableCell>
                  {bankImportedDataById.voucher_head}
                </StyledTableCell>
                <StyledTableCell>{bankImportedDataById.amount}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} md={6} mt={2}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Receipt No.</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>

                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Paid</StyledTableCell>
                <StyledTableCell>Balance</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receiptDetails.length > 0 ? (
                receiptDetails.map((obj, i) => {
                  return (
                    <TableRow key={i}>
                      <StyledTableCell>{obj.receipt_no}</StyledTableCell>
                      <StyledTableCell>
                        {obj.created_date
                          ? moment(obj.created_date).format("DD-MM-YYYY")
                          : "NA"}
                      </StyledTableCell>

                      <StyledTableCell>{obj.rtgs_net_amount}</StyledTableCell>
                      <StyledTableCell>{obj.paid}</StyledTableCell>
                      <StyledTableCell>
                        {obj.rtgs_balance_amount}
                      </StyledTableCell>
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
