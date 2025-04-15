import { useState, useEffect } from "react";
import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { HighlightOff, Visibility } from "@mui/icons-material";
import axios from "../../../services/Api";
import moment from "moment";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PrintIcon from "@mui/icons-material/Print";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";
import { validateDate } from "@mui/x-date-pickers/internals";
import ModalWrapper from "../../../components/ModalWrapper";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const modalPrintContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  printModalOpen: false,
  modalPrintContent: modalPrintContents,
};

function AllPoList() {
  const [rows, setRows] = useState([]);
  const [poData, setPoRows] = useState([]);
  const [{ printModalOpen, modalPrintContent }, setState] = useState([initialState]);
  const [modalPreview, setModalPreview] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const onPrint = (rowValue) => {
    setPrintModalOpen();
    setModalContentPrint("", "Do you want to print on physical letter head?", [
      { name: "Yes", color: "primary", func: () => printPo(rowValue, true) },
      { name: "No", color: "primary", func: () => printPo(rowValue, false) },
    ]);
  };

  const printPo = async (rowValue, status) => {
    navigate(`/PoPdf/${rowValue.purchaseOrderId}`, { state: { letterHeadStatus: status } })
  };

  const setPrintModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      printModalOpen: !printModalOpen,
    }));
  };

  const setModalContentPrint = (title, message, buttons) => {
    setState((prevState) => ({
      ...prevState,
      modalPrintContent: {
        ...prevState.modalPrintContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const handlePreview = (id) => {
    setModalPreview(true);
    getPoData(id)
  };

  const columns = [
    { field: "institute", headerName: "Institute" },
    {
      field: "approvedDate",
      headerName: "Approved Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.approvedDate).format("DD-MM-YYYY"),
    },
    {
      field: "approverName",
      headerName: "Approver By",
      flex: 1,
    },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    { field: "poNo", headerName: "Po No", flex: 1 },
    {
      field: "amount",
      headerName: "Po Amount",
      headerAlign: "right",
      align: "right",
      flex: 1,
      valueGetter: (value, row) =>
        row.amount ? Math.round(row.amount) : "",
    },
    { field: "requestType", headerName: "Po Type", flex: 1, hide: true },
    { field: "institute", headerName: "Institute" },
    {
      field: "Print",
      headerName: "Print PO",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            // onClick={() => navigate(`/PoPdf/${params.row.purchaseOrderId}`)}
            onClick={() => onPrint(params.row)}
          >
            <PrintIcon fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },

    {
      field: "Amend",
      type: "actions",
      flex: 1,
      headerName: "Amend Po",
      getActions: (params) => [
        params.row.grnCreationStatus ? (
          <Typography variant="subtitle2">GRN Created</Typography>
        ) : (
          <IconButton
            onClick={() => navigate(`/Poupdate/${params.row.purchaseOrderId}`)}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        ),
      ],
    },

    {
      field: "GRN",
      headerName: "Create GRN",
      flex: 1,
      renderCell: (params) => {
        const { grnCreationStatus, status, purchaseOrderId } = params.row;

        if (grnCreationStatus !== null && status === "COMPLETED") {
          return (
            <IconButton onClick={() => handlePreview(purchaseOrderId)}>
              <Visibility fontSize="small" color="primary" />
            </IconButton>
          );
        }

        const iconColor = (status === "PENDING" && grnCreationStatus !== null) ? "#fbc02d" : "#43a047";

        return (
          <IconButton onClick={() => navigate(`/CreateGrn/${purchaseOrderId}`)}>
            <AddCircleOutlineRoundedIcon fontSize="small" sx={{ color: iconColor }} />
          </IconButton>
        );
      },
    },


    {
      field: "cancel",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) => {
        if (params.row.grnCreationStatus) {
          return <Typography variant="subtitle2">GRN Created</Typography>;
        } else {
          return (
            <IconButton onClick={() => handleCancelPo(params)}>
              <HighlightOff fontSize="small" color="error" />
            </IconButton>
          );
        }
      },
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getPoData = async (id) => {
    await axios
      .get(`/api/purchase/getPurchaseOrderById?id=${id}`)
      .then((res) => {
        setPoRows(res?.data?.data?.purchaseOrder?.purchaseItems);
      })
      .catch((error) => console.error(error));
  };


  const handleCancelPo = (params) => {
    setModalOpen(true);
    const handleToggle = async () => {
      await axios
        .delete(
          `/api/purchase/rejectPurchaseOrder?purchaseOrderId=${params.row.purchaseOrderId}&cancelById=${userId}`
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
        { name: "No", color: "primary", func: () => { } },
      ],
    });
  };

  const getData = async () => {
    const requestData = {
      pageNo: 0,
      pageSize: 100000,
      createdDate: null,
      institute: null,
      vendor: null,
    };

    await axios
      .post(`/api/purchase/getPurchaseOrder`, requestData)
      .then((res) => {
        const rowId = res.data.data.content.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId?.reverse());
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      {!!printModalOpen && (
        <CustomModal
          open={printModalOpen}
          setOpen={setPrintModalOpen}
          title={modalPrintContent.title}
          message={modalPrintContent.message}
          buttons={modalPrintContent.buttons}
        />
      )}
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
      <ModalWrapper title={`GRN Details`} maxWidth={1200} open={modalPreview} setOpen={setModalPreview}>
        <Grid container justifyContent="center" alignItems="center" marginTop={2}>
          <TableContainer component={Paper} sx={{ maxHeight: 500, borderRadius: 2, boxShadow: 3 }}>
            <Table stickyHeader size="small" aria-label="modern styled table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  {[
                    'Item Name',
                    'Quantity',
                    'Rate',
                    'Total Amount',
                    'Unit',
                    'Make',
                    'Serial No',
                    'Available',
                    'Issued',
                    'Description'
                  ].map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'primary.main',
                        color: '#ffffff',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {poData?.map((item, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f0f8ff',
                        transition: '0.3s',
                      },
                      borderRadius: 2,
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{item.itemName}</TableCell>
                    <TableCell>{item.quantity ?? 0}</TableCell>
                    <TableCell>₹{item.rate ?? 0}</TableCell>
                    <TableCell>₹{item.totalAmount ?? 0}</TableCell>
                    <TableCell>{item.measureShortName}</TableCell>
                    <TableCell>{item.envItemsInStoresId?.make}</TableCell>
                    <TableCell>{item.envItemsInStoresId?.item_serial_no}</TableCell>
                    <TableCell>{item.balanceQuantity ?? 0}</TableCell>
                    <TableCell>{item.quantity ?? 0}</TableCell>
                    <TableCell>{item.envItemsInStoresId?.item_description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </ModalWrapper>


    </>
  );
}

export default AllPoList;
