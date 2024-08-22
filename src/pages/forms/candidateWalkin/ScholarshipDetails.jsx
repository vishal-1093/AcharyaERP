import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

function ScholarshipDetails({ scholarshipId = 1 }) {
  const [scholarshipData, setScholarshipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, [scholarshipId]);

  const getData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `/api/student/fetchScholarship2/${scholarshipId}`
      );
      setScholarshipData(response.data.data[0]);
    } catch (err) {
      setError("Failed to fetch scholarship details !!");
    } finally {
      setLoading(false);
    }
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

  if (!scholarshipData) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No scholarship data available.
      </Typography>
    );
  }

  const renderDetailRow = (label, value, size) => {
    return (
      <>
        <Grid item xs={12} md={2} lg={size ?? 1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={size ? 4 : 4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Card>
      <CardHeader
        title="Scholarship Details"
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
          {renderDetailRow("Residence", scholarshipData.residence)}
          {renderDetailRow(
            "Scholarship Awarded From An OutSide Body",
            scholarshipData.award_details ?? "-",
            2
          )}
          {renderDetailRow("Reason For Fee Excemption", scholarshipData.reason)}
          {renderDetailRow("Parent Income", scholarshipData.parent_income, 2)}
          {renderDetailRow("Parent Occupation", scholarshipData.occupation)}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ScholarshipDetails;
