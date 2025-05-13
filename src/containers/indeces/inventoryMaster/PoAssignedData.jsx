import { useState, useEffect } from "react";
import { Box, IconButton, Grid, Typography, Tabs, Tab, Button } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import { HighlightOff, Visibility } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../services/Api";
import moment from "moment";
import DraftPoView from "../../../pages/forms/inventoryMaster/DraftPoView";
import ModalWrapper from "../../../components/ModalWrapper";
import AddTaskIcon from "@mui/icons-material/AddTask";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const empID = JSON.parse(sessionStorage.getItem("userData"))?.emp_id

const initialValues = {
  cancelRemarks: ""
};

function PoAssignedData() {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("Draft PO Approve");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [rowData, setRowData] = useState({});

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [id, setId] = useState(null);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const bill_approver_status = "Status Pending";

  const columns = [
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      valueGetter: (value, row) =>
        row.totalAmount ? Math.round(row.totalAmount) : "",
    },
    {
      field: "Print",
      headerName: "Draft Po",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handlePreview(params)}>
            <Visibility fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "Cancel_po",
      headerName: "Reject",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleCancelPo(params)}>
            <HighlightOff fontSize="small" color="error" />
          </IconButton>
        );
      },
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/DirectPoCreation/Update/${params.row.temporaryPurchaseOrderId}`,
              { state: { approverStatus: true } }
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "purchase_approver",
      headerName: "Purchase Approver",
      flex: 1,
      renderCell: (params) => [
        <Typography variant="subtitle2">
          {params.row.purchaseApprover}
        </Typography>,
      ],
    },
    // {
    //   field: "bill_approver",
    //   headerName: "Accounts",
    //   flex: 1,
    //   renderCell: (params) => [
    //     <IconButton onClick={() => handleBillApprove(params)}>
    //       <AddTaskIcon fontSize="small" color="primary" />
    //     </IconButton>,
    //   ],
    // },
    {
      field: "upload",
      headerName: "Comparitive Quote",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.tpoAttachmentFilePath === null ? (
          <IconButton color="primary"></IconButton>
        ) : (
          <IconButton onClick={() => handleDownload(params)} color="primary">
            <Visibility fontSize="small" />
          </IconButton>
        ),
      ],
    },
    {
      field: "approve",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => [
        params.row.billApprovedStatus !== null ||
          params.row.totalAmount < 100000 ? (
          <IconButton onClick={() => handleApprove(params)}>
            <AddTaskIcon fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <>
            <Typography variant="subtitle2">{bill_approver_status}</Typography>
          </>
        ),
      ],
    },
  ];
  const amendcolumns = [
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    { field: "created_by", headerName: "Created By", flex: 1 },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      valueGetter: (value, row) =>
        row.totalAmount ? Math.round(row.totalAmount) : "",
    },
    {
      field: "Print",
      headerName: "Draft Po",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handlePreview(params)}>
            <Visibility fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "Cancel_po",
      headerName: "Reject",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleCancelAmendPo(params)}>
            <HighlightOff fontSize="small" color="error" />
          </IconButton>
        );
      },
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/DirectPoCreation/Update/${params.row.poId}`,
              { state: { approverStatus: true } }
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "purchase_approver",
      headerName: "Purchase Approver",
      flex: 1,
      renderCell: (params) => [
        <Typography variant="subtitle2">
          {params.row.purchaseApprover}
        </Typography>,
      ],
    },
    // {
    //   field: "bill_approver",
    //   headerName: "Accounts",
    //   flex: 1,
    //   renderCell: (params) => [
    //     <IconButton onClick={() => handleBillApprove(params)}>
    //       <AddTaskIcon fontSize="small" color="primary" />
    //     </IconButton>,
    //   ],
    // },
    // {
    //   field: "upload",
    //   headerName: "Comparitive Quote",
    //   type: "actions",
    //   flex: 1,
    //   getActions: (params) => [
    //     params.row.tpoAttachmentFilePath === null ? (
    //       <IconButton color="primary"></IconButton>
    //     ) : (
    //       <IconButton onClick={() => handleDownload(params)} color="primary">
    //         <Visibility fontSize="small" />
    //       </IconButton>
    //     ),
    //   ],
    // },
    {
      field: "approve",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => [
        params.row.billApprovedStatus !== null ||
          params.row.totalAmount < 100000 ? (
          <IconButton onClick={() => handleApprove(params)}>
            <AddTaskIcon fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <>
            <Typography variant="subtitle2">{bill_approver_status}</Typography>
          </>
        ),
      ],
    },
  ];
  useEffect(() => {
    getData();
    setCrumbs([]);
  }, [tab]);

  const handlePreview = (params) => {
    setModalPreview(true);
    setId((tab === "Amend PO Approve") ? params.row.poId : params.row.temporaryPurchaseOrderId);
  };

  const handleCancelPo = (params) => {
    const handleToggle = async () => {
      await axios
        .delete(
          `/api/purchase/cancelDraft?temporaryPurchaseOrderId=${params.row.temporaryPurchaseOrderId}&cancelById=${userId}`
        )
        .then((res) => {
          if (res.status === 200 || res.status === 210) {
            setAlertMessage({
              severity: "success",
              message: "Rejected Successfully",
            });
            setAlertOpen(true);
            setModalOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => console.error(err));
    };
    setModalContent({
      title: "",
      message: "Are you sure you want to reject this PO ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => { } },
      ],
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleBillApprove = async (params) => {
    setModalOpen(true);
    const handleToggle = async () => {
      await axios
        .put(
          `/api/purchase/approvedDraft?temporaryPurchaseOrderId=${params.row.temporaryPurchaseOrderId}&approverId=${userId}`
        )
        .then((res) => {
          if (res.status === 200 || res.status === 210) {
            setAlertMessage({
              severity: "success",
              message: "Approved Successfully",
            });
            setAlertOpen(true);
            setModalOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => console.error(err));
    };
    setModalContent({
      title: "",
      message: "Are you sure you want to approve this PO ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "Hold", color: "primary", func: () => { } },
      ],
    });
  };

  const handleApprove = async (params) => {
    setModalOpen(true);
    const handleToggle = async () => {
      try {
        let res;
        if (tab === "Amend PO Approve") {
          res = await axios.patch(`/api/purchase/approvePO/${params.row.poId}`);
        } else {
          res = await axios.put(
            `/api/purchase/approvedDraft?temporaryPurchaseOrderId=${params.row.temporaryPurchaseOrderId}&approverId=${userId}`
          );
        }

        if (res.status === 200 || res.status === 210) {
          setAlertMessage({
            severity: "success",
            message: "Approved Successfully",
          });
          setAlertOpen(true);
          setModalOpen(false);
          getData();
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occurred",
          });
          setAlertOpen(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    setModalContent({
      title: "",
      message: "Are you sure you want to approve this PO?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => { } },
      ],
    });
  };


  const handleDownload = async (params) => {
    await axios
      .get(
        `/api/purchase/temporaryPurchaseOrderFileDownload?fileName=${params.row.tpoAttachmentFilePath}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    if (tab === "Amend PO Approve") {
      await axios
        .get(`/api/purchase/getAmendedPO/${empID}`)
        .then((res) => {
          const rowId = res.data.data.map((obj, index) => ({
            ...obj,
            id: index + 1,
          }));
          setRows(rowId);
        })
        .catch((err) => console.error(err));
    } else {
      const requestData = {
        createdDate: null,
        institute: null,
        pageNo: 0,
        pageSize: 100000,
        vendor: null,
        approverId: userId,
      };

      await axios
        .post(`/api/purchase/getDraftPurchaseOrder`, requestData)
        .then((res) => {
          const rowId = res.data.data.content.map((obj, index) => ({
            ...obj,
            id: index + 1,
          }));
          setRows(rowId);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };
  const handleCancelAmendPo = (params) => {
    setFeedbackOpen((state) => !state)
    setRowData(params)
  };
  const handleCancel = async () => {
    if (!values?.cancelRemarks) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
      return;
    }

    try {
      const res = await axios.patch(
        `/api/purchase/cancelPO/${rowData.row.poId}?cancelledBy=${empID}&comments=${encodeURIComponent(values?.cancelRemarks)}`);

      if (res.status === 200 || res.status === 201) {
        setAlertMessage({ severity: "success", message: "Updated" });
        setAlertOpen(true);
        setFeedbackOpen(false);
        getData();
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "An error occurred",
      });
      setAlertOpen(true);
    }
  };


  return (
    <>
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab value="Draft PO Approve" label="Draft PO Approve" />
        <Tab value="Amend PO Approve" label="Amend PO Approve" />
      </Tabs>
      <Box sx={{ position: "relative", mt: 2 }}>
        <ModalWrapper
          maxWidth={900}
          open={modalPreview}
          setOpen={setModalPreview}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            marginTop={2}
          >
            <Grid item xs={12}>
              <DraftPoView temporaryPurchaseOrderId={id} />
            </Grid>
          </Grid>
        </ModalWrapper>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <GridIndex rows={rows} columns={tab === "Amend PO Approve" ? amendcolumns : columns} />
      </Box>
      <ModalWrapper
        title="Cancel Summary"
        maxWidth={600}
        open={feedbackOpen}
        setOpen={setFeedbackOpen}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
          marginTop={2}
        >
          <Grid item xs={12} md={8}>
            <CustomTextField
              multiline
              rows={2}
              name="cancelRemarks"
              label="Summary"
              value={values.cancelRemarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCancel}
              sx={{ borderRadius: 2 }}
              disabled={!values.cancelRemarks}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

    </>
  );
}

export default PoAssignedData;
