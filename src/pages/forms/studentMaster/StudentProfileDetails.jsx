import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment";
import SchoolIcon from "@mui/icons-material/School";
import ListAltIcon from "@mui/icons-material/ListAlt";

function StudentProfileDetails({ studentData, photoPath }) {
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    if (photoPath) {
      const objectURL = URL.createObjectURL(photoPath);
      setPhotoURL(objectURL);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [photoPath]);

  const {
    student_name: name,
    auid,
    usn,
    school_name: school,
    program_short_name: program,
    program_specialization_short_name: spl,
    current_year: year,
    current_sem: sem,
    acharya_email: email,
    date_of_admission: doa,
    proctorName,
    mobile,
    academic_batch: academicBatch,
    fee_template_name: feeTemplate,
    fee_admission_category_type: admissionCategory,
  } = studentData;

  const DisplayText = ({ label }) => (
    <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
      {label}
    </Typography>
  );

  const DisplayTextValue = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: 12 }}>
      {label}
    </Typography>
  );

  const DisplayRowData = ({ label, value }) => (
    <Box>
      <DisplayText label={label} />
      <DisplayTextValue label={value} />
    </Box>
  );

  return (
    <Paper
      elevation={4}
      sx={{
        // borderRadius: 4,
        padding: 4,
        wordWrap: "break-word",
        overflowWrap: "break-word",
        height: 680,
        overflow: "auto",
      }}
    >
      <Grid container rowSpacing={2}>
        <Grid item xs={12} align="center">
          {/* <img src={photoURL} alt="Profile" width="100" /> */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar sx={{ bgcolor: "white", width: 30, height: 30 }}>
                <SchoolIcon sx={{ width: 24, height: 24 }} color="primary" />
              </Avatar>
            }
          >
            <Avatar
              alt="Profile"
              src={photoURL}
              sx={{ width: 90, height: 90 }}
            />
          </Badge>
        </Grid>
        <Grid item xs={12} align="center">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
              {name}
            </Typography>
            <DisplayTextValue label={auid} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {usn && (
          <Grid item xs={12}>
            <DisplayRowData label="USN" value={usn} />
          </Grid>
        )}
        <Grid item xs={12}>
          <DisplayRowData
            label="DATE OF JOINING"
            value={moment(doa).format("DD-MM-YYYY")}
          />
        </Grid>
        <Grid item xs={12}>
          <DisplayRowData label="SCHOOL" value={school} />
        </Grid>
        <Grid item xs={12}>
          <DisplayRowData label="PROGRAM" value={`${program} - ${spl}`} />
        </Grid>
        <Grid item xs={12}>
          <DisplayRowData label="CURRENT YEAR/SEM" value={`${year}/${sem}`} />
        </Grid>
        <Grid item xs={12}>
          <DisplayRowData label="ACHARYA EMAIL" value={email} />
        </Grid>
        <Grid item xs={12}>
          <DisplayRowData label="Mobile No." value={mobile} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {/* <Grid item xs={12} align="center">
          <Button variant="contained" size="small" endIcon={<ListAltIcon />}>
            My Attendance
          </Button>
        </Grid> */}
        {/* <Grid item xs={12}>
          <DisplayRowData label="Academic Batch" value={academicBatch} />
        </Grid>
        <Grid item xs={12}>
          <DisplayRowData label="Fee Template" value={feeTemplate} />
        </Grid>
        <Grid item xs={12}>
          <DisplayRowData
            label="Admission Category"
            value={admissionCategory}
          />
        </Grid>
        {proctorName && (
          <Grid item xs={12}>
            <DisplayRowData label="MENTOR" value={proctorName} />
          </Grid>
        )} */}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button variant="contained" size="small" endIcon={<ListAltIcon />}>
          My Attendance
        </Button>
      </Box>
    </Paper>
  );
}

export default StudentProfileDetails;
