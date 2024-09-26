import {
  Document,
  Image,
  Link,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import ait from "../../../assets/aisait.jpg";
import moment from "moment";
import sign from "../../../assets/offersign.png";
import seal from "../../../assets/offerseal2.jpg";
import footer from "../../../assets/footer.jpg";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  image: { position: "absolute", width: "100%" },
  layout: { margin: "140px 25px 20px 25px" },
  subLayout: { margin: "80px 25px 20px 25px" },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  margin: { marginTop: "25px" },
  subMargin: { marginTop: "15px" },
  paragraphMargin: { marginTop: "10px" },
  paragraph: { textAlign: "justify", lineHeight: 1.4 },
  alignCenter: { alignItems: "center" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  footerText: {
    color: "grey",
    fontSize: 14,
    textAlign: "center",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  heading: { fontSize: 14, fontFamily: "Times-Bold", textAlign: "center" },
  subHeading: { fontSize: 12, fontFamily: "Times-Bold" },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    padding: "3px",
  },
  tableRow: {
    flexDirection: "row",
  },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  marginBottom: { marginBottom: "10px" },
  link: { fontFamily: "Times-Bold", fontSize: 14, textDecoration: "none" },
  acceptText: {
    textAlign: "center",
    fontSize: 12,
    color: "grey",
    fontFamily: "Times-Bold",
    paddingLeft: 20,
    paddingRight: 20,
  },
});

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

const acceptanceDetail = [
  { label: "Candidate Name", value: "candidate_name" },
  { label: "DOB", value: "date_of_birth" },
  { label: "Parent Name", value: "father_name" },
  { label: "Application No", value: "application_no_npf" },
  { label: "Candidate ID", value: "candidate_id" },
];

export const GenerateOfferPdf = (data) => {
  let getAddress = "";
  if (data.permanent_city) {
    getAddress += data.permanent_city;
  }
  if (data.permanent_state) {
    getAddress += data.permanent_state;
  }
  if (data.permanent_pincode) {
    getAddress += data.permanent_pincode;
  }
  if (data.permanent_country) {
    getAddress += data.permanent_country;
  }
  const DisplayDate = () => (
    <View style={styles.row}>
      <View>
        <Text>Ref.No:{data?.application_no_npf}</Text>
      </View>
      <View style={styles.textRight}>
        <Text>{`Date: ${moment().format("DD-MM-YYYY")}`}</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.margin}>
      <View>
        <Text style={styles.bold}>{data.candidate_name}</Text>
      </View>
      <View>
        <Text>{getAddress}</Text>
      </View>
      <View>
        <Text>{data.candidate_email}</Text>
      </View>
    </View>
  );

  const Subject = () => (
    <View style={styles.margin}>
      <View>
        <Text>Dear Student</Text>
      </View>
      <View style={styles.subMargin}>
        <Text>
          Subject: Formal Admission Offer for
          <Text
            style={styles.bold}
          >{` ${data.program_short_name} - ${data.program_specialization_name} `}</Text>
          Program at<Text style={styles.bold}>{` ${data.school_name}`}</Text>.
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          We trust this letter finds you well. It is with great pleasure that We
          extend our congratulations on your successful application to the BE -
          ELECTRONICS & COMMUNICATION ENGG program at ACHARYA INSTITUTE OF
          TECHNOLOGY. We are delighted to inform you that you have been accepted
          for the <Text style={styles.bold}>{data.ac_year}</Text> Academic
          Session.
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          Please be advised that this formal offer is contingent upon your
          fulfilment of the academic requirements as stipulated by the
          Constituent body/University. To secure your place in the program, we
          kindly request you to digitally accept this offer by clicking on the
          'Accept Now' button in the Acceptance Letter attached herewith.
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          Upon accepting this offer, you are committing to the payment of the
          prescribed fees outlined below. It is imperative that you carefully
          review and accept the terms, conditions, and regulations of Acharya
          Institutes to ensure a smooth academic journey
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          For any clarifications or assistance,please do not hesitate to contact
          us at +91 74066 44449 , admissions@acharya.ac.in
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          We look forward to welcoming you to
          <Text style={styles.bold}>{` ${data.school_name} `}</Text>
          and wish you every success in your academic endeavours.
        </Text>
      </View>

      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>Sincerely,</Text>
      </View>
    </View>
  );

  const SignatureSection = () => (
    <View style={[styles.row, styles.alignCenter]}>
      <View>
        <Image src={sign} style={{ width: "80px" }} />
        <Text style={styles.bold}>Director of Admissions</Text>
        <Text style={{ fontSize: 9, fontFamily: "Times-Bold" }}>
          {data.school_name}
        </Text>
      </View>
      <View>
        <Image src={seal} style={{ width: "80px" }} />
      </View>
      <View>
        <Text>Annexure 1: Terms and Conditions & Fees</Text>
        <Text>Annexure 2: Acceptance letter</Text>
      </View>
    </View>
  );

  const FooterText = () => (
    <View style={styles.footerText}>
      <Text style={styles.bold}>
        This is a Letter of Offer and cannot be used for Visa purposes.
      </Text>
    </View>
  );
  const FirstPage = () => (
    <>
      <DisplayDate />
      <Address />
      <Subject />
      <SignatureSection />
    </>
  );

  const PageData = () => (
    <View style={styles.pageLayout}>
      <Image style={styles.image} src={ait} />
      <View style={styles.layout}>
        <FirstPage />
      </View>
    </View>
  );

  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({ label, style, right, bottom, align }) => (
    <View
      style={{
        flex: 1,
        borderStyle: "solid",
        borderRightWidth: right,
        borderBottomWidth: bottom,
        borderColor: "black",
        outline: "none",
        padding: "4px",
        fontSize: 10,
      }}
    >
      <Text style={{ fontFamily: style, textAlign: align }}>{label}</Text>
    </View>
  );

  const DisplayTableheader = () => (
    <DispayRow>
      <DisplayCells
        label="Sl No"
        style="Times-Bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label=" Fee Type & Percentage of Refund"
        style="Times-Bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label="Point of notice"
        style="Times-Bold"
        right={0}
        bottom={1}
        align="center"
      />
    </DispayRow>
  );

  const RefundData = () => (
    <View style={[styles.borderTable, styles.marginBottom]}>
      <DisplayTableheader />
      {refundTable.map((obj, i) => (
        <DispayRow key={i}>
          <DisplayCells
            label={i + 1}
            style="Times-Roman"
            right={1}
            bottom={i !== 5 ? 1 : 0}
            align="center"
          />
          <DisplayCells
            label={obj.firstValue}
            style="Times-Roman"
            right={1}
            bottom={i !== 5 ? 1 : 0}
            align="justify"
          />
          <DisplayCells
            label={obj.secondValue}
            style="Times-Roman"
            right={0}
            bottom={i !== 5 ? 1 : 0}
            align="justify"
          />
        </DispayRow>
      ))}
    </View>
  );

  const CancelPolicy = () => (
    <View style={styles.pageLayout}>
      <View style={styles.subLayout}>
        <Text style={styles.subHeading}>Cancellation Policy</Text>

        <View style={styles.subMargin}>
          <Text style={styles.paragraph}>
            Candidates seeking admission cancellation must submit a written
            request to the Director of Admissions, including reasons and
            supporting documentary proof.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text style={[styles.subHeading, styles.marginBottom]}>
            Refund Policy
          </Text>
        </View>

        <RefundData />
      </View>
    </View>
  );

  const FeeTemplate = () => (
    <View style={styles.paragraphMargin}>
      <Text style={styles.textRight}>(Amount in INR)</Text>
    </View>
  );

  const SecondPageData = () => (
    <View style={styles.pageLayout}>
      <View style={styles.subLayout}>
        <Text style={styles.heading}>Annexure 1 - Terms & Conditions</Text>
        <View style={styles.margin}>
          <Text>
            Please carefully review the Terms & Conditions outlined below:
          </Text>
        </View>
        <View style={styles.subMargin}>
          <Text>Fees Payment Timelines: For the 1st Sem / Year</Text>
        </View>
        <View style={styles.subMargin}>
          <Text style={styles.paragraph}>
            • Registration fees must be paid immediately upon acceptance of the
            Offer Letter.
          </Text>
          <Text style={styles.paragraph}>
            • 50% of the total balance fees is to be settled within 3 working
            days.
          </Text>
          <Text style={styles.paragraph}>
            • The remaining balance fees must be paid within 15 days.
          </Text>
          <FeeTemplate />
          <Text style={styles.paragraph}>
            • Delayed fee payments will incur a late fee.
          </Text>
          <Text style={styles.paragraph}>
            • Registration fees are to be paid exclusively through the link
            provided in the Acceptance Letter.
          </Text>
          <Text style={styles.paragraph}>
            • The balance fee is to be transacted through the individual login
            of the ERP Portal / ACERP APP.
          </Text>
          <Text style={styles.paragraph}>
            • Cash payments for fees are not accepted.
          </Text>
          <Text style={styles.paragraph}>
            • Students are responsible for the payment of exam and convocation
            fees as prescribed by the Board/University.
          </Text>
          <Text style={styles.paragraph}>
            • Admission ID is generated upon successful payment of the
            registration fee
          </Text>
          <Text style={styles.paragraph}>
            • A Provisional Admission letter, including admission details and
            the student's official Acharya email ID with the password, will be
            sent upon Admission ID generation. On completion of course email ID
            will be deactivated.
          </Text>
          <Text style={styles.paragraph}>
            • Admission will be finalized upon submission, verification of
            original documents, and approval from the respective
            Board/University.
          </Text>
          <Text style={styles.paragraph}>
            • To complete the enrolment process, we kindly request you to submit
            the original documents (Marks sheets of relevant academic years)
            with 2 sets of photocopies from your previous college or a
            provisional letter within two days from the issuance of this offer
            letter.
          </Text>
          <Text style={styles.paragraph}>
            • Failure to submit the aforementioned documents within the
            stipulated timeframe may result in the cancellation of your
            admission.
          </Text>
          <Text style={styles.paragraph}>
            • Please ensure that all documents are authentic and duly attested.
            If you face any challenges or require an extension, kindly contact
            the Admission Office at (admissions@acharya.ac.in) at the earliest.
          </Text>
          <Text style={styles.paragraph}>
            • Failure to complete admission formalities and payment as
            prescribed may result in the withdrawal of provisional admission
          </Text>
          <Text style={styles.paragraph}>• Fees are subject to change</Text>
        </View>
      </View>
    </View>
  );

  const AcceptanceData = () => (
    <View style={styles.pageLayout}>
      <View style={styles.subLayout}>
        <Text style={styles.heading}>Annexure 2 - Letter of Acceptance</Text>
        <View style={styles.margin}>
          <Text>To,</Text>
          <Text>Director Admissions</Text>
          <Text>Acharya Institutes</Text>
          <Text>Soldevanahalli, Bengaluru</Text>
          <Text>Karnataka, India</Text>
        </View>

        <View style={[styles.margin, { width: "50%" }]}>
          <View style={[styles.borderTable, styles.marginBottom]}>
            {acceptanceDetail?.map((obj, i) => (
              <DispayRow key={i}>
                <DisplayCells
                  label={obj.label}
                  style="Times-Roman"
                  right={1}
                  bottom={i === 4 ? 0 : 1}
                  align="left"
                />
                <DisplayCells
                  label={i === 2 ? `Mr.${data[obj.value]}` : data[obj.value]}
                  style="Times-Roman"
                  right={0}
                  bottom={i === 4 ? 0 : 1}
                  align="left"
                />
              </DispayRow>
            ))}
          </View>
        </View>

        <View style={styles.margin}>
          <Text style={styles.paragraph}>
            I {data.candidate_name} son/daughter of {`Mr.${data.father_name}`}
            have thoroughly reviewed the Offer Letter and accompanying Terms and
            conditions for admission to the{" "}
            {` ${data.program_short_name} - ${data.program_specialization_name} `}
            program at
            {` ${data.school_name} `}
            for the Academic Year {` ${data.ac_year} `}.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text style={styles.paragraph}>
            By digitally accepting this offer, I hereby confirm that I
            comprehend all the details outlined in the letter and willingly
            commit to paying the prescribed fees as specified in my Offer
            Letter.
          </Text>
        </View>

        <View style={styles.paragraphMargin}>
          <Text style={styles.paragraph}>
            I formally accept the offer for the BACHELOR OF
            {` ${data.program_short_name} - ${data.program_specialization_name} `}
            program for the Academic Year {` ${data.ac_year}`}, acknowledging
            and agreeing to abide by all the terms and conditions as explicitly
            stated in the Offer Letter.
          </Text>
        </View>

        {data.npf_status === 3 && (
          <>
            <View style={styles.margin}>
              <Text style={styles.bold}>Digital Acceptance Details</Text>
            </View>

            <View style={styles.subMargin}>
              <Text style={styles.paragraph}>
                Date & Time:{moment().format("DD-MM-YYYY LT")}
              </Text>
              <Text style={styles.paragraph}>IP Address: 42.105.129.221</Text>
            </View>
          </>
        )}

        {data.npf_status === 3 ? (
          <View style={styles.subMargin}>
            <Link src="" style={styles.link}>
              Pay Now
            </Link>
          </View>
        ) : (
          <View style={styles.subMargin}>
            <Link
              src={`http://localhost:3001/OfferLetterView/${data.candidate_id}`}
              style={styles.link}
            >
              Accept Offer
            </Link>
          </View>
        )}

        <View style={styles.margin}>
          <Text style={styles.textRight}>Student Signature</Text>
        </View>
        <View style={styles.margin}>
          <Text style={styles.acceptText}>
            This Letter of Acceptance is a binding document, and any breach of
            the terms and conditions may result in the withdrawal of admission
          </Text>
        </View>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Offer Letter">
          <Page size="A4" style={styles.pageLayout}>
            <PageData />
            <FooterText />
            <Image style={styles.footerImage} src={footer} />
          </Page>
          <Page size="A4" style={styles.pageLayout}>
            <SecondPageData />
          </Page>
          <Page size="A4" style={styles.pageLayout}>
            <CancelPolicy />
          </Page>
          <Page size="A4" style={styles.pageLayout}>
            <AcceptanceData />
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
