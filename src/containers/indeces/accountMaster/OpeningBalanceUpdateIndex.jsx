import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import { Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

function OpeningBalanceUpdateIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/inventory/fetchAllVendorOpeningbalance?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "voucher_head", headerName: "Voucher Head", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "opening_balance", headerName: "OB", flex: 1 },
    {
      field: "id",
      headerName: "Update",
      renderCell: (params) => (
        <IconButton
          label="Update"
          color="primary"
          onClick={() =>
            navigate(
              `/AccountMaster/OpeningBalanceUpdateForm/${params.row.voucher_head_new_id}`
            )
          }
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <Button
        onClick={() => navigate("/AccountMaster/OpeningBalanceUpdateForm")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Update
      </Button>

      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default OpeningBalanceUpdateIndex;
