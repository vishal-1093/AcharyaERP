import { useState, useEffect, useRef } from "react";
import { Grid, Box, Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
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
import moment from "moment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
    height: 180,
    maxWidth: 260,
    margin: "auto",
    border: `3px dashed ${theme.palette.primary.main}`,
    borderRadius: 20,

    "&:hover, &.dragover": {
      opacity: 0.7,
    },
  },
  input: {
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  helperText: {
    color: "#555",
    fontSize: "0.85rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.75rem",
    },
  },
  labelText: {
    textAlign: "center",
    fontSize: "0.90rem",
    margin: "20px 10px 0 10px",
    "&:hover": {
      backgroundColor: "red",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "0.9rem",
      margin: "10px 5px 0 5px",
    },
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 350,
    margin: "auto !important",
    backgroundColor: "#e4e4ff",
    borderRadius: 10,
    borderLeft: `10px solid ${theme.palette.success.main}`,
    marginTop: "17px !important",
    padding: "0 10px",
  },
  fileName: {
    fontSize: "0.9rem",
    margin: "5px 0",
    overflow: "hidden",
  },
  fileSize: {
    fontSize: "0.8rem",
    margin: "5px 0",
  },
  error: {
    color: theme.palette.error.main,
    fontSize: "1rem",
    maxWidth: 350,
    margin: "10px auto",
    paddingLeft: 10,
  },
}));
function EventCreationIndex() {
  const [rows, setRows] = useState([]);
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [imageOpen, setImageUploadOpen] = useState(false);
  const [rowData, setRowData] = useState();
  const [fileURL, setfileURL] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [file, setFile] = useState();
  const [imageView, setImageView] = useState([]);
  const [fileSelected, setFileSelected] = useState([]);

  const classes = useStyles();
  const navigate = useNavigate();

  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

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
    {
      field: "additional",
      headerName: "Additional Requirement",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton>
            <AddCircleOutlineIcon fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
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
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
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
          <CloudUploadOutlinedIcon fontSize="small" />
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
          <VisibilityIcon fontSize="small" />
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
        `/api/institute/fetchAllEventCreation?page=${0}&page_size=${10000}&sort=created_date`
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
    const s = fileSelected.filter((item, index) => index !== e);
    setFileSelected(s);
  };

  const handleUpload = (e) => {
    setFile(e.target.files);
    setImageView([...imageView, URL.createObjectURL(e.target.files[0])]);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    for (let i = 0; i < fileSelected.length; i++) {
      formData.append(`file[${i}]`, fileSelected[0]);
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

  const uploadMultiFiles = (e) => {
    const files = Array.from(e.target.files);
    setFileSelected(files);
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
        maxWidth={1700}
        open={imageOpen}
        setOpen={setImageUploadOpen}
        title="Upload Images"
      >
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} align="center">
            <div
              className={classes.dropFileInput}
              ref={wrapperRef}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                type="file"
                onChange={uploadMultiFiles}
                className={classes.input}
                multiple
              />
              <CloudUploadIcon sx={{ color: "auzColor.main", fontSize: 50 }} />
              {/* <p className={classes.helperText}>{helperText}</p> */}
              <p className={classes.labelText}>
                Drop your
                <span style={{ fontWeight: 500, fontSize: "0.90rem" }}>
                  {"  " + "files" + "  "}
                </span>
                here or
                <span style={{ color: "auzColor.main", fontWeight: 500 }}>
                  {" "}
                  browse
                </span>
              </p>
            </div>
          </Grid>

          {fileSelected.map((file, index) => {
            return (
              <>
                <Grid item xs={12} md={2.6}>
                  <img
                    style={{ width: 200, height: 150 }}
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="..."
                  />
                </Grid>
                <Typography
                  variant="subtitle2"
                  onClick={() => deleteFile(index)}
                  sx={{
                    marginLeft: -2,
                    marginTop: -17,
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  X
                </Typography>
              </>
            );
          })}
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        maxWidth={800}
        open={imageViewOpen}
        setOpen={setImageViewOpen}
      >
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
