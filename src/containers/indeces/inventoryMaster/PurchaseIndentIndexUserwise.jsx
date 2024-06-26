import { useState, useEffect } from "react";
import { Box, Button, Grid, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import { Visibility } from "@mui/icons-material";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function PurchaseIndentIndexUserwise() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "indentNo", headerName: "Indent No", flex: 1 },
    { field: "itemDescription", headerName: "Item", flex: 1 },
    { field: "quantity", headerName: "Qty", flex: 1 },
    { field: "approxRate", headerName: "Approx rate", flex: 1 },
    { field: "totalValue", headerName: "Total Value", flex: 1 },
    { field: "vendorName", headerName: "Vendor", flex: 1 },
    { field: "vendorContactNo", headerName: "Vendor No.", flex: 1 },
    { field: "createdUserName", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.createdDate
          ? moment(params.row.createdDate).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "view",
      headerName: "View",
      flex: 1,
      renderCell: (params) => [
        <IconButton>
          <Visibility fontSize="small" color="primary" />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/purchaseIndent/getAllPurchaseIndentByUserId?userId=${userId}`)
      .then((Response) => {
        const rowId = Response.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId.reverse());
      })
      .catch((err) => console.error(err));
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
      <Box sx={{ position: "relative", mt: 4 }}>
        <Button
          onClick={() => navigate("/PurchaseIndent")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -25, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <Grid
          container
          justifycontents="flex-start"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12}>
            <GridIndex rows={rows} columns={columns} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PurchaseIndentIndexUserwise;
