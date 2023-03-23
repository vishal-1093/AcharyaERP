import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  ListSubheader,
  ListItem,
  TableHead,
} from "@mui/material";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { makeStyles } from "@mui/styles";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FeeTemplateView from "../../../components/FeeTemplateView";
import SendIcon from "@mui/icons-material/Send";
import PrintIcon from "@mui/icons-material/Print";
import CustomModal from "../../../components/CustomModal";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}));

function OfferLetterView() {
  const [candidateData, setCandidateData] = useState([]);
  const [feetemplateData, setFeetemplateData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const refund = [
    {
      name: "Registration fee is Non Refundable & Non Transferable",
      value: "Any time of notice",
    },
    {
      name: "100% of Tuition fee",
      value: "15 days or more before the commencement of classes",
    },
    {
      name: "90% of Tuition fee",
      value: "Less than 15 days before the commencement of classes",
    },
    {
      name: "80% of Tuition fee",
      value: "Less than 15 days after the commencement of classes",
    },
    {
      name: "50% of Tuition fee",
      value:
        "More than 15 days and less than 30 days after the commencement of classes",
    },
    {
      name: "0%",
      value: "More than 30 days after the commencement of classes",
    },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getCandidateData();
  }, [pathname]);

  const getCandidateData = async () => {
    await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Candidate Walkin", link: "/CandidateWalkinIndex" },
          { name: res.data.data[0].candidate_name },
          { name: "Offer Letter" },
        ]);

        axios
          .get(
            `/api/finance/FetchAllFeeTemplateDetail/${res.data.data[0].fee_template_id}`
          )
          .then((templateRes) => {
            const templateData = templateRes.data.data[0];

            axios
              .get(
                `/api/academic/FetchAcademicProgram/${templateData.ac_year_id}/${templateData.program_id}/${templateData.school_id}`
              )
              .then((programRes) => {
                const yearSem = [];

                if (templateData.program_type_name.toLowerCase() === "yearly") {
                  for (
                    let i = 1;
                    i <= programRes.data.data[0].number_of_years;
                    i++
                  ) {
                    yearSem.push({ key: i, value: "Year " + i });
                  }
                } else if (
                  templateData.program_type_name.toLowerCase() === "semester"
                ) {
                  for (
                    let i = 1;
                    i <= programRes.data.data[0].number_of_semester;
                    i++
                  ) {
                    yearSem.push({ key: i, value: "Sem " + i });
                  }
                }

                setNoOfYears(yearSem);
              })
              .catch((programErr) => console.error(programErr));
          })
          .catch((templateErr) => console.error(templateErr));

        axios
          .get(
            `/api/finance/FetchFeeTemplateSubAmountDetail/${res.data.data[0].fee_template_id}`
          )
          .then((res1) => {
            setFeetemplateData(res1.data.data);
          })
          .catch((err1) => console.error(err1));

        setCandidateData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const html =
    `<html>
  <head>
  <style>
  p{
    font-size:13px;
    text-align:justify;
    line-height:1.5;
  }
  
  table{
    font-size:13px;
    width:100%;
    border-collapse:collapse;
  }
  
  td{
  padding:5px;line-height:1.5;
  }
  
  th{
    padding:5px;line-height:1.5;
  }

  ul,li{
    font-size:13px;
    text-align:justify;line-height:1.5;
  }
  </style>
  </head>
  <body>
  
  <p>Ref No : <span style="float:right;">Date : ` +
    convertDateToString(new Date()) +
    `</span></p><p>Dear ` +
    candidateData.candidate_name +
    `,</p><p>Congratulations!! We are happy to inform you that your application has been successful. This formal offer letter
      confirms that you have been accepted for ` +
    candidateData.program_short_name +
    ` - ` +
    candidateData.program_specialization_name +
    `
        at 
      ` +
    candidateData.school_name +
    `
       
     for the 
      ` +
    candidateData.ac_year +
    `
  academic session.<p>Note : 
  This offer is conditional to you meeting the Academic requirements as prescribed by the Constituent body/University.</p>
  <table border="1">
  <tr>
  <th style="text-align:left">Candidate Name</th><td>` +
    candidateData.candidate_name +
    `</td><th style="text-align:left">Program opted</th><td>` +
    candidateData.program_short_name +
    " - " +
    candidateData.program_specialization_short_name +
    `</td></tr><tr><th style="text-align:left">DOB</th><td>` +
    candidateData.date_of_birth +
    `</td><th style="text-align:left">Program Start date</th><td>` +
    candidateData.program_start +
    `
  </td>
  </tr>
  </table>
  <p>In order to confirm your place, please ensure to digitally accept the offer by clicking on the 'Accept Now' button in the Acceptance Letter. By accepting this offer you agree to pay your fees as prescribed below. You will be required to accept the terms and conditions and the regulations of Acharya Institutes.</p>
  <table border="1">
<tr><th>Particulars</th>` +
    noOfYears
      .map((obj) => {
        return `<th>${obj.value}</th>`;
      })
      .join("") +
    `<th>Total</th></tr>` +
    feetemplateData
      .map((obj) => {
        return (
          `<tr><td >${obj.voucher_head}</td>` +
          noOfYears
            .map((val) => {
              return `<td style="text-align:right">${
                obj["year" + val.key + "_amt"]
              }</td>`;
            })
            .join("") +
          `<th style="text-align:right">` +
          obj.total_amt +
          `</th></tr>`
        );
      })
      .join("") +
    `
  </table>
<p>If you have any clarifications, please reach us on  9731797677, admissions@acharya.ac.in, 7406644449 (Monday - Saturday, 9 AM - 6 PM IST)</p>
<p>For Team Admissions <span style="float:right;">Annexure 1: Terms and Conditions <br><br> Annexure 2: Acceptance letter</span></p><br>
<p style="text-align:center">This is a Letter of Offer and cannot be used for Visa purposes.</p>
<div style="page-break-before: always;"></div>
<h5 style="text-align:center;">Annexure 1 - Terms & Conditions</h5><h6>Please read Terms & Conditions carefully</h6>
<ul><li>Fees payment timelines
<table border="1">
<tr><th style="text-align:left">Registration fees	</th><td>Immediately post acceptance of Offer letter</td></tr>
<tr><th style="text-align:left">Balance Fee	</th><td>3 days prior to class commencement. OR in rare situations;
Immediately on Admission if admitted less than 3 days prior to class commencement.</td></tr></table>
<h6>Note : </h6></li>
<li>Delayed fee payment attract Late Fee.</li>
<li>Registration fee to be paid only through link provided in the Acceptance Letter.</li>
<li>Balance fee to be paid through individual login of ERP Portal / ACERP APP.</li>
<li>Fee cannot be paid in cash.</li>
<li>Student must pay the exam fee and convocation fee as prescribed by the Board / University.</li>
<li>Admission ID is generated on successful payment of the registration fee.</li>
<li>Once the Admission ID is generated a Provisional Admission letter shall be sent with the details of admission and the student’s official Acharya email ID along with the password.</li>
<li>Admission will be ratified on submission and verification of the original documents and approval from the concerned Board/University.</li>
<li>If the student does not complete the admission formalities and pay the fee as prescribed, the college reserves the right to withdraw the provisional admission.</li>
</ul>
<h6>Cancellation Policy</h6><ul><li>Candidate shall apply for cancellation by writing to the Director Admissions with the reason for Admission Cancellation and provides documentary proof if needed.</li>
<li>Fee paid receipts and other admission related documents are to be attached along with the Letter of Cancellation.</li></ul>
<h6>Refund Policy</h6>
<table border="1">
<tr><th>Sl No</th><th>Percentage of Refund</th><th>Point of notice</th></tr>` +
    refund
      .map((obj, i) => {
        return `<tr><td>${i + 1}</td><td>${obj.name}</td><td>${
          obj.value
        }</td></tr>`;
      })
      .join("") +
    `
</table>
<div style="page-break-before: always;"></div>
<h5 style="text-align:center;">Annexure 2 - Letter of Acceptance</h5>
<p>To,</p>
<p>Director Admissions</p>
<p>Acharya Institutes</p>
<p>Soldevanahalli, Bengaluru</p>
<p>Karnataka, India</p>
<table border="1"><tr><th>Candidate Name</th><td>` +
    candidateData.candidate_name +
    `</td><th>DOB</th><td>` +
    candidateData.date_of_birth +
    `</td><th>Parent Name</th><td>` +
    candidateData.father_name +
    `</td><th>Application No</th><td>` +
    candidateData.application_no_npf +
    `</td><th>Candidate ID</th><td>` +
    id +
    `</td></tr></table><p> I ` +
    candidateData.candidate_name +
    `son/daughter of ` +
    candidateData.father_name +
    `have read the offer letter along
with the Terms & Conditions. By digitally accepting the
offer I hereby agree that I have understood all the details
of the letter and accept to pay the prescribed fees as
mentioned in my Offer Letter.</p><p> I hereby accept the offer for ` +
    candidateData.program_name +
    " " +
    candidateData.program_specialization_name +
    `
for Academic Year ` +
    candidateData.ac_year +
    ` along with all the
terms and conditions as mentioned in the Offer Letter.</p>            
</body>
</html>`;

  const sendMail = () => {
    const submit = async () => {
      const temp = {};

      temp.candidate_id = id;
      temp.pdf_content = html.trim().replace(/\n/g, "");

      await axios
        .post(`/api/student/emailToCandidateForOffer`, temp)
        .then((res) => {})
        .catch((err) => console.error(err));

      const getCandidateData = await axios
        .get(`/api/student/Candidate_Walkin/${id}`)
        .then((res) => {
          console.log(res.data.data);
          return res.data.data;
        })
        .catch((err) => console.error(err));
      //Update npf status null when offer deleted
      getCandidateData.npf_status = 2;

      await axios
        .put(`/api/student/Candidate_Walkin/${id}`, getCandidateData)
        .then((res) => {})
        .catch((err) => console.error(err));

      navigate("/CandidateWalkinIndex", { replace: true });
    };
    setConfirmModalContent({
      title: "",
      message: "Are sure want to send the mail ? ",
      buttons: [
        { name: "Yes", color: "primary", func: submit },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmModalOpen(true);
  };

  const classes = useStyles();
  return (
    <>
      <CustomModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        buttons={confirmModalContent.buttons}
      />

      <Box
        mt={4}
        width={{ md: "75%" }}
        mx={{ md: "auto" }}
        sx={{ background: "white", p: 2, borderRadius: 2 }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Grid container p={2} rowSpacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Ref No :</Typography>
                </Grid>
                <Grid item xs={12} md={6} textAlign={{ md: "right" }}>
                  <Typography variant="subtitle2">
                    Date : {convertDateToString(new Date())}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography display="inline" variant="body2">
                    Dear
                  </Typography>
                  <Typography display="inline" variant="subtitle2">
                    {" " + candidateData.candidate_name},
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    component="div"
                    textAlign="justify"
                  >
                    Congratulations!! We are happy to inform you that your
                    application has been successful. This formal offer letter
                    confirms that you have been accepted for
                    <Typography display="inline" variant="subtitle2">
                      {" " +
                        candidateData.program_short_name +
                        " - " +
                        candidateData.program_specialization_name}
                    </Typography>
                    {" at "}
                    <Typography display="inline" variant="subtitle2">
                      {candidateData.school_name}
                    </Typography>
                    {" for the "}
                    <Typography display="inline" variant="subtitle2">
                      {candidateData.ac_year}
                    </Typography>
                    {" academic session."}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    component="div"
                    textAlign="justify"
                  >
                    Note :{" "}
                    <Typography variant="body2" display="inline">
                      This offer is conditional to you meeting the Academic
                      requirements as prescribed by the Constituent
                      body/University.
                    </Typography>
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    component="div"
                    textAlign="justify"
                  ></Typography>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table size="small" className={classes.table}>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Candidate Name
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {candidateData.candidate_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Program opted
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {candidateData.program_short_name +
                                " - " +
                                candidateData.program_specialization_short_name}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2">DOB</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {candidateData.date_of_birth}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              Program Start date
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {candidateData.program_start}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" textAlign="justify">
                    In order to confirm your place, please ensure to digitally
                    accept the offer by clicking on the 'Accept Now' button in
                    the Acceptance Letter. By accepting this offer you agree to
                    pay your fees as prescribed below. You will be required to
                    accept the terms and conditions and the regulations of
                    Acharya Institutes.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {Object.keys(candidateData).length > 0 ? (
                    <FeeTemplateView
                      feeTemplateId={candidateData.fee_template_id}
                      type={4}
                    />
                  ) : (
                    <></>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" textAlign="justify">
                    If you have any clarifications, please reach us on{" "}
                    <IconButton color="primary">
                      <CallIcon />
                      <Typography variant="body2">9731797677</Typography>
                    </IconButton>
                    ,
                    <IconButton color="primary">
                      <MailIcon />
                      <Typography variant="body2">
                        admissions@acharya.ac.in
                      </Typography>
                    </IconButton>
                    ,
                    <IconButton color="primary">
                      <WhatsAppIcon />
                      <Typography variant="body2">7406644449</Typography>
                    </IconButton>
                  </Typography>
                  <Typography variant="body2" textAlign="justify">
                    (Monday – Saturday, 9 AM – 6 PM IST).
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={8}>
                  <Grid container>
                    <Grid item xs={12} md={9}>
                      <Typography variant="body2">
                        For Team Admissions
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2">
                        Annexure 1: Terms and Conditions
                      </Typography>
                      <Typography variant="body2">
                        Annexure 2: Acceptance letter
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    align="center"
                    color="textSecondary"
                  >
                    This is a Letter of Offer and cannot be used for Visa
                    purposes.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="subtitle2">
                      Annexure 1 - Terms & Conditions
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <List
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Please read Terms & Conditions carefully
                      </ListSubheader>
                    }
                  >
                    <ListItem>
                      <ul>
                        <li>
                          <Typography variant="subtitle2">
                            Fees payment timelines
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            textAlign="justify"
                            display="inline"
                            color="textSecondary"
                          >
                            Registration fees :
                          </Typography>
                          <Typography variant="body2" display="inline">
                            Immediately post acceptance of Offer letter
                          </Typography>

                          <Typography
                            variant="subtitle2"
                            textAlign="justify"
                            color="textSecondary"
                          >
                            Balance Fee :
                          </Typography>
                          <Typography variant="body2" display="inline">
                            3 days prior to class commencement. OR in rare
                            situations; Immediately on Admission if admitted
                            less than 3 days prior to class commencement.
                          </Typography>
                          <Typography variant="subtitle2" textAlign="justify">
                            Note :
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Delayed fee payment attract Late Fee.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Registration fee to be paid only through link
                            provided in the Acceptance Letter.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Balance fee to be paid through individual login of
                            ERP Portal / ACERP APP.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Fee cannot be paid in cash.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Student must pay the exam fee and convocation fee as
                            prescribed by the Board / University.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Admission ID is generated on successful payment of
                            the registration fee.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2" textAlign="justify">
                            Once the Admission ID is generated a Provisional
                            Admission letter shall be sent with the details of
                            admission and the student’s official Acharya email
                            ID along with the password.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2" textAlign="justify">
                            Admission will be ratified on submission and
                            verification of the original documents and approval
                            from the concerned Board/University.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2" textAlign="justify">
                            If the student does not complete the admission
                            formalities and pay the fee as prescribed, the
                            college reserves the right to withdraw the
                            provisional admission.
                          </Typography>
                        </li>
                      </ul>
                    </ListItem>
                  </List>
                  <List
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Cancellation Policy
                      </ListSubheader>
                    }
                  >
                    <ListItem>
                      <ul>
                        <li>
                          <Typography variant="body2" textAlign="justify">
                            Candidate shall apply for cancellation by writing to
                            the Director Admissions with the reason for
                            Admission Cancellation and provides documentary
                            proof if needed.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2" textAlign="justify">
                            Fee paid receipts and other admission related
                            documents are to be attached along with the Letter
                            of Cancellation.
                          </Typography>
                        </li>
                      </ul>
                    </ListItem>
                  </List>
                  <List
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Cancellation Policy
                      </ListSubheader>
                    }
                  >
                    <TableContainer component={Paper} elevation={3}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Sl No</TableCell>
                            <TableCell>Percentage of Refund </TableCell>
                            <TableCell>Point of notice</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {refund.map((val, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{val.name}</TableCell>
                                <TableCell>{val.value}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="subtitle2">
                      Annexure 2 - Letter of Acceptance
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">To,</Typography>
                  <Typography variant="body2">Director Admissions</Typography>
                  <Typography variant="body2">Acharya Institutes</Typography>
                  <Typography variant="body2">
                    Soldevanahalli, Bengaluru ,
                  </Typography>
                  <Typography variant="body2">Karnataka, India</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container rowSpacing={1}>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">
                        Candidate Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Typography variant="body2">
                        {candidateData.candidate_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">DOB</Typography>
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Typography variant="body2">
                        {candidateData.date_of_birth}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">Parent Name</Typography>
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Typography variant="body2">
                        {candidateData.father_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">
                        Application No
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Typography variant="body2">
                        {candidateData.application_no_npf}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2">Candidate ID</Typography>
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Typography variant="body2">{id}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" textAlign="justify">
                    I {candidateData.candidate_name} son/daughter of{" "}
                    {candidateData.father_name} have read the offer letter along
                    with the Terms & Conditions. By digitally accepting the
                    offer I hereby agree that I have understood all the details
                    of the letter and accept to pay the prescribed fees as
                    mentioned in my Offer Letter.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" textAlign="justify">
                    I hereby accept the offer for{" "}
                    {candidateData.program_name +
                      " " +
                      candidateData.program_specialization_name}
                    for Academic Year {candidateData.ac_year} along with all the
                    terms and conditions as mentioned in the Offer Letter.
                  </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                  <IconButton onClick={sendMail}>
                    <SendIcon color="primary" fontSize="large" />
                  </IconButton>
                  <Link
                    to={`/CandidateOfferLetterPdf/${id}`}
                    style={{ textDecoration: "none" }}
                    target="_blank"
                  >
                    <IconButton>
                      <PrintIcon color="primary" fontSize="large" />
                    </IconButton>
                  </Link>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default OfferLetterView;
