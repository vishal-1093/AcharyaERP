import { useState, useEffect } from "react";
import { Grid, Box, Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, Download, HighlightOff } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import useAlert from "../../../hooks/useAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";

const initialValues = {
  imgFile: "",
};
const useStyles = makeStyles((theme) => ({
  dropFileInput: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7ff",
    height: 150,
    maxWidth: 200,
    margin: "auto",
    border: `3px dashed ${theme.palette.primary.main}`,
    borderRadius: 20,

    "&:hover, &.dragover": {
      opacity: 0.7,
    },
  },
}));

function EventCreationIndex() {
  const [rows, setRows] = useState([]);
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [imageOpen, setImageUploadOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [rowData, setRowData] = useState();
  const [imagePath, setImagePath] = useState([]);
  const [fileURL, setfileURL] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [file, setFile] = useState();
  const [imageView, setImageView] = useState([]);

  const classes = useStyles();
  const navigate = useNavigate();

  const handleAddImage = async (params) => {
    setRowData(params.row);
    setImageUploadOpen(true);
  };
  const handleViewImage = async (params) => {
    setRowData(params.row);
    setImageViewOpen(true);
    const paths = [];
    const urls = [];
    await axios
      .get(`/api/institute/eventImageAttachmentsDetails/1/Before`)
      .then((res) => {
        res.data.data.map((obj) => paths.push(obj.event_image_path));
      })
      .catch((error) => console.error(error));

    paths.map((obj) => {
      axios
        .get(
          `/api/institute/eventImageAttachmentsImageDownload?event_image_path=${obj}`,
          {
            method: "GET",
            responseType: "blob",
          }
        )
        .then((res1) => {
          const file = new Blob([res1.data], {
            type: "image/png, image/gif, image/jpeg",
          });
          const url = URL.createObjectURL(file);
          urls.push(url);
          setfileURL(urls);
        })
        .catch((error) => console.error(error));
    });
  };
  const columns = [
    { field: "event_name", headerName: "Event Title", flex: 1 },
    { field: "event_sub_name", headerName: "Sub Title", flex: 1 },
    { field: "event_description", headerName: "Description", flex: 1 },
    { field: "guest_name", headerName: "Guest Name", flex: 1 },
    { field: "is_common", headerName: "Is Common", flex: 1 },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      valueGetter: (params) =>
        params.row.is_common === "Yes"
          ? "All Schools"
          : params.row.school_name_short,
    },
    { field: "roomcode", headerName: "Room", flex: 1 },
    {
      field: "event_start_time",
      headerName: "From Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        convertToDMY(`${params.row.event_start_time.toString().slice(0, 10)}`),
    },
    {
      field: "event_end_time",
      headerName: "To Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        convertToDMY(`${params.row.event_end_time.toString().slice(0, 10)}`),
    },

    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "upload",
      headerName: "Upload Images",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleAddImage(params)}
        >
          <CloudUploadOutlinedIcon />
        </IconButton>,
      ],
    },
    {
      field: "view",
      headerName: "View Images",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleViewImage(params)}
        >
          <VisibilityIcon />
        </IconButton>,
      ],
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() => navigate(`/EventMaster/Event/Update/${params.row.id}`)}
        >
          <EditIcon />
        </IconButton>,
      ],
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
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/institute/fetchAllEventCreation?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/institute/eventCreation/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/institute/activateEventCreation/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
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
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };
  const deleteFile = (e) => {
    const s = imageView.filter((item, index) => index !== e);
    setImageView(s);
  };

  const handleUpload = (e) => {
    setFile(e.target.files);
    setImageView([...imageView, URL.createObjectURL(e.target.files[0])]);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append(`file[${i}]`, file[0]);
    }
    formData.append("event_id", rowData.id);
    formData.append("image_upload_timing", "After");
    formData.append("active", true);
    await axios
      .post(`/api/institute/eventImageAttachmentsUploadFile`, formData)
      .then((res) => {})
      .catch((err) => console.error(err));
    setAlertMessage({
      severity: "success",
      message: "Image Uploaded Successfully",
    });
    setImageUploadOpen(false);
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

      <ModalWrapper
        maxWidth={800}
        open={imageOpen}
        setOpen={setImageUploadOpen}
      >
        <Box>
          <Grid container md={3} mt={2} className={classes.dropFileInput}>
            <Grid item xs={12} md={8} ml={6} mt={2}>
              <Button
                variant="contained"
                component="label"
                className="form-control"
              >
                <CloudUploadIcon fontSize="large" />

                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  multiple
                  onChange={handleUpload}
                  hidden
                  disabled={imageView.length === 4}
                />
              </Button>
            </Grid>
            <Grid xs={12} md={8} ml={4}>
              {" "}
              <Typography>Image-Smaller than 2MB</Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {imageView.map((item, index) => {
              return (
                <>
                  {" "}
                  <Grid item md={4} display="flex">
                    <img
                      src={item}
                      alt=""
                      style={{ width: 150, height: 150 }}
                    />
                  </Grid>
                  <Button
                    type="button"
                    onClick={() => deleteFile(index)}
                    sx={{ marginLeft: -3, marginTop: -16, color: "red" }}
                  >
                    X
                  </Button>
                </>
              );
            })}
          </Box>
        </Box>
        <Grid item textAlign="right">
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            <strong>Submit</strong>
          </Button>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        maxWidth={800}
        open={imageViewOpen}
        setOpen={setImageViewOpen}
      >
        {" "}
        {fileURL.map((item, index) => {
          return (
            <>
              <Grid container xs={12} md={6}>
                <img src={item} style={{ height: 200, width: 200 }}></img>
              </Grid>
            </>
          );
        })}
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/EventMaster/Event/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default EventCreationIndex;
