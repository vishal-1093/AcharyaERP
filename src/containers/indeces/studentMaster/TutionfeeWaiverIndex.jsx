import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, IconButton, Grid, CircularProgress } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Check, HighlightOff } from "@mui/icons-material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";

function TutionfeeWaiverIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [feetemplateId, setFeetemplateId] = useState(null);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();

  const columns = [
    { field: "student_name", headerName: " Name", flex: 1 },
    { field: "ac_year", headerName: " AC Year", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    {
      field: "total_amount",
      headerName: "Total Amount",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      hide: true,
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
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
      hide: true,
    },

    {
      field: "upload",
      headerName: "Attachment",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.tution_fee_waiver_attachment_path === null ? (
          <IconButton onClick={() => handleUpload(params)} color="primary">
            <CloudUploadOutlinedIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() =>
              navigate(`/TuitionfeeWaiverPdfView/${params.row.id}`)
            }
            color="primary"
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton>
        ),
      ],
    },

    {
      field: "approve",
      headerName: "Approval",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.approved_status === true ? (
          <IconButton
            color="primary"
            onClick={() =>
              navigate(`/TutionFeeView/${params.row.id}/${params.row.auid}`)
            }
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() =>
              navigate(
                `/TuitionfeeWaiverApprover/${params.row.id}/${params.row.auid}`
              )
            }
            color="primary"
          >
            <AddCircleOutlineIcon fontSize="small" />
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
            <Check fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff fontSize="small" />
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
        `/api/student/fetchAlltutionFeeWaiverDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

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
        if (pathname.toLowerCase() === "/feetemplateapprovalindex") {
          navigate("/FeetemplateApprovalIndex", { replace: true });
        } else {
          navigate("/FeetemplateMaster", { replace: true });
        }
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

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/student/deactivateTutionFeeWaiver/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/student/activateTutionFeeWaiver/${id}`)
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
    setConfirmModal(true);
  };

  return (
    <>
      <CustomModal
        open={confirmModal}
        setOpen={setConfirmModal}
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
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default TutionfeeWaiverIndex;
