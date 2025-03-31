import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import {
  Box,
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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

function IndentHistory() {
  const [rows, setRows] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [itemDataPopup, setItemDataPopup] = useState([]);
  const [indentTicket, setIndentTicket] = useState();
  const [username, setUsername] = useState("");

  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "indent_ticket", headerName: "Indent Ticket", flex: 1 },
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
      field: "created_date",
      headerName: "Requested date ",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },

    {
      field: "StoreIndent_approver1_name",
      headerName: "Approver",
      flex: 1,
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
    {
      field: "cancel_status",
      headerName: "Cancel Status",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <>{params.row.cancel_status ? "Cancelled" : ""}</>,
      ],
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Store Indent History" }]);
  }, []);

  const handleClick = async (params) => {
    setIsShow(true);
    setIndentTicket(params.row.indent_ticket);
    await axios
      .get(
        `/api/inventory/getItemApproverDataBasedOnIndentTicket?indent_ticket=${params.row.indent_ticket}`
      )
      .then(async (resOne) => {
        setItemDataPopup(resOne.data.data);
        await axios
          .get(`/api/purchase/getApprovers`)
          .then((res) => {
            const userName = res.data.data.filter((obj) => {
              if (obj.userId === resOne.data.data[0].issuedBy) {
                return obj.userName;
              }
            });
            setUsername(userName);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/fetchAllStoreIndentRequestHistory?page=${0}&page_size=${1000000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
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
        <Grid container justifyContent="flex-start" alignItems="center">
          <Grid item xs={12} md={12} mt={4}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Item name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Qty
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Issued Qty
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Remarks
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Indent Status
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Approver
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Approver Remarks
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Issued Date
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Issued By
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Received status
                    </TableCell>
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
                          {obj.issued_quantity ? obj.issued_quantity : "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.remarks}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.issuedUpdateStatus}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.StoreIndent_approver1_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.approver1_remarks
                            ? obj.approver1_remarks
                            : "Rejected"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {moment(obj.issued_date).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.approver1_status === 1 ? obj.issuedByName : "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.received_status === 1 &&
                          obj.purchase_status === 1 ? (
                            <Typography variant="subtitle2">
                              Received
                            </Typography>
                          ) : obj.purchase_status === 1 &&
                            obj.received_status === null ? (
                            <Typography variant="subtitle2">Pending</Typography>
                          ) : (
                            <Typography variant="subtitle2">
                              Rejected
                            </Typography>
                          )}
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

export default IndentHistory;
