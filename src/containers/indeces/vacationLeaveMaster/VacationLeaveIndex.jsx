import { useState, useEffect } from "react";
import { Tabs, Tab, IconButton } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import GridIndex from "../../../components/GridIndex";
import useAlert from "../../../hooks/useAlert";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

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
    { field: "leave_type_short", headerName: "Holiday Name", flex: 1 },
    { field: "school_name_short", headerName: "Institute", flex: 1 },
    {
      field: "fromDate",
      headerName: "From Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.fromDate
          ? moment(params.row.fromDate).format("DD-MM-YYYY")
          : "-",
    },
    {
      field: "toDate",
      headerName: "To Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.toDate
          ? moment(params.row.toDate).format("DD-MM-YYYY")
          : "-",
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
      type: "date",
      valueGetter: (params) =>
        params.row.createdDate
          ? moment(params.row.createdDate).format("DD-MM-YYYY")
          : "-",
    },
    {
      field: "id",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/vacationLeaveForm`, {
              state: params.row,
            })
          }
          color="primary"
        >
          <EditIcon fontSize="small" />
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
          <GridActionsCellItem
            icon={<Check />}
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
        ) : (
          <GridActionsCellItem
            icon={<HighlightOff />}
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
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
