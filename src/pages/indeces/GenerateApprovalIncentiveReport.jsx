import {
  Document,
  Page,
  StyleSheet,
  Text,
  Font,
  View,
  Image,
  pdf,
  Svg, Line, Circle
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 14,
    fontFamily: "Roboto",
  },
  centerFlex: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    justifyContent: "center",
    alignItems: "center",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnFlex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  tableSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  lightGrayBg: {
    backgroundColor: "lightgray"
  },
  tableSubSection: {
    width: "90%",
    borderRadius: "5px",
    marginLeft: "15px",
    padding: "2px",
  },
  padding14: {
    padding: "14px"
  },
  padding20: {
    padding: "20px"
  },
  headerImage: {
    width: "8%"
  },
  arrowImage: {
    width: "40px"
  },
  headerCentertext: {
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    textAlign: "center",
    fontSize: "14px"
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
    flexDirection: "row",
    alignItems: "center",
    gap: "2px",
    flex: 2,
    padding: "8px",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableCellLabel: {
    width: "45%",
    textAlign: "left",
    paddingLeft: "5px",
  },
  tableCellValue: {
    textAlign: "left",
    color: "#1c1a1a",
    width: "90%",
    wordWrap: "break-all",
  },
  tableCell: {
    fontSize: 10,
    wordWrap: "break-word",
    textAlign: "left",
    paddingLeft: "6px",
  },
  timelineContainer: { flexDirection: "column", width: "100%" },
  timelineItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 },
  dotContainer: { width: 30, alignItems: "center" },
  contentContainer: { flex: 1, paddingLeft: "10px", display: "flex", flexDirection: "row", alignItems: "center", gap: "15px", marginTop: "5px" },
  text: { fontSize: 14 },
  svgContainer: { height: 30, width: 30, alignItems: "right", marginLeft: "15px" },
});

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const logos = require.context("../../assets", true);

export const GenerateApprovalIncentiveReport = (
  data
) => {

  const Header = () => {
    return (
      <View style={{ ...styles.tableSection, ...styles.columnFlex }}>
        <View style={{ ...styles.tableSubSection, ...styles.lightGrayBg }}>
          <View style={styles.flex}>
            <Image
              style={styles.headerImage}
              src={logos(`./acharyaLogo.png`)}
            />
            <View style={styles.headerCentertext}>
              <Text>JMJ EDUCATION SOCIETY</Text>
              <Text>ACHARYA INSTITUTE OF TECHNOLOGY</Text>
              <Text>APPLICATION FOR INCENTIVE - PUBLICATION</Text>
            </View>
            <Image
              style={styles.headerImage}
              src={logos(`./maleplaceholderimage.jpeg`)}
            />
          </View>
        </View>
        <View style={styles.tableSubSection}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Faculty Name : </Text>
                <Text style={styles.tableCellValue}>MR. Raj</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Employee Code : </Text>
                <Text style={styles.tableCellValue}>AI00817 </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Designation : </Text>
                <Text style={styles.tableCellValue}>Teacher </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Exp at Acharya : </Text>
                <Text style={styles.tableCellValue}>0y 8M 20D</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Department : </Text>
                <Text style={styles.tableCellValue}>ERP </Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Phone : </Text>
                <Text style={styles.tableCellValue}>93406****7 </Text>
              </View>
            </View>
            <View style={styles.padding14}>
              <Text>Dear Sir/Madam,</Text>
              <Text style={{ marginTop: "6px" }}>I hereby request the approval of an incentive as applicable under the Publication Division, details given below.</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Type : </Text>
                <Text style={styles.tableCellValue}>INTERNATIONAL</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Journal Name : </Text>
                <Text style={styles.tableCellValue}>EAS Journal of Nursing and Midwifery</Text>
              </View>

            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Date  : </Text>
                <Text style={styles.tableCellValue}>16/11/2024 </Text>
              </View>

              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Volume  : </Text>
                <Text style={styles.tableCellValue}>Volume-6</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Issue No : </Text>
                <Text style={styles.tableCellValue}>5</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Paper Title : </Text>
                <Text style={styles.tableCellValue}>Study to Assess the Effectiveness of Structured</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Paper Number : </Text>
                <Text style={styles.tableCellValue}>105-109</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>ISSN  : </Text>
                <Text style={styles.tableCellValue}>2663-0966 (Print) - 2663-6735 (Online)</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>ISSN Type : </Text>
                <Text style={styles.tableCellValue}>GOOGLE SCHOLAR</Text>
              </View>
              <View style={styles.tableColLabel}>
              </View>
            </View>

            <View style={styles.padding14}>
              <Text style={{ fontFamily: "Roboto", fontWeight: "heavy", fontSize: "16px" }}>Declaration :</Text>
              <Text style={{ marginTop: "6px" }}>I here by affirm that the information provided above is true and correct to the best of my knowledge.</Text>
            </View>


            <View style={{ ...styles.table, ...styles.padding20, paddingLeft: "20px" }}>
              <View style={styles.centerFlex}>

                <View style={styles.timelineContainer}>

                  {[{ date: "Sunny Raj", title: "Applicant ", desc: "Test remarks by applicant.", no: "10" },
                  { date: "DIVYA KUMARI H", title: " Head Of Department ", desc: "Test remarks by hod.", no: "20" },
                  { date: "DIVYA KUMARI H", title: " Reporting Manager ", desc: "Test remarks by hoi.", no: "30" },

                  { date: "DEVASIS PRADHAN", title: "Assistant Director Research & Development ", desc: "Test remarks by ass. direct.r&d.", no: "40" },
                  { date: "RAJASHEKAR PATIL", title: " Head QA ", desc: "Test remarks by Head QA.", no: "60 " },
                  { date: "SHAFIULLA PAPABHAI", title: "HR", desc: "Test remarks by HR.", no: "80" },
                  { date: "REKHA G", title: "Finance ", desc: "Test remarks by Finance.", no: "100" },

                  ].map((item, index, arr) => (
                    <View key={index} style={styles.timelineItem}>
                      <Image
                        style={styles.arrowImage}
                        src={logos(`./rightCursor.png`)}
                      />
                      {/* Dot and Line */}
                      <View style={styles.dotContainer}>
                        <Svg height="50" width="50">
                          <Circle cx="25" cy="25" r="20" stroke="white" strokeWidth="2" fill="#37A370" />
                          <Text x="25" y="30" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">
                            {item.no}
                          </Text>
                        </Svg>
                        {index < arr.length - 1 && (
                          <Svg height="30" width="10" style={styles.svgContainer}>
                            <Line x1="5" y1="0" x2="5" y2="50" stroke="black" strokeWidth="2" />
                          </Svg>
                        )}
                      </View>

                      {/* Content */}
                      <View style={styles.contentContainer}>
                        <Text style={styles.text}>{item.date} - {item.title}</Text>
                        <Text style={styles.text}>-{item.desc}</Text>
                      </View>
                    </View>
                  ))}
                </View>

              </View>
            </View>

          </View>
        </View>
      </View>
    )
  };

  const IncentiveReport = () => {
    return (
      <Header />
    )
  };

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`Approval Incentive Report`}>
          <Page
            size="A2"
            style={{ ...styles.pageLayout }}
          >
            <IncentiveReport />
          </Page>
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
