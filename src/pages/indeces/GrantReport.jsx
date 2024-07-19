import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";

const empId = sessionStorage.getItem("empId");

function GrantReport() {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "title", headerName: "Title of the project", flex: 1 },
    { field: "funding", headerName: "Funding Agency", flex: 1 },
    {
      field: "funding_name",
      headerName: "Name of the funding agency",
      flex: 1,
    },
    {
      field: "sanction_amount",
      headerName: "Sanction Amount",
      flex: 1,
    },

    {
      field: "tenure",
      headerName: "Tenure",
      flex: 1,
    },
    {
      field: "pi",
      headerName: "Principal Investigator",
      flex: 1,
    },
    {
      field: "co_pi",
      headerName: "Copi",
      flex: 1,
    },
    {
      field: "attachment_path",
      type: "actions",
      flex: 1,
      headerName: "View",
      getActions: (params) => [
        params.row.attachment_path ? (
          <IconButton
            onClick={() => handleDownload(params.row.attachment_path)}
            sx={{ padding: 0 }}
          >
            <VisibilityIcon
              fontSize="small"
              color="primary"
              sx={{ cursor: "pointer" }}
            />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/grantsDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/grantFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default GrantReport;
