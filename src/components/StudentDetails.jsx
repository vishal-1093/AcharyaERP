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
  TableCell
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import reportingStatus from "../utils/ReportingStatus";

function StudentDetails({ id, isStudentdataAvailable = () => {}, header="" }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      setLoading(true);
      const containsAlphabetic = /[a-zA-Z]/.test(id);
      const baseUrl = "/api/student/getStudentDetailsBasedOnAuidAndStrudentId";
      const url = `${baseUrl}?${
        containsAlphabetic ? "auid" : "student_id"
      }=${id}`;

      const response = await axios.get(url);
      setStudentData(response.data.data[0]);
      isStudentdataAvailable(response.data.data[0]);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student details. Please try again later.");
      isStudentdataAvailable({});
    } finally {
      setLoading(false);
    }
  };

  const getOrdinalSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;

    return (
      number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
    );
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2} lg={1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  if (loading) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        Loading ....
      </Typography>
    );
  }

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
        sx={{ textAlign: "center" }}
      >
        No student data available.
      </Typography>
    );
  }

  const handleAuid = (auid) => {
    navigate(`/student-ledger/${auid}`);
  };

  return (
    header ? (
      <>
      <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        mb: 4,
      }}
    >
      <Box
        sx={{
          // backgroundColor: "primary.main",
          // color: "white",
          backgroundColor: "tableBg.main",
          color: "tableBg.textColor",
          textAlign: "center",
          p:1,
          fontWeight: 500,
        }}
      >
       {header ? header : "Student Details"}
      </Box>
    
      <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>AUID</TableCell>
          <TableCell>{studentData.auid}</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
          <TableCell>{studentData.student_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>USN</TableCell>
          <TableCell>{studentData.usn ?? "-"}</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>DOA</TableCell>
          <TableCell>{moment(studentData.date_of_admission).format("DD-MM-YYYY")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Program</TableCell>
          <TableCell>
            {studentData.program_short_name} - {studentData.program_specialization_short_name}
          </TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Academic Batch</TableCell>
          <TableCell>{studentData.academic_batch}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Current Year/Sem</TableCell>
          <TableCell>
            {studentData.current_year}/{studentData.current_sem} - {studentData.section_name} Section
          </TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Fee Template</TableCell>
          <TableCell>
            {studentData.fee_template_name}
            {studentData?.program_type_name?.toLowerCase() === "semester" ? "S" : "Y"} -{" "}
            {studentData.fee_template_id}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Nationality</TableCell>
          <TableCell>{studentData.nationalityName}</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Admission Category</TableCell>
          <TableCell>
            {studentData.fee_admission_category_short_name} - {studentData.fee_admission_sub_category_short_name}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Acharya Email</TableCell>
          <TableCell>{studentData.acharya_email}</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Mobile No.</TableCell>
          <TableCell>{studentData.mobile}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </Box>
    </>
    ):(
      <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title= "Student Details"
            titleTypographyProps={{
              variant: "subtitle2",
            }}
            sx={{
              backgroundColor: "tableBg.main",
              color: "tableBg.textColor",
              textAlign: "center",
              padding: 1,
            }}
          />
          <CardContent>
            <Grid container columnSpacing={2} rowSpacing={1}>
              <DisplayContent label="AUID" value={studentData.auid} />
              <DisplayContent
                label="Student Name"
                value={studentData.student_name}
              />
              <DisplayContent label="USN" value={studentData.usn ?? "-"} />
              <DisplayContent
                label="DOA"
                value={moment(studentData.date_of_admission).format(
                  "DD-MM-YYYY"
                )}
              />
              {/* <DisplayContent label="School" value={studentData.school_name} /> */}
              <DisplayContent
                label="Program"
                value={`${studentData.program_short_name} - ${studentData.program_specialization_short_name}`}
              />
              <DisplayContent
                label="Academic Batch"
                value={studentData.academic_batch}
              />
              <DisplayContent
                label="Current Year/Sem"
                value={`${studentData.current_year}/${studentData.current_sem} -     ${studentData.section_name} Section`}
              />
              <DisplayContent
                label="Fee Template"
                value={`${studentData.fee_template_name}${
                  studentData?.program_type_name?.toLowerCase() === "semester"
                    ? "S"
                    : "Y"
                } - ${studentData.fee_template_id}`}
              />
              <DisplayContent
                label="Admission Category"
                value={`${studentData.fee_admission_category_short_name} - ${studentData.fee_admission_sub_category_short_name}`}
              />
              <DisplayContent
                label="Nationality"
                value={studentData.nationalityName}
              />
              <DisplayContent
                label="Proctor Name"
                value={studentData.proctorName ?? "-"}
              />
              <DisplayContent
                label="Reporting Status"
                value={reportingStatus[studentData.eligible_reported_status]}
              />
              <DisplayContent
                label="Acharya Email"
                value={studentData.acharya_email}
              />
              <DisplayContent label="Mobile No." value={studentData.mobile} />
              <Grid item xs={12} align="center" mt={2}>
                {studentData.newStudentId ? (
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="error"
                      sx={{ fontSize: 13 }}
                    >
                      {`Student Re-Admitted, Current AUID is `}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      onClick={() => handleAuid(studentData.newAuid)}
                      sx={{
                        fontSize: 13,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {studentData.newAuid}
                    </Typography>
                  </Box>
                ) : studentData.oldStudentId ? (
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="error"
                      sx={{ fontSize: 13 }}
                    >
                      {`Student Re-Admitted to ${getOrdinalSuffix(
                        studentData.semOrYear
                      )} ${
                        studentData.program_type_name.toLowerCase() ===
                        "semester"
                          ? "Sem"
                          : "Year"
                      } in ${
                        studentData.readmission_ac_year
                      }. Previous AUID is `}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      onClick={() => handleAuid(studentData.oldAuid)}
                      sx={{
                        fontSize: 13,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {studentData.oldAuid}
                    </Typography>
                  </Box>
                ) : studentData.cancel_id ? (
                  <Typography
                    variant="subtitle2"
                    color="error"
                    sx={{ fontSize: 13 }}
                  >
                    {`Admission Cancelled on  ${moment(
                      studentData.approved_date
                    ).format("DD-MM-YYYY")}.`}
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    )

  );
}

export default StudentDetails;
