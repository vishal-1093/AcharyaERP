import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: "auto",
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

const initialValues = {
  acYearId: null,
};

const row = [
  {
    id: 1,
    ac_year: "2024-2025",
    school_name: "AIT",
    board_name: "KEA",
    feetemplate_name: "TEST1234",
    neft_no: "Test@1234",
    receipt_no: 12,
    amount: 5000000,
  },
];

function PaidAtBoardIndex() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getAcademicyear();
  }, []);

  useEffect(() => {
    getDataBasedOnAcYear();
  }, [values.acYearId]);

  const getAcademicyear = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      const ids = [];
      response.data.data
        .filter((val) => {
          return val.current_year >= 2023;
        })
        .forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
          ids.push(obj.current_year);
        });

      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === 2024
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        yearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };

  const getDataBasedOnAcYear = async () => {
    if (!values.acYearId) return;

    let url;

    url = `/api/academic/getLessonPlan/${values.yearId}`;

    try {
      const response = await axios.get(url);
      setRows(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const columns = [
    {
      field: "ac_year",
      headerName: "Ac Year",
      flex: 1,
    },
    {
      field: "school_name",
      headerName: "School",
      flex: 1,
    },
    {
      field: "board_name",
      headerName: "Board",
      flex: 1,
    },
    {
      field: "feetemplate_name",
      headerName: "Template",
      flex: 1,
    },
    {
      field: "neft_no",
      headerName: "Neft No.",
      flex: 1,
    },
    { field: "receipt_no", headerName: "Receipt No.", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },

    {
      field: "tag",
      type: "actions",
      flex: 1,
      headerName: "Tag",
      getActions: () => [
        <IconButton
          onClick={() => navigate(`/paid-at-board-std-list`)}
          color="primary"
        >
          <AddCircleRoundedIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "edit",
      type: "actions",
      flex: 1,
      headerName: "Status",
      getActions: () => [
        <Typography color="green" variant="subtitle2">
          Editable
        </Typography>,
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
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/LessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getDataBasedOnAcYear();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateLessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getDataBasedOnAcYear();
              setModalOpen(false);
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
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
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
      <Grid
        container
        justifyContent="flex-start"
        rowSpacing={2}
        columnSpacing={2}
        alignItems="center"
      >
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="acYearId"
            label="Ac Year"
            value={values.acYearId}
            handleChangeAdvance={handleChangeAdvance}
            options={academicYearOptions}
          />
        </Grid>
        <Grid item xs={12} md={10} align="right">
          <Button
            sx={{ borderRadius: 2 }}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/std-paid-board`)}
          >
            Create
          </Button>
        </Grid>
        <Grid item xs={12}>
          <GridIndex rows={row} columns={columns} />
        </Grid>
      </Grid>
    </>
  );
}

export default PaidAtBoardIndex;
