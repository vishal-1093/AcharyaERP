import {
  Document,
  Page,
  StyleSheet,
  Text,
  Font,
  View,
  Image,
  pdf
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  image: {
    position: "absolute",
    width: "100%"
  },
  layout: { margin: "100px 2px 30px 40px" },
  alignCenterFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  mainContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    width: "90%",
    borderRadius: "5px",
    marginLeft: "15px",
    padding: "2px",
  },
  noteContainer: {
    width: "85%",
    borderRadius: "5px",
    marginLeft: "15px",
    padding: "2px",
  },
  lightGrayBg: {
    backgroundColor: "lightgray"
  },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  tableRow: {
    flexDirection: "row",
  },
  headerImage: {
    width: "80px"
  },
  headerCentertext: {
    width: "500px",
    textAlign: "center",
  },
  declarationTxt: {
    textAlign: "center",
    margin: "8px 0px 8px 0px",
    fontSize: "12px",
    fontFamily: "Times-Bold"
  },
  studentNameDeclarationText: {
    textAlign: "justify",
    fontSize: "11px"
  },
  boldText: {
    fontFamily: "Times-Bold"
  },
  noteFlex: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "row",
    gap: "10px"
  },
  top10Margin: {
    marginTop: "10px"
  },
  list: {
    fontSize: 20
  },
  listView: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    marginTop: "8px"
  }
});

Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const letterHead = require.context("../../../assets", true);

export const GenerateLaptopIssueAcknowledge = (
  { school_name_short, org_type, student_name, program_short_name, auid, current_year, current_sem, type, serialNo, issued_date, issued_by_name }
) => {

  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({
    label,
    style,
    right,
    bottom,
    type,
    align,
    padding,
    customWidth = 1,
    labelType
  }) => (
    <View
      style={{
        flex: customWidth,
        borderStyle: "solid",
        borderRightWidth: right,
        borderBottomWidth: bottom,
        borderColor: "black",
        outline: "none",
        padding: "3px",
        fontSize: 10,
        fontWeight: type == "h" ? "heavy" : "",
        fontFamily: type == "h" ? "Times-Bold" : "",
        marginRight: right === 0 ? 1 : 0,
      }}
    >
      {labelType == "text" ? <Text style={{
        fontFamily: style,
        textAlign: align,
        paddingleft: padding
      }}>{label}</Text> : label}
    </View>
  );

  const StudentDetailTable = () => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <View style={[styles.borderTable]}>
            <DispayRow>
              <DisplayCells
                label="Student Name"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={student_name?.split(" ")?.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())?.join(" ")}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
              <DisplayCells
                label="Course"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={program_short_name}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
            </DispayRow>
            <DispayRow>
              <DisplayCells
                label="Student Auid"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={auid}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
              <DisplayCells
                label="Year/Sem"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={`${current_year ? current_year : "-"}/${current_sem ? current_sem : "-"}`}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
            </DispayRow>
          </View>
        </View>
      </View>
    )
  };

  const LaptopDetails = () => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <View style={[styles.borderTable]}>
            <DispayRow>
              <DisplayCells
                label="Brand/Model"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={type}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
            </DispayRow>

            <DispayRow>
              <DisplayCells
                label="Serial No"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={serialNo}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
            </DispayRow>

            <DispayRow>
              <DisplayCells
                label="Date of Issue"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={moment(issued_date).format("DD-MM-YYYY")}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
            </DispayRow>

            <DispayRow>
              <DisplayCells
                label="Issued by"
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="left"
                labelType="text"
              />
              <DisplayCells
                label={issued_by_name}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                labelType="text"
              />
            </DispayRow>

          </View>
        </View>
      </View>
    )
  };

  const StudentNameDeclaration = () => {
    return (
      <View style={{ ...styles.mainContainer, marginTop: "10px" }}>
        <View style={styles.subContainer}>
          <Text style={{ ...styles.studentNameDeclarationText, paddingLeft: "20px" }}>
            I, <Text style={styles.boldText}>{student_name?.split(" ")?.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())?.join(" ")}</Text> hereby declare that I have received a laptop from Acharya Institutes on <Text style={styles.boldText}>{moment(issued_date).format("DD-MM-YYYY")}</Text>.</Text>
          <Text style={styles.studentNameDeclarationText}>I acknowledge and agree to the following terms and conditions.</Text>
        </View>
      </View>
    )
  };

  const Note = () => {
    return (
      <View style={{ ...styles.mainContainer, ...styles.top10Margin }}>
        <View style={styles.noteContainer}>
          <Text style={styles.boldText}>Note:</Text>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>Purpose of Use:</Text> The laptop is provided for academic purposes only. I agree to use it primarily for my coursework
                and other educational activities related to my studies.</Text></View>
          </View>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>Care and Maintenance:</Text> I will take reasonable care of the laptop and ensure it is kept in good working condition. I
                will avoid exposing it to extreme conditions, accidental damage, or misuse..</Text></View>
          </View>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>Software and Security:</Text> I am responsible for installing and maintaining antivirus software and ensuring that the
                laptop is protected against malware and unauthorized access.</Text></View>
          </View>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>Loss or Damage:</Text> I fully accept for the safe keeping and proper use of the laptop. I understand that any damage
                caused by my negligence,including in the event of theft or damage, will be entirely my responsibility.</Text></View>
          </View>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>Outstanding Fees:</Text> In case of discontinuation of my course, I agree to pay any outstanding fees towards the laptop
                cost. The amount payable will be proportionate to the laptop's cost and will be due to the college .Failing which
                college has authority to withhold the original marks card until the clearance of the same.</Text></View>
          </View>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>Return Policy Upon Discontinuation:</Text> I understand that if I discontinue my course, returning the laptop to the
                college will not be permitted. I will remain responsible for any costs related to the laptop until all outstanding fees
                are fully settled.</Text></View>
          </View>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>No Unauthorized Use:</Text> I will not use the laptop for any illegal activities, unauthorized software installations, or to
                violate any institution policies or acts that are bad in law.</Text></View>
          </View>

          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text><Text style={styles.boldText}>Compliance:</Text> I agree to comply with the institution’s policies related to the use of the laptop and any other
                applicable regulations including that of the provision of the Bharatiya Sakshya Adhiniyam, 2023 (BSA)/the Indian
                Evidence Act,1872. I am solely responsible and liable for the contents stored in the laptop and I undertake to keep
                indemnified the institution at all times in the event of the laptop being confiscated by any Government Authorities.</Text></View>
          </View>
          <View style={styles.listView}>
            <View><Text style={{ ...styles.list }}>•</Text></View>
            <View>
              <Text> I am aware of the fact that the laptop issued to me is a electronic device and has fragility and unless used
                effectively without overloading it's capacity , or fed with higher voltage and switched off abruptly, or if misused , it
                may fail and I shall bear the cost of such repairs in such an event.</Text></View>
          </View>
        </View>
      </View>
    )
  };

  const SignatureData = () => {
    return (
      <View style={{ ...styles.mainContainer, marginTop: "50px" }}>
        <View style={styles.subContainer}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View><Text>Parent's Signature</Text></View>
            <View><Text>Student's Signature</Text></View>
          </View>
        </View>
      </View>
    )
  };

  const MainContent = () => {
    return (
      <View style={styles.layout}>
        <Text style={styles.declarationTxt}>Laptop Declaration Form</Text>
        <StudentDetailTable />
        <Text style={styles.declarationTxt}>Laptop Details</Text>
        <LaptopDetails />
        <StudentNameDeclaration />
        <Note />
        <SignatureData />
      </View>
    )
  };

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`Laptop Issue Acknowledgement`}>
          <Page
            size="A4"
            style={{ ...styles.pageLayout }}
          >
            <Image style={styles.image}
              src={letterHead(`./${org_type.toLowerCase()}${school_name_short.toLowerCase()}.jpg`)} />
            <MainContent />
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
