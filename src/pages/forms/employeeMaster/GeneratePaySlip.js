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
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "Times-Roman",
  },
  boldText: {
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Times-Bold",
  },
  header: {
    textAlign: "center",
    fontSize: "9px",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    backgroundColor: "#cccaca",
    padding: "6px 0px 5px 0px",
  },
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
  tableSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColLabel: {
    display: "flex",
    flex: 3,
    padding: "8px",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableColGrossLabel: {
    display: "flex",
    flex: 3,
    padding: "5px",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableCol: {
    display: "flex",
    flex: 4,
    padding: "8px",
    wordWrap: "break-all",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableCellLabel: {
    fontSize: 10,
    textAlign: "left",
    fontFamily: "Times-Roman",
  },
  tableCell: {
    fontSize: 10,
    wordWrap: "break-word",
    textAlign: "left",
    paddingLeft: "6px",
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
          Acharya University
        </Text>
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Acharya Dr. S. Radhakrishnan Road Acharya P.O Soladevanahalli
          Bangalore-560107 Karnataka, India
        </Text>

        <View style={{ ...styles.tableSection, marginTop: "10px" }}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableColGrossLabel,
                  backgroundColor: "#cccaca",
                }}
              >
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                  }}
                >
                  Payslip For The Month&nbsp;
                  {monthNames[data?.month] + ` - ` + data?.year}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Employee Code</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.empCode}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Employee Name</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.employeeName}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Date Of Joining</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.dateOfJoining}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Designation</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.designationName}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Department</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.departmentName}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>UAN No.</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Bank</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.bankName}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Account No.</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.accountNo}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>EPF A/C No.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.pf_account_no}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>ESIC No.</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>PAN No.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Pay Days</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.payDays}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableColGrossLabel,
                  backgroundColor: "#cccaca",
                }}
              >
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                  }}
                >
                  EARNING
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableColGrossLabel,
                  backgroundColor: "#cccaca",
                }}
              >
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                  }}
                >
                  DEDUCTION
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>BASIC</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.basic}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>PF</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.pf}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>DA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.da}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>PT</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.pt}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>HRA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
               {data?.hra}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>TDS</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>TA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>ESI</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>CEA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>LIC (SSS)</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>FR</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.fr}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Transport</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>CHA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Advance</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.advance}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>CCA</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}></View>
              <View style={styles.tableCol}></View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>ER</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.er}
                </Text>
              </View>
              <View style={styles.tableColLabel}></View>
              <View style={styles.tableCol}></View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>OTHER</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}></View>
              <View style={styles.tableCol}></View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>MR</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}></View>
              <View style={styles.tableCol}></View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>SPL ALL</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                </Text>
              </View>
              <View style={styles.tableColLabel}></View>
              <View style={styles.tableCol}></View>
            </View>

            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableColGrossLabel,
                  backgroundColor: "#cccaca",
                }}
              >
                <Text style={{ ...styles.tableCellLabel, textAlign: "center" }}>
                  TOTAL
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableColGrossLabel,
                  backgroundColor: "#cccaca",
                }}
              >
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                  }}
                >
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableColGrossLabel,
                  backgroundColor: "#cccaca",
                }}
              >
                <Text style={{ ...styles.tableCellLabel, textAlign: "center" }}>
                  TOTAL
                </Text>
              </View>

              <View
                style={{
                  ...styles.tableColGrossLabel,
                  backgroundColor: "#cccaca",
                }}
              >
                <Text
                  style={{
                    fontSize: "9px",
                    textAlign: "center",
                  }}
                >
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Pay Slip">
          <Page size="A4" style={styles.body}>
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
