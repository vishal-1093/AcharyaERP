import { useState, useEffect, lazy } from "react";
import {
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  Grid,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
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

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  studentBonafideList: [],
  modalOpen: false,
  modalContent: modalContents,
};

const VacationLeaveIndex = () => {
  const [{ studentBonafideList, modalOpen, modalContent }, setState] =
    useState(initialState);
  const [tab, setTab] = useState("Student Bonafide");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Student Bonafide" }]);
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
      hide: true,
    },
    {
      field: "created_Date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
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
            onClick={() =>
              navigate(`/AcerpBonafideForm`, {
                state: params.row,
              })
            }
            disabled={!params.row.active}
          >
            <VisibilityIcon fontSize="small" sx={{ cursor: "pointer" }} />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <HtmlTooltip title="Make list inactive">
            <GridActionsCellItem
              icon={<Check />}
              label="Result"
              style={{ color: "green" }}
              onClick={() => handleActive(params)}
            >
              {params.active}
            </GridActionsCellItem>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title="Make list active">
            <GridActionsCellItem
              icon={<HighlightOff />}
              label="Result"
              style={{ color: "red" }}
              onClick={() => handleActive(params)}
            >
              {params.active}
            </GridActionsCellItem>
          </HtmlTooltip>
        ),
      ],
    },
  ];

  const getStudentBonafideData = async () => {
    try {
      const res = await axios.get(
        `/api/student/fetchAllStudentBonafide?page=0&page_size=1000&sort=created_by`
      );
      setState((prevState) => ({
        ...prevState,
        studentBonafideList: (res?.data?.data?.Paginated_data?.content).reverse(),
      }));
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const setLoadingAndGetData = () => {
    getStudentBonafideData();
    setModalOpen(false);
  };

  const setModalContent = (title, message, buttons) => {
    setState((prevState) => ({
      ...prevState,
      modalContent: {
        ...prevState.modalContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        try {
          const res = await axios.delete(`/api/student/studentBonafide/${id}`);
          if (res.status === 200) {
            setLoadingAndGetData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          const res = await axios.delete(
            `/api/student/activateStudentBonafide/${id}`
          );
          if (res.status === 200) {
            setLoadingAndGetData();
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    params.row.active === true
      ? setModalContent("", "Do you want to make it Inactive?", [
          { name: "No", color: "primary", func: () => {} },
          { name: "Yes", color: "primary", func: handleToggle },
        ])
      : setModalContent("", "Do you want to make it Active?", [
          { name: "No", color: "primary", func: () => {} },
          { name: "Yes", color: "primary", func: handleToggle },
        ]);
  };

  return (
    <>
      {!!modalOpen && (
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
      )}
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
              onClick={() => navigate("/AcerpBonafideForm")}
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
