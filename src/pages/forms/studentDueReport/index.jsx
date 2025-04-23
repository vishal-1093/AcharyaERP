import { useEffect, useState } from "react"
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "../../../services/Api";
import moment from "moment";

const FALLBACKCRUMB = [
    {
        text: `Fee Receivable as on ${moment(new Date()).format("DD-MM-YYYY")}`,
        action: () => { },
        isParent: false
    }
]

const StudentDueReport = () => {
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    const [breadCrumbs, setBreadCrumbs] = useState(FALLBACKCRUMB)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getInstituteData()
    }, [])

    const getInstituteData = () => {
        setLoading(true)
        axios.get("/api/student/schoolWiseDueReport")
            .then(res => {
                setBreadCrumbs(FALLBACKCRUMB)
                const data = res.data.data
                if(!data && data.schoolWiseDueReportLists.length <= 0){
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    return
                }
                const { schoolWiseDueReportLists, grantDueTotal, grantAddOnTotal, grantHostelFeeTotal, grantTotal } = data
                const columns = [
                    { field: "inst", headerName: "School Name", flex: 1, minWidth: 400, headerAlign: 'center', headerClassName: "header-bg",
                        renderCell: (params) => {
                            if (!params.row.isClickable)
                                return <Typography fontWeight="bold">{params.row.inst}</Typography>

                            return <Button onClick={() => getBranchData(params.row)} sx={{ padding: 0, fontWeight: "bold" }}>
                                {params.row.inst}
                            </Button>
                        }
                     },
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
                    if(total > 0)
                        return {
                            id: schoolId, inst: schoolName, collegeDue, addOn, isLastRow: false,
                            hostelFee: hostelFee ? hostelFee : 0, total, isClickable: total > 0 ? true : false
                        }
                    else return {}
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
                setRows(rows.filter(obj => Object.keys(obj).length > 0))
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const getBranchData = (selectedInst) => {
        setLoading(true)
        axios.get(`/api/student/branchWiseDueReport?schoolId=${selectedInst.id}`)
            .then(res => {
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
                const data = res.data.data
                if(!data && data.branchWisedueReports.length <= 0){
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    return
                }
                const maxSem = Math.max(...data.branchWisedueReports.map(o => o.numberOfSemester))
                
                const columns = [
                    { field: "program", headerName: "Course", flex: 1, minWidth: 110, headerClassName: "header-bg" },
                    { field: "programSpecialization", headerName: "Branch", flex: 1, minWidth: 110, headerClassName: "header-bg" }
                ]

                for (let index = 1; index <= maxSem; index++) {
                    columns.push({ field: `sem${index}`, headerName: `Sem ${index}`, flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" })
                }
        
                columns.push(
                    {
                        field: "hostelDue", headerName: "Hostel Due", minWidth: 140, type: "number", align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true,
                    },
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
                })

                const { branchWisedueReports, grandTotal, totalSem1, totalSem2, totalSem3, totalSem4, totalSem5,
                    totalSem6, totalSem7, totalSem8, totalSem9, totalSem10, totalSem11, totalSem12, totalHostelDue } = data

                const rows = branchWisedueReports.map((obj, i) => {
                    const { programId, programSpecializationId, program, programSpecialization, sem1,
                        sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10, sem11, sem12, hostelDue, total
                    } = obj
                    return {
                        id: i, programId, programSpecializationId, program, programSpecialization, sem1,
                        sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10, sem11, sem12, hostelDue, isLastRow: false,
                        isClickable: total > 0 ? true : false, total
                    }
                })

                rows.push({
                    id: branchWisedueReports.length + 1, programId: branchWisedueReports.length + 1,
                    programSpecializationId: branchWisedueReports.length + 1, program: "", programSpecialization: "",
                    sem1: totalSem1, sem2: totalSem2, sem3: totalSem3, sem4: totalSem4, sem5: totalSem5, sem6: totalSem6,
                    sem7: totalSem7, sem8: totalSem8, sem9: totalSem9, sem10: totalSem10, sem11: totalSem11,
                    sem12: totalSem12, hostelDue: totalHostelDue, total: grandTotal, isClickable: false, isLastRow: true
                })

                setColumns(columns)
                setRows(rows)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const getStudentData = (selectedInst, selectedBranch) => {
        setLoading(true)
        axios.get(`/api/student/studentWiseDueReport?schoolId=${selectedInst?.id}&programId=${selectedBranch?.programId}&programSpecializationId=${selectedBranch?.programSpecialization}&pageSize=100&pageNo=0`)
            .then(res => {
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
                const data = res.data.data
                if(!data && data.studentWiseDueReports.length <= 0){
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    return
                }
                const maxSem = data.studentWiseDueReports[0].numberOfSemester
                const columns = [
                    { field: "studentName", headerName: "Student Name", flex: 1, minWidth: 170, headerClassName: "header-bg" },
                    { field: "auid", headerName: "AUID", flex: 1, minWidth: 140, headerClassName: "header-bg" },
                    { field: "templateName", headerName: "Fee Template", flex: 1, minWidth: 120, headerClassName: "header-bg" }
                ]

                for (let index = 1; index <= maxSem; index++) {
                    columns.push({ field: `sem${index}`, headerName: `Sem ${index}`, flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" })
                }

                columns.push(
                    { field: "addOn", headerName: "Add On", flex: 1 ,minWidth: 140, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "hostelFee", headerName: "Hostel", flex: 1, minWidth: 140, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    {
                        field: "total", headerName: "Total", minWidth: 140, type: "number", align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true, pinned: true,
                        renderCell: (params) => {
                            return <Typography fontWeight="bold">{params.row.total}</Typography>
                        }
                    }
                )

                const { studentWiseDueReports, grantTotalDue, totalSem1, totalSem2, totalSem3, totalSem4, totalSem5,
                    totalSem6, totalSem7, totalSem8, totalSem9, totalSem10, totalSem11, totalSem12, totalAddOn, totalhostelDue } = data

                const rows = studentWiseDueReports.map((obj, i) => {
                    const { programId, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, 
                        sem10, sem11, sem12, totalDue, auid, studentName, templateName, addOn, hostelFee
                    } = obj
                    return {
                        id: i, programId, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, 
                        sem10, sem11, sem12, isLastRow: false, isClickable: false, total: totalDue, auid, studentName,
                        templateName, addOn: addOn ? addOn : 0, hostelFee: hostelFee ? hostelFee : 0
                    }
                })

                rows.push({
                    id: studentWiseDueReports.length + 1, sem1: totalSem1, sem2: totalSem2, sem3: totalSem3, 
                    sem4: totalSem4, sem5: totalSem5, sem6: totalSem6, sem7: totalSem7, sem8: totalSem8, 
                    sem9: totalSem9, sem10: totalSem10, sem11: totalSem11, sem12: totalSem12, 
                    total: grantTotalDue, isClickable: false, isLastRow: true, addOn: totalAddOn, hostelFee: totalhostelDue,
                    auid: "", studentName: "", templateName: ""
                })

                setColumns(columns)
                setRows(rows)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    return (<Box>
        <Grid container alignItems="center" justifyContent="space-between" pt={3} rowGap={2} className="main-grid">
            <Grid item xs={12} md={12} lg={1}></Grid>
            <Grid item xs={12} md={12} lg={10} sx={{
                '& .last-row': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                '& .last-column': { fontWeight: "bold" },
                '& .last-row:hover': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                '& .header-bg': { fontWeight: "bold", backgroundColor: "#376a7d", color: "#fff", fontSize: "15px" },
            }}
            className="children-grid"
            >
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
                    loading={loading}
                />
            </Grid>
            <Grid item xs={12} md={12} lg={1} className="empty-grid"></Grid>
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

                if (isParent) return (<Typography key={i} variant="h5" sx={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "#2F38AB",
                }} onClick={action}> {text}</Typography>)
                return (<Typography key={i} variant="h5" sx={{ fontWeight: "bold" }}> {text}</Typography>)
            })}
        </Breadcrumbs>
    </Box>)
}