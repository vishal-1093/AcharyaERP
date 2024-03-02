import { useState, useEffect } from "react";
import { Grid, Box, Button, Typography, Tooltip } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { convertDateFormat } from "../../../utils/Utils";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import { checkFullAccess } from "../../../utils/DateTimeUtils";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

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

function ProctorStudentMarks() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [validation, setValidation] = useState("");
  const [data, setData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const openFeeModal = async (data) => {
    setData(data);
    setIsModalOpen(true);
    setValidation("");
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

  const handleSubmit = async () => {
    const newMarks = parseInt(values.marks, 10);
    if (!isNaN(newMarks) && newMarks <= data?.max_marks) {
      const newPercentage = (newMarks / data?.max_marks) * 100;
      const params = {
        marks_id: data?.id,
        student_id: data?.student_id,
        auid: null,
        course_id: null,
        marks_obtained_internal: values?.marks,
        marks_obtained_external: 0,
        total_marks_internal: 0,
        total_marks_external: 0,
        percentage: newPercentage,
        grade: "",
        internal_id: data?.internal_id,
        current_year_sem: data?.current_year_sem,
        ac_year_id: data?.ac_year_id,
        batch_id: null,
        section_id: null,
        status: true,
        exam_room_id: null,
        active: true,
        course_assignment_id: data?.course_assignment_id,
      };
      await axios
        .put(`/api/student/studentMarks/${data?.id}`, [params])
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Scored Updated",
            });
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
      setValidation("Marks Cannot be More than Max-Marks");
      //   setAlertMessage({
      //     severity: "error",
      //     message: "Marks Cannot be More than Max-Marks",
      //   });
      //   setAlertOpen(true);
    }
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
            // onClick={() =>
            //   navigate(`/StudentDetailsMaster/StudentsDetails/${params.row.id}`)
            // }
          >
            {params.row.student_name.length > 25
              ? `${params.row.student_name.slice(0, 25)}...`
              : params.row.student_name}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "studentAuid", headerName: "AUID", flex: 1 },

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
          //   onClick={() => openModal(params.row)}
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
            ? params.row?.course_name + "-" + params.row?.course_code
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
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/student/getStudentMarkDetailsBasedOnProctor/${userId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <ModalWrapper
          open={isModalOpen}
          setOpen={setIsModalOpen}
          maxWidth={350}
          title="Update Scored Marks"
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
          >
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
            <Grid item xs={12} align="center">
              <Typography color="error" variant="subtitle2">
                {validation}
              </Typography>
            </Grid>
          </Grid>
        </ModalWrapper>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default ProctorStudentMarks;
