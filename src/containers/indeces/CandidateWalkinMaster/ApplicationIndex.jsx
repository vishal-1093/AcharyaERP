import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { Link } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

function ApplicationIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const columns = [
    { field: "id", headerName: "Candidate Id", flex: 1 },
    { field: "candidate_name", headerName: "Name", flex: 1 },
    { field: "application_no_npf", headerName: "Application No", flex: 1 },
    { field: "mobile_number", headerName: " Mobile", flex: 1 },
    { field: "candidate_email", headerName: " Email", flex: 1 },

    { field: "school_name_short", headerName: "School ", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "is_approved",
      headerName: "Offer Letter",
      flex: 1,

      renderCell: (params) => {
        return (
          <>
            {params.row.is_scholarship ? (
              <Link
                to={`/PreAdmissionProcessForm/${params.row.id}`}
                style={{ textDecoration: "none" }}
              >
                {/* <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
                  <DescriptionOutlinedIcon />
                </IconButton> */}
                <Typography variant="body2">Pending</Typography>
              </Link>
            ) : (
              <Link to={`/PreAdmissionProcessForm/${params.row.id}`}>
                <IconButton style={{ color: "#4A57A9", textAlign: "center" }}>
                  <AddBoxIcon />
                </IconButton>
              </Link>
            )}
          </>
        );
      },
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      hide: true,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `${ApiUrl}/student/EditCandidateDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        console.log(Response.data.data.Paginated_data.content);
        setRows(Response.data.data.Paginated_data.content);
      });
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`${ApiUrl}/student/Candidate_Walkin/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`${ApiUrl}/student/activateCandidate_Walkin/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/CandidateWalkinMaster/Candidate/New")}
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
export default ApplicationIndex;
