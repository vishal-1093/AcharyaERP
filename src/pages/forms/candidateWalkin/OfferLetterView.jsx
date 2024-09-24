import { useEffect, useRef, useState } from "react";
import axios from "../../../services/Api";
import { Button, Typography } from "@mui/material";
import { jsPDF } from "jspdf";
import ait from "../../../assets/aisait.jpg";
import { useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

function OfferLetterView() {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const contentRef = useRef();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/findAllDetailsPreAdmission/${id}`
      );
      setData(response.data[0]);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to rejoin",
      });
      setAlertOpen(true);
    }
  };

  if (!data) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No candidate data available.
      </Typography>
    );
  }

  const generatePDF = () => {
    const doc = new jsPDF();

    // Use the html method to convert HTML content into PDF
    doc.html(contentRef.current, {
      callback: () => {
        const pdfBlob = doc.output("blob");
        const formData = new FormData();
        formData.append("file", pdfBlob, "document.pdf");
        formData.append("candidate_id", id);
        axios.post(
          "/api/student/emailToCandidateRegardingOfferLetter",
          formData
        );
      },
      x: 10,
      y: 10,
      width: 190, // Optional, for margin
      windowWidth: 650, // Optional, for responsiveness
      border: "1px solid red",
    });
  };

  const displayDate = () => (
    <div>
      <div>Ref.No: {data.application_no_npf}</div>
      <div style={{ textAlign: "right" }}>
        Date: {moment().format("DD-MM-YYYY")}
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={contentRef}
        style={{
          padding: "20px",
          margin: "auto",
        }}
      >
        {displayDate()}
      </div>
      <Button onClick={generatePDF} variant="contained" color="primary">
        Generate PDF
      </Button>
    </>
  );
}

export default OfferLetterView;
