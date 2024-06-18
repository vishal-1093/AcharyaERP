import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../../components/ModalWrapper";
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

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "indent_ticket", headerName: "Indent Ticket", flex: 1 },
    {
      field: "created_date",
      headerName: "Indent date ",
      flex: 1,
      valueGetter: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "requested_by_With_date",
      headerName: "Requested By ",
      flex: 1,
      valueGetter: (params) =>
        params.row.requested_by_With_date
          ? params.row.requested_by_With_date.split("-")[0]
          : "",
    },

    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.approver1_status === 0
          ? ""
          : moment(params.row.modified_date).format("DD-MM-YYYY"),
    },
    {
      field: "approver1_status",
      headerName: "Approver",
      flex: 1,
      valueGetter: (params) =>
        params.row.approver1_status === null
          ? "Pending"
          : params.row.StoreIndent_approver1_name,
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
    await axios(
      `/api/inventory/getApprovedStoreIndentRequestByIndentTicket?indentTicket=${params.row.indent_ticket}`
    )
      .then((res) => {
        const temp = [];
        res.data.data.map((obj) => {
          temp.push({
            StoreIndent_approver1_name: obj.StoreIndent_approver1_name,
            StoreIndent_approver2_name: obj.StoreIndent_approver2_name,
            approver1_date: obj.approver1_date,
            approver1_id: obj.approver1_id,
            approver1_remarks: obj.approver1_remarks,
            approver1_status: obj.approver1_status,
            approver2_status: obj.approver2_status,
            created_by: obj.created_by,
            created_date: obj.created_date,
            created_username: obj.created_username,
            designation_name: obj.designation_name,
            designation_short_name: obj.designation_short_name,
            emp_id: obj.emp_id,
            employee_name: obj.employee_name,
            env_item_id: obj.env_item_id,
            id: obj.id,
            closingStock: obj.closingStock.closingStock,
            indent_ticket: obj.indent_ticket,
            issued_status: obj.issued_status,
            stock_description: obj.stock_description,
            item_description: obj.item_description,
            measure_name: obj.measure_name,
            item_names: obj.ITEM_NAME,
            modified_date: obj.modified_date,
            modified_username: obj.modified_username,
            quantity: obj.quantity,
            remarks: obj.remarks,
            requested_by_With_date: obj.requested_by_With_date,
            stockIssue: "",
            availableQuantity: "",
          });
        });
        setValues(temp);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e, index) => {
    const updatedItems = [...values];
    const item = updatedItems[parseInt(index)];

    const newIssueQuantity = parseFloat(e.target.value);
    const newAvailableQuantity = parseFloat(item.closingStock);

    if (newIssueQuantity > newAvailableQuantity) {
      setErrors({ ...errors, [parseInt(index)]: true });
    } else if (newIssueQuantity < newAvailableQuantity) {
      setErrors({ ...errors, [parseInt(index)]: false });
    }

    if (e.target.name === "stockIssue") {
      values.map((obj, i) => {
        if (obj.stockIssue > obj.closingStock) {
          setAlertMessage({
            severity: "error",
            message: "Issue quantity cannot exceed available quantity",
          });
          setAlertOpen(true);
        }

        // setError("Issue quantity cannot exceed available quantity");
      });
    }
    setValues((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleIssue = async () => {
    const temp = [];

    const Ids = [];

    values.map((obj) => {
      Ids.push(obj.id);
      temp.push({
        store_indent_request_id: obj.id,
        indent_ticket: obj.indent_ticket,
        stock_description: obj.stock_description,
        quantity: obj.quantity,
        purpose: obj.purpose,
        requested_by: obj.requested_by,
        requested_date: obj.requested_date,
        purchase_status: obj.purchase_status,
        remarks: obj.remarks,
        approver1_id: obj.approver1_id,
        approver1_remarks: obj.approver1_remarks,
        approver1_date: obj.approver1_date,
        approver2_id: obj.approver2_id,
        approver2_remarks: obj.approver2_remarks,
        approver2_date: obj.approver2_date,
        approver1_status: obj.approver1_status,
        approver2_status: obj.approver2_status,
        item_id: obj.item_id,
        description: obj.description,
        others: obj.others,
        approver1_active: obj.approver1_active,
        approver2_active: obj.approver2_active,
        school_id: obj.school_id,
        dept_id: obj.dept_id,
        tag_id: obj.tag_id,
        draft_po_status: obj.draft_po_status,
        grn_date: obj.grn_date,
        expense_head_id: obj.expense_head_id,
        financial_year_id: obj.financial_year_id,
        purchase_request: obj.purchase_request,
        issued_status: obj.issued_status,
        ac_year_id: obj.ac_year_id,
        env_item_id: obj.env_item_id,
        item_assignment_id: obj.item_assignment_id,
        ledger_id: obj.ledger_id,
        measure_id: obj.measure_id,
        closingStock: obj.closingStock,
        emp_id: obj.emp_id,
        vendor_id: obj.vendor_id,
        issued_quantity: obj.stockIssue,
        created_date: obj.created_date,
        modified_date: obj.modified_date,
        created_by: obj.created_by,
        modified_by: obj.modified_by,
        active: true,
        created_username: obj.created_username,
        modified_username: obj.modified_username,
      });
    });

    await axios
      .put(`/api/inventory/updateStoreIndentRequest/${Ids.toString()}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Stock Issued" });
          setAlertOpen(true);
          setStockIssueOpen(false);
        } else {
          setAlertMessage({ severity: "error", message: "Error Occured" });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 8 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>

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
                    return (
                      <TableRow key={i}>
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
                          {obj.closingStock}
                        </TableCell>

                        <TableCell sx={{ textAlign: "center", width: "15%" }}>
                          <CustomTextField
                            name={"stockIssue"}
                            value={obj.stockIssue}
                            handleChange={(e) => handleChange(e, i)}
                            label=""
                          />
                          {errors[i] && (
                            <span style={{ color: "red" }}>
                              Issue quantity cannot exceed available quantity
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
