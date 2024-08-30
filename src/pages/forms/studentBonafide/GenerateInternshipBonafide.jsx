import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

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
    justifyContent: "space-between",
    padding: "0 40px",
    marginTop: "50px",
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
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: 1.5,
  },
  studentTableSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  studentDetailText: {
    width: "70%",
    fontSize: 10,
    textAlign: "justify",
    margin: "0 auto",
  },
  studentDetailTableSection: {
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
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: "8px",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColLabel: {
    display: "flex",
    flex: 3,
    padding: "5px",
  },
  tableCol: {
    display: "flex",
    flex: 4,
    padding: "5px",
    wordWrap: "break-all",
  },
  tableCellLabel: {
    fontSize: 10,
    textAlign: "left",
  },
  tableCell: {
    fontSize: 10,
    wordWrap: "break-word",
    textAlign: "left",
  },
});

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

export const GenerateInternshipBonafide = (
  studentBonafideDetail,
  studentDetail
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="Student Bonafide">
          return (
          <Page size="a4" style={styles.body}>
            <View style={styles.concernSection}>
              <Text style={styles.concernText}>
                TO WHOM SO EVER IT MAY CONCERN
              </Text>
            </View>
            <View style={styles.studentDetailSection}>
              <Text style={styles.studentDetailText}>
                This is to certify that the below mentioned student,
                <Text style={styles.boldText}>
                  {studentDetail?.candidate_sex == "Female" ? "Ms." : "Mr."}
                </Text>{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.student_name || "-"}
                </Text>
                ,
                <Text style={styles.boldText}>
                  {studentDetail?.candidate_sex == "Female" ? "D/o." : "S/o."}
                </Text>{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.father_name || "-"},
                </Text>
                , was enrolled at{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.school_name}
                </Text>
                , Bangalore, affiliated to{" "}
                <Text style={styles.boldText}>
                  {studentBonafideDetail[0]?.bonafide_number}
                </Text>
                . {studentDetail?.candidate_sex == "Female" ? "She" : "He"} is
                studying in{" "}
                <Text
                  style={styles.boldText}
                >{`${studentDetail?.current_year} year/${studentDetail?.current_sem} sem`}</Text>
                ,{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.program_short_name || "-"}-
                  {studentDetail?.program_specialization_name || "-"}
                </Text>
                .
              </Text>
            </View>
            <View style={styles.studentTableSection}>
              <View
                style={{
                  width: "80%",
                  borderRadius: "5px",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    padding: "8px",
                    backgroundColor: "lightgray",
                  }}
                >
                  Student Details
                </Text>
                <View style={styles.studentDetailTableSection}>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Auid</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {studentDetail?.auid || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Student Name</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {studentDetail?.student_name || "-"}
                        </Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>USN</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {studentDetail?.usn || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Father Name</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {studentDetail?.father_name || "-"}
                        </Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>DOA</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {studentDetail?.date_of_admission || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Program</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >{`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}</Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>
                          Current Year/Sem
                        </Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >{`${studentDetail?.current_year}/${studentDetail?.current_sem}`}</Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>
                          Academic Batch
                        </Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {studentDetail?.academic_batch || "-"}
                        </Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Nationality</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {studentDetail?.CountryName || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>
                          Admission Category
                        </Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >{`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ ...styles.studentDetailSection, marginTop: "40px" }}>
              <Text style={{ ...styles.studentDetailText, ...styles.boldText }}>
                This letter is given for the purpose of internship.
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
