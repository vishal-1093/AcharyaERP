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
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  pageLayout: {
    fontFamily: "Roboto",
    fontSize: "9px",
  },

  layout: { margin: "10px 25px 20px 25px" },

  row: { display: "flex", flexDirection: "row" },

  cell: {
    width: "30%",
    padding: "5px",
  },

  cells: {
    width: "70%",
    padding: "5px",
  },

  credCell: {
    width: "30%",
    padding: "5px",
  },

  credCells: {
    width: "70%",
    padding: "5px",
  },

  borderBtm: { borderBottomWidth: 1 },

  borderRt: { borderRightWidth: 1 },

  tableHeader: { fontStyle: "bold", alignItems: "center" },

  textCenter: { textAlign: "center" },

  fontBold: { fontStyle: "bold" },
});

export const GenerateProvisionalCertificate = (data) => {
  const Content = () => {
    return (
      <View style={styles.layout}>
        <View style={{ marginBottom: "5px" }}>
          <Text
            style={{
              textAlign: "right",
            }}
          >
            {moment(data?.date_of_admission).format("DD-MM-YYYY")}
          </Text>
        </View>

        <View style={{ marginBottom: "25px" }}>
          <Text style={{ fontStyle: "normal" }}>
            Congratulations&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
              }}
            >
              {data.student_name}&nbsp;!!
            </Text>
          </Text>
        </View>

        <View style={{ marginBottom: "10px" }}>
          <Text>
            This is to certify that your Provisional Admission is complete,
            please find the details below:
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            width: "80%",
            marginBottom: "10px",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 5px auto",
          }}
        >
          <View style={[styles.row, styles.borderBtm]}>
            <Text style={[styles.cell, styles.fontBold, styles.borderRt]}>
              Course
            </Text>
            <Text style={styles.cells}>{data.program_name}</Text>
          </View>

          <View style={[styles.row, styles.borderBtm]}>
            <Text style={[styles.cell, styles.fontBold, styles.borderRt]}>
              Specialisation
            </Text>
            <Text style={styles.cells}>{data.program_specialization_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.fontBold, styles.borderRt]}>
              Academic Year
            </Text>
            <Text style={styles.cells}>{data.ac_year}</Text>
          </View>
        </View>

        <View style={{ marginBottom: "9px" }}>
          <Text
            style={{
              fontStyle: "normal",
              textAlign: "justify",
              lineHeight: 1.3,
            }}
          >
            Your Acharya Unique Identification(AUID) is&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
              }}
            >
              {data.auid}
            </Text>
            .&nbsp;Kindly quote the AUID in all your communication and
            transaction with the college.
          </Text>
        </View>

        <View style={{ marginBottom: "10px" }}>
          <Text style={{ textAlign: "justify", lineHeight: 1.3 }}>
            All the students of Acharya have their own email provided by the
            college, the same has to be used to receive information and
            communicate with the college. You may now access your Acharya Email
            Id by using the URL gmail.com and using the following credentials to
            Login. The email shall be active within 2 working days from the date
            of Admission.
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            width: "80%",
            marginBottom: "10px",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 5px auto",
          }}
        >
          <View style={[styles.row, styles.borderBtm]}>
            <Text style={[styles.credCell, styles.fontBold, styles.borderRt]}>
              Email ID
            </Text>
            <Text style={styles.credCells}>{data.acharya_email}</Text>
          </View>

          <View style={[styles.row, styles.borderBtm]}>
            <Text style={[styles.credCell, styles.fontBold, styles.borderRt]}>
              ERP User ID
            </Text>
            <Text style={styles.credCells}>{data.auid}</Text>
          </View>

          <View style={[styles.row]}>
            <Text style={[styles.credCell, styles.fontBold, styles.borderRt]}>
              Passsword for Email and ERP Login
            </Text>
            <Text style={styles.credCells}>
              acharya1234 (this is a temporary password and needs to be reset on
              login)
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: "12px" }}>
          <Text style={{ textAlign: "justify", lineHeight: 1.3 }}>
            The ERP provides you access to your programme details, information
            on your teachers, timetable, attendance, pay fee and most
            importantly connect with your Proctor. The information may be
            accessed on a web browser or by using the ERP App on your mobile
            phone. You may download the app using the QR codes below. The portal
            allows multiple logins, allowing parents to use the same to be
            updated on their ward’s academic progress.
          </Text>
        </View>

        <View style={{ marginBottom: "12px" }}>
          <Text style={{ textAlign: "justify", lineHeight: 1.3 }}>
            Please note that the given fee is applicable only for the prescribed
            Academic Batch. Admission shall be ratified only after the
            submission of all original documents for verification and payment of
            all the fee for the semester/year as prescribed in the letter of
            offer. Failure to do so shall result in the withdrawal of the Offer
            of Admission.
          </Text>
        </View>

        <View style={{ marginBottom: "10px" }}>
          <Text style={{ textAlign: "justify", lineHeight: 1.3 }}>
            Please feel free to call or write to us if you need any further
            information. Ms.{data.CounselorName} is your counsellor and would be
            happy to assist you.
          </Text>
        </View>
      </View>
    );
  };

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
                <Image
                  style={{
                    width: "100%",
                  }}
                  src={headerFooter}
                />
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
