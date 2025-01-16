import { useRef } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDownloadExcel } from "react-export-table-to-excel";
import PrintIcon from "@mui/icons-material/Print";
import { GenerateDetailedAttendanceReport } from "./GenerateDetailedAttendanceReport";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
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
  },
}));

function DetailedAttendanceReport({ data }) {
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "detailed-attendance-report",
    sheet: "File",
  });

  const hanldeGeneratePrint = async () => {
    const chunkArray = (array, chunkSize) =>
      Array.from({ length: Math.ceil(array?.length / chunkSize) }, (_, i) =>
        array.slice(i * chunkSize, i * chunkSize + chunkSize)
      );
    const rowChunks = chunkArray(data.studentData, 20);
    const columnChunks = chunkArray(Date.sortedDates, 20);
    console.log("rowChunks :>> ", rowChunks);
    console.log("columnChunks :>> ", columnChunks);
    const pages = [];
    rowChunks.forEach((rowChunk) => {
      columnChunks.forEach((columnChunk) => {
        pages.push({ rows: rowChunk, columns: columnChunk });
      });
    });
    console.log("pages :>> ", pages);
    return;
    const blobFile = await GenerateDetailedAttendanceReport(data);
    window.open(URL.createObjectURL(blobFile));
  };

  const DisplayHeader = ({ label }) => {
    return <Typography variant="subtitle2">{label}</Typography>;
  };

  const DisplayBody = ({ label }) => {
    return (
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    );
  };

  return (
    <Box>
      <Grid container rowSpacing={1}>
        {/* <Grid item xs={12} align="right">
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            <Button variant="contained" size="small" onClick={onDownload}>
              Export to Excel
            </Button>
            <IconButton onClick={hanldeGeneratePrint}>
              <PrintIcon color="primary" />
            </IconButton>
          </Box>
        </Grid> */}
        <Grid item xs={12}>
          <TableContainer>
            <Table size="small" ref={tableRef}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sl No.</StyledTableCell>
                  <StyledTableCell>AUID</StyledTableCell>
                  <StyledTableCell>USN</StyledTableCell>
                  <StyledTableCell>Student Name</StyledTableCell>
                  <StyledTableCell sx={{ width: "6% !important" }}>
                    DOR
                  </StyledTableCell>
                  {data.sortedDates.map((obj, i) => (
                    <StyledTableCell key={i}>{i + 1}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.studentData.map((obj, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCellBody>
                        <DisplayBody label={i + 1} />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{ textAlign: "left !important" }}
                      >
                        <DisplayBody label={obj.auid} />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{ textAlign: "left !important" }}
                      >
                        <DisplayBody label={obj.usn} />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{ textAlign: "left !important" }}
                      >
                        <DisplayBody label={obj.student_name} />
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        <DisplayBody
                          label={
                            obj.reporting_date
                              ? moment(obj.reporting_date).format("DD-MM-YYYY")
                              : ""
                          }
                        />
                      </StyledTableCellBody>
                      {data.sortedDates.map((item, j) => (
                        <StyledTableCellBody key={j}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color:
                                data.displayData[
                                  `${item}-${obj.student_id}`
                                ] === "A"
                                  ? "error.main"
                                  : "success.main",
                            }}
                          >
                            {data.displayData[`${item}-${obj.student_id}`]}
                          </Typography>
                        </StyledTableCellBody>
                      ))}
                    </StyledTableRow>
                  );
                })}
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={5}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="Present Count/Total Count" />
                  </StyledTableCellBody>
                  {data.sortedDates.map((obj, i) => (
                    <StyledTableCellBody key={i}>
                      <DisplayHeader label={data.totalCount[obj]} />
                    </StyledTableCellBody>
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={5}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="Date" />
                  </StyledTableCellBody>
                  {data.sortedDates.map((obj, i) => (
                    <StyledTableCellBody key={i}>
                      <Tooltip
                        title={data.timeSlots[obj]}
                        placement="top-start"
                        arrow
                      >
                        <span>
                          <DisplayHeader
                            label={`${obj.substr(0, 6)}${obj.substr(8, 10)}`}
                          />
                        </span>
                      </Tooltip>
                    </StyledTableCellBody>
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={5}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="Faculty Signature" />
                  </StyledTableCellBody>
                  {data.sortedDates.map((obj, i) => (
                    <StyledTableCellBody key={i} />
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={5}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="HOD Signature" />
                  </StyledTableCellBody>
                  {data.sortedDates.map((obj, i) => (
                    <StyledTableCellBody key={i} />
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={5}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="Principal Signature" />
                  </StyledTableCellBody>
                  {data.sortedDates.map((obj, i) => (
                    <StyledTableCellBody key={i} />
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DetailedAttendanceReport;
