import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import useAlert from "../../../hooks/useAlert";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Button,
  Backdrop,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { makeStyles } from "@mui/styles";

const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const useStyles = makeStyles((theme) => ({
  cancelled: {
    background: "#ffcdd2 !important",
  },
}));

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function ContraVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState({ cancelledRemarks: "" });
  const [backDropLoading, setBackDropLoading] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    grn_no: false,
    total: false,
  });
  const [cancelOpen, setCancelOpen] = useState(false);
  const [voucherData, setVoucherData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const classes = useStyles();

  const maxLength = 200;

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  useEffect(() => {
    getData();
    setCrumbs([{ name: "" }]);
  }, []);

  const getRowClassName = (params) => {
    if (!params.row.active) {
      return classes.cancelled;
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/finance/fetchAllContraVoucher?page=0&page_size=${10000000}&sort=created_date`
      );

      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleAttachment = async (filePath) => {
    if (!filePath) return;
    try {
      setBackDropLoading(true);
      const response = await axios.get(
        `/api/purchase/grnFileDownload?fileName=${filePath}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Unable to open the file",
      });
      setAlertOpen(true);
    } finally {
      setBackDropLoading(false);
    }
  };

  const handleRejectOpen = async (data) => {
    setCancelOpen(true);
    setValues((prev) => ({ ...prev, ["cancelledRemarks"]: "" }));
    try {
      const response = await axios.get(
        `/api/finance/getContraVoucherData/${data.voucher_no}/${data.school_id}/${data.financial_year_id}`
      );

      setVoucherData(response?.data?.data);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleReject = async () => {
    try {
      let putData = [...voucherData];

      putData = putData.map(({ created_username, id, ...rest }) => ({
        ...rest,

        created_username: created_username,
        contra_voucher_id: id,
        cancel_voucher: 1,
        cancelled_by: userID,
        cancelled_date: moment(new Date()).format("DD-MM-YYYY"),
        cancel_remark: values.cancelledRemarks,
        active: false,
      }));

      let ids = [];
      putData.forEach((obj) => {
        ids.push(obj.contra_voucher_id);
      });
      ids = ids.toString();

      const [response] = await Promise.all([
        axios.put(
          `/api/finance/updateContraVoucher/${ids.toString()}`,
          putData
        ),
      ]);
      if (!response.data.success) {
        throw new Error();
      }

      setAlertMessage({
        severity: "success",
        message: "Contra voucher has been cancelled successfully.",
      });
      setAlertOpen(true);
      getData();
      setCancelOpen(false);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Error Occured",
      });
      setAlertOpen(true);
      setCancelOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "Print",
      headerName: "Print",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() =>
            navigate(`/contra-voucher-pdf`, {
              state: {
                schoolId: params.row.school_id,
                fcYearId: params.row.financial_year_id,
                voucherNo: params.row.voucher_no,
              },
            })
          }
        >
          <PrintIcon sx={{ fontSize: 17 }} />
        </IconButton>
      ),
    },

    {
      field: "voucher_no",
      headerName: "Voucher No",
      flex: 1,
      valueGetter: (value, row) => Math.round(value),
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    },
    {
      field: "selected_date",
      headerName: "Selected Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },
    {
      field: "date_of_deposit",
      headerName: "Deposited Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },

    { field: "financial_year_id", headerName: "FC Year", flex: 1 },
    {
      field: "closing_cash",
      headerName: "Closing Cash",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "total_amount",
      headerName: "Deposit",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "balance",
      headerName: "Balance",
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created date",
      flex: 1,
      valueGetter: (row, value) => moment(row).format("DD-MM-YYYY"),
    },
    {
      field: "cancel",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) =>
        !params.row.cancel_voucher ? (
          <IconButton onClick={() => handleRejectOpen(params.row)}>
            <CancelOutlinedIcon color="error" sx={{ fontSize: 17 }} />
          </IconButton>
        ) : (
          <Typography>{params.row.cancel_remark}</Typography>
        ),
    },
  ];

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <ModalWrapper open={cancelOpen} setOpen={setCancelOpen} maxWidth={700}>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12}>
            <CustomTextField
              name="cancelledRemarks"
              label="Remarks"
              value={values.cancelledRemarks}
              handleChange={handleChange}
              helperText={`Remaining characters : ${getRemainingCharacters(
                "cancelledRemarks"
              )}`}
              multiline
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={!values.cancelledRemarks}
              variant="contained"
              color="error"
              onClick={handleReject}
            >
              CANCEL
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <GridIndex
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        setColumnVisibilityModel={setColumnVisibilityModel}
        getRowClassName={getRowClassName}
      />
    </>
  );
}

export default ContraVoucherIndex;
