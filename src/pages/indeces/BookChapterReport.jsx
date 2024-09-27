import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import EditIcon from "@mui/icons-material/Edit";
import { Check, HighlightOff, LockResetRounded } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Grid,
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TableHead,
  styled,
  tableCellClasses,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
const CustomTextField = lazy(() =>
  import("../../components/Inputs/CustomTextField.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker.jsx")
);

const empId = sessionStorage.getItem("empId");

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  remark: "",
  followUpDate: "",
  loading: false,
};

function BookChapterReport() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [{ remark, loading, followUpDate }, setState] = useState(initialState);
  const navigate = useNavigate();

  const columns = [
    {
      field: "",
      headerName: "Application Status",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleIncentive(params)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    { field: "book_title", headerName: "Book title", flex: 1 },
    { field: "authore", headerName: "Author Name", flex: 1 },
    { field: "publisher", headerName: "Publisher", flex: 1 },
    { field: "published_year", headerName: "Published Year", flex: 1 },
    { field: "isbn_number", headerName: "ISBN No.", flex: 1 },

    { field: "doi", headerName: "DOI", flex: 1 },
    { field: "created_username", headerName: "Unit", flex: 1 },
    {
      field: "attachment_path",
      type: "actions",
      flex: 1,
      headerName: "View",
      getActions: (params) => [
        params.row.attachment_path ? (
          <IconButton
            onClick={() => handleDownload(params.row.attachment_path)}
            sx={{ padding: 0 }}
          >
            <VisibilityIcon
              fontSize="small"
              color="primary"
              sx={{ cursor: "pointer" }}
            />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Remark",
      getActions: (params) => [
        <IconButton onClick={() => handleRemark(params)} sx={{ padding: 0 }}>
          <NoteAddIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: "pointer" }}
          />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/bookChapterDetailsBasedOnEmpId/843`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/bookChapterFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleIncentive = (params) => {
    navigate("/addon-incentive-application");
  };

  const handleRemark = (params) => {
    setModalOpen(!modalOpen);
    console.log("params====", params);
  };

  const handleDatePicker = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = () => {
    console.log("submit====");
  };

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={500}
        title={"Follow Up"}
      >
        <Box p={1}>
          <Grid container>
            <Grid item xs={12}>
              <CustomTextField
                name="remark"
                label="Follow Up Remark"
                value={remark || ""}
                handleChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <CustomDatePicker
                name="followUpDate"
                label="Follow Up Date"
                value={followUpDate || ""}
                handleChangeAdvance={handleDatePicker}
                required
              />
            </Grid>
            <Grid mt={2} item xs={12} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default BookChapterReport;
