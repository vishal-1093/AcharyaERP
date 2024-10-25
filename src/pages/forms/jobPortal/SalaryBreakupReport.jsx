import {
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@mui/material";

function SalaryBreakupReport({ data }) {
  const {
    earnings,
    grossEarning,
    deductions,
    totDeduction,
    management,
    totManagement,
  } = data;

  const tableHeading = (label) => (
    <TableRow>
      <TableCell colSpan={2}>
        <Typography variant="subtitle2">{label}</Typography>
      </TableCell>
    </TableRow>
  );

  const displayTableBody = (data) =>
    data
      .sort((a, b) => a.priority - b.priority)
      .map(
        (obj, i) =>
          Number(obj.value) !== 0 && (
            <TableRow key={i}>
              <TableCell>
                <Typography variant="subtitle2" color="textSecondary">
                  {obj.headName}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" color="textSecondary">
                  {obj.value.toFixed()}
                </Typography>
              </TableCell>
            </TableRow>
          )
      );

  const tableFooter = (label, value) => (
    <TableRow>
      <TableCell>
        <Typography variant="subtitle2">{label}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="subtitle2">{value}</Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer component={Paper} sx={{ width: { md: 500 } }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={2}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                Salary Breakup
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tableHeading("Earnings")}
          {displayTableBody(earnings)}
          {tableFooter("Gross Earning", grossEarning.toFixed())}
          {tableHeading("Deductions")}
          {displayTableBody(deductions)}
          {tableFooter("Total Deductions", totDeduction.toFixed())}
          {tableHeading("Management Contribution")}
          {displayTableBody(management)}
          {tableFooter(
            "Total Management Contribution",
            totManagement.toFixed()
          )}
          {tableFooter(
            "Cost to Company",
            (grossEarning + totManagement).toFixed()
          )}
          {tableFooter("Net Pay", (grossEarning - totDeduction).toFixed())}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SalaryBreakupReport;
