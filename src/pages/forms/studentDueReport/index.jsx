import { useEffect, useState } from "react"
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "../../../services/Api";

const intData = [
    {
        "id": 1,
        "inst": "ACHARYA INSTITUTE OF TECHNOLOGY",
        "college_due": 11281707,
        "add_on": 3277000,
        "hostel": 3277000,
        "total": 17835707
    },
    {
        "id": 2,
        "inst": "ACHARYA INSTITUTE OF GRADUATE STUDIES",
        "college_due": 928372207,
        "add_on": 627070,
        "hostel": 2230240,
        "total": 1534835707
    },
    {
        "id": 3,
        "inst": "ACHARYA POLYTECHNIC",
        "college_due": 42381737,
        "add_on": 32774750,
        "hostel": 32770430,
        "total": 472337474
    }
]

const branchData = [
    {
        "id": "1",
        "course": "BE",
        "branch": "AE",
        "sem1": 1208270,
        "sem2": 0,
        "sem3": 408270,
        "total": 608270
    },
    {
        "id": "2",
        "course": "BE",
        "branch": "AIML",
        "sem1": 9208270,
        "sem2": 0,
        "sem3": 7608270,
        "total": 2308270
    },
    {
        "id": "3",
        "course": "MBA",
        "branch": "MBA",
        "sem1": 1208270,
        "sem2": 43250,
        "sem3": 2355,
        "total": 979679
    },
    {
        "id": "4",
        "course": "MCAV",
        "branch": "MCAV",
        "sem1": 43634676,
        "sem2": 2355,
        "sem3": 1208270,
        "total": 65447457
    }
]

const studentData = [
    {
        "id": 1,
        "studentname": "Vivek",
        "auid": "1MFSB7029",
        "sem1": 35235,
        "addon": 0,
        "hostel": 432423,
        "fee_template": "24BEAEEC_MR"
    },
    {
        "id": 2,
        "studentname": "Divya",
        "auid": "1MFSB7009",
        "sem1": 756767,
        "addon": 54534,
        "hostel": 3767567,
        "fee_template": "24BEAEBTCVECEEMEMT-INTD"
    }
]

const FALLBACKCRUMB = [
    {
        text: "Fee Receivable as on today",
        action: () => { },
        isParent: false
    }
]

const StudentDueReport = () => {
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    const [breadCrumbs, setBreadCrumbs] = useState(FALLBACKCRUMB)

    useEffect(() => {
        getInstituteData()
    }, [])

    const getInstituteData = () => {
        axios.get("/api/student/schoolWiseDueReport")
            .then(res => {
                const data = res.data.data
                const { schoolWiseDueReportLists, grantDueTotal, grantAddOnTotal, grantHostelFeeTotal, grantTotal } = data
                const columns = [
                    { field: "inst", headerName: "School Name", flex: 1, minWidth: 400, headerAlign: 'center', headerClassName: "header-bg" },
                    { field: "collegeDue", headerName: "College Due", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "addOn", headerName: "Add On", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "hostelFee", headerName: "Hostel", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    {
                        field: "total", headerName: "Total", flex: 1, align: 'right', headerAlign: 'right', headerClassName: "header-bg",
                        renderCell: (params) => {
                            if (!params.row.isClickable)
                                return <Typography fontWeight="bold">{params.row.total}</Typography>

                            return <Button onClick={() => getBranchData(params.row)} sx={{ padding: 0, fontWeight: "bold" }}>
                                {params.row.total}
                            </Button>
                        }
                    },
                ]

                const rows = schoolWiseDueReportLists.map(obj => {
                    const { schoolId, schoolName, collegeDue, addOn, hostelFee, total } = obj
                    return {
                        id: schoolId, inst: schoolName, collegeDue, addOn, isLastRow: false,
                        hostelFee: hostelFee ? hostelFee : 0, total, isClickable: total > 0 ? true : false
                    }
                })

                rows.push({
                    id: schoolWiseDueReportLists.length + 1, inst: "",
                    collegeDue: grantDueTotal ? grantDueTotal : 0,
                    addOn: grantAddOnTotal ? grantAddOnTotal : 0,
                    hostelFee: grantHostelFeeTotal ? grantHostelFeeTotal : 0,
                    total: grantTotal ? grantTotal : 0, isClickable: false,
                    isLastRow: true
                })

                setColumns(columns)
                setRows(rows)
                setBreadCrumbs(FALLBACKCRUMB)
            })
            .catch(err => console.log(err))
    }

    const getBranchData = (selectedInst) => {
        axios.get(`/api/student/branchWiseDueReport?schoolId=${selectedInst.id}`)
            .then(res => {
                const data = res.data.data
                const columns = [
                    { field: "program", headerName: "Course", flex: 1, minWidth: 110, headerClassName: "header-bg" },
                    { field: "programSpecialization", headerName: "Branch", flex: 1, minWidth: 110, headerClassName: "header-bg" },
                    { field: "sem1", headerName: "Sem 1", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem2", headerName: "Sem 2", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem3", headerName: "Sem 3", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem4", headerName: "Sem 4", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem5", headerName: "Sem 5", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem6", headerName: "Sem 6", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem7", headerName: "Sem 7", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem8", headerName: "Sem 8", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem9", headerName: "Sem 9", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem10", headerName: "Sem 10", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem11", headerName: "Sem 11", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "sem12", headerName: "Sem 12", flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    {
                        field: "total", headerName: "Total", minWidth: 140, type: "number", align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true, pinned: true,
                        renderCell: (params) => {
                            if (!params.row.isClickable)
                                return <Typography fontWeight="bold">{params.row.total}</Typography>

                            return (<Button onClick={() => getStudentData(selectedInst, params.row)}>
                                {params.row.total}
                            </Button>)
                        }
                    },
                ]

                const { branchWisedueReports, grandTotal, totalSem1, totalSem2, totalSem3, totalSem4, totalSem5,
                    totalSem6, totalSem7, totalSem8, totalSem9, totalSem10, totalSem11, totalSem12 } = data

                const rows = branchWisedueReports.map((obj, i) => {
                    const { programId, programSpecializationId, program, programSpecialization, sem1,
                        sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10, sem11, sem12, total
                    } = obj
                    return {
                        id: i, programId, programSpecializationId, program, programSpecialization, sem1,
                        sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10, sem11, sem12, isLastRow: false,
                        isClickable: total > 0 ? true : false, total
                    }
                })

                rows.push({
                    id: branchWisedueReports.length + 1, programId: branchWisedueReports.length + 1,
                    programSpecializationId: branchWisedueReports.length + 1, program: "", programSpecialization: "",
                    sem1: totalSem1, sem2: totalSem2, sem3: totalSem3, sem4: totalSem4, sem5: totalSem5, sem6: totalSem6,
                    sem7: totalSem7, sem8: totalSem8, sem9: totalSem9, sem10: totalSem10, sem11: totalSem11,
                    sem12: totalSem12, total: grandTotal, isClickable: false, isLastRow: true
                })

                setColumns(columns)
                setRows(rows)
                setBreadCrumbs([
                    {
                        text: selectedInst.inst,
                        action: () => getInstituteData(selectedInst),
                        isParent: true
                    },
                    {
                        text: "Programme",
                        action: () => { },
                        isParent: false
                    }
                ])
            })
            .catch(err => console.log(err))
    }

    const getStudentData = (selectedInst, selectedBranch) => {
        console.log(selectedInst, selectedBranch);
        
        axios.get(`/api/student/studentWiseDueReport?schoolId=${selectedInst.id}&programId=${selectedBranch.programId}`)
            .then(res => {
                const data = res.data.data
                const columns = [
                    { field: "studentname", headerName: "Student Name", flex: 1, minWidth: 100 },
                    { field: "auid", headerName: "AUID", flex: 1 },
                    { field: "sem1", headerName: "Sem 1", flex: 1, type: "number", align: 'right', headerAlign: 'right' },
                    { field: "fee_template", headerName: "Fee Template", flex: 1 },
                    { field: "addon", headerName: "Add On", flex: 1, type: "number", align: 'right', headerAlign: 'right' },
                    { field: "hostel", headerName: "Hostel", flex: 1, type: "number", align: 'right', headerAlign: 'right' },
                ]

                setColumns(columns)
                setRows(studentData)
                setBreadCrumbs([
                    {
                        text: selectedInst.inst,
                        action: () => getInstituteData(),
                        isParent: true
                    },
                    {
                        text: selectedBranch.program,
                        action: () => getBranchData(selectedInst),
                        isParent: true
                    },
                    {
                        text: "Student",
                        action: () => { },
                        isParent: false
                    }
                ])
            })
    }

    return (<Box>
        <Grid container alignItems="center" justifyContent="space-between" pt={3} rowGap={2}>
            <Grid item xs={12} md={12} lg={1}></Grid>
            <Grid item xs={12} md={12} lg={10} sx={{
                '& .last-row': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                '& .last-column': { fontWeight: "bold" },
                '& .last-row:hover': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                '& .header-bg': { fontWeight: "bold", backgroundColor: "#376a7d", color: "#fff", fontSize: "15px" },
            }}>
                <CustomBreadCrumbs arr={breadCrumbs} />
                <GridIndex
                    initialState={{
                        pinnedColumns: { left: ['program'] },
                    }}
                    rows={rows}
                    columns={columns}
                    getRowClassName={(params) => {
                        return params.row.isLastRow ? "last-row" : ""
                    }}
                />
            </Grid>
            <Grid item xs={12} md={12} lg={1}></Grid>
        </Grid>
    </Box>)
}

export default StudentDueReport


const CustomBreadCrumbs = ({ arr }) => {
    if (arr.length <= 0) return null

    return (<Box sx={{ marginBottom: "20px" }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            {arr.map((obj, i) => {
                const { text, action, isParent } = obj

                if (isParent) return (<Typography key={i} variant="h6" sx={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "#132353"
                }} onClick={action}> {text}</Typography>)
                return (<Typography key={i} variant="h6" sx={{ fontWeight: "bold" }}> {text}</Typography>)
            })}
        </Breadcrumbs>
    </Box>)
}