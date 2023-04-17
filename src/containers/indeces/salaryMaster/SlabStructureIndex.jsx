import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Box, IconButton } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../services/Api";

function SlabStructureIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllSlabStructureDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = async (params) => {
    const id = params.row.id;
    await axios
      .delete(`/api/deleteSlabStructure/${id}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          window.location.reload();
        }
      })
      .catch((err) => console.error(err));
  };

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios
          .delete(`/api/SlabStructure/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/activateSlabStructure/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
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
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };
  const columns = [
    {
      field: "slab_details_short_name",
      headerName: "Slab",
      flex: 1,
    },
    {
      field: "min_value",
      headerName: "Minimum",
      flex: 1,
    },
    { field: "max_value", headerName: "Maximum", flex: 1 },
    { field: "head_value", headerName: "Amount", flex: 1 },

    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() => navigate(`/SlabStructureUpdate/${params.row.id}`)}
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
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Delete"
          style={{ color: "red" }}
          onClick={() => handleDelete(params)}
        >
          <DeleteIcon />
        </IconButton>,
      ],
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Button
        onClick={() => navigate("/SlabStructureForm")}
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

export default SlabStructureIndex;
