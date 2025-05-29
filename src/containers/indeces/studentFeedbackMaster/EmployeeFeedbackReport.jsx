import { Box, Button, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../../../services/Api"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import styled from "@emotion/styled"
import moment from "moment"
import acharyaLogo from "../../../assets/logo1.png"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable";

const EmployeeFeedbackReport = () => {
    const params = useParams()
    const { empId } = params
    const setCrumbs = useBreadcrumbs()
    const [report, setReport] = useState({})
    const [userImage, setUserImage] = useState('')

    useEffect(() => {
        setCrumbs([
            { name: "Employee Feedback", link: "/employee-feedback" },
            { name: "Report" },
        ])

        getReport()
    }, [])

    const getImage = async (employeeImage) => {
        try{
        const userImage = await axios.get(
            `/api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${employeeImage}`,
            { responseType: "blob" }
        );
        setUserImage(URL.createObjectURL(userImage.data))
    }catch(err){
        console.log("err", err)
    }
    }

    const getReport = () => {
        axios.get(`/api/feedback/employeeFeedbackReport?empId=${empId}`)
            .then(res => {
                setReport(res.data.data)
                getImage(res.data.data.employeeImage)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const downloadReport = async () => {
        const { dateOfJoining, departmentName, designationName, empCode, facultyName, feedbackreport } = report
        const start = moment(dateOfJoining);
        const end = moment()
        const duration = moment.duration(end.diff(start));
        const years = duration.years();
        const months = duration.months();
        const days = duration.days();

        const tableHeaders = ["Section", "Course Code", "Course Name", "Academic Year",
             "Year / Sem", "Student Count", "Average (%)"]
        const tableRows = feedbackreport.map((obj, i) => {
            const { section, subjectCode, subject, acYear, studentCount, feedbackPercentage } = obj
            return [section, subjectCode, subject, acYear, studentCount, feedbackPercentage]
        })
        const doc = new jsPDF('p', 'pt', 'a4');
        const rightSpace = doc.internal.pageSize.width - 80
        
        // Header
        doc.setFillColor(51, 122, 183);
        doc.rect(40, 40, rightSpace, 85, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13)
        let xPos = doc.internal.pageSize.width / 2
        let text = "JMJ EDUCATION SOCIETY"
        doc.text(text, xPos, 60, { align: "center" })
        text = "ACHARYA INSTITUTE OF TECHNOLOGY"
        doc.text(text, xPos, 80, { align: "center" })
        doc.setFontSize(12);
        text = `Student FeedBack Report`
        doc.text(text, xPos, 110, { align: "center" })
        doc.addImage(acharyaLogo, 'png', 50, 48, 70, 70)
        userImage && doc.addImage(userImage, 'png', rightSpace - 40, 48, 70, 70)

        // Employee Details
        // Horizontal line
        doc.line(40, 140, rightSpace + 40, 140);
        doc.line(40, 180, rightSpace + 40, 180);
        doc.line(40, 220, rightSpace + 40, 220);
        // Vertical line
        doc.line(40, 220, 40, 140)
        doc.line(200, 220, 200, 140)
        doc.line(385, 220, 385, 140)
        doc.line(rightSpace + 40, 220, rightSpace + 40, 140)

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11)
        const facultyName_ = doc.splitTextToSize(`Faculty Name : ${facultyName}`, 150);
        const empCode_ = doc.splitTextToSize(`Emp Code : ${empCode}`, 150);
        const designationName_ = doc.splitTextToSize(`Designation : ${designationName}`, 150);
        const exp_ = doc.splitTextToSize(`Exp at Acharya : ${years}Y ${months}M ${days}D`, 150);
        const departmentName_ = doc.splitTextToSize(`Department : ${departmentName}`, 150);
        const dateOfJoining_ = doc.splitTextToSize(`DOJ : ${moment(dateOfJoining).format("DD-MM-YYYY")}`, 150);
        doc.text(45, facultyName_.length > 1 ? 157 : 162, facultyName_);
        doc.text(207, empCode_.length > 1 ? 157 : 162, empCode_);
        doc.text(392, designationName_.length > 1 ? 157 : 162, designationName_);
        doc.text(45, exp_.length > 1 ? 197 : 202, exp_);
        doc.text(207, departmentName_.length > 1 ? 197 : 202, departmentName_);
        doc.text(392, dateOfJoining_.length > 1 ? 197 : 202, dateOfJoining_);

        // table
        autoTable(doc, {
            margin: 40,
            startY: 237,
            headStyles: { fontSize: 9, fillColor: "#fff", textColor: "#000", lineWidth: 0.5, lineColor: [0, 0, 0], valign: 'middle', halign : 'center' },
            bodyStyles: { fontSize: 9, textColor: "#000", lineWidth: 0.5, lineColor: [0, 0, 0] },
            theme: "grid",
            columns: tableHeaders,
            body: tableRows.map((arr) => arr),
            columnStyles: {
                0: { halign: 'center' }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }
                , 4: { halign: 'center' }, 5: { halign: 'center' }, 6: { halign: 'center' }, 7: { halign: 'center' }
            },
        })
        doc.save("Student report")
    }

    if (Object.keys(report).length <= 0)
        return (<Box p={4}>
            <h3>No Data Found</h3>
        </Box>)

    return (<Box p={2}>
        <Grid
            container
            alignItems="flex-end"
            justifyContent="space-between"
        >
            <Grid item xs={12} md={12} lg={2}></Grid>
            <Grid item xs={12} md={12} lg={8}>
                <Button variant="contained" onClick={downloadReport} sx={{ float: "right" }}>
                    <Typography variant="subtitle2">Download Report</Typography>
                </Button>
                <br></br>
                <Header employeeImage={userImage} />
                <EmployeeDetails empDetails={report} />
                <ReportDetails reportData={report.feedbackreport} />
            </Grid>
            <Grid item xs={12} md={12} lg={2}></Grid>
        </Grid>
    </Box>)
}

export default EmployeeFeedbackReport

const Header = ({ employeeImage }) => {
    const CustomBox = styled(Box)`
        display: flex;
        justify-content: space-between;
        background-color: #337ab7;
        color: #fff;
        margin: 15px 0px;
        padding: 15px;
    `

    const CustomImage = styled.img`
        height: 100px;
        width: 100px;
    `

    return (<CustomBox>
        <CustomImage alt="Acharya" src={acharyaLogo} />
        <Box sx={{ textAlign: "center" }}>
            <h2>JMJ EDUCATION SOCIETY</h2>
            <h2>ACHARYA INSTITUTE OF TECHNOLOGY</h2>
            <br></br>
            <h3>Student FeedBack Report</h3>
        </Box>
        <CustomImage alt="Acharya" src={employeeImage} />
    </CustomBox>)
}

const EmployeeDetails = ({ empDetails }) => {
    const { dateOfJoining, departmentName, designationName, empCode, facultyName } = empDetails

    const Table = styled.table`
        width: 100%;
        border: 2px solid #000;
        border-collapse: collapse;
    `

    const TabelCell = styled.td`
        padding: 15px 10px;
        border: 2px solid #000;
        border-collapse: collapse;
        font-size: 15px;
        font-weight: 500;
        width: 33%;
    `

    const start = moment(dateOfJoining);
    const end = moment()
    const duration = moment.duration(end.diff(start));
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();

    return (<Table>
        <tbody>
            <tr>
                <TabelCell>Faculty Name : {facultyName}</TabelCell>
                <TabelCell>Emp Code : {empCode}</TabelCell>
                <TabelCell>Designation : {designationName}</TabelCell>
            </tr>
            <tr>
                <TabelCell>Exp at Acharya : {`${years}Y ${months}M ${days}D`}</TabelCell>
                <TabelCell>Department : {departmentName}</TabelCell>
                <TabelCell>DOJ : {moment(dateOfJoining).format("DD-MM-YYYY")}</TabelCell>
            </tr>
        </tbody>
    </Table>)
}

const ReportDetails = ({ reportData }) => {
    const Table = styled.table`
        width: 100%;
        border: 2px solid #000;
        border-collapse: collapse;
        margin-top: 15px;
    `

    const TabelHeadCell = styled.td`
        padding: 15px 10px;
        border: 2px solid #000;
        border-collapse: collapse;
        font-size: 15px;
        font-weight: 800;
        text-align: center;
    `

    const TabelCell = styled.td`
        padding: 15px 10px;
        border: 2px solid #000;
        border-collapse: collapse;
        font-size: 15px;
        font-weight: 400;
        text-align: center;
    `

    return (<Table>
        <thead>
            <tr>
                <TabelHeadCell>Section</TabelHeadCell>
                <TabelHeadCell>Course Code </TabelHeadCell>
                <TabelHeadCell>Course Name</TabelHeadCell>
                <TabelHeadCell>Academic Year</TabelHeadCell>
                <TabelHeadCell>Year / Sem</TabelHeadCell>
                <TabelHeadCell>Student Count</TabelHeadCell>
                <TabelHeadCell>Average (%)</TabelHeadCell>
            </tr>
        </thead>
        <tbody>
            {reportData.map((obj, i) => {
                const { section, subjectCode, subject, acYear, currentYear, currentSem, studentCount, feedbackPercentage } = obj
                return <tr key={i}>
                    <TabelCell>{section}</TabelCell>
                    <TabelCell>{subjectCode}</TabelCell>
                    <TabelCell>{subject}</TabelCell>
                    <TabelCell>{acYear}</TabelCell>
                    <TabelCell>{`${currentYear} / ${currentSem}`}</TabelCell>
                    <TabelCell>{studentCount}</TabelCell>
                    <TabelCell>{feedbackPercentage}</TabelCell>
                </tr>
            })}
        </tbody>
    </Table>)
}