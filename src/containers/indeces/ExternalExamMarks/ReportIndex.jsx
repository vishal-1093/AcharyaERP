import { useState, useEffect, lazy } from "react";
import {
  IconButton,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import axios from "../../../services/Api";
import moment from "moment";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const GridIndex = lazy(() => import("../../../components/GridIndex"));

const initialState = {
  reportList: [],
  scoredMarks: "",
  loading: false,
  isScoredModalOpen: false,
  externalMarksDetails: null,
  loggedInUserRole: null,
  percent: null,
};

const ReportIndex = () => {
  const [
    {
      reportList,
      isScoredModalOpen,
      scoredMarks,
      loading,
      loggedInUserRole,
      externalMarksDetails,
      percent,
    },
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;
    setState((prevState) => ({
      ...prevState,
      loggedInUserRole: roleId,
    }));
    setCrumbs([{ name: "External Exam Mark" }]);
    getExternalMarksReport();
  }, []);

  const columns = [
    { field: "idx", headerName: "SL.No.", flex: 1 },
    { field: "ac_year", headerName: "Academic Year", flex: 1 },
    {
      field: "current_sem",
      headerName: "Year/Sem",
      flex: 1,
      renderCell: (params) =>
        `${params.row?.current_year}/${params.row?.current_sem}`,
    },
    { field: "course_code", headerName: "Subject Code", flex: 1 },
    { field: "date_of_exam", headerName: "Exam Date", flex: 1 ,renderCell:(params)=>(moment(params.row?.date_of_exam).format("DD-MM-YYYY"))},
    { field: "studentAuid", headerName: "Auid", flex: 1 },
    { field: "student_name", headerName: "Name", flex: 1 },
    {
      field: "marks_obtained_external",
      headerName: "Scored",
      flex: 1,
      renderCell: (params) => (
        <IconButton>
          {loggedInUserRole == 1 ? (
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{
                cursor: "pointer",
              }}
              onClick={() => handleScored(params)}
            >
              {params.row?.marks_obtained_external}
            </Typography>
          ) : (
            <Typography variant="subtitle2">
              {params.row?.marks_obtained_external}
            </Typography>
          )}
        </IconButton>
      ),
    },
    {
      field: "percentage",
      headerName: "Percent",
      flex: 1,
      renderCell: (params) => `${params.row.percentage} %`,
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      // type: "date",
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
  ];

  const handleScored = (params) => {
    setState((prevState) => ({
      ...prevState,
      externalMarksDetails: params.row,
      scoredMarks: params.row?.marks_obtained_external,
      isScoredModalOpen: !isScoredModalOpen,
    }));
  };

  const getExternalMarksReport = async () => {
    try {
      const res = await axios.get(
        `/api/student/fetchAllExternalStudentMarksDetail?page=0&page_size=1000&sort=created_date`
      );
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          reportList: res?.data?.data?.Paginated_data?.content?.filter((li)=>!!li?.student_id)?.map(
            (el, index) => ({
              idx: index + 1,
              ...el,
            })
          ),
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const handleScoredModal = () => {
    setState((prevState) => ({
      ...prevState,
      isScoredModalOpen: !isScoredModalOpen,
    }));
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      percent: !!externalMarksDetails?.external_max_marks
        ? Number(
            (Number(e.target.value) /
              Number(externalMarksDetails?.external_max_marks)) *
              100
          )
        : "",
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let payload = {
        internal_id: externalMarksDetails?.internal_id,
        course_assignment_id: externalMarksDetails?.course_assignment_id,
        current_year_sem: null,
        ac_year_id: externalMarksDetails?.ac_year_id,
        external_max_mark: externalMarksDetails?.external_max_marks,
        external_min_mark: externalMarksDetails?.external_min_marks,
        exam_date: externalMarksDetails?.date_of_exam,
        program_specialization_id:
          externalMarksDetails?.program_specialization_id,
        current_year: externalMarksDetails?.current_year,
        current_sem: externalMarksDetails?.current_sem,
        studentMarksAssignment: [
          {
            student_id: externalMarksDetails?.student_id,
            marks_obtained_external: scoredMarks,
            percentage: percent,
          },
        ],
      };
      const res = await axios.post(
        `api/student/createExternalStudentMark`,
        payload
      );
      if ((res.status = 200 || res.status == 201)) {
        actionAfterResponse();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = () => {
    setLoading(false);
    getExternalMarksReport();
    handleScoredModal();
    navigate("/external-exam-mark-report", {
      replace: true,
    });
    setAlertMessage({
      severity: "success",
      message: `Scored updated successfully !!`,
    });
    setAlertOpen(true);
  };

  return (
    <>
      {!!isScoredModalOpen && (
        <ModalWrapper
          title="Update Score"
          maxWidth={400}
          open={isScoredModalOpen}
          setOpen={() => handleScoredModal()}
        >
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={12}>
              <CustomTextField
                name="scoredMarks"
                label="scored Mark"
                value={scoredMarks || ""}
                handleChange={handleChange}
                type="number"
                required
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
            >
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={!scoredMarks}
                onClick={handleSubmit}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong>{"Submit"}</strong>
                )}
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
      )}
      <Box
        mb={2}
        sx={{
          marginTop: { xs: -1, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/External-exam-mark-form")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <GridIndex rows={reportList || []} columns={columns} />
      </Box>
    </>
  );
};

export default ReportIndex;
