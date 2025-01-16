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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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
    top: "70%", // Adjusted to center logo vertically
    left: "50%", // Horizontally center the logo
    transform: "translate(-50%, -50%)", // Centering fix
    width: "20%", // Set width of the logo
    height: "auto", // Keep aspect ratio
  },
  feetemplateTitle: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
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

  label4: {
    width: "30%",
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
  voucherHeads,
  years,
  tableData,
  voucherWiseTotal,
  yearSemTotal,
  grandTotal,
}) => (
  <>
    {voucherHeads?.map((voucher, i) => (
      <View style={styles.tableRow} key={i}>
        <View style={styles.timeTableThHeaderStyleParticulars}>
          <Text style={styles.timeTableThStyle1}>{voucher.voucher_head}</Text>
        </View>

        {years?.map((year) => {
          return (
            <>
              <View style={styles.timeTableThHeaderStyleParticulars1}>
                <Text style={styles.timeTableThStyle2}>
                  {tableData?.[`${year}-${voucher.voucher_head_new_id}`]?.[0]
                    ?.paid_amount ?? 0}
                </Text>
              </View>
            </>
          );
        })}

        <View style={styles.timeTableThHeaderStyleParticulars1}>
          <Text style={styles.timeTableThStyle2}>
            {voucherWiseTotal?.[voucher.voucher_head_new_id]?.reduce(
              (total, sum) => Number(total) + Number(sum.paid_amount),
              0
            )}
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
          <Text style={styles.timeTableThStyle2}>{yearSemTotal?.[year]}</Text>
        </View>
      ))}
      <View style={styles.timeTableThHeaderStyleParticulars1}>
        <Text style={styles.timeTableThStyle2}>{grandTotal}</Text>
      </View>
    </View>
  </>
);

const FeeReceiptDetailsPDF = () => {
  const [studentData, setStudentData] = useState([]);
  const [voucherHeads, setVoucherHeads] = useState([]);
  const [voucherHeadNames, setVoucherHeadNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [yearSemTotal, setYearSemTotal] = useState([]);
  const [grandTotal, setGrantTotal] = useState("");
  const [email, setEmail] = useState("");

  const location = useLocation();
  const setCrumbs = useBreadcrumbs();

  const {
    auid,
    studentId,
    feeReceipt,
    financialYearId,
    transactionType,
    feeReceiptId,
    linkStatus,
  } = location?.state;

  useEffect(() => {
    getData();
    if (linkStatus) {
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
    const feeReceiptData = await axios
      .get(
        `/api/finance/getDataForDisplayingFeeReceipt/${studentId}/${financialYearId}/${feeReceipt}/${transactionType}/${0}`
      )
      .then((res) => {
        setStudentData(res.data.data.student_details[0]);
        return res.data.data;
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/student/studentDetailsByAuid/${auid}`)
      .then((res) => {
        const { student_details, ...rest } = feeReceiptData;
        let totalYearSem = [];
        let totalYearSemTemp = [];
        const total = {};

        Object.values(rest).forEach((obj) => {
          if (totalYearSem.length < Object.keys(obj).length) {
            totalYearSem = Object.keys(obj);
          }
        });

        if (res.data.data[0].program_type_name.toLowerCase() === "yearly") {
          totalYearSem.forEach((obj) => {
            totalYearSemTemp.push({ key: obj, value: "Year" + obj });
          });
        } else if (
          res.data.data[0].program_type_name.toLowerCase() === "semester"
        ) {
          totalYearSem.forEach((obj) => {
            totalYearSemTemp.push({ key: obj, value: "Sem" + obj });
          });
        }

        totalYearSem.forEach((obj) => {
          total[obj] = Object.values(rest)
            .map((item) => item[obj])
            .reduce((a, b) => a + b);
        });
        setEmail(res.data.data[0]);
        setYearSemTotal(total);
        setGrantTotal(Object.values(total).reduce((a, b) => a + b));
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${studentId}`
      )
      .then((res) => {
        const filterByFeereceiptId =
          res.data.data.fee_receipt_student_pay_his?.filter(
            (item) => item.fee_receipt_id === feeReceiptId
          );

        const voucherIds = filterByFeereceiptId?.map(
          (vouchers) => vouchers.voucher_head_new_id
        );

        const paidYears = filterByFeereceiptId?.map(
          (vouchers) => vouchers.paid_year
        );

        const uniqueVoucherHeads = filterByFeereceiptId?.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.voucher_head_new_id === value.voucher_head_new_id
            )
        );

        const filteredVoucherIds = [...new Set(voucherIds)];

        const filteredYears = [...new Set(paidYears)];

        setVoucherHeadNames(uniqueVoucherHeads);

        setNoOfYears(filteredYears);

        const dataByVoucher = {};

        filterByFeereceiptId?.forEach((item) => {
          const key = `${item.paid_year}-${item.voucher_head_new_id}`;

          if (!dataByVoucher[key]) {
            dataByVoucher[key] = [];
          }

          dataByVoucher[key]?.push(item);

          return dataByVoucher;
        });

        setTableData(dataByVoucher);

        const VoucherWiseData = filteredVoucherIds.reduce((acc, voucherId) => {
          const value = filterByFeereceiptId.filter(
            (item) => item.voucher_head_new_id === voucherId
          );

          acc[voucherId] = value;
          return acc;
        }, {});

        setVoucherHeads(VoucherWiseData);
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

      <Text style={styles.feetemplateTitle}>{studentData?.school_name}</Text>
      <Text style={styles.title}>FEE RECEIPT</Text>

      {/* Displaying data with label and value side by side */}
      <View style={styles.row}>
        <Text style={styles.label4}>Name</Text>
        <Text style={styles.value}>{studentData?.student_name}</Text>
        <Text style={styles.label}>Receipt No.</Text>
        <Text style={styles.value}>{feeReceipt}</Text>
        <Text style={styles.label}>Fee Category</Text>
        <Text style={styles.value}>
          {email.fee_template_name ? email.fee_template_name : "NA"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label4}>AUID</Text>
        <Text style={styles.value}>{studentData?.auid}</Text>
        <Text style={styles.label}>Receipt Date</Text>
        <Text style={styles.value}>
          {moment(studentData?.created_date).format("DD-MM-YYYY")}
        </Text>
        <Text style={styles.label}>Mobile</Text>
        <Text style={styles.value}>{email.mobile ? email.mobile : "NA"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label4}>USN</Text>
        <Text style={styles.value}>
          {studentData.usn ? studentData.usn : "NA"}{" "}
        </Text>
        <Text style={styles.label}>FC Year</Text>
        <Text style={styles.value}>{studentData?.financial_year}</Text>
        <Text style={styles.label}>Created By</Text>
        <Text style={styles.value}>{studentData?.created_username}</Text>
      </View>

      {/* Render Table Header and Body */}
      <View style={styles.tableWrapper}>
        <TableHeader years={noOfYears} />
        <TableBody
          voucherHeads={voucherHeadNames}
          years={noOfYears}
          tableData={tableData}
          voucherWiseTotal={voucherHeads}
          yearSemTotal={yearSemTotal}
          grandTotal={grandTotal}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Transaction Type : {transactionType}</Text>

        <Text style={styles.label}>
          Transaction No. : {studentData?.transaction_no ?? "NA"}
        </Text>

        <Text style={styles.label}>
          Transaction Date :{" "}
          {studentData?.transaction_date
            ? moment(studentData?.transaction_date).format("DD-MM-YYYY")
            : "NA"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Remarks : {studentData?.remarks}</Text>
      </View>
      <View style={styles.row1}>
        <Text style={styles.label2}>
          Received a sum of Rs.{" "}
          {toUpperCamelCaseWithSpaces(
            numberToWords.toWords(Number(grandTotal) ?? "")
          )}{" "}
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
      <Document title="Fee Receipt">
        <Page size="A4">
          <MyDocument />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default FeeReceiptDetailsPDF;
