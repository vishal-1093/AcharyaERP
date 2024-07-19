import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";

const empId = sessionStorage.getItem("empId");

function PublicationReport() {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "Type", headerName: " Type", flex: 1 },
    { field: "journal_name", headerName: "Journal Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "volume",
      headerName: "Volume",
      flex: 1,
    },
    {
      field: "issue_number",
      headerName: "Issue Number",
      flex: 1,
    },

    {
      field: "paper_title",
      headerName: "Paper Title",
      flex: 1,
    },
    {
      field: "page_number",
      headerName: "Paper Number",
      flex: 1,
    },
    {
      field: "issn",
      headerName: "ISSN",
      flex: 1,
    },
    {
      field: "issn_type",
      headerName: "ISSN Type",
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
      .get(`/api/employee/publicationDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/publicationsFileviews?fileName=${path}`, {
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
export default PublicationReport;
