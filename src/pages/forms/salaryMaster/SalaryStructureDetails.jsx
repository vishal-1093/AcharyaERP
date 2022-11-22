import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

const SalaryStructureDetails = ({ data }) => {
  return (
    <>
      <Grid item xs={12} md={12}>
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
      </Grid>
    </>
  );
};
export default SalaryStructureDetails;
