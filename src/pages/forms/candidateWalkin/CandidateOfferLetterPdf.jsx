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
import ait from "../../../assets/ait.jpg";
import footer from "../../../assets/footer.jpg";

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

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    container: { fontSize: "10px", fontFamily: "Times-Roman" },

    logoHeader: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    headerContent: {
      position: "absolute",
      top: 140,
      right: 30,
      bottom: 0,
      left: 30,
    },

    flexStyle: { flexDirection: "row", marginBottom: "10px" },

    layoutStyle: {
      margin: 30,
    },
  });

  const header = () => {
    return (
      <>
        <View style={styles.flexStyle}>
          <Text style={{ width: "50%" }}>Ref No :</Text>
          <Text style={{ width: "50%", textAlign: "right" }}>
            Date : {convertDateToString(new Date())}
          </Text>
        </View>

        <View style={styles.flexStyle}>
          <Text>Dear {candidateData.candidate_name},</Text>
        </View>

        <View style={styles.flexStyle}>
          <Text style={{ lineHeight: 1.3, textAlign: "justify" }}>
            Congratulations!! We are happy to inform you that your application
            has been successful. This formal offer letter confirms that you have
            been accepted for{" "}
            {candidateData.program_short_name +
              " - " +
              candidateData.program_specialization_name}{" "}
            at {candidateData.school_name + " "} for the {candidateData.ac_year}{" "}
            academic session.
          </Text>
        </View>

        <View style={styles.flexStyle}>
          <Text style={{ textAlign: "justify" }}>
            Note : This offer is conditional to you meeting the Academic
            requirements as prescribed by the Constituent body/University.
          </Text>
        </View>
      </>
    );
  };

  const displayCanddiateData = () => {
    return (
      <Html style={{ fontSize: "10px", fontFamily: "Times-Roman" }}>
        {`
        <style>
        th,td{
         padding:5px;   
        }</style>
        <table  style='border:1px solid black;'>
          <tr>
            <th style="text-align:left">Candidate Name</th>
            <td>` +
          candidateData.candidate_name +
          `</td>
            <th style="text-align:left">Program opted</th>
            <td>
              ` +
          candidateData.program_short_name +
          " - " +
          candidateData.program_specialization_short_name +
          `
            </td>
          </tr>
          <tr>
            <th style="text-align:left">DOB</th>
            <td>` +
          candidateData.date_of_birth +
          `</td>
            <th style="text-align:left">Program Start date</th>
            <td>` +
          candidateData.program_start +
          `</td>
          </tr>
        </table>
        <p style='text-align:justify;lineHeight: 1.3'>In order to confirm your place, please ensure to digitally accept the offer by clicking on the 'Accept Now' button in the Acceptance Letter. By accepting this offer you agree to pay your fees as prescribed below. You will be required to accept the terms and conditions and the regulations of Acharya Institutes.</p>
        `}
      </Html>
    );
  };

  const feeTemplateData = () => {
    return (
      <Html style={{ fontSize: "10px", fontFamily: "Times-Roman" }}>
        {`
      <style>
      th,td{
       padding:5px;   
      }</style>
      <table  style='border:1px solid black;margin-bottom:10px'>
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
      `}
      </Html>
    );
  };

  const contactUs = () => {
    return (
      <View style={styles.flexStyle}>
        <Text
          style={{
            textAlign: "justify",
            lineHeight: 1.3,
            marginBottom: "50px",
          }}
        >
          If you have any clarifications, please reach us on 9731797677,
          admissions@acharya.ac.in, 7406644449 (Monday - Saturday, 9 AM - 6 PM
          IST)
        </Text>
      </View>
    );
  };

  const signatureFooter = () => {
    return (
      <>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "75%", lineHeight: 1.3 }}>
            <Text>For Team Admissions</Text>
          </View>
          <View>
            <Text> Annexure 1 : Terms and Conditions</Text>
            <Text> Annexure 2 : Acceptance letter</Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "grey",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          This is a Letter of Offer and cannot be used for Visa purposes.
        </Text>
      </>
    );
  };

  const termsCondition = () => {
    return (
      <>
        <Text style={{ fontSize: 12, textAlign: "center", marginBottom: 10 }}>
          Annexure 1 - Terms & Conditions
        </Text>
        <Text>Please read Terms & Conditions carefully</Text>
      </>
    );
  };

  const termsContent = () => {
    return (
      <Html style={{ fontSize: "10px", fontFamily: "Times-Roman" }}>
        {`<style>
      ul,li{
        text-align:justify;
        line-height:1.5;
      }
      th,td{
        padding:5px;   
       }</style>
      <ul><li>Fees payment timelines
      <ul><li>Registration fees : Immediately post acceptance of Offer letter.</li><li>Balance Fee :
      3 days prior to class commencement. OR in rare situations; Immediately on Admission if admitted less than 3 days prior to class commencement.</li></ul>
      </li><li>Delayed fee payment attract Late Fee.</li>
      <li>Registration fee to be paid only through link provided in the Acceptance Letter.</li>
      <li>Balance fee to be paid through individual login of ERP Portal / ACERP APP.</li>
      <li>Fee cannot be paid in cash.</li><li>Student must pay the exam fee and convocation 
      fee as prescribed by the Board / University.</li><li>Admission ID is generated on successful 
      payment of the registration fee.</li><li>Once the Admission ID is generated a Provisional 
      Admission letter shall be sent with the details of admission and the student’s official Acharya
       email ID along with the password.</li><li>Admission will be ratified on submission and 
       verification of the original documents and approval from the concerned Board/University.
       </li><li>If the student does not complete the admission formalities and pay the fee as 
       prescribed, the college reserves the right to withdraw the provisional admission.</li><ul>
       <p>Cancellation Policy</p>
       <ul><li>Candidate shall apply for cancellation by writing to the Director Admissions
        with the reason for Admission Cancellation and provides documentary proof if needed.</li>
        <li>Fee paid receipts and other admission related documents are to be attached along with the Letter of Cancellation.</li></ul>
        <p>Refund Policy</p>
        <table  style='border:1px solid black;margin-bottom:10px'>
<tr><th>Percentage of Refund</th><th>Point of notice</th></tr>` +
          refund
            .map((obj, i) => {
              return `<tr><td>${obj.name}</td><td>${obj.value}</td></tr>`;
            })
            .join("") +
          `
</table>
       `}
      </Html>
    );
  };

  const acceptanceLetter = () => {
    return (
      <>
        <View style={{ lineHeight: 1.3, marginBottom: 10 }}>
          <Text style={{ fontSize: 12, textAlign: "center", marginBottom: 10 }}>
            Annexure 2 - Letter of Acceptance
          </Text>
          <Text>To,</Text>
          <Text>Director Admissions,</Text>
          <Text>Acharya Institutes,</Text>
          <Text>Soldevanahalli, Bengaluru ,</Text>
          <Text>Karnataka, India</Text>
        </View>
      </>
    );
  };

  const candidateAcceptance = () => {
    return (
      <Html style={{ fontSize: "10px", fontFamily: "Times-Roman" }}>
        {`<style>
      th,td{
        padding:5px;   
       }</style><table  style='border:1px solid black;width:50%'><tr><th>Candidate Name</th><td>` +
          candidateData.candidate_name +
          `</td></tr><tr><th>DOB</th><td>` +
          candidateData.date_of_birth +
          `</td></tr><tr><th>Parent Name</th><td>` +
          candidateData.father_name +
          `</td></tr><tr><th>Application No</th><td>` +
          candidateData.application_no_npf +
          `</td></tr><tr><th>Candidate ID</th><td>` +
          id +
          `</td></tr></table><p style='text-align:justify;lineHeight: 1.3'> I ` +
          candidateData.candidate_name +
          `son/daughter of ` +
          candidateData.father_name +
          ` have read the offer letter along
      with the Terms & Conditions. By digitally accepting the
      offer I hereby agree that I have understood all the details
      of the letter and accept to pay the prescribed fees as
      mentioned in my Offer Letter.</p><p style='text-align:justify;lineHeight: 1.3'> I hereby accept the offer for ` +
          candidateData.program_name +
          " " +
          candidateData.program_specialization_name +
          `
      for Academic Year ` +
          candidateData.ac_year +
          ` along with all the
      terms and conditions as mentioned in the Offer Letter.</p> `}
      </Html>
    );
  };

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Offer Letter">
          <Page orientation="portrait" style={styles.container}>
            <View style={styles.logoHeader}>
              <Image src={ait} />
            </View>
            <View style={styles.headerContent}>
              {header()}
              {displayCanddiateData()}
              {feeTemplateData()}
              {contactUs()}
              {signatureFooter()}
              <Image
                src={footer}
                style={{
                  position: "fixed",
                  top: "12%",
                }}
              />
            </View>
            <View style={styles.layoutStyle} break>
              {termsCondition()}
              {termsContent()}
            </View>
            <View style={styles.layoutStyle} break>
              {acceptanceLetter()}
              {candidateAcceptance()}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default CandidateOfferLetterPdf;
