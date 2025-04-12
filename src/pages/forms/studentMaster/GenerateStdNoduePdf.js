import {
  Document,
  Image,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import ait from "../../../assets/aisait.jpg";
import moment from "moment";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  image: { position: "absolute", width: "100%" },
  layout: { margin: "140px 45px 45px 45px" },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  tableRow: {
    flexDirection: "row",
  },
  heading: { fontSize: 14, fontFamily: "Times-Bold", textAlign: "center" },
  margin: { marginTop: "20px" },
});

export const GenerateStdNoduePdf = (studentData, programType, dueYear) => {
  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({ label, width, right, bottom, style }) => (
    <View
      style={{
        width: width,
        borderStyle: "solid",
        borderColor: "black",
        outline: "none",
        padding: "4px",
        fontSize: 10,
        borderRightWidth: right,
        borderBottomWidth: bottom,
      }}
    >
      <Text style={{ fontFamily: style }}>{label}</Text>
    </View>
  );

  const DisplayContent = ({
    labelOne,
    valueOne,
    labelTwo,
    valueTwo,
    bottom = 1,
  }) => (
    <DispayRow>
      <DisplayCells
        label={labelOne}
        width="15%"
        right={1}
        bottom={bottom}
        style="Times-Bold"
      />
      <DisplayCells
        label={valueOne}
        width="35%"
        right={1}
        bottom={bottom}
        style="Times-Roman"
      />
      <DisplayCells
        label={labelTwo}
        width="15%"
        right={1}
        bottom={bottom}
        style="Times-Bold"
      />
      <DisplayCells
        label={valueTwo}
        width="35%"
        right={0}
        bottom={bottom}
        style="Times-Roman"
      />
    </DispayRow>
  );

  const PageData = () => (
    <View style={styles.pageLayout}>
      <Image style={styles.image} src={ait} />
      <View style={styles.layout}>
        <View>
          <Text style={styles.heading}>
            No due certificate till year/sem -{" "}
            {`${studentData.current_year}/${studentData.current_sem}`}
          </Text>
        </View>
        <View style={[styles.borderTable, styles.margin]}>
          <DisplayContent
            labelOne="AUID"
            valueOne={studentData.auid}
            labelTwo="Student Name"
            valueTwo={studentData.student_name}
          />
          <DisplayContent
            labelOne="USN"
            valueOne={studentData.usn ?? "-"}
            labelTwo="DOA"
            valueTwo={moment(studentData.date_of_admission).format(
              "DD-MM-YYYY"
            )}
          />
          <DisplayContent
            labelOne="School"
            valueOne={studentData.school_name}
            labelTwo="Program"
            valueTwo={`${studentData.program_short_name} - ${studentData.program_specialization_short_name}`}
          />
          <DisplayContent
            labelOne="Academic Batch"
            valueOne={studentData.academic_batch}
            labelTwo="Current Year/Sem"
            valueTwo={`${studentData.current_year}/${studentData.current_sem}`}
          />
          <DisplayContent
            labelOne="Fee Template"
            valueOne={`${studentData.fee_template_name} - ${
              studentData.fee_template_id
            } - ${studentData.program_type_name === "Semester" ? "S" : "Y"}`}
            labelTwo="Admission Category"
            valueTwo={`${studentData.fee_admission_category_short_name} - ${studentData.fee_admission_sub_category_short_name}`}
          />
          <DisplayContent
            labelOne="Acharya Email"
            valueOne={studentData.acharya_email}
            labelTwo="Mobile No."
            valueTwo={studentData.mobile}
            bottom={0}
          />
        </View>

        <View style={{ marginTop: "30px" }}>
          <Text style={{ fontSize: 11 }}>
            This is to certify that the above student do not have any dues upto
            year/sem -{" "}
            {`${studentData.current_year}/${studentData.current_sem}`}.
          </Text>
        </View>

        <View style={{ marginTop: "60px" }}>
          <Text style={{ fontSize: 11, fontFamily: "Times-Bold" }}>
            Finance Department
          </Text>
        </View>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="No Due">
          <Page size="A4" style={styles.pageLayout}>
            <PageData />
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
