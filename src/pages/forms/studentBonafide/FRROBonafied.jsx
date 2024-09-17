import { useEffect, useState } from "react";
import FormWrapper from "../../../components/FormWrapper"
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import FRROExpansionTemplate from "./FRROExpansionTemplate";
import { GenerateFrroPdf } from "./GenerateFRROPdf";
import moment from "moment";
import CustomModal from "../../../components/CustomModal";

const INITIAL_VALUES = {
    fsisNo: "",
    studentName: "",
    dob: "",
    sex: "",
    fatherOrHusbandName: "",
    passportNo: "",
    passportValidFrom: "",
    passportValidTo: "",
    visaNo: "",
    visaValidFrom: "",
    visaValidTo: "",
    address: "",
    registrationNo: "",
    studentVisaIssued: "",
    nameAndReferenceNoOfInst: "",
    nameAndReferenceNoOfCourse: "",
    nameOfCourse: "",
    coursePeriodFrom: "",
    coursePeriodTo: "",
    attendingClass: "",
    extensionDate: "",
    yearAndSem: "",
    purpose: "",
    remarks: "",
}

const modalContents = {
    title: "",
    message: "",
    buttons: [],
}
const FRROBonafied = () => {
    const [data, setData] = useState({})
    const [values, setValues] = useState(INITIAL_VALUES)
    const [loading, setLoading] = useState(false)
    const [selectedBonafied, setSelectedBonafied] = useState("")
    const [auid, setAuid] = useState("")
    const [downloadingPdf, setDownloadingPdf] = useState(false)
    const [bonafiedTypes, setBonafiedTypes] = useState([])
    const [noRecordFound, setNoRecordFound] = useState(true)
    const [submitModalOpen, setSubmitModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(modalContents)

    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        if (selectedBonafied !== "")
            setValues(prev => ({
                ...prev,
                purpose: bonafiedTypes.filter(obj => obj.value === selectedBonafied)[0].label.split("-")[1]
            }))
    }, [selectedBonafied])

    const getCategories = () => {
        axios.get("/api/getCategoriesForFrro")
            .then(res => {
                const types = res.data.data.map(obj => {
                    return { value: obj.categoryDetailsId, label: obj.categoryName }
                })
                setBonafiedTypes(types)
                setSelectedBonafied(types.length > 0 ? types[0].value : "")
            })
            .catch(err => console.log(err))
    }

    const handleChangeAdvance = (name, newValue) => setSelectedBonafied(newValue)

    const handleAttendingClass = (name, newValue) => {
        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }))
    }

    const handleChangeTextarea = (e) => {
        const name = e.target.name
        const value = e.target.value
        setValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleChangeDate = (name, newValue) => {
        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/frro/getStudentDetailsForFrro?studentId=${auid}`)
            if (res.data.data) {
                setNoRecordFound(false)
                setData(res.data.data)
                const obj = res.data.data
                setValues({
                    fsisNo: obj.fsis,
                    studentName: obj.nameAsPerPassport,
                    dob: moment(obj.dateOfBirth).format("DD-MM-YYYY"),
                    sex: obj.genderString,
                    fatherOrHusbandName: obj.fatherName,
                    passportNo: obj.passportNo,
                    passportValidFrom: obj.passportIssueDate,
                    passportValidTo: obj.passportExpiryDate,
                    visaNo: obj.visaNo,
                    visaValidFrom: obj.visaIssueDate,
                    visaValidTo: obj.visaExpiryDate,
                    address: obj.currentAddress,
                    registrationNo: obj.auid,
                    studentVisaIssued: obj.visaIssued ? obj.visaIssued : "",
                    nameAndReferenceNoOfInst: obj.recognition ? obj.recognition : "",
                    nameAndReferenceNoOfCourse: obj.affiliataion ? obj.affiliataion : "",
                    nameOfCourse: obj.programName,
                    coursePeriodFrom: "",
                    coursePeriodTo: "",
                    attendingClass: "",
                    extensionDate: "",
                    yearAndSem: `${obj.currentYear}/${obj.currentSem}`,
                    purpose: bonafiedTypes.filter(obj => obj.value === selectedBonafied)[0].label.split("-")[1],
                    remarks: "",
                })
            } else setNoRecordFound(true)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const updateData = () => {
        let payload = {...data}
        payload["visaIssued"] = values.studentVisaIssued
        payload["recognition"] = values.nameAndReferenceNoOfInst
        payload["affiliataion"] = values.nameAndReferenceNoOfCourse
        axios.put(`/api/frro/getStudentDetailsForFrro?studentId=${auid}`, payload)
        .then(res => {})
        .catch(err => console.log(err))
    }

    const downloadPdf = async (letterHeadReq) => {
        setDownloadingPdf(true)
        await GenerateFrroPdf(values, letterHeadReq)
        updateData()
        setDownloadingPdf(false)
    }

    const generatePdf = () => {
        setSubmitModalOpen(true);
        setModalContent_("", "Do you want to print with letter head?", [
            { name: "Yes", color: "primary", func: () => downloadPdf(true) },
            { name: "No", color: "primary", func: () => downloadPdf(false) },
        ]);
    };

    const setModalContent_ = (title, message, buttons) => {
        setModalContent({
            title: title,
            message: message,
            buttons: buttons,
        })
    };

    return <Box component="form" overflow="hidden" p={1} mt={2}>
        {!!submitModalOpen && (
            <CustomModal
                open={submitModalOpen}
                setOpen={setSubmitModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                buttons={modalContent.buttons}
            />
        )}
        <FormWrapper>
            <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 2, md: 4 }}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={12} md={3}>
                    <CustomAutocomplete
                        name="bonafideTypeId"
                        label="Bonafide Type"
                        value={selectedBonafied}
                        options={bonafiedTypes}
                        handleChangeAdvance={handleChangeAdvance}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <CustomTextField
                        name="auid"
                        label="AUID"
                        value={auid}
                        handleChange={e => setAuid(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button
                        style={{ borderRadius: 7 }}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <CircularProgress
                                size={25}
                                color="blue"
                                style={{ margin: "2px 13px" }}
                            />
                        ) : (
                            <strong>Submit</strong>
                        )}
                    </Button>
                </Grid>
            </Grid>
        </FormWrapper>

        <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={2}></Grid>
            <Grid item xs={12} sm={12} md={12} lg={8}>
                {noRecordFound ? <h2 style={{ textAlign: "center" }}>No Data Found</h2> :
                    <><Button
                        style={{ borderRadius: 7, float: "right" }}
                        variant="contained"
                        color="primary"
                        disabled={downloadingPdf}
                        onClick={generatePdf}
                    >PRINT</Button>
                        <FRROExpansionTemplate data={values}
                            handleChange={handleChangeTextarea}
                            handleChangeDate={handleChangeDate}
                            handleAttendingClass={handleAttendingClass} />
                    </>
                }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={2}></Grid>
        </Grid>
    </Box>
}

export default FRROBonafied