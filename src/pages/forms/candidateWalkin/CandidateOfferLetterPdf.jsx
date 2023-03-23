import { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import axios from "../../../services/Api";
import { useLocation, useParams } from "react-router-dom";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import Html from "react-pdf-html";

function CandidateOfferLetterPdf() {
  const [candidateData, setCandidateData] = useState([]);
  const [feetemplateData, setFeetemplateData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);

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
  const { pathname } = useLocation();

  useEffect(() => {
    getCandidateData();
  }, [pathname]);

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    pageLayout: { margin: 25 },
  });

  useEffect(() => {
    getCandidateData();
  }, [pathname]);

  const getCandidateData = async () => {
    await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
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
    fontSize: "10px",
    fontFamily: "Times-Roman",
    text-align:justify;
    line-height:1.5;
  }
  
  table{
    fontSize: "10px",
    fontFamily: "Times-Roman",
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
    fontSize: "10px",
    fontFamily: "Times-Roman",
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

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="offer Letter">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <Html>{html}</Html>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default CandidateOfferLetterPdf;
