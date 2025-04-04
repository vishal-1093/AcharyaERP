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


export const GenerateSchoolCounterSummary = (
  data, startDate, endDate, cashTotal, ddTotal, onlineTotal, paymentTotal, closingTotal
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

  const ReportData = ({ listData, pageIndex, cashTotal, ddTotal, onlineTotal, paymentTotal, closingTotal }) => (
    <View style={{ ...styles.layout }}>
      <View>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{`JMJ EDUCATION SOCIETY`}</Text>
      </View>
      <View style={{ marginBottom: "5px" }}>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "4px", fontSize: 12, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{`INSTITUTE RECEIPT SUMMARY FROM ${moment(startDate).format("DD-MM-YYYY")} TO ${moment(endDate).format("DD-MM-YYYY")}`}</Text>
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
          <DisplayCells
            label="Inst"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label="Cash"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={4}
            labelType="text"
          />
          <DisplayCells
            label="DD"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Online"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Payment"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label="Closing Cash"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="RPT Summary"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
        </DispayRow>
        {listData.rows.map((obj, i) => {
          return (
            <DispayRow key={i}>
              <DisplayCells
                key={i}
                label={(pageIndex) * (35) + (i + 1)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={(obj?.schoolName)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                customWidth={2}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.CASH % 1 !== 0) ? (obj.CASH)?.toFixed(2) : (obj.CASH) || 0)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="right"
                padding="15px"
                customWidth={4}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.DD % 1 !== 0) ? (obj.DD)?.toFixed(2) : (obj.DD) || 0)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="right"
                padding="15px"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.ONLINE % 1 !== 0) ? (obj.ONLINE)?.toFixed(2) : (obj.ONLINE) || 0)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="right"
                padding="15px"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj?.payment % 1 !== 0) ? (obj.payment)?.toFixed(2) : (obj.payment) || 0)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="right"
                customWidth={2}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj?.CASH) - (obj?.payment)) % 1 !== 0 ? ((obj?.CASH) - (obj?.payment))?.toFixed(2) : ((obj?.CASH) - (obj?.payment)) || 0}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="right"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj?.CASH + obj?.DD + obj?.ONLINE) % 1 !== 0 ? (obj.CASH + obj?.DD + obj.ONLINE)?.toFixed(2) : (obj.CASH + obj.DD + obj.ONLINE)) || 0}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="right"
                customWidth={3}
                labelType="text"
              />
            </DispayRow>
          );
        })}
        <DispayRow>
          <DisplayCells
            label={""}
            style="Times-Roman"
            right={1}
            bottom={1}
            align="center"
            labelType="text"
          />
          <DisplayCells
            label={"TOTAL"}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="left"
            customWidth={2}
            labelType="text"
          />

          <DisplayCells
            label={Number(cashTotal % 1 !== 0 ? cashTotal?.toFixed(2) : cashTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            padding="15px"
            customWidth={4}
            labelType="text"
          />

          <DisplayCells
            label={Number(ddTotal % 1 !== 0 ? ddTotal?.toFixed(2) : ddTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            padding="15px"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label={Number(onlineTotal % 1 !== 0 ? onlineTotal?.toFixed(2) : onlineTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            padding="15px"
            customWidth={3}
            labelType="text"
          />

          <DisplayCells
            label={Number(paymentTotal % 1 !== 0 ? paymentTotal?.toFixed(2) : paymentTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            customWidth={2}
            labelType="text"
          />

          <DisplayCells
            label={Number(closingTotal % 1 !== 0 ? closingTotal?.toFixed(2) : closingTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label={Number((cashTotal + ddTotal + onlineTotal) % 1 !== 0 ? (cashTotal + ddTotal + onlineTotal)?.toFixed(2) : (cashTotal + ddTotal + onlineTotal)) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            customWidth={3}
            labelType="text"
          />
        </DispayRow>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`INSTITUTE RECEIPT SUMMARY`}>
          {data.map((ele, index) => (
            <Page
              key={index}
              size="A4"
              style={{ ...styles.pageLayout }}
            >
              <ReportData listData={ele} pageIndex={index} cashTotal={cashTotal} ddTotal={ddTotal} onlineTotal={onlineTotal} paymentTotal={paymentTotal} closingTotal={closingTotal} />
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