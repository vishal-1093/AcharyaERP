import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, IconButton, Grid, CircularProgress } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Check, HighlightOff } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditOffIcon from "@mui/icons-material/EditOff";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";

function FeetemplateApprovalIndex() {
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
    { field: "fee_template_name", headerName: " Name", flex: 1 },
    { field: "ac_year", headerName: " AC Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "program_type_name", headerName: "Term Type" },
    {
      field: "fee_admission_category_short_name",
      headerName: "Category",
    },
    {
      field: "fee_admission_sub_category_name",
      headerName: "Sub-Category",
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
      field: "view",
      type: "actions",
      flex: 1,
      headerName: "Template",
      getActions: (params) => [
        <IconButton
          onClick={() => navigate(`/ViewFeetemplateSubAmount/${params.row.id}`)}
          color="primary"
        >
          <VisibilityIcon />
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
          <IconButton onClick={() => handleUpload(params)} color="primary">
            <CloudUploadIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() =>
              navigate(`/FeetemplateAttachmentView/${params.row.id}`)
            }
            color="primary"
          >
            <CloudDownloadIcon />
          </IconButton>
        ),
      ],
    },

    {
      field: "history",
      type: "actions",
      flex: 1,
      headerName: "History",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/FeetemplateSubAmountHistory/${params.row.id}`)
          }
          color="primary"
        >
          <HistoryIcon />
        </IconButton>,
      ],
    },

    {
      field: "updatesubamount",
      type: "actions",
      flex: 1,
      headerName: "Subamount",
      getActions: (params) => [
        params.row.approved_status ? (
          <IconButton color="primary">
            <EditOffIcon />
          </IconButton>
        ) : (
          <>
            {params.row.active === false ? (
              <IconButton style={{ color: "red" }}>
                <HighlightOff />
              </IconButton>
            ) : (
              <IconButton
                onClick={() =>
                  navigate(
                    `/FeetemplateMaster/EditFeetemplateSubAmount/${params.row.id}`
                  )
                }
                color="primary"
              >
                <EditIcon />
              </IconButton>
            )}
          </>
        ),
      ],
    },
    {
      field: "update",
      type: "actions",
      flex: 1,
      headerName: "Template",
      getActions: (params) => [
        params.row.approved_status ? (
          <IconButton color="primary">
            <EditOffIcon />
          </IconButton>
        ) : (
          <>
            {params.row.active === true ? (
              <IconButton
                onClick={() =>
                  navigate(
                    `/FeetemplateMaster/Feetemplate/Update/${params.row.id}`
                  )
                }
                color="primary"
              >
                <EditIcon />
              </IconButton>
            ) : (
              <IconButton style={{ color: "red" }}>
                <HighlightOff />
              </IconButton>
            )}
          </>
        ),
      ],
    },
    {
      field: "approval",
      headerName: "Approve Template",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.approved_status ? (
          <IconButton color="primary">
            <CheckCircleIcon />
          </IconButton>
        ) : (
          <>
            {params.row.active === false ? (
              <IconButton style={{ color: "red" }}>
                <HighlightOff />
              </IconButton>
            ) : (
              <IconButton
                onClick={() =>
                  navigate(`/FeetemplateApproval/${params.row.id}`)
                }
                color="primary"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </>
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
    {
      field: "edit",
      headerName: "Action",
      type: "actions",
      getActions: (params) => [
        params.row.approved_status ? (
          <IconButton
            onClick={() => handleEditSubamount(params)}
            color="primary"
          >
            <LockIcon />
          </IconButton>
        ) : (
          <IconButton color="primary">
            <LockOpenRoundedIcon />
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
        `/api/finance/fetchFeeTemplateDetail?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
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

  const handleEditSubamount = (params) => {
    const id = params.row.id;
    const handleTogg = async () => {
      if (params.row.approved_status === true) {
        await axios
          .delete(`/api/finance/activateApproveFeeTemplate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    if (params.row.approved_status === true) {
      setModalContent({
        title: "",
        message: "Give permission to Edit?",
        buttons: [
          { name: "Yes", color: "primary", func: handleTogg },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
    }

    setConfirmModal(true);
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/finance/FeeTemplate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/activateFeeTemplate/${id}`)
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

export default FeetemplateApprovalIndex;
