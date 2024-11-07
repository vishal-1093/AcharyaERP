import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  Tooltip,
  tooltipClasses,
  TableBody,
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
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useAlert from "../../../hooks/useAlert";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    // width: "100%",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

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
  const roles = [1, 5, 13, 14, 10, 4, 3];

  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [modalDataOpen, setModalDataOpen] = useState(false);
  const [data, setData] = useState([]);
  const [modalDataOpenView, setModalDataOpenView] = useState(false);
  const [allData, setAllData] = useState([]);
  const [lessonplanData, setLessonplanData] = useState([]);
  const [alert, setAlert] = useState();
  const [openButton, setOpenButton] = useState(true);
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

  const getDataBasedOnAcYear = async () => {
    let url;

    if (roles?.includes(roleId)) {
      url = `/api/academic/getLessonPlan/${values.yearId}`;
    } else {
      url = `api/academic/getLessonPlanByAcademicYearAndEmployeeId/${values.yearId}/${userId}`;
    }

    if (values.yearId)
      await axios
        .get(url)
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((error) => console.error(error));
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

  const handleOpen = (params) => {
    setModalDataOpen(true);
    setData(params);
    setValues((prev) => ({
      ...prev,
      contents: "",
      teachingAid: "",
      planDate: null,
      csvFile: "",
      ictText: "",
      fileName: "",
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
      .get(`/api/academic/getLessonPlanDataByLessonId/${params.row.id}`)
      .then((res) => {
        setAllData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = async () => {
    if (values.teachingAid === "") {
      const dataArray = new FormData();
      dataArray.append("file", values.csvFile);
      dataArray.append("lesson_id", data.row.id);

      await axios
        .post(`/api/academic/LessonPlanAssignmentUsingCsvFile`, dataArray)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setLessonplanData(res.data.data);
            setOpenButton(false);
            setAlert();
            getDataBasedOnAcYear();
          } else {
            setAlertMessage({ severity: "error", message: "Error Occured" });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setAlert(err.response.data.message);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    } else {
      const temp = [];
      temp.push({
        active: true,
        contents: values.lessonPlanContents,
        plan_date: values.planDate,
        teaching_aid: values.teachingAid,
        book_id: data.row.book_id,
        lesson_id: data.row.id,
      });

      await axios
        .post(`/api/academic/lessonPlanAssignment`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({ severity: "success", message: "Data updated" });
          } else {
            setAlertMessage({ severity: "error", message: "Error Occured" });
          }
          setAlertOpen(true);
          setModalDataOpen(false);
          window.location.reload();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleCreateCsvFile = async () => {
    const temp = [];
    lessonplanData.map((obj, i) => {
      temp.push({
        active: true,
        contents: obj.contents,
        plan_date: obj.plan_date,
        teaching_aid: obj.teaching_aid,
        book_id: data.row.book_id,
        lesson_id: data.row.id,
      });
    });

    await axios
      .post(`/api/academic/lessonPlanAssignment`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Data updated" });
          setLessonplanData([]);
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
        }
        setAlertOpen(true);
        setModalDataOpen(false);
        getDataBasedOnAcYear();
      })
      .catch((err) => {
        setAlert(err.res.data.message);
      });
  };

  const columns = [
    {
      field: "date_of_class",
      headerName: "Date of class",
      flex: 1,
      hide: true,
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
    { field: "year_sem", headerName: "Year/Sem", flex: 1, hide: true },
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
    // {
    //   field: "Add",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "ICT",
    //   getActions: (params) => [
    //     <IconButton onClick={() => handleUpload(params.row)} color="primary">
    //       <AddCircleOutlineIcon fontSize="small" />
    //     </IconButton>,
    //   ],
    // },
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
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
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
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
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
        setAlertMessage({ severity: "success", message: "Created" });
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
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
            marginTop={2}
          >
            <Grid item xs={12}>
              <Button variant="contained" size="small" onClick={onDownload}>
                Export to Excel
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <TableContainer component={Paper}>
                <Table size="small" ref={tableRef}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Plan Date
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Contents
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Teaching Aid
                      </StyledTableCell>

                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Date of Class
                      </StyledTableCell>

                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Delete
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Upload ICT
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {allData.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "center" }}>
                            {obj.plan_date !== null && obj.plan_date.length > 10
                              ? moment(obj.plan_date).format("DD-MM-YYYY")
                              : obj.plan_date}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "center" }}>
                            {obj.contents}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "center" }}>
                            {obj.teaching_aid}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "center" }}>
                            {obj.date_of_class
                              ? moment(obj.date_of_class).format("DD-MM-YYYY")
                              : "NA"}
                          </StyledTableCell>

                          <StyledTableCell sx={{ textAlign: "center" }}>
                            {obj.date_of_class === null ? (
                              <IconButton
                                style={{ color: "red" }}
                                onClick={() =>
                                  handleDelete(obj.lesson_assignment_id)
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <></>
                            )}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "center" }}>
                            <IconButton onClick={() => handleUpload(obj)}>
                              <AddCircleOutlineIcon color="primary" />
                            </IconButton>
                          </StyledTableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
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

        <ModalWrapper
          title="Select Field 1 or Field 2"
          maxWidth={1200}
          open={modalDataOpen}
          setOpen={setModalDataOpen}
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
            marginTop={2}
          >
            <Grid item xs={12}>
              <Typography variant="inherit" sx={{ fontSize: 15 }}>
                Field - 1
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="planDate"
                label="Plan Date"
                value={values.planDate}
                handleChangeAdvance={handleChangeAdvance}
                disabled={values.csvFile !== ""}
              />
            </Grid>
            <Grid item xs={12} md={4} mb={2.8}>
              <CustomTextField
                name="lessonPlanContents"
                label="Lesson Plan Contents"
                value={values.lessonPlanContents}
                handleChange={handleChange}
                disabled={values.csvFile !== ""}
              />
            </Grid>
            <Grid item xs={12} md={4} mb={2.8}>
              <CustomTextField
                name="teachingAid"
                label="Teaching Aid"
                value={values.teachingAid}
                handleChange={handleChange}
                disabled={values.csvFile !== ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="inherit" sx={{ fontSize: 15 }}>
                Field - 2
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomFileInput
                name="csvFile"
                label="CSV"
                helperText=""
                file={values.csvFile}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
              />
            </Grid>
            {openButton ? (
              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handleSubmit}
                >
                  Add
                </Button>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
            marginTop={2}
          >
            {!openButton ? (
              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={handleCreateCsvFile}
                >
                  Create
                </Button>
              </Grid>
            ) : (
              <></>
            )}

            {lessonplanData.length > 0 ? (
              <Grid item xs={12} md={8}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          sx={{ width: "25%", textAlign: "center" }}
                        >
                          Plan date
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ width: "25%", textAlign: "center" }}
                        >
                          Contents
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ width: "25%", textAlign: "center" }}
                        >
                          Teaching Aid
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lessonplanData !== undefined ? (
                        lessonplanData.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <StyledTableCell
                                sx={{ width: "25%", textAlign: "center" }}
                              >
                                {obj.plan_date}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ width: "25%", textAlign: "center" }}
                              >
                                {obj.contents}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ width: "25%", textAlign: "center" }}
                              >
                                {obj.teaching_aid}
                              </StyledTableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12} align="center">
              <Typography variant="title" color="error">
                {alert ? alert : ""}
              </Typography>
            </Grid>
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
