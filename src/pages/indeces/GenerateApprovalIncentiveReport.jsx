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
import moment from "moment";

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
    width: "80px"
  },
  arrowImage: {
    width: "40px"
  },
  verifiedImage:{
    width:"25px"
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
  contentContainer: { flex: 1, paddingLeft: "10px", marginTop: "5px" },
  contentSubContainer : {flexDirection:"row",alignItems:"center",gap:"10px"},
  ipText: {color: "#1c1a1a" },
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

  const incentiveList = data.incentiveData.map((ele,id)=>({...ele,'number':(id+1)*10}));

  const Publication = () => (
    <>
      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Type : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.Type}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Journal Name : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.journal_name}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Date  : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.date}</Text>
        </View>

        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Volume  : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.volume}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Issue No : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.issue_number}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Paper Title : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.paper_title}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Paper Number : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.page_number}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>ISSN  : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.issn}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>ISSN Type : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.issn_type}</Text>
        </View>
        <View style={styles.tableColLabel}>
        </View>
      </View>
    </>
  );

  const Conference = () => (
    <>
      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Conference Type : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.conference_type}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Paper Type : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.paper_type}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Conference  : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.conference_name}</Text>
        </View>

        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Paper Title  : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.paper_title}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>City  : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.place}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>From Date : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.from_date}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>To Date : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.to_date}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Organiser : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.organiser}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Presentation Type : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.presentation_type}</Text>
        </View>
        <View style={styles.tableColLabel}>
        </View>
      </View>
    </>
  );

  const BookChapter = () => (
    <>
      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Book Title : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.book_title}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Author : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.authore}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Published   : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.publisher}</Text>
        </View>

        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Published Year : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.published_year}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>ISBN No : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.isbn_number}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>DOI : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.doi}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Unit : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.unit}</Text>
        </View>
      </View>
    </>
  );

  const MemberShip = () => (
    <>
      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Membership Type : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.membership_type}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Professional Body/Society : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.professional_body}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Membership ID : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.member_id}</Text>
        </View>

        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Membership Citation : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.citation}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Year of Joining : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.year}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Nature of Membership : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.nature_of_membership}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Priority : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.priority}</Text>
        </View>
      </View>
    </>
  );

  const Grant = () => (
    <>
      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Title of the project : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.title}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Funding Agency : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.funding}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Name of the funding agency : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.funding_name}</Text>
        </View>

        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Sanction Amount : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.sanction_amount}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Tenure : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.tenure}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Principal Investigator : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.pi}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Copi : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.co_pi}</Text>
        </View>
      </View>
    </>
  );

  const Patent = () => (
    <>
      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>National / International : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.patent_name}</Text>
        </View>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Patent Title : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.patent_title}</Text>
        </View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Reference No : </Text>
          <Text style={styles.tableCellValue}>{data.rowData.reference_number}</Text>
        </View>

        <View style={styles.tableColLabel}>
          <Text style={styles.tableCellLabel}>Publication Status : </Text>
          <Text style={styles.tableCellValue}>{data.rowData?.publication_status}</Text>
        </View>
      </View>
    </>
  );

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
              <Text> {data.employeeDetail?.school_name?.toUpperCase()}</Text>
              <Text>APPLICATION FOR INCENTIVE - {data.researchType?.toUpperCase()}</Text>
            </View>
            {data.employeeDetail.gender == "M" && !data.employeeImageUrl && <Image
              style={styles.headerImage}
              src={logos(`./maleplaceholderimage.jpeg`)}
            />}
            {data.employeeDetail.gender == "F" && !data.employeeImageUrl && <Image
              style={styles.headerImage}
              src={logos(`./femalePlaceholderImage.jpg`)}
            />}
            {!!data.employeeImageUrl && <Image
              style={styles.headerImage}
              src={data.employeeImageUrl}
            />}
          </View>
        </View>
        <View style={styles.tableSubSection}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Faculty Name : </Text>
                <Text style={styles.tableCellValue}> {data.employeeDetail?.employee_name}</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Employee Code : </Text>
                <Text style={styles.tableCellValue}>{data.employeeDetail?.empcode}</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Designation : </Text>
                <Text style={styles.tableCellValue}>{data.employeeDetail?.designation_name}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Exp at Acharya : </Text>
                <Text style={styles.tableCellValue}>{data.employeeDetail?.experience}</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Department : </Text>
                <Text style={styles.tableCellValue}>{data.employeeDetail?.dept_name}</Text>
              </View>
              <View style={styles.tableColLabel}>
                <Text style={styles.tableCellLabel}>Phone : </Text>
                <Text style={styles.tableCellValue}>{data.employeeDetail?.mobile}</Text>
              </View>
            </View>
            <View style={styles.padding14}>
              <Text>Dear Sir/Madam,</Text>
              <Text style={{ marginTop: "6px" }}>{`I hereby request the approval of an incentive as applicable under the ${data.researchType} Division, details given below.`}</Text>
            </View>
            {data.researchType == "publication" && <Publication />}
            {data.researchType == "conference" && <Conference />}
            {data.researchType == "bookchapter" && <BookChapter />}
            {data.researchType == "membership" && <MemberShip />}
            {data.researchType == "grant" && <Grant />}
            {data.researchType == "patent" && <Patent />}
            <View style={styles.padding14}>
              <Text style={{ fontFamily: "Roboto", fontWeight: "heavy", fontSize: "16px" }}>Declaration :</Text>
              <Text style={{ marginTop: "6px" }}>I here by affirm that the information provided above is true and correct to the best of my knowledge.</Text>
            </View>
            <View style={{ ...styles.table, ...styles.padding20, paddingLeft: "20px" }}>
              <View style={styles.centerFlex}>
                <View style={styles.timelineContainer}>
                  {incentiveList.map((item, index, arr) => (
                    <View key={index} style={styles.timelineItem}>
                      <Image
                        style={styles.arrowImage}
                        src={logos(`./rightCursor.png`)}
                      />
                      {/* Dot and Line */}
                      <View style={styles.dotContainer}>
                        <Svg height="50" width="50">
                          <Circle cx="25" cy="25" r="20" stroke="white" strokeWidth="2" fill="#37A370" />
                          {data.researchType != "patent" && <Text x="25" y="30" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">
                            {item.number == 50 ? 60 : item.number == 60 ? 80 : item.number == 70 ? 100 : item.number}
                          </Text>}
                          {data.researchType == "patent" && <Text x="25" y="30" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">
                            {item.number == 50 ? "" : item.number == 70 ? 80 : item.number == 80 ? 100 : item.number}
                          </Text>}
                        </Svg>
                        {index < arr.length - 1 && (
                          <Svg height="30" width="10" style={styles.svgContainer}>
                            <Line x1="5" y1="0" x2="5" y2="50" stroke="black" strokeWidth="2" />
                          </Svg>
                        )}
                      </View>
                      {/*Left Side Content */}
                      <View style={styles.contentContainer}>
                        <View style={styles.contentSubContainer}>
                          <Text>{item.employeeName} -</Text>
                          <Text>{item.designation == "Hod" ? "Head Of Department" : item.designation == "Hoi" ? "Reporting Manager" : item.designation} -</Text>
                          <Text style={(item.remark.length > 90 && item.designation != "Assistant Director Research & Development") ? 
                          {width:"550px",textAlign:"justify",wordWrap:"wrap"}: (item.remark.length > 50 && item.designation == "Assistant Director Research & Development")? {width:"300px",textAlign:"justify",wordWrap:"wrap"} : ""}>
                            {item.remark} 
                          </Text>
                          {item.amount && <Text> - {item.amount}</Text>}
                          <Text> - {moment(item.dateTime).format("lll")} -</Text>
                          <Image
                            style={styles.verifiedImage}
                            src={logos(`./verified.png`)}
                          />
                        </View>
                        <Text style={styles.ipText}>IP Address - {item.empIpAddress || ""}</Text>
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
