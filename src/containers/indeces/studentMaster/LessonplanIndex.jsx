import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  TableCell,
  styled,
  tableCellClasses,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff, Visibility } from "@mui/icons-material";
import { useDownloadExcel } from "react-export-table-to-excel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: "auto",
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

const initialValues = {
  yearId: null,
  contents: "",
  teachingAid: "",
  planDate: null,
  csvFile: "",
  ictText: "",
  fileName: "",
};

function LessonplanIndex() {
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
  const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;
  const roles = [1, 5, 13, 14, 10, 4];
  const { pathname } = useLocation();

  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [modalDataOpenView, setModalDataOpenView] = useState(false);
  const [allData, setAllData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const [lessonPlanAssignmentData, setLessonPlanAssignmentData] =
    useState(null);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "File",
    sheet: "File",
  });

  useEffect(() => {
    getAcademicyear();
  }, []);

  useEffect(() => {
    getDataBasedOnAcYear();
  }, [values.yearId]);

  const getAcademicyear = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      const ids = [];
      response.data.data
        .filter((val) => {
          return val.current_year >= 2023;
        })
        .forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
          ids.push(obj.current_year);
        });

      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === 2024
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        yearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };

  const getDataBasedOnAcYear = async () => {
    if (!values.yearId) return;

    let url;
    if (pathname.toLowerCase() === "/studentmaster/lessonplanindex-user") {
      url = `api/academic/getLessonPlanBasedOnAcYearIdAndUserId/${values.yearId}/${userId}`;
    } else if (roles?.includes(roleId)) {
      url = `/api/academic/getLessonPlan/${values.yearId}`;
    } else {
      url = `api/academic/getLessonPlanBasedOnAcYearIdAndUserId/${values.yearId}/${userId}`;
    }

    try {
      const response = await axios.get(url);
      setRows(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleOpenView = async (params) => {
    setModalDataOpenView(true);
    setValues((prev) => ({
      ...prev,
      contents: "",
      teachingAid: "",
      planDate: null,
      csvFile: "",
      ictText: "",
      fileName: "",
    }));
    setRowData(params.row);
    await axios
      .get(`/api/academic/getLessonPlanDataByLessonId/${params.row.lesson_id}`)
      .then((res) => {
        const rowId = res.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setAllData(rowId);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "course_code",
      headerName: "Course code",
      flex: 1,
    },
    {
      field: "course_name",
      headerName: "Course",
      flex: 1,
      renderCell: (params) => {
        return (
          <HtmlTooltip
            title={
              params.row.course_assignment_coursecode +
              "-" +
              params.row.course_name
            }
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ cursor: "pointer" }}
            >
              {params.row.course_name}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
      valueGetter: (params) =>
        params.row.program_specialization_short_name
          ? params.row.program_specialization_short_name +
            "-" +
            params.row.program_short_name
          : "NA",
    },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "year_sem", headerName: "Year/Sem", flex: 1 },

    {
      field: "empcode",
      headerName: "EMP Code",
      renderCell: (params) => {
        return (
          <HtmlTooltip
            title={`Employee : ${params.row.employee_name} & Dept : ${params.row.dept_name}`}
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ cursor: "pointer" }}
            >
              {params.row.empcode}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    {
      field: "view",
      type: "actions",
      flex: 1,
      headerName: "View",
      getActions: (params) => [
        <IconButton onClick={() => handleOpenView(params)} color="primary">
          <Visibility fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
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
    },
  ];

  const columnsFaculty = [
    {
      field: "username",
      headerName: "Emp Name",
      flex: 1,
    },
    {
      field: "course_code",
      headerName: "Course Code",
      flex: 1,
    },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.program_specialization_short_name}-${params.row.program_short_name}`,
    },

    {
      field: "section_name",
      headerName: "Section Name",
      flex: 1,
      valueGetter: (params) => params.row.section_name ?? "",
    },
    {
      field: "batch_name",
      headerName: "Batch Name",
      flex: 1,
      valueGetter: (params) => params.row.batch_name ?? "",
    },
    {
      field: "plan_date",
      headerName: " Plan Date",
      flex: 1,
    },
    { field: "contents", headerName: "Contents", flex: 1 },
    { field: "teaching_aid", headerName: "Teaching Aid", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "learning_style", headerName: "Learning Style", flex: 1 },
    { field: "teaching_mode", headerName: "Teaching Mode", flex: 1 },
    {
      field: "date_of_class",
      headerName: "Date of Class",
      flex: 1,
      valueGetter: (params) =>
        params.row.date_of_class
          ? moment(params.row.date_of_class).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.date_of_class === null ? (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleDelete(params.row.lesson_assignment_id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "attachment_path",
      headerName: "Upload ICT",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.attachment_path === null ? (
          <>
            <IconButton onClick={() => handleUpload(params.row)}>
              <AddCircleOutlineIcon color="primary" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={() => handleUpload(params.row)}>
              <VisibilityIcon color="primary" />
            </IconButton>
          </>
        ),
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
  ];

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/LessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getDataBasedOnAcYear();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateLessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getDataBasedOnAcYear();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleDelete = (id) => {
    setModalOpen(true);
    const handleDeleteData = async () => {
      await axios
        .delete(`/api/academic/deleteLessonPlanAssignment/${id}`)
        .then((res) => {
          if (res.status === 200) {
            setModalOpen(false);
            setModalDataOpenView(false);
            setAlertMessage({
              severity: "success",
              message: "Deleted Successfully",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => console.error(err));
    };

    setModalContent({
      title: "Activate",
      message: "Are you sure you want to delete this data ??",
      buttons: [
        { name: "Yes", color: "primary", func: handleDeleteData },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const handleCreateIct = async (lessonAssignmentId) => {
    try {
      const formData = new FormData();
      formData.append("file", values.fileName);
      formData.append(
        "lesson_assignment_id",
        lessonPlanAssignmentData.lesson_assignment_id
      );

      const payload = {
        lesson_id: lessonPlanAssignmentData.lesson_id,
        lesson_assignment_id: lessonPlanAssignmentData.lesson_assignment_id,
        active: true,
        plan_date: lessonPlanAssignmentData.plan_date,
        contents: lessonPlanAssignmentData.contents,
        teaching_aid: lessonPlanAssignmentData.teaching_aid,
        ict_text: values.ictText,
        date_of_class: lessonPlanAssignmentData.date_of_class,
        type: lessonPlanAssignmentData?.type,
        learning_style: lessonPlanAssignmentData?.learning_style,
        teaching_mode: lessonPlanAssignmentData?.teaching_mode,
      };
      setLoading(true);

      await axios.put(
        `/api/academic/lessonPlanAssignment/${lessonPlanAssignmentData.lesson_assignment_id}`,
        payload
      );

      const uploadResponse = await axios.post(
        `/api/academic/lessonPlanUploadFile`,
        formData
      );

      if (uploadResponse.status === 200 || uploadResponse === 201) {
        setAlertMessage({
          severity: "success",
          message: "Uploaded Successfully",
        });
        setAlertOpen(true);
        setModalUploadOpen(false);
        setModalDataOpenView(false);
        setLoading(false);
        getDataBasedOnAcYear();
        setValues((prev) => ({
          ...prev,
          contents: "",
          teachingAid: "",
          planDate: null,
          csvFile: "",
          ictText: "",
          fileName: "",
        }));
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const handleDownload = async () => {
    if (
      lessonPlanAssignmentData.attachment_path.endsWith(".jpg") ||
      lessonPlanAssignmentData.attachment_path.endsWith(".PNG") ||
      lessonPlanAssignmentData.attachment_path.endsWith(".png") ||
      lessonPlanAssignmentData.attachment_path.endsWith(".JPG")
    ) {
      await axios
        .get(
          `/api/academic/imageDownloadOfLessonPlanAttachment?attachment_path=${lessonPlanAssignmentData.attachment_path}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg");
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/academic/fileDownloadOfLessonPlanAttachment?attachment_path=${lessonPlanAssignmentData.attachment_path}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          window.open(url);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleUpload = (lessonAssignmentData) => {
    setValues((prev) => ({
      ...prev,
      ["ictText"]: lessonAssignmentData.ict_text
        ? lessonAssignmentData.ict_text
        : "",
    }));

    setLessonPlanAssignmentData(lessonAssignmentData);
    setModalUploadOpen(true);
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <ModalWrapper
          maxWidth={1900}
          open={modalDataOpenView}
          setOpen={setModalDataOpenView}
        >
          <GridIndex columns={columnsFaculty} rows={allData} />
        </ModalWrapper>

        <ModalWrapper
          open={modalUploadOpen}
          setOpen={setModalUploadOpen}
          maxWidth={700}
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
          >
            {lessonPlanAssignmentData?.attachment_path === null ? (
              <Grid item xs={12} md={6}>
                <CustomFileInput
                  name="fileName"
                  label="ICT"
                  file={values.fileName}
                  handleFileDrop={handleFileDrop}
                  handleFileRemove={handleFileRemove}
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12} md={6}>
              <CustomTextField
                rows={3}
                multiline
                name="ictText"
                label="ICT Text"
                value={values.ictText}
                handleChange={handleChange}
              />
            </Grid>

            {lessonPlanAssignmentData?.attachment_path !== null ? (
              <Grid item xs={12} md={6}>
                <Button
                  startIcon={<CloudDownloadIcon />}
                  sx={{ borderRadius: 2 }}
                  variant="contained"
                  onClick={handleDownload}
                >
                  Download File
                </Button>
              </Grid>
            ) : (
              <></>
            )}

            {lessonPlanAssignmentData?.attachment_path === null ? (
              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handleCreateIct}
                  disabled={values.ictText === null || values.fileName === ""}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>{"Create"}</strong>
                  )}
                </Button>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </ModalWrapper>

        <FormWrapper>
          <Grid container columnSpacing={6} marginBottom={2}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="yearId"
                label="Academic Year"
                options={academicYearOptions}
                value={values.yearId}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} md={9} textAlign="right">
              <Button
                onClick={() => navigate("/StudentMaster/LessonplanForm")}
                variant="contained"
                disableElevation
                sx={{ borderRadius: 2 }}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            </Grid>
          </Grid>

          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />

          <GridIndex rows={rows} columns={columns} />
        </FormWrapper>
      </Box>
    </>
  );
}

export default LessonplanIndex;
