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
  const [data, setData] = useState([]);
  const [documents, setDocuments] = useState({ resume: "", education: "" });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const jobData = await axios
      .get(`/api/employee/getAllApplicantDetails/${id}`)
      .then((res) => {
        setData(res.data.Job_Profile);
        return res.data.Job_Profile;
      })
      .catch((err) => console.error(err));

    if (jobData.Resume_Attachment.attachment_path) {
      await axios
        .get(
          `/api/employee/jobFileviews?fileName=${jobData.Resume_Attachment.attachment_path}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          setDocuments((prev) => ({
            ...prev,
            ["resume"]: url,
          }));
        })
        .catch((err) => console.error(err));
    }

    if (jobData.Higher_Education_Attachment.he_attachment_path) {
      await axios
        .get(
          `/api/employee/jobFileviews?fileName=${jobData.Higher_Education_Attachment.he_attachment_path}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          setDocuments((prev) => ({
            ...prev,
            ["document"]: url,
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Box>
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
              <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Name</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.firstname}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Marital Status</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.martial_status}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Email</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Link (Git, Drive)</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.linkedin_id}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Gender</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.gender}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">LinkedIn</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.linkedin_id}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Date of Birth</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {moment(data.dateofbirth).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Key Skills</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.key_skills}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Mobile</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.mobile}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Address</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.street + ", "}
                    {data.locality + ", "}
                    {data.city_name + ", "}
                    {data.state_name + ", "}
                    {data.country_name + " "}
                    {data.pincode}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Divider>
            <Typography variant="subtitle2" color="textSecondary">
              Educational Details
            </Typography>
          </Divider>
        </Grid>

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
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCellBody>
                        {obj.graduation}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.graduation_name}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{obj.school}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.university}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.academic_score}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.academic_year_joining
                          ? moment(obj.academic_year_joining).format(
                              "DD-MM-YYYY"
                            )
                          : ""}
                      </StyledTableCellBody>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Divider>
            <Typography variant="subtitle2" color="textSecondary">
              Experience Details
            </Typography>
          </Divider>
        </Grid>

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
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCellBody>
                        {obj.employer_name}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.designation}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.annual_salary_lakhs}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {obj.exp_in_years +
                          " Years " +
                          obj.exp_in_months +
                          " Months"}
                      </StyledTableCellBody>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

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
                {data.Resume_Attachment?.attachment_path ? (
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

                {data.Higher_Education_Attachment?.he_attachment_path ? (
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
      </Grid>
    </Box>
  );
}

export default CandidateDetailsView;
