import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
  Image,
} from "@react-pdf/renderer";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import moment from "moment";
import LetterheadImage from "../../../assets/aisait.jpg";

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
  image: { position: "absolute", width: "100%" },
  pageLayout: {
    fontFamily: "Roboto",
    fontSize: "9px",
  },
  pageLayoutData: {
    fontFamily: "Roboto",
    fontSize: "8px",
  },
  layout: { margin: "100px 50px 20px 50px" },
  mt: { marginTop: "20px" },
  flex: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  paragraphMargin: { marginTop: "10px" },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    flex: 1,
    padding: "5px",
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontStyle: "bold",
    alignItems: "center",
  },
  textCenter: { textAlign: "center" },
});

export const getImage = (employeeDocuments) => {
  try {
    if (!employeeDocuments || !employeeDocuments.school_name_short) {
      throw new Error("schoolShortName is not defined");
    }
    return require(`../../../assets/${employeeDocuments?.org_type?.toLowerCase()}${employeeDocuments?.school_name_short?.toLowerCase()}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      employeeDocuments?.schoolShortName,
      "Error:",
      error.message
    );
    return LetterheadImage;
  }
};
export const GenerateNoduesPrint = (data, empData) => {
  console.log(data, "data");

  const Content = () => {
    return (
      <View style={styles.layout}>
        <View style={styles.mt}>
          <Text
            style={{
              fontStyle: "bold",
              fontSize: "11px",
              textAlign: "center",
              padding: "1px",
            }}
          >
            NO DUE CERTIFICATE FOR STAFF RELIEVE
          </Text>
        </View>

        <View
          style={{ marginTop: "20px", borderWidth: 1, borderColor: "#000" }}
        >
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={[styles.cell, styles.tableHeader]}>EMP Name</Text>
            <Text style={[styles.cell, styles.tableHeader]}>EMP Code</Text>
            <Text style={[styles.cell, styles.tableHeader]}>DOJ</Text>
            <Text style={[styles.cell, styles.tableHeader]}>Department</Text>
            <Text style={[styles.cell, styles.tableHeader]}>Designation</Text>
            <Text style={[styles.cell, styles.tableHeader]}>Job Type</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.cell}>{empData?.employee_name}</Text>
            <Text style={styles.cell}>{empData?.empcode}</Text>
            <Text style={styles.cell}>{empData?.date_of_joining}</Text>
            <Text style={styles.cell}>{empData?.dept_name}</Text>
            <Text style={styles.cell}>{empData?.designation_name}</Text>
            <Text style={styles.cell}>{empData?.job_type}</Text>
          </View>
        </View>

        <View style={styles.paragraphMargin}>
          <Text style={{ textAlign: "justify", lineHeight: "1.5" }}>
            This is to inform you that the above mentioned staff has requested
            relieving from employment with the organization. You are requested
            to note this and confirm hereby by duly confirming that your
            department has No Dues from the above Staff.
          </Text>
        </View>

        <View
          style={{ marginTop: "20px", borderWidth: 1, borderColor: "#000" }}
        >
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={[styles.cell, styles.tableHeader]}>Department</Text>
            <Text style={[styles.cell, styles.tableHeader]}>Parameter</Text>
            <Text style={[styles.cell, styles.tableHeader]}>HOD Name</Text>
            <Text style={[styles.cell, styles.tableHeader]}>
              NOC Date & Time
            </Text>
            <Text style={[styles.cell, styles.tableHeader]}>HOD Comment</Text>
          </View>

          {data?.map((obj, i) => {
            return (
              <View style={styles.row} key={i}>
                <Text style={styles.cell}>{obj.dept_name_short}</Text>
                <Text style={styles.cell}>{obj.parameter}</Text>
                <Text style={styles.cell}>{obj.ApproverName}</Text>
                <View style={styles.cell}>
                  {obj.approver_date ? (
                    <>
                      <Text>{obj.ApproverName}</Text>
                      <br></br>
                      <Text>
                        {moment(obj.approver_date).format("DD-MM-YYYY LT")}
                        <br></br>
                      </Text>
                      <Text>ip - {obj.ip_address}</Text>
                      <br></br>
                    </>
                  ) : (
                    <Text>Pending</Text>
                  )}
                </View>
                <Text style={styles.cell}>{obj.deptcomments}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ marginTop: "20px" }}>
          <View style={styles.paragraphMargin}>
            <Text style={{ textAlign: "justify", lineHeight: "1.5" }}>
              I agree to authorize Acharya to deactivate my email used by me
              during my tenure with Acharya.
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>
              Received: &emsp;&emsp;&emsp;&emsp; a) All Original Certificates
            </Text>
            <Text>b) College doesn’t owe anything to me</Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
          </View>
        </View>

        <View style={{ marginTop: "30px" }}>
          <Text style={{ textAlign: "right", fontStyle: "bold" }}>
            Employee Signature & Date
          </Text>
        </View>

        <View style={{ marginTop: "10px" }}>
          <Text style={{ fontStyle: "bold" }}>For office use Only:</Text>
        </View>

        <View style={{ marginTop: "10px" }}>
          <Text>
            Staff may be relieved from organization w.e.f/last working day
            _____________________
          </Text>
        </View>

        <View style={{ marginTop: "35px" }}>
          <Text style={{ fontStyle: "bold" }}>
            Principal/Head of the Institution
          </Text>
        </View>

        <View style={{ marginTop: "10px" }}>
          <Text>
            Note: HR Department will issue RELIEVING/EXPERIENCE LETTER only
            after collecting this letter.
          </Text>
        </View>
      </View>
    );
  };

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="No Dues">
          <Page size="A4" wrap>
            <View
              style={
                data?.length <= 6 ? styles.pageLayout : styles.pageLayoutData
              }
            >
              <Image
                style={styles.image}
                src={
                  getImage(empData)
                  // logos(
                  //   `./${empData?.org_type?.toLowerCase()}${empData?.school_name_short?.toLowerCase()}.jpg`
                  // ) || "./aisait"
                }
              />
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
