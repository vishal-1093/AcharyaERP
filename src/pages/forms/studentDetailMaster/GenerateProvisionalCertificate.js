import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import headerImage from "../../../assets/provisionalHeader.jpg";
import headerFooter from "../../../assets/provisionalFooter.jpg";
import moment from "moment";

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "10px 25px 20px 25px" },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  textRight: { textAlign: "right" },
  tableRow: {
    flexDirection: "row",
  },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
  },
  margin: { marginTop: "10px" },
  paragraph: { textAlign: "justify", lineHeight: 1.3 },
});

export const GenerateProvisionalCertificate = (data) => {
  const DisplayDate = () => (
    <View style={styles.row}>
      <View>
        <Text>
          Congratulations
          <Text style={styles.bold}>{` ${data.student_name}`}</Text> !!
        </Text>
      </View>
      <View style={styles.textRight}>
        <Text>{moment(data.date_of_admission).format("DD-MM-YYYY")}</Text>
      </View>
    </View>
  );

  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({ label, style, right, bottom }) => (
    <View
      style={{
        flex: 1,
        borderStyle: "solid",
        borderRightWidth: right,
        borderBottomWidth: bottom,
        borderColor: "black",
        outline: "none",
        padding: "3px",
        fontSize: 10,
        marginRight: right === 0 ? 1 : 0,
      }}
    >
      <Text style={{ fontFamily: style }}>{label}</Text>
    </View>
  );

  const ProgramDetails = () => (
    <View style={[styles.borderTable, styles.margin]}>
      <DispayRow>
        <DisplayCells label="Program" style="Times-Bold" right={1} bottom={1} />
        <DisplayCells
          label={data.program_name}
          style="Times-Roman"
          right={0}
          bottom={1}
        />
      </DispayRow>
      <DispayRow>
        <DisplayCells
          label="Specialization"
          style="Times-Bold"
          right={1}
          bottom={1}
        />
        <DisplayCells
          label={data.program_specialization_name}
          style="Times-Roman"
          right={0}
          bottom={1}
        />
      </DispayRow>
      <DispayRow>
        <DisplayCells
          label="Academic Year"
          style="Times-Bold"
          right={1}
          bottom={0}
        />
        <DisplayCells
          label={data.ac_year}
          style="Times-Roman"
          right={0}
          bottom={0}
        />
      </DispayRow>
    </View>
  );

  const Credentials = () => (
    <View style={[styles.borderTable, styles.margin]}>
      <DispayRow>
        <DisplayCells
          label="Email ID"
          style="Times-Bold"
          right={1}
          bottom={1}
        />
        <DisplayCells
          label={data.acharya_email}
          style="Times-Roman"
          right={0}
          bottom={1}
        />
      </DispayRow>
      <DispayRow>
        <DisplayCells
          label="ERP User ID"
          style="Times-Bold"
          right={1}
          bottom={1}
        />
        <DisplayCells
          label={data.auid}
          style="Times-Roman"
          right={0}
          bottom={1}
        />
      </DispayRow>
      <DispayRow>
        <DisplayCells
          label="Passsword for Email and ERP Login"
          style="Times-Bold"
          right={1}
          bottom={1}
        />
        <DisplayCells
          label="acharya1234"
          style="Times-Roman"
          right={0}
          bottom={1}
        />
      </DispayRow>
      <DispayRow>
        <DisplayCells
          label="ERP Web Access Link"
          style="Times-Bold"
          right={1}
          bottom={0}
        />
        <DisplayCells
          label="https://www.acharyaerptech.in"
          style="Times-Roman"
          right={0}
          bottom={0}
        />
      </DispayRow>
    </View>
  );

  const Content = () => (
    <View style={styles.layout}>
      <DisplayDate />
      <View style={{ marginTop: "20px" }}>
        <Text>
          We are pleased to inform you that your
          <Text style={styles.bold}> Provisional Admission</Text> has been
          completed. Below are the relevant details:
        </Text>
      </View>
      <ProgramDetails />
      <View style={styles.margin}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>
            Acharya Unique Identification (AUID) :
          </Text>
          {` Your AUID is `}
          <Text style={styles.bold}>{data.auid}</Text>. Please ensure that you
          reference this AUID in all future communication and transactions with
          the institution.
        </Text>
      </View>
      <View style={styles.margin}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Acharya Email Address : </Text>
          All Acharya students are assigned a dedicated college email address.
          You are encouraged to use this account as your primary means of
          receiving important information and communicating with the college.
          Your Acharya email will become active within
          <Text style={styles.bold}> 2 working days </Text> from the date of
          admission.
        </Text>
      </View>
      <Credentials />
      <View style={styles.margin}>
        <Text style={styles.paragraph}>
          The ERP provides you access to your programme details, information on
          your teachers, timetable, attendance, pay fee and most importantly
          connect with your Mentor. The information may be accessed on a web
          browser or by using the ERP App on your mobile phone. You may download
          the app using the QR codes below. The portal allows multiple logins,
          allowing parents to use the same to be updated on their ward's
          academic progress.
        </Text>
      </View>

      {/* <View style={{ marginBottom: "12px" }}>
    <Text style={{ textAlign: "justify", lineHeight: 1.3 }}>
      Please note that the given fee is applicable only for the prescribed
      Academic Batch. Admission shall be ratified only after the
      submission of all original documents for verification and payment of
      all the fee for the semester/year as prescribed in the letter of
      offer. Failure to do so shall result in the withdrawal of the Offer
      of Admission.
    </Text>
  </View> */}

      <View style={styles.margin}>
        <Text style={styles.paragraph}>
          Counsellor Assistance: Should you require any further details or
          assistance, please feel free to contact
          <Text style={styles.bold}> {data.CounselorName?.trim()}</Text>, your
          designated counsellor and they would be glad to help you navigate any
          queries or concerns.
        </Text>
      </View>

      <View style={styles.margin}>
        <Text style={styles.paragraph}>
          Once again, congratulations on taking this important step in your
          academic journey. We look forward to welcoming you to Acharya and wish
          you every success in your studies.
        </Text>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Provisional Admission Certificate">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View>
                <Image style={{ width: "100%" }} src={headerImage} />
              </View>
              <Content />
              <View>
                <Image style={{ width: "100%" }} src={headerFooter} />
              </View>
            </View>
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
