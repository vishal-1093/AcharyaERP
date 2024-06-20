import { useState, useEffect } from "react";
import axios from "../../../services/Api";
// import { Box, Button, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../../components/ModalWrapper";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Checkbox,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import useAlert from "../../../hooks/useAlert";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { Add } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function StoreIndentApproverIndex() {
  const [rows, setRows] = useState([]);
  const [isNew, setIsNew] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [itemDataPopup, setItemDataPopup] = useState([]);
  const [indentTicket, setIndentTicket] = useState();
  const [unAssigned, setUnAssigned] = useState([]);
  const [values, setValues] = useState([]);
  const [data, setData] = useState([]);
  const [remarks, setRemarks] = useState({ remarks: "" });

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const handleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll" && checked === true) {
      let tempUser = itemDataPopup.map((test) => {
        return { ...test, isChecked: checked };
      });
      setItemDataPopup(tempUser);

      setValues({
        ...values,
        storeIndentId: itemDataPopup
          .map((obj) => obj.store_indent_request_id)
          .toString(),
      });
    } else if (name === "selectAll" && checked === false) {
      let tempUser = itemDataPopup.map((test) => {
        return { ...test, isChecked: checked };
      });
      setItemDataPopup(tempUser);

      setValues({
        ...values,
        storeIndentId: [],
      });
    } else if (name !== "selectAll" && checked === true) {
      if (!isNew) {
        const uncheckTemp = unAssigned;
        if (
          uncheckTemp.includes(e.target.value) === true &&
          uncheckTemp.indexOf(e.target.value) > -1
        ) {
          uncheckTemp.splice(uncheckTemp.indexOf(e.target.value), 1);
        }

        setUnAssigned(uncheckTemp);
      }

      let temp = itemDataPopup.map((obj) => {
        return obj.store_indent_request_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });
      setItemDataPopup(temp);
      const newTemp = [];
      temp.map((obj) => {
        if (obj.isChecked === true) {
          newTemp.push(obj.store_indent_request_id);
        }
      });
      setValues({
        ...values,
        storeIndentId: newTemp.toString(),
      });
    } else if (name !== "selectAll" && checked === false) {
      if (!isNew) {
        const uncheckTemp = unAssigned;
        if (uncheckTemp.includes(e.target.value) === false) {
          uncheckTemp.push(e.target.value);
        }

        setUnAssigned(uncheckTemp);
      }

      let temp = itemDataPopup.map((obj) => {
        return obj.store_indent_request_id.toString() === name
          ? { ...obj, isChecked: checked }
          : obj;
      });

      setItemDataPopup(temp);

      const existData = [];

      values.storeIndentId.split(",").map((obj) => {
        existData.push(obj);
      });

      const index = existData.indexOf(e.target.value);

      if (index > -1) {
        existData.splice(index, 1);
      }

      setValues({
        ...values,
        storeIndentId: existData.toString(),
      });
    }
  };

  const handleChangeRemarks = (e) => {
    setRemarks((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns = [
    { field: "indent_ticket", headerName: "Indent Ticket", flex: 1 },
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
      field: "created_date",
      headerName: "Requested date ",
      flex: 1,
      valueGetter: (params) =>
        params.row.created_date
          ? params.row.created_date.slice(0, 10).split("-").reverse().join("-")
          : "",
    },

    {
      field: "approver1_status",
      headerName: "Approver",
      flex: 1,
      valueGetter: (params) =>
        params.row.approver1_status || params.row.approver2_status === null
          ? "Pending"
          : "",
    },
    {
      field: "view",
      headerName: "Approve",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton color="primary">
          <Add onClick={() => handleClick(params)} fontSize="small" />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const handleClick = async (params) => {
    setIsShow(true);
    setIndentTicket(params.row.indent_ticket);
    setData(params.row);
    await axios(
      `/api/inventory/getDataForDisplaying2?indent_ticket=${params.row.indent_ticket}`
    )
      .then((res) => {
        const temp = [];
        const storeIndentRequestIds = [];
        res.data.data.map((obj) => {
          storeIndentRequestIds.push(obj.store_indent_request_id);

          return temp.push({
            indent_ticket: obj.indent_ticket,
            financial_year_id: obj.financial_year_id,
            requested_by: obj.requested_by,
            requested_date: obj.requested_date,
            approver1_date: obj.approver1_date,
            approver1_remarks: obj.approver1_remarks,
            approver1_status: obj.approver1_status,
            approver2_status: obj.approver2_status,
            description: obj.description,
            emp_id: obj.emp_id,
            env_item_id: obj.env_item_id,
            issued_status: obj.issued_status,
            item_description: obj.item_description,
            item_id: obj.item_id,
            item_names: obj.item_names,
            purpose: obj.purpose,
            quantity: obj.quantity,
            remarks: obj.remarks,
            stock_description: obj.stock_description,
            store_indent_request_id: obj.store_indent_request_id,
            total_available_in_stores: obj.total_available_in_stores,
            total_issued: obj.total_issued,
            isChecked: true,
          });
        });

        setValues({
          ...values,
          storeIndentId: storeIndentRequestIds.toString(),
        });

        setItemDataPopup(temp);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(`/api/inventory/getApprovedData/${userId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleApprove = async () => {
    const temp = [];
    const Ids = [];
    itemDataPopup.map((obj) => {
      Ids.push(obj.store_indent_request_id);
      if (obj.isChecked === true) {
        temp.push({
          active: true,
          approver1_date: new Date(),
          approver1_remarks: remarks.remarks,
          approver1_status: 1,
          approver2_status: 1,
          approver1_id: userId,
          approver2_id: userId,
          issued_status: "Approved",
          indent_ticket: data.indent_ticket,
          requested_by: data.emp_id,
          requested_date: data.created_date,
          financial_year_id: obj.financial_year_id,
          description: obj.description,
          emp_id: obj.emp_id,
          env_item_id: obj.env_item_id,
          item_description: obj.item_description,
          item_id: obj.item_id,
          item_names: obj.item_names,
          purpose: obj.purpose,
          quantity: obj.quantity,
          remarks: obj.remarks,
          stock_description: obj.stock_description,
          store_indent_request_id: obj.store_indent_request_id,
          total_available_in_stores: obj.total_available_in_stores,
          total_issued: obj.total_issued,
        });
      } else {
        temp.push({
          approver1_date: null,
          approver1_remarks: null,
          approver1_status: null,
          approver2_status: null,
          approver1_id: null,
          approver2_id: null,
          issued_status: "Rejected",
          indent_ticket: data.indent_ticket,
          requested_by: data.emp_id,
          requested_date: data.created_date,
          financial_year_id: obj.financial_year_id,
          description: obj.description,
          emp_id: obj.emp_id,
          env_item_id: obj.env_item_id,
          item_description: obj.item_description,
          item_id: obj.item_id,
          item_names: obj.item_names,
          purpose: obj.purpose,
          quantity: obj.quantity,
          remarks: obj.remarks,
          stock_description: obj.stock_description,
          store_indent_request_id: obj.store_indent_request_id,
          total_available_in_stores: obj.total_available_in_stores,
          total_issued: obj.total_issued,
        });
      }
    });

    await axios
      .put(`/api/inventory/updateStoreIndentRequest/${Ids.toString()}`, temp)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          await axios
            .post(`/api/inventory/storeIndentRequestHistory`, temp)
            .then((res) => {
              setAlertMessage({ severity: "success", message: "Approved" });
              setAlertOpen(true);
              setIsShow(false);
              getData();
            });
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
      <Box>
        <GridIndex rows={rows} columns={columns} />
      </Box>

      <ModalWrapper
        title={indentTicket}
        open={isShow}
        setOpen={setIsShow}
        maxWidth={1200}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12} md={12} mt={4}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Item name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Quantity
                    </TableCell>

                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Remarks
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", textAlign: "center" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemDataPopup.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.item_names}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.quantity}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.remarks}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Checkbox
                            {...label}
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 12 },
                            }}
                            name={obj.store_indent_request_id}
                            value={obj.store_indent_request_id}
                            onChange={handleChange}
                            checked={obj?.isChecked || false}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              rows={2}
              multiline
              label="Remarks"
              name="remarks"
              value={remarks.remarks}
              handleChange={handleChangeRemarks}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={handleApprove}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
}

export default StoreIndentApproverIndex;
