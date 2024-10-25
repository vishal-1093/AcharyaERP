import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Document,
  Font,
  PDFViewer,
  Page,
  StyleSheet,
  View,
  Text,
} from "@react-pdf/renderer";
import logo from "../../../assets/acc.png";
import { Html } from "react-pdf-html";
import { useParams } from "react-router-dom";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import numberToWords from "number-to-words";

// Register the Arial font
Font.register({
  family: "Times New Roman",
  src: "/fonts/arial/ARIAL.woff",

  fonts: [
    {
      src: "/fonts/arial/ARIAL.woff",
    },
    {
      src: "/fonts/arial/ARIALBD.woff",
      fontWeight: "bold",
    },
    { src: "/fonts/arial/ARIALI.woff", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  pageLayout: { margin: 25 },

  templateData1: {
    width: "33%",
  },

  templateData2: {
    width: "33%",
  },

  templateData3: {
    width: "33%",
  },

  footerText: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    // textAlign: "left",
    fontStyle: "bold",
    // width: "40%",
  },

  templateData2: {
    width: "19%",
  },

  templateHeaders: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "left",
    fontStyle: "bold",
  },

  templateValues: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    textAlign: "left",
  },

  tableRowStyle: {
    flexDirection: "row",
  },

  feetemplateTitle: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    textAlign: "center",
    marginTop: 10,
  },

  feeReceiptTitle: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    textAlign: "center",
    marginTop: 4,
  },
});

function FeeReceiptDetailsPDF() {
  const [data, setData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [particularsData, setParticularsData] = useState([]);
  const [particularsTotal, setParticularsTotal] = useState([]);
  const [yearSemTotal, setYearSemTotal] = useState([]);
  const [grandTotal, setGrantTotal] = useState("");
  const [email, setEmail] = useState("");

  const { studentId } = useParams();
  const { financialYearId } = useParams();
  const { feeReceipt } = useParams();
  const { transactionType } = useParams();
  const { auid } = useParams();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "PaymentMaster", link: "/PaymentMaster/feereceipt" }]);
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

        setData(rest);
        setNoOfYears(totalYearSemTemp);
        setYearSemTotal(total);
        setGrantTotal(Object.values(total).reduce((a, b) => a + b));
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${studentId}`
      )
      .then((res) => {
        const { student_details, ...rest } = feeReceiptData;
        const total = {};
        Object.keys(rest).forEach((obj) => {
          total[obj] = Object.values(rest[obj]).reduce((a, b) => a + b);
        });

        const particularsTemp = [];

        res.data.data.fee_template_sub_amount_info.forEach((obj) => {
          if (Object.keys(rest).includes(obj.voucher_head_new_id.toString())) {
            particularsTemp.push(obj);
          }
        });

        setParticularsTotal(total);
        setParticularsData(particularsTemp);
        setEmail(res.data.data.Student_info[0]);
      })
      .catch((err) => console.error(err));
  };

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with a space
  }

  const pdfContent = () => {
    return (
      <Html style={{ fontSize: "10px", fontFamily: "Times-Roman" }}>
        {`
      <style>
           .container{
            font-family:Times-Roman;
          }
      .header{
        text-align:center;
        }
        .feeReciptLabel{
        font-weight:1000;
        margin-top:5px;
        font-size:12px;
        margin-right:30px;
        }
        .acharyaLabel{
          font-size:16px;
          font-weight:800;
          margin-top:5px;
          }
          .logoDiv{
            position:absolute;
            width:100%;
            top:28px;
            left:45%;
            text-align:center;
            opacity: 0.8;
          }
          .tbl
        {
        width:100%;
        }
        
        .tbl th{
        padding:5px;
        text-align:left;
        width:20%;
        }
        
        .tbl td{
        padding:5px;
        text-align:left;
        }

        .tbl1
        {
        width:100%;
        border:1px solid black;
        }
        
        .tbl1 th{
        padding:5px;
        width:10%;
        }
        
        .tbl1 td{
        padding:5px;
        }
        </style>
        <div class='container'>
        <div class='logoDiv'>
        <img src='` +
          logo +
          `' style='width:100px;'/>
        </div>
      <div class='header'>



<div style='margin-top:8px;'>
<table class='tbl1'>
<tr>
<th style='text-align:left;'>Fee Heads</th>
` +
          noOfYears
            .map((obj) => {
              return `<th>` + obj.value + `</th>`;
            })
            .join("") +
          `

<th>Total</th></tr>

` +
          particularsData
            ?.map((item) => {
              return (
                `<tr><td style='text-align:left'>` +
                item.voucher_head +
                `</td>` +
                noOfYears
                  .map((value) => {
                    return (
                      `<td style='text-align:right'>` +
                      data?.[item?.voucher_head_new_id]?.[value.key] +
                      `</td>`
                    );
                  })
                  .join("") +
                `<td  style='text-align:right'>` +
                particularsTotal?.[item?.voucher_head_new_id] +
                `</td></tr>`
              );
            })
            .join("") +
          `
<tr>
<th>Total</th>
` +
          noOfYears
            .map((year) => {
              return (
                `<th style='text-align:right'>` +
                yearSemTotal[year.key] +
                `</th>`
              );
            })
            .join("") +
          `
<th style='text-align:right'>` +
          grandTotal +
          `</th>
</tr>
</table>
</div>

</div>
</div></div>
      `}
      </Html>
    );
  };

  const feeReceiptHeader = () => {
    return (
      <>
        <View>
          <Text style={styles.feetemplateTitle}>
            {studentData?.school_name}
          </Text>
          <Text style={styles.feeReceiptTitle}>FEE RECEIPT</Text>
        </View>
      </>
    );
  };

  const feetemplateData = () => {
    return (
      <>
        <View style={{ display: "flex" }}>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Name {"  "} {"         "} {studentData?.student_name}
              </Text>
            </View>

            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Receipt No {"      "} {"          "}
                {feeReceipt.split("_").join("-")}
              </Text>
            </View>

            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Fee Category {"           "}
                {email.fee_template_name ? email.fee_template_name : "NA"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                AUID {"  "} {"         "} {studentData?.auid}
              </Text>
            </View>

            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Receipt Date {"    "} {"        "}
                {moment(studentData?.created_date).format("DD-MM-YYYY")}
              </Text>
            </View>

            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Mobile {"         "} {"           "}
                {email.mobile ? email.mobile : "NA"}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                USN {"   "} {"           "}
                {studentData.usn ? studentData.usn : "NA"}{" "}
              </Text>
            </View>

            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Financial Year {"  "} {"        "}
                {studentData?.financial_year}
              </Text>
            </View>

            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Created By {"  "} {"          "} {studentData?.created_username}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const feeTemplateFooter = () => {
    return (
      <>
        <View style={{ flexDirection: "row" }}>
          {studentData.transaction_date ? (
            <View style={{ marginTop: 4, width: "40%" }}>
              <Text style={styles.footerText}>
                Transaction No. {studentData?.transaction_no}{" "}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {studentData.transaction_no ? (
            <View style={{ marginTop: 4, width: "40%" }}>
              <Text style={styles.footerText}>
                Transaction Date :{" "}
                {moment(studentData?.transaction_date).format("DD-MM-YYYY")}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View style={{ marginTop: 4, width: "40%" }}>
            <Text style={styles.footerText}>
              Transaction type : {transactionType}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 4 }}>
          <Text style={styles.footerText}>
            Remarks : {studentData?.remarks}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginTop: 4, width: "90%" }}>
            <Text style={styles.footerText}>
              Received a sum of Rs.{" "}
              {toUpperCamelCaseWithSpaces(
                numberToWords.toWords(Number(grandTotal))
              )}
              /-
            </Text>
          </View>
          <View style={{ marginTop: 4, width: "10%" }}>
            <Text style={styles.footerText}>Signature</Text>
            <Text style={styles.footerText}>(Cashier)</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Fee Receipt">
        <Page size="A4">
          <View style={styles.pageLayout}>
            <View>{feeReceiptHeader()}</View>
            <View>{feetemplateData()}</View>
            {pdfContent()}
            <View>{feeTemplateFooter()}</View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default FeeReceiptDetailsPDF;
