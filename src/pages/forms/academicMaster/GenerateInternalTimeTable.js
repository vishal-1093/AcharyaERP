import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "60px 20px 20px 40px" },
  table: {
    display: "table",
    width: "95%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderColor: "#000",
  },
  header: {
    fontFamily: "Times-Bold",
    textAlign: "center",
    fontSize: 12,
  },
});

const customWidth = 100 / 3;

export const GenerateInternalTimeTable = (data) => {
  const CustomCell = ({
    label,
    borderRight,
    borderBottom,
    fontFamily,
    width,
    align = "center",
  }) => (
    <Text
      style={{
        padding: 6,
        borderRightWidth: borderRight,
        borderBottomWidth: borderBottom,
        borderColor: "#000",
        fontFamily,
        width: `${width}%`,
        textAlign: align,
        textTransform: "capitalize",
      }}
    >
      {label}
    </Text>
  );

  const PageData = () => (
    <View style={styles.layout}>
      <View style={{ marginBottom: "20px" }}>
        <Text style={styles.header}>
          {`Exam TimeTable For ${data[0].internal_name} - ${data[0].program_specialization_short_name}`}
        </Text>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <CustomCell
            label="Date"
            borderRight={0.5}
            borderBottom={0.5}
            fontFamily="Times-Bold"
            width={customWidth}
          />
          <CustomCell
            label="Time"
            borderRight={0.5}
            borderBottom={0.5}
            fontFamily="Times-Bold"
            width={customWidth}
          />
          <CustomCell
            label="Course"
            borderRight={0}
            borderBottom={0.5}
            fontFamily="Times-Bold"
            width={customWidth}
          />
        </View>
        {data.map((obj, i) => (
          <View style={styles.row} key={i}>
            <CustomCell
              label={`${obj.date_of_exam} (${obj.week_day})`}
              borderRight={0.5}
              borderBottom={data.length - 1 === i ? 0 : 0.5}
              fontFamily="Times-Roman"
              width={customWidth}
            />
            <CustomCell
              label={obj.timeSlots}
              borderRight={0.5}
              borderBottom={data.length - 1 === i ? 0 : 0.5}
              fontFamily="Times-Roman"
              width={customWidth}
            />
            <CustomCell
              label={obj.course_with_coursecode}
              borderRight={0}
              borderBottom={data.length - 1 === i ? 0 : 0.5}
              fontFamily="Times-Roman"
              width={customWidth}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Internal Assesment Time Table">
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
