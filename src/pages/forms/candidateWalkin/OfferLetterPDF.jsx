import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
  Image,
} from "@react-pdf/renderer";
import LetterheadImage from "../../../assets/aisait.jpg";
import sign from "../../../assets/offersign.png";
import seal from "../../../assets/offerseal2.jpg";

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    padding: 40,
    fontFamily: "Times-Roman",
  },
  paragraphMargin: {
    marginTop: 20,
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    marginTop: 120,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Times-Bold",
  },
  titleHeader: {
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 10,
    fontFamily: "Times-Bold",
  },
  center: {
    fontSize: 14,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  logoHeader: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  column: {
    flex: 1,
    textAlign: "center",
  },
  smallText: {
    fontSize: 10,
    color: "grey",
    textAlign: "center",
    marginTop: 10,
  },
  sealAndSignature: {
    marginTop: 30,
  },
  list: {
    marginVertical: 10,
    marginLeft: 20,
  },
  listItem: {
    marginBottom: 5,
  },
  note: {
    marginTop: 15,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  centerText: {
    textAlign: "center",
  },
  signature: {
    marginTop: 30,
    textAlign: "right",
  },
  linkText: {
    color: "blue",
    textDecoration: "underline",
  },
  tableCellrow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    flex: 1,
    padding: "5px",
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
  },
  tableCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 5,
    flex: 1,
  },
  tableData: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    flex: 1,
    padding: "5px",
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
});

export const getImage = (employeeDocuments) => {
  try {
    if (!employeeDocuments || !employeeDocuments.school_name_short) {
      throw new Error("schoolShortName is not defined");
    }
    return require(`../../../assets/${employeeDocuments?.org_type?.toLowerCase()}${employeeDocuments?.school_name_short?.toLowerCase()}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      employeeDocuments?.schoolShortName,
      "Error:",
      error.message
    );
    return LetterheadImage;
  }
};

export const OfferLetterPDFGenerator = (data, empData) => {
  const Content = () => (
    <View>
      <View style={styles.sectionHeader}>
        <View style={styles.row}>
          <Text>Ref.No : {data?.application_no_npf}</Text>
          <Text>Date: {data?.program_start}</Text>
        </View>
      </View>

      <Text style={{ marginTop: "20px" }}>
        <Text style={styles.bold}>Ms. {data?.candidate_name}</Text>
      </Text>
      <Text style={{ marginTop: "20px" }}>divyakumari@acharya.ac.in</Text>

      <Text style={{ marginTop: "30px" }}>
        Subject: Formal Admission Offer for{" "}
        {data.program_specialization_short_name +
          " - " +
          data.program_name +
          " "}
      </Text>
      <Text>
        at <Text style={styles.bold}>{data.school_name}</Text>
      </Text>

      <Text style={styles.paragraphMargin}>Dear Student,</Text>
      <Text style={styles.paragraphMargin}>
        We trust this letter finds you well. It is with great pleasure that We
        extend our congratulations on your successful application to the{" "}
        {data.program_specialization_short_name +
          " - " +
          data.program_name +
          " "}{" "}
        program at {data.school_name}. We are delighted to inform you that you
        have been accepted for the
        <Text style={styles.bold}> {" " + data.ac_year + " "}</Text> Academic
        Session.
      </Text>
      <Text style={styles.paragraphMargin}>
        Please be advised that this formal offer is contingent upon your
        fulfillment of the academic requirements as stipulated by the
        Constituent body/University. To secure your place in the program, we
        kindly request you to digitally accept this offer by clicking on the
        'Accept Now' button in the Acceptance Letter attached herewith.
      </Text>
      <Text style={styles.paragraphMargin}>
        Upon accepting this offer, you are committing to the payment of the
        prescribed fees outlined below. It is imperative that you carefully
        review and accept the terms, conditions, and regulations of Acharya
        Institutes to ensure a smooth academic journey.
      </Text>
      <Text style={styles.paragraphMargin}>
        For any clarifications or assistance, please do not hesitate to contact
        us at 📞 +91 74066 44449 or admissions@acharya.ac.in.
      </Text>
      <Text style={styles.paragraphMargin}>
        We look forward to welcoming you to{" "}
        <Text style={styles.bold}>ACHARYA INSTITUTE OF TECHNOLOGY</Text> and
        wish you every success in your academic endeavors.
      </Text>

      <Text style={styles.paragraphMargin}>Sincerely,</Text>

      <View style={styles.sealAndSignature}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Image src={sign} style={{ width: "80px" }} />
            <Text style={styles.bold}>
              Director of Admissions ACHARYA INSTITUTE OF TECHNOLOGY
            </Text>
          </View>

          <View style={styles.column}>
            <Image src={seal} style={{ width: "100px" }} />
          </View>

          <View style={styles.column}>
            <Text>Annexure 1: Terms and Conditions</Text>
            <Text>Annexure 2: Acceptance letter</Text>
          </View>
        </View>
      </View>

      <Text style={styles.smallText}>
        {/* This is a Letter of Offer and cannot be used for Visa purposes. */}
      </Text>
    </View>
  );
  const TermsAndConditions = () => (
    <View>
      <Text style={[styles.paragraphMargin, styles.bold, styles.center]}>
        Annexure 1 - Terms & Conditions
      </Text>
      <Text style={styles.paragraphMargin}>
        Please carefully review the Terms & Conditions outlined below:
      </Text>
      <Text>Fees Payment Timelines: For the 1st Sem / Year</Text>
      <View style={styles.paragraphMargin}>
        <Text style={styles.listItem}>
          • Registration fees must be paid immediately upon acceptance of the
          Offer Letter.{" "}
        </Text>
        <Text style={styles.listItem}>
          • 50% of the total balance fees to be settled within 3 days.
        </Text>
        <Text style={styles.listItem}>
          • The remaining balance fees must be paid within 15 days.
        </Text>
      </View>
      <Text style={styles.paragraphMargin}>(Amount in INR)</Text>
      <View style={styles.tableData}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Sl No.</Text>
          <Text style={[styles.tableCell, { width: "40%" }]}>COMPONENTS</Text>
          <Text style={styles.tableCell}>1YEAR</Text>
          <Text style={styles.tableCell}>2YEAR</Text>
          <Text style={styles.tableCell}>3YEAR</Text>
          <Text style={styles.tableCell}>4YEAR</Text>
          <Text style={styles.tableCell}>5YEAR</Text>
        </View>

        {/* Dynamic Rows */}
        {empData.map((item, index) => (
          <View style={styles.tableRow} key={item.fee_sub_amt_id}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={[styles.tableCell, { width: "40%" }]}>
              {item.voucher_head}
            </Text>
            <Text style={styles.tableCell}>{item.year1_amt || 0}</Text>
            <Text style={styles.tableCell}>{item.year2_amt || 0}</Text>
            <Text style={styles.tableCell}>{item.year3_amt || 0}</Text>
            <Text style={styles.tableCell}>{item.year4_amt || 0}</Text>
            <Text style={styles.tableCell}>{item.year5_amt || 0}</Text>
          </View>
        ))}

        {/* Total Row */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.boldText]}>Total</Text>
          <Text style={[styles.tableCell, { width: "40%" }]}></Text>
          <Text style={[styles.tableCell, styles.boldText]}>
            {empData.reduce((total, item) => total + item.year1_amt, 0)}
          </Text>
          <Text style={[styles.tableCell, styles.boldText]}>
            {empData.reduce((total, item) => total + item.year2_amt, 0)}
          </Text>
          <Text style={[styles.tableCell, styles.boldText]}>
            {empData.reduce((total, item) => total + item.year3_amt, 0)}
          </Text>
          <Text style={[styles.tableCell, styles.boldText]}>
            {empData.reduce((total, item) => total + item.year4_amt, 0)}
          </Text>
          <Text style={[styles.tableCell, styles.boldText]}>
            {empData.reduce((total, item) => total + item.year5_amt, 0)}
          </Text>
        </View>

        {/* Grand Total Row */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.boldText]}>Grand Total</Text>
          <Text style={[styles.tableCell, { width: "40%" }]}></Text>
          <Text style={[styles.tableCell, styles.boldText]}>
            {empData.reduce((total, item) => total + item.total_amt, 0)}
          </Text>
        </View>
      </View>
      Table Section
      {/* Notes Section */}
      <Text style={[styles.note, styles.paragraphMargin]}>Note:</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Delayed fee payments will incur a late fee.
        </Text>
        <Text style={styles.listItem}>
          • Registration fees are to be paid exclusively through the link
          provided in the Acceptance Letter.
        </Text>
        <Text style={styles.listItem}>
          • The balance fee is to be transacted through the individual login of
          the ERP Portal / ACERP APP.
        </Text>
        <Text style={styles.listItem}>
          • Cash payments for fees are not accepted.
        </Text>
        <Text style={styles.listItem}>
          • Students are responsible for the payment of exam and convocation
          fees as prescribed by the Board/University.
        </Text>

        <Text style={styles.listItem}>
          • Admission ID is generated upon successful payment of the
          registration fee.
        </Text>
        <Text style={styles.listItem}>
          • A Provisional Admission letter, including admission details and the
          student's official Acharya email ID with the password, will be sent
          upon Admission ID generation. On completion of course email ID will be
          deactivated.
        </Text>
        <Text style={styles.listItem}>
          • Admission will be finalized upon submission, verification of
          original documents, and approval from the respective Board/University.
        </Text>
        <Text style={styles.listItem}>
          • To complete the enrolment process, we kindly request you to submit
          the original documents (Marks sheets of relevant academic years) with
          2 sets of photocopies from your previous college or a provisional
          letter within two days from the issuance of this offer letter.
        </Text>
        <Text style={styles.listItem}>
          • Failure to submit the aforementioned documents within the stipulated
          timeframe may result in the cancellation of your admission.
        </Text>
        <Text style={styles.listItem}>
          • Please ensure that all documents are authentic and duly attested. If
          you face any challenges or require an extension, kindly contact the
          Admission Office at (admissions@acharya.ac.in) at the earliest.
        </Text>
        <Text style={styles.listItem}>
          • Failure to complete admission formalities and payment as prescribed
          may result in the withdrawal of provisional admission.
        </Text>
        <Text style={styles.listItem}>• Fees are subject to change.</Text>
      </View>
    </View>
  );
  const CancellationPolicy = () => (
    <View>
      {/* Cancellation Policy */}
      <Text style={[styles.paragraphMargin, styles.bold]}>
        Cancellation Policy
      </Text>
      <Text style={styles.paragraphMargin}>
        Candidates seeking admission cancellation must submit a written request
        to the Director of Admissions, including reasons and supporting
        documentary proof.
      </Text>

      {/* Refund Policy Table */}
      <Text style={[styles.paragraphMargin, styles.bold]}>Refund Policy</Text>
      <View style={[styles.tableData, styles.paragraphMargin]}>
        {/* Header Row */}
        <View style={[styles.tableCellrow, styles.tableHeader]}>
          <Text style={[styles.cell, styles.tableHeader]}>SI No.</Text>
          <Text style={[styles.cell, styles.tableHeader]}>
            Fee Type & Percentage of Refund
          </Text>
          <Text style={[styles.cell, styles.tableHeader]}>Point of notice</Text>
        </View>

        {/* Row 1 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>1</Text>
          <Text style={styles.cell}>Registration</Text>
          <Text style={styles.cell}>Non-refundable Any time of notice</Text>
        </View>

        {/* Row 2 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>2</Text>
          <Text style={styles.cell}>100% of Tuition fee</Text>
          <Text style={styles.cell}>
            15 days or more before the commencement of classes
          </Text>
        </View>

        {/* Row 3 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>3</Text>
          <Text style={styles.cell}>90% of Tuition fee</Text>
          <Text style={styles.cell}>
            Less than 15 days after the commencement of classes
          </Text>
        </View>

        {/* Row 4 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>4</Text>
          <Text style={styles.cell}>80% of Tuition fee</Text>
          <Text style={styles.cell}>
            Less than 15 days after the commencement of classes
          </Text>
        </View>
        {/* Row 5 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>5</Text>
          <Text style={styles.cell}>50% of Tuition fee</Text>
          <Text style={styles.cell}>
            More than 15 days and less than 30 days after the commencement of
            classes
          </Text>
        </View>
        {/* Row 6 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>6</Text>
          <Text style={styles.cell}>0% of Tuition fee</Text>
          <Text style={styles.cell}>
            More than 30 days after the commencement of classes
          </Text>
        </View>
      </View>
    </View>
  );
  const AnnexurePolicy = () => (
    <View style={{ marginTop: 300 }}>
      {/* Page Break - Start a New Page for Annexure 2 */}
      <Text style={[styles.bold, styles.centerText]}>
        Annexure 2 - Letter of Acceptance
      </Text>

      <Text style={styles.paragraphMargin}>
        To,
        {"\n"}
        Director Admissions{"\n"}
        Acharya Institutes{"\n"}
        Soldevanahalli, Bengaluru{"\n"}
        Karnataka, India
      </Text>

      {/* Table for Candidate Information */}
      <View style={[styles.tableData, styles.paragraphMargin]}>
      

        {/* Row 1 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>Candidate Name</Text>
          <Text style={styles.cell}>{data.candidate_name}</Text>
        </View>

        {/* Row 2 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>DOB</Text>
          <Text style={styles.cell}>
          {data.date_of_birth}
          </Text>
        </View>

        {/* Row 3 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>Parent Name</Text>
          <Text style={styles.cell}>
          {data.father_name}
          </Text>
        </View>

        {/* Row 4 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>Application No</Text>
          <Text style={styles.cell}>
          {data.application_no_npf}
          </Text>
        </View>
        {/* Row 5 */}
        <View style={styles.tableCellrow}>
          <Text style={styles.cell}>Candidate ID</Text>
          <Text style={styles.cell}>
          {data.application_no_npf}
          </Text>
        </View>
      </View>
      {/* Acceptance Text */}
      <Text style={styles.paragraphMargin}>
        I Ms.divya testing 1409 son/daughter of - have thoroughly reviewed the
        Offer Letter and accompanying Terms and conditions for admission to the
        BACHELOR OF ENGINEERING-COMPUTER SCIENCE ENGG program at ACHARYA
        INSTITUTE OF TECHNOLOGY for the Academic Year 2024-2025. By digitally
        accepting this offer, I hereby confirm that I comprehend all the details
        outlined in the letter and willingly commit to paying the prescribed
        fees as specified in my Offer Letter.
      </Text>
      <Text style={styles.paragraphMargin}>
        I formally accept the offer for the BACHELOR OF ENGINEERING-COMPUTER
        SCIENCE ENGG program for the Academic Year 2024-2025, acknowledging and
        agreeing to abide by all the terms and conditions as explicitly stated
        in the Offer Letter.
      </Text>

      {/* Accept Offer Link */}
      <Text style={styles.linkText}>Accept Offer</Text>

      {/* Signature */}
      <Text style={styles.signature}>Student Signature</Text>

      {/* Footer Text */}
      <Text style={styles.paragraphMargin}>
        This Letter of Acceptance is a binding document, and any breach of the
        terms and conditions may result in the withdrawal of admission.
      </Text>
    </View>
  );
  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Offer Letter">
          <Page size="A4" style={styles.page}>
            <View style={styles.logoHeader}>
              <Image src={getImage(empData)} />
            </View>
            <Content />
            <TermsAndConditions />
            <CancellationPolicy />
            <AnnexurePolicy />
          </Page>
        </Document>
      );

      const blob = await pdf(generateDocument).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
