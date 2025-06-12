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
  schoolShortName, pageSNo, salaryType, data = [], date, columns, totalValue, totalGrossEarning, esimTotal,
  attendanceColumns, attendanceRows, particularsColumns, earningRows, deductionRows, employeeType, consultationTotal, consultantionTdsTotal, consultationPayableTotal
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

  const ReportData = ({ data, schoolShortName, salaryType, pageIndex, date, listData, columns, totalValue, totalGrossEarning, esimTotal, employeeType,
    consultationTotal, consultantionTdsTotal, consultationPayableTotal
  }) => (
    <View style={{ ...styles.layout }}>
      <View>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{`${schoolShortName && salaryType !== "school" ? schoolShortName : `JMJ`} EDUCATION SOCIETY`}</Text>
      </View>
      <View style={{ marginBottom: "5px" }}>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "4px", fontSize: 12, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{date && employeeType ? `${(employeeType)?.toUpperCase()} ${(salaryType)?.toUpperCase()} Report For The Month of ${moment(date).format("MMM").toUpperCase()} ${moment(date).format("YYYY")}` : `${(salaryType)?.toUpperCase()} Report For The Month of ${moment(date).format("MMM").toUpperCase()} ${moment(date).format("YYYY")}`}</Text>
      </View>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="S.No."
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            labelType="text"
          />
          {columns.filter((f) => !f.hide).map((ele, index) => (
            <DisplayCells
              key={index}
              label={ele.headerName == "Name" ? "Emp Name" : ele.headerName}
              style="Times-Bold"
              right={1}
              bottom={1}
              type="h"
              align="center"
              customWidth={ele.headerName == "Emp Name" || ele.headerName == "Name" ? 3 : ele.headerName == "Bank Account No." ? 2 : ele.headerName == "IFSC No" ? 2 : ""}
              labelType="text"
            />
          ))}
        </DispayRow>
        {listData.rows.map((obj, i) => {
          return (
            <>
              <DispayRow key={i}>
                <DisplayCells
                  key={i}
                  label={(pageIndex) * (pageSNo) + (i + 1)}
                  style="Times-Roman"
                  right={1}
                  bottom={1}
                  align="center"
                  labelType="text"
                />
                {columns.filter((f) => !f.hide).map((c, id) => (
                  <DisplayCells
                    key={i}
                    label={typeof (obj[`${c.field}`]) == "number" ? (obj[`${c.field}`]) : (obj[`${c.field}`]?.toUpperCase())}
                    style="Times-Roman"
                    right={1}
                    bottom={1}
                    customWidth={c.field == "employee_name" ? 3 : c.field == "bank_account_no" ? 2 : c.field == "bank_ifsccode" ? 2 : ""}
                    align={c.field == "netpay" || c.field == "lic" || c.field == "advance" || c.field == "tds" || c.field == "gross_pay" ||
                      c.field == "pt" || c.field == "total_earning" || c.field == "totalNetPay" || c.field == "esi" || c.field == "esi_contribution_employee" ||
                      c.field == "pay_days" || c.field == "grossWages" || c.field == "edliWages" || c.field == "epfWages" || c.field == "epsWages" ||
                      c.field == "epscontriRemitted" || c.field == "epfContriRemitted" || c.field == "epfEpsDiffRemitted" ||
                      c.field == "ncpDays" || c.field == "refundOfAdvances" || c.field == "s715" || c.field == "s742" || c.field == "s725" ? "right" : c.field == "empcode" || c.field == "bank_account_no" ||
                        c.field == "lic_number" || c.field == "schoolNameShort" || c.field == "school" ? "center" : "left"}
                    labelType="text"
                  />))}
              </DispayRow>
            </>
          );
        })}
        {(pageIndex + 1) == data.length && salaryType !== "epf" && <DispayRow>
          <DisplayCells
            key={new Date()}
            label=""
            right={1}
            bottom={1}
          />
          {columns.filter((f) => !f.hide).map((c, idx) => (
            <DisplayCells
              key={idx}
              label={salaryType == "esi" && salaryType != "school" && (columns.filter((f) => !f.hide).length - 5) == idx ? "Grand Total" : ((salaryType != "esi" && salaryType != "school" && salaryType != "tds" && salaryType !== "pt" && salaryType !== "epf" && salaryType != "summary") && (columns.filter((f) => !f.hide).length - 2) == idx) ? "Grand Total" :
                ((salaryType != "esi" && salaryType != "school" && salaryType != "tds" && salaryType == "pt" && salaryType !== "epf") && (columns.filter((f) => !f.hide).length - 3) == idx) ? "Grand Total" :
                  ((salaryType == "tds") && (columns.filter((f) => !f.hide).length - 3) == idx) ? "Grand Total" :
                    (salaryType != "esi" && salaryType == "school") && (columns.filter((f) => !f.hide).length - 2) == idx ? "Grand Total" :
                      (salaryType == "summary" && employeeType == "consultant") && (columns.filter((f) => !f.hide).length - 4) == idx ? "Grand Total" :
                        ((salaryType == "esi") && (columns.filter((f) => !f.hide).length - 3) == idx) ? totalGrossEarning :
                          ((salaryType == "tds" || salaryType == "pt") && (columns.filter((f) => !f.hide).length - 2) == idx) ? totalGrossEarning :
                            ((salaryType == "esi") && (columns.filter((f) => !f.hide).length - 2) == idx) ? totalValue :
                              (salaryType == "esi" && (columns.filter((f) => !f.hide).length - 1) == idx) ? esimTotal :
                                (salaryType != "esi" && salaryType != "summary" && (columns.filter((f) => !f.hide).length - 1) == idx) ? totalValue :
                                  salaryType == "epf" && (columns.filter((f) => !f.hide).length - 10) == idx ? "Grand Total" :
                                    (salaryType == "summary" && employeeType == "consultant" && (columns.filter((f) => !f.hide).length - 1) == idx) ? consultationPayableTotal :
                                      (salaryType == "summary" && employeeType == "consultant" && (columns.filter((f) => !f.hide).length - 2) == idx) ? consultantionTdsTotal :
                                        (salaryType == "summary" && employeeType == "consultant" && (columns.filter((f) => !f.hide).length - 3) == idx) ? consultationTotal : ""}
              style="Times-Bold"
              right={1}
              bottom={1}
              align={(salaryType == "esi" && salaryType != "school" && (columns.filter((f) => !f.hide).length - 5) == idx) ? "center" :
                ((salaryType == "advance" || salaryType == "lic" || salaryType == "bank" || salaryType == "school") && columns.filter((f) => !f.hide).length - 2) == idx ? "center" :
                  ((salaryType !== "esi" && salaryType != "school") && (salaryType == "tds" || salaryType == "pt") && columns.filter((f) => !f.hide).length - 3) == idx ? "center" :
                    ((salaryType == "epf") && columns.filter((f) => !f.hide).length - 10) == idx ? "center" : "right"}
              customWidth={c.field == "employee_name" ? 3 : c.field == "bank_account_no" ? 2 : c.field == "bank_ifsccode" ? 2 : ""}
              labelType="text"
            />
          ))}
        </DispayRow>}
      </View>
    </View>
  );

  const SummaryComponent = ({ attendanceRows, attendanceColumns, particularsColumns, earningRows, deductionRows, employeeType }) => (
    <>
      {employeeType == "regular" && <AttendanceData attendanceRows={attendanceRows} attendanceColumns={attendanceColumns} />}
      {employeeType == "regular" && <ParticularsData particularsColumns={particularsColumns} earningRows={earningRows} deductionRows={deductionRows} />}
    </>
  );

  const AttendanceData = ({ attendanceRows, attendanceColumns }) => (
    <View style={{ ...styles.layout }}>
      <View>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{`JMJ EDUCATION SOCIETY`}</Text>
      </View>
      <View style={{ marginBottom: "5px" }}>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "4px", fontSize: 12, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{date ? `${(employeeType)?.toUpperCase()} ${(salaryType)?.toUpperCase()} Report For The Month of ${moment(date).format("MMM").toUpperCase()} ${moment(date).format("YYYY")}` : `${(salaryType)?.toUpperCase()} Report For All Month`}</Text>
      </View>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="S.No."
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            labelType="text"
          />
          {attendanceColumns.filter((f) => !f.hide).map((ele, index) => (
            <DisplayCells
              key={index}
              label={ele.headerName}
              style="Times-Bold"
              right={1}
              bottom={1}
              type="h"
              align="center"
              labelType="text"
            />
          ))}
        </DispayRow>
        return (
        <>
          {attendanceRows.map((obj, i) => (
            <DispayRow key={i}>
              <DisplayCells
                key={i}
                label={(i + 1)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                labelType="text"
              />
              {attendanceColumns.filter((f) => !f.hide).map((c, id) => (
                <DisplayCells
                  key={i}
                  label={typeof (obj[`${c.field}`]) == "number" ? (obj[`${c.field}`]) : (obj[`${c.field}`])}
                  style="Times-Roman"
                  right={1}
                  bottom={1}
                  align={c.field == "value" ? "right" : c.field == "name" ? "left" : "center"}
                  labelType="text"
                />))}
            </DispayRow>
          ))}
        </>
        <DispayRow>
          <DisplayCells
            key={new Date()}
            label=""
            right={1}
            bottom={1}
          />
          {attendanceColumns.filter((f) => !f.hide).map((c, idx) => (
            <DisplayCells
              key={idx}
              label={salaryType == "summary" && (attendanceColumns.filter((f) => !f.hide).length - 2) == idx ? "Grand Total" :
                salaryType == "summary" && (attendanceColumns.filter((f) => !f.hide).length - 1) == idx ?
                  attendanceRows.reduce((acc, curr) => acc + curr?.value, 0) : ""}
              style="Times-Bold"
              right={1}
              bottom={1}
              align={(salaryType == "summary" && (attendanceColumns.filter((f) => !f.hide).length - 2) == idx) ? "center" :
                salaryType == "summary" && (attendanceColumns.filter((f) => !f.hide).length - 1) == idx ? "right" : ""}
              labelType="text"
            />
          ))}
        </DispayRow>
        );
      </View>
    </View>
  );

  const ParticularsData = ({ particularsColumns, earningRows, deductionRows }) => (
    <View style={{ ...styles.layout }}>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="S.No."
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            labelType="text"
          />
          {particularsColumns.filter((f) => !f.hide).map((ele, index) => (
            <DisplayCells
              key={index}
              label={ele.headerName}
              style="Times-Bold"
              right={1}
              bottom={1}
              type="h"
              align="center"
              labelType="text"
            />
          ))}
        </DispayRow>
        return (
        <>
          {[...earningRows, ...deductionRows].map((obj, i) => (
            <DispayRow key={i}>
              <DisplayCells
                key={i}
                label={(i + 1)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                labelType="text"
              />
              {particularsColumns.filter((f) => !f.hide).map((c, id) => (
                <DisplayCells
                  key={i}
                  label={typeof (obj[`${c.field}`]) == "number" ? (obj[`${c.field}`]) : (obj[`${c.field}`])}
                  style={obj.name == "Total Gross Salary" || obj.name == "Net Salary Payable" ? "Times-Bold" : "Times-Roman"}
                  right={1}
                  bottom={1}
                  align={c.field == "value" ? "right" : c.field == "name" ? "left" : "center"}
                  labelType="text"
                />))}
            </DispayRow>
          ))}
        </>
        );
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`Salary Mis`}>
          {!(salaryType == "summary") && data.map((ele, index) => (
            <Page
              key={index}
              size="A4"
              style={{ ...styles.pageLayout }}
            >
              <ReportData data={data} schoolShortName={schoolShortName} pageSNo={pageSNo} salaryType={salaryType} pageIndex={index} date={date} listData={ele}
                columns={columns} totalValue={totalValue} totalGrossEarning={totalGrossEarning}
                esimTotal={esimTotal} />
              <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
                <Text style={{ textAlign: "center", fontSize: 8, fontFamily: "Times-Bold" }}>
                  Page {index + 1} of {data.length}
                </Text>
              </View>
            </Page>
          ))}
          {(salaryType == "summary" && employeeType == "consultant") && data.map((ele, index) => (
            <Page
              key={index}
              size="A4"
              style={{ ...styles.pageLayout }}
            >
              <ReportData data={data} schoolShortName={schoolShortName} pageSNo={pageSNo} salaryType={salaryType} pageIndex={index} date={date} listData={ele}
                columns={columns} totalValue={totalValue} totalGrossEarning={totalGrossEarning}
                esimTotal={esimTotal} employeeType={employeeType} consultationTotal={consultationTotal} consultantionTdsTotal={consultantionTdsTotal} consultationPayableTotal={consultationPayableTotal} />
              <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
                <Text style={{ textAlign: "center", fontSize: 8, fontFamily: "Times-Bold" }}>
                  Page {index + 1} of {data.length}
                </Text>
              </View>
            </Page>
          ))}
          {salaryType == "summary" && employeeType == "regular" && <Page
            key={new Date()}
            size="A4"
            style={{ ...styles.pageLayout }}
          >
            <SummaryComponent attendanceColumns={attendanceColumns} attendanceRows={attendanceRows}
              particularsColumns={particularsColumns} earningRows={earningRows} deductionRows={deductionRows} employeeType={employeeType}
            />
          </Page>}
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};