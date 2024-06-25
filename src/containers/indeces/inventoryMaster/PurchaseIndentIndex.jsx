import { useState, useEffect } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../../components/CustomModal";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
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
  const [values, setValues] = useState({ ledgerId: null });

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
    { field: "vendor", headerName: "Vendor", flex: 1 },
    { field: "vendorContactNo", headerName: "Vendor Contact no", flex: 1 },
    { field: "createdUserName", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
          : "Na",
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
      <Box sx={{ position: "relative", mt: 2 }}>
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
