import {
  Document,
  Image,
  Link,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "20px" },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  tableRow: {
    flexDirection: "row",
  },
});

export const GenerateDetailedAttendanceReport = (data) => {
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

  const AttendanceData = () => (
    <View style={styles.layout}>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="Sl No."
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label="AUID"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label="USN"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label="Student Name"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
          />
          {data.sortedDates.map((obj, i) => (
            <DisplayCells
              key={i}
              label={i + 1}
              style="Times-Bold"
              right={1}
              bottom={1}
              align="center"
            />
          ))}
        </DispayRow>
        {data.studentData.map((obj, i) => {
          return (
            <DispayRow key={i}>
              <DisplayCells
                key={i}
                label={i + 1}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
              />
              <DisplayCells
                key={i}
                label={obj.auid}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
              />
              <DisplayCells
                key={i}
                label={obj.usn}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
              />
              <DisplayCells
                key={i}
                label={obj.student_name}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
              />
              {data.sortedDates.map((item, j) => (
                <DisplayCells
                  key={i}
                  label={data.displayData[`${item}-${obj.student_id}`]}
                  style="Times-Roman"
                  right={1}
                  bottom={1}
                  align="center"
                />
              ))}
            </DispayRow>
          );
        })}
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Attendance Report">
          <Page size="A4" style={styles.pageLayout} orientation="landscape">
            <AttendanceData />
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
