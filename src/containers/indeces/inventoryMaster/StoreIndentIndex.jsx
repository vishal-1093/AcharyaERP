import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function StoreIndentIndex() {
  const [rows, setRows] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [itemDataPopup, setItemDataPopup] = useState([]);
  const [indentTicket, setIndentTicket] = useState();
  const [stockIssueOpen, setStockIssueOpen] = useState(false);
  const [values, setValues] = useState([]);
  const [itemOptions, setitemOptions] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();

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
      field: "approver1_status",
      headerName: "Approver status",
      flex: 1,
      valueGetter: (params) =>
        params.row.approver1_status === null
          ? "Pending"
          : params.row.StoreIndent_approver1_name,
    },
    {
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton color="primary">
          <VisibilityIcon
            onClick={() => handleClick(params)}
            fontSize="small"
          />
        </IconButton>,
      ],
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Store Indent Index" }]);
  }, []);

  const handleClick = async (params) => {
    setIsShow(true);
    setIndentTicket(params.row.indent_ticket);
    await axios(
      `/api/inventory/getItemApproverDataBasedOnIndentTicket?indent_ticket=${params.row.indent_ticket}`
    )
      .then((res) => {
        setItemDataPopup(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/fetchAllStoreIndentRequest?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleStockIssue = async (params) => {
    setStockIssueOpen(true);
    await axios(
      `/api/inventory/getItemApproverDataBasedOnIndentTicket?indent_ticket=${params.row.indent_ticket}`
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
            indent_ticket: obj.indent_ticket,
            issued_status: obj.issued_status,
            item_description: obj.item_description,
            item_names: obj.item_names,
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

    await axios
      .get(
        `/api/inventory/fetchAllEnvItemsStores?page=0&page_size=10000&sort=created_by`
      )
      .then((res) => {
        setitemOptions(
          res.data.data.Paginated_data.content.map((obj) => ({
            itemid: obj.id,
            value: obj.item_names + "-" + obj.item_description + "-" + obj.make,
            label: obj.item_names + "-" + obj.item_description + "-" + obj.make,
            uom: obj?.measure_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 8 }}>
        <Button
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 80, top: -57, borderRadius: 2 }}
          onClick={() => navigate("/StoreIndentHistory")}
        >
          Issued History
        </Button>
        <Button
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: -10, top: -57, borderRadius: 2 }}
          onClick={() => navigate("/InventoryMaster/StoreIndent/new")}
        >
          Create
        </Button>
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
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Item name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Quantity
                    </TableCell>

                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Approver Remarks
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.map((obj, i) => {
                    if (obj.issued_status === "Approved") {
                      return (
                        <TableRow key={i}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {obj.item_names}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {obj.quantity}
                          </TableCell>

                          <TableCell sx={{ textAlign: "center" }}>
                            {obj.approver1_remarks}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        title={indentTicket}
        open={isShow}
        setOpen={setIsShow}
        maxWidth={1200}
      >
        <Grid container justifyContent="flex-start" alignItems="center">
          <Grid item xs={12} md={12} mt={4}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      End User
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      School
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Dept
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Item name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Quantity
                    </TableCell>

                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Remarks
                    </TableCell>
                    {/* <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Indent Status
                    </TableCell> */}
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Approver
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Approver Remarks
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemDataPopup.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.employee_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.school_name_short}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.dept_name_short}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.item_names}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.quantity}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.remarks}
                        </TableCell>
                        {/* <TableCell sx={{ textAlign: "center" }}>
                          {obj.issued_status}
                        </TableCell> */}
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.approver1_status === null
                            ? "Pending"
                            : obj.StoreIndent_approver1_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.approver1_remarks}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
}

export default StoreIndentIndex;
