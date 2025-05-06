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

const PoView = lazy(() =>
  import("../../../pages/forms/inventoryMaster/PoView")
);
const GrnView = lazy(() =>
  import("../../../pages/forms/accountMaster/GrnView")
);

const AdvancePaymentVoucher = lazy(() =>
  import("../../../pages/forms/accountMaster/AdvancePaymentVoucher")
);

function AdvancePaymentVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [modalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [poWrapperOpen, setPoWrapperOpen] = useState(false);
  const [grnWrapperOpen, setGrnWrapperOpen] = useState(false);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);
  const [backDropLoading, setBackDropLoading] = useState(false);
  const [pvWrapperOpen, setPvWrapperOpen] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    grn_no: false,
    total: false,
  });

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("/api/purchase/getPurchaseOrderData");

      const filterRows = response.data.data.filter(
        (obj) => obj.accountPaymentType === "Advance" && !obj.payment_voucher_id
      );

      const rowId = filterRows.map((obj, i) => ({ ...obj, id: i + 1 }));

      setRows(rowId);
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

  const handleGrnView = async (data) => {
    setRowData(data);
    setGrnWrapperOpen(true);
  };

  const handlePaymentVoucher = async (data) => {
    setRowData(data);
    setPvWrapperOpen(true);
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
      field: "poReferenceNo",
      headerName: "PO No.",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          color="primary"
          onClick={() => handlePoView(params.row)}
          sx={{ cursor: "pointer" }}
        >
          {params.row.poReferenceNo}
        </Typography>
      ),
    },

    {
      field: "total",
      headerName: "GRN Amount",
      flex: 1,
      valueGetter: (value, row) => Math.round(value),
    },
    {
      field: "poTotalAmount",
      headerName: "Po Amount",
      flex: 1,
      valueGetter: (value, row) => Math.round(value),
    },

    { field: "vendor", headerName: "Vendor", flex: 1 },
    { field: "institute", headerName: "School", flex: 1, hide: true },
    // {
    //   field: "attachmentPath",
    //   headerName: "Attachment",
    //   flex: 1,
    //   renderCell: (params) =>
    //     params.row.attachmentPath ? (
    //       <IconButton
    //         onClick={() => handleAttachment(params.row.attachmentPath)}
    //       >
    //         <VisibilityIcon color="primary" />
    //       </IconButton>
    //     ) : (
    //       <></>
    //     ),
    // },

    {
      field: "payment-voucher",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) =>
        !params.row.draft_payment_voucher_id &&
        !params.row.payment_voucher_id ? (
          <IconButton onClick={() => handlePaymentVoucher(params.row)}>
            <AddBoxIcon color="primary" />
          </IconButton>
        ) : params.row.draft_payment_voucher_id &&
          !params.row.payment_voucher_id ? (
          <IconButton>
            <PendingActionsIcon color="primary" />
          </IconButton>
        ) : params.row.draft_payment_voucher_id &&
          params.row.payment_voucher_id ? (
          <IconButton
            onClick={() =>
              navigate(
                `/payment-voucher-pdf/${params.row.payment_voucher_id}`,
                {
                  state: { advancePdfStatus: true },
                }
              )
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
      ></ModalWrapper>

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
        open={pvWrapperOpen}
        setOpen={setPvWrapperOpen}
        maxWidth={1500}
      >
        <AdvancePaymentVoucher rowData={rowData} />
      </ModalWrapper>

      <GridIndex
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        setColumnVisibilityModel={setColumnVisibilityModel}
      />
    </>
  );
}

export default AdvancePaymentVoucherIndex;
