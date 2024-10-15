import { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  Font,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import { Html } from "react-pdf-html";
import logo from "../../../assets/acc.png";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import numberToWords from "number-to-words";

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

  logoStyle: {
    width: "10%",
    marginLeft: "50%",
  },

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

function BulkFeeReceiptPdf() {
  const [data, setData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const { studentId, feeReceiptId, transactionType, financialYearId } =
    useParams();

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "PaymentMaster", link: "/PaymentMaster/feereceipt" }]);
  }, []);

  const getData = async () => {
    if (studentId) {
      await axios
        .get(
          `/api/finance/getDataForDisplayingBulkFeeReceiptByAuid/${studentId}/${feeReceiptId}/${transactionType}/${financialYearId}`
        )
        .then((resOne) => {
          setData(resOne.data.data.Voucher_Head_Wise_Amount);
          setStudentData(resOne.data.data.student_details[0]);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/finance/getDataForDisplayingBulkFeeReceipt/${feeReceiptId}/${transactionType}/${financialYearId}`
        )
        .then((resOne) => {
          setData(resOne.data.data.Voucher_Head_Wise_Amount);
          setStudentData(resOne.data.data.student_details[0]);
        })
        .catch((err) => console.error(err));
    }
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
          margin-top:10px;
          font-size:12px;
          }
          .acharyaLabel{
            font-size:16px;
            font-weight:800;
            }
            .logoDiv{
              position:absolute;
              width:100%;
              top:90px;
              left:45%;
              text-align:center;
              opacity:0.8;
            }
            .tbl
          {
          width:100%;
          // border:1px solid black;
          }

          .tbl th{
          padding:5px;
          text-align:left;
          width:10%;
          }

          .tbl td{
          padding:5px;
          text-align:left;
          }

          .tbl1
          {
          width:80%;
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
  <div class='acharyaLabel'>` +
          studentData.school_name +
          ` </div>
  <div class='feeReciptLabel'>Bulk Fee Receipt</div>
  <div style='margin-top:5px;'>
<table class='tbl'>
<tr>
<th>Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.student_name +
          `</th>


<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Receipt No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.fee_receipt +
          `</th>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Receipt Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          moment(studentData?.created_date).format("DD-MM-YYYY") +
          `</th>          
</tr>
<tr>

<th>AUID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.auid +
          `</th>      
          
          
          <th> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Financial Year&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.financial_year +
          `</th> 

          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Created By&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.created_username +
          `</th>
</tr>
</table>
</div>
  <div style='margin-top:8px;align-items:center;'>
  <table class='tbl1'>
  <tr>
  <th style='text-align:left;'>Fee Heads</th>
  <th>Paid Amount</th></tr>
` +
          data
            .map((obj) => {
              return (
                `<tr><td style='text-align:left;'>` +
                obj.voucher_head +
                `</td>
            <td style='text-align:right' >` +
                obj.amount_in_som +
                `</td>
            </tr>`
              );
            })
            .join("") +
          `<tr>
          <td style='text-align:left;'>
          Total
          </td>
          <td style='text-align:right'>  ` +
          data?.[0]?.amount +
          ` </td>
          </tr>
  </table>
  </div>
  <div style='margin-top:10px;display:flex;flex-direction:row;'>
  <div style='width:50%;text-align:left;'>Transaction Date : ` +
          data?.[0]?.transaction_date +
          `</div>
  <div style='width:50%;text-align:left;'>Transaction No : ` +
          data?.[0]?.transaction_no +
          `</div>
  </div>
  <div style='margin-top:8px;display:flex;flex-direction:row;'>
    <div style='margin-top:15px;display:flex;flex-direction:row;'>
  <div style='width:100%;text-align:left;'>Remarks : ` +
          data?.[0]?.remarks +
          `</div>
  </div>
  <div style='margin-top:8px;display:flex;flex-direction:row;'>
  <div style='width:50%;text-align:left;font-size:12px'>A sum of Uzs. ` +
          data?.[0]?.amount +
          `/-</div>
  <div style='width:50%;text-align:right;font-size:12px'>Signature<br>(Cashier)</div>
  </div>
  </div></div>
        `}
      </Html>
    );
  };

  const pdfOneContent = () => {
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
          margin-top:10px;
          font-size:12px;
          }
          .acharyaLabel{
            font-size:16px;
            font-weight:800;
            }
            .logoDiv{
              position:absolute;
              width:100%;
              top:130px;
              left:45%;
              text-align:center;
            }
            .tbl
          {
          width:100%;
          // border:1px solid black;
          }

          .tbl th{
          padding:5px;
          text-align:left;
          width:10%;
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
  <div class='acharyaLabel'>Acharya University</div>
  <div>Khojalar neighborhood citizen council,bukhara street karakol district,Uzbekistan</div>
  <div class='feeReciptLabel'>Fee Receipt</div>
  <div style='margin-top:15px;'>
  <table class='tbl'>
  <tr>
  <th>Receipt No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.fee_receipt +
          `</th>
  <th>Receipt Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          moment(studentData?.created_date).format("DD-MM-YYYY") +
          `</th>
  </tr>

  <tr>
  <th>Received From &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.from_name +
          `</th>
  <th>Cashier&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.cashier +
          `</th>
  </tr>
 
  
  
  
  </tr>
  </table>
  </div>
  <div style='margin-top:15px;'>
  <table class='tbl1'>
  <tr>
  <th>Fee Heads</th>
  <th>Paid Amount</th></tr>
` +
          data
            .map((obj) => {
              return (
                `<tr><td>` +
                obj.voucher_head +
                `</td>
            <td style='text-align:right'>` +
                obj.amount_in_som +
                `</td>
            </tr>`
              );
            })
            .join("") +
          `<tr>
          <td>
          Total
          </td>
          <td  style='text-align:right'>  ` +
          data?.[0]?.amount +
          ` </td>
          </tr>
  </table>
  </div>
  <div style='margin-top:15px;display:flex;flex-direction:row;'>
  <div style='width:50%;text-align:left;'>Transaction Date : ` +
          data?.[0]?.transaction_date +
          `</div>
  <div style='width:50%;text-align:left;'>Transaction No : ` +
          data?.[0]?.transaction_no +
          `</div>
  </div>
    <div style='margin-top:15px;display:flex;flex-direction:row;'>
  <div style='width:100%;text-align:left;'>Remarks : ` +
          data?.[0]?.remarks +
          `</div>
  </div>
  <div style='margin-top:15px;display:flex;flex-direction:row;'>
  <div style='width:50%;text-align:left;font-size:12px'>A sum of Uzs. ` +
          data?.[0]?.amount +
          `/-</div>
  <div style='width:50%;text-align:right;font-size:12px'>Signature<br>(Cashier)</div>
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
                Name {"  "} {"          "} {studentData?.student_name}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {studentData?.student_name}
              </Text>
            </View> */}
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Receipt No {"      "} {"          "}
                {data?.[0]?.fee_receipt}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {feeReceipt.split("_").join("-")}
              </Text>
            </View> */}
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Fee Category {"           "}
                {studentData.fee_template_name
                  ? studentData.fee_template_name
                  : "NA"}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {studentData.fee_template_name
                  ? studentData.fee_template_name
                  : "NA"}
              </Text>
            </View> */}
          </View>

          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                AUID {"  "} {"         "} {studentData?.auid}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>{studentData?.auid}</Text>
            </View> */}
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Receipt Date {"    "} {"        "}
                {moment(studentData?.created_date).format("DD-MM-YYYY")}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {moment(studentData?.created_date).format("DD-MM-YYYY")}
              </Text>
            </View> */}
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Mobile {"         "} {"           "}
                {studentData.mobile ? studentData.mobile : "NA"}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {studentData.mobile ? studentData.mobile : "NA"}
              </Text>
            </View> */}
          </View>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                USN {"   "} {"           "}{" "}
                {studentData.usn ? studentData.usn : "NA"}{" "}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {studentData.usn ? studentData.usn : "NA"}
              </Text>
            </View> */}
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Financial Year {"  "} {"        "}
                {studentData?.financial_year}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {studentData?.financial_year}
              </Text>
            </View> */}
            <View style={styles.templateData1}>
              <Text style={styles.templateHeaders}>
                Created By {"  "} {"          "} {studentData?.created_username}
              </Text>
            </View>
            {/* <View style={styles.templateData1}>
              <Text style={styles.templateValues}>
                {studentData?.created_username}
              </Text>
            </View> */}
          </View>
        </View>
      </>
    );
  };

  const feeTemplateFooter = () => {
    return (
      <>
        <View style={{ flexDirection: "row" }}>
          {data[0].transaction_no ? (
            <View style={{ marginTop: 4, width: "40%" }}>
              <Text style={styles.footerText}>
                Transaction No. {data?.[0]?.transaction_no ?? "NA"}{" "}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {data?.[0].transaction_date ? (
            <View style={{ marginTop: 4, width: "40%" }}>
              <Text style={styles.footerText}>
                Transaction Date :{" "}
                {moment(data?.[0].transaction_date).format("DD-MM-YYYY")}
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
              {/* {toUpperCamelCaseWithSpaces(
                numberToWords.toWords(Number(grandTotal))
              )} */}
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
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Fee Receipt">
          <Page size="A4">
            <View style={styles.pageLayout}>
              <View>{feeReceiptHeader()}</View>
              <View>{feetemplateData()}</View>
              {studentId ? pdfContent() : pdfOneContent()}
              <View>{feeTemplateFooter()}</View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default BulkFeeReceiptPdf;
