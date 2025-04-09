import { useEffect, useState } from "react";
import axios from "../../services/Api";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

function JournalVoucherIndex() {
  const [rows, setRows] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Journal Vouchers" }]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("/api/finance/fetchAllJournalVoucher", {
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

  const columns = [
    {
      field: "id",
      headerName: "JV",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            handleGeneratePdf(
              params.row.journal_voucher_number,
              params.row.school_id,
              params.row.financial_year_id
            )
          }
        >
          <PrintIcon color="primary" />
        </IconButton>
      ),
    },
    { field: "pay_to", headerName: "Vendor", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "debit_total", headerName: "Amount", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (params) => moment(params.value).format("DD-MM-YYYY LT"),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
  ];

  const handleGeneratePdf = async (
    journalVoucherNumber,
    schoolId,
    fcYearId
  ) => {
    navigate(`/generate-journalvoucher-pdf/${journalVoucherNumber}`, {
      state: { schoolId, fcYearId },
    });
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 3 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default JournalVoucherIndex;
