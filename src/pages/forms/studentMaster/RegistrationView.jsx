import { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Paper,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import reportingStatus from "../../../utils/ReportingStatus";
import StudentTranscriptDetails from "../../../components/StudentTranscriptDetails";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const tabsList = [
  { label: "Personal", value: "personal" },
  // { label: "Academics", value: "academic" },
  { label: "Transcript", value: "admission" },
];

const categories = [
  { name: "SSLC", prefix: "sslc" },
  { name: "PUC", prefix: "puc" },
  { name: "UG", prefix: "ug" },
  { name: "PG", prefix: "pg" },
];

function RegistrationView({ studentData, registrationData: data }) {
  const [value, setValue] = useState("personal");

  const presentFullAddress = [
    data.present_address1,
    data.presentAddress,
    data.presentCityName,
    data.presentStateName,
    data.presentCountryName,
    data.presentPincode,
  ];

  const permanentFullAddress = [
    data.permanant_adress1,
    data.permanentAddress,
    data.permanentCityName,
    data.permanentStateName,
    data.permanentCountryName,
    data.permanentPincode,
  ];

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  const DisplayAddressContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  const DisplayOptionalContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Paper elevation={4} sx={{ padding: 4, height: 680, overflow: "auto" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{ minHeight: 36 }}
        TabIndicatorProps={{ style: { height: 3 } }}
      >
        {tabsList.map((obj, i) => (
          <Tab
            key={i}
            label={obj.label}
            value={obj.value}
            sx={{
              minHeight: 36,
              padding: "6px 16px",
              textTransform: "capitalize",
              fontSize: 13,
            }}
          />
        ))}
      </Tabs>

      <Divider />

      <Box mt={3}>
        {value === "personal" && (
          <Grid container columnSpacing={2} rowSpacing={1}>
            <DisplayContent label="Applicant Name" value={data.student_name} />
            <DisplayContent label="DOB" value={data.dateofbirth} />
            <DisplayContent label="Gender" value={data.candidate_sex} />
            <DisplayContent label="Mobile" value={data.mobile} />
            <DisplayContent
              label="Alternate Mobile "
              value={data.alternate_number}
            />
            <DisplayContent label="WhatsApp No." value={data.whatsapp_number} />
            <DisplayContent label="Personal Email" value={data.student_email} />
            <DisplayContent label="Religion" value={data.religion} />
            <DisplayContent label="Caste Category" value={data.caste} />
            <DisplayContent label="Blood Group" value={data.blood_group} />
            <DisplayContent
              label="Marital Status"
              value={data.marital_status}
            />
            <DisplayContent label="Aadhar No." value={data.aadhar} />
            <DisplayContent label="Nationality" value={data.nationalityName} />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <DisplayContent label="Father Name" value={data.father_name} />
            <DisplayContent label="Father Mobile" value={data.father_mobile} />
            <DisplayContent label="Father Email" value={data.father_email} />
            <DisplayContent
              label="Father Occupation"
              value={data.father_occupation}
            />
            <DisplayContent
              label="Father Qualification"
              value={data.father_qualification}
            />
            <DisplayContent label="Father Income" value={data.father_income} />
            <DisplayContent label="Mother Name" value={data.mother_name} />
            <DisplayContent label="Mother Mobile" value={data.mother_mobile} />
            <DisplayContent label="Mother Email" value={data.mother_email} />
            <DisplayContent
              label="Mother Occupation"
              value={data.mother_occupation}
            />
            <DisplayContent
              label="Mother Qualification"
              value={data.mother_qualification}
            />
            <DisplayContent label="Mother Income" value={data.mother_income} />
            <DisplayContent label="Guardian Name" value={data.guardian_name} />
            <DisplayContent
              label="Guardian Mobile"
              value={data.guardian_phone}
            />
            <DisplayContent
              label="Guardian Email"
              value={data.guardian_email}
            />
            <DisplayContent
              label="Guardian Occupation"
              value={data.guardian_occupation}
            />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <DisplayAddressContent
              label="Present Address"
              value={data.current_address}
            />
            <DisplayAddressContent
              label="Permanent Address"
              value={data.permanent_address}
            />
          </Grid>
        )}

        {value === "academic" && (
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Qualification</StyledTableCell>
                      <StyledTableCell>Board / University</StyledTableCell>
                      <StyledTableCell>
                        School / College Studied
                      </StyledTableCell>
                      <StyledTableCell>Passing Year</StyledTableCell>
                      <StyledTableCell>Max Marks</StyledTableCell>
                      <StyledTableCell>Marks Scored</StyledTableCell>
                      <StyledTableCell>Percentage(%)</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {categories.map((obj) => (
                      <StyledTableRow>
                        <StyledTableCellBody>{obj.name}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {data[`${obj.prefix}_board`]}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {data[`${obj.prefix}_school_name`]}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {data[`${obj.prefix}_year_of_passing`]}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {data[`${obj.prefix}_subject_max_marks`]}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {data[`${obj.prefix}_subject_marks_obtain`]}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {data[`${obj.prefix}_percentage_grade`] ||
                            data[`${obj.prefix}_percentage_obtain`]}
                        </StyledTableCellBody>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <DisplayOptionalContent
              label="Optional Subjects Studied"
              value={data.optional_subject}
            />
            <DisplayOptionalContent
              label="Max.Marks or CGPA Prescribed"
              value={data.optional_max_mark}
            />
            <DisplayOptionalContent
              label="Marks or CGPA Obtained"
              value={data.optional_min_mark}
            />
            <DisplayOptionalContent
              label="% of Marks"
              value={data.optional_percentage}
            />
            <DisplayOptionalContent
              label="Entrance Exam Name"
              value={data.entrance_exam_name}
            />
            <DisplayOptionalContent
              label="Rank Obtained"
              value={data.rank_obtainedAd}
            />
            <DisplayOptionalContent
              label="Studied In"
              value={data.rural_urban}
            />
          </Grid>
        )}

        {value === "admission" && (
          <Grid container columnSpacing={2} rowSpacing={1}>
            <DisplayContent
              label="Academic Batch"
              value={studentData.academic_batch}
            />
            <DisplayContent
              label="Fee Template"
              value={studentData.fee_template_name}
            />
            <DisplayContent
              label="Admission Category"
              value={`${studentData.fee_admission_category_short_name} - ${studentData.fee_admission_sub_category_short_name}`}
            />
            <DisplayContent
              label="Reporting Status"
              value={reportingStatus[studentData.eligible_reported_status]}
            />
            <DisplayContent
              label="Nationality"
              value={studentData.nationalityName}
            />
            <DisplayContent
              label="Mentor"
              value={studentData.proctorName ?? " - "}
            />
            <Grid item xs={12} mt={2}>
              <StudentTranscriptDetails id={studentData.id} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Paper>
  );
}

export default RegistrationView;
