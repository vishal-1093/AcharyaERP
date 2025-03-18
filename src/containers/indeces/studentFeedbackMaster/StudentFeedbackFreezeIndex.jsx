import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

function StudentFeedbackFreezeIndex() {
    const [rows, setRows] = useState([]);
    const [modalContent, setModalContent] = useState({
        title: "",
        message: "",
        buttons: [],
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getSchoolNameOptions()
        getAcademicYearData()
        getData();
    }, []);

    const getData = async () => {
        await axios
            .get(`/api/feedback/freezeStudentAttendenceList`)
            .then((res) => {
                setRows(res.data.data);
            })
            .catch((err) => console.error(err));
    };

    const getSchoolNameOptions = async () => {
        await axios
            .get(`/api/institute/school`)
            .then((res) => {
                setSchoolNameOptions(
                    res.data.data.map((obj) => ({
                        value: obj.school_id,
                        label: obj.school_name_short,
                    }))
                );
            })
            .catch((err) => console.error(err));
    }

    const getAcademicYearData = async () => {
        await axios
            .get(`/api/academic/academic_year`)
            .then((res) => {
                setAcademicYearOptions(
                    res.data.data.map((obj) => ({
                        value: obj.ac_year_id,
                        label: obj.ac_year,
                    }))
                );
            })
            .catch((error) => console.error(error));
    };

    const handleActive = async (params) => {
        const id = params.row.freezeId;
        const handleToggle = async () => {
            if (params.row.active === true) {
                await axios
                    .delete(`/api/feedback/deactivefreezeStudentAttendence?freezeId=${id}`)
                    .then((res) => {
                        if (res.status === 200) {
                            getData();
                        }
                    })
                    .catch((err) => console.error(err));
            }else if(params.row.active === false) {
                await axios
                    .put(`/api/feedback/activefreezeStudentAttendence?freezeId=${id}`)
                    .then((res) => {
                        if (res.status === 200) {
                            getData();
                        }
                    })
                    .catch((err) => console.error(err));
            }
        };
        params.row.active === true
            ? setModalContent({
                title: "",
                message: "Do you want to make it Inactive ?",
                buttons: [
                    { name: "Yes", color: "primary", func: handleToggle },
                    { name: "No", color: "primary", func: () => { } },
                ],
            })
            : setModalContent({
                title: "",
                message: "Do you want to make it Active ?",
                buttons: [
                    { name: "Yes", color: "primary", func: handleToggle },
                    { name: "No", color: "primary", func: () => { } },
                ],
            });
        setModalOpen(true);
    };

    const columns = [
        {
            field: "academicYear",
            headerName: "Academic Year",
            flex: 1,
            valueGetter: (value, row) => row.academicYear
        },
        {
            field: "institute",
            headerName: "School",
            flex: 1,
            valueGetter: (value, row) => {
                const schoolObj = SchoolNameOptions.filter(obj => obj.value === row.instituteId)
                if (schoolObj && schoolObj.length > 0) return schoolObj[0].label

                return ""
            }
        },
        { field: "percentage", headerName: "Percentage", flex: 1 },
        {
            field: "createdDate",
            headerName: "Created Date",
            flex: 1,
            // type: "date",
            valueGetter: (value, row) => moment(row.createdDate).format("DD-MM-YYYY"),
        },
        {
            field: "id",
            type: "actions",
            flex: 1,
            headerName: "Update",
            getActions: (params) => [
                <IconButton
                    onClick={() =>
                        navigate(`/StudentFeedbackMaster/freezePercentage/update/${params.row.freezeId}`)
                    }
                >
                    <EditIcon />
                </IconButton>,
            ],
        },
        {
            field: "active",
            headerName: "Active",
            flex: 1,
            type: "actions",
            getActions: (params) => [
                params.row.active === true ? (
                    <IconButton
                        style={{ color: "green" }}
                        onClick={() => handleActive(params)}
                    >
                        <Check />
                    </IconButton>
                ) : (
                    <IconButton
                        style={{ color: "red" }}
                        onClick={() => handleActive(params)}
                    >
                        <HighlightOff />
                    </IconButton>
                ),
            ],
        }
    ];

    return (
        <>
            <CustomModal
                open={modalOpen}
                setOpen={setModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                buttons={modalContent.buttons}
            />
            <Box sx={{ position: "relative", marginTop: 3 }}>
                <Button
                    onClick={() => navigate("/StudentFeedbackMaster/freezePercentage/New")}
                    variant="contained"
                    disableElevation
                    sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
                    startIcon={<AddIcon />}
                >
                    Create
                </Button>
                <GridIndex rows={rows} columns={columns} getRowId={row => row.freezeId} />
            </Box>
        </>
    );
}
export default StudentFeedbackFreezeIndex;
