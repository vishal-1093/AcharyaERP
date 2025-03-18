import { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function PurchaseIndentIndex() {
  const [values, setValues] = useState({ ticketStatus: "" });
  const [rows, setRows] = useState([]);
  const [ticketStatusOpen, setTicketStatusOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

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
    { field: "ledger_name", headerName: "Total Value", flex: 1, hide: true },
    { field: "vendorName", headerName: "Vendor", flex: 1 },
    { field: "vendorContactNo", headerName: "Vendor No.", flex: 1 },
    { field: "createdUserName", headerName: "Created By", flex: 1 },
    {
      field: "approverName",
      headerName: "Approved By",
      flex: 1,
      valueGetter: (value, row) =>
        row.status === "Approved" ? row.approverName : "Pending",
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/purchaseIndent/getAllPurchaseIndentbyStatus?status=Approved`)
      .then((Response) => {
        const rowId = Response.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId.reverse());
      })
      .catch((err) => console.error(err));
  };

  const handleTicketStatus = () => {
    if (selectedRows.length > 0) {
      setTicketStatusOpen(true);
    } else {
      setAlertMessage({
        severity: "error",
        message: "Please select the checkbox",
      });
      setAlertOpen(true);
    }
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setRowsData(selectedRowsData);
    setSelectedRows(selectedRowsData.map((obj) => obj.purchaseIndentId));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateTicketStatus = async () => {
    try {
      const payload = [];

      rowsData.forEach((obj) => {
        payload.push({
          purchaseIndentId: obj.purchaseIndentId,
          approverId: obj.approverId,
          status: values.ticketStatus,
        });
      });

      await axios.post(
        `/api/purchaseIndent/approveOrRejectPurchaseIndent`,
        payload
      );

      setAlertMessage({
        severity: "success",
        message: "Status Update",
      });
      setTicketStatusOpen(false);
      setAlertOpen(true);
      getData();
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "",
      });
      setTicketStatusOpen(false);
      setAlertOpen(true);
    }
  };

  return (
    <>
      <ModalWrapper
        title="Ticket Status"
        open={ticketStatusOpen}
        setOpen={setTicketStatusOpen}
        maxWidth={500}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={8}>
            <CustomRadioButtons
              name="ticketStatus"
              value={values.ticketStatus}
              items={[
                { value: "Goods received", label: "Goods received" },
                { value: "Order placed", label: "Order placed" },
              ]}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleUpdateTicketStatus}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 1 }}>
        <Button
          onClick={() => navigate("/PurchaseIndentHistory")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: 20, borderRadius: 2 }}
        >
          History
        </Button>
        <Grid
          container
          justifycontents="flex-start"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleTicketStatus}
            >
              Ticket Status
            </Button>
          </Grid>

          <Grid item xs={12}>
            <GridIndex
              rows={rows}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PurchaseIndentIndex;
