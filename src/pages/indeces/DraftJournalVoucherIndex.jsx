import { useEffect, useState } from "react";
import axios from "../../services/Api";
import { Box, Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";

function DraftJournalVoucherIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs([
      { name: "Accounts Voucher", link: "/accounts-voucher" },
      { name: "Draft JV" },
    ]);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/finance/fetchAllDraftJournalVoucher",
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
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

  const handleNaviage = (vcNo, schoolId, fcyearId) =>
    navigate(`/journal-voucher/${vcNo}/${schoolId}/${fcyearId}`);

  const handleUpdate = (data) => {
    const {
      journal_voucher_number: vcNo,
      school_id: schoolId,
      financial_year_id: fcyearId,
    } = data;
    return (
      <IconButton onClick={() => handleNaviage(vcNo, schoolId, fcyearId)}>
        <EditIcon color="primary" sx={{ fontSize: 22 }} />
      </IconButton>
    );
  };

  const navigateCreate = () => navigate("/journal-voucher");

  const columns = [
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
    {
      field: "id",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => handleUpdate(params.row),
    },
  ];

  return (
    <>
      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={navigateCreate}
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        >
          <Typography variant="subtitle2">Create</Typography>
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default DraftJournalVoucherIndex;
