import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { HighlightOff } from "@mui/icons-material";
import axios from "../../../services/Api";
import moment from "moment";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PrintIcon from "@mui/icons-material/Print";
import CustomModal from "../../../components/CustomModal";

function AllPoList() {
  const [rows, setRows] = useState([]);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

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
    {
      field: "Print",
      headerName: "Print PO",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => navigate(`/PoPdf/${params.row.purchaseOrderId}`)}
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
        <IconButton
          onClick={() => navigate(`/Poupdate/${params.row.purchaseOrderId}`)}
        >
          <EditIcon fontSize="small" color="primary" />
        </IconButton>,
      ],
    },

    {
      field: "GRN",
      headerName: "Create GRN",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => navigate(`/CreateGrn/${params.row.purchaseOrderId}`)}
          >
            <AddCircleOutlineRoundedIcon fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },

    {
      field: "cancel",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => navigate(`/PoPdf/${params.row.purchaseOrderId}`)}
          >
            <HighlightOff fontSize="small" color="error" />
          </IconButton>
        );
      },
    },
  ];

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
    };

    await axios
      .post(`/api/purchase/getPurchaseOrder`, requestData)
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

export default AllPoList;
