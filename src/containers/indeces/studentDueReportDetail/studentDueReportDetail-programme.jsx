import { useState, useEffect } from "react";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const initialValues = {
  schoolId: "",
  programSpelizationId: "",
  acYearId: "",
};

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 10,
    width: "fit-content",
    zIndex: theme.zIndex.drawer - 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
  },
}));


function StudentDueReportForProgramme() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false)
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    usn: false,
    fee_admission_sub_category_name: false,
    counselor_note: false,
    counselor_remarks: false,
    scholarship: false,
    hostelWaiver: false,
    collageWaiver: false
  })
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const queryValues = location.state;
  const [breadCrumbs, setBreadCrumbs] = useState()

  const columns = [
    { field: "student_name", headerName: "Name", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
    { field: "auid", headerName: "AUID", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "usn", headerName: "USN", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "year/sem", headerName: "Year/Sem", flex: 1, headerClassName: "header-bg", align: 'center', headerAlign: 'center' },
    { field: "fee_admission_category_type", headerName: "Category", flex: 1, headerClassName: "header-bg", align: 'center', headerAlign: 'center' },
    { field: "fee_admission_sub_category_name", headerName: "Sub-Category", flex: 1, headerClassName: "header-bg", align: 'center', headerAlign: 'center' },
    { field: "fee_template_name", headerName: "Fee Template", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "date_of_admission", headerName: "DOA", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "counselorName", headerName: "Counselor", align: "left", flex: 1, headerClassName: "header-bg", headerAlign: 'center' },
    { field: "counselor_remarks", headerName: "Counselor Note", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "fixedAmount", headerName: "Fixed", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "paidAmount", headerName: "Paid", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "scholarship", headerName: "Scholarship", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "collageWaiver", headerName: "C-Waiver", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "due", headerName: "Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "addOn", headerName: "Add On Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "hostelWaiver", headerName: "H-Waiver", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    { field: "hostelDue", headerName: "Hostel Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
    {
      field: "totalDue", headerName: "Total Due", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center',
      renderCell: (params) => {
        const total = Number(params?.row?.totalDue) || 0;
        return <Typography fontWeight="bold">{total}</Typography>;
      }

    }
  ];

  useEffect(() => {
    setCrumbs([])
    setBreadCrumbs([
      {
        name: 'Student Due Report Detail',
        link: '/student-due-report-detail',
        state: queryValues,
      },
      { name: `Student Due Report-${queryValues?.course}` },
    ])
    getData()
  }, []);

  const getData = async () => {
    const { schoolId, programId, acYearId, programSpecializationId } = queryValues
    const baseUrl = "/api/student/acYearWiseStudentDueDetails"
    const params = {
      ...(schoolId && { schoolId }),
      ...(programId && { programId }),
      ...(acYearId && { acYearId }),
      ...(programSpecializationId && { programSpecializationId })
    }
    setLoading(true)
    await axios
      .get(baseUrl, { params })
      .then((res) => {
        const { data } = res?.data

        const rowData = []
        data?.studentDetails?.length > 0 && data?.studentDetails?.map((obj) => {
          rowData.push({
            student_name: obj?.student_name,
            'year/sem': obj['year/sem'],
            fixedAmount: obj?.total_fixed,
            paidAmount: obj?.paid,
            scholarship: obj?.scholarship,
            fee_admission_category_type: obj?.fee_admission_category_short_name,
            fee_admission_sub_category_name: obj?.fee_admission_sub_category_short_name,
            fee_template_name: obj?.fee_template_name,
            date_of_admission: obj?.date_of_admission,
            counselorName: obj?.counselor_name,
            counselor_remarks: obj?.counselor_remarks,
            addOn: obj?.totalAddOn,
            hostelDue: obj?.hostelDue,
            due: obj?.due,
            totalDue: obj?.total_due,
            collageWaiver: obj?.waiver,
            hostelWaiver: obj?.hostelWaiver,
            student_id: obj?.student_id,
            auid: obj?.auid,
            usn: obj?.usn,
            isLastRow: false
          })
        })
        if (data?.studentDetails?.length > 0) {
          rowData.push({
            student_name: "",
            student_id: Date.now(),
            'year/sem': "",
            fixedAmount: data?.totalFixed,
            paidAmount: data?.totalPaid,
            scholarship: data?.totalScholarShip,
            addOn: data?.totalAddOn,
            hostelDue: data?.totalHostelDue,
            due: data?.totalDue,
            totalDue: data?.totalDue + data?.totalAddOn + data?.totalHostelDue,
            collageWaiver: data?.totalWaiver,
            hostelWaiver: data?.totalHostelWaiver,
            isLastRow: true
          })
        }
        setRows(rowData || []);
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      });
  };

  return (
    <Box sx={{ position: "relative", marginTop: 1 }}>
      <CustomBreadCrumbs crumbs={breadCrumbs} />
      <Box sx={{ position: "absolute", width: "100%" }}>
        <Grid container justifyContent="space-between" pt={1} rowGap={2} className="main-grid">
          <Grid item xs={12} md={12} lg={12} sx={{
            '& .last-row': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
            '& .last-column': { fontWeight: "bold" },
            '& .last-row:hover': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
            '& .header-bg': { fontWeight: "bold", backgroundColor: "#376a7d !important", color: "#fff", fontSize: "15px" },
          }}
            className="children-grid"
          >
            <GridIndex
              rows={rows}
              columns={columns}
              getRowId={(row, index) => row?.student_id}
              loading={loading}
              getRowClassName={(params) => {
                return params.row.isLastRow ? "last-row" : ""
              }}
              columnVisibilityModel={columnVisibilityModel}
              setColumnVisibilityModel={setColumnVisibilityModel}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
export default StudentDueReportForProgramme;

const CustomBreadCrumbs = ({ crumbs = [] }) => {
  const navigate = useNavigate()
  const classes = useStyles()
  if (crumbs.length <= 0) return null

  return (
    <Box className={classes.breadcrumbsContainer}>
      <Breadcrumbs
        style={{ fontSize: "1.15rem" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {crumbs?.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={index}>
              {!isLast ? (
                <Typography
                  onClick={() => navigate(crumb.link, { state: crumb.state })}
                  className={classes.link}
                  fontSize="inherit"
                >
                  {crumb.name}
                </Typography>
              ) : (
                <Typography color="text.primary" fontSize="inherit">
                  {crumb.name}
                </Typography>
              )}
            </span>
          );
        })}
      </Breadcrumbs>
    </Box>
  )
}
