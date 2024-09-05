import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

function ScholarshipDetails({ scholarshipData }) {
  if (!scholarshipData) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No scholarship data available.
      </Typography>
    );
  }

  const DispalyText = ({ label, value, size }) => {
    return (
      <>
        <Grid item xs={12} md={2} lg={size ?? 1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={size ? 4 : 4.5}>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={{ textTransform: "capitalize" }}
          >
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
          <DispalyText label="Residence" value={scholarshipData.residence} />
          <DispalyText
            label="Scholarship Awarded From An OutSide Body"
            value={
              scholarshipData.award === "true"
                ? scholarshipData.award_details
                : "No"
            }
            size={2}
          />
          <DispalyText
            label="Reason For Fee Excemption"
            value={scholarshipData.reason}
          />
          <DispalyText
            label="Parent Income"
            value={scholarshipData.parent_income ?? "-"}
            size={2}
          />
          <DispalyText
            label="Parent Occupation"
            value={scholarshipData.occupation}
          />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ScholarshipDetails;
