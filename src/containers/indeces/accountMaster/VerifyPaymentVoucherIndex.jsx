import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
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

function VerifyPaymentVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [jvWrapperOpen, setJvWrapperOpen] = useState(false);
  const [voucherData, setVoucherData] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    dept_name: false,
  });

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Payment Voucher Verifier" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/finance/fetchAllDraftPaymentVoucherStatus",
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
      );

      const filterRow = response.data.data.Paginated_data.content;

      setRows(filterRow);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
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

  const updateVerify = async () => {
    const Ids = [];

    voucherData.map((obj) => {
      Ids.push(obj.id);
    });

    const putData = voucherData.map((obj) => ({
      ...obj,
      draft_payment_voucher_id: obj.id,
      verifier_id: userID,
      verified_status: 1,
      verified_date: new Date(),
    }));

    try {
      const response = await axios.put(
        `/api/finance/updateDraftPaymentVoucher/${Ids?.toString()}`,
        putData
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Verified Successfully",
        });
        getData();
        setAlertOpen(true);
        setJvWrapperOpen(false);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Verify",
      flex: 1,
      renderCell: (params) =>
        params.row.created_by !== userID &&
        params.row.verified_status === null ? (
          <IconButton onClick={() => handleVerify(params.row)}>
            <AddBoxIcon color="primary" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : params.row.verified_status ? (
          <Typography variant="subtitle2" color="green">
            Verified
          </Typography>
        ) : (
          <Typography variant="subtitle2">Pending</Typography>
        ),
    },
    {
      field: "attachment",
      headerName: "Attachment",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleAttachment(params.row)}>
          <Visibility sx={{ fontSize: 17 }} color="primary" />
        </IconButton>
      ),
    },
    { field: "debit_total", headerName: "Amount", flex: 1 },
    { field: "pay_to", headerName: "Pay to", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY LT"),
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
        <div>
          <DraftPaymentVoucherView voucherData={voucherData} />
        </div>

        <div style={{ marginTop: 8, textAlign: "right" }}>
          <Button
            onClick={() => handleCancel(voucherData?.[0])}
            variant="contained"
            sx={{ marginRight: 2 }}
            color="error"
          >
            REJECT
          </Button>
          <Button
            onClick={updateVerify}
            sx={{ marginRight: 5 }}
            variant="contained"
            color="success"
          >
            VERIFY
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

export default VerifyPaymentVoucherIndex;
