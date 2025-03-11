import {
  Grid,
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
    padding: "2px",
    fontSize: 11,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
    padding: 2,
    fontSize: 11,
  },
}));

function InternalFinalMarksReport({ data }) {
  const DisplayBody = ({ label }) => {
    return (
      <Typography
        variant="subtitle2"
        color="textSecondary"
        sx={{ fontSize: 11 }}
      >
        {label}
      </Typography>
    );
  };

  return (
    <Grid container rowSpacing={4} mt={2}>
      <Grid item xs={12}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={5}>Course</StyledTableCell>
                {Object.keys(data.courses).map((obj) => (
                  <StyledTableCell key={obj} colSpan={data.internals.length}>
                    {data.courses[obj].name}
                  </StyledTableCell>
                ))}
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={5}>Course Code</StyledTableCell>
                {Object.keys(data.courses).map((obj) => (
                  <StyledTableCell key={obj} colSpan={data.internals.length}>
                    {data.courses[obj].code}
                  </StyledTableCell>
                ))}
              </TableRow>
              <TableRow>
                <StyledTableCell>Sl No.</StyledTableCell>
                <StyledTableCell>AUID</StyledTableCell>
                <StyledTableCell>USN</StyledTableCell>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>Section</StyledTableCell>
                {Object.keys(data.courses).flatMap((obj) =>
                  data.internals.map((item) => (
                    <StyledTableCell key={`${obj}-${item.value}`}>
                      {item.value}
                    </StyledTableCell>
                  ))
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.uniqueRows.map((obj, i) => {
                return (
                  <StyledTableRow key={obj.id}>
                    <StyledTableCellBody>
                      <DisplayBody label={i + 1} />
                    </StyledTableCellBody>
                    <StyledTableCellBody>
                      <DisplayBody label={obj.studentAuid} />
                    </StyledTableCellBody>
                    <StyledTableCellBody>
                      <DisplayBody label={obj.usn} />
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      sx={{
                        textAlign: "left !important",
                        paddingLeft: "4px !important",
                      }}
                    >
                      <DisplayBody label={obj.student_name} />
                    </StyledTableCellBody>
                    <StyledTableCellBody></StyledTableCellBody>
                    {Object.keys(data.courses).flatMap((item) =>
                      data.internals.map((inter) => (
                        <StyledTableCellBody key={`${item}-${inter.value}`}>
                          <DisplayBody
                            label={
                              data.marksData[
                                `${obj.student_id}-${item}-${inter.value}`
                              ]
                            }
                          />
                        </StyledTableCellBody>
                      ))
                    )}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default InternalFinalMarksReport;
