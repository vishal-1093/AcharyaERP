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
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalWrapper from "../../components/ModalWrapper";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
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
  directDemandList: [],
  modalOpen: false,
  modalContent: modalContents,
  attachmentModal: false,
  fileUrl: null,
};

const DirectDemandIndex = () => {
  const [
    { directDemandList, modalOpen, modalContent, fileUrl, attachmentModal },
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Direct Demand" }]);
    getDirectDemandList();
  }, []);

  const columns = [
    { field: "category_detail", headerName: "Category", flex: 1 },
    {
      field: "requested_amount",
      headerName: "Requested Amount",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Pay by Date",
      flex: 1,
      renderCell: (params) => moment(params.row?.date).format("DD-MM-YYYY"),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "attachment_path",
      headerName: "Attachment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <HtmlTooltip title="View DD Attachment">
          <IconButton
            onClick={() => getUploadData(params.row?.attachment_path)}
            disabled={!params.row.attachment_path || !params.row.active}
          >
            {!params.row.active || !params.row.attachment_path ? (
              <VisibilityIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" color="primary" />
            )}
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
      type: "date",
      valueGetter: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
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
      type: "date",
      valueGetter: (params) =>
        params.row.modified_date !== params.row.created_date
          ? moment(params.row.modified_date).format("DD-MM-YYYY")
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
            disabled={!params.row.active}
            onClick={() =>
              navigate(`/direct-demand-form`, {
                state: params.row,
              })
            }
          >
            {!!params.row.active ? (
              <EditIcon fontSize="small" color="primary" />
            ) : (
              <EditIcon fontSize="small" />
            )}
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
        ,
      ],
    },
  ];

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        try {
          const res = await axios.delete(
            `api/finance/deActivateEnvBillDetails/${id}`
          );
          if (res.status === 200) {
            closeModalAndGetData();
          }
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: "An error occured",
          });
          setAlertOpen(true);
        }
      } else {
        try {
          const res = await axios.delete(
            `api/finance/activateEnvBillDetails/${id}`
          );
          if (res.status === 200) {
            closeModalAndGetData();
          }
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: "An error occured",
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

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const closeModalAndGetData = () => {
    getDirectDemandList();
    setModalOpen(false);
  };

  const getDirectDemandList = async () => {
    try {
      const res = await axios.get(
        `api/finance/fetchAllEnvBillDetails?page=0&page_size=100000000&sort=created_date`
      );
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          directDemandList: res?.data?.data?.Paginated_data?.content,
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

  const getUploadData = async (ddAttachment) => {
    await axios(
      `/api/finance/EnvBillDetailsFileviews?fileName=${ddAttachment}`,
      {
        method: "GET",
        responseType: "blob",
      }
    )
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        setState((prevState) => ({
          ...prevState,
          attachmentModal: !attachmentModal,
          fileUrl: url,
        }));
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: "An error occured",
        });
        setAlertOpen(true);
      });
  };

  const handleViewAttachmentModal = () => {
    setState((prevState) => ({
      ...prevState,
      attachmentModal: !attachmentModal,
    }));
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
              onClick={() => navigate("/direct-demand-form")}
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
        <GridIndex rows={directDemandList || []} columns={columns} />
      </Box>
      {!!attachmentModal && (
        <ModalWrapper
          title="Direct Demand Attachment"
          maxWidth={600}
          open={attachmentModal}
          setOpen={() => handleViewAttachmentModal()}
        >
          <Grid container>
            <Grid item xs={12} md={12}>
              {!!fileUrl ? (
                <iframe
                  width="100%"
                  style={{ height: "100vh" }}
                  src={fileUrl}
                ></iframe>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </ModalWrapper>
      )}
    </>
  );
};

export default DirectDemandIndex;
