import { useEffect, useState } from "react"
import axios from "../../../services/Api"
import { useNavigate } from "react-router-dom"
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import moment from "moment"
import AttachmentIcon from '@mui/icons-material/Attachment'
import HistoryIcon from '@mui/icons-material/History'
import CloseIcon from '@mui/icons-material/Close'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import styled from "@emotion/styled"
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

const ModalSection = styled.div`
        visibility: 1;
        opacity: 1;
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        transition: opacity 1s;
        z-index: 999;
    `;

const ModalContainer = styled.div`
    max-width: 66%;
    min-height: 85%;
    max-height: 85%;
    margin: 100px auto;
    border-radius: 5px;
    width: 100%;
    position: relative;
    transition: all 2s ease-in-out;
    padding: 30px;
    background-color: #ffffff;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media screen and (max-width: 1024px) {
        min-width: 85%;
    }
`;

const FRRO = () => {
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const [showAttachemnts, setShowAttachements] = useState(false)
    const [showHistory, setShowHistory] = useState(false)

    useEffect(() => {
        getFrroStudentList()
    }, [])

    const getFrroStudentList = () => {
        axios.get("/api/frro/getFrroLists")
            .then(res => {
                if (!res.data.data) return
                setRows(res.data.data)
            })
    }

    const handleAttachments = row => {
        setSelectedRow(row)
        setShowAttachements(true)
    }

    const ShowAttachmentsIcon = ({ row }) => {
        const { residentialPermitCopyDocument, aluEquivalenceDocument,
            passportCopyDocument, visaCopyDocument
        } = row
        const attachments = [residentialPermitCopyDocument, aluEquivalenceDocument, passportCopyDocument, visaCopyDocument]
        if (attachments.filter(Boolean).length > 0)
            return <IconButton color="primary" onClick={() => handleAttachments(row)}>
                <AttachmentIcon />
            </IconButton>

        return null
    }

    const handleHistory = row => {
        setSelectedRow(row)
        setShowHistory(true)
    }

    const columns = [
        { field: "auid", headerName: "AUID", flex: 1 },
        { field: "nameAsPerPassport", headerName: "Name as per passport", flex: 1 },
        { field: "nationality", headerName: "Nationality", flex: 1 },
        { field: "passportNo", headerName: "Passport Number", flex: 1, hide: true },
        {
            field: "passportExpiryDate", headerName: "Passport Expiry date", flex: 1,
            renderCell: (params) => params.row.passportExpiryDate
        },
        {
            field: "visaExpiryDate", headerName: "Visa Expiry Date", flex: 1,
            renderCell: (params) => params.row.visaExpiryDate
        },
        {
            field: "rpExpiryDate", headerName: "RP Expiry Date", flex: 1,
            renderCell: (params) => params.row.rpExpiryDate
        },
        {
            field: "immigrationDate", headerName: "Immigration Date", flex: 1,
            renderCell: (params) => params.row.immigrationDate
        },
        {
            field: "reportedOn", headerName: "Reported Date", flex: 1,
            renderCell: (params) => params.row.reportedOn
        },
        {
            field: "Attachments", headerName: "Attachments", flex: 1,
            renderCell: (params) => <ShowAttachmentsIcon row={params.row} />
        },
        {
            field: "History", headerName: "History", flex: 1,
            renderCell: (params) =>
                <IconButton color="primary" onClick={() => handleHistory(params.row)}>
                    <HistoryIcon />
                </IconButton>
        },
        {
            field: "Edit", headerName: "Edit", flex: 1,
            renderCell: (params) =>
                <IconButton color="primary" onClick={() => navigate(`/intl/frro/update/${params.row.studentId}`)}>
                    <ModeEditIcon />
                </IconButton>
        },
    ]

    return (<Box>
        {showAttachemnts && <Attachments row={selectedRow} handleClose={() => setShowAttachements(false)} />}
        {showHistory && <History row={selectedRow} handleClose={() => setShowHistory(false)} />}

        <Box style={{ margin: "0px 0px 15px 0px", right: "30px", display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" href="/intl/frro/create">Create</Button>
        </Box>

        <GridIndex
            rows={rows}
            columns={columns}
            getRowId={(row) => row.frroId}
        />
    </Box>)
}

export default FRRO

const History = ({ row, handleClose }) => {
    const [loading, setLoading] = useState(true)
    const [eventsList, setEventList] = useState([])

    useEffect(() => {
        getHistory()
    }, [])

    const getHistory = () => {
        axios.get(`/api/frro/getFrroHistory?studentId=${row.studentId}`)
            .then(async res => {
                if(res.data.data.length > 0) setEventList(await getHistoryTimeLine(res.data.data))
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const getHistoryTimeLine = (arr) => {
        return new Promise(resolve => {
            const history = arr.map((obj, i) => {
                if(i === 0) return {date: moment(obj.created_date).format("DD-MM-YYYY, HH:MM:ss"), event: `Record Created.`, user: obj.created_by}
                
                return getModifiedEventText(obj)
            })

            resolve(history.filter(value => Object.keys(value).length !== 0))
        })
    }

    const getModifiedEventText = (obj) => {
        const modifiedFields = []
        if(obj.isChangenameAsPerPassport) modifiedFields.push(" Name as per passport")
        if(obj.isChangepassportNo) modifiedFields.push(" Passport Number")
        if(obj.isChangevisaNo) modifiedFields.push(" Visa Number")
        if(obj.isChangefsis) modifiedFields.push(" FSIS Number")
        if(obj.isChangebirthPlace) modifiedFields.push(" Birth Place")
        if(obj.isChangepassportIssuePlace) modifiedFields.push(" Passport issue place")
        if(obj.isChangevisaType) modifiedFields.push(" Visa type")
        if(obj.isChangeimmigrationDate) modifiedFields.push(" Immigration date")
        if(obj.isChangeportOfArrival) modifiedFields.push(" Port of arrival")
        if(obj.isChangepassportIssueDate) modifiedFields.push(" Passport issue date")
        if(obj.isChangetypeOfEntry) modifiedFields.push(" Type of entry")
        if(obj.isChangeissueBy) modifiedFields.push(" Issue by")
        if(obj.isChangeportOfDeparture) modifiedFields.push(" Port of departure")
        if(obj.isChangepassportExpiryDate) modifiedFields.push(" Passport expiry date")
        if(obj.isChangeplaceOfVisaIssue) modifiedFields.push(" Place of visa issue")
        if(obj.isChangerpNo) modifiedFields.push(" RP Number")
        if(obj.isChangeisReportedToIndia) modifiedFields.push(" Is reported to INDIA")
        if(obj.isChangereportedOn) modifiedFields.push(" Reported on")
        if(obj.isChangevisaIssueDate) modifiedFields.push(" Visa issue date")
        if(obj.isChangerpIssueDate) modifiedFields.push(" RP issue date")
        if(obj.isChangeremarks) modifiedFields.push(" Remarks")
        if(obj.isChangevisaExpiryDate) modifiedFields.push(" Visa expiry date")
        if(obj.isChangerpExpiryDate) modifiedFields.push(" RP expiry date")
        if(obj.isChangealuEquivalenceDocument) modifiedFields.push(" ALU document")
        if(obj.isChangepassportCopyDocument) modifiedFields.push(" Passport copy")
        if(obj.isChangevisaCopyDocument) modifiedFields.push(" Visa copy")
        if(obj.isChangeresidentialPermitCopyDocument) modifiedFields.push(" Residential permit copy")
        if(obj.isChangeAffiliation) modifiedFields.push(" Affiliation")
        if(obj.isChangeRecogination) modifiedFields.push(" Recogination")
        if(obj.isChangevisaIssued) modifiedFields.push(" Visa issued")

        if(modifiedFields.length > 0)
            return {
                date: moment(obj.created_date).format("DD-MM-YYYY, HH:MM:ss"), 
                event: `${modifiedFields.toString()}.`,
                user: obj.created_by
            }
        
        return {}
    }

    const renderContent = () => {
        if (loading) return <h2 style={{ marginTop: "45px", textAlign: "center" }}>Loading...</h2>

        if (eventsList.length <= 0) return <h2 style={{ marginTop: "45px", textAlign: "center" }}>No History Found!!!</h2>

        return (
            <Timeline
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                    },
                }}
            >
                {eventsList.map((obj, i) => {
                    return <TimelineItem key={i}>
                        <TimelineOppositeContent color="textSecondary">
                            {obj.date}
                            <br></br>
                            {`by ${obj.user}`}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>{obj.event}</TimelineContent>
                    </TimelineItem>
                })}
            </Timeline>
        );
    }

    return (<ModalSection>
        <ModalContainer>
            <CloseIcon style={{ fontSize: "30px", cursor: "pointer", position: "absolute", right: "30px" }} onClick={handleClose} />
            {renderContent()}
        </ModalContainer>
    </ModalSection>)
}

const Attachments = ({ row, handleClose }) => {
    const [loading, setLoading] = useState(true)
    const [menuItems, setMenuItems] = useState([])
    const [selectedMenuItem, setSelectedMenuItem] = useState("")
    const [attachmentPath, setAttachmentPath] = useState("")

    useEffect(() => {
        const downloadfiles = async () => {
            const menuItems_ = []
            const { residentialPermitCopyDocument, aluEquivalenceDocument, passportCopyDocument, visaCopyDocument } = row
            if (residentialPermitCopyDocument) {
                menuItems_.push({ label: "Residential Permit", value: await getDocPath(residentialPermitCopyDocument) })
            }
            if (aluEquivalenceDocument) {
                menuItems_.push({ label: "ALU Equivalence", value: await getDocPath(aluEquivalenceDocument) })
            }
            if (passportCopyDocument) {
                menuItems_.push({ label: "Passport", value: await getDocPath(passportCopyDocument) })
            }
            if (visaCopyDocument) {
                menuItems_.push({ label: "Visa", value: await getDocPath(visaCopyDocument) })
            }

            setMenuItems(menuItems_)
            setLoading(false)
        }

        downloadfiles()
    }, [])

    useEffect(() => {
        if (menuItems.length > 0) {
            setAttachmentPath(menuItems[0].value)
            setSelectedMenuItem(menuItems[0].value)
        }
    }, [menuItems])

    const getDocPath = async (filePath) => {
        return new Promise(resolve => {
            axios.get(`/api/frro/frroFileDownload?pathName=${encodeURIComponent(filePath)}`, { responseType: "blob" })
                .then(res => {
                    resolve(URL.createObjectURL(res.data))
                    // resolve("https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf")
                })
                .catch(err => {
                    console.log(err)
                    resolve("")
                })
        })
    }

    const handleChange = e => {
        setAttachmentPath(e.target.value)
        setSelectedMenuItem(e.target.value)
    }

    return (<ModalSection>
        <ModalContainer>
            <Box style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Documents</InputLabel>
                    <Select
                        size="medium"
                        value={selectedMenuItem}
                        label="Documents"
                        onChange={handleChange}
                    >
                        {menuItems.map((obj, i) => {
                            return <MenuItem key={i} value={obj.value}>{obj.label}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <CloseIcon style={{ fontSize: "30px", cursor: "pointer" }} onClick={handleClose} />
            </Box>

            {loading ? <h2 style={{ textAlign: "center" }}>Preparing PDF view...</h2> :
                <object
                    data={attachmentPath}
                    type="application/pdf"
                    style={{ height: "900px" }}
                >
                    <p>Unable to preview the document</p>
                </object>}
        </ModalContainer>
    </ModalSection>)
}
