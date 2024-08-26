import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Image,
  Font,
} from "@react-pdf/renderer";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import moment from "moment";
import sign from "../../../assets/vsign.png";

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
    fontFamily: "Roboto",
    fontSize: "10px",
  },

  image: { position: "absolute", width: "100%" },

  layout: { margin: "140px 20px 20px 20px" },

  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    padding: "5px",
  },

  tableRow: {
    flexDirection: "row",
  },

  tableTd: { width: "25%", borderStyle: "solid", borderColor: "black" },

  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    padding: "5px",
  },

  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: "#f3f3f3",
    fontWeight: "bold",
  },

  borderBtm: { borderBottomWidth: 1 },
  borderRt: { borderRightWidth: 1 },
  marginTop: { marginTop: "10px" },
});

const logos = require.context("../../../assets", true);

export const GenerateScholarshipApplication = (studentData, schData) => {
  const DisplayText = ({ label, value }) => (
    <>
      <View style={{ width: "20%", padding: "5px" }}>
        <Text
          style={{
            fontStyle: "bold",
          }}
        >
          {label}
        </Text>
      </View>

      <View style={{ width: "30%", padding: "5px" }}>
        <Text>{value}</Text>
      </View>
    </>
  );

  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const StudentData = () => (
    <View style={styles.table}>
      <DispayRow>
        <DisplayText label="AUID" value={studentData.auid} />
        <DisplayText label="Student Name" value={studentData.student_name} />
      </DispayRow>

      <DispayRow>
        <DisplayText label="USN" value={studentData.usn ?? "-"} />
        <DisplayText
          label="DOA"
          value={moment(studentData.date_of_admission).format("DD-MM-YYYY")}
        />
      </DispayRow>

      <DispayRow>
        <DisplayText label="School" value={studentData.school_name} />
        <DisplayText
          label="Program"
          value={`${studentData.program_short_name} - ${studentData.program_specialization_short_name}`}
        />
      </DispayRow>

      <DispayRow>
        <DisplayText
          label="Academic Batch"
          value={studentData.academic_batch}
        />
        <DisplayText
          label="Current Year/Sem"
          value={`${studentData.current_year}/${studentData.current_sem}`}
        />
      </DispayRow>

      <DispayRow>
        <DisplayText
          label="Fee Template"
          value={studentData.fee_template_name}
        />
        <DisplayText
          label="Admission Category"
          value={`${studentData.fee_admission_category_short_name} - ${studentData.fee_admission_sub_category_short_name}`}
        />
      </DispayRow>

      <DispayRow>
        <DisplayText label="Acharya Email" value={studentData.acharya_email} />
        <DisplayText label="Mobile No." value={studentData.mobile} />
      </DispayRow>
    </View>
  );

  const ScholarshipData = () => (
    <View style={[styles.table, styles.marginTop]}>
      <DispayRow>
        <DisplayText label="Residence" value={schData.residence} />
        <DisplayText
          label="Scholarship Awarded From An OutSide Body"
          value={schData.award_details ?? "No"}
        />
      </DispayRow>

      <DispayRow>
        <DisplayText label="Reason For Fee Excemption" value={schData.reason} />
        <DisplayText
          label="Parent Income"
          value={schData.parent_income ?? "-"}
        />
      </DispayRow>

      <DispayRow>
        <DisplayText label="Parent Occupation" value={schData.occupation} />
      </DispayRow>
    </View>
  );

  const ApprovedData = () => (
    <View style={[styles.table, styles.marginTop]}>
      <DispayRow>
        <DisplayText
          label="Requested Amount"
          value={schData.requested_scholarship}
        />
        <DisplayText label="Approved Amount" value={schData.approved_amount} />
      </DispayRow>
    </View>
  );

  const ValidatorSignatureSection = () => (
    <>
      <View style={{ marginTop: "20px" }}>
        <Image style={{ width: "100px" }} src={sign} />
      </View>
      <View style={{ margintTop: "15px", flexDirection: "row" }}>
        <Text
          style={{
            fontStyle: "bold",
          }}
        >
          Approved Date :&nbsp;
        </Text>
        <Text>{moment(schData.approved_date).format("DD-MM-YYYY LT")}</Text>
      </View>
    </>
  );

  const SignatureSection = () => (
    <View style={{ marginTop: "50px", flexDirection: "row" }}>
      <View style={{ width: "50%" }}>
        <Text>&emsp;&emsp;Signature</Text>
        <Text>(Parent/Guardian)</Text>
      </View>

      <View style={{ width: "50%", textAlign: "right" }}>
        <Text>Signature</Text>
        <Text>(Student)</Text>
      </View>
    </View>
  );

  const PageData = () => (
    <View style={styles.pageLayout}>
      <Image style={styles.image} src={logos("./aisait.jpg")} />
      <View style={styles.layout}>
        <StudentData />
        <ScholarshipData />
        <ApprovedData />
        <ValidatorSignatureSection />
        <SignatureSection />
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Scholarship Application">
          <Page size="A4">
            <PageData />
          </Page>
        </Document>
      );
      const blob = await pdf(generateDocument).toBlob();
      resolve(blob);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};
