import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import ModalWrapper from "../../../components/ModalWrapper";
import VisibilityIcon from "@mui/icons-material/Visibility";

function SchoolVisionIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisionOpen, setModalVisionOpen] = useState(false);
  const [programVision, setProgramVision] = useState(null);
  const [programMission, setProgramMission] = useState(null);

  const navigate = useNavigate();

  const columns = [
    { field: "school_name_short", headerName: "School", flex: 0.5 },
    {
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton onClick={() => handleView(params)} sx={{ padding: 0 }}>
          <VisibilityIcon sx={{ color: "auzColor.main" }} />
        </IconButton>,
      ],
    },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.createdDate),
    },
    {
      field: "id",
      type: "actions",
      flex: 0.5,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/InstituteMaster/SchoolVision/Update/${params.row.id}`)
          }
          sx={{ padding: 0 }}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "green" }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "red" }}
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

  const handleView = (params) => {
    setModalVisionOpen(true);
    setProgramVision(params.row.asvVision);
    setProgramMission(params.row.asvMission);
  };

  const getData = async () => {
    await axios
      .get(
        `/api/academic/academicSchoolVision?page=0&page_size=10000&sort=createdDate`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/academicSchoolVision/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateAcademicSchoolVision/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
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

      <ModalWrapper
        maxWidth={800}
        open={modalVisionOpen}
        setOpen={setModalVisionOpen}
      >
        <Box mt={4} p={1}>
          <Grid container columnSpacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Vision"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "auzColor.main",
                    color: "headerWhite.main",
                    padding: 1,
                    textAlign: "center",
                  }}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "justify", textTransform: "capitalize" }}
                  >
                    {programVision?.toLowerCase()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Mission"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "auzColor.main",
                    color: "headerWhite.main",
                    padding: 1,
                    textAlign: "center",
                  }}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "justify", textTransform: "capitalize" }}
                  >
                    {programMission?.toLowerCase()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/InstituteMaster/SchoolVision/New")}
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
export default SchoolVisionIndex;
