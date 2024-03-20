import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Page,
  Document,
  StyleSheet,
  PDFViewer,
  View,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { useParams } from "react-router-dom";
import moment from "moment";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  pageLayout: { margin: 25 },
});

function OfferLetterPrint() {
  const [offerData, setofferData] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  console.log("employeeDetails", employeeDetails);
  const { id, offerId } = useParams();

  useEffect(() => {
    getOfferData();
    getEmployeeDetails();
  }, []);

  const getOfferData = async () => {
    await axios
      .get(`/api/employee/fetchAllOfferDetails/${offerId}`)
      .then((res) => {
        setofferData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeDetails = async () => {
    await axios
      .get(`/api/employee/getJobProfileNameAndEmail/${id}`)
      .then((res) => {
        const temp = { ...res.data };
        temp.firstname =
          temp.gender === "M"
            ? "Mr. " + temp.firstname
            : temp.gender === "F"
            ? "Ms. " + temp.firstname
            : "";
        setEmployeeDetails(temp);
      })
      .catch((err) => console.error(err));
  };

  const pdfContent = () => {
    return (
      <Html style={{ fontSize: "11px", fontFamily: "Times-Roman" }}>
        {`
        <style>
        .container{
          font-family:Times-Roman;
        }
        .encl{
          text-align:center;
          color:#888888;
          position:absolute;
          width:100%;
          top: 750px;
           
        }
        </style>


        <div class='container'>
        <div style='text-align:center;text-decoration:underline;line-height:2;font-size:13px;'>
        <div>OFFER LETTER</div>
        <div>Office of HR Department</div>
        </div>

        <div style='display:flex;flex-direction:row;margin-top:10px'>
        <div style='width:50%;'>` +
          offerData.offercode +
          `</div>
        <div style='width:50%;text-align:right'>` +
          moment().format("DD-MM-YYYY") +
          `</div>
        </div>

        <div style='margin-top:20px;line-height:1.5'>
        <div>To,</div>
        <div>` +
          employeeDetails.firstname +
          `</div>
        <div>` +
          employeeDetails.mobile +
          `</div><div>` +
          employeeDetails.email +
          `</div><div>` +
          employeeDetails.street +
          `</div><div>` +
          employeeDetails.locality +
          `</div><div>` +
          employeeDetails.pincode +
          `</div>
          </div>

          <div style='margin-top:20px'>
          <div>Subject : Offer for the post of ` +
          offerData.designation +
          `</div>
          </div>

          <div style='margin-top:20px'>
          <div>Dear ` +
          employeeDetails.firstname +
          `,</div>
          </div>

          <div style='margin-top:15px'>
          <div style='text-align:justify;line-height:1.3'>With reference to 
          your application and subsequent interview, we are pleased to offer you the post of <span style='text-transform: uppercase'>` +
          offerData.designation +
          `</span> in the Department of ` +
          offerData.dept_name +
          ` at <span style='text-transform: uppercase'>` +
          offerData.school_name +
          `</span>. You will be on Probation for a period of one year or six months from the date of reporting to duty and your performance will be
          reviewed at the end of every 6 months. <br><br>You are requested to contact HR Office first, on the day of reporting at the College. We look forward to a fruitful and long term association together.</div>
          </div>

          <div style='margin-top:20px'>
          <div>Yours Sincerely,</div>
          </div>

          <div style='margin-top:20px;text-align:right'>
          <div>Managing Director</div>
          </div>

          <div class='encl'>Encl: The details of the CTC/Salary break up in the Annexure 2 is appended here to</div>

        </div>

        
        `}
      </Html>
    );
  };
  return (
    <PDFViewer style={styles.viewer}>
      <Document title="Offer Letter">
        <Page size="A4">
          <View style={styles.pageLayout}>{pdfContent()}</View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default OfferLetterPrint;
