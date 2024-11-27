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
// import logo from "../../../assets/wmLogo.jpg";
import logo from "../../../assets/logo4.png";


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
    height:"40px",
    left:"10%"
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
        <View style={{display: "flex",flexDirection: "row",justifyContent: "center",alignItems: "center"}}>
          <View style={styles.image}>
            <Image style={{ width: "80px" }} src={logo} />
          </View>
          <Text
            style={{
              fontStyle: "bold",
              fontSize: "13px"
            }}
          >
            {(data.schoolName).toUpperCase()}
          </Text>
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop:"16px"
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
                {/* <Text style={styles.tableCellLabel}>Employee Name</Text> */}
                <Text style={styles.tableCellLabel}>EMPLOYEE NAME</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {(data?.employeeName)?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>Employee Code</Text> */}
                <Text style={styles.tableCellLabel}>EMPLOYEE CODE</Text>
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
                {/* <Text style={styles.tableCellLabel}>Date Of Joining</Text> */}
                <Text style={styles.tableCellLabel}>DATE OF JOINING</Text>
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
                {/* <Text style={styles.tableCellLabel}>Designation</Text> */}
                <Text style={styles.tableCellLabel}>DESIGNATION</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {(data?.designationName)?.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>Department</Text> */}
                <Text style={styles.tableCellLabel}>DEPARTMENT</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {(data?.departmentName)?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>UAN No.</Text> */}
                <Text style={styles.tableCellLabel}>UAN NO.</Text>
              </View>

              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.uan_no || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>Bank</Text> */}
                <Text style={styles.tableCellLabel}>BANK</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {(data?.bankName)?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>Account No.</Text> */}
                <Text style={styles.tableCellLabel}>ACCOUNT NO.</Text>
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
                {/* <Text style={styles.tableCellLabel}>EPF A/C No.</Text> */}
                <Text style={styles.tableCellLabel}>EPF A/C NO.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {data?.pf_no || "N/A"}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>ESIC No.</Text> */}
                <Text style={styles.tableCellLabel}>ESIC NO.</Text>
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
                {/* <Text style={styles.tableCellLabel}>PAN No.</Text> */}
                <Text style={styles.tableCellLabel}>PAN NO.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.pan_no || "N/A"}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>Pay Days</Text> */}
                <Text style={styles.tableCellLabel}>PAY DAYS</Text>
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
                <Text style={styles.tableCellLabel}>BASIC</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  {data.basic}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>PF</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  {data.pf}
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
                    textAlign:"right"
                  }}
                >
                  {data.da}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{!!data?.pt ? "PT" : !!data?.tds ? "TDS" : !!data?.esi ? "ESI":""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {!!data?.pt ? data.pt : !!data?.tds ? data?.tds : !!data?.esi ? data?.esi : ""}
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
                    textAlign:"right"
                  }}
                >
                  {data.hra}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{!!data?.pt && !!data?.tds && "TDS"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {!!data?.pt && !!data?.tds && data.tds}
                </Text>
              </View>
            </View>

            {(!!data?.ta && !!data?.fr && !!data?.cca || !!data?.pt && !!data?.tds && !!data?.esi) && <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{!!data?.ta ? "TA" : !!data?.fr ? "FR": !!data?.cca ? "CCA":""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  {!!data?.ta ? data.ta: !!data?.fr ? data.fr : !!data.cca ? data?.cca : ""}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{!!data?.pt && !!data?.tds && !!data?.esi && "ESI"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {!!data?.pt && !!data?.tds && !!data?.esi && data.esi}
                </Text>
              </View>
            </View>}

            {(!!data.fr || !!data?.advance) && <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{!!data?.ta ? "FR" : ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  {!!data?.ta && data.fr}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                {/* <Text style={styles.tableCellLabel}>Advance</Text> */}
                <Text style={styles.tableCellLabel}>{!!data?.pt && !!data?.tds && !!data?.esi && "ADVANCE"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {!!data?.pt && !!data?.tds && !!data?.esi && data.advance}
                </Text>
              </View>
            </View>}

            {(!!data?.cca && data.cca > 0 && data?.ta && data?.fr) && (
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
                      textAlign:"right"
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
                    <Text style={styles.tableCellLabel}>{(li.type).toUpperCase()}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text
                      style={{
                        ...styles.tableCell,
                        textAlign:"right"
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
              <View style={{...styles.tableColLabel,backgroundColor: "#cccaca"}}>
                <Text style={styles.tableCellLabel}>TOTAL</Text>
              </View>
              <View style={{...styles.tableCol,backgroundColor: "#cccaca"}}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  {data.earningTotal}
                </Text>
              </View>
              <View style={{...styles.tableColLabel,backgroundColor: "#cccaca"}}>
                <Text style={styles.tableCellLabel}>TOTAL</Text>
              </View>
              <View style={{...styles.tableCol,backgroundColor: "#cccaca"}}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
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
