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

export const GeneratePaySlip = (data) => {
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
          Payslip For The Month&nbsp;
          {monthNames[data.month] + ` - ` + data.year}
        </Text>

        <View style={styles.flex}>
          <View style={{ width: "20%" }}>
            <Text
              style={{
                fontStyle: "bold",
              }}
            >
              Employee Code
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text>{data.empCode}</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text
              style={{
                fontStyle: "bold",
              }}
            >
              DOJ
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text>{moment(data.dateOfJoining).format("DD-MM-YYYY")}</Text>
          </View>
        </View>

        <View style={styles.flex}>
          <View style={{ width: "20%" }}>
            <Text
              style={{
                fontStyle: "bold",
              }}
            >
              Employee Name
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text>{data.employeeName}</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text
              style={{
                fontStyle: "bold",
              }}
            >
              Designation
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text>{data.designationName}</Text>
          </View>
        </View>

        <View style={styles.flex}>
          <View style={{ width: "20%" }}>
            <Text
              style={{
                fontStyle: "bold",
              }}
            >
              Pay Days
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text>{data.payDays}</Text>
          </View>
        </View>
      </View>
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Pay Slip">
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
