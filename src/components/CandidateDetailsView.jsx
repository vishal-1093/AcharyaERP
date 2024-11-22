import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
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

function CandidateDetailsView({ id }) {
  const [data, setData] = useState(null);
  const [documents, setDocuments] = useState({ resume: "", education: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: response } = await axios.get(
        `/api/employee/getAllApplicantDetails/${id}`
      );
      const responseData = response.Job_Profile;
      const {
        Resume_Attachment: resumeAttachment,
        Higher_Education_Attachment: educationAttachment,
      } = responseData;
      const resumeAttachmentPath = resumeAttachment?.attachment_path;
      const educationAttachmentPath = educationAttachment?.he_attachment_path;

      if (resumeAttachmentPath) {
        const { data: resumeResponse } = await axios.get(
          `/api/employee/jobFileviews?fileName=${resumeAttachmentPath}`,
          {
            responseType: "blob",
          }
        );
        const url = URL.createObjectURL(resumeResponse);
        setDocuments((prev) => ({
          ...prev,
          ["resume"]: url,
        }));
      }

      if (educationAttachmentPath) {
        const { data: educationResponse } = await axios.get(
          `/api/employee/higherEducationFileDownload?fileName=${educationAttachmentPath}`,
          {
            responseType: "blob",
          }
        );

        const url = URL.createObjectURL(educationResponse);
        setDocuments((prev) => ({
          ...prev,
          ["education"]: url,
        }));
      }
      setData(responseData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch candidate details. Please try again later.");
    } finally {
      setLoading(false);
    }
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

  const DisplayHeading = ({ label }) => (
    <Grid item xs={12}>
      <Divider textAlign="left">
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
      </Divider>
    </Grid>
  );

  const fullAddress = [
    data?.street,
    data?.locality,
    data?.city_name,
    data?.state_name,
    data?.country_name,
    data?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  if (loading) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        Please wait ....
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

  if (!data) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No candidate data available.
      </Typography>
    );
  }

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Applicant Details"
            titleTypographyProps={{ variant: "subtitle2" }}
            sx={{
              backgroundColor: "primary.main",
              color: "headerWhite.main",
              padding: 1,
            }}
          />
          <CardContent>
            <Grid container columnSpacing={2} rowSpacing={1}>
              <DisplayContent label="Name" value={data.firstname} />
              <DisplayContent
                label="Marital Status"
                value={data.martial_status}
              />
              <DisplayContent label="Email" value={data.email} />
              <DisplayContent
                label="Link (Git, Drive)"
                value={data.link ?? "-"}
              />
              <DisplayContent
                label="Gender"
                value={data.gender === "M" ? "Male" : "Female"}
              />
              <DisplayContent
                label="LinkedIn"
                value={data.linkedin_id ?? "-"}
              />
              <DisplayContent
                label="Date of Birth"
                value={moment(data.dateofbirth).format("DD-MM-YYYY")}
              />
              <DisplayContent label="Key Skills" value={data.key_skills} />
              <DisplayContent label="Mobile No." value={data.mobile} />
              <DisplayContent label="Address" value={fullAddress} />
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {data.Educational_Details.length > 0 && (
        <>
          <DisplayHeading label="Educational Details" />
          <Grid item xs={12}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Graduaction</StyledTableCell>
                    <StyledTableCell>Graduaction Type</StyledTableCell>
                    <StyledTableCell>Graduation Institute</StyledTableCell>
                    <StyledTableCell>University Name</StyledTableCell>
                    <StyledTableCell>University Score</StyledTableCell>
                    <StyledTableCell>Joining Date Score</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.Educational_Details?.map((obj, i) => {
                    const {
                      graduation,
                      graduation_name,
                      school,
                      university,
                      academic_score,
                      academic_year_joining,
                    } = obj;
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCellBody>{graduation}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {graduation_name}
                        </StyledTableCellBody>
                        <StyledTableCellBody>{school}</StyledTableCellBody>
                        <StyledTableCellBody>{university}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {academic_score}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {academic_year_joining
                            ? moment(academic_year_joining).format("DD-MM-YYYY")
                            : ""}
                        </StyledTableCellBody>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}

      {data.Experience_Details.length > 0 && (
        <>
          <DisplayHeading label="Experience Details" />
          <Grid item xs={12}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Organization</StyledTableCell>
                    <StyledTableCell>Designation</StyledTableCell>
                    <StyledTableCell>CTC Drawn Monthly</StyledTableCell>
                    <StyledTableCell>Experience </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.Experience_Details?.map((obj, i) => {
                    const {
                      employer_name,
                      designation,
                      annual_salary_lakhs,
                      exp_in_years,
                      exp_in_months,
                    } = obj;
                    return (
                      <StyledTableRow key={i}>
                        <StyledTableCellBody>
                          {employer_name}
                        </StyledTableCellBody>
                        <StyledTableCellBody>{designation}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {annual_salary_lakhs}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {`${exp_in_years} Years ${exp_in_months} Months`}
                        </StyledTableCellBody>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}

      {(documents.resume || documents.education) && (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Documents"
              titleTypographyProps={{ variant: "subtitle2" }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                padding: 1,
              }}
            />
            <CardContent>
              <Grid container rowSpacing={1} columnSpacing={2}>
                {documents.resume ? (
                  <Grid item xs={12} md={6} align="right">
                    <iframe src={documents.resume} style={{ width: "100%" }} />
                    <Button
                      size="small"
                      onClick={() => window.open(documents.resume)}
                    >
                      View Resume
                    </Button>
                  </Grid>
                ) : (
                  <></>
                )}

                {documents.education ? (
                  <Grid item xs={12} md={6} align="right">
                    <iframe src={documents.education} style={{ width: "100%" }}>
                      Loading ...
                    </iframe>
                    <Button
                      size="small"
                      onClick={() => window.open(documents.education)}
                    >
                      View Higher Education Document
                    </Button>
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default CandidateDetailsView;
