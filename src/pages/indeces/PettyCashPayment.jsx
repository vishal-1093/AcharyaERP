import { useState, useEffect, lazy } from "react";
import {
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  Grid,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
const GridIndex = lazy(() => import("../../components/GridIndex"));

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
  studentPermissionList: [],
  modalOpen: false,
  modalContent: modalContents,
  attachmentModal: false,
  fileUrl: null,
};

const PettyCashPaymentIndex = () => {
  const [
    {
      studentPermissionList,
      modalOpen,
      modalContent,
      fileUrl,
      attachmentModal,
    },
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    modified_date: false,
    modified_username: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([]);
    getData();
  }, []);

  const columns = [
    { field: "school_name_short", headerName: "Inst", flex: 1 },
    {
      field: "created_date",
      headerName: "Date",
      flex: 1,
      valueGetter: (value,row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "amount", headerName: "Amount", flex: 1,type:"number"},
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    { field: "remark", headerName: "Remarks", flex: 1 },
    {
      field: "modified_username",
      headerName: "Modified By",
      flex: 1,
    },
    {
      field: "modified_date",
      headerName: "Modified Date",
      flex: 1,
      valueGetter: (value,row) =>
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
              navigate(`/petty-cash-payment-form`, {
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

  const getData = async () => {
    try {
      const res = await axios.get(
        `/api/finance/fetchAllPettyCash?page=0&page_size=1000&sort=amount`
      );
      if (res.status == 200 || res.status == 201) {
        const list = res?.data?.data.Paginated_data.content;
        setState((prevState) => ({
          ...prevState,
          studentPermissionList: list,
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

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const setLoadingAndGetData = () => {
    getData();
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
            `api/finance/deactivate/${params.row.id}`
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
            `api/finance/activate/${params.row.id}`
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
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => { } },
      ])
      : setModalContent("", "Do you want to make it Active?", [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => { } },
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
          position: "relative",
          marginTop: { xs: -1},
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/petty-cash-payment-form")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        <Grid sx={{ position: "relative", marginTop: { xs: 8, md: 1 } }}>
          <Box sx={{ position: "absolute", width: "100%",}}>
            <GridIndex rows={studentPermissionList} columns={columns} columnVisibilityModel={columnVisibilityModel}
              setColumnVisibilityModel={setColumnVisibilityModel} />
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default PettyCashPaymentIndex;
