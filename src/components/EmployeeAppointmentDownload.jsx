import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import LetterheadImage from "../../src/assets/auait.jpg";
import PdfIcon from "../../src/assets/pdfIcon.png";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    padding: 40,
    fontFamily: "Times-Roman",
    position: "relative",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  section: {
    marginTop: 10,
  },
  sectionText: {
    marginBottom:5,
  },
  sectionHeader: {
    marginTop: 120,
  },
  center: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    textAlign: "center",
    padding:10
  },
  list: {
    marginBottom: 10,
    marginLeft: 30,
    display: "flex",
    flexDirection: "row",
  },
  subList: {
    marginBottom: 10,
    marginLeft: 40,
  },
  option: {
    marginLeft: 10,
    padding: 5,
  },
  optionText: {
    flex: 1,
  },
  subOption: {
    marginBottom: 10,
    marginLeft: 50,
    display: "flex",
    flexDirection: "row",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  logoHeader: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  text: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const MyDocument = ({ employeeDocuments }) => {
  const getImage = () => {
    try {
      return require(`../../src/assets/${employeeDocuments?.schoolShortName?.toLowerCase()}.jpg`);
    } catch (error) {
      console.error("Image not found:", employeeDocuments?.schoolShortName);
      return LetterheadImage;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoHeader}>
          <Image src={getImage()} />
        </View>
        
        <View style={styles.sectionHeader}>
        <View style={styles.text}>
          <Text>HR/AIT / 2019-20/T/AI001747</Text>
          <Text >Date :{employeeDocuments?.dateOfJoining}</Text>
        </View>
          <Text style={styles.center}>APPOINTMENT ORDER</Text>
        </View>
        <View style={styles.section}>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>To</Text>
          <View style={styles.option}>
          <Text>Mr {employeeDocuments?.employeeName}</Text>
          <Text>No 226, 5th Cross RMV 2nd Stage, 2nd Block</Text>
          <Text>Near Ramaiah Hospital,</Text>
          <Text>Sanjai Nagar</Text>
          <Text>Bangalore-560094</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Dear Mr {employeeDocuments?.employeeName}</Text>
          <Text style={styles.option}>
            In pursuance of the decision of the staff selection committee
            meeting held, you are hereby appointed as <Text style={styles.bold}>{employeeDocuments.designationName}</Text> and posted at <Text style={styles.bold}>{employeeDocuments.schoolName}</Text>. Some of the more significant terms and
            conditions that govern your employment, subject to modifications
            from time to time are detailed below:
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>1. Place of Employment:</Text>
          <Text style={styles.option}>1.1. You shall be reporting to the ________________________.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>2. Salary and Benefits:</Text>
          <Text style={styles.option} >
            2.1. You will be paid a CTC Salary of INR_______/- per month
          </Text>
          <Text style={styles.option}>
            2.2. Salary shall be reviewed on an annual basis depending on the
            date of joining and you shall be notified of the amount on your
            salary entitlement for the succeeding year, depending upon your
            performance in job and commitment to the ethics of the profession.
          </Text>
          <Text style={styles.option}>
            2.3. In addition to salary, you shall also be entitled to receive
            other benefits as applicable under the Institute policy. The
            Institute shall, in its sole discretion, be entitled to amend, vary,
            and modify any of the terms and conditions of the policy with regard
            to the benefits that are offered to you.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>3. Resignation / Termination:</Text>
          <Text style={styles.option}>3.1. You can terminate your employment with the institute by giving one month’s prior notice during the probation period.</Text>
          <Text style={styles.option}>3.2. You can terminate your employment with the institute by giving three months prior notice after the probation period.</Text>
          <Text style={styles.option}>3.3. The Institute shall have the right to terminate your employment during probation period without payment of any compensation or notice.</Text>
          <Text style={styles.option}>3.4. The Institute shall have the right to terminate your employment after the probation period by giving one month’s notice, if you are unable to perform any of your duties or comply with Institute’s policies and code of conduct.</Text>
          <Text style={styles.option}>3.5. The Institute reserves the right to, at its sole discretion, waive off the notice period by paying you salary in lieu of the notice period.</Text>
          <Text style={styles.option}>3.6. <Text style={styles.bold}>It is hereby clarified that you cannot waive the notice period requirement in the event you wish to terminate your employment with Institute,</Text> and that your resignation will be accepted by the Institute only on your satisfying the required notice period as stated in Appointment Order. Further, till such time as the Institute accepts your resignation letter, you will be deemed to be an employee of the Institute and the terms and conditions of your employment will still continue to bind you.</Text>
          <Text style={styles.option}>3.7. In case you want to be relieved immediately, you may do so only by paying back notice period month salary to the Institute in lieu of notice, subject to the following:</Text>
          <Text style={styles.subOption}>
            <Text style={styles.option}>3.7.1.</Text>
            <Text style={styles.optionText}>You can resign only at the end of the semester.</Text>
          </Text>
          <Text style={styles.subOption}>
            <Text style={styles.option}>3.7.2.</Text>
            <Text style={styles.optionText}>Your resignation will not be accepted if you resign in the middle of the semester.</Text>
          </Text>
          <Text style={styles.subOption}>
            <Text style={styles.option}>3.7.3.</Text>
            <Text style={styles.optionText}>Your resignation will be accepted only with effect from the last date of working of the Semester.</Text>
          </Text>
          <Text style={styles.option}>3.8. You have to handover library books, keys and any other material received by you from the Department/Institution and gets a NO DUE clearance certificate before receiving relieving orders.</Text>
          <Text style={styles.option}>3.9. If you are guilty of any misconduct whether or not in the performance of your duties (including but not limited to being an undischarged insolvent, being convicted by any criminal court, being involved in fraudulent acts, etc) or commit any act which in the opinion of the Institute is likely to bring the Institute any disrepute whether or not such act is directly related to the affairs of the Institute, you will be terminated.</Text>
          <Text style={styles.option}>4.0. If there is any discrepancy in the copies of the documents / certificate given by you as a proof in support of the information provided by you, you will be terminated. If your termination is due to clause 3.9 or 4.0, then there is no compensation applicable.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>4. Mode of Communication:</Text>
          <Text style={styles.option}>4.1. For any service of notice or communications of any kind, you will be informed by written communication/ email or ordinary post at the address given by you at the time of your employment or such other address as may be intimated by you to the management thereafter.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>5. Warranty:</Text>
          <Text style={styles.option}>5.1. You warrant that your joining the Institute will not violate any agreement to which you are or have been a party to.</Text>
          <Text style={styles.option}>5.2. You warrant that you will not use or disclose any confidential or proprietary information obtained from a third party prior to your employment with the Institute.</Text>
          <Text style={styles.option}>5.3. You warrant that you will comply with all JMJ Education Institute’s applicable policies and standards and shall perform your services in a manner consistent with ethical and professional standards of the Institute.</Text>
          <Text style={styles.option}>5.4. You warrant that you possess all the requisite certificates, to be able to lawfully perform the services.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>6. Indemnification:</Text>
          <Text style={styles.option}>6.1. You agree to indemnify the Institute for any losses or damages sustained by the organization caused by or related to your breach of any of the provisions contained in this Terms of Employment.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>7. General:</Text>
          <Text style={styles.option}>7.1. You will have to produce the original certificates along with the attested Xerox copies at the time of reporting duty.</Text>
          <Text style={styles.option}>7.2. This terms & conditions contain the entire agreement between the Faculty and Institute and no alteration or variations of the terms of this agreement shall be valid unless made in writing and signed by both parties here to. This agreement supersedes any prior agreements or understandings between the parties relating to the matter of employment with Institute.</Text>
          <Text style={styles.option}>7.3. This agreement is made under and shall be construed according to the laws of India and Employee agrees to submit to the jurisdiction of the courts of Bangalore (Karnataka).</Text>
        </View>
        <View style={styles.section}>
          <Text>SECRETARY</Text>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

const DownloadPdf = ({ employeeDocuments }) => {
  return (
    <PDFDownloadLink
    document={<MyDocument employeeDocuments={employeeDocuments} />}
    fileName={`Appointment_Letter.pdf`}
    style={{ textDecoration: "none", textAlign: "center" }}
  >
    {({ loading }) =>
      loading ? (
        <CircularProgress />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <img
            src={PdfIcon}
            alt="Download PDF"
            style={{ width: "50px", height: "50px" }}
          />
          <Typography
            Typography
            variant="body2"
            color="blue"
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            Appointment_Letter.pdf
          </Typography>
        </div>
      )
    }
  </PDFDownloadLink>
  );
};

export default DownloadPdf;
