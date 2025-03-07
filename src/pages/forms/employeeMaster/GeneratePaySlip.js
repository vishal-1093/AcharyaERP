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
import { convertToWords } from "react-number-to-words";

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
    padding: 0
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
    fontSize: "12px",
  },
  image: {
    width: "80px",
    height: "60px",
    marginLeft:"40px"
  },
  accImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "65%",
    left: "198px",
  },
  layout: { margin: "100px 20px 25px 25px" },
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
  
  const getCapitilize = (text) => {
    return text?.toLowerCase().split(" ").map((t)=>t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
  };

  const Content = () => {
    return (
      <View style={styles.layout}>
        <View
          style={{
            width: "90%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            gap:"10px"
          }}
        >
          <Image style={styles.image} src={logo} />
          <View>
            <Text
              style={{
                fontStyle: "bold",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              {data.schoolName?.toUpperCase()}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: "5px",
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
                <Text style={styles.tableCellLabel}>Emp Name</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {getCapitilize(data?.employeeName)}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>Emp Code</Text>
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
                <Text style={styles.tableCellLabel}>Designation</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {data?.designationName}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>Date Of Joining</Text>
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
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>Department</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {data?.departmentName}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>Uan No.</Text>
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
                <Text style={styles.tableCellLabel}>Bank Branch</Text>
              </View>
              <View style={styles.tableColEmpDetail}>
                <Text
                  style={{
                    ...styles.tableCell,
                  }}
                >
                  {getCapitilize(data?.bankName)}
                </Text>
              </View>
              <View style={styles.tableColEmpDetailLabel}>
                <Text style={styles.tableCellLabel}>Salary Account no.</Text>
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
                <Text style={styles.tableCellLabel}>Pan No.</Text>
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
                <Text style={styles.tableCellLabel}>Pay Days</Text>
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
                <Text style={styles.tableCellLabel}>Basic</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                  }}
                >
                  {data.basic}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Pf</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                  }}
                >
                  {data.pf}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Da</Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                  }}
                >
                  {data.da}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {!!data?.pt ? "Pt" : !!data?.esi ? "Esi" : ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                  }}
                >
                  {!!data?.pt ? data.pt : !!data?.esi ? data?.esi : ""}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {data.hra ? "Hra" : ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                  }}
                >
                  {!!data.hra ? data.hra : ""}
                </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>
                  {!!data?.lic
                    ? "Lic"
                    : !!data?.tds
                    ? "Tds"
                    : data.advance
                    ? "Advance"
                    : ""}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                  }}
                >
                  {!!data?.lic
                    ? data?.lic
                    : !!data?.tds
                    ? data.tds
                    : data.advance
                    ? data.advance
                    : ""}
                </Text>
              </View>
            </View>

            {!!data.cca && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {data.cca ? "Cca" : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                      textAlign: "right",
                    }}
                  >
                    {data.cca}
                  </Text>
                </View>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {data.lic && data.tds
                      ? "Tds"
                      : data.lic && data.tds && data.advance
                      ? "Advance"
                      : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                      textAlign: "right",
                    }}
                  >
                    {data.tds && data.lic
                      ? data.tds
                      : data.lic && data.tds && data.advance
                      ? data.advance
                      : ""}
                  </Text>
                </View>
              </View>
            )}

            {!!data.ta && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {data.ta ? "Ta" : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                      textAlign: "right",
                    }}
                  >
                    {data.ta || ""}
                  </Text>
                </View>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {data.lic && data.tds
                      ? "Tds"
                      : data.tds && data.advance
                      ? "Advance"
                      : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                      textAlign: "right",
                    }}
                  >
                    {data.lic && data.tds
                      ? data.tds
                      : data.tds && data.advance
                      ? data.advance
                      : ""}
                  </Text>
                </View>
              </View>
            )}

            {!!data?.spl1 && (
              <View style={styles.tableRow}>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {data?.spl1 ? "Spl Pay" : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text
                    style={{
                      ...styles.tableCell,
                      textAlign: "right",
                    }}
                  >
                    {!!data.spl1 ? data.spl1 : ""}
                  </Text>
                </View>
                <View style={styles.tableColLabel}>
                  <Text style={styles.tableCellLabel}>
                    {data.lic && data.tds && data.advance ? "Advance" : ""} 
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text 
                    style={{
                      ...styles.tableCell,
                      textAlign: "right",
                    }}
                  >
                    {data.lic && data.tds && data.advance ? data.advance : ""}
                  </Text>
                </View>
              </View>
            )}

            {data.invPayPaySlipDTOs?.length > 0 &&
              data.invPayPaySlipDTOs.map((li,index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableColLabel}>
                    <Text style={styles.tableCellLabel}>
                      {getCapitilize(li.type)}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text
                      style={{
                        ...styles.tableCell,
                        textAlign: "right",
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
              <View style={{ ...styles.tableColLabel }}>
                <Text style={styles.tableCellLabel}>Total Earnings</Text>
              </View>
              <View style={{ ...styles.tableCol }}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                    ...styles.boldText,
                  }}
                >
                  {data.earningTotal}
                </Text>
              </View>
              <View style={{ ...styles.tableColLabel }}>
                <Text style={styles.tableCellLabel}>Total Deductions</Text>
              </View>
              <View style={{ ...styles.tableCol }}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                    ...styles.boldText,
                  }}
                >
                  {data.deductionTotal}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableColLabel }}>
                <Text style={styles.tableCellLabel}>CTC</Text>
              </View>
              <View style={{ ...styles.tableCol }}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                    ...styles.boldText,
                  }}
                >
                  {data.employeeCTC}
                </Text>
              </View>
              <View style={{ ...styles.tableColLabel }}>
                <Text style={styles.tableCellLabel}>Net Salary</Text>
              </View>
              <View style={{ ...styles.tableCol }}>
                <Text
                  style={{
                    ...styles.tableCell,
                    textAlign: "right",
                    ...styles.boldText,
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
                  padding: "7px",
                }}
              >
                <Text
                  style={{
                    fontSize: "9px",
                    color: "#5d5e5e",
                  }}
                >
                  <Text>{`Net Pay ${convertToWords(
                    data.netPay
                  )} rupees only.`}</Text>
                </Text>

                <Text
                  style={{
                    fontSize: "9px",
                    color: "#5d5e5e",
                    marginTop: "5px",
                  }}
                >
                  <Text>
                    * This document has been automatically generated by Acharya
                    ERP Payroll and does not require a signature. All
                    information contained herein is confidential and intended
                    solely for the recipient.
                  </Text>
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
          <Page size="A4" style={{ ...styles.body }}>
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