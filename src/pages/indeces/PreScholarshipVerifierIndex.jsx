import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton, Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function PreScholarshipVerifierIndex() {
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    {
      field: "application_no_npf",
      headerName: "Application No",
      flex: 1,
      hideable: false,
    },
    {
      field: "id",
      headerName: "Candidate Id",
      flex: 1,
      hideable: false,
    },
    {
      field: "student_name",
      headerName: "Applicant Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hideable: false,
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      hideable: false,
    },
    {
      field: "program_specialization_short_name",
      headerName: "Program Specialization",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_username",
      headerName: "Counselor Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "requested_scholarship",
      headerName: "Request Amount",
      flex: 1,
      hideable: false,
    },
    {
      field: "is_verified",
      headerName: "Verify",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.row.is_verified ? (
              <Typography
                variant="subtitle2"
                color="textSuccess"
                style={{ color: "green" }}
              >
                verified
              </Typography>
            ) : (
              <IconButton
                label="Result"
                color="primary"
                onClick={() =>
                  navigate(`/PreScholarshipVerifierForm/${params.row.id}`)
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
    setCrumbs([{ name: "Verify Pre Scholarship" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/fetchScholarship3?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 3 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default PreScholarshipVerifierIndex;
