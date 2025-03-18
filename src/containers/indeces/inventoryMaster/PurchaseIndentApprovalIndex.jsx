import { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function PurchaseIndentIndex() {
  const [values, setValues] = useState({ ticketStatus: "" });
  const [rows, setRows] = useState([]);
  const [ticketStatusOpen, setTicketStatusOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
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
    { field: "ledger_name", headerName: "Total Value", flex: 1, hide: true },
    { field: "vendorName", headerName: "Vendor", flex: 1 },
    { field: "vendorContactNo", headerName: "Vendor No.", flex: 1 },
    { field: "createdUserName", headerName: "Created By", flex: 1 },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/purchaseIndent/getAllPurchaseIndentForApproval?approverId=${userId}`
      )
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
          approvedDate: new Date(),
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
          <Grid item xs={12} md={6}>
            <CustomRadioButtons
              name="ticketStatus"
              value={values.ticketStatus}
              items={[
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
