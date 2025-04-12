import { useState, useEffect, lazy } from "react";
import {
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  Grid,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import EditIcon from "@mui/icons-material/Edit";
const GridIndex = lazy(() => import("../../../components/GridIndex"));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const initialState = {
  fineSlabList: []
};

const FineSlabIndex = () => {
  const [
    { fineSlabList},
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState([]);

  useEffect(() => {
    setCrumbs([]);
    getFineSlabData();
  }, []);

  const columns = [
    { field: "week", headerName: "Week", flex: 1 },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 1,
      renderCell: (params) => `${params.row?.percentage} %`,
    },
    { field: "fromDate", headerName: "From Date", flex: 1 },
    { field: "tillDate", headerName: "Till Date", flex: 1 },
    {
      field: "fineSlabId",
      headerName: "Edit",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="Edit">
          <IconButton
            onClick={() =>
              navigate(`/fine-slab-form`, {
                state: params.row,
              })
            }
            disabled={!!params.row?.tillDate}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
  ];

  const getFineSlabData = async () => {
    try {
      const res = await axios.get(`/api/getFineSlab`);
      if (res.status == 200 || res.status == 201) {
        const list = res?.data?.data?.map((el, index) => ({
          ...el,
          id: index + 1,
        }));
        setState((prevState) => ({
          ...prevState,
          fineSlabList: list.reverse(),
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: 30,
          marginTop: { xs: -2, md: -1 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/fine-slab-form")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ position: "relative" }}>
        <Box sx={{ position: "absolute", width: "100%", marginTop: { xs: 10, md: 4 },}}>
          <GridIndex rows={fineSlabList} columns={columns} 
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}/>
        </Box>
      </Box>
    </>
  );
};

export default FineSlabIndex;
