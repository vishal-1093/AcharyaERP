import { useState, useEffect } from "react";
import axios from "../../../services/ApiWithoutToken";
import { useParams } from "react-router-dom";
import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import { Html } from "react-pdf-html";
import logo from "../../../assets/logo1.png";
import moment from "moment";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  pageLayout: { margin: 25 },
});

function ExternalPaymentSuccessPrint() {
  const [data, setData] = useState([]);

  const { id, type } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (type === "click") {
      await axios
        .get(
          `/api/student/getClickPaymentDetailForRceipt?merchant_trans_id=${id}`
        )
        .then((res) => {
          const temp = { ...res.data.clickPaymentDetail };
          temp.date = moment(temp.sign_time).format("DD-MM-YYYY hh:mm:ss");
          temp.amount = temp.amount + " ( Amount in Som )";
          setData(temp);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(`/api/student/getPaymentDetailsForRceipt?order_id=${id}`)
        .then((res) => {
          const temp = { ...res.data.paymeTranscationDetails };

          let tempDate = new Date(temp.normal_performed_time);
          tempDate.setMinutes(tempDate.getMinutes() + 330);
          tempDate = new Date(tempDate);
          temp.date = moment(tempDate).format("DD-MM-YYYY hh:mm:ss");
          temp.amount = temp.amount / 100 + " ( Amount in Som )";
          setData(temp);
        })
        .catch((err) => console.error(err));
    }
  };

  const pdfContent = () => {
    return (
      <Html style={{ fontSize: "10px", fontFamily: "Times-Roman" }}>
        {`<style>
      .container{
        font-family:Times-Roman;
      }
      .logoDiv{
        display: flex;
        align-items: center;
        flex-direction:row;
      }
      .acharyaLabel{
        font-size:14px;
        font-weight:800;
        margin-left:10px;
        color:#623f8f;
        }

        .tbl
        {
        width:100%;
        border: 1px solid #dddddd;
        }
        .tbl th
        {
        padding: 8px;
        }

        .tbl td
        {
        padding: 8px;
        }
      </style>
      
      <div class='container'>
        <div style='margin-top:20px;'>
        <table class='tbl'>
        <tr>
        <th><div class='logoDiv'>
        <div>
        <img src='` +
          logo +
          `' style='width:30px;'/>
        </div> 
           <p class='acharyaLabel'>Acharya University</p>
         </div></th>
        </tr>
        <tr>
        <th style='text-align:center'>Payment Details</th>
        </tr>
        <tr>
        <th>Name</th><td>` +
          data?.restriction_amount_payer +
          `</td>
        </tr>
        <tr>
        <th>Mobile</th><td>` +
          data?.mobile +
          `</td>
        </tr>
        <tr>
        <th>Email</th><td>` +
          data?.payer_email +
          `</td>
        </tr>
        <tr>
        <th>Other Info</th><td>` +
          data?.auid_or_other_info +
          `</td>
        </tr>
        <tr>
        <th>Transaction/Order ID</th>
        <td>` +
          id +
          `</td>
        </tr>
        <tr>
        <th>Transaction Status</th>
        <td>Success</td>
        </tr>
        <tr>
        <th>Transaction Date</th>
        <td>` +
          data?.date +
          `</td>
        </tr>
        <tr>
        <th>Transaction Amount</th>
        <td>` +
          data?.amount +
          `</td>
        </tr>
        </table>
        </div>
        </div>
      `}
      </Html>
    );
  };

  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Payment Details">
        <Page size="a5">
          <View style={styles.pageLayout}>{pdfContent()}</View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default ExternalPaymentSuccessPrint;
