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
import rightCursor from "../../../assets/rightCursor.png";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import moment from "moment";
const sign = require.context("../../../assets/principalSignature", true);

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
    padding: 0,
    fontFamily: "Times-Roman",
  },
  image: { position: "absolute", width: "99%" },
  boldText: {
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Times-Bold",
  },
  topSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    width: "90%",
    marginLeft: "15px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    textAlign: "center",
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  concernSection: {
    marginTop: "10px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  concernText: {
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
    alignItems: "center",
  },
  sectionDetailWidth: {
    width: "90%",
    marginLeft: "15px",
    lineHeight: 1.5,
  },
  studentDetailText: {
    fontSize: 11,
    textAlign: "justify",
  },
  feeDetailSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  feeDetailText: {
    fontSize: 11,
    textAlign: "justify",
  },
  feeTemplateSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  amtText: {
    marginTop: "8px",
    fontSize: 9,
    textAlign: "right",
    position: "relative",
    right: 25,
  },
  table: {
    display: "table",
    width: "90%",
    marginLeft: "15px",
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
  addOnTableHeaderCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    // flex: 1,
  },
  tableCellHeader: {
    padding: 2,
    fontWeight: "heavy",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto",
    textTransform: "capitalize",
  },
  particularTableCellHeader: {
    padding: 2,
    fontWeight: "heavy",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  tableCell: {
    margin: 2,
    fontSize: 10,
    wordWrap: "break-word",
    maxWidth: "100%",
    textAlign: "left",
  },
  tableAmountCell: {
    margin: 2,
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
        <Document title="Bonafide Certificate">
          {studentBonafideDetail[0]?.bonafide_type ==
            "Provisional Bonafide" && (
            <Page size="A4" style={styles.body}>
              {!letterHeadPrintOrNot && (
                <Image
                  style={styles.image}
                  src={getSchoolTemplate(studentDetail)}
                />
              )}
              <View style={styles.topSection}>
                <View style={{ ...styles.headerSection, marginTop: "150px" }}>
                  <Text style={{ fontSize: "10px" }}>
                    RefNo:{" "}
                    <Text
                      style={styles.boldText}
                    >{`${studentBonafideDetail[0]?.bonafide_number}`}</Text>
                  </Text>
                  <Text style={{ fontSize: "10px" }}>
                    Date:{" "}
                    <Text style={styles.boldText}>{`${moment(
                      studentBonafideDetail[0]?.created_Date
                    ).format("DD/MM/YYYY")}`}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.concernSection}>
                <View
                  style={{
                    width: "90%",
                    marginLeft: "15px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ ...styles.concernText, ...styles.boldText }}>
                    TO WHOM SO EVER IT MAY CONCERN
                  </Text>
                </View>
              </View>
              <View style={styles.studentDetailSection}>
                <View style={styles.sectionDetailWidth}>
                  <Text style={styles.studentDetailText}>
                    This is to certify that{" "}
                    <Text style={styles.boldText}>
                      {studentDetail?.candidate_sex == "Female" ? "Ms." : "Mr."}
                    </Text>{" "}
                    <Text style={styles.boldText}>
                      {studentDetail?.student_name?.toUpperCase() || "-"}
                    </Text>
                    ,{" "}
                    <Text style={styles.boldText}>
                      {studentDetail?.candidate_sex == "Female"
                        ? "D/o."
                        : "S/o."}
                    </Text>{" "}
                    <Text style={styles.boldText}>
                      {studentDetail?.father_name?.toUpperCase() || "-"}
                    </Text>
                    , AUID No.
                    <Text style={styles.boldText}>
                      {studentDetail?.auid || "-"}
                    </Text>{" "}
                    is provisionally admitted to{" "}
                    <Text
                      style={{ ...styles.boldText, textTransform: "uppercase" }}
                    >
                      {studentBonafideDetail[0]?.school_name}
                    </Text>{" "}
                    in{" "}
                    <Text style={styles.boldText}>
                      {(studentDetail?.program_short_name?.toUpperCase() ||
                        "-") +
                        "-" +
                        (studentDetail?.program_specialization_name?.toUpperCase() ||
                          "-")}
                    </Text>{" "}
                    on merit basis after undergoing the selection procedure laid
                    down by {studentDetail?.school_name} for the Academic year{" "}
                    <Text style={styles.boldText}>
                      {studentDetail?.ac_year}
                    </Text>
                    , subject to fulfilling the eligibility conditions
                    prescribed by the affiliating University. The fee payable
                    during the Academic Batch{" "}
                    <Text style={styles.boldText}>
                      {studentDetail?.academic_batch}
                    </Text>{" "}
                    is given below.
                  </Text>
                </View>
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
                      <Text
                        style={{
                          ...styles.particularTableCellHeader,
                          ...styles.boldText,
                        }}
                      >
                        Particulars
                      </Text>
                    </View>
                    {semesterHeaderList.length > 0 &&
                      semesterHeaderList.map((obj, index) => (
                        <View key={index} style={styles.tableHeaderCol}>
                          <Text
                            style={{
                              ...styles.tableCellHeader,
                              ...styles.boldText,
                            }}
                          >
                            {obj.label}
                          </Text>
                        </View>
                      ))}
                  </View>
                  {studentBonafideDetail.length > 0 &&
                    studentBonafideDetail[0]?.acerpAmount.map((obj, index) => (
                      <View key={index} style={styles.tableRow}>
                        <View style={styles.particularTableCol}>
                          <Text style={styles.tableCell}>{obj.particular}</Text>
                        </View>
                        {semesterHeaderList.length > 0 &&
                          semesterHeaderList.map((list, i) => (
                            <View key={i} style={styles.tableCol}>
                              <Text style={styles.tableAmountCell}>
                                {obj[list["value"]]}
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
                        <View key={i} style={styles.tableCol}>
                          <Text
                            style={{
                              ...styles.tableAmountCell,
                              ...styles.boldText,
                            }}
                          >
                            {" "}
                            {studentBonafideDetail[0]?.acerpAmount.reduce(
                              (sum, current) => {
                                return sum + Number(current[li["value"]]);
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
                      <View style={styles.addOnTableHeaderCol}>
                        <Text
                          style={{
                            ...styles.particularTableCellHeader,
                            ...styles.boldText,
                          }}
                        >
                          Particulars
                        </Text>
                      </View>
                      {addOnSemesterHeaderList.length > 0 &&
                        addOnSemesterHeaderList.map((obj, index) => (
                          <View key={index} style={{...styles.tableHeaderCol,flex:1}}>
                            <Text
                              style={{
                                ...styles.tableCellHeader,
                                ...styles.boldText,
                              }}
                            >
                              {obj.label}
                            </Text>
                          </View>
                        ))}
                    </View>
                    {bonafideAddOnDetail.length > 0 &&
                      bonafideAddOnDetail[0]?.addOnAmountList?.map(
                        (obj, index) => (
                          <View key={index} style={styles.tableRow}>
                            <View
                              style={{ ...styles.particularTableCol }}
                            >
                              <Text style={styles.tableCell}>
                                {obj.particular}
                              </Text>
                            </View>
                            {addOnSemesterHeaderList.length > 0 &&
                              addOnSemesterHeaderList.map((list, i) => (
                                <View key={i} style={{...styles.tableCol,flex:1}}>
                                  <Text style={styles.tableAmountCell}>
                                    {obj[list["value"]]}
                                  </Text>
                                </View>
                              ))}
                          </View>
                        )
                      )}
                    <View style={styles.tableRow}>
                      <View style={{ ...styles.particularTableCol }}>
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
                          <View key={i} style={{...styles.tableCol,flex:1}}>
                            <Text
                              style={{
                                ...styles.tableAmountCell,
                                ...styles.boldText,
                              }}
                            >
                              {" "}
                              {bonafideAddOnDetail[0]?.addOnAmountList?.reduce(
                                (sum, current) => {
                                  return sum + Number(current[li["value"]]);
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
                <View style={styles.sectionDetailWidth}>
                  <Text style={{ ...styles.feeDetailText }}>
                    *Please note that the given fee is applicable only for the
                    prescribed Academic Batch. This Bonafide is issued only for
                    the purpose of Bank loan.
                  </Text>
                </View>
              </View>
              <View style={styles.feeDetailSection}>
                <View style={styles.sectionDetailWidth}>
                  <Text
                    style={{
                      ...styles.feeDetailText,
                      fontWeight: "heavy",
                      fontFamily: "Times-Bold",
                      fontSize: "11px",
                      marginTop: "4px",
                    }}
                  >
                    Payment Instructions:
                  </Text>
                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image
                      src={rightCursor}
                      alt="rightCursorImage"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <Text style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                      Student can pay all fees through Acharya ERP APP/WEB.
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image
                      src={rightCursor}
                      alt="rightCursorImage"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <Text style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                      If student opts for Bank loan, DD can be drawn in favor of{" "}
                      “
                      <Text>
                        {studentDetail?.school_name ==
                        "SMT NAGARATHNAMMA SCHOOL OF NURSING"
                          ? "SMT NAGARATHNAMMA COLLEGE OF NURSING"
                          : studentDetail?.school_name?.toUpperCase()}
                      </Text>
                      ” payable at Bangalore for college fee OR
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image
                      src={rightCursor}
                      alt="rightCursorImage"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <Text style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                      If bank prefers to make RTGS Transfer, bank can contact
                      Institution via e-mail{" "}
                      <Text>{studentDetail?.principalEmail}</Text> for bank
                      details.
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image
                      src={rightCursor}
                      alt="rightCursorImage"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <Text style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                      Add-on Programme fee to be paid through ERP APP/WEB or DD
                      Can be drawn in favour of Nini Skillup Pvt Ltd.
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image
                      src={rightCursor}
                      alt="rightCursorImage"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <Text style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                      Uniform & Stationery fee to be paid through ERP APP/WEB
                      only.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.feeDetailSection}>
                <View style={styles.sectionDetailWidth}>
                  <Image
                    style={{ width: 100, height: 100 }}
                    src={sign(`./${studentDetail?.school_name_short}.png`)}
                    alt={studentDetail?.school_name_short}
                  />
                  <Text
                    style={{
                      ...styles.feeDetailText,
                      ...styles.boldText,
                    }}
                  >
                    PRINCIPAL
                  </Text>
                  <Text
                    style={{
                      ...styles.feeDetailText,
                      ...styles.boldText,
                      marginBottom: "10px",
                    }}
                  >
                    AUTHORIZED SIGNATORY
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  ...styles.feeDetailText,
                  padding: "6px 0px",
                  fontSize: "9px",
                  textTransform: "capitalize",
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                }}
              >
                Prepared By -{" "}
                {studentBonafideDetail[0]?.created_username || "-"}
              </Text>
            </Page>
          )}
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      // console.error(error);

      reject(error);
    }
  });
};
