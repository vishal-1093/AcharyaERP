import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import reportingStatus from "../utils/ReportingStatus";

const bookmanFont = {
  fontFamily: "Roboto",
  fontSize: "13px !important",
};

const bookmanFontPrint = {
  fontFamily: "Roboto",
  color: "black",
  fontSize: "24px !important",
};

function StudentDetailsByAuid({ isPrintClick, studentData }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (error) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        {error}
      </Typography>
    );
  }

  if (!studentData) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center", marginBottom: 2 }}
      >
        Student data not found
      </Typography>
    );
  }

  return (
    <>
      {studentData && (
        <>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              overflow: "hidden",
              mb: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: "tableBg.main",
                color: "tableBg.textColor",
                textAlign: "center",
                p: 1,
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={isPrintClick ? bookmanFontPrint : bookmanFont}
              >
                {"Student Details"}
              </Typography>
            </Box>

            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    AUID
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.auid || ""}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Student Name
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.student_name || ""}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    USN
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "12px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.usn ?? ""}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    DOA
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.date_of_admission
                        ? moment(studentData.date_of_admission).format(
                            "DD-MM-YYYY"
                          )
                        : ""}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Program
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.program_short_name} -{" "}
                      {studentData.program_specialization_short_name}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Academic Batch
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.academic_batch || ""}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Current Year/Sem
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.current_year}/{studentData.current_sem} -{" "}
                      {studentData.section_name}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Fee Template
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.fee_template_name}
                      {studentData?.program_type_name?.toLowerCase() ===
                      "semester"
                        ? "S"
                        : "Y"}{" "}
                      - {studentData.fee_template_id}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Nationality
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.nationalityName || ""}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Admission Category
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.fee_admission_category_short_name}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Acharya Email
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.acharya_email || ""}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                    }}
                  >
                    Mobile No.
                  </TableCell>
                  <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                    <span>:</span>
                    <span
                      style={{
                        marginLeft: "15px",
                        ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                      }}
                    >
                      {studentData.mobile || ""}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </>
      )}
    </>
  );
}

export default StudentDetailsByAuid;
