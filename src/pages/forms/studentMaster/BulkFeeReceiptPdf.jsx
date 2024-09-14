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
import logo from "../../../assets/wmLogo.jpg";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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
              top:130px;
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

  const paymentMode = () => {
    return (
      <>
        <View style={{ textAlign: "left" }}>
          <Text>A sum of Uzs. {data.length > 0 ? data[0].amount : ""}/- </Text>
        </View>
        <View style={{ textAlign: "left", marginTop: "5px" }}></View>
      </>
    );
  };

  const transactionDetails = () => {
    return (
      <>
        <View style={{ flex: 0.24 }}>
          <Text>Payment Mode : {transactionType}</Text>
        </View>
        <View style={{ flex: 0.8 }}>
          <Text>
            Transaction No : {data.length > 0 ? data[0].transaction_no : ""}
          </Text>
        </View>
        <View>
          <Text>
            Transaction Date : {data.length > 0 ? data[0].transaction_date : ""}
          </Text>
        </View>
      </>
    );
  };

  const timeTableHeader = () => {
    return (
      <>
        <View style={styles.tableRowStyle} fixed>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyle}>Fee Heads</Text>
          </View>
          <View style={styles.timeTableThHeaderStyle}>
            <Text style={styles.timeTableThStyleOne}>Paid Amount</Text>
          </View>
        </View>
      </>
    );
  };

  const timeTableBody = () => {
    return (
      <>
        {data.length > 0 ? (
          data.map((obj, i) => {
            return (
              <View style={styles.tableRowStyle} key={i}>
                <View style={styles.timeTableTdHeaderStyle1}>
                  <Text style={styles.timeTableTdStyle}>
                    {obj.voucher_head}
                  </Text>
                </View>

                <View style={styles.timeTableTdHeaderStyle2}>
                  <Text style={styles.timeTableTdStyleOne}>
                    {obj.amount_in_som}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <></>
        )}
        <View style={styles.tableRowStyle}>
          <View style={styles.timeTableTdHeaderStyle1}>
            <Text style={styles.timeTableTdStyle}>Total</Text>
          </View>

          <View style={styles.timeTableTdHeaderStyle1}>
            <Text style={styles.timeTableTdStyleOne}>
              {data.length > 0 ? data[0].amount : ""}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const cashier = () => {
    return (
      <>
        <View style={{ textAlign: "right" }}>
          <Text>Signature</Text>
        </View>
        <View style={{ textAlign: "right", marginTop: "10px" }}>
          <Text>(Cashier)</Text>
        </View>
      </>
    );
  };

  const studentTable = () => {
    return (
      <>
        {studentId ? (
          <>
            <View style={styles.tableRowStyle}>
              <Text style={styles.thStyle}>Receipt No</Text>
              <Text style={styles.tdStyle}>
                {data.length > 0
                  ? data[0].fee_receipt.split("/").join("-")
                  : ""}
              </Text>

              <Text style={styles.thStyle}> Receipt Date</Text>
              <Text style={styles.tdStyle}>
                {data.length > 0
                  ? data[0].receipt_date
                      .slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")
                  : ""}
              </Text>
            </View>
            <View style={styles.tableRowStyle}>
              <Text style={styles.thStyle}>AUID</Text>
              <Text style={styles.tdStyle}>
                {studentData.auid ? studentData.auid : ""}
              </Text>
              <Text style={styles.thStyle}>USN</Text>
              <Text style={styles.tdStyle}>
                {studentData.usn ? studentData.usn : "NA"}
              </Text>
            </View>
            <View style={styles.tableRowStyle}>
              <Text style={styles.thStyle}>School</Text>
              <Text style={styles.tdStyle}>
                {studentData.school_name ? studentData.school_name : ""}
              </Text>
              <Text style={styles.thStyle}>Mobile</Text>
              <Text style={styles.tdStyle}>
                {studentData.mobile ? studentData.mobile : ""}
              </Text>
            </View>
            <View style={styles.tableRowStyle}>
              <Text style={styles.thStyle}>Financial Year</Text>
              <Text style={styles.tdStyle}>
                {studentData.financial_year ? studentData.financial_year : ""}
              </Text>
              <Text style={styles.thStyle}>Cashier</Text>
              <Text style={styles.tdStyle}>
                {data.length > 0 ? data[0].cashier : ""}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.tableRowStyle}>
              <Text style={styles.thStyle}>Receipt No</Text>
              <Text style={styles.tdStyle}>
                {data.length > 0
                  ? data[0].fee_receipt.split("/").join("-")
                  : ""}
              </Text>

              <Text style={styles.thStyle}> Receipt Date</Text>
              <Text style={styles.tdStyle}>
                {data.length > 0
                  ? data[0].receipt_date
                      .slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")
                  : ""}
              </Text>
            </View>
            <View style={styles.tableRowStyle}>
              <Text style={styles.thStyle}>School</Text>
              <Text style={styles.tdStyle}>
                {studentData.school_name ? studentData.school_name : ""}
              </Text>
              <Text style={styles.thStyle}>Cashier</Text>
              <Text style={styles.tdStyle}>
                {data.length > 0 ? data[0].cashier : ""}
              </Text>
            </View>
            <View style={styles.tableRowStyle}>
              <Text style={styles.thStyle}>From</Text>
              <Text style={styles.tdStyle}>
                {data.length > 0 ? data[0].from_name : ""}
              </Text>
            </View>
          </>
        )}
      </>
    );
  };

  const Header = () => {
    return (
      <>
        <View
          style={{
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              lineHeight: "1.5",
              fontFamily: "Times-Roman",
            }}
          >
            Fee Receipt
          </Text>
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
              {studentId ? pdfContent() : pdfOneContent()}
            </View>
          </Page>
        </Document>
      </PDFViewer>

      {/* <PDFViewer style={styles.viewer}>
        <Document title="Bulk Fee Receipt">
          <Page size="A4" orientation="landscape">
            <View style={styles.pageLayout}>{pdfContent()}</View>
            <View style={styles.pageLayout}>
              <View style={styles.mainHeader}>{Header()}</View>
              <View style={styles.studentTableStyle}>{studentTable()}</View>

              <View style={styles.timetableStyle}>
                {timeTableHeader()}
                {timeTableBody()}
              </View>

              {transactionType.toLowerCase() === "rtgs" ? (
                <View style={styles.transactionHead}>
                  {transactionDetails()}
                </View>
              ) : (
                <></>
              )}

              <View style={styles.payment}>
                {paymentMode()} {cashier()}
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer> */}
    </>
  );
}

export default BulkFeeReceiptPdf;
