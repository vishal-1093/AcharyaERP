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
import logo from "../../../assets/wmLogo.jpg";
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
    fontSize: "10px",
  },

  image: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    top: "160px",
    left: "38%",
  },

  layout: { margin: "20px 25px 20px 25px" },

  flex: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px",
  },

  row: { display: "flex", flexDirection: "row" },

  cell: {
    // flexGrow: 1,
    width: "25%",
    padding: "2px",
  },

  borderBtm: { borderBottomWidth: 1 },
  borderRt: { borderRightWidth: 1 },

  tableHeader: { fontStyle: "bold", alignItems: "center" },

  textCenter: { textAlign: "center" },
});

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const GenerateTranscriptPdf = (studetData, transcriptsData) => {
  const Content = () => {
    return (
      <View style={styles.layout}>
        <Text
          style={{
            fontStyle: "bold",
            fontSize: "16px",
            padding: "3px",
            textAlign: "center",
          }}
        >
          Acharya Univeristy
        </Text>
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Acharya Dr. S. Radhakrishnan Road Acharya P.O Soladevanahalli
          Bangalore-560107 Karnataka, India
        </Text>

        <Text
          style={{
            fontStyle: "bold",
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          DETAILS OF THE TESTIMONIALS RECEIVED
        </Text>

        <View style={{ borderWidth: 1, padding: "4px" }}>
          <View style={styles.flex}>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                Student Name
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>{studetData.student_name}</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                AUID
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>{studetData.auid}</Text>
            </View>
          </View>

          <View style={styles.flex}>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                DOB
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>{studetData.dateofbirth}</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                Gender
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>{studetData.candidate_sex}</Text>
            </View>
          </View>

          <View style={styles.flex}>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                Father Name
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>{studetData.father_name}</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                Ac Year
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>{studetData.ac_year}</Text>
            </View>
          </View>

          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                Program
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>
                {studetData.program_name +
                  " - " +
                  studetData.program_specialization_short_name}
              </Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  fontStyle: "bold",
                }}
              >
                Admission Category
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text>{studetData.fee_admission_category_type}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: "20px", borderWidth: 1 }}>
          <View style={[styles.row, styles.borderBtm]}>
            <Text
              style={[
                styles.cell,
                styles.borderRt,
                styles.tableHeader,
                styles.textCenter,
              ]}
            >
              Transcript
            </Text>
            <Text
              style={[
                styles.cell,
                styles.borderRt,
                styles.tableHeader,
                styles.textCenter,
              ]}
            >
              Date of Submission
            </Text>
            <Text
              style={[
                styles.cell,
                styles.borderRt,
                styles.tableHeader,
                styles.textCenter,
              ]}
            >
              Last Date of Submission
            </Text>
            <Text style={[styles.cell, styles.tableHeader, styles.textCenter]}>
              Collected By
            </Text>
          </View>

          {transcriptsData?.map((obj, i) => {
            return (
              <View style={styles.row} key={i}>
                <Text style={[styles.cell, styles.borderRt]}>
                  {obj.transcript}
                </Text>
                <Text style={[styles.cell, styles.borderRt, styles.textCenter]}>
                  {moment(obj.submitted_date).format("DD-MM-YYYY")}
                </Text>
                <Text style={[styles.cell, styles.borderRt, styles.textCenter]}>
                  {obj.will_submit_by
                    ? moment(obj.will_submit_by).format("DD-MM-YYYY")
                    : ""}
                </Text>
                <Text style={[styles.cell, styles.textCenter]}>
                  {obj.created_username}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ marginTop: "60px" }}>
          <View style={styles.row}>
            <Text style={{ width: "50%", fontStyle: "bold" }}>
              Signature of the Candidate
            </Text>
            <Text
              style={{ width: "50%", textAlign: "right", fontStyle: "bold" }}
            >
              Signature of the Counselor
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Document Collection">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View style={styles.image}>
                <Image style={{ width: "150px" }} src={logo} />
              </View>
              <Content />
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
