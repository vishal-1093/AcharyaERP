import { useState, useEffect, lazy } from "react";
import {
  Grid,
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
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import moment from "moment";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check ,HighlightOff} from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomModal from "../../../components/CustomModal";
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
  hostelWaiverList: [],
  modalOpen: false,
  attachmentModal: false,
  fileUrl: "",
  modalContent: modalContents,
};

const HostelWaiverIndex = () => {
  const [{ hostelWaiverList, modalOpen, modalContent,attachmentModal,fileUrl }, setState] =
    useState(initialState);
  const [tab, setTab] = useState("hostelWaiver");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Hostel Waiver" }]);
    getHostelWaiverData();
  }, []);

  const columns = [
    { field: "auid", headerName: "Auid", flex: 1 },
    { field: "student_name", headerName: "Name", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    {
      field: "ac_year",
      headerName: "Academic Year",
      flex: 1,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
    },
    {
      field: "total_amount",
      headerName: "Waiver Amount",
      flex: 1,
      align: "right",
      headerAlign: "right"
    },
    {
      field: "bedName",
      headerName: "Bed Name",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Pay Type",
      flex: 1,
    },
    {
      field: "hw_attachment_path",
      headerName: "Attachment",
      flex: 1,
      hide:true,
      type: "actions",
      getActions: (params) => [
        <HtmlTooltip title="View Acerp Attachment">
          <IconButton
            onClick={() => getUploadData(params.row?.hw_attachment_path)}
            disabled={!params.row.hw_attachment_path ||  !params.row.active || params.row.type != "Waiver"}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1, hide: true },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "modified_by",
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
      valueGetter: (value, row) =>
        (row.modified_date !== row.created_date)
          ? moment(row.modified_date).format("DD-MM-YYYY")
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
              navigate(`/HostelWaiverForm`, {
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
        ): (
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

  const getHostelWaiverData = async () => {
    try {
      const res = await axios.get(
        `/api/finance/fetchAllHostelWaiver?page=0&page_size=1000000&sort=created_date`
      );
      if(res.data.status == 200 || res.data.status == 201){
        const lists = res.data?.data?.Paginated_data?.content;
        setState((prevState) => ({
          ...prevState,
          hostelWaiverList: lists,
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

  const handleActive = async (params) => {
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        try {
          const res = await axios.delete(
            `/api/finance/deactivatehostelwaiver/${params.row.id}`
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
      }else {
        try {
          const res = await axios.delete(
            `/api/finance/activatehostelwaiver/${params.row.id}`
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
    params.row.active === true ?
      setModalContent("", "Do you want to make it Inactive?", [
        { name: "No", color: "primary", func: () => {} },
        { name: "Yes", color: "primary", func: handleToggle },
      ]): 
      setModalContent("", "Do you want to make it Active?", [
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
    getHostelWaiverData();
    setModalOpen(false);
  };

  const getUploadData = async (hwAttachPath) => {
    await axios(
      `/api/finance/hostelWaiverFileDownload?fileName=${hwAttachPath}`,
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
      <Tabs value={tab}>
        <Tab value="hostelWaiver" label="Hostel Waiver" />
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
          onClick={() => navigate("/HostelWaiverForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={hostelWaiverList || []} columns={columns} />
        {!!attachmentModal && (
          <ModalWrapper
            title="Hostel Waiver Attachment"
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
      </Box>
    </>
  );
};

export default HostelWaiverIndex;
