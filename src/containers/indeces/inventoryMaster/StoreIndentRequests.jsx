import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomModal from "../../../components/CustomModal";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Checkbox
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function StoreIndentRequests() {
  const [rows, setRows] = useState([]);
  const [stockIssueOpen, setStockIssueOpen] = useState(false);
  const [values, setValues] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "indent_ticket", headerName: "Indent Ticket", flex: 1 },
    {
      field: "created_date",
      headerName: "Indent date ",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "requested_by_With_date",
      headerName: "Requested By ",
      flex: 1,
      valueGetter: (value, row) =>
        row.requested_by_With_date
          ? row.requested_by_With_date.split("-")[0]
          : "",
    },

    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.approver1_status === 0
          ? ""
          : moment(row.modified_date).format("DD-MM-YYYY"),
    },
    {
      field: "approver1_status",
      headerName: "Approver",
      flex: 1,
      valueGetter: (value, row) =>
        row.approver1_status === null
          ? "Pending"
          : row.StoreIndent_approver1_name,
    },
    {
      field: "Stock Issue",
      headerName: "Stock Issue",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.approved_status !== 0 ? (
          <IconButton color="primary" onClick={() => handleStockIssue(params)}>
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "cancel_status",
      headerName: "Cancel",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        !params.row.cancel_status ?
          (<GridActionsCellItem
            icon={<HighlightOff />}
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleCancel(params)}
          >
          </GridActionsCellItem>)
          :
          (
            <>
              <Typography variant="pragraph">Cancelled</Typography>
            </>
          )
      ]
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/storeIndentRequestApprovedData?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleStockIssue = async (params) => {
    setStockIssueOpen(true);
    await axios
      .get(
        `/api/inventory/getApprovedStoreIndentRequestByIndentTicket?indentTicket=${params.row.indent_ticket}`
      )
      .then((res) => {
        const indentData = res.data.data.map((obj) => ({
          ...obj,
          stockIssue: "",
          availableQuantity: "",
        }));
        setValues(indentData);
      })
      .catch((err) => console.error(err));
  };

  const handleCancel = async (params) => {
    setModalOpen(false);
    const handleToggle = async () => {
      try {
        const res = await await axios
          .get(
            `/api/inventory/getApprovedStoreIndentRequestByIndentTicket?indentTicket=${params.row.indent_ticket}`
          )
        if (res.status === 200) {
          const Ids = res.data.data?.map((el) => el.id);
          let payload = res.data.data.map((ele) => ({ ...ele, cancel_status: true, requested_by: ele.requested_by, store_indent_request_id: ele.id }))
          const response = await axios.put(`/api/inventory/updateStoreIndentRequest/${Ids}`, payload)
          if (response.status === 200) {
            const historyResponse = await axios.post(`/api/inventory/storeIndentRequestHistory`, payload);
            if (historyResponse.status === 200 || historyResponse.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "Status updated successfully!!",
              });
              setAlertOpen(true);
              getData();
            }
          }
        }
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: "An error occured",
        });
        setAlertOpen(true);
      }
    };
    setModalContent({
      message: "Do you want to cancel this Indent ?",
      buttons: [
        { name: "Yes", func: handleToggle },
        { name: "No", func: () => { } },
      ],
    });
    setModalOpen(true);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedValue = parseFloat(value) || 0;
    const updatedItems = [...values];
    const item = updatedItems[index];
    const availableQty = parseFloat(item.quantity) || 0;

    const updatedData = values.map((obj, i) =>
      i === index ? { ...obj, [name]: value } : obj
    );
    setValues(updatedData);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: updatedValue > availableQty || updatedValue === 0,
    }));
  };


  const handleIssue = async () => {
    setErrors(() => ({}))
    const invalidRows = values.filter(
      (obj) => obj.selected && (!obj.stockIssue || Number(obj.stockIssue) === 0)
    );

    if (invalidRows.length > 0) {
      setAlertMessage({
        severity: "error",
        message: "Issue quantity cannot be empty or 0 when selected",
      });
      setAlertOpen(true);
      return;
    }

    const tempData = values
      .filter((obj) => obj.selected)
      .map(({ selected, ...rest }) => ({
        ...rest,
        issuedBy: userId,
        issueDate: moment(new Date()).format("YYYY-MM-DD"),
        purchase_status: 1,
        issued_quantity: rest.stockIssue,
        closingStock: rest.closingStock?.closingStock,
        store_indent_request_id: rest.id,
        active: true,
      }));

    const ids = values
      .filter((obj) => obj.selected)
      .map((obj) => obj.id);
    try {
      const res = await axios.put(
        `/api/inventory/updateStoreIndentRequest/${ids.toString()}`,
        tempData
      );

      if (res.status === 200 || res.status === 201) {
        setAlertMessage({ severity: "success", message: "Stock Issued" });
        setAlertOpen(true);
        setStockIssueOpen(false);
        navigate("/StockIssuePdf", { state: { values: tempData } });
      } else {
        setAlertMessage({ severity: "error", message: "Error Occurred" });
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err?.response?.data?.message || "Request failed",
      });
      setAlertOpen(true);
    }
  };

  const handleCheckboxChange = (e, index) => {
    const newValues = [...values];
    newValues[index].selected = e.target.checked;
    setValues(newValues);
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 1 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>

      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        title={"Stock Issue"}
        open={stockIssueOpen}
        setOpen={setStockIssueOpen}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell
                      sx={{ color: "white", textAlign: "center", width: "15%" }}
                    >
                      Item
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", textAlign: "center", width: "15%" }}
                    >
                      Item name
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", textAlign: "center", width: "15%" }}
                    >
                      UOM
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", textAlign: "center", width: "15%" }}
                    >
                      Requested Qty
                    </TableCell>

                    <TableCell
                      sx={{ color: "white", textAlign: "center", width: "15%" }}
                    >
                      Closing Stock
                    </TableCell>

                    <TableCell
                      sx={{ color: "white", textAlign: "center", width: "15%" }}
                    >
                      Stock Issue
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.map((obj, i) => {
                    const isStockInvalid = obj.selected && (!obj.stockIssue || Number(obj.stockIssue) === 0);
                    return (
                      <TableRow key={i}>
                        <TableCell sx={{ textAlign: "center", width: "10%" }}>
                          <Checkbox
                            checked={obj.selected || false}
                            onChange={(e) =>
                              handleCheckboxChange(e, i)
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", width: "15%" }}>
                          {obj.item_names}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", width: "15%" }}>
                          {obj.measure_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", width: "15%" }}>
                          {obj.quantity}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", width: "15%" }}>
                          {obj.closingStock?.closingStock}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", width: "15%" }}>
                          <CustomTextField
                            name={"stockIssue"}
                            type="number"
                            value={obj.stockIssue}
                            handleChange={(e) => handleChange(e, i)}
                            label=""
                          />
                          {errors[i] && (
                            <span style={{ color: "red" }}>
                              Issue quantity cannot exceed available quantity
                            </span>
                          )}
                          {isStockInvalid && (
                            <span style={{ color: "red" }}>
                              Issue quantity cannot be empty or 0 when selected
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} align="center">
            {/* {error ? "Issue quantity cannot exceed available quantity " : ""} */}
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleIssue}
              disabled={!values.some((item) => item.selected)}
            >
              Issue
            </Button>

          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
}

export default StoreIndentRequests;
