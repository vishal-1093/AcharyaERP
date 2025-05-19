import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "20px 50px 0px 50px" },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  tableRow: {
    flexDirection: "row",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "50px"
  },
  userDetailStyle: {
    fontSize: 12,
    fontWight:"heavy",
    fontFamily: "Times-Bold",
  }
});

export const GenerateLockedBillingReport = (
  data, rowWiseData, type
) => {
  const getMonthName = (monthNumber) => {
    if (monthNumber == "01") {
      return "Jan"
    } else if (monthNumber == "02") {
      return "Feb"
    } else if (monthNumber == "03") {
      return "Mar"
    } else if (monthNumber == "04") {
      return "Apr"
    } else if (monthNumber == "05") {
      return "May"
    } else if (monthNumber == "06") {
      return "Jun"
    } else if (monthNumber == "07") {
      return "Jul"
    } else if (monthNumber == "08") {
      return "Aug"
    } else if (monthNumber == "09") {
      return "Sept"
    } else if (monthNumber == "10") {
      return "Oct"
    } else if (monthNumber == "11") {
      return "Nov"
    } else if (monthNumber == "12") {
      return "Dec"
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
        fontSize: 9,
        fontWeight: type == "h" ? "heavy":"",
        fontFamily: type == "h" ? "Times-Bold":"",
        marginRight: right === 0 ? 1 : 0,
        backgroundColor: type == "h" ? "#33495E" : "",
        color: type == "h" ? "#fff" : ""
      }}
    >
      <Text style={{
        fontFamily: style,
        textAlign: align
      }}>{label}</Text>
    </View>
  );

  const BillData = ({data, listData, pageIndex }) => (
    <View style={{ ...styles.layout}}>
      <View style={{ marginBottom: "10px" }}><Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center",fontWeight:"heavy",fontFamily:"Times-Bold" }}>{`${rowWiseData?.vendor_name} Bill For The Month Of ${getMonthName(rowWiseData?.month_year.slice(0, 2))}-${rowWiseData?.month_year.slice(3,)}`}</Text></View>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="S.No."
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
        {listData.rows.map((obj, i) => {
          return (
            <DispayRow key={i}>
              <DisplayCells
                key={i}
                label={(pageIndex) * (25) + (i + 1)}
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
                label={obj.department}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.endUser}
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
                label={obj.mealDate}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.menuType}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
              />
              <DisplayCells
                key={i}
                label={obj.qty}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
              />
              <DisplayCells
                key={i}
                label={obj.rate}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
              />
              <DisplayCells
                key={i}
                label={obj.total}
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
        {(pageIndex+1) == data.length && <DispayRow>
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label="Total"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label={Math.trunc(rowWiseData?.total)}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
          />
        </DispayRow>}
      </View>
    </View>
  );

  const UserDetail = () => (
    <View style={{ ...styles.flex}}>
      <View style={{ ...styles.userDetailStyle}}>
        <Text>Verified By</Text>
        <Text style={{ marginTop: "5px" }}>Name : {rowWiseData?.lockedByUserName}</Text>
        <Text style={{ marginTop: "5px" }}>Date & Time : {moment(rowWiseData?.lock_date).format("DD-MM-YYYY hh:mm a")}</Text>
        <Text style={{ marginTop: "5px" }}>IP Address : {rowWiseData?.lock_ipAddress}</Text>
      </View>
      <View style={{ ...styles.userDetailStyle }}>
        <Text>Approved By</Text>
        <Text style={{ marginTop: "5px" }}>Name : {rowWiseData?.approvedByUserName}</Text>
        <Text style={{ marginTop: "5px" }}>Date & Time :  {moment(rowWiseData?.approved_date).format("DD-MM-YYYY hh:mm a")}</Text>
        <Text style={{ marginTop: "5px" }}>IP Address : {rowWiseData?.Approved_ipAddress}</Text>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`Bill Report Of ${getMonthName(rowWiseData?.month_year.slice(0, 2))}-${rowWiseData?.month_year.slice(3,)}`}>
          {data.map((ele, index) => (
            <Page
              key={index}
              size={"A3"}
              style={{ ...styles.pageLayout }}
            >
              <BillData data={data} listData={ele} pageIndex={index} />
              <View style={{ position: "absolute", bottom: "25px", width: "100%" }}>
                {type == "print" && index === data.length - 1 && <UserDetail />}
                <Text style={{ textAlign: "center", fontSize: 12, fontFamily: "Times-Bold" }}>
                  Page {index + 1} of {data.length}
                </Text>
              </View>
            </Page>
          ))}
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
