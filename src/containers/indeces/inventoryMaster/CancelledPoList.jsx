import { useState, useEffect } from "react";
import { Box, IconButton, Grid } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import GridIndex from "../../../components/GridIndex";
import axios from "../../../services/Api";
import moment from "moment";
import CustomModal from "../../../components/CustomModal";
import ModalWrapper from "../../../components/ModalWrapper";
import DraftPoView from "../../../pages/forms/inventoryMaster/DraftPoView";
import { useNavigate } from "react-router-dom";

const modalPrintContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  printModalOpen: false,
  modalPrintContent: modalPrintContents,
};

function CancelledPoList() {
  const [rows, setRows] = useState([]);
  const [{ printModalOpen, modalPrintContent }, setState] = useState([initialState]);
  const navigate = useNavigate();

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [id, setId] = useState(null);

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
  const printPo = async (rowValue, status) => {
    navigate(`/PoPdf/${rowValue.purchaseOrderId}`, { state: { letterHeadStatus: status } })
  };

  const setPrintModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      printModalOpen: !printModalOpen,
    }));
  };

  const onPrint = (rowValue) => {
    setPrintModalOpen();
    setModalContentPrint("", "Do you want to print on physical letter head?", [
      { name: "Yes", color: "primary", func: () => printPo(rowValue, true) },
      { name: "No", color: "primary", func: () => printPo(rowValue, false) },
    ]);
  };

  const columns = [
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
    },
    { field: "vendor", headerName: "Vendor", flex: 1 },
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
            <Visibility fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
    // {
    //   field: "Print",
    //   headerName: "Draft PO",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton onClick={() => handlePreview(params)}>
    //         <Visibility fontSize="small" color="primary" />
    //       </IconButton>
    //     );
    //   },
    // },
    { field: "request_type", headerName: "Po Type", flex: 1, hide: true },
    { field: "institute", headerName: "Institute" },
    { field: "cancel_comments", headerName: "Cancel comments", flex: 1 },
    { field: "cancelleBy", headerName: "Cancelled By", flex: 1 },
  ];

  const handlePreview = (params) => {
    setModalPreview(true);
    setId(params.row.temporaryPurchaseOrderId);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const requestData = {
      pageNo: 0,
      pageSize: 100000,
      createdDate: null,
      institute: null,
      vendor: null,
      "sort": "created_date"
    };

    await axios
      .post(`api/purchase/getDeactivateApprovedPurchaseOrder`, requestData)
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
        {!!printModalOpen && (
          <CustomModal
            open={printModalOpen}
            setOpen={setPrintModalOpen}
            title={modalPrintContent.title}
            message={modalPrintContent.message}
            buttons={modalPrintContent.buttons}
          />
        )}
        <ModalWrapper
          maxWidth={900}
          open={modalPreview}
          setOpen={setModalPreview}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            marginTop={2}
          >
            <Grid item xs={12}>
              <DraftPoView temporaryPurchaseOrderId={id} />
            </Grid>
          </Grid>
        </ModalWrapper>
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

export default CancelledPoList;
