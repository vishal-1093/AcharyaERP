import { useState, useEffect } from "react";
import { Box, Button, Grid, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

function PurchaseIndentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [legderOptions, setLegderOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getLedgerOptions();
  }, []);

  const getLedgerOptions = async () => {
    await axios
      .get(`/api/finance/Ledger`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ledger_id,
            label: obj.ledger_name,
          });
        });
        setLegderOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "itemDescription", headerName: "Item", flex: 1 },
    { field: "quantity", headerName: "Qty", flex: 1 },
    { field: "approxRate", headerName: "Approx rate", flex: 1 },
    { field: "ledger_name", headerName: "Total Value", flex: 1 },
    { field: "vendorName", headerName: "Vendor", flex: 1 },
    { field: "vendorContactNo", headerName: "Vendor Contact no", flex: 1 },
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
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/purchaseIndent/getAllPurchaseIndent`)
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

export default PurchaseIndentIndex;
