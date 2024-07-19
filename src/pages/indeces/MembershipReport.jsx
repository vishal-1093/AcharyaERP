import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";

const empId = sessionStorage.getItem("empId");

function MembershipReport() {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "membership_type", headerName: "Membership Type", flex: 1 },
    {
      field: "professional_body",
      headerName: "Professional Body/Society",
      flex: 1,
    },
    { field: "member_id", headerName: "Membership ID", flex: 1 },
    { field: "citation", headerName: "Membership Citation", flex: 1 },
    { field: "year", headerName: "Year of Joining", flex: 1 },
    {
      field: "nature_of_membership",
      headerName: "Nature of Membership",
      flex: 1,
    },
    { field: "priority", headerName: "Priority", flex: 1 },
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
      .get(`/api/employee/membershipDetailsBasedOnEmpId/${empId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/membershipFileviews?fileName=${path}`, {
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
export default MembershipReport;
