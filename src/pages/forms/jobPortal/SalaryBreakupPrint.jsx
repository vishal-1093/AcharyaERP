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
import { Html } from "react-pdf-html";
import { useParams } from "react-router-dom";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  pageLayout: {
    marginTop: 90,
    marginLeft: 40,
    marginBottom: 60,
    marginRight: 40,
  },
});

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

function SalaryBreakupPrint() {
  const [offerData, setOfferData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);

  const { id, offerId } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const offerData = await axios
      .get(`/api/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => {
        setOfferData(res.data.data[0]);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/finance/getFormulaDetails/${offerData.salary_structure_id}`)
      .then((res) => {
        const earningTemp = [];
        const deductionTemp = [];
        const managementTemp = [];
        res.data.data
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .forEach((obj) => {
            const tempArray = {
              name: obj.voucher_head,
              monthly: Math.round(offerData[obj.salaryStructureHeadPrintName]),
              yearly: Math.round(
                offerData[obj.salaryStructureHeadPrintName] * 12
              ),
            };

            if (
              obj.category_name_type === "Earning" &&
              tempArray.monthly !== 0
            ) {
              earningTemp.push(tempArray);
            } else if (
              obj.category_name_type === "Deduction" &&
              tempArray.monthly !== 0
            ) {
              deductionTemp.push(tempArray);
            } else if (
              obj.category_name_type === "Management" &&
              tempArray.monthly !== 0
            ) {
              managementTemp.push(tempArray);
            }
          });

        const temp = {};
        temp.earnings = earningTemp;
        temp.deductions = deductionTemp;
        temp.managment = managementTemp;

        let earningMonthlyAmt = 0;
        let earningYearlyAmt = 0;
        let deductMonthlyAmt = 0;
        let deductYearlyAmt = 0;
        let managementMonthlyAmt = 0;
        let managementYearlyAmt = 0;

        if (temp.earnings.length > 0) {
          const monthly = [];
          const yearly = [];
          temp.earnings.forEach((te) => {
            monthly.push(te.monthly);
            yearly.push(te.yearly);
          });
          earningMonthlyAmt = monthly.reduce((a, b) => a + b);
          earningYearlyAmt = yearly.reduce((a, b) => a + b);
        }

        if (temp.deductions.length > 0) {
          const monthly = [];
          const yearly = [];
          temp.deductions.forEach((te) => {
            monthly.push(te.monthly);
            yearly.push(te.yearly);
          });
          deductMonthlyAmt = monthly.reduce((a, b) => a + b);
          deductYearlyAmt = yearly.reduce((a, b) => a + b);
        }

        if (temp.managment.length > 0) {
          const monthly = [];
          const yearly = [];
          temp.managment.forEach((te) => {
            monthly.push(te.monthly);
            yearly.push(te.yearly);
          });
          managementMonthlyAmt = monthly.reduce((a, b) => a + b);
          managementYearlyAmt = yearly.reduce((a, b) => a + b);
        }

        temp.earningsMonthly = earningMonthlyAmt;
        temp.earningsYearly = earningYearlyAmt;
        temp.deductionsMonthly = deductMonthlyAmt;
        temp.deductionsYearly = deductYearlyAmt;
        temp.managmentMonthly = managementMonthlyAmt;
        temp.managmentYearly = managementYearlyAmt;
        temp.netMonthly = earningMonthlyAmt - deductMonthlyAmt;
        temp.netYearly = earningYearlyAmt - deductYearlyAmt;
        temp.ctcMonthly = earningMonthlyAmt + managementMonthlyAmt;
        temp.ctcYearly = earningYearlyAmt + managementYearlyAmt;

        setSalaryData(temp);
      });
  };

  const pdfContent = () => {
    return (
      `<style>
    .container
    {
      fontFamily: "Roboto"
    }

    table{
      border:1px solid black;
    }

    th{
      padding: 2px;
    }

    td{
      padding: 2px;
    }
    </style>

    
    <div class='container'>
    <div>
    <table  border='1'>
    <tr><th style='text-align:center'>ANNEXURE - 1</th></tr>
    <tr>
    <th style='text-align:center'>` +
      offerData.school_name +
      `</th>
    </tr><tr><th style='text-align:center'>Salary Breakup Details for ` +
      offerData.firstname +
      `</th></tr><tr><th>Department : ` +
      offerData.dept_name +
      `</th><th>Designation : ` +
      offerData.designation +
      `</th></tr><tr><th>Pay Scale &nbsp;&nbsp;&nbsp;:&nbsp;` +
      offerData.salary_structure +
      `</th></tr>
      <tr style='text-align:center'><th>Earnings</th><th>Monthly</th><th>Yearly</th></tr>` +
      salaryData?.earnings
        ?.map((obj) => {
          return `<tr><td>${obj.name}</td><td style='text-align:right'>${obj.monthly}</td><td style='text-align:right'>${obj.yearly}</td></tr>`;
        })
        .join("") +
      `<tr><th>Gross Salary ( A )</th><th style='text-align:right'>` +
      salaryData.earningsMonthly +
      `</th><th style='text-align:right'>` +
      salaryData.earningsYearly +
      `</th></tr><tr><th>Deductions - Employee Contribution</th></tr>` +
      salaryData?.deductions
        ?.map((obj) => {
          return `<tr><td>${obj.name}</td><td style='text-align:right'>${obj.monthly}</td><td style='text-align:right'>${obj.yearly}</td></tr>`;
        })
        .join("") +
      `<tr><th>Total Deductions ( B )</th><th style='text-align:right'>` +
      salaryData.deductionsMonthly +
      `</th><th style='text-align:right'>` +
      salaryData.deductionsYearly +
      `</th></tr><tr><th>Net Salary ( C ) = ( A - B )</th><th style='text-align:right'>` +
      salaryData.netMonthly +
      `</th><th style='text-align:right'>` +
      salaryData.netYearly +
      `</th></tr><tr><th>Employer Contribution</th></tr>` +
      salaryData?.managment
        ?.map((obj) => {
          return `<tr><td>${obj.name}</td><td style='text-align:right'>${obj.monthly}</td><td style='text-align:right'>${obj.yearly}</td></tr>`;
        })
        .join("") +
      `<tr><th>Institutional Contribution ( D )</th><th style='text-align:right'>` +
      salaryData.managmentMonthly +
      `</th><th style='text-align:right'>` +
      salaryData.managmentYearly +
      `</th></tr><tr><th>Cost to Institution ( E ) = ( A + D )</th><th style='text-align:right'>` +
      salaryData.ctcMonthly +
      `</th><th style='text-align:right'>` +
      salaryData.ctcYearly +
      `</th></tr><tr><th>Acceptance Acknowledgment from New Recruit<br><br><br>Signature :<br><br>Date :<br><br><br></th></tr>
      <tr><th style='color:#909090;'>This document is only for Acharya Institutes HR Team reference. Any person or entity apart from Acharya
      Institutes HR Team is prohibited from having this document</th></tr><tr><th>Remarks specific to New Recruit(If Any) : <br><br><br><br><br></th></tr>
      <tr><th>Authorised Signatory :<br><br><br><br><br></th></tr>
      <tr style='text-align: center;'><th style='border-top: hidden;'>New Recruit</th><th style='border-left: hidden;border-top: hidden;'>Executive-HR</th><th style='border-left: hidden;border-top: hidden;'>Head-HR</th><th style='border-left: hidden;border-top: hidden;'>Managing Director</th></tr>



    </table>
    </div>

    </div>
    `
    );
  };

  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Salary Breakup">
        <Page size="A4">
          <View style={styles.pageLayout}>
            <Html
              style={{
                fontSize: "10px",
                fontFamily: "Roboto",
                fontStyle: "normal",
              }}
            >
              {pdfContent()}
            </Html>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default SalaryBreakupPrint;
