import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      fontSize: "15px",
    },
  },
});

function StudentHistory({ historyData }) {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} mt={3}>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.headerWhite.main,
              }}
            >
              <TableRow>
                <TableCell>SL.No</TableCell>
                <TableCell>Mentor Name</TableCell>
                <TableCell>From Date</TableCell>
                <TableCell>To Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((val, i) => (
                <TableRow key={i} style={{ height: 10 }}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{val.proctor_id}</TableCell>
                  <TableCell>
                    {val.from_date ? val.from_date.slice(0, 10) : ""}
                  </TableCell>
                  <TableCell>
                    {val.to_date ? val.to_date.slice(0, 10) : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
export default StudentHistory;
