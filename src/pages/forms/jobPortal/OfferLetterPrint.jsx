import { useState, useEffect } from "react";
import React from "react";
import { Page, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { useParams } from "react-router-dom";

const OfferLetterPrint = () => {
  const [offerData, setofferData] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const { id, offerId } = useParams();

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

  useEffect(() => {
    getOfferData();
    getEmployeeDetails();
  }, []);

  const getOfferData = async () => {
    await axios
      .get(`${ApiUrl}/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => {
        console.log(res);
        setofferData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeDetails = async () => {
    await axios
      .get(`${ApiUrl}/employee/getJobProfileNameAndEmail/${id}`)
      .then((res) => {
        console.log(res.data);
        setEmployeeDetails(res.data);
      })
      .catch((err) => console.error(err));
  };

  const html =
    `
<style>
table{
width : 50%;
}
table {
font-size: 10px;
}
td{
padding: 3px;
}
th{
padding: 3px;
}
</style>
<div style='margin:20'>
<div style='font-size: 12px;text-decoration:underline;text-align:center'>OFFER LETTER
<br><br>Office of HR Department</div>
<table  style='margin-top: 30'>
<tr>
<th>` +
    offerData.offercode +
    `</th>
<th style='text-align:right'> ` +
    convertDateToString(new Date()) +
    `</th>
</tr>
</table>
<br>
<table>
<tr><td>To,</td></tr>
<tr><td>` +
    employeeDetails.firstname +
    `</td></tr>
<tr><td>` +
    employeeDetails.current_location +
    `</td></tr>
</table>
<br>
<table>
<tr><td> Dear <b>` +
    employeeDetails.firstname +
    `,<br></b></td></tr><tr><td>Subject : Offer for the post of ` +
    offerData.designation +
    `<br><br></td></tr><tr><td style='text-align: justify;line-height: 1.4'>With reference to 
    your application and subsequent interview, we are pleased to offer you the post of <span style='text-transform: uppercase'>` +
    offerData.designation +
    `</span> in the Department of ` +
    offerData.dept_name +
    ` at <span style='text-transform: uppercase'>` +
    offerData.school_name +
    `</span>.  You will be on Probation for a period of one year from the date of reporting to duty and your performance will be reviewed at the end of each Academic Semester / Every 6 months (whichever is earlier). <br><br> A formal appointment letter along with the terms and conditions as discussed will be sent to you on receipt of your acceptance of this offer letter and on reporting.  You are requested to contact HR Office first, on the day of reporting at the College. We look forward to a fruitful association together.</td></tr><tr><td style='text-align:right'><br><br>Yours Sincerely,</td></tr><tr><td style='text-align:right'><br><br> Director HR</td></tr>
</table>
</div>
  `;

  const MyDocument = () => (
    <Document title="Offer Letter">
      <Page size="A4">
        <Html>{html}</Html>
      </Page>
    </Document>
  );

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <MyDocument />
      </PDFViewer>
    </>
  );
};

export default OfferLetterPrint;
