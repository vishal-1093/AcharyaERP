import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 8,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "30px 30px 0px 30px" },
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
    margin: "20px"
  },
  userDetailStyle: {
    fontSize: 12,
    fontFamily: "Times-Roman",
  }
});


export const GenerateSalaryMisReport = (
  salaryType, data, date, columns,totalValue
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
        fontSize: 9,
        fontWeight: type == "h" ? "heavy" : "",
        fontFamily: type == "h" ? "Times-Bold" : "",
        marginRight: right === 0 ? 1 : 0,
        backgroundColor: type == "h" ? "#33495E" : "",
        color: type == "h" ? "#fff" : ""
      }}
    >
      {labelType == "text" ? <Text style={{
        fontFamily: style,
        textAlign: align,
        paddingleft: padding
      }}>{label}</Text> : label}
    </View>
  );

  const ReportData = ({ salaryType, pageIndex, date, listData, columns,totalValue }) => (
    <View style={{ ...styles.layout }}>
      <View>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{`JMJ EDUCATION SOCIETY`}</Text>
      </View>
      <View style={{ marginBottom: "5px" }}>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "4px", fontSize: 12, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{date ? `${(salaryType).charAt(0).toUpperCase() + (salaryType).slice(1).toLowerCase()} Report For The Month of ${moment(date).format("MMM").toUpperCase()} ${moment(date).format("YYYY")}` : `${(salaryType).charAt(0).toUpperCase() + (salaryType).slice(1).toLowerCase()} Report For All Month`}</Text>
      </View>
      <View style={[styles.borderTable]}>
        <DispayRow>
          {columns.filter((f) => !f.hide).map((ele, index) => (
            index == 0 ?
              <DisplayCells
                label="S.No."
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="center"
                labelType="text"
              /> :
              <DisplayCells
                label={ele.headerName}
                style="Times-Bold"
                right={1}
                bottom={1}
                type="h"
                align="center"
                customWidth={ele.headerName == "Name" ? 3 : ele.headerName == "Bank Account No." ? 2 : ele.headerName == "IFSC No" ? 2 :""}
                labelType="text"
              />
          ))}
        </DispayRow>
        {listData.rows.map((obj, i) => {
          return (
            <>
            <DispayRow key={i}>
              {columns.filter((f) => !f.hide).map((c, id) => (
                id == 0 ? <DisplayCells
                  key={i}
                  label={(pageIndex) * (35) + (i + 1)}
                  style="Times-Roman"
                  right={1}
                  bottom={1}
                  align="center"
                  labelType="text"
                /> :
                  <DisplayCells
                    key={i}
                    label={typeof (obj[`${c.field}`]) == "number" ? new Intl.NumberFormat().format((obj[`${c.field}`])) : (obj[`${c.field}`])}
                    style="Times-Roman"
                    right={1}
                    bottom={1}
                    customWidth={c.field == "employee_name" ? 3 : c.field == "bank_account_no" ? 2 : c.field == "bank_ifsccode" ? 2 : ""}
                    align={c.field == "netpay" ? "right" : "left"}
                    labelType="text"
                  />))}
            </DispayRow>
            </>
          );
        })}
        <DispayRow>
          {columns.filter((f) => !f.hide).map((c, idx) => (
            <DisplayCells
              key={idx}
              label={(columns.filter((f) => !f.hide).length - 3) == idx ? "Grand Total": (columns.filter((f) => !f.hide).length - 1) == idx ? new Intl.NumberFormat().format(totalValue) : ""}
              style="Times-Bold"
              right={1}
              bottom={1}
              align={(columns.filter((f) => !f.hide).length - 3) == idx ? "center":"right"}
              customWidth={c.field == "employee_name" ? 3 : c.field == "bank_account_no" ? 2 : c.field == "bank_ifsccode"? 2: ""}
              labelType="text"
            />
          ))}
        </DispayRow>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`Salary Mis`}>
          {data.map((ele, index) => (
            <Page
              key={index}
              size="A4"
              style={{ ...styles.pageLayout }}
            >
              <ReportData salaryType={salaryType} pageIndex={index} date={date} listData={ele} columns={columns} totalValue={totalValue}/>
              <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
                <Text style={{ textAlign: "center", fontSize: 8, fontFamily: "Times-Bold" }}>
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