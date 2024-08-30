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
import LetterheadImage from "../../../assets/aisait.jpg";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
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

const getSchoolTemplate = (studentDetail) => {
  try {
    if (!studentDetail || !studentDetail.school_name_short) {
      throw new Error("schoolShortName is not defined");
    }
    return require(`../../../assets/${studentDetail?.org_type?.toLowerCase()}${studentDetail?.school_name_short?.toLowerCase()}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      studentDetail?.school_name_short,
      "Error:",
      error.message
    );
    return LetterheadImage;
  }
};

const styles = StyleSheet.create({
  body: {
    margin: 0,
    display:"flex",
    flex:1,
    fontFamily: "Times-Roman",
  },
  boldText: {
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Roboto",
  },
  image: { position: "absolute", width: "99%" },

  headerSectionOnLetterHead: {
    width: "100%",
    padding: "0 60px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "150px",
  },

  headerSection: {
    width: "100%",
    padding: "0 60px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "50px",
  },
  headerText: {
    textAlign: "center",
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  concernSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  concernText: {
    fontWeight: "heavy",
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginLeft: "20px",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderBottomStyle: "solid",
  },
  studentDetailSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    lineHeight: 1.5,
  },
  feeDetailSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  authorSection: {
    marginTop: "50px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  studentDetailText: {
    width: "65%",
    fontSize: 11,
    textAlign: "justify",
    margin: "0 auto",
  },
  feeDetailText: {
    width: "65%",
    fontSize: 11,
    textAlign: "justify",
    margin: "0 auto",
  },
  feeTemplateSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  amtText: {
    marginTop: "10px",
    fontSize: 9,
    textAlign: "right",
    paddingRight: "40px",
    position: "relative",
    right: 20,
  },
  table: {
    display: "table",
    width: "80%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  particularTableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  particularTableHeaderCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  tableCellHeader: {
    padding: 5,
    fontWeight: "heavy",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto",
    textTransform: "capitalize",
  },
  particularTableCellHeader: {
    padding: 5,
    fontWeight: "heavy",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    wordWrap: "break-word",
    maxWidth: "100%",
    textAlign: "left",
  },
  tableAmountCell: {
    margin: 5,
    fontSize: 10,
    textAlign: "right",
  },
});

export const GenerateBonafide = (
  studentBonafideDetail,
  studentDetail,
  semesterHeaderList,
  bonafideAddOnDetail,
  addOnSemesterHeaderList,
  letterHeadPrintOrNot
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document>
          return (
          {studentBonafideDetail[0]?.bonafide_type ==
            "Provisional Bonafide" && (
            <Page wrap={false} size="a4" style={styles.body}>
              {!letterHeadPrintOrNot && (
                <Image
                  style={styles.image}
                  src={getSchoolTemplate(studentDetail)}
                />
              )}
              <View
                style={
                  !letterHeadPrintOrNot
                    ? styles.headerSectionOnLetterHead
                    : styles.headerSection
                }
              >
                <Text
                  style={{...styles.headerText,...styles.boldText}}
                >{`Ref: ${studentBonafideDetail[0]?.bonafide_number}`}</Text>
                <Text style={{...styles.headerText,...styles.boldText}}>{`Date: ${moment(
                  studentBonafideDetail[0]?.created_Date
                ).format("DD/MM/YYYY")}`}</Text>
              </View>
              <View style={styles.concernSection}>
                <Text style={styles.concernText}>
                  TO WHOMSOEVER IT MAY CONCERN
                </Text>
              </View>
              <View style={styles.studentDetailSection}>
                <Text style={styles.studentDetailText}>
                  This is to certify that{" "}
                  <Text style={styles.boldText}>
                    {studentDetail?.candidate_sex == "Female" ? "Ms." : "Mr."}
                  </Text>{" "}
                  <Text style={styles.boldText}>
                    {(studentDetail?.student_name).toUpperCase() || "-"},
                  </Text>{" "}
                  <Text style={styles.boldText}>
                    {studentDetail?.candidate_sex == "Female" ? "D/o." : "S/o."}
                  </Text>{" "}
                  <Text style={styles.boldText}>
                    {(studentDetail?.father_name).toUpperCase() || "-"},
                  </Text>{" "}
                  AUID No.
                  <Text style={styles.boldText}>
                    {studentDetail?.auid || "-"}
                  </Text>{" "}
                  is provisionally admitted to{" "}
                  <Text style={styles.boldText}>
                    {studentDetail?.school_name}
                  </Text>{" "}
                  in{" "}
                  <Text style={styles.boldText}>
                    {((studentDetail?.program_short_name).toUpperCase() ||
                      "-") +
                      "-" +
                      ((studentDetail?.program_specialization_name).toUpperCase() ||
                        "-")}
                  </Text>
                  (course) on merit basis after undergoing the selection
                  procedure laid down by Acharya Institutes for the Academic
                  year{" "}
                  <Text style={styles.boldText}>{studentDetail?.ac_year}</Text>,
                  subject to fulfilling the eligibility conditions prescribed by
                  the affiliating University. The fee payable during the
                  Academic Batch{" "}
                  <Text style={styles.boldText}>
                    {studentDetail?.academic_batch}
                  </Text>{" "}
                  is given below.
                </Text>
              </View>
              <View>
                <Text style={styles.amtText}>{`(Amount in ${
                  studentBonafideDetail[0]?.currency_type_name == "INR"
                    ? "Rupees"
                    : "USD"
                })`}</Text>
              </View>
              <View style={styles.feeTemplateSection}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.particularTableHeaderCol}>
                      <Text style={styles.particularTableCellHeader}>
                        Particulars
                      </Text>
                    </View>
                    {semesterHeaderList.length > 0 &&
                      semesterHeaderList.map((obj, index) => (
                        <View style={styles.tableHeaderCol}>
                          <Text style={styles.tableCellHeader}>{obj}</Text>
                        </View>
                      ))}
                  </View>
                  {studentBonafideDetail.length > 0 &&
                    studentBonafideDetail[0]?.acerpAmount.map((obj, index) => (
                      <View style={styles.tableRow}>
                        <View style={styles.particularTableCol}>
                          <Text style={styles.tableCell}>{obj.particular}</Text>
                        </View>
                        {semesterHeaderList.length > 0 &&
                          semesterHeaderList.map((list, i) => (
                            <View style={styles.tableCol}>
                              <Text style={styles.tableAmountCell}>
                                {obj[list]}
                              </Text>
                            </View>
                          ))}
                      </View>
                    ))}
                  <View style={styles.tableRow}>
                    <View style={styles.particularTableCol}>
                      <Text
                        style={{
                          ...styles.tableCell,
                          ...styles.boldText,
                          textAlign: "center",
                        }}
                      >
                        Total
                      </Text>
                    </View>

                    {semesterHeaderList.length > 0 &&
                      semesterHeaderList.map((li, i) => (
                        <View style={styles.tableCol}>
                          <Text
                            style={{
                              ...styles.tableAmountCell,
                              ...styles.boldText,
                            }}
                          >
                            {" "}
                            {studentBonafideDetail[0]?.acerpAmount.reduce(
                              (sum, current) => {
                                return sum + Number(current[li]);
                              },
                              0
                            )}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              </View>

              {!!bonafideAddOnDetail[0].other_fee_details_id && (
                <View>
                  <Text style={styles.amtText}>{`(Amount in Rupees)`}</Text>
                </View>
              )}
              {!!bonafideAddOnDetail[0].other_fee_details_id && (
                <View style={styles.feeTemplateSection}>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.particularTableHeaderCol}>
                        <Text style={styles.particularTableCellHeader}>
                          Particulars
                        </Text>
                      </View>
                      {addOnSemesterHeaderList.length > 0 &&
                        addOnSemesterHeaderList.map((obj, index) => (
                          <View style={styles.tableHeaderCol}>
                            <Text style={styles.tableCellHeader}>{obj}</Text>
                          </View>
                        ))}
                    </View>
                    {bonafideAddOnDetail.length > 0 &&
                      bonafideAddOnDetail[0]?.addOnAmountList?.map(
                        (obj, index) => (
                          <View style={styles.tableRow}>
                            <View style={styles.particularTableCol}>
                              <Text style={styles.tableCell}>
                                {obj.particular}
                              </Text>
                            </View>
                            {addOnSemesterHeaderList.length > 0 &&
                              addOnSemesterHeaderList.map((list, i) => (
                                <View style={styles.tableCol}>
                                  <Text style={styles.tableAmountCell}>
                                    {obj[list]}
                                  </Text>
                                </View>
                              ))}
                          </View>
                        )
                      )}
                    <View style={styles.tableRow}>
                      <View style={styles.particularTableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            ...styles.boldText,
                            textAlign: "center",
                          }}
                        >
                          Total
                        </Text>
                      </View>

                      {addOnSemesterHeaderList.length > 0 &&
                        addOnSemesterHeaderList.map((li, i) => (
                          <View style={styles.tableCol}>
                            <Text
                              style={{
                                ...styles.tableAmountCell,
                                ...styles.boldText,
                              }}
                            >
                              {" "}
                              {bonafideAddOnDetail[0]?.addOnAmountList?.reduce(
                                (sum, current) => {
                                  return sum + Number(current[li]);
                                },
                                0
                              )}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.feeDetailSection}>
                <Text style={styles.feeDetailText}>
                  The DD may be drawn in favour of &quot;ACHARYA INSTITUTE OF
                  TECHNOLOGY&quot; payable at Bangalore.
                </Text>
                <Text style={{ ...styles.feeDetailText, marginTop: "10px" }}>
                  ADD-ON PROGRAMME FEE DD may be drawn in favour of &quot;NINI
                  SKILLUP PVT LTD&quot; payable at Bangalore.
                </Text>
                <Text style={{ ...styles.feeDetailText, marginTop: "10px" }}>
                  Uniform &amp; Stationery fee to be paid separately through ERP
                  Portal.
                </Text>
                <Text style={{ ...styles.feeDetailText, marginTop: "10px" }}>
                  This Bonafide is issued only for the purpose of Bank loan.
                </Text>
              </View>
              <View style={styles.feeDetailSection}>
                <Text style={{ ...styles.feeDetailText, paddingTop: "10px" }}>
                  *Please note that the given fee is applicable only for the
                  prescribed Academic Batch. Admission shall be ratified only
                  after the submission of all original documents for
                  verification and payment of all the fee for the semester/year
                  as prescribed in the letter of offer. Failure to do so shall
                  result in the withdrawal of the Offer of Admission.
                </Text>
              </View>
              <View style={styles.authorSection}>
                <Text style={{ ...styles.feeDetailText, ...styles.boldText }}>
                  PRINCIPAL
                </Text>
                <Text style={{ ...styles.feeDetailText, ...styles.boldText }}>
                  AUTHORIZED SIGNATORY
                </Text>
                <Text style={{...styles.feeDetailText, marginTop: "6px",fontSize:"10px"}}>
                  PREPARED BY &lt; USERNAME&gt;
                </Text>
              </View>
            </Page>
          )}
          )
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
