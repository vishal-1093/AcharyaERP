import { useState, useEffect } from "react";
import { Grid, Box, Button, IconButton } from "@mui/material";
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
import dayjs from "dayjs";
import { convertTimeToString } from "../../../utils/DateTimeUtils";

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
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState([]);

  const classes = useStyles();
  const navigate = useNavigate();

  const handleAddStudent = async (params) => {
    setStudentsOpen(true);
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
          onClick={() => handleAddStudent(params)}
        >
          <CloudUploadOutlinedIcon />
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

  const uploadSingleFile = (e) => {
    setFile([...file, URL.createObjectURL(e.target.files[0])]);
    console.log("file", file);
  };

  const upload = (e) => {
    e.preventDefault();
    console.log(file);
  };

  const deleteFile = (e) => {
    const s = file.filter((item, index) => index !== e);
    setFile(s);
    console.log(s);
  };

  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? " AM" : " PM";
      time[0] = +time[0] % 12 || 12;
    }
    return time.join("");
  }

  const getData = async () => {
    await axios
      .get(
        `/api/institute/fetchAllEventCreation?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      });
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
        open={studentsOpen}
        setOpen={setStudentsOpen}
      >
        <Box sx={{ display: "flex" }}>
          <Grid container md={4} className={classes.dropFileInput}>
            <Button variant="contained" component="label">
              <CloudUploadIcon fontSize="large" />
              <input
                type="file"
                value={values.imgFile}
                disabled={file.length === 10}
                className="form-control"
                onChange={uploadSingleFile}
                hidden
              />
            </Button>
            <Button
              type="button"
              className="btn btn-primary btn-block"
              onClick={upload}
            >
              Upload
            </Button>
          </Grid>

          {file.map((item, index) => {
            return (
              <>
                <Grid item display="flex-start">
                  <img src={item} alt="" style={{ width: 150, height: 150 }} />
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
        <Grid item textAlign="right">
          <Button
            style={{ borderRadius: 7 }}
            variant="contained"
            color="primary"
            onClick={() => setStudentsOpen(false)}
          >
            <strong>{"Submit"}</strong>
          </Button>
        </Grid>
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
