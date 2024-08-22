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

const styles = StyleSheet.create({
  body: {
    margin: 0,
  },
  boldText: {
    fontWeight: "heavy",
    fontFamily: "Roboto",
  },
  headerSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "40px",
  },
  headerText: {
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Roboto",
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
    fontFamily: "Roboto",
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
  },
  feeDetailSection: {
    marginTop: "40px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  studentDetailText: {
    width: "60%",
    fontSize: 10,
    textAlign: "justify",
    margin: "0 auto",
  },
  feeDetailText: {
    width: "60%",
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
    marginTop: "20px",
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

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

export const GenerateBonafide = (
  studentBonafideDetail,
  studentDetail,
  semesterHeaderList
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="Student Bonafide">
          return (
          <Page size="a4" style={styles.body}>
            <View style={styles.headerSection}>
              <Text
                style={styles.headerText}
              >{`Ref: ${studentBonafideDetail[0]?.bonafide_number}`}</Text>
              <Text style={styles.headerText}>{`Date: ${moment(
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
                  {studentDetail?.candidate_sex == "Female" ? "MS." : "MR."}
                </Text>{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.student_name || "-"},
                </Text>{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.candidate_sex == "Female" ? "D/o." : "S/o."}
                </Text>{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.father_name || "-"},
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
                  {(studentDetail?.program_short_name || "-") +
                    "-" +
                    (studentDetail?.program_specialization_name || "-")}
                </Text>
                (course) on merit basis after undergoing the selection procedure
                laid down by Acharya Institutes for the Academic year{" "}
                <Text style={styles.boldText}>{studentDetail?.ac_year}</Text>,
                subject to fulfilling the eligibility conditions prescribed by
                the affiliating University. The fee payable during the Academic
                Batch{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.academic_batch}
                </Text>{" "}
                is given below.
              </Text>
            </View>
            <View>
              <Text style={styles.amtText}>(Amount in Rupee)</Text>
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
              <Text style={styles.feeDetailText}>
                *Please note that the given fee is applicable only for the
                prescribed Academic Batch. Admission shall be ratified only
                after the submission of all original documents for verification
                and payment of all the fee for the semester/year as prescribed
                in the letter of offer. Failure to do so shall result in the
                withdrawal of the Offer of Admission.
              </Text>
            </View>
            <View style={styles.feeDetailSection}>
              <Text style={{ ...styles.feeDetailText, fontFamily: "Roboto" }}>
                PRINCIPAL
              </Text>
              <Text style={{ ...styles.feeDetailText, fontFamily: "Roboto" }}>
                AUTHORIZED SIGNATORY
              </Text>
              <Text style={{ ...styles.feeDetailText, marginTop: "6px" }}>
                PREPARED BY &lt; USERNAME&gt;
              </Text>
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
