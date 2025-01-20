import { Pages } from "@mui/icons-material";
import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 8,
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

const signatureList = [
  "Faculty Signature",
  "HOD Signature",
  "Principal Signature",
];
export const GenerateDetailedAttendanceReport = (data, pages) => {
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
        fontSize: 8,
        marginRight: right === 0 ? 1 : 0,
      }}
    >
      <Text style={{ fontFamily: style, textAlign: align }}>{label}</Text>
    </View>
  );

  const AttendanceData = ({ pageData }) => (
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
            customWidth={3}
          />
          <DisplayCells
            label="USN"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Student Name"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={7}
          />
          <DisplayCells
            label="DOR"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          {pageData.columns.map((obj, i) => (
            <DisplayCells
              key={i}
              label={i + 1}
              style="Times-Bold"
              right={i === pageData.columns.length ? 0 : 1}
              bottom={1}
              align="center"
            />
          ))}
        </DispayRow>
        {pageData.rows.map((obj, i) => {
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
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.usn}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.student_name}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                customWidth={7}
              />
              <DisplayCells
                key={i}
                label={
                  obj.reporting_date
                    ? moment(obj.reporting_date).format("DD-MM-YYYY")
                    : ""
                }
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              {pageData.columns.map((item, j) => (
                <DisplayCells
                  key={i}
                  label={data.displayData[`${item}-${obj.student_id}`]}
                  style="Times-Roman"
                  right={i === pageData.columns.length ? 0 : 1}
                  bottom={1}
                  align="center"
                />
              ))}
            </DispayRow>
          );
        })}
        <DispayRow>
          <DisplayCells
            label=""
            style="Times-Bold"
            right={0}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={0}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={0}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Present Count/Total Count"
            style="Times-Bold"
            right={0}
            bottom={1}
            align="left"
            customWidth={7}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          {pageData.columns.map((obj, i) => (
            <DisplayCells
              key={i}
              label={data.totalCount[obj]}
              style="Times-Bold"
              right={i === pageData.columns.length ? 0 : 1}
              bottom={1}
              align="center"
            />
          ))}
        </DispayRow>
        <DispayRow>
          <DisplayCells
            label=""
            style="Times-Bold"
            right={0}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={0}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={0}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Date"
            style="Times-Bold"
            right={0}
            bottom={1}
            align="left"
            customWidth={7}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          {pageData.columns.map((obj, i) => (
            <DisplayCells
              key={i}
              label={`${obj.substr(0, 6)}${obj.substr(8, 10)}`}
              style="Times-Bold"
              right={i === pageData.columns.length ? 0 : 1}
              bottom={1}
              align="center"
            />
          ))}
        </DispayRow>
        {signatureList.map((obj, i) => (
          <DispayRow key={i}>
            <DisplayCells
              label=""
              style="Times-Bold"
              right={0}
              bottom={1}
              align="center"
            />
            <DisplayCells
              label=""
              style="Times-Bold"
              right={0}
              bottom={1}
              align="center"
              customWidth={3}
            />
            <DisplayCells
              label=""
              style="Times-Bold"
              right={0}
              bottom={1}
              align="center"
              customWidth={3}
            />
            <DisplayCells
              label={obj}
              style="Times-Bold"
              right={0}
              bottom={1}
              align="left"
              customWidth={7}
            />
            <DisplayCells
              label=""
              style="Times-Bold"
              right={1}
              bottom={1}
              align="center"
              customWidth={3}
            />
            {pageData.columns.map((item, j) => (
              <DisplayCells
                key={j}
                label=""
                style="Times-Bold"
                right={j === pageData.columns.length ? 0 : 1}
                bottom={1}
                align="center"
              />
            ))}
          </DispayRow>
        ))}
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Attendance Report">
          {pages.map((obj, i) => (
            <Page
              key={i}
              size="A4"
              style={styles.pageLayout}
              orientation="landscape"
            >
              <AttendanceData pageData={obj} />
            </Page>
          ))}
        </Document>
      );
      const blob = await pdf(generateDocument).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
