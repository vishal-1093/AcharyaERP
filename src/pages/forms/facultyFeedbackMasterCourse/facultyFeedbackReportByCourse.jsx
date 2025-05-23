// import React, { useEffect, useState } from 'react';
// import axios from "../../../services/Api"
// import { Box, Button, CircularProgress, Grid, Tab, Tabs } from "@mui/material"
// import useAlert from "../../../hooks/useAlert"
// import GridIndex from "../../../components/GridIndex"
// import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
// import { useLocation } from "react-router-dom";

// const FacultyFeedbackReportByCourse = () => {
//     const [tab, setTab] = useState('course')
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState([])
//     const [column, setColumn] = useState([])
//     const [sectionColumns, setSectionColumns] = useState([])
//     const [columnGroupingModel, setColumnGroupingModel] = useState([])
//     const setCrumbs = useBreadcrumbs();
//     const { setAlertMessage, setAlertOpen } = useAlert();
//     const location = useLocation();
//     const queryParams = location.state;

//     const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
//     const roleShortName = JSON.parse(
//         sessionStorage.getItem("AcharyaErpUser")
//     )?.roleShortName;

//     useEffect(() => {
//         setCrumbs([
//             { name: tab === "course" ? "Faculty Feedback Report-Course" : "Faculty Feedback Report-Course And Section" }
//         ])

//         getFeedbackReport()
//         getAllFacultySubject()
//     }, [tab])

// const getFeedbackReport = () => {
//     setLoading(true)
//     const { program_specialization_id, year_sem, ...params } = queryParams
//     //   const baseUrl = "api/student/getFeedbackRatingReportSectionWiseReport"
//     const baseUrl = tab === 'course' ? "/api/student/getFeedbackRatingReportCourseWise" : "api/student/getFeedbackRatingReportSectionWiseReport"
//     axios.get(baseUrl, { params })
//         .then(res => {
//             setLoading(false)
//             const { data } = res.data
//             if (tab === 'course') {
//                 const grouped = {};
//                 data.forEach((item, index) => {
//                     const { emp_id, employee_name, overall_section_average } = item;
//                     if (!grouped[emp_id]) {
//                         grouped[emp_id] = {
//                             emp_id,
//                             employee_name
//                         };
//                         grouped[emp_id].count = 0; // to track course index
//                     }

//                     const colKey = `course_name-${grouped[emp_id].count}`;
//                     grouped[emp_id][colKey] = overall_section_average;
//                     grouped[emp_id].count += 1;
//                 });
//                 const finalRowData = Object.values(grouped).map(({ count, ...rest }) => rest);
//                 setData(finalRowData);
//                 //  return Object.values(grouped);
//             } else {
//                 // const grouped = {};
//                 // const allSection = []

//                 // data.forEach((item) => {
//                 //     const key = `${item.empId}-${item.course_name}`;
//                 //     allSection.push(item?.section_name)
//                 //     if (!grouped[key]) {
//                 //         grouped[key] = {
//                 //             empId: item.empId,
//                 //             employee_name: item.employee_name,
//                 //             course_name: item.course_name
//                 //         };
//                 //     }

//                 //     // Add dynamic key: "Section-A", "Section-B", etc.
//                 //     grouped[key][`section-${item.section_name}`] = item.avg_ratings_percentage;
//                 // });

//                 // const finalRowData = Object.values(grouped);
//                 // setData(finalRowData);

//                 // const secCol = allSection?.length > 0 && allSection?.map((sec) => {
//                 //     return { field: `section-${sec}`, headerName: `Section ${sec}`, flex: 1 }
//                 // })
//                 // setSectionColumns([
//                 //     {
//                 //         field: "employee_name",
//                 //         headerName: "Employee Name",
//                 //         flex: 1,
//                 //     },
//                 //     {
//                 //         field: "course_name",
//                 //         headerName: "Course",
//                 //         flex: 1,
//                 //     },
//                 //     ...secCol
//                 // ])

//                 // Grouping logic
//                 const grouped = {};
//                 const courseToSections = {}; // for grouping model
//                 const allSectionSet = new Set(); // to track unique sections

//                 data.forEach((item) => {
//                     const key = `${item.empId}-${item.course_name}`;
//                     const sectionField = `section-${item.section_name}`;
//                     allSectionSet.add(sectionField);

//                     // Group data for rows
//                     if (!grouped[key]) {
//                         grouped[key] = {
//                             empId: item.empId,
//                             employee_name: item.employee_name,
//                             course_name: item.course_name,
//                         };
//                     }
//                     grouped[key][sectionField] = item.avg_ratings_percentage;

//                     // Group sections under course for column grouping
//                     if (!courseToSections[item.course_name]) {
//                         courseToSections[item.course_name] = new Set();
//                     }
//                     courseToSections[item.course_name].add(sectionField);
//                 });

//                 // Final rowData
//                 const finalRowData = Object.values(grouped);
//                 setData(finalRowData);

//                 // Final columns
//                 const staticColumns = [
//                     { field: "employee_name", headerName: "Employee Name", flex: 1,  align: "left", headerAlign: 'left' },
//                 ];

//                 const dynamicSectionColumns = [...allSectionSet].map((sectionField) => ({
//                     field: sectionField,
//                     headerName: sectionField.replace("section-", "Section "),
//                     flex: 1,
//                     align: "center"
//                 }));

//                 setSectionColumns([...staticColumns, ...dynamicSectionColumns]);

//                 // Column Grouping Model
//                 const columnGroupingModel = Object.entries(courseToSections).map(([courseName, sectionSet]) => ({
//                     groupId: courseName,
//                     children: [...sectionSet].map((field) => ({ field })),
//                 }));

//                 setColumnGroupingModel(columnGroupingModel);

//             }
//         })
//         .catch(err => {
//             setLoading(false);
//             setAlertMessage({
//                 severity: "error",
//                 message: "Failed to create, Please try after sometime",
//             });
//             setAlertOpen(true);
//         })
// }

// const getAllFacultySubject = () => {
//     setLoading(true)
//     const { course_id, year, sem, employee_id, ...query } = queryParams
//     const yearAndSem = query?.yearSem && query?.yearSem?.split("/")
//     const selectedYear = yearAndSem?.length > 0 ? yearAndSem[0] : ""
//     const selectedSem = yearAndSem?.length > 0 ? yearAndSem[1] : ""
//     const year_sem = selectedSem ? selectedSem : selectedYear ? selectedYear : 0
//     const params = { year_sem, ...query }
//      const baseUrl = "api/academic/getCourseAssignmentBasedOnProgramSpecialization"
//    // const baseUrl = "api/academic/getCourseAssignmentBasedOnProgramSpecialization?ac_year_id=6&year_sem=4&program_specialization_id=51"
//     axios.get(baseUrl, { params })
//         .then(res => {
//             setLoading(false)
//             const { data } = res.data
//             const columnData = data?.length > 0 && data?.map((col, index) => {
//                 return { field: `course_name-${index}`, headerName: col?.course_name, flex: 1,  align: 'center', headerAlign: 'center' }
//             })
//             if (columnData?.length > 0) {
//                 setColumn([
//                     {
//                         field: "employee_name",
//                         headerName: "Employee Name",
//                         flex: 1
//                     },
//                     ...columnData
//                 ])
//             }
//         })
//         .catch(err => {
//             setLoading(false);
//             setAlertMessage({
//                 severity: "error",
//                 message: "Failed to create, Please try after sometime",
//             });
//             setAlertOpen(true);
//         })
// }

//     // const columnForSection = [
//     //     {
//     //         field: "employee_name",
//     //         headerName: "Employee Name",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "course_name",
//     //         headerName: "Course Name",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "section_name",
//     //         headerName: "Section Name",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "avg_ratings_percentage",
//     //         headerName: "Average Percentage",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "concateFeedbackWindow",
//     //         headerName: "feedback Window",
//     //         flex: 1,
//     //         renderCell: (params) => {
//     //             const feedbackWindow = params?.row?.concateFeedbackWindow?.split("/")?.join("-")
//     //             return (
//     //                 <Typography>{feedbackWindow}</Typography>
//     //             )
//     //         }
//     //     },
//     //     {
//     //         field: "window_count",
//     //         headerName: "Window Count",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "feedBackgivenStudent",
//     //         headerName: "Feedback Count",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "totalStudents",
//     //         headerName: "totalStudents",
//     //         flex: 1,
//     //     },
//     // ];

//     const handleChangeTab = (event, newValue) => {
//         setTab(newValue);
//     };

//     // const columnForCourse = [
//     //     {
//     //         field: "employee_name",
//     //         headerName: "Employee Name",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "course_name",
//     //         headerName: "Course Name",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "overall_section_average",
//     //         headerName: "Average Percentage",
//     //         flex: 1,
//     //     },
//     //     {
//     //         field: "concateFeedbackWindow",
//     //         headerName: "feedback Window",
//     //         flex: 1,
//     //         renderCell: (params) => {
//     //             const feedbackWindow = params?.row?.concateFeedbackWindow?.split("/")?.join("-")
//     //             return (
//     //                 <Typography>{feedbackWindow}</Typography>
//     //             )
//     //         }
//     //     },
//     // ];


//     return (
//         <Box>

//             <Tabs value={tab} onChange={handleChangeTab}>
//                 <Tab value="course" label="Course" />
//                 <Tab value="course-and-section" label="Course And Section" />
//             </Tabs>

//             <Grid
//                 container
//                 justifyContent="center"
//                 alignItems="center"
//                 rowSpacing={4}
//                 columnSpacing={2}
//             >
//                 <Grid item xs={12} md={12}>
//                     <GridIndex
//                         rows={data}
//                         columns={tab === 'course' ? column : sectionColumns}
//                         //     getRowId={(row) =>  tab === 'course'
//                         //     ? `${row.course_id}-${row.employee_name}-${row.concateFeedbackWindow}`
//                         //     : `${row.class_feedback_questions_id}-${row.employee_name}-${row.concateFeedbackWindow}`
//                         // }
//                         getRowId={(row) => tab === 'course' ? row.emp_id : `${row.empId}-${row.course_name}`}
//                         loading={loading}
//                         rowSelectionModel={[]}
//                         columnGroupingModel={columnGroupingModel}
//                         disableRowSelectionOnClick
//                     />
//                 </Grid>
//             </Grid>
//         </Box>
//     )
// }

// export default FacultyFeedbackReportByCourse;



import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import axios from "../../../services/Api";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    styled,
    tableCellClasses,
    tooltipClasses,
} from "@mui/material";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import SearchIcon from "@mui/icons-material/Search";
import ExportButton from "../../../components/ExportButton";
import OverlayLoader from "../../../components/OverlayLoader";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { useLocation } from "react-router-dom";

const initialValues = {
    month: convertUTCtoTimeZone(new Date()),
    schoolId: null,
    deptId: null,
    searchItem: "",
    isConsultant: "REG",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "rgba(74, 87, 169, 0.1)",
        color: "#46464E",
        textAlign: "center",
        padding: 2,
        border: "1px solid rgba(224, 224, 224, 1)",
    },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        textAlign: "center",
        padding: 3,
        border: "1px solid rgba(224, 224, 224, 1)",
        // "&:nth-of-type(3)": {
        //     textAlign: "left",
        // },
        // "&:nth-of-type(4)": {
        //     width: "7%",
        // },
        // "&:nth-of-type(5)": {
        //     textAlign: "left",
        // },
        // "&:nth-of-type(6)": {
        //     textAlign: "left",
        // },
    },
}));

const SectionStyledTableCellBody = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        textAlign: "center",
        padding: 3,
        border: "1px solid rgba(224, 224, 224, 1)",
    },
}));


const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "white",
        color: "rgba(0, 0, 0, 0.6)",
        maxWidth: 270,
        fontSize: 12,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
        padding: "10px",
        textAlign: "center",
    },
}));

function FacultyFeedbackReportByCourse() {
  //  const [values, setValues] = useState(initialValues);
    const [rows, setRows] = useState([]);
    // const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(false)
    const [column, setColumn] = useState()
    const [sectionKeys, setSectionKeys] = useState([])
    const [allCourses, setAllCourses] = useState([])
    const [courseSectionMap, setCourseSectionMap] = useState([])
    const [acYear, setAcYear] = useState()
    const [tab, setTab] = useState('course')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const { setAlertMessage, setAlertOpen } = useAlert();
    const setCrumbs = useBreadcrumbs();
    const location = useLocation();
    const queryParams = location.state;

    useEffect(() => {
        setCrumbs([{ name: "Faculty Feedback Master - course", link:"/FacultyFeedbackMaster-course" }, { name: "Faculty Feedback Report- Course" }]);
        getAllFacultySubject()
    }, []);

    useEffect(() => {
        setRows([])
        getFeedbackReport()
    }, [tab])

    const getAllFacultySubject = () => {
        setLoading(true)
        const { year, sem, employee_id, acYear, ...query } = queryParams
        const yearAndSem = query?.yearSem && query?.yearSem?.split("/")
        const selectedYear = yearAndSem?.length > 0 ? yearAndSem[0] : ""
        const selectedSem = yearAndSem?.length > 0 ? yearAndSem[1] : ""
        const year_sem = selectedSem ? selectedSem : selectedYear ? selectedYear : 0
        const params = { year_sem, ...query }
        const baseUrl = "api/academic/getCourseAssignmentBasedOnProgramSpecialization"
        // const baseUrl = "api/academic/getCourseAssignmentBasedOnProgramSpecialization?ac_year_id=6&year_sem=4&program_specialization_id=51"
        axios.get(baseUrl, { params })
            .then(res => {
                setLoading(false)
                const { data } = res.data
                const columnData = data?.length > 0 && data?.map((col, index) => {
                    return {
                        field: col?.course_code,
                        headerName: col?.course_code,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                        renderCell: () => (
                            <Tooltip title={col?.course_name || ''} arrow>
                                <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'default' }}
                                >
                                    {col?.course_code}
                                </Typography>
                            </Tooltip>
                        )
                    }
                })
                if (columnData?.length > 0) {
                    setColumn([...columnData])
                }
            })
            .catch(err => {
                setLoading(false);
                setAlertMessage({
                    severity: "error",
                    message: "Failed to create, Please try after sometime",
                });
                setAlertOpen(true);
            })
    }

    const getFeedbackReport = () => {
        setLoading(true)
        const { dept_id, year_sem, acYear, ...params } = queryParams
        //   const baseUrl = "api/student/getFeedbackRatingReportSectionWiseReport"
        const baseUrl = tab === 'course' ? "/api/student/getFeedbackRatingReportCourseWise" : "api/student/getFeedbackRatingReportSectionWiseReport"
        axios.get(baseUrl, { params })
            .then(res => {
                setLoading(false)
                const { data } = res.data
                if (tab === 'course') {
                    const grouped = {};
                    data.forEach((item, index) => {
                        const { emp_id, employee_name, course_code, overall_section_average } = item;
                        if (!grouped[emp_id]) {
                            grouped[emp_id] = {
                                emp_id,
                                employee_name
                            };
                            grouped[emp_id].count = 0;
                        }

                        // const colKey = `course_name-${grouped[emp_id].count}`;
                        const colKey = course_code;
                        grouped[emp_id][colKey] = overall_section_average;
                        // grouped[emp_id].count += 1;
                    });
                    const finalRowData = Object.values(grouped).map(({ count, ...rest }) => rest);
                    setRows(finalRowData);
                } else {
                    const grouped = {};
                    const courseSection = {};
                    data?.forEach((item) => {
                        const empKey = item.empId;
                        const course = `${item.course_name}-${item.course_code}`;
                        const section = item.section_name;
                        const value = item.avg_ratings_percentage;

                        if (!grouped[empKey]) {
                            grouped[empKey] = {
                                empId: item.empId,
                                employee_name: item.employee_name,
                                total_student: item.totalStudents,
                                feedback_count: item.feedBackgivenStudent,
                                feedback: {}
                            };
                        }

                        const sectionKey = `${course}__${section}`;
                        grouped[empKey].feedback[sectionKey] = value;

                        if (!courseSection[course]) {
                            courseSection[course] = new Set();
                        }
                        courseSection[course].add(section);
                    });

                    const allCourse = Object.keys(courseSection);

                    const sectionKey = allCourse.flatMap(course =>
                        Array.from(courseSection[course]).map(section => ({
                            field: `${course}__${section}`,
                            course,
                            section
                        }))
                    );
                    setRows(Object.values(grouped));
                    setSectionKeys(sectionKey);
                    setAllCourses(allCourse);
                    setCourseSectionMap(courseSection);
                }
            }).catch(err => {
                setLoading(false);
                setAlertMessage({
                    severity: "error",
                    message: "Failed to create, Please try after sometime",
                });
                setAlertOpen(true);
            })
    }

    function daysTableHead() {
        return column?.map((obj, i) => {
            return <StyledTableCell key={i}>{obj.headerName}</StyledTableCell>;
        });
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
        if (newValue === 'course') {
            setSectionKeys([]);
            setAllCourses([]);
            setCourseSectionMap({});
        }
        setPage(0);
    };

    const tableData = useMemo(
        () => (
            <TableContainer component={Paper} elevation={3}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                colSpan={2 + column?.length}
                                sx={{
                                    backgroundColor: "primary.main",
                                    color: "headerWhite.main",
                                    textAlign: "center",
                                }}
                            >
                                {`Faculty Feedback Report for the Academic Year - ${queryParams?.acYear}`}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <StyledTableCell>Sl No</StyledTableCell>
                            <StyledTableCell sx={{alignItems:"center", textAlign:"left !important"}}>Employee Name</StyledTableCell>
                            {daysTableHead()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((obj, index) => (
                                    <TableRow key={index}>
                                        <StyledTableCellBody>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                {page * rowsPerPage + index + 1}
                                            </Typography>
                                        </StyledTableCellBody>

                                        <StyledTableCellBody sx={{textAlign: "left !important"}}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                <HtmlTooltip
                                                    title={
                                                        <Box>
                                                            <Typography>
                                                                {obj.employee_name}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                >
                                                    <span>
                                                        {obj.employee_name}
                                                    </span>
                                                </HtmlTooltip>
                                            </Typography>
                                        </StyledTableCellBody>
                                        {column?.map((item, j) => {
                                            const sectionPercentage = obj[item?.field] ? obj[item?.field] : ""
                                            return <StyledTableCellBody key={j}>
                                                {sectionPercentage}
                                            </StyledTableCellBody>
                                        })}
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={2 + column?.length}
                                    sx={{ textAlign: "center" }}
                                >
                                    <Typography variant="subtitle2">No Records</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 200]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
        ),
        [rows, page, rowsPerPage]
    );

    // const sectiontableData = useMemo(
    //     () => (
    //         <TableContainer component={Paper} elevation={3}>
    //             <Table size="small">
    //                 <TableHead>
    //                     <TableRow>
    //                         <TableCell>Sl No</TableCell>
    //                         <TableCell>Employee Name</TableCell>
    //                         <TableCell>Course Name</TableCell>
    //                         {sectionColumns.map((sec) => (
    //                             <TableCell key={sec}>{`Section ${sec}`}</TableCell>
    //                         ))}
    //                     </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                     {/* {groupedData.map((item, index) => (
    //                         <TableRow key={index}>
    //                             <TableCell>{index + 1}</TableCell>
    //                             <TableCell>{item.employee_name}</TableCell>
    //                             <TableCell>{item.course_name}</TableCell>
    //                             {allSections.map((sec) => (
    //                                 <TableCell key={sec}>
    //                                     {item.sections[sec] !== undefined ? item.sections[sec] : "-"}
    //                                 </TableCell>
    //                             ))}
    //                         </TableRow>
    //                     ))} */}
    //                     <TableRow>
    //                         <TableCell>1234</TableCell>
    //                     </TableRow>
    //                 </TableBody>

    //             </Table>
    //             <TablePagination
    //                 rowsPerPageOptions={[50, 100, 200]}
    //                 component="div"
    //                 count={rows.length}
    //                 rowsPerPage={rowsPerPage}
    //                 page={page}
    //                 onPageChange={handlePageChange}
    //                 onRowsPerPageChange={handleRowsPerPageChange}
    //             />
    //         </TableContainer>
    //     ),
    //     [rows, page, rowsPerPage, days]
    // );

    const sectionTableData = useMemo(() => (
        <TableContainer component={Paper} elevation={3}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell
                            colSpan={4 + sectionKeys?.length}
                            sx={{
                                backgroundColor: "primary.main",
                                color: "headerWhite.main",
                                textAlign: "center",
                            }}
                        >
                         {`Faculty Feedback Report for the Academic Year - ${queryParams?.acYear}`}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell rowSpan={2}>Sl No</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Employee Name</StyledTableCell>
                        {allCourses.map(course => (
                            <StyledTableCell key={course} colSpan={courseSectionMap[course]?.size || 1}>
                                {course}
                            </StyledTableCell>
                        ))}
                        <StyledTableCell rowSpan={2}>Total Student</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Feedback Count</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        {sectionKeys.map(({ section, field }) => (
                            <StyledTableCell key={field}>Section {section}</StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length > 0 ? (
                        rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow key={row.empId}>
                                    <SectionStyledTableCellBody>{page * rowsPerPage + index + 1}</SectionStyledTableCellBody>
                                    <SectionStyledTableCellBody>{row.employee_name}</SectionStyledTableCellBody>
                                    {sectionKeys.map(({ field }) => (
                                        <SectionStyledTableCellBody key={field} align="center">
                                            {row.feedback[field] !== undefined ? row?.feedback[field] : "-"}
                                        </SectionStyledTableCellBody>
                                    ))}
                                    <SectionStyledTableCellBody>{row.total_student}</SectionStyledTableCellBody>
                                    <SectionStyledTableCellBody>{row.feedback_count}</SectionStyledTableCellBody>
                                </TableRow>
                            ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={sectionKeys.length + 2} align="center">
                                <Typography variant="subtitle2">No Records Found</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[50, 100, 200]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </TableContainer>
    ), [rows, sectionKeys, allCourses, page, rowsPerPage]);



    return (
        <>
            <Box>
                <Tabs value={tab} onChange={handleChangeTab}>
                    <Tab value="course" label="Course" />
                    <Tab value="course-and-section" label="Course And Section" />
                </Tabs>

                <Grid container mt={2}>
                    {loading ? (
                        <Grid item xs={12} md={10} align="center">
                            <OverlayLoader />
                        </Grid>
                    ) : (
                        <>{tab == 'course' ? tableData : sectionTableData}</>
                    )}
                </Grid>
            </Box>
        </>
    );
}

export default FacultyFeedbackReportByCourse;
