import { useEffect, useState } from "react";
import axios from "../../services/Api";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function JournalVerifierIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "JV Verifier" }]);
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
    navigate(`/approve-jv/${vcNo}/${schoolId}/${fcyearId}`);

  const handleVerify = (data) => {
    const {
      journal_voucher_number: vcNo,
      school_id: schoolId,
      financial_year_id: fcyearId,
    } = data;
    return (
      <IconButton onClick={() => handleNaviage(vcNo, schoolId, fcyearId)}>
        <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
      </IconButton>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "Verify",
      flex: 1,
      renderCell: (params) => handleVerify(params.row),
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
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY LT"),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
  ];

  return (
    <Box>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default JournalVerifierIndex;
