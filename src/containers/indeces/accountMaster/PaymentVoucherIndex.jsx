import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";

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

function PaymentVoucherIndex() {
  const [rows, setRows] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    approved_by: false,
    // approved_date: false,
    created_username: false,
    created_date: false,
    created_by: false,
    dept_name: false,
    remarks: false,
  });

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Payment Voucher Index" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`/api/finance/fetchAllPaymentVoucher`, {
        params: { page: 0, page_size: 10000, sort: "created_date" },
      });

      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
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

  const columns = [
    {
      field: "Print",
      headerName: "Print",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/payment-voucher-pdf/${params.row.id}`)}
        >
          <PrintIcon sx={{ fontSize: 17 }} />
        </IconButton>
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
    { field: "voucher_no", headerName: "Voucher No", flex: 1 },
    {
      field: "approved_date",
      headerName: "Voucher Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },
    { field: "debit_total", headerName: "Amount", flex: 1 },
    { field: "pay_to", headerName: "Pay to", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name", headerName: "Dept", flex: 1, hide: true },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
    },
    { field: "approved_by", headerName: "Approved By", flex: 1 },

    {
      field: "online",
      headerName: "Online",
      flex: 1,
      valueGetter: (value, row) => (value == 1 ? "Online" : ""),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
  ];

  return (
    <>
      <GridIndex
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        setColumnVisibilityModel={setColumnVisibilityModel}
      />
    </>
  );
}

export default PaymentVoucherIndex;
