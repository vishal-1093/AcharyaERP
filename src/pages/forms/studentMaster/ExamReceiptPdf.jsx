import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  PDFViewer,
  View,
  Font,
  Image,
} from "@react-pdf/renderer";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import logo from "../../../assets/acc.png"; // Logo import
import { useLocation } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import numberToWords from "number-to-words";

// Register the fonts
Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

// Create styles
const styles = StyleSheet.create({
  pageLayout: {
    margin: 20,
  },
  viewer: {
    width: "100%",
    height: "100vh", // Ensure the viewer fills the screen
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  logo: {
    position: "absolute",
    top: "80%", // Adjusted to center logo vertically
    left: "50%", // Horizontally center the logo
    transform: "translate(-50%, -50%)", // Centering fix
    width: "20%", // Set width of the logo
    height: "auto", // Keep aspect ratio
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Times-Roman",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start", // Align items to the left
    marginBottom: 10,
    width: "100%",
  },
  row1: {
    flexDirection: "row",
    // justifyContent: "flex-end", // Align items to the left
    marginBottom: 10,
    width: "100%",
  },

  label1: {
    width: "50%",
    textAlign: "right",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    fontSize: 11,
  },
  label2: {
    width: "50%",
    textAlign: "left",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    fontSize: 11,
  },
  label3: {
    width: "100%",
    textAlign: "right",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    fontSize: 11,
  },
  label: {
    width: "50%",
    textAlign: "left",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    fontSize: 11,
  },
  value: {
    width: "50%",
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  tableWrapper: {
    width: "100%", // Adjusted for centering
    margin: "0 auto", // Center the table horizontally
    marginTop: 10,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center", // Align cells in the row
    justifyContent: "center", // Center content within the row
  },
  timeTableHeaderStyle: {
    width: "20%", // Width of each header cell
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
    textAlign: "center", // Center text inside header cells
  },
  timeTableThHeaderStyleParticulars1: {
    width: "20%",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },

  timeTableThHeaderStyleParticulars: {
    width: "40%",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },
  timeTableThStyle: {
    padding: "5px",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    textAlign: "center", // Center text inside header cells
    fontSize: 11,
  },
  timeTableThStyle1: {
    padding: "5px",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    textAlign: "center", // Center text inside cells
    fontSize: 11,
  },
  timeTableThStyle2: {
    padding: "5px",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    textAlign: "right", // Right text inside cells
    fontSize: 11,
  },
  timeTableRowStyle: {
    flexDirection: "row",
  },
});

// Helper Components
const TableHeader = ({ years }) => (
  <View style={styles.tableRow} fixed>
    <View style={styles.timeTableThHeaderStyleParticulars}>
      <Text style={styles.timeTableThStyle1}>Particulars</Text>
    </View>
    {years?.map((year, i) => (
      <View style={styles.timeTableThHeaderStyleParticulars1} key={i}>
        <Text style={styles.timeTableThStyle1}>{`Sem-${year}`}</Text>
      </View>
    ))}
    <View style={styles.timeTableThHeaderStyleParticulars1}>
      <Text style={styles.timeTableThStyle1}>Total</Text>
    </View>
  </View>
);

const TableBody = ({
  years,
  yearsTotal,
  data,
  voucherHeads,
  totalAmount,
  tableResponse,
}) => (
  <>
    {voucherHeads?.map((voucher, i) => (
      <View style={styles.tableRow} key={i}>
        <View style={styles.timeTableThHeaderStyleParticulars}>
          <Text style={styles.timeTableThStyle1}>{voucher}</Text>
        </View>

        {years?.map((year) => {
          return (
            <>
              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyle2}>
                  {tableResponse[`${voucher}-${year}`]}
                </Text>
              </View>
            </>
          );
        })}

        <View style={styles.timeTableThHeaderStyleParticulars1}>
          <Text style={styles.timeTableThStyle2}>
            {data?.[voucher]?.[0]?.totalAmount}
          </Text>
        </View>
      </View>
    ))}

    <View style={styles.tableRow}>
      <View style={styles.timeTableThHeaderStyleParticulars}>
        <Text style={styles.timeTableThStyle1}>Total</Text>
      </View>
      {years?.map((year, i) => (
        <View style={styles.timeTableThHeaderStyleParticulars1} key={i}>
          <Text style={styles.timeTableThStyle2}>
            {yearsTotal?.[year]?.reduce(
              (total, sum) => Number(total) + Number(sum.amount),
              0
            )}
          </Text>
        </View>
      ))}
      <View style={styles.timeTableThHeaderStyleParticulars1}>
        <Text style={styles.timeTableThStyle2}>{totalAmount}</Text>
      </View>
    </View>
  </>
);

const App = () => {
  const [receiptData, setReceiptData] = useState([]);
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [data, setData] = useState([]);
  const [tableResponse, setTableResponse] = useState();
  const [yearsTotal, setYearsTotal] = useState([]);

  const location = useLocation();
  const state = location?.state;

  useEffect(() => {
    getExamFeeReceipt();
  }, []);

  const getExamFeeReceipt = async () => {
    const examResponse = await axios.get(
      `/api/finance/getExamFeeReceiptForRceiptByFeeRceiptId/${state.fee_receipt_id}`
    );
    setReceiptData(examResponse.data.data);

    const years =
      examResponse?.data?.data?.feeReceiptWithStudentDetails?.[0]?.paid_year.split(
        ","
      );

    setVoucherHeads(Object.keys(examResponse.data.data.examFeeReceipt));

    const yearsData = {};

    years?.forEach((year) => {
      yearsData[year] = [];
    });

    examResponse?.data?.data?.examFeeReceiptForSem.forEach((voucher) => {
      if (yearsData[voucher.paidYear]) {
        yearsData[voucher.paidYear].push(voucher);
      }
    });

    const testData = {};

    Object.keys(examResponse.data.data.examFeeReceipt).forEach((voucher) => {
      const value = examResponse.data.data.examFeeReceipt[voucher];
      years.forEach((year) => {
        const filter = value.filter((obj) => obj.paidYear === Number(year));
        testData[`${voucher}-${year}`] =
          filter.length > 0 ? filter[0].amount : 0;
      });
    });

    setTableResponse(testData);

    setYearsTotal(yearsData);

    setData(examResponse.data.data.examFeeReceipt);
  };

  const years =
    receiptData?.feeReceiptWithStudentDetails?.[0]?.paid_year.split(",");

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with a space
  }

  const MyDocument = () => (
    <View style={styles.pageLayout}>
      <Image src={logo} style={styles.logo} />
      <Text style={styles.title}>EXAM FEE RECEIPT</Text>

      {/* Displaying data with label and value side by side */}
      <View style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.student_name}
        </Text>
        <Text style={styles.label}>Receipt No.</Text>
        <Text style={styles.value}>
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.fee_receipt}
        </Text>
        <Text style={styles.label}>Fee Category</Text>
        <Text style={styles.value}>
          {
            receiptData?.feeReceiptWithStudentDetails?.[0]
              ?.fee_admission_category_short_name
          }
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>AUID</Text>
        <Text style={styles.value}>
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.auid}
        </Text>
        <Text style={styles.label}>Receipt Date</Text>
        <Text style={styles.value}>
          {moment(
            receiptData?.feeReceiptWithStudentDetails?.[0]?.created_date
          ).format("DD-MM-YYYY")}
        </Text>
        <Text style={styles.label}>Mobile</Text>
        <Text style={styles.value}>
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.mobile}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>USN</Text>
        <Text style={styles.value}>
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.usn}
        </Text>
        <Text style={styles.label}>FC Year</Text>
        <Text style={styles.value}>
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.financial_year}
        </Text>
        <Text style={styles.label}>Created By</Text>
        <Text style={styles.value}>
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.created_username}
        </Text>
      </View>

      {/* Render Table Header and Body */}
      <View style={styles.tableWrapper}>
        <TableHeader years={years} />
        <TableBody
          data={data}
          totalAmount={receiptData?.totalPaidAmount}
          years={years}
          voucherHeads={voucherHeads}
          yearsTotal={yearsTotal}
          tableResponse={tableResponse}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Transaction Type :{" "}
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.transaction_type}
        </Text>

        <Text style={styles.label}>
          Transaction No. :{" "}
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.transaction_no ??
            "NA"}
        </Text>

        <Text style={styles.label}>
          Trasaction Date :{" "}
          {receiptData?.feeReceiptWithStudentDetails?.[0]?.transaction_date ??
            "NA"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Remarks : {receiptData?.feeReceiptWithStudentDetails?.[0]?.remarks}
        </Text>
      </View>
      <View style={styles.row1}>
        <Text style={styles.label2}>
          Received a sum of Rs.{" "}
          {toUpperCamelCaseWithSpaces(
            numberToWords.toWords(
              Number(
                receiptData?.feeReceiptWithStudentDetails?.[0]?.paid_amount ??
                  ""
              )
            )
          )}
          /-
        </Text>
        <Text style={styles.label1}>Signature </Text>
      </View>
      <View style={styles.row1}>
        <Text style={styles.label3}>(cashier) </Text>
      </View>
    </View>
  );

  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Exam Fee Receipt">
        <Page size="A4">
          <MyDocument />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default App;
