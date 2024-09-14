import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useLocation } from "react-router-dom";
import GridIndex from "../../../components/GridIndex";
import {
  Box,
  Button,
  Grid,
  Typography
} from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import Tooltip from "@mui/material/Tooltip";
import { convertDateFormat } from "../../../utils/Utils";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { checkFullAccess } from "../../../utils/DateTimeUtils";

const initialValues = {
  acyearId: null,
  auid: "",
  transportAcyearId: null,
  pickUpPoints: null,
  stageName: "",
  amount: "",
  remarks: "",
  stageNumber: "",
  stageRouteId: null,
  courseId: [],
  assignedId: [],
  marks: "",
};
function StudentMarksIndex() {
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 1000,
    total: 0,
  });
  const setCrumbs = useBreadcrumbs();
  const [filterString, setFilterString] = useState("");
  const [values, setValues] = useState(initialValues);
  const [rowData, setRowData] = useState();
  const [validation, setValidation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const openFeeModal = async (data) => {
    setRowData(data);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const checks = {
    marks: [values.marks !== "", /^[0-9]{1,10}$/.test(values.marks)],
  };

  const errorMessages = {
    marks: ["This field is required", "Enter Only Numbers"],
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.row.student_name} arrow>
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 200,
            }}
          >
            {params.row.student_name !== null &&
            params.row.student_name.length > 25
              ? `${params.row.student_name.slice(0, 25)}...`
              : params.row.student_name}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "studentAuid",
      headerName: "AUID",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.row.studentAuid} arrow>
          <Typography
               variant="body2"
            sx={{
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              
            }}
          >
            {params.row.studentAuid !== null &&
            params.row.studentAuid.length > 9
              ? `${params.row.studentAuid.slice(0, 9)}...`
              : params.row.studentAuid}
          </Typography>
        </Tooltip>
      ),
    },

    {
      field: "current_year_sem",
      headerName: "SEM",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 1 }}>
          {params.row?.current_year_sem ? params.row?.current_year_sem : "--"}
        </Typography>
      ),
    },

    {
      field: "program_short_name",
      headerName: "Program",

      renderCell: (params) => (
        <Typography
          variant="body2"
          // color="primary"
          sx={{ paddingLeft: 0 }}
          // onClick={()=> openModal(params.row)}
        >
          {params.row?.program_short_name
            ? params.row?.program_short_name
            : "--"}
        </Typography>
      ),

      flex: 1,
    },

    {
      field: "course_short_name",
      headerName: "Course",
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.course_name
            ? params.row?.course_name + "-" + params.row?.course_assignment_coursecode
            : "--"}
        </Typography>
      ),
    },
    {
      field: "internal_short_name",
      headerName: "Exam",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.internal_short_name
            ? params.row?.internal_short_name
            : "--"}
        </Typography>
      ),
    },

    {
      field: "max_marks",
      headerName: "Max Marks",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 1 }}>
          {params.row?.max_marks ? params.row?.max_marks : "--"}
        </Typography>
      ),
    },
    {
      field: "min_marks",
      headerName: "Min Marks",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 1 }}>
          {params.row?.min_marks ? params.row?.min_marks : "--"}
        </Typography>
      ),
    },
    {
      field: "marks_obtained_internal",
      headerName: "Scored",
      flex: 1,
      renderCell: (params) => (
        <>
          {checkFullAccess() ? (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{
                  cursor: "pointer",
                  textTransform: "capitalize",
                  paddingLeft: 1,
                }}
                onClick={() => openFeeModal(params.row)}
              >
                {params.row?.marks_obtained_internal
                  ? params.row?.marks_obtained_internal
                  : "--"}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2">
                {params.row?.marks_obtained_internal
                  ? params.row?.marks_obtained_internal
                  : "--"}
              </Typography>
            </>
          )}
        </>
      ),
    },
    {
      field: "percentage",
      headerName: "%",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row?.percentage !== undefined
            ? Number.isInteger(params.row?.percentage)
              ? params.row?.percentage
              : params.row?.percentage?.toFixed(1)
            : "--"}
        </Typography>
      ),
    },

    {
      field: "created_username",
      headerName: "Created By",
      hide: true,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.created_username ? params.row?.created_username : "--"}
        </Typography>
      ),
    },
    {
      field: "created_date",
      headerName: "Created Date",
      hide: true,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.created_date
            ? convertDateFormat(params.row?.created_date)
            : "--"}
        </Typography>
      ),
    },
  ];

  useEffect(() => {
    if (pathname.toLowerCase() === "/stdmarks/report") {
      setCrumbs([
        { name: "Assesment Marks", link: "/stdmarks" },
        { name: "Report" },
      ]);
    }
  }, [pathname]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));

    await axios(
      `/api/student/fetchAllStudentMarksDetail?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date`
    )
      .then((res) => {
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data.Paginated_data.content,
          total: res.data.data.Paginated_data.totalElements,
          loading: false,
        }));
      })
      .catch((err) => console.error(err));
  };
  //   await axios
  //     .get(`/api/academic/academic_year`)
  //     .then((res) => {
  //       const getLatestYear = Math.max(
  //         ...res.data.data.map((obj) => obj.current_year)
  //       );
  //       const getLatestYearId = res.data.data.filter(
  //         (obj) => obj.current_year === getLatestYear
  //       );

  //       setValues((prev) => ({
  //         ...prev,
  //         acyearId:
  //           getLatestYearId.length > 0 ? getLatestYearId[0].ac_year_id : "",
  //       }));

  //       setAcademicYearOptions(
  //         res.data.data.map((obj) => ({
  //           value: obj.ac_year_id,
  //           label: obj.ac_year,
  //         }))
  //       );
  //     })
  //     .catch((err) => console.error(err));
  // };

  const handleSubmit = async () => {
    const newMarks = parseInt(values.marks, 10);
    if (!isNaN(newMarks) && newMarks >= 0 && newMarks <= rowData?.max_marks) {
      const newPercentage = (newMarks / rowData?.max_marks) * 100;
      const params = {
        marks_id: rowData?.id,
        student_id: rowData?.student_id,
        auid: null,
        course_id: null,
        marks_obtained_internal: parseFloat(values?.marks) ,
        marks_obtained_external: 0,
        total_marks_internal: 0,
        total_marks_external: 0,
        percentage: newPercentage,
        grade: "",
        internal_id: rowData?.internal_id,
        current_year_sem: rowData?.current_year_sem,
        ac_year_id: rowData?.ac_year_id,
        batch_id: null,
        section_id: null,
        status: true,
        exam_room_id: null,
        active: true,
        course_assignment_id: rowData?.course_assignment_id,
      };
      await axios
        .put(`/api/student/studentMarks/${rowData?.id}`, [params])
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({ severity: "success", message: "Scored Updated" });
            setAlertOpen(true);
            setIsModalOpen(false);
            getData();
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response.data.message,
          });
          setAlertOpen(true);
          setValidation(err.response.data.message);
          setIsModalOpen(false);
        });
    } else {
      setAlertMessage({
        severity: "error",
        message: newMarks < 0 ? "Enter Valid Marks" : "Marks cannot be more than Max-Marks",
      });
      setAlertOpen(true);
    }
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  return (
    <Box mt={2}>
      <ModalWrapper
        open={isModalOpen}
        setOpen={setIsModalOpen}
        maxWidth={350}
        title="Update Scored Marks"
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={12} mt={2}>
            <CustomTextField
              name="marks"
              label="Update Marks"
              value={values.minMarks}
              handleChange={handleChange}
              checks={checks.minMarks}
              errors={errorMessages.minMarks}
              required
            />
          </Grid>
          <Grid item xs={3} mt={2} textAlign="center">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleSubmit}
            >
              SUBMIT
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      {/* Index  */}
      <Grid container rowSpacing={1}>
        <Grid item xs={12}>
          <GridIndex
            rows={paginationData.rows}
            columns={columns}
            loading={paginationData.loading}
            handleOnFilterChange={handleOnFilterChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentMarksIndex;
