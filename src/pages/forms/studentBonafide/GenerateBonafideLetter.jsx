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
import moment from "moment";

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const styles = StyleSheet.create({
  body: {
    margin: 0,
  },
  templateImage: {
    position: "absolute",
    display: "block",
    width: "100%",
  },
  headerSection: {
    position: "absolute",
    top: "150px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0 30px",
  },
  headerText: {
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Roboto",
  },
  concernSection: {
    position: "absolute",
    top: "200px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  concernUnderLine: {
    borderBottomWidth: 0.8,
    borderBottomStyle: "solid",
    borderBottomColor: "black",
  },
  studentDetailSection: {
    position: "absolute",
    top: "240px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    lineHeight: 1.5,
  },
  feeDetailSection: {
    position: "absolute",
    left: "30px",
    marginTop: "20px",
    width: "90%",
  },
  studentDetailText: {
    width: "90%",
    fontSize: 10,
    textAlign: "justify",
  },
  feeTemplateSection: {
    position: "absolute",
    top: "310px",
    width: "100%",
  },
  amtText: {
    fontSize: "9px",
    textAlign: "right",
    width: "95%",
  },
  table: {
    display: "table",
    width: "90%",
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
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flex: 1,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    display: "flex",
    flex: 1,
  },
  particularTableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    display: "flex",
    flex: 2,
  },
  particularTableHeaderCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flex: 2,
  },
  tableCellHeader: {
    padding: 5,
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto",
    textTransform: "capitalize",
  },
  particularTableCellHeader: {
    padding: 5,
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

export const GenerateBonafideLetter = (
  studentBonafideDetail,
  studentDetail,
  semesterHeaderList,
  bonafideAddOnDetail,
  addOnSemesterHeaderList,
  schoolTemplate
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="Student Bonafide">
          return (
          <Page size="a4" style={styles.body}>
            <View style={{ position: "relative" }}>
              <Image src={schoolTemplate} style={styles.templateImage} />
              <View style={styles.headerSection}>
                <Text style={{ fontSize: "10px", fontFamily: "Roboto" }}>
                  RefNo:{" "}
                  <Text
                    style={styles.headerText}
                  >{`${studentBonafideDetail[0]?.bonafide_number}`}</Text>
                </Text>
                <Text style={{ fontSize: "10px", fontFamily: "Roboto" }}>
                  Date:{" "}
                  <Text style={styles.headerText}>{`${moment(
                    studentBonafideDetail[0]?.created_Date
                  ).format("DD/MM/YYYY")}`}</Text>
                </Text>
              </View>
              <View style={styles.concernSection}>
                <Text style={{ fontSize: "10px", ...styles.concernUnderLine }}>
                  TO WHOMSOEVER IT MAY CONCERN
                </Text>
              </View>
              <View style={styles.studentDetailSection}>
                <Text style={styles.studentDetailText}>
                  This is to certify that{" "}
                  <Text style={{ fontSize: "10px", fontFamily: "Roboto" }}>
                    {studentDetail?.candidate_sex == "Female" ? "Ms." : "Mr."}
                  </Text>{" "}
                  <Text style={{ fontSize: "10px", fontFamily: "Roboto" }}>
                    {studentDetail?.student_name || "-"},
                  </Text>{" "}
                  <Text style={{ fontSize: "10px", fontFamily: "Roboto" }}>
                    {studentDetail?.candidate_sex == "Female" ? "D/o." : "S/o."}
                  </Text>{" "}
                  <Text style={{ fontSize: "10px", fontFamily: "Roboto" }}>
                    {studentDetail?.father_name || "-"},
                  </Text>{" "}
                  AUID No.
                  <Text>{studentDetail?.auid || "-"}</Text> is admitted to{" "}
                  <Text>{(studentDetail?.school_name).toUpperCase()}</Text> for{" "}
                  {studentDetail?.current_year} Year/
                  {studentDetail?.current_sem} semester in{" "}
                  <Text style={{ fontSize: "10px", fontFamily: "Roboto" }}>
                    {(studentDetail?.program_short_name || "-") +
                      "-" +
                      (studentDetail?.program_specialization_name || "-")}
                  </Text>
                  (course) during the Academic year{" "}
                  <Text>{studentDetail?.ac_year}</Text>, (admitted through
                  MANAGEMENT). The fee payable during the Academic Batch{" "}
                  <Text>{studentDetail?.academic_batch}</Text> is given below.
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  top: "300px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={styles.amtText}>{`(Amount in ${
                  studentBonafideDetail[0]?.currency_type_name == "INR"
                    ? "Rupees"
                    : "USD"
                })`}</Text>
              </View>
              <View style={styles.feeTemplateSection}>
                <View
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
                      studentBonafideDetail[0]?.acerpAmount.map(
                        (obj, index) => (
                          <View style={styles.tableRow}>
                            <View style={styles.particularTableCol}>
                              <Text style={styles.tableCell}>
                                {obj.particular}
                              </Text>
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
                        )
                      )}
                    <View style={styles.tableRow}>
                      <View style={styles.particularTableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            textAlign: "center",
                            fontSize: "10px",
                            fontFamily: "Roboto",
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
                                fontSize: "10px",
                                fontFamily: "Roboto",
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
                  <View
                    style={{
                      marginTop: "10px",
                      position: "relative",
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text style={styles.amtText}>(Amount in Rupees)</Text>
                  </View>
                )}
                {!!bonafideAddOnDetail[0].other_fee_details_id && (
                  <View
                    style={{
                      width: "100%",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
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
                              textAlign: "center",
                              fontSize: "10px",
                              fontFamily: "Roboto",
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
                                  fontSize: "10px",
                                  fontFamily: "Roboto",
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
                <View style={{ position: "relative", width: "100%" }}>
                  <View
                    style={{
                      ...styles.feeDetailSection,
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text style={{ fontSize: "10px" }}>
                      The DD may be drawn in favour of &quot;ACHARYA INSTITUTE
                      OF TECHNOLOGY&quot; payable at Bangalore.
                    </Text>
                    <Text
                      style={{
                        fontSize: "10px",
                        marginTop: "20px",
                        textAlign: "justify",
                      }}
                    >
                      *please note that the given fee is applicable only for the
                      prescribed Academic Batch.This Bonafide is issued only for
                      the purpose of Bank loan.
                    </Text>
                    <View
                      style={{
                        marginTop: "30px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <Text
                          style={{ fontSize: "10px", fontFamily: "Roboto" }}
                        >
                          PRINCIPAL
                        </Text>
                        <Text
                          style={{ fontSize: "10px", fontFamily: "Roboto" }}
                        >
                          AUTHORIZED SIGNATORY
                        </Text>
                      </View>
                      <Text style={{ fontSize: "9px", marginTop: "10px" }}>
                        Prepared By - Super Admin
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Page>
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
