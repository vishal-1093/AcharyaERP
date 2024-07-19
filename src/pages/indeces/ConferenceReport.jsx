import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";

const empId = sessionStorage.getItem("empId");

function ConferenceReport() {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "conference_type", headerName: "Conference Type", flex: 1 },
    { field: "paper_type", headerName: "Paper Type", flex: 1 },
    { field: "conference_name", headerName: "Conference Name", flex: 1 },
    { field: "paper_title", headerName: "Paper Title", flex: 1 },
    { field: "place", headerName: "City", flex: 1 },
    { field: "from_date", headerName: "From Date", flex: 1 },
    { field: "to_date", headerName: "To Date", flex: 1 },
    { field: "organiser", headerName: "Organizer", flex: 1 },
    { field: "presentation_type", headerName: "Presentation Type", flex: 1 },
    {
      field: "attachment_cert_path",
      type: "actions",
      flex: 1,
      headerName: "Certificate",
      getActions: (params) => [
        params.row.attachment_cert_path ? (
          <IconButton
            onClick={() => handleDownload(params.row.attachment_cert_path)}
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
    {
      field: "attachment_paper_path",
      type: "actions",
      flex: 1,
      headerName: "Conference Paper",
      getActions: (params) => [
        params.row.attachment_paper_path ? (
          <IconButton
            onClick={() =>
              handleDownloadConferencePaper(params.row.attachment_paper_path)
            }
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
      .get(`/api/employee/conferenceDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownloadConferencePaper = async (path) => {
    await axios
      .get(`/api/employee/conferenceFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/conferenceCertificateFileviews?fileName=${path}`, {
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
export default ConferenceReport;
