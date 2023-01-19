import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import EditIcon from "@mui/icons-material/Edit";

function SalaryStructureAssignmentIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllSalaryStructureDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "salary_structure",
      headerName: "Salary Structure",
      flex: 1,
    },
    {
      field: "voucher_head_short_name",
      headerName: "Particulars",
      flex: 1,
    },
    {
      field: "category_name_type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      renderCell: (params) => {
        return params.row.from_date
          ? params.row.from_date.slice(0, 7).split("-").reverse().join("-")
          : "";
      },
    },
    {
      field: "salary_category",
      headerName: "Calculation Type",
      flex: 1,
    },
    {
      field: "gross_limit",
      headerName: "Gross Limit",
      flex: 1,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
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
              `/SalaryMaster/SalaryStructureAssignment/Update/${params.row.id}`
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() =>
            navigate("/SalaryMaster/SalaryStructureAssignment/New")
          }
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default SalaryStructureAssignmentIndex;
