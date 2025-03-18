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
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Box } from "@mui/material";
import axios from "../../../services/Api";
import moment from "moment";
import CustomModal from "../../../components/CustomModal";
const GridIndex = lazy(() => import("../../../components/GridIndex"));
const loggedInUserRole = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleId;

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
  examList: [],
  modalOpen: false,
  modalContent: modalContents,
};

const ExternalExamMark = () => {
  const [{ examList, modalOpen, modalContent }, setState] =
    useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "External Exam Mark" }]);
    getExamData();
  }, []);

  const getExamData = async () => {
    try {
      const res = await axios.get(
        `/api/academic/fetchAllExternalExamDetail?page=0&page_size=1000000&sort=created_date`
      );
      if (res.status == 200 || res.status == 201) {
        if (res.data.data.length > 0) {
          setState((prevState) => ({
            ...prevState,
            examList: res.data.data,
          }));
        }
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

  const columns = [
    { field: "ac_year", headerName: "Academic Year", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Program & Specilization",
      flex: 1,
    },
    { field: "course_short_name", headerName: "Subject", flex: 1 },
    {
      field: "date_of_exam",
      headerName: "Exam Date",
      flex: 1,
      // type: "date",
      valueGetter: (value, row) =>
        row.date_of_exam && row.date_of_exam.length > 20
          ? moment(row.date_of_exam).format("DD-MM-YYYY")
          : row.date_of_exam,
    },
    {
      field: "current_year_sem",
      headerName: "Year/Sem",
      flex: 1,
      type: "string",
      valueGetter: (value, row) =>
        row.current_year && row.current_sem
          ? `${row.current_year}/${row.current_sem}`
          : "",
    },
    { field: "external_max_marks", headerName: "Maximum", flex: 1 },
    { field: "external_min_marks", headerName: "Minimum", flex: 1 },
    {
      field: "Add Mark",
      headerName: "Add Mark",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <HtmlTooltip title="Add Marks">
          <IconButton
            onClick={() => addMarks(params)}
            disabled={!params.row.active}
          >
            <AddIcon fontSize="small" color="primary" />
          </IconButton>
        </HtmlTooltip>,
      ],
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
      // type: "date",
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "modified_username",
      headerName: "Modified By",
      flex: 1,
      hide: true,
    },
    {
      field: "modified_date",
      headerName: "Modified Date",
      flex: 1,
      hide: true,
      // type: "date",
      valueGetter: (value, row) =>
        row.modified_date !== row.created_date
          ? moment(row.modified_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "id",
      headerName: "Edit",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="Edit">
          <IconButton
            onClick={() =>
              navigate(`/external-exam-mark-form`, {
                state: params.row,
              })
            }
            disabled={!params.row.active || loggedInUserRole !== 1}
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

  const addMarks = async (params) => {
    try {
      const res = await axios.get(
        `api/academic/studentsForExternalMarksAssignment?acYearId=${params.row?.ac_year_id}&currentYear=${params.row?.current_year}&currentSem=${params.row?.current_sem}&specializationId=${params.row?.program_specialization_id}`
      );
      if (res.status == 200 || res.status == 201) {
        navigate("/external-exam-add-mark", {
          state: {
            studentList: res.data.data,
            externalMarksDetails: params.row,
          },
        });
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

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const handleModal = () => {
    getExamData();
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
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        try {
          const res = await axios.delete(
            `/api/academic/deactivateInternalSessionCreation/${params.row?.id}`
          );
          if (res.status === 200 || res.status == 201) {
            handleModal();
          }
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured !!",
          });
          setAlertOpen(true);
        }
      } else {
        try {
          const res = await axios.delete(
            `/api/academic/activateInternalSessionCreation/${params.row?.id}`
          );
          if (res.status === 200 || res.status == 201) {
            handleModal();
          }
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured !!",
          });
          setAlertOpen(true);
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
        mb={2}
        sx={{
          marginTop: { xs: -1, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/External-exam-mark-form")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <GridIndex rows={examList || []} columns={columns} />
      </Box>
    </>
  );
};

export default ExternalExamMark;
