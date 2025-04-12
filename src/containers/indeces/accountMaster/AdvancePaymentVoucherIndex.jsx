import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import useAlert from "../../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Backdrop,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const DraftPoView = lazy(() =>
  import("../../../pages/forms/inventoryMaster/DraftPoView")
);
const GrnView = lazy(() =>
  import("../../../pages/forms/accountMaster/GrnView")
);

function AdvancePaymentVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [modalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [poWrapperOpen, setPoWrapperOpen] = useState(false);
  const [grnWrapperOpen, setGrnWrapperOpen] = useState(false);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);
  const [backDropLoading, setBackDropLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Payment Tracker" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("/api/purchase/indexPageForGrn", {
        params: { page: 0, page_size: 10000, sort: "created_date" },
      });
      const filterRows = response.data.data.Paginated_data.content.filter(
        (obj) => obj.accountPaymentType === "Advance"
      );
      setRows(filterRows);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleJournalVoucher = (data) => {
    setRowData(data);
    setModalWrapperOpen(true);
  };

  const handleJournalView = (data) => {
    setRowData(data);
    setJvWrapperOpen(true);
  };

  const handlePoView = () => {
    setPoWrapperOpen(true);
  };

  const handleGrnView = async (data) => {
    setRowData(data);
    setGrnWrapperOpen(true);
  };

  const handleAttachment = async (filePath) => {
    if (!filePath) return;
    try {
      setBackDropLoading(true);
      const response = await axios.get(
        `/api/purchase/grnFileDownload?fileName=${filePath}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Unable to open the file",
      });
      setAlertOpen(true);
    } finally {
      setBackDropLoading(false);
    }
  };

  const handleGeneratePdf = async (
    journalVoucherNumber,
    schoolId,
    fcYearId
  ) => {
    navigate(`/generate-journalvoucher-pdf/${journalVoucherNumber}`, {
      state: { grnIndexStatus: true, schoolId, fcYearId },
    });
  };

  const columns = [
    {
      field: "purchase_ref_no",
      headerName: "PO No.",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          color="primary"
          onClick={handlePoView}
          sx={{ cursor: "pointer" }}
        >
          {params.row.purchase_ref_no}
        </Typography>
      ),
    },
    {
      field: "grn_no",
      headerName: "GRN No.",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => handleGrnView(params.row)}
        >
          {params.row.grn_no}
        </Typography>
      ),
    },
    {
      field: "total",
      headerName: "GRN Amount",
      flex: 1,
      valueGetter: (value, row) => Math.round(value),
    },
    { field: "invoice_number", headerName: "Invoice No.", flex: 1 },
    { field: "vendor_name", headerName: "Vendor", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    {
      field: "attachmentPath",
      headerName: "Attachment",
      flex: 1,
      renderCell: (params) =>
        params.row.attachmentPath ? (
          <IconButton
            onClick={() => handleAttachment(params.row.attachmentPath)}
          >
            <VisibilityIcon color="primary" />
          </IconButton>
        ) : (
          <></>
        ),
    },

    {
      field: "payment-voucher",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(`/draft-payment-voucher`, {
              state: {
                advance_status: true,
                amount: params.row.total,
                schoolId: params.row.institute_id,
              },
            })
          }
        >
          <AddBoxIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <ModalWrapper
        open={modalWrapperOpen}
        setOpen={setModalWrapperOpen}
        maxWidth={1200}
        title={`${rowData?.grn_no} - Journal Voucher`}
      ></ModalWrapper>

      <ModalWrapper
        open={poWrapperOpen}
        setOpen={setPoWrapperOpen}
        maxWidth={1000}
      >
        <DraftPoView temporaryPurchaseOrderId="182" />
      </ModalWrapper>

      <ModalWrapper
        open={grnWrapperOpen}
        setOpen={setGrnWrapperOpen}
        maxWidth={1000}
      >
        <GrnView grnNo={rowData.grn_no} />
      </ModalWrapper>

      <ModalWrapper
        open={jvWrapperOpen}
        setOpen={setJvWrapperOpen}
        maxWidth={1000}
      ></ModalWrapper>

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default AdvancePaymentVoucherIndex;
