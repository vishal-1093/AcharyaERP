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
    await axios
      .get(
        `/api/inventory/getApprovedStoreIndentRequestByIndentTicket?indentTicket=${params.row.indent_ticket}`
      )
      .then((res) => {
        console.log(res.data.data);
        const indentData = res.data.data.map((obj) => ({
          ...obj,
          stockIssue: "",
          availableQuantity: "",
        }));
        setValues(indentData);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e, index) => {
    const updatedItems = [...values];

    const item = updatedItems[parseInt(index)];
    const newIssueQuantity = parseFloat(e.target.value);
    const newAvailableQuantity = parseFloat(item.quantity);

    if (newIssueQuantity > newAvailableQuantity) {
      setErrors({ ...errors, [parseInt(index)]: true });
    } else if (newIssueQuantity < newAvailableQuantity) {
      setErrors({ ...errors, [parseInt(index)]: false });
    }

    setValues((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleIssue = async () => {
    const Ids = [];
    const tempData = values.map((obj) => {
      Ids.push(obj.id);
      if (obj.stockIssue !== "") {
        return {
          ...obj,
          issuedBy: userId,
          issueDate: new Date(),
          purchase_status: 1,
          issued_quantity: obj.stockIssue,
          closingStock: obj.closingStock.closingStock,
          store_indent_request_id: obj.id,
          active: true,
        };
      }
    });

    await axios
      .put(
        `/api/inventory/updateStoreIndentRequest/${Ids.toString()}`,
        tempData
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Stock Issued" });
          setAlertOpen(true);
          setStockIssueOpen(false);
          navigate("/StockIssuePdf", { state: { values: tempData } });
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
                          {obj.closingStock?.closingStock}
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
