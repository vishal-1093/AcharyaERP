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
    top: "210px",
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
          {data.schoolName}
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
                <Text style={styles.tableCellLabel}>Employee Name</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {data?.employeeName.charAt(0).toUpperCase() +
                    data?.employeeName.slice(1).toLowerCase()}
                </Text>
              </View>
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
                  N/A
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
                  {data?.pfAccountNo || "N/A"}
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
                  N/A
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
                  N/A
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
                  {`${data?.payDays}/${data.totalMonthDays}`}
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
                <Text style={styles.tableCellLabel}>
                  {!!data?.basic && data.basic > 0 && "BASIC"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {!!data?.basic && data.basic > 0 && data.basic}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {!!data?.pf && data.pf > 0 && "PF"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {!!data?.pf && data.pf > 0 && data.pf}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {!!data?.da && data.da > 0 && "DA"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {!!data?.da && data.da > 0 && data.da}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {!!data?.pt && data.pt > 0
                    ? "PT"
                    : !!data?.tds && data.tds > 0
                    ? "TDS"
                    : ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {!!data?.pt && data.pt > 0
                    ? data.pt
                    : !!data?.tds && data.tds > 0
                    ? data.tds
                    : null}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {!!data?.hra && data.hra > 0 && "HRA"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {!!data?.hra && data.hra > 0 && data.hra}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {!!data?.tds &&
                    data.tds > 0 &&
                    !!data?.pt &&
                    data.pt > 0 &&
                    "TDS"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {!!data?.tds &&
                    data.tds > 0 &&
                    !!data?.pt &&
                    data.pt > 0 &&
                    data.tds}
                </Text>
              </View>
            </View>

            {((!!data?.ta && data.ta > 0) || (!!data?.esi && data.esi > 0)) && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {!!data?.ta && data.ta > 0 && "TA"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                    }}
                  >
                    {!!data?.ta && data.ta > 0 && data.ta}
                  </Text>
                </View>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {!!data?.esi && data.esi > 0 && "ESI"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                    }}
                  >
                    {!!data?.esi && data.esi > 0 && data.esi}
                  </Text>
                </View>
              </View>
            )}

            {((!!data?.fr && data.fr > 0) ||
              (!!data?.advance && data.advance > 0)) && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {!!data?.fr && data.fr > 0 && "FR"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                    }}
                  >
                    {!!data?.fr && data.fr > 0 && data.fr}
                  </Text>
                </View>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {!!data?.advance && data.advance > 0 && "Advance"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                    }}
                  >
                    {!!data?.advance && data.advance > 0 && data.advance}
                  </Text>
                </View>
              </View>
            )}

            {!!data?.cca && data.cca > 0 && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {!!data?.cca && data.cca > 0 && "CCA"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                    }}
                  >
                    {!!data?.cca && data.cca > 0 && data.cca}
                  </Text>
                </View>
                <View style={styles.tableColLabel}></View>
                <View style={styles.tableCol}></View>
              </View>
            )}

            {data.invPayPaySlipDTOs?.length > 0 &&
              data.invPayPaySlipDTOs.map((li) => (
                <View style={styles.tableRow}>
                  <View style={styles.tableColLabel}>
                    <Text style={styles.tableCellLabel}>{li.type}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text
                      style={{
                        ...styles.tableCell,
                      }}
                    >
                      {li.invPay}
                    </Text>
                  </View>
                  <View style={styles.tableColLabel}></View>
                  <View style={styles.tableCol}></View>
                </View>
              ))}

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
                  {data.earningTotal}
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
                  {data.deductionTotal}
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
