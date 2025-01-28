import { useRef, useState } from "react";
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
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

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

function DetailedAttendanceReport({ data }) {
  const [isDetailed, setIsDetailed] = useState(true);
  const { studentData, sortedDates, stdPresentCount, displayData } = data;
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "detailed-attendance-report",
    sheet: "File",
  });

  const hanldeGeneratePrint = async () => {
    // Chunking utility function
    const chunkArray = (array, chunkSize) =>
      Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
        array.slice(i * chunkSize, i * chunkSize + chunkSize)
      );

    // Chunk rows and columns into smaller arrays (e.g., 20 per page)
    const rowChunks = chunkArray(studentData, 10); // 20 rows per page
    const columnChunks = chunkArray(sortedDates, 20); // 20 columns per page

    // Create pages by combining row and column chunks
    const pages = [];
    rowChunks.forEach((rowChunk) => {
      columnChunks.forEach((columnChunk) => {
        pages.push({ rows: rowChunk, columns: columnChunk });
      });
    });
    console.log("pages :>> ", pages);
    // return;
    const blobFile = await GenerateDetailedAttendanceReport(data, pages);
    window.open(URL.createObjectURL(blobFile));
  };

  const DisplayHeader = ({ label }) => {
    return (
      <Typography variant="subtitle2" sx={{ fontSize: 11 }}>
        {label}
      </Typography>
    );
  };

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

  const handleSwitchChange = () => {
    setIsDetailed(!isDetailed);
  };

  return (
    <Box>
      <Grid container rowSpacing={1}>
        <Grid item xs={12} align="right">
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            {/* <Button variant="contained" size="small" onClick={onDownload}>
              Export to Excel
            </Button> */}
            {/* <IconButton onClick={hanldeGeneratePrint}>
              <PrintIcon color="primary" />
            </IconButton> */}
            <Box
              onClick={() => handleSwitchChange()}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              {isDetailed ? (
                <ToggleOnIcon
                  sx={{
                    fontSize: 40,
                    color: isDetailed ? "primary.main" : "#e6e6e6",
                  }}
                />
              ) : (
                <ToggleOffIcon
                  sx={{
                    fontSize: 40,
                    color: isDetailed ? "primary.main" : "#e6e6e6",
                  }}
                />
              )}
              <Typography variant="subtitle2" color="textSecondary">
                Detailed Report
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer>
            <Table size="small" ref={tableRef}>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: "2%" }}>SN</StyledTableCell>
                  <StyledTableCell sx={{ width: "7%" }}>AUID</StyledTableCell>
                  <StyledTableCell sx={{ width: "7%" }}>USN</StyledTableCell>
                  <StyledTableCell sx={{ width: "15%" }}>
                    Student Name
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: "7%" }}>DOR</StyledTableCell>
                  {isDetailed ? (
                    sortedDates.map((_, i) => (
                      <StyledTableCell key={i}>{i + 1}</StyledTableCell>
                    ))
                  ) : (
                    <>
                      <StyledTableCell>Present Count</StyledTableCell>
                      <StyledTableCell>Class Count</StyledTableCell>
                      <StyledTableCell>Percentage</StyledTableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData.map((obj, i) => {
                  const stdId = obj.student_id;
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCellBody>
                        <DisplayBody label={i + 1} />
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        <DisplayBody label={obj.auid} />
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        <DisplayBody label={obj.usn} />
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        sx={{ textAlign: "left !important" }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          sx={{ textTransform: "capitalize", fontSize: 11 }}
                        >
                          {obj.student_name.toLowerCase()}
                        </Typography>
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
                      {isDetailed ? (
                        sortedDates.map((item, j) => (
                          <StyledTableCellBody key={j}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color:
                                  data.displayData[
                                    `${item.date}-${item.id}-${obj.student_id}`
                                  ] === "A"
                                    ? "error.main"
                                    : "success.main",
                                fontSize: 11,
                              }}
                            >
                              {displayData[`${item.date}-${item.id}-${stdId}`]}
                            </Typography>
                          </StyledTableCellBody>
                        ))
                      ) : (
                        <>
                          <StyledTableCellBody>
                            <DisplayBody label={stdPresentCount[stdId].count} />
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            <DisplayBody label={sortedDates.length} />
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            <DisplayBody
                              label={`${stdPresentCount[stdId].percentage}%`}
                            />
                          </StyledTableCellBody>
                        </>
                      )}
                    </StyledTableRow>
                  );
                })}
                {isDetailed && (
                  <>
                    <StyledTableRow>
                      <StyledTableCellBody
                        colSpan={5}
                        sx={{ textAlign: "left !important" }}
                      >
                        <DisplayHeader label="Present Count/Total Count" />
                      </StyledTableCellBody>
                      {data.sortedDates.map((obj, i) => (
                        <StyledTableCellBody key={i}>
                          <DisplayHeader
                            label={data.totalCount[`${obj.date}-${obj.id}`]}
                          />
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
                            title={
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                  textAlign: "center",
                                  padding: 1,
                                }}
                              >
                                <span>{obj.date}</span>
                                <span>
                                  {data.timeSlots[`${obj.date}-${obj.id}`]}
                                </span>
                              </Box>
                            }
                            placement="top-start"
                            arrow
                          >
                            <span>
                              <DisplayHeader
                                label={`${obj.date.substr(0, 5)}`}
                              />
                            </span>
                          </Tooltip>
                        </StyledTableCellBody>
                      ))}
                    </StyledTableRow>
                  </>
                )}
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={isDetailed ? 5 : 8}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="Faculty Signature" />
                  </StyledTableCellBody>
                  {isDetailed &&
                    data.sortedDates.map((_, i) => (
                      <StyledTableCellBody key={i} />
                    ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={isDetailed ? 5 : 8}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="HOD Signature" />
                  </StyledTableCellBody>
                  {isDetailed &&
                    data.sortedDates.map((_, i) => (
                      <StyledTableCellBody key={i} />
                    ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCellBody
                    colSpan={isDetailed ? 5 : 8}
                    sx={{ textAlign: "left !important" }}
                  >
                    <DisplayHeader label="Principal Signature" />
                  </StyledTableCellBody>
                  {isDetailed &&
                    data.sortedDates.map((_, i) => (
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
