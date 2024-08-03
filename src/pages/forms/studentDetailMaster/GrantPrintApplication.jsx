import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import { Html } from "react-pdf-html";
import logo from "../../../assets/wmLogo.jpg";
import sign from "../../../assets/vsign.png";
import { useParams } from "react-router-dom";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  pageLayout: { margin: 25 },
});

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser")).userId;

function GrantPrintApplication() {
  const [studentData, setStudentData] = useState([]);
  const [feeTemplateData, setFeeTemplateData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [total, setTotal] = useState({});
  const [scholarshipData, setScholarshipData] = useState([]);

  const { studentId, scholarshipId } = useParams();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([
      { name: "Grant Application"},
    ]);
    getData();
  }, []);

  const getData = async () => {
    const getStudentData = await axios
      .get(`/api/student/Student_DetailsAuid/${studentId}`)
      .then((res) => {
        const temp = { ...res.data.data[0] };
        temp.candidate_sex =
          res.data.data[0].candidate_sex === "M"
            ? "Male"
            : res.data.data[0].candidate_sex === "F"
            ? "Female"
            : "";
        temp.approved_date =
          res.data.data[0].approved_date !== null
            ? moment(res.data.data[0].approved_date).format("DD-MM-YYYY")
            : "";
        setStudentData(temp);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    // fetching feeTemplateSubAmount
    const feeTemplateSubAmount = await axios
      .get(
        `/api/finance/FetchFeeTemplateSubAmountDetail/${getStudentData.fee_template_id}`
      )
      .then((res) => {
        setFeeTemplateSubAmountData(res.data.data);
        return res.data.data;
      })
      .catch((err) => console.error(err));

    // fetching feeTemplateData
    const feetemplateData = await axios
      .get(
        `/api/finance/FetchAllFeeTemplateDetail/${getStudentData.fee_template_id}`
      )
      .then((res) => {
        setFeeTemplateData(res.data.data[0]);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    const yearSem = [];
    const totalTemp = {};
    const columnTemp = {};

    if (feetemplateData.program_type_name.toLowerCase() === "yearly") {
      for (let i = 1; i <= 1; i++) {
        yearSem.push({ key: i.toString(), value: "Year " + i });
      }
    } else if (feetemplateData.program_type_name.toLowerCase() === "semester") {
      for (let i = 1; i <= 2; i++) {
        yearSem.push({ key: i.toString(), value: "Sem " + i });
      }
    }

    feeTemplateSubAmount.forEach((obj) => {
      let tot = 0;

      yearSem.forEach((values) => {
        tot += obj["year" + values.key + "_amt"];
      });
      totalTemp[obj.voucher_head_new_id] = tot;
    });

    yearSem.forEach((obj) => {
      columnTemp[obj.key] = feeTemplateSubAmount
        .map((item) => item["year" + obj.key + "_amt"])
        .reduce((a, b) => a + b);
    });

    totalTemp["rowData"] = columnTemp;
    totalTemp["total"] = Object.values(columnTemp).reduce((a, b) => a + b);

    setNoOfYears(yearSem);
    setTotal(totalTemp);

    // fetch scholarshipData
    await axios
      .get(`/api/student/fetchScholarship2/${scholarshipId}`)
      .then((res) => {
        setScholarshipData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const validateSign =
    userId === 3
      ? "<div style='margin-top:20px;'><img src='" +
        sign +
        "' style='width:100px;'/></div>"
      : "";

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
        .feeReciptLabel{
            font-weight:1000;
            margin-top:10px;
            font-size:12px;
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
        text-align:center;
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
        <div class='feeReciptLabel'>Grant Application</div>
        </div>

        <div style='margin-top:20px;'>
<table class='tbl'>
<tr>
<th>AUID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.auid +
          `</th>
<th>Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.student_name +
          `</th>          
</tr>
<tr>
<th>DOA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.date_of_admission?.split("-").reverse().join("-") +
          `</th>
<th>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.acharya_email +
          `</th>          
</tr>
<tr>
<th>Mobile No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.mobile +
          `</th>
<th>Program&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.program_name +
          `</th>          
</tr>
<tr>
<th>Program Specialization&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.program_specialization_name +
          `</th>
<th>Fee Template&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          studentData?.fee_template_name +
          `</th>          
</tr>
</table>
</div>
<div style='margin-top:15px;'>
<table class='tbl1'>
<tr>
<th>Particulars</th>
` +
          noOfYears
            .map((obj) => {
              return `<th>` + obj.value + `</th>`;
            })
            .join("") +
          `

<th>Total</th></tr>` +
          feeTemplateSubAmountData
            ?.map((item) => {
              return (
                `<tr><td style='text-align:left'>` +
                item.voucher_head +
                `</td>` +
                noOfYears
                  .map((values) => {
                    return (
                      `<td style='text-align:right'>` +
                      item["year" + values.key + "_amt"] +
                      `</td>`
                    );
                  })
                  .join("") +
                `<td  style='text-align:right'>` +
                total[item.voucher_head_new_id] +
                `</td></tr>`
              );
            })
            .join("") +
          `
<tr>
<th>Total</th>` +
          noOfYears
            .map((obj) => {
              return (
                `<td style='text-align:right'>` +
                total.rowData[obj.key] +
                `</td>`
              );
            })
            .join("") +
          `<td style='text-align:right'>` +
          total.total +
          `</td>
</tr>
</table>
</div>
<div style='margin-top:20px;display:flex;flex-direction:row;'>
<div style='width:50%;text-align:left;'>
Requested Amount : ` +
          scholarshipData.requested_scholarship +
          `
</div>
<div style='width:50%;text-align:left;'>
Approved Amount : ` +
          scholarshipData.approved_amount +
          `
</div>
</div>
<div style='margin-top:20px;'>
<b>Grant Type : </b>` +
          scholarshipData.reason +
          `
</div>` +
          validateSign +
          `
<div style='margin-top:10px;'>
Approved Date : ` +
          studentData.approved_date +
          `
</div>
<div style='margin-top:50px;display:flex;flex-direction:row;'>
<div style='width:50%;text-align:left;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Signature</div>
<div style='width:50%;text-align:right;'>Signature&nbsp;</div>
</div>
<div style='margin-top:5px;display:flex;flex-direction:row;'>
<div style='width:50%;text-align:left;'>( Parent/Guardian )</div>
<div style='width:50%;text-align:right;'>( Student )</div>
</div>
      </div>`}
      </Html>
    );
  };
  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Grant Application">
        <Page size="A4">
          <View style={styles.pageLayout}>{pdfContent()}</View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default GrantPrintApplication;
