import { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function PurchaseIndentIndexUserwise() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  const columns = [
    { field: "indentNo", headerName: "Indent No", flex: 1 },
    {
      field: "createdDate",
      headerName: "Indent Date",
      flex: 1,
      type: "date",
      valueGetter: (value, row) =>
        row.createdDate
          ? moment(row.createdDate).format("DD-MM-YYYY")
          : "NA",
    },
    { field: "itemDescription", headerName: "Item", flex: 1 },
    { field: "quantity", headerName: "Qty", flex: 1 },
    { field: "approxRate", headerName: "Approx rate", flex: 1 },
    { field: "totalValue", headerName: "Total Value", flex: 1 },
    { field: "vendorName", headerName: "Vendor", flex: 1 },
    { field: "vendorContactNo", headerName: "Vendor No.", flex: 1 },
    { field: "status", headerName: "Ticket Status", flex: 1 },
    { field: "createdUserName", headerName: "Created By", flex: 1 },
    {
      field: "approverName",
      headerName: "Approver",
      flex: 1,
    },
    {
      field: "approvedDate",
      headerName: "Approved Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.approvedDate
          ? moment(row.approvedDate).format("DD-MM-YYYY")
          : "NA",
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
