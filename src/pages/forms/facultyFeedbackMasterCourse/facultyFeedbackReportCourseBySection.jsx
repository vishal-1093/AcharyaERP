import React, { useEffect, useState } from 'react';
import axios from "../../../services/Api"
import { Box, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses, Paper, Checkbox, FormGroup, FormControlLabel, Typography, Tab, Tabs } from "@mui/material"
import FormWrapper from "../../../components/FormWrapper"
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete"
import useAlert from "../../../hooks/useAlert"
import GridIndex from "../../../components/GridIndex"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"

const FacultyFeedbackReportByCourseAndSection = (queryParams) =>{
    const [tab, setTab] = useState('course')
   const [data, setData] = useState()
   const [loading, setLoading] = useState(false)
   const { setAlertMessage, setAlertOpen } = useAlert();

    useEffect(()=>{
     getFeedbackReport(queryParams)
    },[])

       const getFeedbackReport = (params) =>{
         // const baseUrl = "api/student/getFeedbackRatingReportSectionWiseReport"
          const baseUrl = tab === 'course' ? "/api/student/getFeedbackRatingReportCourseWise" : "api/student/getFeedbackRatingReportSectionWiseReport"
            axios.get(baseUrl, { params })
                .then(res => {   
                    setLoading(false)
                    const { data } = res.data
                    setData(data || [])
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

    const columns = [
        {
            field: "employee_name",
            headerName: "Employee Name",
            flex: 1,
        },
        {
            field: "course_name",
            headerName: "Course Name",
            flex: 1,
        },
         {
            field: "section_name",
            headerName: "Section Name",
            flex: 1,
        },
        {
            field: "avg_ratings_percentage",
            headerName: "Average Percentage",
            flex: 1,
        },
        {
            field: "concateFeedbackWindow",
            headerName: "feedback Window",
            flex: 1,
            renderCell: (params) => {
                const feedbackWindow = params?.row?.concateFeedbackWindow?.split("/")?.join("-")
                return (
                    <Typography>{feedbackWindow}</Typography>
                )
            }
        },
         {
            field: "window_count",
            headerName: "Window Count",
            flex: 1,
        },
         {
            field: "feedBackgivenStudent",
            headerName: "Feedback Count",
            flex: 1,
        },
         {
            field: "totalStudents",
            headerName: "totalStudents",
            flex: 1,
        },
    ];

     const handleChange = (event, newValue) => {
    setTab(newValue);
  //  navigation(`/external-exam-mark-${newValue}`);
  };

    return(
        <>
            
                    <Grid
                     container
                     justifyContent="center"
                     alignItems="center"
                     rowSpacing={4}
                     columnSpacing={2}
                    >
                      <Grid item xs={12} md={12}>
                          <GridIndex rows={data} columns={columns} getRowId={(rows)=> rows?.course_id}/>
                      </Grid>
                      </Grid>
        </>
    )
}

export default FacultyFeedbackReportByCourseAndSection;