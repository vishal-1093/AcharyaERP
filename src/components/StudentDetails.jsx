import { useState, useEffect } from "react";
import axios from "../services/Api";
import { Grid, Typography, Card, CardHeader, CardContent } from "@mui/material";
import moment from "moment";

function StudentDetails({ id }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderDetailRow = (label, value) => {
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
      <Typography color="error" sx={{ textAlign: "center" }}>
        Please wait ....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!studentData) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No student data available.
      </Typography>
    );
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Student Details"
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
              {renderDetailRow("AUID", studentData.auid)}
              {renderDetailRow("Student Name", studentData.student_name)}
              {renderDetailRow("USN", studentData.usn ?? "-")}
              {renderDetailRow(
                "DOA",
                moment(studentData.date_of_admission).format("DD-MM-YYYY")
              )}
              {renderDetailRow("School", studentData.school_name)}
              {renderDetailRow(
                "Program",
                `${studentData.program_short_name} - ${studentData.program_specialization_short_name}`
              )}
              {renderDetailRow("Academic Batch", studentData.academic_batch)}
              {renderDetailRow(
                "Current Year/Sem",
                `${studentData.current_year}/${studentData.current_sem}`
              )}
              {renderDetailRow("Fee Template", studentData.fee_template_name)}
              {renderDetailRow(
                "Admission Category",
                `${studentData.fee_admission_category_short_name} - ${studentData.fee_admission_sub_category_short_name}`
              )}
              {renderDetailRow("Acharya Email", studentData.acharya_email)}
              {renderDetailRow("Mobile No.", studentData.mobile)}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default StudentDetails;
