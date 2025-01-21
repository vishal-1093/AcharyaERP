import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  PDFViewer,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../assets/acc.png"; // Logo import
import { useLocation } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import numberToWords from "number-to-words";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";

// Register the Arial font
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
    top: "50%", // Adjusted to center logo vertically
    left: "50%", // Horizontally center the logo
    transform: "translate(-50%, -50%)", // Centering fix
    width: "20%", // Set width of the logo
    height: "auto", // Keep aspect ratio
  },
  feetemplateTitle: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Times-Bold",
  },

  column: {
    flexDirection: "row",
  },

  row: {
    flexDirection: "row",
    justifyContent: "flex-start", // Align items to the left
    marginBottom: 5,
    width: "33%",
  },

  row2: {
    flexDirection: "row",
    justifyContent: "flex-start", // Align items to the left
    marginBottom: 5,
    width: "33%",
  },

  transactionRow: {
    flexDirection: "row",
    marginBottom: 7,
    width: "55%",
  },

  transactionRow1: {
    flexDirection: "row",
    marginBottom: 7,
    width: "45%",
  },

  label1: {
    width: "100%",
    textAlign: "right",
    fontFamily: "Times-Bold",
    fontSize: 10,
  },
  label2: {
    width: "70%",
    textAlign: "left",
    fontFamily: "Times-Bold",
    fontSize: 10,
  },

  label: {
    width: "40%",
    textAlign: "left",
    fontFamily: "Times-Bold",
    fontSize: 10,
  },

  label4: {
    width: "20%",
    textAlign: "left",
    fontFamily: "Times-Bold",
    fontSize: 10,
  },
  colon: {
    width: "2%",
    textAlign: "center",
    fontFamily: "Times-Bold",
    fontSize: 10,
  },
  value4: {
    width: "79%",
    fontSize: 11,
    fontFamily: "Times-Roman",
  },

  value: {
    width: "60%",
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
    padding: "3px",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    textAlign: "center", // Center text inside header cells
    fontSize: 10,
  },
  headers: {
    padding: "3px",
    fontFamily: "Times-Bold",
    fontWeight: "bold",
    textAlign: "left", // Left text inside cells
    fontSize: 10,
  },
  headersValue: {
    padding: "3px",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    textAlign: "left", // Left text inside cells
    fontSize: 10,
  },
  semester: {
    padding: "3px",
    fontFamily: "Times-Bold",
    fontWeight: "bold",
    textAlign: "center", // Left text inside cells
    fontSize: 10,
  },
  transactionNo: {
    width: "30%",
    textAlign: "left",
    fontFamily: "Times-Bold",
    fontStyle: "bold",
    fontSize: 10,
  },

  transactionNoValue: {
    width: "70%",
    justifyContent: "flex-start",
    fontFamily: "Times-Roman",
    fontStyle: "bold",
    fontSize: 10,
  },

  transactionDateLabel: {
    width: "80%",
    textAlign: "right",
    fontFamily: "Times-Bold",
    fontSize: 10,
  },

  transactionDateValue: {
    width: "20%",
    textAlign: "right",
    fontFamily: "Times-Roman",
    fontSize: 11,
  },

  timeTableThStyle2: {
    padding: "3px",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    textAlign: "right", // Right text inside cells
    fontSize: 10,
  },
  remarksRow: {
    flexDirection: "row",
    marginBottom: 7,
    width: "100%",
  },
  remarksLabel: {
    width: "10%",
    textAlign: "left",
    fontFamily: "Times-Bold",
    fontSize: 10,
  },
  remarksValue: {
    width: "90%",
    textAlign: "left",
    fontFamily: "Times-Roman",
    fontSize: 10,
  },
  sumRow: {
    flexDirection: "row",
    marginBottom: 7,
    width: "90%",
  },
  signatureRow: {
    flexDirection: "column",
    marginTop: 15,
    width: "10%",
  },
});

// Helper Components
const TableHeader = () => (
  <View style={styles.tableRow} fixed>
    <View style={styles.timeTableThHeaderStyleParticulars}>
      <Text style={styles.headers}>Fee Heads</Text>
    </View>

    <View style={styles.timeTableThHeaderStyleParticulars}>
      <Text style={styles.semester}>Paid Amount</Text>
    </View>
  </View>
);

const TableBody = ({ tableData }) => (
  <>
    {tableData?.map((voucher, i) => (
      <View style={styles.tableRow} key={i}>
        <View style={styles.timeTableThHeaderStyleParticulars}>
          <Text style={styles.headersValue}>{voucher.voucher_head}</Text>
        </View>

        <View style={styles.timeTableThHeaderStyleParticulars}>
          <Text style={styles.timeTableThStyle2}>{voucher.sphPaid_amount}</Text>
        </View>
      </View>
    ))}

    <View style={styles.tableRow}>
      <View style={styles.timeTableThHeaderStyleParticulars}>
        <Text style={styles.headers}>Total</Text>
      </View>

      <View style={styles.timeTableThHeaderStyleParticulars}>
        <Text style={styles.timeTableThStyle2}>
          {tableData?.[0]?.paid_amount}
        </Text>
      </View>
    </View>
  </>
);

const HostelFeePdf = () => {
  const [data, setData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const location = useLocation();

  const { feeReceiptId, studentStatus, receiptStatus, linkStatus } =
    location?.state;

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();

    if (studentStatus) {
      setCrumbs([{ name: "Payments", link: "/Feepayment/Receipt" }]);
    } else if (receiptStatus) {
      setCrumbs([{ name: "Fee Receipt", link: "/FeeReceipt" }]);
    } else if (linkStatus) {
      setCrumbs([
        {
          name: "Payment Master",
          link: "/PaymentMaster/feereceipt",
        },
      ]);
    } else {
      setCrumbs([]);
    }
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/finance/getFeeReceiptDetailsData/${feeReceiptId}`)
      .then((resOne) => {
        setData(resOne.data.data);
        // setStudentData(resOne.data.data.student_details[0]);
      })
      .catch((err) => console.error(err));
  };

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with a space
  }

  const MyDocument = () => (
    <View style={styles.pageLayout}>
      <Image src={logo} style={styles.logo} />

      <Text style={styles.feetemplateTitle}>
        {data?.[0]?.school_name?.toUpperCase()}
      </Text>
      <Text style={styles.title}>HOSTEL FEE RECEIPT</Text>

      {/* Displaying data with label and value side by side */}

      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={styles.label4}>Name</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value4}>
            {"  "} {data?.[0]?.student_name}
          </Text>
        </View>
        <View style={styles.row2}>
          <Text style={styles.label}>Receipt No.</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {"   "} {data?.[0]?.fee_receipt}
          </Text>
        </View>
        <View style={styles.row2}>
          <Text style={styles.label}>Craeted Date </Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {"  "} {moment(data?.[0]?.created_date).format("DD-MM-YYYY")}
          </Text>
        </View>
      </View>

      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={styles.label4}>AUID</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value4}>
            {"  "} {data?.[0]?.auid}
          </Text>
        </View>
        <View style={styles.row2}>
          <Text style={styles.label}>FC Year</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {"  "} {data?.[0]?.financial_year}
          </Text>
        </View>
        <View style={styles.row2}>
          <Text style={styles.label}>Created By</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {"  "} {data?.[0]?.created_username}
          </Text>
        </View>
      </View>

      {/* Render Table Header and Body */}
      <View style={styles.tableWrapper}>
        <TableHeader />
        <TableBody tableData={data} />
      </View>

      {data?.[0]?.transaction_no && data?.[0]?.transaction_date && (
        <>
          <View style={styles.column}>
            <View style={styles.transactionRow}>
              {/* <Text style={styles.label}>Transaction Type : {transactionType}</Text> */}

              <Text style={styles.transactionNo}>Transaction No. :</Text>

              <Text style={styles.transactionNoValue}>
                {data?.[0]?.transaction_no}
              </Text>
            </View>
            <View style={styles.transactionRow1}>
              <Text style={styles.transactionDateLabel}>
                Transaction Date :{" "}
              </Text>
              <Text style={styles.transactionDateValue}>
                {data?.[0]?.transaction_date ?? "NA"}
              </Text>
            </View>
          </View>
        </>
      )}

      <View style={styles.remarksRow}>
        <Text style={styles.remarksLabel}>Remarks : </Text>
        <Text style={styles.remarksValue}>{data?.[0]?.remarks}</Text>
      </View>
      <View style={styles.column}>
        <View style={styles.sumRow}>
          <Text style={styles.label2}>
            Received a sum of Rs. {data?.[0]?.paid_amount} /-
          </Text>
        </View>
        <View style={styles.signatureRow}>
          <Text style={styles.label1}>Signature </Text>
          <Text style={styles.label1}>(cashier) </Text>
        </View>
      </View>
    </View>
  );

  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Hostel Fee Receipt">
        <Page size="A4">
          <MyDocument />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default HostelFeePdf;
