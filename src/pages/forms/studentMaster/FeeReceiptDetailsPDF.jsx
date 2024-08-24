import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Document,
  Font,
  PDFViewer,
  Page,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import logo from "../../../assets/wmLogo.jpg";
import { Html } from "react-pdf-html";
import { useParams } from "react-router-dom";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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

  logoStyle: {
    width: "10%",
    marginLeft: "50%",
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
        // console.log(res.data);

        setStudentData(res.data.data.student_details[0]);
        return res.data.data;
      })
      .catch((err) => console.error(err));
    console.log(feeReceiptData);
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
        setEmail(res.data.data.Student_info?.[0]?.acharya_email);
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
          }
          .tbl
        {
        width:100%;
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
<div class='acharyaLabel'>` +
          studentData.school_name +
          `</div>
<div>Acharya Dr Sarvepalli Radhakrishnan Rd, Acharya P.O, Soladevanahalli, Bengaluru, Karnataka 560107</div>
<div class='feeReciptLabel'>Fee Receipt</div>
<div style='margin-top:15px;'>
<table class='tbl'>
<tr>
<th>Receipt No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          feeReceipt.split("_").join("-") +
          `</th>
<th>Receipt Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          moment(studentData?.created_date).format("DD-MM-YYYY") +
          `</th>          
</tr>
<tr>
<th>Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.student_name +
          `</th>
<th>AUID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.auid +
          `</th>          
</tr>
<tr>
<th>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          email +
          `</th>
<th>Financial Year&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.financial_year +
          `</th>          
</tr>
<tr>
<th>Created By&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.created_username +
          `</th>
<th>Transaction Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          transactionType +
          `</th>          
</tr>
</table>
</div>
<div style='margin-top:15px;'>
<table class='tbl1'>
<tr>
<th>Fee Heads</th>
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
<div style='margin-top:15px;display:flex;flex-direction:row;'>
<div style='width:50%;text-align:left;'>Transaction Date : ` +
          studentData?.transaction_date?.split("/")?.join("-") +
          `</div>
<div style='width:50%;text-align:left;'>Transaction No : ` +
          studentData?.transaction_no +
          `</div>
</div>
<div style='margin-top:10px; width:50%;text-align:left;'>Remarks : ` +
          studentData?.remarks +
          `</div>
</div>
<div style='margin-top:15px;display:flex;flex-direction:row;'>
<div style='width:50%;text-align:left;font-size:12px'>A sum of Rs. ` +
          grandTotal +
          `/-</div>
<div style='width:50%;text-align:right;font-size:12px'>Signature<br>(Cashier)</div>
</div>
</div></div>
      `}
      </Html>
    );
  };

  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Fee Receipt">
        <Page size="A4">
          <View style={styles.pageLayout}>{pdfContent()}</View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default FeeReceiptDetailsPDF;
