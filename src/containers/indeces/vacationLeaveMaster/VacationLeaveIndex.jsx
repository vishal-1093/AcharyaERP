import { useState, useEffect,lazy } from "react";
import {
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
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
  vacationLeaveList: [],
  modalOpen: false,
  modalContent: modalContents,
};

const VacationLeaveIndex = () => {
  const [{ vacationLeaveList, modalOpen, modalContent }, setState] =
    useState(initialState);
  const [tab, setTab] = useState("Vacation Leave");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Vacation Leave" }]);
    getVacationLeaveData();
  }, []);

  const columns = [
    { field: "leave_type_short", headerName: "Leave", flex: 1 },
    { field: "school_name_short", headerName: "Institute", flex: 1 },
    {
      field: "frontendUseFromDate",
      headerName: "From Date",
      flex: 1,
 //     type: "date",
      valueGetter: (value, row) =>
        row?.frontendUseFromDate
          ? moment(row?.frontendUseFromDate).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "frontendUseToDate",
      headerName: "To Date",
      flex: 1,
  //    type: "date",
      valueGetter: (value, row) =>
        row?.frontendUseToDate
          ? moment(row?.frontendUseToDate).format("DD-MM-YYYY")
          : "",
    },
    { field: "permittedDays", headerName: "Days Permitted", flex: 1 },
    {
      field: "ac_year",
      headerName: "Academic Year",
      flex: 1,
    },
    { field: "createdUsername", headerName: "Created By", flex: 1, hide: true },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      hide: true,
 //     type: "date",
      valueGetter: (value, row) =>
        row?.createdDate
          ? moment(row?.createdDate).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="Edit">
          <IconButton
            onClick={() =>
              navigate(`/vacationLeaveForm`, {
                state: params.row,
              })
            }
            disabled={!params.row.active}
          >
            <EditIcon fontSize="small" />
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

  const getVacationLeaveData = async () => {
    try {
      const res = await axios.get(
        `api/fetchAllVacationHolidayCalendar?page=0&page_size=10&sort=createdDate`
      );
      setState((prevState) => ({
        ...prevState,
        vacationLeaveList: res?.data?.data?.Paginated_data?.content,
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
    getVacationLeaveData();
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
          const res = await axios.delete(
            `/api/deactivateVacationHolidayCalendar/${id}`
          );
          if (res.status === 200) {
            setLoadingAndGetData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          const res = await axios.delete(
            `/api/activateVacationHolidayCalendar/${id}`
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
      <Tabs value={tab}>
        <Tab value="Vacation Leave" label="Vacation Leave" />
      </Tabs>
      <Box sx={{ position: "relative", mt: 2 }}>
        {!!modalOpen && (
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />
        )}
        <Button
          onClick={() => navigate("/vacationLeaveForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={vacationLeaveList} columns={columns} />
      </Box>
    </>
  );
};

export default VacationLeaveIndex;
