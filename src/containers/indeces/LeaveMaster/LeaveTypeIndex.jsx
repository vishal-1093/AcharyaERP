import { useState, useEffect } from "react";
import { Box, Button, IconButton, CircularProgress, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";

function LeaveTypeIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [feetemplateId, setFeetemplateId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [fileUpload, setFileUpload] = useState();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const navigate = useNavigate();

  const handleUpload = (params) => {
    setFeetemplateId(params.row.id);
    setModalUploadOpen(true);
  };
  const update = async () => {
    setLoading(true);
    const dataArray = new FormData();
    dataArray.append("file", fileUpload);
    dataArray.append("fee_template_id", feetemplateId);
    await axios
      .post(`/api/finance/FeeTemplateUploadFile`, dataArray)
      .then((res) => {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: "File Uploaded",
        });
        setAlertOpen(true);
        navigate("/FeetemplateMaster", { replace: true });
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

  const columns = [
    { field: "leave_type", headerName: "Leave", flex: 1 },
    { field: "leave_type_short", headerName: " Short Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "is_attendance",
      headerName: "Leave Kitty",
      flex: 1,
      valueGetter: (params) => (params.row.is_attendance ? "Yes" : "No"),
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
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/LeaveMaster/LeaveTypes/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "upload",
      headerName: "Attachment",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.fee_template_path === null ? (
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => navigate(`/AttachmentView/${params.row.id}`)}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
        ),
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
        `/api/fetchAllLeaveTypeDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setFeetemplateId(id);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/LeaveType/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/activateLeaveType/${id}`)
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
        open={modalUploadOpen}
        setOpen={setModalUploadOpen}
        maxWidth={500}
        title="Upload File"
      >
        <Grid item xs={12} md={10}>
          <input
            type="file"
            onChange={(e) => setFileUpload(e.target.files[0])}
          />
        </Grid>
        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            size="small"
            style={{ borderRadius: 4 }}
            onClick={update}
            disabled={loading}
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/LeaveMaster/LeaveTypes/New")}
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
export default LeaveTypeIndex;
