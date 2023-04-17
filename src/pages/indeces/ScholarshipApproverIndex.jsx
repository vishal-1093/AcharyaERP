import { useState, useEffect } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, IconButton, Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { convertToDMY } from "../../utils/DateTimeUtils";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";

function ScholarshipApproverIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable: false,
    },
    {
      field: "username",
      headerName: "Requested By",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_date",
      headerName: "Requested Date",
      flex: 1,
      hideable: false,
      valueGetter: (params) =>
        params.row.created_date
          ? convertToDMY(params.row.created_date.slice(0, 10))
          : "",
    },
    {
      field: "requested_scholarship",
      headerName: "Requested Scholarship",
      flex: 1,
      hideable: false,
    },
    {
      field: "verified_amount",
      headerName: "Verified Scholarship",
      flex: 1,
      hideable: false,
    },
    {
      field: "is_approved",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.row.is_approved ===
            <Typography variant="body2">Approved</Typography> ? (
              "Approved"
            ) : (
              <IconButton
                label="Result"
                color="primary"
                onClick={() =>
                  navigate(
                    `/ScholarshipApproverForm/${params.row.student_id}/${params.row.scholarship_id}`
                  )
                }
              >
                <AddBoxIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Approve Scholarship" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/getIsVerifiedDataForIndex?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default ScholarshipApproverIndex;
