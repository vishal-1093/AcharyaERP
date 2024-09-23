import { Button } from "@mui/material";
import { jsPDF } from "jspdf";
import ait from "../../../assets/aisait.jpg";
import html2canvas from "html2canvas";
import { useRef } from "react";

function OfferLetterView() {
  const pageSetup = { orientation: "portrait", format: "a4" };

  const contentRef = useRef();

  const generatePDF = () => {
    html2canvas(contentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF();
      doc.addImage(imgData, "PNG", 0, 0);
      doc.save("document.pdf");
    });
  };

  return (
    <>
      <div></div>
      <Button onClick={generatePDF}>Send Mail</Button>
    </>
  );
}

export default OfferLetterView;
