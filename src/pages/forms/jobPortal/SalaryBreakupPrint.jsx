import { useState, useEffect } from "react";
import { Page, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import { useParams } from "react-router-dom";

function SalaryBreakupPrint() {
  const [personalDetails, setPersonalDetails] = useState({
    school: "",
    name: "",
    department: "",
    designation: "",
    salary: "",
  });

  const [data, setData] = useState({
    earnings: [],
    grossMonthly: "",
    grossYearly: "",
    deductions: [],
    dgrossMonthly: "",
    dgrossYearly: "",
    managment: [],
    mgrossMonthly: "",
    mgrossYearly: "",
  });

  const { offerId } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const offerData = await axios
      .get(`${ApiUrl}/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => {
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    await axios
      .get(
        `${ApiUrl}/finance/getFormulaDetails/${offerData.salary_structure_id}`
      )
      .then((res) => {
        setPersonalDetails({
          school: offerData.school_name,
          name: offerData.firstname,
          department: offerData.dept_name,
          designation: offerData.designation,
          salary: offerData.salary_structure,
        });

        const earningTemp = [];
        const deductionTemp = [];
        const managementTemp = [];
        res.data.data
          .sort((a, b) => {
            return a.priority - b.priority;
          })
          .map((fil) => {
            if (fil.category_name_type === "Earning") {
              earningTemp.push({
                name: fil.voucher_head,
                monthly: Math.round(
                  offerData[fil.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[fil.salaryStructureHeadPrintName] * 12
                ),
              });
            } else if (fil.category_name_type === "Deduction") {
              deductionTemp.push({
                name: fil.slab_details_id
                  ? fil.voucher_head + " - " + "Present State Slab"
                  : fil.voucher_head +
                    " - " +
                    fil.percentage +
                    "%" +
                    " of Basic or Rs" +
                    Math.round(offerData[fil.salaryStructureHeadPrintName]) +
                    "/- whichever is less",
                monthly: Math.round(
                  offerData[fil.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[fil.salaryStructureHeadPrintName] * 12
                ),
              });
            } else if (fil.category_name_type === "Management") {
              managementTemp.push({
                name: fil.slab_details_id
                  ? fil.voucher_head + " - " + "Present State Slab"
                  : fil.voucher_head +
                    " - " +
                    fil.percentage +
                    "%" +
                    " of Basic or Rs" +
                    Math.round(offerData[fil.salaryStructureHeadPrintName]) +
                    "/- whichever is less",
                monthly: Math.round(
                  offerData[fil.salaryStructureHeadPrintName]
                ),
                yearly: Math.round(
                  offerData[fil.salaryStructureHeadPrintName] * 12
                ),
              });
            }
          });
        setData({
          earnings: earningTemp,
          grossMonthly:
            earningTemp.length > 0
              ? earningTemp.map((te) => te.monthly).reduce((a, b) => a + b)
              : 0,
          grossYearly:
            earningTemp.length > 0
              ? earningTemp.map((te) => te.yearly).reduce((a, b) => a + b)
              : 0,
          deductions: deductionTemp,
          dgrossMonthly:
            deductionTemp.length > 0
              ? deductionTemp.map((te) => te.monthly).reduce((a, b) => a + b)
              : 0,
          dgrossYearly:
            deductionTemp.length > 0
              ? deductionTemp.map((te) => te.yearly).reduce((a, b) => a + b)
              : 0,
          managment: managementTemp,
          mgrossMonthly:
            managementTemp.length > 0
              ? managementTemp.map((te) => te.monthly).reduce((a, b) => a + b)
              : 0,
          mgrossYearly:
            managementTemp.length > 0
              ? managementTemp.map((te) => te.yearly).reduce((a, b) => a + b)
              : 0,
        });
      })
      .catch((err) => console.error(err));

    return false;
  };

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    d: {
      marginLeft: 20,
      marginRight: 80,
    },
  });

  const html =
    `
  <style>
  table{
  width : 50%;
  }
  table {
  border:1px solid black;
  font-size: 10px;
  }
  td {
  border:1px solid black;
  padding: 3px;
  }
  th {
  border:1px solid black;
  padding: 3px;
  text-align:center;
  }
  </style>

<div style='margin:20'>
<table border='1' style='margin-top: 25'>
<tr>
<td style='font-size: 10px;text-align: center;text-transform: uppercase'>` +
    personalDetails.school +
    `</td>
</tr>
<tr>
<td style='font-size: 10px;text-align: center;font-weight:bold'>Salary Breakup Details for ` +
    personalDetails.name +
    `</td>
</tr>
<tr>
<td>Department : ` +
    personalDetails.department +
    `</td><td style='text-align:rightt;border-left: hidden;'>Designation : ` +
    personalDetails.designation +
    `
</tr>
<tr style='text-align: left'>
<td>Salary Structure : ` +
    personalDetails.salary +
    `</td>
</tr>
<tr style='text-align: center'>
<td></td><td>Monthly</td><td>Yearly</td>
</tr>
<tr style='text-align: left'>
<td>Earnings</td><td style='border-left: hidden;'></td><td style='border-left: hidden;'></td>
</tr> ` +
    data.earnings
      .map((val) => {
        return `<tr><td>${val.name}</td><td style='text-align:right'>${val.monthly}</td><td style='text-align:right'>${val.yearly}</td></tr>`;
      })
      .join("") +
    `
<tr>
<td>Gross Earnings ( A )</td><td style='text-align:right'>` +
    data.grossMonthly +
    `</td><td style='text-align:right'>` +
    data.grossYearly +
    `</td>
</tr>    
<tr style='text-align: left'>
<td>Deductions - Employee Contribution</td><td style='border-left: hidden;'></td><td style='border-left: hidden;'></td>
</tr> ` +
    data.deductions
      .map((val) => {
        return `<tr><td>${val.name}</td><td style='text-align:right'>${val.monthly}</td><td style='text-align:right'>${val.yearly}</td></tr>`;
      })
      .join("") +
    `
    <tr>
    <td>Total Deductions ( B )</td><td style='text-align:right'>` +
    data.dgrossMonthly +
    `</td><td style='text-align:right'>` +
    data.dgrossYearly +
    `</td>
    </tr>   
    <tr>
    <td>Net Salary ( C ) = ( A - B )</td><td style='text-align:right'>` +
    (data.grossMonthly - data.dgrossMonthly) +
    `</td><td style='text-align:right'>` +
    (data.grossYearly - data.dgrossYearly) +
    `</td>
    </tr>  
    <tr style='text-align: left'>
<td>Employer Contribution</td><td style='border-left: hidden;'></td><td style='border-left: hidden;'></td>
</tr>` +
    data.managment
      .map((val) => {
        return `<tr><td>${val.name}</td><td style='text-align:right'>${val.monthly}</td><td style='text-align:right'>${val.yearly}</td></tr>`;
      })
      .join("") +
    ` 
    <tr>
    <td>Institutional Contribution ( D )</td><td style='text-align:right'>` +
    data.mgrossMonthly +
    `</td><td style='text-align:right'>` +
    data.mgrossYearly +
    `</td>
    </tr> 
    <tr>
    <td>Cost to Institution ( E ) = ( A + D )</td><td style='text-align:right'>` +
    (data.grossMonthly + data.mgrossMonthly) +
    `</td><td style='text-align:right'>` +
    (data.grossYearly + data.mgrossYearly) +
    `</td>
    </tr> 
    <tr>
    <td colspan='3' style='text-align: justify'>This document is only for Acharya Institutes HR Team & Recruitee Reference . Any person or 
    entity apart from Acharya Institutes HR Team is prohibited from having this document</td>
    </tr>
    <tr>
    <td colspan='3' style='text-align: justify'>Acceptance Acknowledgment from New Recruit <br>
    Signature: <br><br><br><br> Date:
    </td>
    </tr>
    <tr>
    <td colspan='3' style='text-align: justify'>Remarks specific to New Recruit: <br><br><br><br>
    </td>
    </tr>
    <tr>
    <td colspan='3' style='text-align: justify'>Authorised Signatory:
    <br><br><br><br>
    </td>
    </tr>
    <tr style='text-align: center'>
    <td style='border-top: hidden;'>New Recruit</td><td style='border-left: hidden;border-top: hidden;'>Executive - HR</td>
    <td style='border-left: hidden;border-top: hidden;'>Head - HR</td>
    <td style='border-left: hidden;border-top: hidden;'>Campus Director</td>
    </tr>
</table>
</div>
    `;
  const MyDocument = () => (
    <Document title="Salary Breakup">
      <Page size="A4">
        <Html>{html}</Html>
      </Page>
    </Document>
  );
  return (
    <PDFViewer style={styles.viewer}>
      <MyDocument />
    </PDFViewer>
  );
}

export default SalaryBreakupPrint;
