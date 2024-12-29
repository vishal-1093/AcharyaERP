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
import { Button, Box } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
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

const PermissionIndex = () => {
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
  const [tab, setTab] = useState("Permission");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([]);
    getStudentPermissionData();
  }, []);

  const columns = [
    { field: "auid", headerName: "Auid", flex: 1 },
    {
      field: "tillDate",
      headerName: "Till Date",
      flex: 1,
      renderCell: (params) => (
        <>
          {!!params.row.tillDate
            ? moment(params.row.tillDate).format("DD-MM-YYYY")
            : "-"}
        </>
      ),
    },
    {
      field: "totalDue",
      headerName: "Total Due",
      flex: 1
    },
    {
      field: "concessionAmount",
      headerName: "Concession Amount",
      flex: 1
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    {
      field: "file",
      headerName: "Attachment",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <HtmlTooltip title="View Attachment">
          <IconButton
            onClick={() => getUploadData(params.row?.file)}
            disabled={!params.row.file}
          >
            <VisibilityIcon fontSize="small" color={!params.row.file ? "secondary" : "primary"} />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    // {
    //   field: "created_username",
    //   headerName: "Created By",
    //   flex: 1,
    //   hide: true,
    // },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) =>
        params.row.createdDate
          ? moment(params.row.createdDate).format("DD-MM-YYYY")
          : "",
    },
    // {
    //   field: "modified_username",
    //   headerName: "Modified By",
    //   flex: 1,
    //   hide: true,
    // },
    {
      field: "modifiedDate",
      headerName: "Modified Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) =>
        params.row.modifiedDate !== params.row.createdDate
          ? moment(params.row.modifiedDate).format("DD-MM-YYYY")
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
              navigate(`/permission-form`, {
                state: { ...params.row, permissionType: "Fine Waiver" },
              })
            }
          // disabled={!params.row.active}
          >
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    // {
    //   field: "active",
    //   headerName: "Active",
    //   flex: 1,
    //   type: "actions",
    //   getActions: (params) => [
    //     params.row.active === true ? (
    //       <HtmlTooltip title="Make list inactive">
    //         <GridActionsCellItem
    //           icon={<Check />}
    //           label="Result"
    //           style={{ color: "green" }}
    //           onClick={() => handleActive(params)}
    //         >
    //           {params.active}
    //         </GridActionsCellItem>
    //       </HtmlTooltip>
    //     ) : (
    //       <HtmlTooltip title="Make list active">
    //         <GridActionsCellItem
    //           icon={<HighlightOff />}
    //           label="Result"
    //           style={{ color: "red" }}
    //           onClick={() => handleActive(params)}
    //         >
    //           {params.active}
    //         </GridActionsCellItem>
    //       </HtmlTooltip>
    //     ),
    //   ],
    // },
  ];

  const getStudentPermissionData = async () => {
    try {
      const res = await axios.get(
        `/api/student/getFineConcession`
      );
      if (res.status == 200 || res.status == 201) {
        const list = res?.data?.data?.map((el, index) => ({
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
    getStudentPermissionData();
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
      `/api/student/studentPermissionFileDownload?pathName=${permissionAttachment}`,
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

  const handleActive = async (params) => {
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        try {
          const res = await axios.delete(
            `/api/student/deleteStudentPermission?auid=${params.row?.auid}&currentSem=${params.row?.currentSem}&permissionType=${params.row?.permissionType}`
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
            `/api/student/activateStudentPermission?auid=${params.row?.auid}&currentSem=${params.row?.currentSem}&permissionType=${params.row?.permissionType}`
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
        { name: "No", color: "primary", func: () => { } },
        { name: "Yes", color: "primary", func: handleToggle },
      ])
      : setModalContent("", "Do you want to make it Active?", [
        { name: "No", color: "primary", func: () => { } },
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

      {!!attachmentModal && (
        <ModalWrapper
          title="Fine Concesssion Attachment"
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
          marginTop: { xs: -1, md: -5 },
        }}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => navigate("/permission-form")}
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: { xs: 10, md: 2 } }}>
        <GridIndex rows={studentPermissionList} columns={columns} />
      </Box>
    </>
  );
};

export default PermissionIndex;
