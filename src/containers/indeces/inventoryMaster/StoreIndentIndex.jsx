import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridIndex from "../../../components/GridIndex";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { HighlightOff } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import CustomModal from "../../../components/CustomModal";
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

function StoreIndentIndex() {
  const [rows, setRows] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [itemDataPopup, setItemDataPopup] = useState([]);
  const [indentTicket, setIndentTicket] = useState();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
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
      field: "approver1_status",
      headerName: "Approver status",
      flex: 1,
      valueGetter: (params) =>
        params.row.approver1_status === 0
          ? "Pending"
          : params.row.StoreIndent_approver1_name,
    },
    {
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleClick(params)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>,
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
            style={{ color: params.row.approver1_status === 0 ? "red" : "gray" }}
            onClick={() => handleCancel(params)}
            disabled={params.row.approver1_status != 0}
          >
            {params.active}
          </GridActionsCellItem>)
          :
          (
            <>
              <Typography variant="pragraph">Cancelled</Typography>
            </>
          )
      ]
    },
    // {
    //   field: "received_status",
    //   headerName: "Received status",
    //   type: "actions",
    //   flex: 1,
    //   getActions: (params) => [
    //     params.row.purchase_status === 1 &&
    //     params.row.received_status === null ? (
    //       <IconButton
    //         color="primary"
    //         onClick={() => handleReceivedStatus(params)}
    //       >
    //         <AddCircleOutlineIcon fontSize="small" />
    //       </IconButton>
    //     ) : (
    //       <>
    //         <Typography variant="subtitle2">Received</Typography>
    //       </>
    //     ),
    //   ],
    // },
  ];

  const handleCancel = async (params) => {
    setModalOpen(false);
    const handleToggle = async () => {
      try {
        const res = await axios.get(`/api/inventory/getDataForDisplaying2?indent_ticket=${params.row?.indent_ticket}`)
        if (res.status === 200) {
          const Ids = res.data.data?.map((el) => el.store_indent_request_id);
          let payload = res.data.data.map((ele) => ({ ...ele, cancel_status: true, requested_by: userId }))
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

  const handleReceivedStatus = (params) => {
    getTicketData(params.indent_ticket);
    const handleReceived = async () => {
      const payload = [];
      const storeIndentRequestIds = [];

      itemDataPopup.forEach((obj) => {
        if (obj.issued_status === "Approved") {
          storeIndentRequestIds.push(obj.id);
          payload.push({
            store_indent_request_id: obj.id,
            received_status: 1,
          });
        }
      });
      try {
        await axios.put(
          `/api/inventory/updateReceiveStatus/${storeIndentRequestIds.toString()}`,
          payload
        );

        setAlertMessage({
          severity: "success",
          message: "Status Updated",
        });
        setModalOpen(false);
        setIsShow(false);
        setAlertOpen(true);
        getData();
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "",
        });
        setModalOpen(false);
        setIsShow(false);
        setAlertOpen(true);
      }
    };
    setModalContent({
      message: "Did you receive the items ??",
      buttons: [
        { name: "Yes", func: handleReceived },
        { name: "No", func: () => { } },
      ],
    });
    setModalOpen(true);
  };

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Store Indent Index" }]);
  }, []);

  const handleClick = async (params) => {
    setIsShow(true);
    setIndentTicket(params.row.indent_ticket);
    await axios
      .get(
        `/api/inventory/getItemApproverDataBasedOnIndentTicket?indent_ticket=${params.row.indent_ticket}`
      )
      .then((res) => {
        setItemDataPopup(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getTicketData = async (ticketNo) => {
    await axios
      .get(
        `/api/inventory/getItemApproverDataBasedOnIndentTicket?indent_ticket=${ticketNo}`
      )
      .then((res) => {
        setItemDataPopup(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/fetchAllStoreIndentRequest?page=${0}&page_size=${10000}&sort=created_date&created_by=${userId}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: { xs: 0, md: 5 },
          marginTop: { xs: -1, md: -5 },
        }}>
        <Button
          variant="contained"
          disableElevation
          onClick={() => navigate("/StoreIndentHistory")}
        >
          History
        </Button>&nbsp;&nbsp;
        <Button
          variant="contained"
          disableElevation
          onClick={() => navigate("/StoreIndent")}
        >
          Create
        </Button>
      </Box>

      <Box
        sx={{
          marginTop: { xs: 5, md: 0 },
        }}>
      <GridIndex rows={rows} columns={columns} />
      </Box>
      
      <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />

      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

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
                      Received Status
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
                          {obj.issued_quantity ? obj.issued_quantity : "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.remarks}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.issuedUpdateStatus}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.approver1_status === null
                            ? "Pending"
                            : obj.StoreIndent_approver1_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.approver1_remarks ? obj.approver1_remarks : "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {obj.received_status === null &&
                            obj.purchase_status === 1 ? (
                            <IconButton
                              color="primary"
                              onClick={() => handleReceivedStatus(obj)}
                            >
                              <AddCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          ) : obj.approver1_status === 2 ? (
                            <Typography variant="subtitle2">
                              Rejected
                            </Typography>
                          ) : (obj.approver1_status === 0 ||
                            obj.approver1_status === 1) &&
                            obj.purchase_status === 0 ? (
                            <Typography variant="subtitle2">Pending</Typography>
                          ) : (
                            <Typography variant="subtitle2">
                              Received
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

export default StoreIndentIndex;
