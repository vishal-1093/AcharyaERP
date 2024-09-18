import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff, Visibility } from "@mui/icons-material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Edit from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import LinkIcon from "@mui/icons-material/Link";
import ModalWrapper from "../../../components/ModalWrapper";
import QRCode from "react-qr-code";

function FeePaymentWindowIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrData, setQrData] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const domainUrl = window.location.port
    ? window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port
    : window.location.protocol + "//" + window.location.hostname;

  const columns = [
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    },
    { field: "window_type", headerName: "Type", flex: 1 },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.from_date).format("DD-MM-YYYY"),
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      valueGetter: (params) => moment(params.row.to_date).format("DD-MM-YYYY"),
    },
    { field: "voucher_head", headerName: "Fee Head", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "fixed_status",
      headerName: "Fixed Status",
      flex: 1,
      valueGetter: (params) => (params.row.fixed ? "Yes" : "No"),
    },
    {
      field: "qrCode",
      headerName: "QR Code",
      flex: 1,
      renderCell: (params) =>
        params.row.external_status ? (
          <IconButton onClick={() => handleOpenQr(params)}>
            <QrCodeScannerIcon />
          </IconButton>
        ) : (
          params.row.externalStatus
        ),
    },
    {
      field: "externalStatus",
      headerName: "Link",
      flex: 1,
      renderCell: (params) =>
        params.row.external_status ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              {params.row.external_status}
            </Typography>
            <Tooltip title="Copy">
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(
                    domainUrl + "/ExternalPayment/" + params.row.id
                  );
                  setOpen(true);
                }}
                sx={{ padding: 0 }}
              >
                <LinkIcon sx={{ color: "auzColor.main", fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          params.row.externalStatus
        ),
    },
    { field: "username", headerName: "Employee", flex: 1 },
    {
      field: "view",
      type: "actions",
      headerName: "View",
      flex: 1,
      getActions: (params) => [
        params.row.attachment_path ? (
          <IconButton onClick={() => handleView(params)}>
            <Visibility fontSize="small" />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "edit",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/fee-payment-window-update/${params.row.id}`)
          }
        >
          <Edit />
        </IconButton>,
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
    await axios(
      `/api/finance/fetchAllFeePaymentWindow?page=${0}&page_size=${10000}&sort=created_by`
    )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/ReferenceBooks/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateReferenceBooks/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
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

  const handleView = async (params) => {
    await axios
      .get(
        `/api/finance/feePaymentWindowFileviews?fileName=${params.row.attachment_path}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      });
  };

  const handleOpenQr = (params) => {
    setQrOpen(true);
    setQrData(params.row);
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
        title="Payment QR Code"
        maxWidth={380}
        open={qrOpen}
        setOpen={setQrOpen}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} align="center">
            <QRCode
              value={domainUrl + "/ExternalPayment/" + qrData.id}
              size={150}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 7 }}>
        <Button
          onClick={() => navigate("/fee-payment-window")}
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

export default FeePaymentWindowIndex;
