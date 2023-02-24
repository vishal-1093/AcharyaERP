import { useState, useEffect } from "react";
import { Page, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import axios from "../../../services/Api";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { useParams } from "react-router-dom";
// import bot from "../../../assets/bot.jpg";

function ProvisionCertificatePDF() {
  const [studentData, setStudentData] = useState([]);
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
    getStudentData();
    // getEmployeeDetails();
  }, []);

  const getStudentData = async () => {
    await axios
      .get(`/api/student/Student_DetailsAuid/1`)
      .then((res) => {
        console.log(res);
        setStudentData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  //   const getEmployeeDetails = async () => {
  //     await axios
  //       .get(`/api/employee/getJobProfileNameAndEmail/${id}`)
  //       .then((res) => {
  //         setEmployeeDetails(res.data);
  //       })
  //       .catch((err) => console.error(err));
  //   };

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
<div style='font-size: 12px;text-decoration:underline;text-align:center'>PROVISIONAL CERTIFICATE
<br><br>Office of HR Department</div>
<table  style='margin-top: 30'>
<th style='text-align:right'> Date : ` +
    convertDateToString(new Date()) +
    `</th>
    <br></br>
    <br></br>
<tr>
<th>
Congratulations ` +
    studentData.student_name +
    `</th>
  
    

</tr>
<tr>
 .This is to certify that your Provisional Admission is complete, please find the details below:</tr>
</table>
<br>
<table>
  <tr>
    <th>Course</th>
    <th>` +
    studentData.program_name +
    `</th>
  
  </tr>
  <tr>
  <th>Specialization</th>
  <th>` +
    studentData.program_specialization_name +
    `</th>
   
  </tr>
  <tr>
  <th>Academic Year</th>
  <th>` +
    studentData.school_name +
    `</th>
   
  </tr>

<br></br>

<tr>
Your Acharya Unique Identification(AUID) is ` +
    studentData.auid +
    `. Kindly quote the AUID in all your communication and
transaction with the college.
<br></br>
<br></br>
All the students of Acharya have their own email provided by the college, the same has to be used to receive information and
 communicate with the college. You may now access your Acharya Email Id by using the URL m.acharya.ac.in and using the
 following credentials to Login. The email shall be active within 2 working days from the date of Admission.

</tr>
<br></br>
<table>
<tr>
    <th ><b >Email</b></th><td>` +
    studentData.acharya_email +
    `</td>
</tr>
<br></br>

<tr>
You are required to complete your admission process through the student dashboard on the Acharya ERP portal. The login
              credentials of ERP shall be sent to you on your Acharya Email only.
              <br></br>
              <br></br>
    The ERP provides you access to your programme details, information on your teachers, timetable, attendance, pay fee and most
    importantly connect with your Proctor. The information may be accessed on a web browser or by using the ERP App on your
              mobile phone. You may download the app using the QR codes below. The portal allows multiple logins, allowing parents to use
              the same to be updated on their ward’s academic progress.
              <br></br>
              <br></br>
              Please note that the given fee is applicable only for the prescribed Academic Batch. Admission shall be ratified only after the
              submission of all original documents for verification and payment of all the fee for the semester/year as prescribed in the letter
              of offer. Failure to do so shall result in the withdrawal of the Offer of Admission.
              <br></br>
              <br></br>
              Please feel free to call or write to us if you need any further information. MrManikandan_2286 is your counsellor and would be happy
                to assist you
</tr>

</table>
</table>

</div>

  `;

  const MyDocument = () => (
    <Document title="Provisional certificate">
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
      <img
        // src={bot}
        alt=""
        style={{ width: "770px", height: "180px", marginLeft: "290px" }}
      />
    </>
  );
}

export default ProvisionCertificatePDF;
