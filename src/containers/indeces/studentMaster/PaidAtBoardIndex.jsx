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
import { Check, HighlightOff, Visibility } from "@mui/icons-material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

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
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([]);
  }, []);

  useEffect(() => {
    getData();
  }, [values.acYearId]);

  const getData = async () => {
    let url;

    url = `/api/finance/allBoardReceivedAmountDetails?page=${0}&pageSize=${100000000}&sort=createdDate`;

    try {
      const response = await axios.get(url);

      setRows(response.data.data.content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    {
      field: "acYear",
      headerName: "Ac Year",
      flex: 1,
      align: "center",
    },
    {
      field: "schoolNameShort",
      headerName: "School",
      flex: 1,
      align: "center",
    },
    {
      field: "boardUniqueShortName",
      headerName: "Board",
      flex: 1,
      align: "center",
    },
    {
      field: "feeTemplateName",
      headerName: "Template",
      flex: 1,
      align: "center",
    },
    {
      field: "neftNo",
      headerName: "Neft No.",
      flex: 1,
      align: "center",
    },
    {
      field: "bulkReceiptNo",
      headerName: "Receipt No.",
      flex: 1,
      align: "center",
    },
    { field: "amount", headerName: "Amount", flex: 1, align: "right" },
    {
      field: "remainingBalance",
      headerName: "Balance",
      flex: 1,
      align: "right",
    },

    {
      field: "taggedAmount",
      headerName: "Tagged Amount",
      flex: 1,
      align: "right",
    },

    { field: "remarks", headerName: "Remarks", flex: 1, align: "center" },

    {
      field: "tag",
      type: "actions",
      flex: 1,
      headerName: "Tag",
      getActions: (params) => [
        params.row.remainingBalance > 0 ? (
          <IconButton
            onClick={() =>
              navigate(`/paid-at-board-std-list`, {
                state: { rowData: params.row },
              })
            }
            color="primary"
          >
            <AddCircleRoundedIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={() =>
              navigate(`/paid-at-board-std-list`, {
                state: { rowData: params.row },
              })
            }
            color="primary"
          >
            <Visibility fontSize="small" />
          </IconButton>
        ),
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
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
      align: "center",
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) => moment(row.createdDate).format("DD-MM-YYYY"),
      align: "center",
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
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateLessonPlan/${id}`)
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
        {/* <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="acYearId"
            label="Ac Year"
            value={values.acYearId}
            handleChangeAdvance={handleChangeAdvance}
            options={academicYearOptions}
          />
        </Grid> */}
        <Grid item xs={12} md={12} align="right">
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
          <GridIndex rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </>
  );
}

export default PaidAtBoardIndex;
