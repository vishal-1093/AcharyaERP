import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Backdrop,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import ModalWrapper from "../../components/ModalWrapper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const JournalGrnForm = lazy(() =>
  import("../forms/accountMaster/JournalGrnForm")
);
const PoView = lazy(() => import("../forms/inventoryMaster/PoView"));
const GrnView = lazy(() => import("../forms/accountMaster/GrnView"));
const DraftJournalView = lazy(() =>
  import("../forms/accountMaster/DraftJournalView")
);
const GrnPaymentVoucher = lazy(() =>
  import("../forms/accountMaster/GrnPaymentVoucher")
);

function JournalGrnIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [modalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [poWrapperOpen, setPoWrapperOpen] = useState(false);
  const [grnWrapperOpen, setGrnWrapperOpen] = useState(false);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);
  const [pvWrapperOpen, setPvWrapperOpen] = useState(false);
  const [backDropLoading, setBackDropLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);

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
        (obj) => obj.accountPaymentType !== "Advance"
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

  const handlePoView = (data) => {
    setRowData(data);
    setPoWrapperOpen(true);
  };

  const handlePaymentVoucher = async (data) => {
    setRowData(data);
    setPvWrapperOpen(true);

    try {
      const response = await axios.get(
        `/api/finance/getJournalVoucherByVoucherNumber/${data?.journalVoucherNumber}/${data?.institute_id}/${data?.financialYearId}`
      );
      const filterRow = response.data.data.filter((obj) => obj.credit > 0);
      setPaymentData(filterRow);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Something went wrong.",
      });
      setAlertOpen(true);
    }
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
          onClick={() => handlePoView(params.row)}
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
      field: "id",
      headerName: "Journal",
      flex: 1,
      renderCell: (params) =>
        params.row.journal_voucher_id ? (
          <IconButton
            onClick={() =>
              handleGeneratePdf(
                params.row.journalVoucherNumber,
                params.row.institute_id,
                params.row.financialYearId
              )
            }
          >
            <PrintIcon color="primary" />
          </IconButton>
        ) : params.row.draft_journal_voucher_id ? (
          <IconButton
            onClick={() => handleJournalView(params.row)}
            title="JV Pending"
          >
            <PendingActionsIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ) : (
          // <Typography
          //   variant="subtitle2"
          //   color="primary"
          //   onClick={() => handleJournalView(params.row)}
          //   sx={{ cursor: "pointer" }}
          // >
          //   Verification Pending
          // </Typography>
          <IconButton onClick={() => handleJournalVoucher(params.row)}>
            <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ),
    },
    {
      field: "payment-voucher",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) =>
        params.row.journal_voucher_id && !params.row.paymentVoucherId ? (
          <IconButton onClick={() => handlePaymentVoucher(params.row)}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : params.row.paymentVoucherId ? (
          <IconButton
            onClick={() =>
              navigate(`/payment-voucher-pdf/${params.row.paymentVoucherId}`, {
                state: { grnPdfStatus: true },
              })
            }
          >
            <PrintIcon color="primary" />
          </IconButton>
        ) : (
          ""
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
      >
        <JournalGrnForm
          rowData={rowData}
          getData={getData}
          setModalWrapperOpen={setModalWrapperOpen}
        />
      </ModalWrapper>

      <ModalWrapper
        open={poWrapperOpen}
        setOpen={setPoWrapperOpen}
        maxWidth={1000}
      >
        <PoView temporaryPurchaseOrderId={rowData?.purchase_order_id} />
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
      >
        <DraftJournalView draftJournalId={rowData.draft_journal_voucher_id} />
      </ModalWrapper>

      <ModalWrapper
        title="GRN Payment Voucher"
        open={pvWrapperOpen}
        setOpen={setPvWrapperOpen}
        maxWidth={1500}
      >
        <GrnPaymentVoucher
          setPoWrapperOpen={setPoWrapperOpen}
          paymentData={paymentData}
          data={rowData}
        />
      </ModalWrapper>

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default JournalGrnIndex;
