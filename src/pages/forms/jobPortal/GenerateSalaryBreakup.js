import {
  Document,
  Font,
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
    margin: 30,
    fontFamily: "Roboto",
    fontSize: "10px",
  },

  header: {
    fontStyle: "bold",
    textAlign: "center",
    padding: "3px",
  },

  headerLeft: {
    fontStyle: "bold",
    padding: "3px",
  },

  containerBorder: { border: "1px solid black" },

  border: { borderBottom: "1px solid black" },

  tableHeaderStart: {
    borderRight: "1px solid black",
    width: "33%",
    fontStyle: "bold",
    textAlign: "center",
    padding: "3px",
  },

  tableHeaderEnd: {
    width: "33%",
    fontStyle: "bold",
    textAlign: "center",
    padding: "3px",
  },

  flex: {
    borderBottom: "1px solid black",
    display: "flex",
    flexDirection: "row",
  },

  tableBodyStart: {
    borderRight: "1px solid black",
    width: "33%",
    fontStyle: "normal",
    padding: "3px",
  },

  tableBodyEnd: {
    width: "33%",
    fontStyle: "normal",
    padding: "3px",
  },

  tableBodyRightStart: {
    borderRight: "1px solid black",
    width: "33%",
    fontStyle: "normal",
    textAlign: "right",
    padding: "3px",
  },

  tableBodyRightEnd: {
    width: "33%",
    fontStyle: "normal",
    textAlign: "right",
    padding: "3px",
  },

  tableBodyBold: {
    borderRight: "1px solid black",
    width: "33%",
    fontStyle: "bold",
    padding: "3px",
  },

  tableBodyStartBold: {
    borderRight: "1px solid black",
    width: "33%",
    fontStyle: "bold",
    textAlign: "right",
    padding: "3px",
  },

  tableBodyEndBold: {
    width: "33%",
    fontStyle: "bold",
    textAlign: "right",
    padding: "3px",
  },
});

export const GenerateSalaryBreakup = (offerData, salaryData) => {
  const signatures = [
    "New Recruit",
    "Executive-HR",
    "Head-HR",
    "Managing Director",
  ];

  const Content = () => {
    return (
      <View style={styles.containerBorder}>
        <View style={styles.border}>
          <Text style={styles.header}>ANNEXURE - 1</Text>
        </View>

        <View style={styles.border}>
          <Text style={styles.header}>{offerData.school_name}</Text>
        </View>

        <View style={{ borderBottom: "1px solid black", textAlign: "center" }}>
          <Text style={{ fontStyle: "normal", padding: "3px" }}>
            Salary Breakup Details for&nbsp;
            <Text
              style={{
                fontStyle: "bold",
                display: "inline",
              }}
            >
              {offerData.firstname}
            </Text>
          </Text>
        </View>

        <View style={styles.flex}>
          <Text
            style={{
              borderRight: "1px solid black",
              width: "50%",
              padding: "3px",
            }}
          >
            Department : {offerData.dept_name}
          </Text>
          <Text style={{ width: "50%", padding: "3px" }}>
            Designation : {offerData.designation}
          </Text>
        </View>

        <View style={styles.border}>
          <Text style={{ padding: "3px" }}>
            Pay Scale &emsp;: {offerData.salary_structure}
          </Text>
        </View>

        <View style={styles.border}>
          <Text style={styles.headerLeft}>Earnings</Text>
        </View>

        <View style={styles.flex}>
          <Text style={styles.tableHeaderStart}></Text>
          <Text style={styles.tableHeaderStart}>Monthly</Text>
          <Text style={styles.tableHeaderEnd}>Yearly</Text>
        </View>

        {salaryData.earnings.map((obj, i) => {
          return (
            <View style={styles.flex} key={i}>
              <Text style={styles.tableBodyStart}>{obj.name}</Text>
              <Text style={styles.tableBodyRightStart}>{obj.monthly}</Text>
              <Text style={styles.tableBodyRightEnd}>{obj.yearly}</Text>
            </View>
          );
        })}

        <View style={styles.flex}>
          <Text style={styles.tableBodyBold}>Gross Salary ( A )</Text>
          <Text style={styles.tableBodyStartBold}>
            {salaryData.earningsMonthly}
          </Text>
          <Text style={styles.tableBodyEndBold}>
            {salaryData.earningsYearly}
          </Text>
        </View>

        <View style={styles.border}>
          <Text style={styles.headerLeft}>
            Deductions - Employee Contribution
          </Text>
        </View>

        {salaryData.deductions.map((obj, i) => {
          return (
            <View style={styles.flex} key={i}>
              <Text style={styles.tableBodyStart}>{obj.name}</Text>
              <Text style={styles.tableBodyRightStart}>{obj.monthly}</Text>
              <Text style={styles.tableBodyRightEnd}>{obj.yearly}</Text>
            </View>
          );
        })}

        <View style={styles.flex}>
          <Text style={styles.tableBodyBold}>Total Deductions ( B )</Text>
          <Text style={styles.tableBodyStartBold}>
            {salaryData.deductionsMonthly}
          </Text>
          <Text style={styles.tableBodyEndBold}>
            {salaryData.deductionsYearly}
          </Text>
        </View>

        <View style={styles.flex}>
          <Text style={styles.tableBodyBold}>Net Salary ( C ) = ( A - B )</Text>
          <Text style={styles.tableBodyStartBold}>{salaryData.netMonthly}</Text>
          <Text style={styles.tableBodyEndBold}>{salaryData.netYearly}</Text>
        </View>

        <View style={styles.border}>
          <Text style={styles.headerLeft}>Employer Contribution</Text>
        </View>

        {salaryData.managment.map((obj, i) => {
          return (
            <View style={styles.flex} key={i}>
              <Text style={styles.tableBodyStart}>{obj.name}</Text>
              <Text style={styles.tableBodyRightStart}>{obj.monthly}</Text>
              <Text style={styles.tableBodyRightEnd}>{obj.yearly}</Text>
            </View>
          );
        })}

        <View style={styles.flex}>
          <Text style={styles.tableBodyBold}>
            Institutional Contribution ( D )
          </Text>
          <Text style={styles.tableBodyStartBold}>
            {salaryData.managmentMonthly}
          </Text>
          <Text style={styles.tableBodyEndBold}>
            {salaryData.managmentYearly}
          </Text>
        </View>

        <View style={styles.flex}>
          <Text style={styles.tableBodyBold}>
            Cost to Institution ( E ) = ( A + D )
          </Text>
          <Text style={styles.tableBodyStartBold}>{salaryData.ctcMonthly}</Text>
          <Text style={styles.tableBodyEndBold}>{salaryData.ctcYearly}</Text>
        </View>

        <View style={styles.border}>
          <Text
            style={{
              fontStyle: "normal",
              marginBottom: "40px",
              padding: "5px",
            }}
          >
            Acceptance Acknowledgment from New Recruit
          </Text>
          <Text
            style={{
              fontStyle: "normal",
              marginBottom: "20px",
              padding: "5px",
            }}
          >
            Signature :
          </Text>
          <Text
            style={{
              fontStyle: "normal",
              marginBottom: "20px",
              padding: "5px",
            }}
          >
            Date :
          </Text>
        </View>

        <View style={styles.border}>
          <Text style={{ fontStyle: "normal", padding: "10px 5px 10px 5px" }}>
            This document is only for Acharya Institutes HR Team reference. Any
            person or entity apart from Acharya Institutes HR Team is prohibited
            from having this document
          </Text>
        </View>

        <View style={styles.border}>
          <Text
            style={{
              fontStyle: "normal",
              marginBottom: "60px",
              padding: "5px",
            }}
          >
            Remarks specific to New Recruit(If Any):
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontStyle: "normal",
              marginBottom: "60px",
              padding: "5px",
            }}
          >
            Authorised Signatory :
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row" }}>
          {signatures.map((obj, i) => {
            return (
              <Text
                key={i}
                style={{ width: "25%", textAlign: "center", padding: "5px" }}
              >
                {obj}
              </Text>
            );
          })}
        </View>
      </View>
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Salary Breakup">
          <Page size="A4">
            <View style={styles.pageLayout}>
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
