import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

function SalaryStructureDetails({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.headerWhite.main,
          }}
        >
          <TableRow>
            <TableCell>Slab</TableCell>
            <TableCell>Minimium</TableCell>
            <TableCell>Maximum</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((val, i) => (
            <TableRow key={i}>
              <TableCell>{val.slab_details_name}</TableCell>
              <TableCell>{val.min_value}</TableCell>
              <TableCell>{val.max_value}</TableCell>
              <TableCell>{val.head_value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SalaryStructureDetails;
