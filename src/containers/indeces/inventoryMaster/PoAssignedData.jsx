import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  tableCellClasses,
  styled,
  Button,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate, useParams } from "react-router-dom";
import { HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import PrintIcon from "@mui/icons-material/Print";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function PoAssignedData() {
  const [rows, setRows] = useState([]);
  const [approverOpen, setApproverOpen] = useState(false);

  const [rowData, setRowData] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    // { field: "bookName", headerName: "End User", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.createdDate).format("DD-MM-YYYY"),
    },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    {
      field: "Print",
      headerName: "Print PO",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(`/DirectPoPdf/${params.row.temporaryPurchaseOrderId}`)
            }
          >
            <PrintIcon fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "Cancel_po",
      headerName: "Cancel PO",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleCancelPo(params)}>
            <HighlightOff fontSize="small" color="error" />
          </IconButton>
        );
      },
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/DirectPoCreation/Update/${params.row.temporaryPurchaseOrderId}`
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "purchase_approver",
      headerName: "Purchase Approver",
      flex: 1,
      renderCell: (params) => [
        <Typography variant="subtitle2">
          {params.row.purchaseApprover}
        </Typography>,
      ],
    },
    {
      field: "approve",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => [
        <IconButton onClick={() => handleApprove(params)}>
          <AddTaskIcon fontSize="small" color="primary" />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const handleCancelPo = (params) => {
    const handleToggle = async () => {
      await axios
        .delete(
          `/api/purchase/cancelDraft?temporaryPurchaseOrderId=${params.row.temporaryPurchaseOrderId}&cancelById=${userId}`
        )
        .then((res) => {
          if (res.status === 200 || res.status === 210) {
            setAlertMessage({
              severity: "success",
              message: "Cancelled Successfully",
            });
            setAlertOpen(true);
            setModalOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => console.error(err));
    };
    setModalContent({
      title: "",
      message: "Are you sure you want to cancel this po ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
  };

  const handleApprove = async (params) => {
    setModalOpen(true);
    const handleToggle = async () => {
      await axios
        .put(
          `/api/purchase/approvedDraft?temporaryPurchaseOrderId=${params.row.temporaryPurchaseOrderId}&approverId=${userId}`
        )
        .then((res) => {
          if (res.status === 200 || res.status === 210) {
            setAlertMessage({
              severity: "success",
              message: "Approved Successfully",
            });
            setAlertOpen(true);
            setModalOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => console.error(err));
    };
    setModalContent({
      title: "",
      message: "Are you sure you want to approve this po ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const getData = async () => {
    const requestData = {
      createdDate: null,
      institute: null,
      pageNo: 0,
      pageSize: 10,
      vendor: null,
      approverId: userId,
    };

    await axios
      .post(`/api/purchase/getDraftPurchaseOrder`, requestData)
      .then((res) => {
        const rowId = res.data.data.content.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default PoAssignedData;
