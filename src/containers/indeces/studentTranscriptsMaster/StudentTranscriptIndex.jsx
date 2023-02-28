import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ModalWrapper from "../../../components/ModalWrapper";

const initialValues = {
  yearId: "",
};

function StudentTranscriptIndex() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [fileUpload, setFileUpload] = useState();

  const [file, setFile] = useState();
  function handleChangeImage(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAcademicYearOptions();
    getUploadData();
  }, []);

  const handleUpload = (params) => {
    setStudentId(params.row.id);
    setModalUploadOpen(true);
  };

  const getAcademicYearOptions = async () => {
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

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const update = async () => {
    setLoading(true);
    const dataArray = new FormData();
    dataArray.append("image_file", fileUpload);
    dataArray.append("student_id", studentId);
    await axios
      .post(`/api/student/studentImageUploadFile`, dataArray)
      .then((res) => {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: "File Uploaded",
        });
        setAlertOpen(true);
        navigate("/StudentTranscriptMaster", { replace: true });
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
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

  const columns = [
    { field: "student_name", headerName: "Name", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },

    // { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "upload",
      headerName: "Upload Photo",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton onClick={() => handleUpload(params)} color="primary">
          <CloudUploadOutlinedIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "coc",
      type: "actions",
      flex: 1,
      headerName: "COC",
      getActions: (params) => [
        <IconButton
        // onClick={() => navigate(`/StudentTranscripf`)}
        >
          <ChangeCircleIcon />
        </IconButton>,
      ],
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Document Collection",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/StudentTranscriptMaster/DocumentCollection/${params.row.id}`
            )
          }
        >
          <LibraryAddIcon />
        </IconButton>,
      ],
    },
  ];

  const handleCreate = () => {
    if (values.yearId) {
      getData(
        `/api/student/studentDetailsIndex/${values.yearId}?page=0&page_size=100&sort=createdDate`
      );
    }
  };
  const getData = async (data) => {
    await axios.get(data).then((res) => {
      setRows(res.data.data);
    });
  };

  const getUploadData = async (params) => {
    await axios
      .get(`/student/Student_Details/${params.row.id}`)
      .then((res) => {
        const path = res.data.data.student_image_path;
        axios(`api/student/studentImageDownload?fileName=${path}`, {
          method: "GET",
          responseType: "blob",
        })
          .then((res) => {
            const file = new Blob([res.data], { type: "application/jpg" });
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1} marginTop={-5}>
        <FormWrapper>
          <Grid container columnSpacing={6} marginBottom={2}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="yearId"
                label="Academic Year"
                options={academicYearOptions}
                value={values.yearId}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleCreate}
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

          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />

          <ModalWrapper
            open={modalUploadOpen}
            setOpen={setModalUploadOpen}
            maxWidth={850}
            // maxHeight={800}
            title="Upload File"
            // height="fitContent"
          >
            <Grid item xs={12} md={12} textAlign="justify">
              <Typography>
                <b>Profile Photo update for ID card </b>
              </Typography>
              <br></br>
              <Typography
                sx={{
                  textAlign: "justify",
                  fontSize: "15px",
                  letterSpacing: 2,
                }}
              >
                <ul type="square">
                  <li>
                    Close up of the head and top of the shoulders such that the
                    face takes up 80-85% of the photograph.
                  </li>
                  <li>
                    The photograph should be in color and in the size of 45mm x
                    35mm.
                  </li>
                  <li>
                    Background of the photograph should be a bright uniform
                    colour.
                  </li>
                  <li>
                    The photographs must:
                    <li>Show the applicant looking directly at the camera.</li>
                    <li>Show the skin tones naturally.</li>
                    <li>
                      Have appropriate brightness and contrast - Show the
                      applicants eyes open & clearly visible, - Should not have
                      hair across the eyes.
                    </li>
                    <li>
                      Be taken with uniform lighting and not show shadows or
                      flash reflections on the face and no red eye.
                    </li>
                  </li>
                </ul>
              </Typography>
            </Grid>
            <Grid container>
              <Grid item xs={6} mt={10}>
                <Button variant="contained" component="label">
                  <CloudUploadIcon fontSize="large" />
                  <input type="file" onChange={handleChangeImage} hidden />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <img src={file} />
              </Grid>
            </Grid>

            <Grid item xs={12} textAlign="right">
              <Button
                variant="contained"
                size="small"
                style={{ borderRadius: 4 }}
                onClick={update}
                disabled={loading}
                onChange={(e) => setFileUpload(e.target.files[0])}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong> Upload</strong>
                )}
              </Button>
            </Grid>
          </ModalWrapper>

          <GridIndex rows={rows} columns={columns} />
        </FormWrapper>
      </Box>
    </>
  );
}
export default StudentTranscriptIndex;
