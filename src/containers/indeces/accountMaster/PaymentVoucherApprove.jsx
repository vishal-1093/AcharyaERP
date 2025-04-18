import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import CustomModal from "../../../components/CustomModal";
import { Visibility } from "@mui/icons-material";
import DraftPaymentVoucherView from "./DraftPaymentVoucherView";

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  },
  th: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
  },
  td: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  },
  yearTd: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "right",
  },
}));

function PaymentVoucherApprove() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);
  const [voucherData, setVoucherData] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    dept_name: false,
  });
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [envData, setEnvData] = useState({});

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Payment Voucher Approve" }]);
  }, []);

  useEffect(() => {
    getEnvData();
  }, [voucherData]);

  const getEnvData = async () => {
    if (voucherData?.[0]?.type === "DEMAND-PV") {
      try {
        const response = await axios.get(
          `/api/finance/getEnvBillDetails/${voucherData?.[0]?.env_bill_details_id}`
        );
        setEnvData(response.data.data);
        console.log(response);
      } catch {
        setAlertMessage({ severity: "error", message: "Error Occured" });
        setAlertOpen(true);
      }
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/finance/fetchAllDraftPaymentVoucherStatus",
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
      );

      const filterRow = response.data.data.Paginated_data.content.filter(
        (obj) => obj.verified_status === 1
      );

      setRows(filterRow);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleCancel = async (data) => {
    setModalOpen(true);

    const handleToggle = async () => {
      await axios
        .delete(
          `/api/finance/deactiveDraftPaymentVoucher/${data.voucher_no}/${data.financial_year_id}`
        )
        .then((res) => {
          if (res.status === 200) {
            getData();
            setModalOpen(false);
            setJvWrapperOpen(false);
          }
        })
        .catch((err) => console.error(err));
    };

    setModalContent({
      title: "",
      message: "Are you sure you want to cancel??",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const handleVerify = async (data) => {
    setRowData(data);
    setJvWrapperOpen(true);

    try {
      const response = await axios.get(
        `/api/finance/getDraftPaymentVoucherData/${data.voucher_no}/${data.school_id}/${data.financial_year_id}`
      );
      setVoucherData(response.data.data);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const handleAttachment = async (data) => {
    try {
      const response = await axios.get(
        `/api/finance/draftPaymentVoucherFileviews?fileName=${data.attachment_path}`,
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: "Error while fetching file",
      });
      setAlertOpen(true);
    }
  };

  const updateVerify = async () => {
    const Ids = voucherData.map((obj) => obj.id);

    const putData = voucherData.map((obj) => ({
      ...obj,
      draft_payment_voucher_id: obj.id,
      approver_id: userID,
      approved_status: 1,
      approved_date: new Date(),
    }));

    const postData = voucherData.map(
      ({ financial_year_id, financial_year, voucher_no, ...rest }) => rest
    );

    const mainData = postData.map((obj) => ({
      ...obj,
      draft_payment_voucher_id: obj.id,
      approver_id: userID,
      approved_status: 1,
      approved_date: new Date(),
      credit_total: obj.debit_total,
      credit: obj.debit,
      created_name: obj.created_username,
    }));

    try {
      const putResponse = await axios.put(
        `/api/finance/updateDraftPaymentVoucher/${Ids.toString()}`,
        putData
      );

      const postResponse = await axios.post(
        `/api/finance/PaymentVoucher`,
        mainData
      );

      if (voucherData?.[0]?.type === "GRN-PV") {
        const updateBody = {
          paymentVoucherId: postResponse?.data?.data?.[0]?.payment_voucher_id,
          grn_no: rowData.reference_number,
        };

        const updateGrn = await axios.put(
          "/api/purchase/updateGrnDraftJournalVoucher",
          updateBody
        );

        if (updateGrn.status !== 200 && updateGrn.status !== 201) {
          throw new Error("GRN Update Failed");
        }
      }

      if (voucherData?.[0]?.type === "DEMAND-PV") {
        const updateBody = { ...envData };
        updateBody.payment_voucher_id =
          postResponse?.data?.data?.[0]?.payment_voucher_id;

        const updateGrn = await axios.put(
          `/api/finance/updateEnvBillDetails/${voucherData?.[0]?.env_bill_details_id}`,
          updateBody
        );
        if (!updateGrn.data.success) throw new Error();
      }

      if (voucherData?.[0]?.type === "ADVANCE-PV") {
        const updateBody = {
          payment_voucher_id: postResponse?.data?.data?.[0]?.payment_voucher_id,
          purchase_order_id: Number(voucherData?.[0]?.po_reference),
        };
        const updateGrn = await axios.put(
          `/api/purchase/updatePurchaseOrder/${voucherData?.[0]?.po_reference}`,
          updateBody
        );
        if (!updateGrn.data.success) throw new Error();
      }

      setAlertMessage({
        severity: "success",
        message: "Approved Successfully",
      });
      getData();
      setAlertOpen(true);
      setJvWrapperOpen(false);
    } catch (error) {
      console.error(error);
      setAlertMessage({
        severity: "error",
        message: error?.response?.data?.message || "An error occurred",
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) =>
        params.row.created_by === userID ? (
          <Typography variant="subtitle2" color="green">
            Verified
          </Typography>
        ) : params.row.verifier_id === userID ? (
          <Typography variant="subtitle2" color="green">
            Verified
          </Typography>
        ) : (
          <IconButton onClick={() => handleVerify(params.row)}>
            <AddBoxIcon color="primary" sx={{ fontSize: 17 }} />
          </IconButton>
        ),
    },
    {
      field: "attachment",
      headerName: "Attachment",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleAttachment(params.row)}>
          <Visibility color="primary" sx={{ fontSize: 17 }} />
        </IconButton>
      ),
    },
    { field: "debit_total", headerName: "Amount", flex: 1 },
    { field: "pay_to", headerName: "Vendor", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "cancel",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleCancel(params.row)}>
          <CancelOutlinedIcon color="error" sx={{ fontSize: 17 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <ModalWrapper
        open={jvWrapperOpen}
        setOpen={setJvWrapperOpen}
        maxWidth={1000}
      >
        <DraftPaymentVoucherView voucherData={voucherData} />

        <div style={{ marginTop: 8, textAlign: "right" }}>
          {/* <Button
            onClick={() => handleCancel(voucherData?.[0])}
            variant="contained"
            sx={{ marginRight: 2 }}
            color="error"
          >
            REJECT
          </Button> */}
          <Button
            sx={{ marginRight: 2.5 }}
            onClick={updateVerify}
            variant="contained"
            color="success"
          >
            APPROVE
          </Button>
        </div>
      </ModalWrapper>

      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <GridIndex
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        setColumnVisibilityModel={setColumnVisibilityModel}
      />
    </>
  );
}

export default PaymentVoucherApprove;
