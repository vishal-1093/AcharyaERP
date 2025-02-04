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
    fontSize: 8,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "60px 40px 20px 40px" },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  tableRow: {
    flexDirection: "row",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
  },
  header: {
    fontFamily: "Times-Bold",
    textAlign: "center",
    fontSize: 12,
    textTransform: "capitalize",
  },
});

export const GenerateInternalTimeTable = (data) => {
  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({
    label,
    style,
    right,
    bottom,
    align,
    customWidth = 1,
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
        marginRight: right === 0 ? 1 : 0,
      }}
    >
      <Text style={{ fontFamily: style, textAlign: align }}>{label}</Text>
    </View>
  );

  const PageData = () => (
    <View style={styles.layout}>
      <View style={{ marginBottom: "20px" }}>
        <Text style={styles.header}>
          {`Exam TimeTable For ${
            data[0].internal_name
          } - ${data[0].program_specialization_short_name.toLowerCase()}`}
        </Text>
      </View>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="Date"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label="Time"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label="Course"
            style="Times-Bold"
            right={0}
            bottom={1}
            align="center"
          />
        </DispayRow>
        {data.map((obj, i) => (
          <DispayRow key={i}>
            <DisplayCells
              label={obj.date_of_exam}
              style="Times-Roman"
              right={1}
              bottom={data.length - 1 === i ? 0 : 1}
              align="center"
            />
            <DisplayCells
              label={obj.timeSlots}
              style="Times-Roman"
              right={1}
              bottom={data.length - 1 === i ? 0 : 1}
              align="center"
            />
            <DisplayCells
              label={obj.course_with_coursecode}
              style="Times-Roman"
              right={0}
              bottom={data.length - 1 === i ? 0 : 1}
              align="center"
            />
          </DispayRow>
        ))}
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Internal Assesment Time Table">
          <Page size="A4" orientation="landscape" style={styles.pageLayout}>
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
