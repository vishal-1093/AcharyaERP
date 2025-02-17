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
import logo from "../../../assets/logo4.png";
import {convertToWords} from 'react-number-to-words';

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
    height:"60px",
    left:"10%"
  },
  accImage: {
    position: "absolute",
    width: "100%",
    height:"100%",
    top:"65%",
    left:"198px"
  },
  layout: { margin: "100px 12px 25px 25px" },
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
  tableColEmpDetailLabel: {
    display: "flex",
    flex: 3,
    padding: "5px",
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
  tableColEmpDetail: {
    display: "flex",
    flex: 4,
    padding: "5px",
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
        <View style={{width:"100%", display: "flex", flexDirection: "row",justifyContent:"space-around", alignItems: "center" }}>
          <View style={styles.image}>
            <Image style={{ width: "80px" }} src={logo} />
          </View>
          <View style={{marginLeft:"40px"}}>
            <Text
              style={{
                fontStyle: "bold",
                fontSize: "13px",
                textAlign:"center"
              }}
            >
              {(data.schoolName)?.toUpperCase()}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: "5px",
                textAlign:"center"
              }}
            >
              Acharya Dr. S. Radhakrishnan Road, Soladevanahalli
              Bangalore-560107
            </Text>
          </View>
        </View>
        <View style={{ ...styles.tableSection, marginTop: "20px" }}>
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
                  Payslip for the month&nbsp;
                  {monthNames[data?.month] + ` ` + data?.year}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>EMPLOYEE NAME</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {(data?.employeeName)?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>EMPLOYEE CODE</Text>
              </View>

              <View style={styles.tableColEmpDetail}>
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
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>DATE OF JOINING</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {data?.dateOfJoining}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>DESIGNATION</Text>
              </View>

              <View style={styles.tableColEmpDetail}>
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
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>DEPARTMENT</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {(data?.departmentName)?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>UAN NO.</Text>
              </View>

              <View style={styles.tableColEmpDetail}>
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
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>BANK BRANCH </Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {(data?.bankName)?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>ACCOUNT NO.</Text>
              </View>

              <View style={styles.tableColEmpDetail}>
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
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>PAN NO.</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                {data?.pan_no || "N/A"}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>PAY DAYS</Text>
              </View>

              <View style={styles.tableColEmpDetail}>
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
                <Text style={styles.tableCellLabel}>{!!data?.pt ? "PT" : !!data?.esi ? "ESI" : ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {!!data?.pt ? data.pt : !!data?.esi ? data?.esi : ""}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{data.hra ? "HRA":""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                {!!data.hra ? data.hra : ""}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{!!data?.lic ? "LIC" : !!data?.tds ? "TDS": data.advance ? "ADVANCE":""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {!!data?.lic ? data?.lic : !!data?.tds ? data.tds: data.advance ? data.advance : ""}
                </Text>
              </View>
            </View>


            {!!data.cca && <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{data.cca ? "CCA":""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  {data.cca}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{data.lic && data.tds ? "TDS" : data.lic && data.tds&& data.advance ? "ADVANCE": ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {data.tds && data.lic ? data.tds : data.lic && data.tds && data.advance? data.advance: ""}
                </Text>
              </View>
            </View>}

            {!!data.ta && <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{data.ta ? "TA":""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  {data.ta || ""}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{data.lic && data.tds ? "TDS" : data.tds && data.advance ? "ADVANCE": ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right"
                  }}
                >
                  {data.lic && data.tds ? data.tds : (data.tds && data.advance) ? data.advance: ""}
                </Text>
              </View>
            </View>}

            { !!data?.spl1 && <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{data?.spl1 ? "SPL PAY" : ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                  { !!data.spl1 ? data.spl1: ""}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>{data.lic && data.tds && data.advance ? "ADVANCE" : ""}</Text>
              </View>
              <View style={styles.tableCol}>
              <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right"
                  }}
                >
                {data.lic && data.tds && data.advance ? data.advance:  ""}
                </Text>
              </View>
            </View>}

            {data.invPayPaySlipDTOs?.length > 0 &&
              data.invPayPaySlipDTOs.map((li) => (
                <View style={styles.tableRow}>
                  <View style={styles.tableColLabel}>
                    <Text style={styles.tableCellLabel}>{(li.type)?.toUpperCase()}</Text>
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
              <View style={{...styles.tableColLabel}}>
                <Text style={styles.tableCellLabel}>Total Earnings</Text>
              </View>
              <View style={{...styles.tableCol}}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right",
                    ...styles.boldText
                  }}
                >
                  {data.earningTotal}
                </Text>
              </View>
              <View style={{...styles.tableColLabel}}>
                <Text style={styles.tableCellLabel}>Total Deductions</Text>
              </View>
              <View style={{...styles.tableCol}}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right",
                     ...styles.boldText
                  }}
                >
                  {data.deductionTotal}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{...styles.tableColLabel}}>
                <Text style={styles.tableCellLabel}>CTC</Text>
              </View>
              <View style={{...styles.tableCol}}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign:"right",
                    ...styles.boldText
                  }}
                >
                  {data.employeeCTC}
                </Text>
              </View>
              <View style={{...styles.tableColLabel}}>
                <Text style={styles.tableCellLabel}>Net Salary</Text>
              </View>
              <View style={{...styles.tableCol}}>
                <Text
                  style={{
                    ...styles.tableCell,
                     textAlign:"right",
                     ...styles.boldText
                  }}
                >
                  {data.netPay}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View
                style={{
                  ...styles.tableColGrossLabel,
                  padding:"7px"
                }}
              >
                <Text
                  style={{
                    fontSize: "9px",
                    color:"#5d5e5e"
                  }}
                >
                <Text>{`Net Pay ${convertToWords(data.netPay)} rupees only.`}</Text>
                </Text>

                <Text
                  style={{
                    fontSize: "9px",
                    color:"#5d5e5e",
                    marginTop:"5px"
                  }}
                >
                <Text>* This document has been automatically generated by Acharya Payroll; therefore, no signature is required.</Text> 
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
          <Page size="A4" style={{...styles.body}}>
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
