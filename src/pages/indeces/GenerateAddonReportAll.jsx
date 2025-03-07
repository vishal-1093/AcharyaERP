import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
  Image
} from "@react-pdf/renderer";
import rightCursor from "../../assets/rightCursor.png";
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


export const GenerateAddonReportAll = (
  data,date
) => {
  const getMonthName = (monthNumber) => {
    if (monthNumber == "01") {
      return "Jan";
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
        fontWeight: type == "h" ? "heavy":"",
        fontFamily: type == "h" ? "Times-Bold":"",
        marginRight: right === 0 ? 1 : 0,
        backgroundColor: type == "h" ? "#33495E" : "",
        color: type == "h" ? "#fff" : ""
      }}
    >
      {labelType == "text" ? <Text style={{
        fontFamily: style,
        textAlign: align,
        paddingleft:padding
      }}>{label}</Text>:label}
    </View>
  );

  const ReportData = ({ listData, pageIndex }) => (
    <View style={{ ...styles.layout}}>
      <View style={{ marginBottom: "5px" }}>
        {!!date && <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center",fontWeight:"heavy",fontFamily:"Times-Bold" }}>{`Acharya Research Incentive For The Month Of ${getMonthName(moment(date).format("MM"))}-${moment(date).format("YYYY")}`}</Text>}
        {!date && <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center",fontWeight:"heavy",fontFamily:"Times-Bold" }}>{`Acharya Research Incentive For The All Month`}</Text>}
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
            label="Emp Code"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label="Name"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={4}
            labelType="text"
          />
          <DisplayCells
            label="Designation"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Department"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Institute"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label="Applied Date"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Research Type"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Approved Amount"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label="Pay Month"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
            labelType="text"
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
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={obj.empcode}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={obj.employee_name}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                padding="15px"
                customWidth={4}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={obj.designation_short_name}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                padding="15px"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={obj.dept_name_short}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="left"
                padding="15px"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={obj.schoolShortName}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={moment(obj.date).format("DD-MM-YYYY")}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={obj.researchType}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={obj.amount}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="right"
                customWidth={2}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={`${getMonthName(obj.credited_month)} ${obj.credited_year}`}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                customWidth={2}
                labelType="text"
              />
            </DispayRow>
          );
        })}
        <DispayRow>
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            labelType="text"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={4}
            labelType="text"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Total"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label={listData.rows.reduce((sum,acc)=> (sum + Number(acc.amount)),0)}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label=""
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
            labelType="text"
          />
        </DispayRow>
      </View>
      <View style={{ marginTop: "20px" }}>
        <Text style={{fontSize: 12}}>Approval Hierarchy :</Text>
        <View style={{ marginTop: "4px",display:"flex",flexDirection:"row",alignItems:"center",gap:"15px"}}>
          <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <Text style={{fontFamily:"Times-Bold",fontSize: 10}}> Faculty</Text>
          </View>

          <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <Image src={rightCursor} style={{width:"30px"}}/>
          <Text style={{fontFamily:"Times-Bold",fontSize: 10}}> HOD</Text>
          </View>

          <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <Image src={rightCursor} style={{width:"30px"}}/>
          <Text style={{fontFamily:"Times-Bold",fontSize: 10}}> HOI</Text>
          </View>

          <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <Image src={rightCursor} style={{width:"30px"}}/>
          <Text style={{fontFamily:"Times-Bold",fontSize: 10}}> ADR/ IPR Head </Text>
          </View>

          <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <Image src={rightCursor} style={{width:"30px"}}/>
          <Text  style={{fontFamily:"Times-Bold",fontSize: 10}}> Head QA</Text>
          </View>

          
          <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <Image src={rightCursor} style={{width:"30px"}}/>
          <Text style={{fontFamily:"Times-Bold",fontSize: 10}}>Head HR</Text>
          </View>

          <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <Image src={rightCursor} style={{width:"30px"}}/>
          <Text style={{fontFamily:"Times-Bold",fontSize: 10}}> Finance</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`Incentive Report`}>
          {data.map((ele, index) => (
            <Page
              key={index}
              size="A4"
              style={{ ...styles.pageLayout }}
            >
              <ReportData listData={ele} pageIndex={index} />
              <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
                <Text style={{ textAlign: "center", fontSize: 8,fontFamily:"Times-Bold" }}>
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
