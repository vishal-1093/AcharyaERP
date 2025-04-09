import { useState, useEffect, lazy } from "react";
import {
  IconButton,
  Tooltip,
  styled,
  tooltipClasses
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import axios from "../../../services/Api";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  studentBonafideList: [],
  loading:false
};

const VacationLeaveIndex = () => {
  const [{ studentBonafideList ,loading}, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState([]);

  useEffect(() => {
    setCrumbs([{ name: "Bonafide Index" }]);
    getStudentBonafideData();
  }, []);

  const columns = [
    { field: "bonafide_number", headerName: "Refrence Number", flex: 1 },
    { field: "auid", headerName: "Auid", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "bonafide_type", headerName: "Bonafide Type", flex: 1 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_Date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_Date
          ? moment(row.created_Date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "id",
      headerName: "View Bonafide",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="View Bonafide">
          <IconButton
            onClick={() =>onClickViewBonafide(params.row)
            }
            disabled={!params.row.active}
          >
            <VisibilityIcon fontSize="small" sx={{ cursor: "pointer" }} />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
  ];

  const onClickViewBonafide = async(rowValue) => {
    try {
      const res = await axios.get("api/categoryTypeDetailsOnBonafide");
      if(res.status == 200 || res.status == 201){
        const lists = res?.data?.data.map((obj) => ({
          label: obj.category_detail,
          name:  obj.category_name_sort
        }));
        const name = lists.find((ele)=>ele.label == rowValue?.bonafide_type)?.name;
        navigate(`/BonafideView`, {
          state: {
            studentAuid: rowValue?.auid,
            bonafideType: rowValue?.bonafide_type,
            bonafideName: name,
            page: "Index",
            semRange: null,
          },
        })
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getStudentBonafideData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/student/fetchAllStudentBonafide?page=0&page_size=1000000&sort=created_Date`
      );
      setState((prevState) => ({
        ...prevState,
        studentBonafideList: res?.data?.data?.Paginated_data?.content,
        loading:false
      }));
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
      setLoading(false)
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        onClick={() => navigate("/BonafideForm")}
        variant="contained"
        disableElevation
        startIcon={<AddIcon />}
        sx={{ position: "absolute", right: 0, marginTop: { xs: 1, md: -6 }, borderRadius: 2 }}
      >
        Create
      </Button>
      <Box sx={{ position: "absolute", width: "100%", marginTop: { xs: 10, md: -1 },  }}>
        <GridIndex rows={studentBonafideList} columns={columns}
          loading={loading}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel} />
      </Box>
    </Box>
  );
};

export default VacationLeaveIndex;
