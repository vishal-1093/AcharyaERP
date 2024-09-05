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

const textSize = "9px";

const styles = StyleSheet.create({
  pageLayout: {
    fontFamily: "Roboto",
    fontSize: textSize,
  },

  image: { position: "absolute", width: "100%" },

  layout: { margin: "125px 20px 20px 20px" },

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

  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },

  marginBottom: { marginBottom: "10px" },
});

const logos = require.context("../../../assets", true);

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

export const GenerateScholarshipApplication = (studentData, schData) => {
  const DisplayHeaders = ({ label }) => (
    <View>
      <Text
        style={{ textAlign: "center", fontStyle: "bold", fontSize: "11px" }}
      >
        {label}
      </Text>
    </View>
  );

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

  const DisplayDate = () => (
    <DispayRow>
      <View
        style={{ width: "100%", textAlign: "right", margin: "10px 0 10px 0" }}
      >
        <Text>{`Date : ${moment().format("DD-MM-YYYY")}`}</Text>
      </View>
    </DispayRow>
  );

  const StudentData = () => (
    <View style={[styles.table, styles.marginBottom]}>
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
    <View style={[styles.table, styles.marginBottom]}>
      <DispayRow>
        <DisplayText label="Residence" value={schData.residence} />
        <DisplayText
          label="Scholarship Awarded From An OutSide Body"
          value={schData.award === "true" ? schData.award_details : "No"}
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

  const DisplayCells = ({ label, style, right, bottom, align }) => (
    <View
      style={{
        width: "25%",
        borderStyle: "solid",
        borderRightWidth: right,
        borderBottomWidth: bottom,
        borderColor: "black",
        outline: "none",
        padding: "4px",
      }}
    >
      <Text style={{ fontStyle: style, textAlign: align }}>{label}</Text>
    </View>
  );

  const DisplayTableheader = () => (
    <DispayRow>
      <DisplayCells label="" style="bold" right={1} bottom={1} align="center" />
      <DisplayCells
        label="Name"
        style="bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label="Date"
        style="bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label="Amount"
        style="bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label="Remarks"
        style="bold"
        right={0}
        bottom={1}
        align="center"
      />
    </DispayRow>
  );

  const RequesterRow = () => (
    <DispayRow>
      <DisplayCells
        label="Requester"
        style="normal"
        right={1}
        bottom={schData.verified_date ? 1 : 0}
        align="left"
      />
      <DisplayCells
        label={schData.created_username}
        style="normal"
        right={1}
        bottom={schData.verified_date ? 1 : 0}
        align="left"
      />
      <DisplayCells
        label={moment(schData.created_date).format("DD-MM-YYYY LT")}
        style="normal"
        right={1}
        bottom={schData.verified_date ? 1 : 0}
        align="center"
      />
      <DisplayCells
        label={schData.requested_scholarship}
        style="normal"
        right={1}
        bottom={schData.verified_date ? 1 : 0}
        align="right"
      />
      <DisplayCells
        label={schData.requestedByRemarks}
        style="normal"
        right={0}
        bottom={schData.verified_date ? 1 : 0}
        align="left"
      />
    </DispayRow>
  );

  const VerifierRow = () => (
    <DispayRow>
      <DisplayCells
        label="Verifier"
        style="normal"
        right={1}
        bottom={schData.approved_date ? 1 : 0}
      />
      <DisplayCells
        label={schData.verifierName}
        style="normal"
        right={1}
        bottom={schData.approved_date ? 1 : 0}
        align="left"
      />
      <DisplayCells
        label={moment(schData.verified_date).format("DD-MM-YYYY LT")}
        style="normal"
        right={1}
        bottom={schData.approved_date ? 1 : 0}
        align="center"
      />
      <DisplayCells
        label={schData.verified_amount}
        style="normal"
        right={1}
        bottom={schData.approved_date ? 1 : 0}
        align="right"
      />
      <DisplayCells
        label={schData.verifier_remarks}
        style="normal"
        right={0}
        bottom={schData.approved_date ? 1 : 0}
        align="left"
      />
    </DispayRow>
  );

  const ApproverRow = () => (
    <DispayRow>
      <DisplayCells label="Approver" style="normal" right={1} bottom={0} />
      <DisplayCells
        label={schData.approversName}
        style="normal"
        right={1}
        bottom={0}
        align="left"
      />
      <DisplayCells
        label={moment(schData.approved_date).format("DD-MM-YYYY LT")}
        style="normal"
        right={1}
        bottom={0}
        align="center"
      />
      <DisplayCells
        label={schData.approved_amount}
        style="normal"
        right={1}
        bottom={0}
        align="right"
      />
      <DisplayCells
        label={schData.approversRemarks}
        style="normal"
        right={0}
        bottom={0}
        align="left"
      />
    </DispayRow>
  );

  const ApprovedData = () => (
    <View style={[styles.borderTable, styles.marginBottom]}>
      {schData.created_date && <DisplayTableheader />}
      {schData.created_date && <RequesterRow />}
      {schData.verified_date && <VerifierRow />}
      {schData.approved_date && <ApproverRow />}
    </View>
  );

  const ValidatorSignatureSection = () => (
    <>
      <View style={{ margin: "20px 0 10px 0" }}>
        <Image style={{ width: "100px" }} src={sign} />
      </View>
      <View style={{ margintTop: "15px", flexDirection: "row" }}>
        <Text>{schData.ipAddress}</Text>
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

  const DisplayDeclartion = () => (
    <>
      <DisplayHeaders label="DECLARATION FROM THE STUDENT" />
      <Text style={{ textAlign: "justify", marginTop: "10px" }}>
        Received with Thanks the granted Scholarship and I hereby declare that I
        will maintain my score above 80%, failing which I will refund whatever
        concession I have availed.
      </Text>
    </>
  );

  const PageData = () => (
    <View style={styles.pageLayout}>
      <Image style={styles.image} src={logos("./aisait.jpg")} />
      <View style={styles.layout}>
        <DisplayHeaders label="SCHOLARSHIP APPLICATION" />
        <DisplayDate />
        <StudentData />
        <ScholarshipData />
        <ApprovedData />
        {userId === 46 && <ValidatorSignatureSection />}
        <DisplayDeclartion />
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
