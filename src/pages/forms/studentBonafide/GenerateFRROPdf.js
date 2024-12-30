import jsPDF from "jspdf"
import moment from "moment";
import jes from "../../../assets/aiajes.jpg"
import asa from "../../../assets/aisasa.jpg"
import asd from "../../../assets/aisasd.jpg"
import asn from "../../../assets/aiasn.jpg"
import igs from "../../../assets/aigs.jpg"
import acp from "../../../assets/aisacp.jpg"
import ags from "../../../assets/aisags.jpg"
import ahs from "../../../assets/aisahs.jpg"
import ait from "../../../assets/aisait.jpg"
import anr from "../../../assets/aisanr.jpg"
import aps from "../../../assets/aisaps.jpg"
import apt from "../../../assets/aisapt.jpg"

export const GenerateFrroPdf = async (data, letterHeadReq) => {
    return new Promise(resolve => {
        const getBkImage = () => {
            const name = data.registrationNo.substring(0,3).toLowerCase()
            if(name === "jes") return jes
            if(name === "asa") return asa
            if(name === "asd") return asd
            if(name === "asn") return asn
            if(name === "igs") return igs
            if(name === "acp") return acp
            if(name === "ags") return ags
            if(name === "ahs") return ahs
            if(name === "ait") return ait
            if(name === "anr") return anr
            if(name === "aps") return aps
            if(name === "apt") return apt
        }

        const doc = new jsPDF("p", "pt", "a4");
        let yPos = 160
        let lineHeight = 15
        let text = ""
        let lines = []
        let rightMargin = 35
        let leftMargin = 35
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        letterHeadReq && doc.addImage(getBkImage(), 'jpg', 0, 0, pageWidth, pageHeight);
        doc.setFontSize(12)
        doc.text(`BONAFIED CERTIFICATE`, pageWidth / 2, yPos, { align: "center" })
        doc.setFontSize(8)
        doc.text(`REFERENCE NO. `, leftMargin, yPos)
        doc.text(`Date: ${moment().format("DD-MM-YYYY")}`, pageWidth - 100, yPos)
        yPos += 12
        yPos += lineHeight
        text = `THIS IS TO CERTIFY THAT MR./MS ${data.studentName} , NATIONAL OF CONGOLESE IS A BONAFIDE STUDENT OF THIS INSTITUTION. HIS/ HER DETAILS ARE GIVEN BELOW.`
        lines = doc.splitTextToSize(text, pageWidth - 60)
        doc.text(lines, leftMargin, yPos)
        yPos += lines.length * 10
        doc.setLineWidth(1.0);
        // Horizontal Line
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        // Vertical line
        doc.line(leftMargin, yPos, leftMargin, 735)
        doc.line(leftMargin + 30, yPos, leftMargin + 30, 735)
        doc.line(leftMargin + 240, yPos, leftMargin + 240, 735)
        doc.line(pageWidth - rightMargin, yPos, pageWidth - rightMargin, 735)

        yPos += 15
        doc.text("1.", leftMargin + 10, yPos)
        doc.text("FSIS NUMBER", leftMargin + 35, yPos)
        doc.text(data.fsisNo, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("2.", leftMargin + 10, yPos)
        doc.text("NAME OF THE STUDENT", leftMargin + 35, yPos)
        doc.text(data.studentName, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("3.", leftMargin + 10, yPos)
        doc.text("DATE OF BIRTH", leftMargin + 35, yPos)
        doc.line(150, yPos + 10, 150, 257)
        doc.text(data.dob, 155, yPos)
        doc.text("SEX", leftMargin + 255, yPos)
        doc.line(350, yPos + 10, 350, 257)
        doc.text(data.sex, 370, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("4.", leftMargin + 10, yPos)
        doc.text("FATHER’S/ HUSBANDS NAME", leftMargin + 35, yPos)
        doc.text(data.fatherOrHusbandName, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("5.", leftMargin + 10, yPos)
        doc.text("PASSPORT NO", leftMargin + 35, yPos)
        doc.line(150, yPos + 10, 150, 307)
        doc.text(data.passportNo, 155, yPos)
        doc.text("VALID FROM", leftMargin + 255, yPos)
        doc.line(350, yPos + 10, 350, 307)
        doc.text(data.passportValidFrom, 370, yPos)
        doc.line(430, yPos + 10, 430, 307)
        doc.text("VALID TO", 440, yPos)
        doc.line(500, yPos + 10, 500, 307)
        doc.text(data.passportValidTo, 510, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("6.", leftMargin + 10, yPos)
        doc.text("STUDENT VISA NO", leftMargin + 35, yPos)
        doc.line(150, yPos + 10, 150, 327)
        doc.text(data.visaNo, 155, yPos)
        doc.text("VALID FROM", leftMargin + 255, yPos)
        doc.line(350, yPos + 10, 350, 327)
        doc.text(data.visaValidFrom, 370, yPos)
        doc.line(430, yPos + 10, 430, 327)
        doc.text("VALID TO", 440, yPos)
        doc.line(500, yPos + 10, 500, 327)
        doc.text(data.visaValidTo, 510, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("7.", leftMargin + 10, yPos)
        text = "PRESENT RESIDENTIAL ADDRESS IN INDIA"
        lines = doc.splitTextToSize(text, 200)
        doc.text(lines, leftMargin + 35, yPos)
        text = data.address
        lines = doc.splitTextToSize(text, 270)
        doc.text(lines, leftMargin + 245, yPos)

        yPos += lineHeight * 2 - 6
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("8.", leftMargin + 10, yPos)
        text = "INSTITUTION REGISTRATION NUMBER OF THE STUDENT"
        lines = doc.splitTextToSize(text, 200)
        doc.text(lines, leftMargin + 35, yPos)
        doc.text(`${data.usn ? data.usn.concat(" /") : ""} ${data.registrationNo}`, leftMargin + 245, yPos)

        yPos += lineHeight
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("9.", leftMargin + 10, yPos)
        text = "WHETHER STUDENT VISA ISSUED IS FOR THIS COURSE AND INSTITUTION? IF NO, WHETHER PERMISSION OF FRRO IS OBTAINED FOR THE CHANGE OF COURSE/INSTITUTION?"
        lines = doc.splitTextToSize(text, 200)
        doc.text(lines, leftMargin + 35, yPos)
        lines = doc.splitTextToSize(data.studentVisaIssued, 270)
        doc.text(lines, leftMargin + 245, yPos)

        yPos += lineHeight * 2
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("10.", leftMargin + 10, yPos)
        text = "NAME AND REFERENCE NO. OF THE RECOGNIZING AUTHORITY OF THE INSTITUTION"
        lines = doc.splitTextToSize(text, 200)
        doc.text(lines, leftMargin + 35, yPos)
        lines = doc.splitTextToSize(data.nameAndReferenceNoOfInst, 270)
        doc.text(lines, leftMargin + 245, yPos)

        yPos += lineHeight
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("11.", leftMargin + 10, yPos)
        text = "NAME OF COURSE RECOGNIZING AUTHORITY AND REFERENCE NO. OF AFFILIATION"
        lines = doc.splitTextToSize(text, 200)
        doc.text(lines, leftMargin + 35, yPos)
        lines = doc.splitTextToSize(data.nameAndReferenceNoOfCourse, 270)
        doc.text(lines, leftMargin + 245, yPos)

        yPos += lineHeight
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("12.", leftMargin + 10, yPos)
        doc.text("NAME OF THE COURSE", leftMargin + 35, yPos)
        doc.text(data.nameOfCourse, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("13.", leftMargin + 10, yPos)
        doc.text("COURSE PERIOD", leftMargin + 35, yPos)
        doc.text(`FROM ${moment(data.coursePeriodFrom).format("DD-MM-YYYY")}`, leftMargin + 255, yPos)
        doc.line(420, yPos + 10, 420, 556)
        doc.text(`TO ${moment(data.coursePeriodTo).format("DD-MM-YYYY")}`, 430, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("14.", leftMargin + 10, yPos)
        doc.text("IN WHICH YEAR/ SEMESTER STUDYING NOW", leftMargin + 35, yPos)
        doc.text(data.yearAndSem, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("15.", leftMargin + 10, yPos)
        doc.text("ATTENDING CLASSES REGULARLY OR NOT", leftMargin + 35, yPos)
        doc.text(data.attendingClass, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("16.", leftMargin + 10, yPos)
        text = "DATE UP TO WHICH EXTENSION IS RECOMMENDED"
        lines = doc.splitTextToSize(text, 200)
        doc.text(lines, leftMargin + 35, yPos)
        doc.text(moment(data.extensionDate).format("DD-MM-YYYY"), leftMargin + 245, yPos)

        yPos += lineHeight
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("17.", leftMargin + 10, yPos)
        text = "PURPOSE OF ISSUE OF CERTIFICATE"
        lines = doc.splitTextToSize(text, 200)
        doc.text(lines, leftMargin + 35, yPos)
        doc.text(data.purpose, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("18.", leftMargin + 10, yPos)
        doc.text("REMARKS IF ANY", leftMargin + 35, yPos)
        doc.text(data.remarks, leftMargin + 245, yPos)

        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += lineHeight
        doc.text("19.", leftMargin + 10, yPos)
        doc.text("DETAILS OF EXAMINATIONS ATTENDED", leftMargin + 35, yPos)
        doc.text("AS PER ANNEXURE-1", leftMargin + 245, yPos)
        yPos += 10
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);

        yPos += lineHeight
        text = "THE COLLEGE BELIEVES THAT THE FOREIGN NATIONAL IS A GENUINE STUDENT. IF HE/SHE IS IRREGULAR IN ATTENDING CLASSES OR ABSENT CONTINUOUSLY FOR MORE THAN 2 WEEKS, WE WILL REPORT THIS MATTER TO FRRO OFFICE. WE ARE AWARE THAT IF WE FAIL TO REPORT THIS MATTER TO FRRO OFFICE, THE COLLEGE WILL BE LIABLE FOR LEGAL ACTION IN FUTURE."
        lines = doc.splitTextToSize(text, pageWidth - 60)
        doc.text(lines, leftMargin, yPos)

        yPos += lineHeight * 3
        doc.text("OFFICE SEAL", leftMargin, yPos)
        doc.text("SIGNATURE WITH DATE AND SEAL", pageWidth - 250, yPos)
        yPos += 10
        doc.text("NAME", pageWidth - 250, yPos)
        yPos += 10
        doc.text("DESIGNATION", pageWidth - 250, yPos)

        resolve(doc.output("datauristring"))
    })
}