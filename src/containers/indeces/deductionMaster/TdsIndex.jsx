import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";

function TdsIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/getTdsList?page=${0}&pageSize=${10000}`)
      .then((res) => {
        setRows(res.data.data.content);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "empCode", headerName: "Emp Code", flex: 1 },
    { field: "employeeName", headerName: "Emp Name", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "month", headerName: "Month", flex: 1 },
    { field: "year", headerName: "Year", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    { field: "createdByName", headerName: "Created By ", flex: 1 },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <Button
        onClick={() => navigate("/DeductionMaster/TdsForm")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default TdsIndex;
