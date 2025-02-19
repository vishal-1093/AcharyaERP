import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

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
  }
});

export const GenerateLockedBillingReport = (
  data, rowWiseData, type
) => {

  const getMonthName = (monthNumber) => {
    if (monthNumber == "01") {
      return "JAN";
    } else if (monthNumber == "02") {
      return "FEB"
    } else if (monthNumber == "03") {
      return "MAR"
    } else if (monthNumber == "04") {
      return "APR"
    } else if (monthNumber == "05") {
      return "MAY"
    } else if (monthNumber == "06") {
      return "JUN"
    } else if (monthNumber == "07") {
      return "JUL"
    } else if (monthNumber == "08") {
      return "AUG"
    } else if (monthNumber == "09") {
      return "SEPT"
    } else if (monthNumber == "10") {
      return "OCT"
    } else if (monthNumber == "11") {
      return "NOV"
    } else if (monthNumber == "12") {
      return "DEC"
    }
  };

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
        type,
        marginRight: right === 0 ? 1 : 0,
        backgroundColor: type == "h" ? "#4A57A9" : "",
        color: type == "h" ? "#fff" : ""
      }}
    >
      <Text style={{
        fontFamily: style,
        textAlign: align
      }}>{label}</Text>
    </View>
  );

  const AttendanceData = () => (
    <View style={styles.layout}>
      <View style={{ marginBottom: "10px" }}><Text style={{ backgroundColor: "#4A57A9", color: "#fff", padding: "8px", fontSize: 12, textAlign: "center" }}>{`${rowWiseData?.vendor_name} Bill For The Month Of ${getMonthName(rowWiseData?.month_year.slice(0, 2))}-${rowWiseData?.month_year.slice(3,)}`}</Text></View>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="Sl No."
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
          />
          <DisplayCells
            label="Institute"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label="Dept"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="End User"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Purpose"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Approver"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="End User Status"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Meal Date"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Meal Type"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label="Qty"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label="Rate"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label="Total"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label="Feedback"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
          />
        </DispayRow>
        {data.map((obj, i) => {
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
                label={obj.school_name_short}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
              />
              <DisplayCells
                key={i}
                label={obj.dept_name_short}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.mrrCreated_username}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.remarks || "-"}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.approver_name}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.approved_status == 1 ? "Approved" : obj.approved_status == 2 ? "Cancelled":"Pending"}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.mealDate}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.meal_type}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.approved_count}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
              />
              <DisplayCells
                key={i}
                label={obj.rate_per_count}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
              />
              <DisplayCells
                key={i}
                label={obj.total_amount}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
              />
              <DisplayCells
                key={i}
                label={obj.end_user_feedback_remarks || "-"}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />

            </DispayRow>
          );
        })}
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`Bill Report Of ${getMonthName(rowWiseData?.month_year.slice(0, 2))}-${rowWiseData?.month_year.slice(3,)}`}>
          <Page
            size={type == "print" ? "A2" : "A3"}
            style={styles.pageLayout}
          >
            <AttendanceData />
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
