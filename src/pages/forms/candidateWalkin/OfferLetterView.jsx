import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import moment from "moment";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import sign from "../../../assets/offersign.png";
import seal from "../../../assets/offerseal.png";
import FeeTemplateView from "../../../components/FeeTemplateView";

const address = "Rallapalli, Village, kambadur,Mandal Anathapur";
const city = "Anantapur";
const state = "Andhra Pradesh";
const pincode = "515765";

const refundTable = [
  {
    firstValue: "Registration",
    secondValue: "Non-refundable Any time of notice",
  },
  {
    firstValue: "100% of Tuition fee",
    secondValue: "15 days or more before the commencement of classes",
  },
  {
    firstValue: "90% of Tuition fee",
    secondValue: "Less than 15 days before the commencement of classes",
  },
  {
    firstValue: "80% of Tuition fee",
    secondValue: "Less than 15 days after the commencement of classes",
  },
  {
    firstValue: "50% of Tuition fee",
    secondValue:
      "More than 15 days and less than 30 days after the commencement of classes",
  },
  {
    firstValue: "0%",
    secondValue: "More than 30 days after the commencement of classes",
  },
];

function OfferLetterView() {
  const [candidateData, setCandidateData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCandidateData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  console.log("candidateData", candidateData);

  return (
    <Box m={{ md: 4 }}>
      <Grid container justifyContent="center" rowSpacing={3}>
        <Grid item xs={12} md={6.5}>
          <Card elevation={4}>
            <CardHeader
              title={candidateData?.school_name}
              titleTypographyProps={{ variant: "subtitle2", fontSize: 16 }}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
                padding: 1,
              }}
            />
            <CardContent>
              <Box>
                <Grid container rowSpacing={1}>
                  <Grid item xs={12} md={6}>
                    Ref.No:&nbsp;{candidateData?.application_no_npf}
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                      textAlign: { xs: "left", md: "right" },
                    }}
                  >
                    Date:&nbsp;{moment().format("DD-MM-YYYY")}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      {candidateData?.candidate_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography>{address.slice(0, 30)}</Typography>
                    <Typography>{address.slice(30, address.length)}</Typography>
                    <Typography>
                      {city + "," + state + " " + pincode}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    Subject: Formal Admission Offer for{" "}
                    {candidateData.program_specialization_short_name +
                      " - " +
                      candidateData.program_name +
                      " "}
                    Program at {candidateData.school_name}.
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
                      Dear {candidateData?.candidate_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    I trust this letter finds you well. It is with great
                    pleasure that I extend my congratulations on your successful
                    application to the{" "}
                    {candidateData.program_specialization_short_name +
                      " - " +
                      candidateData.program_name +
                      " "}
                    Program at {candidateData.school_name}. We are delighted to
                    inform you that you have been accepted for the
                    {" " + candidateData.ac_year + " "}
                    Academic Session.
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    Please be advised that this formal offer is contingent upon
                    your fulfilment of the academic requirements as stipulated
                    by the Constituent body/University. To secure your place in
                    the program, we kindly request you to digitally accept this
                    offer by clicking on the 'Accept Now' button in the
                    Acceptance Letter attached herewith.
                  </Grid>

                  <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                    Upon accepting this offer, you are committing to the payment
                    of the prescribed fees outlined below. It is imperative that
                    you carefully review and accept the terms, conditions, and
                    regulations of Acharya Institutes to ensure a smooth
                    academic journey.
                  </Grid>

                  <Grid item xs={12}>
                    For any clarifications or assistance, please do not hesitate
                    to contact us at
                    <IconButton>
                      <AddIcCallIcon color="primary" />
                    </IconButton>
                    +91 74066 44449.
                  </Grid>

                  <Grid item xs={12}>
                    We look forward to welcoming you to ACHARYA INSTITUTE OF
                    GRADUATE STUDIES and wish you every success in your academic
                    endeavours.
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <Grid
                        item
                        xs={12}
                        md={2}
                        sx={{
                          textAlign: { xs: "center", md: "left" },
                        }}
                      >
                        <img src={sign} width="80px" />
                        <Typography>For Team Admissions</Typography>
                      </Grid>

                      <Grid item xs={12} md={6} align="center">
                        <img src={seal} width="100px" />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography>
                          Annexure 1: Terms and Conditions
                        </Typography>
                        <Typography>Annexure 2: Acceptance letter</Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} mt={2}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "grey",
                        fontWeight: "#ddd",
                      }}
                    >
                      This is a Letter of Offer and cannot be used for Visa
                      purposes.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6.5}>
          <Card elevation={4}>
            <CardHeader
              title="Annexure 1 - Terms & Conditions"
              titleTypographyProps={{ variant: "subtitle2", fontSize: 14 }}
              sx={{
                textAlign: "center",
              }}
            />

            <CardContent>
              <Grid container rowSpacing={1}>
                <Grid item xs={12} sx={{ textDecoration: "underline" }}>
                  Please carefully review the Terms & Conditions outlined below:
                </Grid>

                <Grid item xs={12}>
                  <Typography>
                    Fees payment timelines For the 1st Sem / Year
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <List
                    sx={{
                      listStyleType: "disc",
                      listStylePosition: "inside",
                    }}
                  >
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      Incoming Bullet
                    </ListItem>
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      Registration fees must be paid immediately upon acceptance
                      of the Offer Letter.
                    </ListItem>
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      50% of the total balance fees is to be settled within 15
                      working days.
                    </ListItem>
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      The remaining balance fees must be paid within 10 days
                      from the post announcement of results.
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <FeeTemplateView feeTemplateId={1} type={4} />
                </Grid>

                <Grid item xs={12} sx={{ fontWeight: "bold" }}>
                  <Typography>Note : </Typography>
                </Grid>

                <Grid item xs={12}>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Delayed fee payments will incur a late fee{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Registration fees are to be paid exclusively through the
                    link provided in the Acceptance Letter.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    The balance fee is to be transacted through the individual
                    login of the ERP Portal / ACERP APP.{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Cash payments for fees are not accepted.{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Students are responsible for the payment of exam and
                    convocation fees as prescribed by the Board/University.{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Admission ID is generated upon successful payment of the
                    registration fee
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    A Provisional Admission letter, including admission details
                    and the student's official Acharya email ID with the
                    password, will be sent upon Admission ID generation. On
                    completion of course email ID will be deactivated.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Admission will be finalized upon submission, verification of
                    original documents, and approval from the respective
                    Board/University.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    To complete the enrolment process, we kindly request you to
                    submit the original documents with 2 sets of photocopies
                    from your previous college or a provisional letter within
                    two days from the issuance of this offer letter..
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    The following documents are required for submission.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Marks sheets of (relevant academic years).
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Failure to submit the aforementioned documents within the
                    stipulated timeframe may result in the cancellation of your
                    admission.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Please ensure that all documents are authentic and duly
                    attested. If you face any challenges or require an
                    extension, kindly contact the Admission Office at
                    (admissions@acharya.ac.in) at the earliest.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Failure to complete admission formalities and payment as
                    prescribed may result in the withdrawal of provisional
                    admission.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Fees are subject to change.{" "}
                  </ListItem>
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Cancellation Policy
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                  Candidates seeking admission cancellation must submit a
                  written request to the Director of Admissions, including
                  reasons and supporting documentary proof.
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Refund Policy
                  </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                  <TableContainer
                    component={Paper}
                    sx={{
                      width: { xs: "100%", md: "60%" },
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: "primary.main",
                            color: "headerWhite.main",
                          }}
                        >
                          <TableCell
                            sx={{
                              color: "headerWhite.main",
                            }}
                          >
                            1
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "headerWhite.main",
                            }}
                          >
                            Registration
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "headerWhite.main",
                            }}
                          >
                            Non-Refundable Any time of notice
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {refundTable.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell>{obj.firstValue}</TableCell>
                              <TableCell>{obj.secondValue}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6.5}>
          <Card elevation={4}>
            <CardHeader
              title="Annexure 2 - Letter of Acceptance"
              titleTypographyProps={{ variant: "subtitle2", fontSize: 14 }}
              sx={{
                textAlign: "center",
              }}
            />

            <CardContent>
              <Grid container rowSpacing={1}>
                <Grid item xs={12}>
                  <Typography>To,</Typography>
                  <Typography>Director Admissions</Typography>
                  <Typography>Acharya Institutes</Typography>
                  <Typography>Soldevanahalli</Typography>
                  <Typography>Karnataka, India</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography>
                    Fees payment timelines For the 1st Sem / Year
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <List
                    sx={{
                      listStyleType: "disc",
                      listStylePosition: "inside",
                    }}
                  >
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      Incoming Bullet
                    </ListItem>
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      Registration fees must be paid immediately upon acceptance
                      of the Offer Letter.
                    </ListItem>
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      50% of the total balance fees is to be settled within 15
                      working days.
                    </ListItem>
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      The remaining balance fees must be paid within 10 days
                      from the post announcement of results.
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <FeeTemplateView feeTemplateId={1} type={4} />
                </Grid>

                <Grid item xs={12} sx={{ fontWeight: "bold" }}>
                  <Typography>Note : </Typography>
                </Grid>

                <Grid item xs={12}>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Delayed fee payments will incur a late fee{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Registration fees are to be paid exclusively through the
                    link provided in the Acceptance Letter.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    The balance fee is to be transacted through the individual
                    login of the ERP Portal / ACERP APP.{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Cash payments for fees are not accepted.{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Students are responsible for the payment of exam and
                    convocation fees as prescribed by the Board/University.{" "}
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Admission ID is generated upon successful payment of the
                    registration fee
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    A Provisional Admission letter, including admission details
                    and the student's official Acharya email ID with the
                    password, will be sent upon Admission ID generation. On
                    completion of course email ID will be deactivated.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Admission will be finalized upon submission, verification of
                    original documents, and approval from the respective
                    Board/University.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    To complete the enrolment process, we kindly request you to
                    submit the original documents with 2 sets of photocopies
                    from your previous college or a provisional letter within
                    two days from the issuance of this offer letter..
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    The following documents are required for submission.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Marks sheets of (relevant academic years).
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Failure to submit the aforementioned documents within the
                    stipulated timeframe may result in the cancellation of your
                    admission.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Please ensure that all documents are authentic and duly
                    attested. If you face any challenges or require an
                    extension, kindly contact the Admission Office at
                    (admissions@acharya.ac.in) at the earliest.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Failure to complete admission formalities and payment as
                    prescribed may result in the withdrawal of provisional
                    admission.
                  </ListItem>
                  <ListItem sx={{ display: "list-item", padding: 0 }}>
                    Fees are subject to change.{" "}
                  </ListItem>
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Cancellation Policy
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ textIndent: { md: "50px" } }}>
                  Candidates seeking admission cancellation must submit a
                  written request to the Director of Admissions, including
                  reasons and supporting documentary proof.
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Refund Policy
                  </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                  <TableContainer
                    component={Paper}
                    sx={{
                      width: { xs: "100%", md: "60%" },
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: "primary.main",
                            color: "headerWhite.main",
                          }}
                        >
                          <TableCell
                            sx={{
                              color: "headerWhite.main",
                            }}
                          >
                            1
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "headerWhite.main",
                            }}
                          >
                            Registration
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "headerWhite.main",
                            }}
                          >
                            Non-Refundable Any time of notice
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {refundTable.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{i + 1}</TableCell>
                              <TableCell>{obj.firstValue}</TableCell>
                              <TableCell>{obj.secondValue}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OfferLetterView;
