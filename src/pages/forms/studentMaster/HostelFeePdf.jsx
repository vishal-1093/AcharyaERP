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
import { useLocation, useParams } from "react-router-dom";
import { Html } from "react-pdf-html";
import logo from "../../../assets/acc.png";
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

function HostelFeePdf() {
  const [data, setData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const { id } = useParams();
  const location = useLocation();

  const state = location?.state?.replace;

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([
      state
        ? { name: "PaymentMaster", link: "/Feereceipt" }
        : { name: "PaymentMaster", link: "/PaymentMaster/feereceipt" },
    ]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/finance/getFeeReceiptDetailsData/${id}`)
      .then((resOne) => {
        setData(resOne.data.data);
        setStudentData(resOne.data.data.student_details[0]);
      })
      .catch((err) => console.error(err));
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
          data?.[0]?.school_name +
          ` </div>
  <div class='feeReciptLabel'>HOSTEL FEE RECEIPT</div>
  <div style='margin-top:5px;'>
<table class='tbl'>
<tr>
<th>Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.student_name +
          `</th>


<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Receipt No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.fee_receipt +
          `</th>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Receipt Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          moment(studentData?.created_date).format("DD-MM-YYYY") +
          `</th>          
</tr>
<tr>

<th>AUID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.auid +
          `</th>      
          
          
          <th> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Financial Year&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.financial_year +
          `</th> 

          <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Created By&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.[0]?.created_username +
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
                obj.sphPaid_amount +
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
          data?.[0]?.paid_amount +
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
  <div style='width:50%;text-align:left;font-size:12px'>A sum of Rs. ` +
          data?.[0]?.paid_amount +
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

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document title="Fee Receipt">
          <Page size="A4">
            <View style={styles.pageLayout}>{pdfContent()}</View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
}

export default HostelFeePdf;
