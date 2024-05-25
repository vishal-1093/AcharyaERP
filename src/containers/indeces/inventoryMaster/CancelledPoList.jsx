import { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { HighlightOff } from "@mui/icons-material";
import axios from "../../../services/Api";
import moment from "moment";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PrintIcon from "@mui/icons-material/Print";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

function CancelledPoList() {
  const [rows, setRows] = useState([]);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

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
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
    },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    { field: "poNo", headerName: "Po No", flex: 1 },
    { field: "amount", headerName: "Po Amount", flex: 1 },
    { field: "poType", headerName: "Po Type", flex: 1, hide: true },
    { field: "institute", headerName: "Institute" },
  ];

  useEffect(() => {
    getData();
  }, []);

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
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const getData = async () => {
    await axios
      .get(`/api/purchase/getCancelledDraftPurchaseOrder`)
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

export default CancelledPoList;
