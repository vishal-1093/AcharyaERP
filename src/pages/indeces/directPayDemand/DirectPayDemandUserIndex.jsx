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
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
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
  studentPermissionList: [],
  modalOpen: false,
  modalContent: modalContents,
  attachmentModal: false,
  fileUrl: null,
};
const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const DirectPayDemandUserIndex = () => {
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
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
      created_username: false
    });
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  
  useEffect(() => {
    setCrumbs([{ name: "Direct Demand User" }]);
    getData();
  }, []);

  const columns = [
    { field: "category_detail", headerName: "Demand Type", flex: 1.2 },
    { field: "requested_amount", headerName: "Requested Amount", align: "center", flex: 1 },
    {
      field: "date",
      headerName: "Pay By Date",
      flex: 1,
      renderCell: (params) => (
        <>
          {!!params.row.date
            ? moment(params.row.date).format("DD-MM-YYYY")
            : "-"}
        </>
      ),
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "attachment",
      headerName: "Attachment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <HtmlTooltip title="View Attachment">
          <IconButton
            onClick={() => getUploadData(params.row?.attachment_path)}
            disabled={!params.row.attachment_path || !params.row.active}
          >
            <VisibilityIcon fontSize="small" color="primary"/>
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    }
  ];

  const getData = async () => {
    try {
      const res = await axios.get(
        `/api/finance/fetchAllEnvBillDetails?page=0&page_size=1000000&sort=created_date&created_by=${userId}`
      );
      if (res.status == 200 || res.status == 201) {
        const list = res?.data?.data.Paginated_data.content?.map((el, index) => ({
          ...el,
          id: index + 1,
        }));
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

  const getUploadData = async (permissionAttachment) => {
    await axios(
      `/api/finance/EnvBillDetailsFileviews?fileName=${permissionAttachment}`,
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
      .catch((error) => console.error(error));
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

      {!!attachmentModal && (
        <ModalWrapper
          title="Direct Pay Demand Attachment"
          maxWidth={1000}
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
      <Box
        mb={2}
        sx={{
          marginTop: { xs:1, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/directpay-demand-form",{state:{path:"direct-demand-user",value:null}})}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ position: "relative", marginTop: { xs:5, md:-1 }}}>
        <Box sx={{ position: "absolute", width: "100%",}}>
          <GridIndex rows={studentPermissionList} columns={columns} columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel} />
        </Box>
      </Box>
    </>
  );
};

export default DirectPayDemandUserIndex;
