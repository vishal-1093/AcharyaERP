import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import { Html } from "react-pdf-html";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import logo from "../assets/wmLogo.jpg";
import moment from "moment";
import numberToWords from "number-to-words";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  pageLayout: { margin: 25 },
});

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function PayReportPdf() {
  const [data, setData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const { rowdata, values } = location.state;

  console.log(location.state.empId);
  useEffect(() => {
    getData();
    setCrumbs([
      {
        name: "Pay Report",
        link: location.state.empId ? "/MyProfile" : "/payReport",
      },
    ]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/getPaySlipDetails?emp_pay_history_id=${rowdata.id}`)
      .then((res) => {
        const temp = { ...res.data.data };
        const netPay = temp.total_earning - temp.total_deduction;
        temp.netPayDisplay = netPay;
        temp.netPayInWords = numberToWords.toWords(netPay);

        setData(temp);
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
      .logoDiv{
        position:absolute;
        width:100%;
        top:160px;
        left:42%;
        text-align:center;
      }
      .header{
        text-align:center;
      }
      .acharyaLabel{
        font-size:16px;
        font-weight:800;
      }

      .tbl
      {
      width:100%;

      }
      .tbl th{
        padding:5px;
        }

      .tbl td{
      padding:5px;
      }

      .tbl1
      {
        width:100%;
        border:1px solid black;
      }

      .tbl1 th{
        padding:5px;
        text-align:center;
        }

      .tbl1 td{
      padding:2px;
      }

       
      </style>

      <div class='container'>
      <div class='logoDiv'>
      <img src='` +
          logo +
          `' style='width:150px;'/>
      </div>
      <div class='header'>
      <div class='acharyaLabel'>Acharya University</div>
      <div>Khojalar neighborhood citizen council,bukhara street karakol district,Uzbekistan</div>
      </div>

      <div style='margin-top:20px;text-align:center;font-weight:800;font-size:12px'>
      Payslip For The Month ` +
          monthNames[rowdata?.month] +
          ` - ` +
          rowdata?.year +
          `
      </div>

      <div style='margin-top:20px'>
      <table class='tbl'>
      <tr>
      <th>Employee Code  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.empCode +
          `</th>
      <th>DOJ  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          moment(data?.dateOfJoining).format("DD-MM-YYYY") +
          `</th>
      </tr> 

      <tr>
      <th style='border-top:0'>Employee Name  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.employeeName +
          `</th>
      <th style='border-top:0'>PINFL No.  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.pinfl +
          `</th>
      </tr> 

      <tr>
      <th style='border-top:0'>Designation  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.designationName +
          `</th>
      <th style='border-top:0'>Passport No.  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.passportno +
          `</th>
      </tr> 

      <tr>
      <th style='border-top:0'>Plastic Card  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.plastic_card +
          `</th>
      <th style='border-top:0'>Pay Days  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          data?.payDays +
          `</th>
      </tr> 
      </table>
      </div>

      <div style='margin-top:20px'>
      <table class='tbl1'>
      <tr>
      <th style='max-width:150px'>Earnings</th>
      <th>Amount</th>
      <th>Deduction</th>
      <th>Amount</th>
      </tr>

      <tr>
      <td>Basic</td>
      <td style='text-align:right;'>` +
          data?.basic +
          `</td>
      <td>Tax</td>
      <td style='text-align:right;'>` +
          data?.tax +
          `</td>
      </tr>

      <tr>
      <td style='border-top:0'>Extra Remuneration</td>
      <td style='text-align:right;border-top:0'>` +
          data?.er +
          `</td>
      <td style='border-top:0'>Perquisites Tax</td>
      <td style='text-align:right;border-top:0'>` +
          data?.pt +
          `</td>
      </tr>

      <tr>
      <td style='border-top:0'></td>
      <td style='text-align:right;border-top:0'></td>
      <td style='border-top:0'>Pension Fund</td>
      <td style='text-align:right;border-top:0'>` +
          data?.pf +
          `</td>
      </tr>

      <tr>
      <td style='border-top:0'></td>
      <td style='text-align:right;border-top:0'></td>
      <td style='border-top:0'>Advance</td>
      <td style='text-align:right;border-top:0'>` +
          data?.advance +
          `</td>
      </tr>

      <tr>
      <td>Total Earnings</td>
      <td style='text-align:right'>` +
          data?.total_earning +
          `</td>
      <td>Total Deductions</td>
      <td style='text-align:right'>` +
          data?.total_deduction +
          `</td>
      </tr>
      
      <tr>
      <td>Total Net Pay</td>
      <td style='text-align:right'>` +
          data?.netPayDisplay +
          `</td>
      </tr>

      <tr>
      <td>Total Net Pay in Words</td>
      <td style='text-align:justify'>` +
          data?.netPayInWords?.charAt(0).toUpperCase() +
          data?.netPayInWords?.slice(1) +
          `</td>
      </tr>


      </table>
      </div>

      <div style='margin-top:20px;color:rgba(0, 0, 0, 0.5);'>* Note : ` +
          data?.remarks +
          `</div>

          <div style='margin-top:20px;width:100%;color:rgba(0, 0, 0, 0.5);text-align:right'>
          This is a system-generated payslip, signature not required
          </div>

      </div>
      `}
      </Html>
    );
  };

  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Pay Report">
        <Page size="A4">
          <View style={styles.pageLayout}>{pdfContent()}</View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default PayReportPdf;
