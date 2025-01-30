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
};

const VacationLeaveIndex = () => {
  const [{ studentBonafideList }, setState] = useState(initialState);
  const [tab, setTab] = useState("Student Bonafide");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

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
      type: "date",
      valueGetter: (params) =>
        params.row.created_Date
          ? moment(params.row.created_Date).format("DD-MM-YYYY")
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
  }

  const getStudentBonafideData = async () => {
    try {
      const res = await axios.get(
        `/api/student/fetchAllStudentBonafide?page=0&page_size=1000000&sort=created_Date`
      );
      setState((prevState) => ({
        ...prevState,
        studentBonafideList: res?.data?.data?.Paginated_data?.content,
      }));
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
          marginTop: { xs: -2, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/BonafideForm")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: { xs: 10, md: 3 } }}>
        <GridIndex rows={studentBonafideList} columns={columns} />
      </Box>
    </>
  );
};

export default VacationLeaveIndex;
