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
import { useNavigate, useLocation, useParams } from "react-router-dom";
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

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
    },
  },
}));

function OfferLetterView() {
  const [candidateData, setCandidateData] = useState([]);
  const [data, setData] = useState([]);

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
    getData();
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
        setCandidateData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    const offerData = await axios
      .get(`/api/employee/fetchAllOfferDetails/${1}`)
      .then((res) => {
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/finance/getFormulaDetails/${offerData.salary_structure_id}`)
      .then((res) => {
        const earningTemp = [];
        const deductionTemp = [];
        const managementTemp = [];

        res.data.data
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .map((obj) => {
            if (obj.category_name_type === "Earning") {
              earningTemp.push({
                name: obj.voucher_head,
                monthly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName] * 12
                ),
                priority: obj.priority,
              });
            } else if (obj.category_name_type === "Deduction") {
              deductionTemp.push({
                name: obj.voucher_head,
                monthly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName] * 12
                ),
                priority: obj.priority,
              });
            } else if (obj.category_name_type === "Management") {
              managementTemp.push({
                name: obj.voucher_head,
                monthly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[obj.salaryStructureHeadPrintName] * 12
                ),
                priority: obj.priority,
              });
            }
          });

        const temp = {};
        temp["earnings"] = earningTemp;
        temp["deductions"] = deductionTemp;
        temp["management"] = managementTemp;
        temp["grossEarning"] =
          temp.earnings.length > 0
            ? temp.earnings.map((te) => te.value).reduce((a, b) => a + b)
            : 0;
        temp["totDeduction"] =
          temp.deductions.length > 0
            ? temp.deductions.map((te) => te.value).reduce((a, b) => a + b)
            : 0;
        temp["totManagement"] =
          temp.management.length > 0
            ? temp.management.map((te) => te.value).reduce((a, b) => a + b)
            : 0;
        setData(temp);
      })
      .catch((err) => console.error(err));
  };

  const html =
    `
<html>
<head>
<style>
table{
  width:100%;
  border-collapse:collapse;
  border:1px solid black;
  font-size:12px;
}

th{
  border:1px solid black;
  padding:5px;
}

td{
  border:1px solid black;
  padding:5px;
}

</style>
</head>

<body>

<table>
<tr><th colspan='2' style="text-align:center">Salary Breakup</th></tr>
<tr><th colspan='2'>Earnings</th></tr>` +
    data.earnings
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .map((obj) => {
        return `<tr><td>${
          obj.name
        }</td><td style="text-align:right">${obj.monthly.toFixed()}</td></tr>`;
      })
      .join("") +
    `
<tr><th>Gross Earning</th><td style="text-align:right">` +
    data.grossEarning.toFixed() +
    `</tr>
<tr><th colspan='2'>Deductions</th></tr>` +
    data.deductions
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .map((obj) => {
        return `<tr><td>${
          obj.name
        }</td><td style="text-align:right">${obj.monthly.toFixed()}</td></tr>`;
      })
      .join("") +
    `<tr><th>Total Deductions</th><td style="text-align:right">` +
    data.totDeduction.toFixed() +
    `</td><tr><th colspan='2'> Management Contribution</th></tr> ` +
    data.management
      .sort((a, b) => {
        return a.priority - b.priority;
      })
      .map((obj) => {
        return `<tr><td>${
          obj.name
        }</td><td style="text-align:right">${obj.monthly.toFixed()}</td></tr>`;
      })
      .join("") +
    ` <tr><th>Cost to Company</th><td style="text-align:right">` +
    (data.grossEarning + data.totManagement).toFixed() +
    `</tr><tr><th>Net Pay</th><td style="text-align:right">` +
    (data.grossEarning - data.totDeduction).toFixed() +
    `</tr>
</table>

</html>
</body>
`;

  const sendMail = async () => {
    // const ht = `<html><body>hi</html></body>`;
    // const a = html;
    // const b = a.trim();
    // const c = b.replace(/\n/g, "");

    // console.log(c);
    // return false;
    const temp = {};

    temp.candidate_id = id;
    temp.pdf_content = html;

    await axios
      .post(`/api/student/emailToCandidateForOffer`, temp)
      .then((res) => {})
      .catch((err) => console.error(err));
  };

  const classes = useStyles();
  return (
    <>
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
                    <IconButton color="error">
                      <MailIcon />
                      <Typography variant="body2">
                        admissions@acharya.ac.in
                      </Typography>
                    </IconButton>
                    ,
                    <IconButton color="success">
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
                      <Typography variant="body2"></Typography>
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
                  <IconButton>
                    <PrintIcon color="primary" fontSize="large" />
                  </IconButton>
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
