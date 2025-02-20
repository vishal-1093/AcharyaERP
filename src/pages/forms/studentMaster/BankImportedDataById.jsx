import {
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  tooltipClasses,
  styled,
  Typography,
} from "@mui/material";
import moment from "moment";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
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
                  <HtmlTooltip title={bankImportedDataById.cheque_dd_no}>
                    <p>
                      {bankImportedDataById.cheque_dd_no.length > 15
                        ? bankImportedDataById.cheque_dd_no.slice(0, 15) + "..."
                        : bankImportedDataById.cheque_dd_no}
                    </p>
                  </HtmlTooltip>
                </TableCell>
                <TableCell>
                  <HtmlTooltip title={bankImportedDataById.transaction_no}>
                    <p>
                      {bankImportedDataById.transaction_no.length > 15
                        ? bankImportedDataById.transaction_no.slice(0, 15) +
                          "..."
                        : bankImportedDataById.transaction_no}
                    </p>
                  </HtmlTooltip>
                </TableCell>
                <TableCell>{bankImportedDataById.transaction_date}</TableCell>
                <TableCell>{bankName}</TableCell>
                <TableCell>{bankImportedDataById.amount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} md={6} mt={2} ml={2}>
        <>
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
                  <>
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2">
                          No Records Found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </Grid>
    </>
  );
}
export default BankImportedDataById;
