import { useState, useEffect, lazy } from "react";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const GridIndex = lazy(() => import("../../../components/GridIndex"));
const CustomModal = lazy(() => import("../../../components/CustomModal"));

function MealAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const setCrumbs = useBreadcrumbs();

  const navigate = useNavigate();

  useEffect(() => {
    getData();
     setCrumbs([{ name: "Vendor Assignment Index" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllMealVendorAssignmentDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios.delete(`/api/deactivateMealVendorAssignment/${id}`).then((res) => {
          if (res.status === 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        await axios.delete(`/api/activateMealVendorAssignment/${id}`).then((res) => {
          if (res.status === 200) {
            getData();
            setModalOpen(false);
          }
        });
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
  };
  const columns = [
    { field: "meal_type", headerName: "Meal Type", flex: 1 ,
    renderCell: (params) => (
         <Typography
           variant="body2"
          sx={{ paddingLeft:0 }}
         >
          { params.row?.meal_type ? params.row?.meal_type : params.row?.mess_meal_type}
         </Typography>
       ),
   },
   { field: "vendor_name", headerName: "Vendor Name", flex: 1 ,
    renderCell: (params) => (
         <Typography
           variant="body2"
          sx={{ paddingLeft:0 }}
         >
          { params.row?.vendor_name}
         </Typography>
       ),
   },
   { field: "rate_per_count", headerName: "Rate", flex: 1 ,
    renderCell: (params) => (
         <Typography
           variant="body2"
          sx={{ paddingLeft:0 }}
         >
          { params.row?.rate_per_count}
         </Typography>
       ),
   },
    
   {
    field: "menu_contents",
    headerName: "Menu",
    flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.row.menu_contents} arrow>
        <Typography
          variant="body2"
         
          sx={{
           
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 130,
          }}
        >
          {params.row.menu_contents?.length > 30
            ? `${params.row.menu_contents?.slice(0, 32)}...`
            : params.row.menu_contents}
        </Typography>
      </Tooltip>
    ),
  },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,

      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/CateringMaster/MealAssign/Update/${params.row.id}`)
          }
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
  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Button
        onClick={() => navigate("/CateringMaster/MealAssign/New")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top:-47, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default MealAssignmentIndex;
