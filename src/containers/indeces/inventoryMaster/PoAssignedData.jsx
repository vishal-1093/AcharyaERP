import { useState, useEffect } from "react";
import { Box, IconButton, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import { HighlightOff, Visibility } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../services/Api";
import moment from "moment";
import DraftPoView from "../../../pages/forms/inventoryMaster/DraftPoView";
import ModalWrapper from "../../../components/ModalWrapper";
import AddTaskIcon from "@mui/icons-material/AddTask";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

function PoAssignedData() {
  const [rows, setRows] = useState([]);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [id, setId] = useState(null);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.createdDate).format("DD-MM-YYYY"),
    },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    {
      field: "Print",
      headerName: "Draft Po",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handlePreview(params)}>
            <Visibility fontSize="small" color="primary" />
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

  const handlePreview = (params) => {
    setModalPreview(true);
    setId(params.row.temporaryPurchaseOrderId);
  };

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
      message: "Are you sure you want to cancel this PO ?",
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
      message: "Are you sure you want to approve this PO ?",
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

export default PoAssignedData;
