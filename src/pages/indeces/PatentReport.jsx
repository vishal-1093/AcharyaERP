import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";

const empId = sessionStorage.getItem("empId");

function PatentReport() {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "patent_name", headerName: "National / International", flex: 1 },
    { field: "patent_title", headerName: "Patent Title", flex: 1 },
    { field: "reference_number", headerName: "Reference No.", flex: 1 },
    { field: "publication_status", headerName: "Publication Status", flex: 1 },
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
      .get(`/api/employee/patentDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/patentFileviews?fileName=${path}`, {
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
export default PatentReport;
