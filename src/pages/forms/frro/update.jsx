import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import StudentDetails from "../../../components/StudentDetails";
import moment from "moment";

const initialValues = {
    nameAsPerPassport: "",
    passportNo: "",
    visaNo: "",
    fsis: "",
    birthPlace: "",
    passportIssuePlace: "",
    visaType: "",
    immigrationDate: "",
    portOfArrival: "",
    passportIssueDate: "",
    typeOfEntry: "",
    issueBy: "",
    portOfDeparture: "",
    passportExpiryDate: "",
    placeOfVisaIssue: "",
    rpNo: "",
    isReportedToIndia: "",
    reportedOn: "",
    visaIssueDate: "",
    remarks: "",
    rpIssueDate: "",
    rpExpiryDate: "",
    visaExpiryDate: "",
    aluEquivalenceDocument: "",
    passportCopyDocument: "",
    visaCopyDocument: "",
    residentialPermitCopyDocument: "",
};

const requiredFields = ["nameAsPerPassport", "passportNo", "visaNo", "fsis", "birthPlace", "passportIssuePlace",
    "visaType", "immigrationDate", "portOfArrival", "passportIssueDate", "typeOfEntry", "issueBy", "portOfDeparture",
    "passportExpiryDate", "placeOfVisaIssue", "rpNo", "isReportedToIndia", "reportedOn", "visaIssueDate", "rpIssueDate",
    "visaExpiryDate", "rpExpiryDate"
];

function FRROUpdate() {
    const { id } = useParams()
    const [values, setValues] = useState(initialValues);
    const [auid, setAuid] = useState("")
    const [showStudentData, setShowStudentData] = useState(false)
    const [studentDetails, setStudentDetails] = useState({})
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({})

    const { setAlertMessage, setAlertOpen } = useAlert();
    const navigate = useNavigate();
    const setCrumbs = useBreadcrumbs();

    const checks = {
        nameAsPerPassport: [values.nameAsPerPassport !== ""],
        passportNo: [values.passportNo !== ""],
        visaNo: [values.visaNo !== ""],
        fsis: [values.fsis !== ""],
        birthPlace: [values.birthPlace !== ""],
        passportIssuePlace: [values.passportIssuePlace !== ""],
        visaType: [values.visaType !== ""],
        immigrationDate: [values.immigrationDate !== ""],
        portOfArrival: [values.portOfArrival !== ""],
        passportIssueDate: [values.passportIssueDate !== ""],
        typeOfEntry: [values.typeOfEntry !== ""],
        issueBy: [values.issueBy !== ""],
        portOfDeparture: [values.portOfDeparture !== ""],
        passportExpiryDate: [values.passportExpiryDate !== ""],
        placeOfVisaIssue: [values.placeOfVisaIssue !== ""],
        rpNo: [values.rpNo !== ""],
        isReportedToIndia: [values.isReportedToIndia !== "" && values.isReportedToIndia !== null],
        reportedOn: [values.reportedOn !== ""],
        visaIssueDate: [values.visaIssueDate !== ""],
        rpIssueDate: [values.rpIssueDate !== ""],
        visaExpiryDate: [values.visaExpiryDate !== ""],
        rpExpiryDate: [values.rpExpiryDate !== ""],
        aluEquivalenceDocument: [
            values.aluEquivalenceDocument,
            values.aluEquivalenceDocument &&
            values.aluEquivalenceDocument.name.endsWith(".pdf"),
            values.aluEquivalenceDocument && values.aluEquivalenceDocument.size < 2000000,
        ],
        passportCopyDocument: [
            values.passportCopyDocument,
            values.passportCopyDocument &&
            values.passportCopyDocument.name.endsWith(".pdf"),
            values.passportCopyDocument && values.passportCopyDocument.size < 2000000,
        ],
        visaCopyDocument: [
            values.visaCopyDocument,
            values.visaCopyDocument &&
            values.visaCopyDocument.name.endsWith(".pdf"),
            values.visaCopyDocument && values.visaCopyDocument.size < 2000000,
        ],
        residentialPermitCopyDocument: [
            values.residentialPermitCopyDocument,
            values.residentialPermitCopyDocument &&
            values.residentialPermitCopyDocument.name.endsWith(".pdf"),
            values.residentialPermitCopyDocument && values.residentialPermitCopyDocument.size < 2000000,
        ],
    };

    const errorMessages = {
        nameAsPerPassport: ["This field required"],
        passportNo: ["This field required"],
        visaNo: ["This field required"],
        fsis: ["This field required"],
        birthPlace: ["This field required"],
        passportIssuePlace: ["This field required"],
        visaType: ["This field required"],
        immigrationDate: ["This field required"],
        portOfArrival: ["This field required"],
        passportIssueDate: ["This field required"],
        typeOfEntry: ["This field required"],
        issueBy: ["This field required"],
        portOfDeparture: ["This field required"],
        passportExpiryDate: ["This field required"],
        placeOfVisaIssue: ["This field required"],
        rpNo: ["This field required"],
        isReportedToIndia: ["This field required"],
        reportedOn: ["This field required"],
        visaIssueDate: ["This field required"],
        rpIssueDate: ["This field required"],
        visaExpiryDate: ["This field required"],
        rpExpiryDate: ["This field required"],
        aluEquivalenceDocument: [
            "This field is required",
            "Please upload a PDF",
            "Maximum size 2 MB",
        ],
        passportCopyDocument: [
            "This field is required",
            "Please upload a PDF",
            "Maximum size 2 MB",
        ],
        visaCopyDocument: [
            "This field is required",
            "Please upload a PDF",
            "Maximum size 2 MB",
        ],
        residentialPermitCopyDocument: [
            "This field is required",
            "Please upload a PDF",
            "Maximum size 2 MB",
        ],
    };

    useEffect(() => {
        setCrumbs([{ name: "FRRO", link: "/intl/frro" }, { name: "Update" }])
        getFrroDetails()
    }, [])
    
    const getFrroDetails = () => {
        axios.get(`/api/frro/getFrroList`)
        .then(res => {
            const response = res.data.data.filter(obj => obj.studentId === parseInt(id))[1]
            setData(response)
            const { nameAsPerPassport, passportNo, visaNo, fsis, birthPlace, passportIssuePlace, visaType,
                portOfArrival, typeOfEntry, issueBy, placeOfVisaIssue, rpNo, isReportedToIndia, remarks,
                immigrationDate, passportIssueDate, passportExpiryDate, portOfDeparture, visaIssueDate,
                rpIssueDate, visaExpiryDate, rpExpiryDate, reportedOn
            } = response
            let obj = {
                nameAsPerPassport, passportNo, visaNo, fsis, birthPlace, passportIssuePlace, visaType, portOfArrival,
                typeOfEntry, issueBy, placeOfVisaIssue, rpNo, isReportedToIndia: isReportedToIndia ? "Yes" : "No",
                remarks, immigrationDate: moment(immigrationDate), passportIssueDate: moment(passportIssueDate),
                passportExpiryDate: moment(passportExpiryDate), portOfDeparture, visaIssueDate: moment(visaIssueDate),
                rpIssueDate: moment(rpIssueDate), visaExpiryDate: moment(visaExpiryDate), rpExpiryDate: moment(rpExpiryDate),
                reportedOn: moment(reportedOn)
            }
            setValues(obj)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleChange = (e) => {
        if (e.target.name === "userName") {
            const email = e.target.value
                ? e.target.value.replace(/ +/g, "") + "@acharya.ac.in"
                : e.target.value.replace(/ +/g, "");
            setValues((prev) => ({
                ...prev,
                userName: e.target.value.replace(/ +/g, ""),
                email: email,
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const handleChangeDate = (name, newValue) => {
        setValues((prev) => ({
          ...prev,
          [name]: newValue,
        }));
      };

    const handleFileDrop = (name, newFile) => {
        if (newFile)
            setValues((prev) => ({
                ...prev,
                [name]: newFile,
            }));
    };

    const handleFileRemove = (name) => {
        setValues((prev) => ({
            ...prev,
            [name]: null,
        }));
    };

    const requiredFieldsValid = () => {
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (Object.keys(checks).includes(field)) {
                const ch = checks[field];
                for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
            } else if (!values[field]) return false;
        }
        return true;
    };

    const handleUpdate = async (e) => {
        try {
            if (!requiredFieldsValid()) {
                setAlertMessage({
                    severity: "error",
                    message: "Please fill all fields",
                });
                setAlertOpen(true);
            } else {
                if(Object.keys(studentDetails).length <= 0) return alert("No Student Found!!!")
                setLoading(true);
                const { aluEquivalenceDocumentPath, passportCopyDocumentPath, residentialPermitCopyDocumentPath, visaCopyDocumentPath } = await handleUploadDocuments()
                const temp = {};
                temp.nameAsPerPassport = values.nameAsPerPassport;
                temp.visaNo = values.visaNo
                temp.passportNo = values.passportNo;
                temp.fsis = values.fsis;
                temp.birthPlace = values.birthPlace;
                temp.passportIssuePlace = values.passportIssuePlace;
                temp.visaType = values.visaType 
                temp.immigrationDate = values.immigrationDate;
                temp.portOfArrival = values.portOfArrival;
                temp.passportIssueDate = values.passportIssueDate;
                temp.typeOfEntry = values.typeOfEntry;
                temp.issueBy = values.issueBy;
                temp.portOfDeparture = values.portOfDeparture 
                temp.passportExpiryDate = values.passportExpiryDate;
                temp.placeOfVisaIssue = values.placeOfVisaIssue;
                temp.rpNo = values.rpNo;
                temp.isReportedToIndia = values.isReportedToIndia === "Yes" ? true : false;
                temp.reportedOn = values.reportedOn
                temp.visaIssueDate = values.visaIssueDate;
                temp.rpIssueDate = values.rpIssueDate 
                temp.remarks = values.remarks;
                temp.visaExpiryDate = values.visaExpiryDate;
                temp.rpExpiryDate = values.rpExpiryDate;
                temp.aluEquivalenceDocument = aluEquivalenceDocumentPath 
                temp.passportCopyDocument = passportCopyDocumentPath
                temp.visaCopyDocument = visaCopyDocumentPath
                temp.residentialPermitCopyDocument = residentialPermitCopyDocumentPath
                temp.studentId = id

                axios.put(`/api/frro/updateFrro?studentId=${id}`, temp)
                    .then((res) => {
                        setLoading(false);
                        if (res.status === 200 || res.status === 201) {
                            setAlertMessage({
                                severity: "success",
                                message: "Form Submitted Successfully",
                            });
                            navigate("/intl/frro")
                        } else {
                            setAlertMessage({
                                severity: "error",
                                message: res.data ? res.data.message : "An error occured",
                            });
                        }
                        setAlertOpen(true);
                    })
                    .catch((error) => {
                        setLoading(false);
                        setAlertMessage({
                            severity: "error",
                            message: error.response ? error.response.data.message : "Error",
                        });
                        setAlertOpen(true);
                    });
            }
        } catch (error) {
            setLoading(false);
            setAlertMessage({
                severity: "error",
                message: error.response ? error.response.data.message : "Error",
            });
            setAlertOpen(true);
        }
    };

    const handleUploadDocuments = async () => {
        try {
            const uploadDocument = async (file, fileType) => {
                return new Promise((resolve, reject) => {
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("fileType", fileType)
                    formData.append("studentId", id)

                    axios.post("/api/frro/uploadFrroFile", formData)
                        .then(res => {
                            resolve(res.data.data.attachmentPath)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
            }

            let docPath = {
                aluEquivalenceDocumentPath: data.aluEquivalenceDocument,
                passportCopyDocumentPath: data.passportCopyDocument,
                residentialPermitCopyDocumentPath: data.residentialPermitCopyDocument,
                visaCopyDocumentPath: data.visaCopyDocument
            }
            const { aluEquivalenceDocument, passportCopyDocument, residentialPermitCopyDocument, visaCopyDocument } = values
            if (aluEquivalenceDocument){
                const path = await uploadDocument(aluEquivalenceDocument, "ALU")
                docPath["aluEquivalenceDocumentPath"] = path
            }

            if (passportCopyDocument){
                const path = await uploadDocument(passportCopyDocument, "Passport")
                docPath["passportCopyDocumentPath"] = path
            }

            if (residentialPermitCopyDocument){
                const path = await uploadDocument(residentialPermitCopyDocument, "Resident")
                docPath["residentialPermitCopyDocumentPath"] = path
            }

            if (visaCopyDocument){
                const path = await uploadDocument(visaCopyDocument, "Visa")
                docPath["visaCopyDocumentPath"] = path
            }
            
            return docPath
        } catch (error){
            throw new Error("Failed to upload Documents")
        }
    }

    return (
        <Box component="form" overflow="hidden" p={1}>
            <FormWrapper>
                {Object.keys(studentDetails).length <= 0 &&
                    <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }} sx={{ marginBottom: "30px" }}>
                        <Grid item xs={12} md={6} lg={4}></Grid>

                        <Grid item xs={12} md={6} lg={4} sx={{ display: "flex", gap: "30px" }}>
                            <CustomTextField
                                name="auid"
                                label="AUID"
                                value={auid}
                                handleChange={e => setAuid(e.target.value)}
                                checks={checks.nameAsPerPassport}
                                errors={errorMessages.nameAsPerPassport}
                                size="large"
                                required
                            />
                            <Button
                                style={{ borderRadius: 7, height: "50px" }}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                onClick={() => {
                                    if (auid) setShowStudentData(true)
                                }}
                            >
                                <strong>Submit</strong>
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}></Grid>
                    </Grid>}
                <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }} sx={{ marginBottom: "30px" }}>
                    <Grid item xs={12} md={12} lg={12}>
                        <StudentDetails id={id} isStudentdataAvailable={(data) => setStudentDetails(data)} />
                    </Grid>
                </Grid>
                <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="nameAsPerPassport"
                            label="Name as per passport"
                            value={values.nameAsPerPassport}
                            handleChange={handleChange}
                            checks={checks.nameAsPerPassport}
                            errors={errorMessages.nameAsPerPassport}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="passportNo"
                            label="Passport No"
                            value={values.passportNo}
                            handleChange={handleChange}
                            checks={checks.passportNo}
                            errors={errorMessages.passportNo}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="visaNo"
                            label="Visa No"
                            value={values.visaNo}
                            handleChange={handleChange}
                            checks={checks.visaNo}
                            errors={errorMessages.visaNo}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="fsis"
                            label="Fsis No"
                            value={values.fsis}
                            handleChange={handleChange}
                            checks={checks.fsis}
                            errors={errorMessages.fsis}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="birthPlace"
                            label="Birth Place"
                            value={values.birthPlace}
                            handleChange={handleChange}
                            checks={checks.birthPlace}
                            errors={errorMessages.birthPlace}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="passportIssuePlace"
                            label="Passport Issue Place"
                            value={values.passportIssuePlace}
                            handleChange={handleChange}
                            checks={checks.passportIssuePlace}
                            errors={errorMessages.passportIssuePlace}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="visaType"
                            label="Visa Type"
                            value={values.visaType}
                            handleChange={handleChange}
                            checks={checks.visaType}
                            errors={errorMessages.visaType}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="immigrationDate"
                            label="Immigration Date"
                            value={values.immigrationDate}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.immigrationDate}
                            errors={errorMessages.immigrationDate}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="portOfArrival"
                            label="Port of Arrival"
                            value={values.portOfArrival}
                            handleChange={handleChange}
                            checks={checks.portOfArrival}
                            errors={errorMessages.portOfArrival}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="passportIssueDate"
                            label="Passport Issue Date"
                            value={values.passportIssueDate}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.passportIssueDate}
                            errors={errorMessages.passportIssueDate}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="typeOfEntry"
                            label="Type of Entry"
                            value={values.typeOfEntry}
                            handleChange={handleChange}
                            checks={checks.typeOfEntry}
                            errors={errorMessages.typeOfEntry}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="issueBy"
                            label="Issue By"
                            value={values.issueBy}
                            handleChange={handleChange}
                            checks={checks.issueBy}
                            errors={errorMessages.issueBy}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="portOfDeparture"
                            label="Port Of Departure"
                            value={values.portOfDeparture}
                            handleChange={handleChange}
                            checks={checks.portOfDeparture}
                            errors={errorMessages.portOfDeparture}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="passportExpiryDate"
                            label="Passport Expiry Date"
                            value={values.passportExpiryDate}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.passportExpiryDate}
                            errors={errorMessages.passportExpiryDate}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="placeOfVisaIssue"
                            label="Place Of Visa Issue"
                            value={values.placeOfVisaIssue}
                            handleChange={handleChange}
                            checks={checks.placeOfVisaIssue}
                            errors={errorMessages.placeOfVisaIssue}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomTextField
                            name="rpNo"
                            label="Rp No"
                            value={values.rpNo}
                            handleChange={handleChange}
                            checks={checks.rpNo}
                            errors={errorMessages.rpNo}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomRadioButtons
                            name="isReportedToIndia"
                            label="Reported To India"
                            value={values.isReportedToIndia}
                            items={[
                                {
                                    value: "Yes",
                                    label: "Yes",
                                },
                                {
                                    value: "No",
                                    label: "No",
                                },
                            ]}
                            handleChange={handleChange}
                            checks={checks.isReportedToIndia}
                            errors={errorMessages.isReportedToIndia}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="reportedOn"
                            label="Reported On"
                            value={values.reportedOn}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.reportedOn}
                            errors={errorMessages.reportedOn}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="visaIssueDate"
                            label="Visa Issue Date"
                            value={values.visaIssueDate}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.visaIssueDate}
                            errors={errorMessages.visaIssueDate}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="rpIssueDate"
                            label="Rp Issue Date"
                            value={values.rpIssueDate}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.rpIssueDate}
                            errors={errorMessages.rpIssueDate}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <CustomTextField name="remarks" label="Remarks" value={values.remarks} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="visaExpiryDate"
                            label="Visa Expiry Date"
                            value={values.visaExpiryDate}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.visaExpiryDate}
                            errors={errorMessages.visaExpiryDate}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <CustomDatePicker
                            name="rpExpiryDate"
                            label="Rp Expiry Date"
                            value={values.rpExpiryDate}
                            handleChangeAdvance={handleChangeDate}
                            checks={checks.rpExpiryDate}
                            errors={errorMessages.rpExpiryDate}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} sx={{ mt: 4 }}>
                        <CustomFileInput
                            name="aluEquivalenceDocument"
                            label="ALU Equivalence Document"
                            helperText="PDF - smaller than 2 MB"
                            file={values.aluEquivalenceDocument}
                            handleFileDrop={handleFileDrop}
                            handleFileRemove={handleFileRemove}
                            checks={checks.aluEquivalenceDocument}
                            errors={errorMessages.aluEquivalenceDocument}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} sx={{ mt: 4 }}>
                        <CustomFileInput
                            name="passportCopyDocument"
                            label="Passport Copy Document"
                            helperText="PDF - smaller than 2 MB"
                            file={values.passportCopyDocument}
                            handleFileDrop={handleFileDrop}
                            handleFileRemove={handleFileRemove}
                            checks={checks.passportCopyDocument}
                            errors={errorMessages.passportCopyDocument}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} sx={{ mt: 4 }}>
                        <CustomFileInput
                            name="visaCopyDocument"
                            label="Visa Copy Document"
                            helperText="PDF - smaller than 2 MB"
                            file={values.visaCopyDocument}
                            handleFileDrop={handleFileDrop}
                            handleFileRemove={handleFileRemove}
                            checks={checks.visaCopyDocument}
                            errors={errorMessages.visaCopyDocument}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} sx={{ mt: 4 }}>
                        <CustomFileInput
                            name="residentialPermitCopyDocument"
                            label="Residential Permit Copy Document"
                            helperText="PDF - smaller than 2 MB"
                            file={values.residentialPermitCopyDocument}
                            handleFileDrop={handleFileDrop}
                            handleFileRemove={handleFileRemove}
                            checks={checks.residentialPermitCopyDocument}
                            errors={errorMessages.residentialPermitCopyDocument}
                        />
                    </Grid>
                    <Grid item xs={12} align="right">
                        <Button
                            style={{ borderRadius: 7 }}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={handleUpdate}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={25}
                                    color="blue"
                                    style={{ margin: "2px 13px" }}
                                />
                            ) : (
                                <strong>Update</strong>
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </FormWrapper>
        </Box>
    );
}

export default FRROUpdate;
