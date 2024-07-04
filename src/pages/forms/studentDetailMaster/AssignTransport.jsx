import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function AssignTransport({
  values,
  academicYearOptions,
  handleChangeAdvance,
  pickUpPointOptions,
  handleChange,
  handleAssign,
  validation,
  history,
}) {
  return (
    <Box mt={2}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="transportAcyearId"
            label="Ac Year"
            value={values.transportAcyearId}
            options={academicYearOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomAutocomplete
            name="pickUpPoints"
            label="Pick Up Points"
            value={values.pickUpPoints}
            options={pickUpPointOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="stageName"
            label="Route"
            value={values.stageName}
            handleChange={handleChange}
            disabled
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomTextField
            name="amount"
            label="Charges"
            value={values.amount}
            handleChange={handleChange}
            disabled
            required
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <CustomTextField
            name="remarks"
            label="Remarks"
            value={values.remarks}
            handleChange={handleChange}
            disabled
            multiline
            rows={2}
            required
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button variant="contained" onClick={handleAssign}>
            Assign
          </Button>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography variant="h6" color="error">
            {validation !== "" ? validation : ""}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {history.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>AUID</StyledTableCell>
                    <StyledTableCell>Ac Year</StyledTableCell>
                    <StyledTableCell>Pick Up Point</StyledTableCell>
                    <StyledTableCell>Route</StyledTableCell>
                    <StyledTableCell>Charges</StyledTableCell>
                    <StyledTableCell>Created Date</StyledTableCell>
                    <StyledTableCell>Created By</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {history.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCell>{obj.auid}</StyledTableCell>
                        <StyledTableCell>{obj.academicYear}</StyledTableCell>
                        <StyledTableCell>{obj.pickUpPoint}</StyledTableCell>
                        <StyledTableCell>{obj.stageName}</StyledTableCell>
                        <StyledTableCell>{obj.charges}</StyledTableCell>
                        <StyledTableCell>
                          {obj.createdAt
                            .substr(0, 10)
                            .split("-")
                            .reverse()
                            .join("-")}
                        </StyledTableCell>
                        <StyledTableCell>{obj.createdUserName}</StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default AssignTransport;
