import React, { useEffect, useState } from "react"
import FormWrapper from "../../../components/FormWrapper"
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import axios from "../../../services/Api"
import { useNavigate } from "react-router";
import { GenerateStudentAdmissionCancellation } from "./templates/StudentAdmissionCancellation";
import { GenerateStudentAdmission } from "./templates/StudentAdmission";
import PDFPreview from "./PDFPreview";
import { GenerateJoiningOrder } from "./templates/JoiningOrder";
import { GenerateRelievingOrder } from "./templates/RelievingOrder";
import moment from "moment";

const OutwardCommunicationSubmission = ({moveToFirstTab}) => {
    const [dataLoading, setDataLoading] = React.useState(false);
    const [templateList, setTemplateList] = React.useState([])
	const [selectedTemplate, setSelectedTemplate] = React.useState("Select Template")
	const [withLetterhead, setWithLetterhead] = React.useState("Yes")
	const [userData, setUserdata] = React.useState({})
	const [useridErrorText, setuserIdErrorText] = React.useState("")
	const [userIdSearchError, setUserIdSearchError] = React.useState(false)
	const [searchUserId, setSearchUserId] = React.useState("")
    const [filePath, setFilePath] = useState("")
    const [fileName, setFileName] = useState("")
    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
		getCategories()
	}, [])

    useEffect(() => {
        if(Object.keys(userData).length > 0){
            generateBlobFile()
        }
    }, [userData])

    const getCategories = async () => {
		try {
			const res = await axios.get(`/api/getCategories`)
			const data = res.data.data

			if (data.length <= 0) return;
			setTemplateList([{ "categoryDetailsId": "Select Template", "categoryName": "Select Template" }, ...data])
		} catch (error) {
			console.log(error);
			alert("Failed to fetch category list data");
		}
	}

    const generateBlobFile = async () => {
        const today = moment(new Date().toLocaleDateString()).format("DD/MM/YYYY")
		if(selectedTemplate === 18){
			// Student Admission Cancellation
			const { name, userCode, dateOfAdmission, cancelAdmissionDate } = userData
            const doa = moment(dateOfAdmission).format("DD/MM/YYYY")
            const dateOfCancellAdmission = moment(cancelAdmissionDate).format("DD/MM/YYYY")
			const blobFile = await GenerateStudentAdmissionCancellation("", name, userCode, withLetterhead, today, doa, dateOfCancellAdmission)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("student_admission_cancellation_")
		}else if(selectedTemplate === 17){
			// Student Admission
			const { name, userCode, dateOfAdmission, academicYear } = userData
            const doa = moment(dateOfAdmission).format("DD/MM/YYYY")
			const blobFile = await GenerateStudentAdmission("", name, userCode, withLetterhead, today, academicYear, doa)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("student_admission_")
		}else if(selectedTemplate === 20){
			// Staff Relieving
            const { name, dateOfRelieving, designationName } = userData
            if(dateOfRelieving === null || dateOfRelieving === undefined || dateOfRelieving === "") return alert("Date of leaving not found") 
            if(designationName === null || designationName === undefined || designationName === "") return alert("Designation not found") 
            
            const dol = moment(dateOfRelieving).format("DD/MM/YYYY")
			const blobFile = await GenerateRelievingOrder("", name, dol, withLetterhead, today, designationName)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("Relieving_order_")
		}else if(selectedTemplate === 19){
			// Joining Order
            const { name, dateOfJoining, designationName, salary } = userData
            if(dateOfJoining === null || dateOfJoining === undefined || dateOfJoining === "") return alert("Date of Joining not found") 
            if(designationName === null || designationName === undefined || designationName === "") return alert("Designation not found") 
            const doj = moment(dateOfJoining).format("DD/MM/YYYY")
			const blobFile = await GenerateJoiningOrder("", name, doj, withLetterhead, today, designationName, salary)
            const path = URL.createObjectURL(blobFile);
            setFilePath(path)
            setFileName("Joining_order_")
		}
	}

	const getUserDetails = async () => {
		try {
            if(selectedTemplate === "Select Template") return alert("Please select template")

            if(searchUserId === null || searchUserId === undefined || searchUserId === ""){
                setuserIdErrorText("Please provide userid to search")
                setUserIdSearchError(true)
                return
            }

            setUserIdSearchError(false)
            setuserIdErrorText("")

			setDataLoading(true);
			const res = await axios.get(`/api/getUserDetailsWithSearchText?userCode=${searchUserId}`)
			const data = res.data.data
			setuserIdErrorText("")
			setUserIdSearchError(false)
            if(Object.keys(data).length <= 0){
                setUserIdSearchError(true)
                setuserIdErrorText("No User Found")
                return
            } 

			setUserdata(data)
		} catch (error) {
			console.log(error);
			setuserIdErrorText("Failed to get user details")
			setUserIdSearchError(true)
            setFilePath("")
            setFileName("")
		}
	}

    const handleSave = () => {
        if(searchUserId === "") return alert("Please provide proper user id")
        if(selectedTemplate === "Select Template") return alert("Please select template")

        const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
        const usertype = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;

        const selectedTemplateDetails = templateList.find(obj => obj.categoryDetailsId === selectedTemplate)
        const { categoryTypeId, categoryShortName, categoryDetailsId } = selectedTemplateDetails

        const payload = {
            userId: userData.userId,
            userCode: userData.userCode,
            categoryTypeId: categoryTypeId,
            categoryDetailId: categoryDetailsId,
            content: "",
            categoryShortName: categoryShortName,
            createdBy: userId,
            usertype: usertype,
            templateType: "CUSTOM",
            withLetterHead: withLetterhead === "Yes" ? true : false
        }

        axios.post("/api/customtemplate/createCustomTemplate", payload)
        .then(res => {
            setUserdata({})
            setFileName("")
            setFilePath("")
            setSearchUserId("")
            moveToFirstTab()
        })
        .catch(err => {
            console.log(err)
            const message = err.response ? err.response.data.message : "Failed to save the content"
            alert(message)
        })
    }

    return (<>
        {showModal && <PDFPreview fileName={fileName} filePath={filePath} openModal={showModal} handleModal={setShowModal} templateType="" showDownloadButton={false} />}
        <FormWrapper>
            <Grid container>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                        <Button onClick={() => navigate(`/documentsrepo/custom-template`)}>Instant Template</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3} mt={2}>
                    <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                With Letterhead
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={withLetterhead}
                                label="With Letterhead"
                                onChange={(e) => setWithLetterhead(e.target.value)}
                            >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                Templates
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedTemplate}
                                label="Templates"
                                onChange={(e) => {
                                    setSelectedTemplate(e.target.value)
                                    setFileName("")
                                    setFilePath("")
                                }}
                            >
                                {templateList.map((obj, i) => {
                                    const { categoryName, categoryDetailsId } = obj
                                    return <MenuItem value={categoryDetailsId} key={i}>{categoryName}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                            sx={{ width: "100%" }}
                            onChange={e => setSearchUserId(e.target.value)}
                            error={userIdSearchError}
                            id="outlined-error-helper-text"
                            label="AUID / Staff ID"
                            helperText={useridErrorText}
                            value={searchUserId}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} mt={2}>
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3} sx={{display: "flex", gap: "15px"}}>
                        <Button onClick={getUserDetails} variant="contained">
                            Submit
                        </Button>
                        <Button onClick={() => setShowModal(true)} variant="contained"
                            disabled={Object.keys(userData).length <= 0 || filePath === ""}>
                            Preview
                        </Button>
                        <Button onClick={handleSave} variant="contained"
                            disabled={Object.keys(userData).length <= 0 || filePath === ""}>
                            Save / Lock
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </FormWrapper>
    </>)
}

export default OutwardCommunicationSubmission