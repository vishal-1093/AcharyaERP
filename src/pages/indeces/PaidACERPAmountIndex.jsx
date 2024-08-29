import { useState, useEffect, lazy } from "react";
import {
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  Grid,
  Box,
  Paper,
  Typography,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomModal from "../../components/CustomModal";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../services/Api";
import moment from "moment";
import ModalWrapper from "../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
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

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: "100%",
    margin: "20px 0",
  },
  tableBody: {
    height: 10,
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
  table: {
    "& .MuiTableCell-root": {
      minWidth: 100,
      border: "1px solid rgba(192,192,192,1)",
      fontSize: "15px",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: "50px",
    },
  },
}));

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  acerpAmountList: [],
  paidYearList: [],
  modalOpen: false,
  attachmentModal: false,
  modalContent: modalContents,
  isPaidYearModalOpen: false,
  fileUrl: "",
};

const PaidAcerpAmountIndex = () => {
  const [
    {
      acerpAmountList,
      modalOpen,
      modalContent,
      paidYearList,
      isPaidYearModalOpen,
      attachmentModal,
      fileUrl,
    },
    setState,
  ] = useState(initialState);
  const [tab, setTab] = useState("ACERP Amount");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    setCrumbs([{ name: "ACERP Amount" }]);
    getPaidAcerpAmountData();
  }, []);

  const getPaidAcerpAmountData = async () => {
    try {
      const res = await axios.get(
        `/api/student/fetchAllAcerpAmount?page=0&page_size=1000&sort=createdDate`
      );

      if (res?.status === 200 || res?.status === 201) {
        const list = res?.data?.data?.Paginated_data?.content;
        const updatedList = list.map((ele) => ({
          ...ele,
          acerpAmountList: Array.from(
            { length: ele?.number_of_semester },
            (_, i) => ({
              id: i + 1,
              paidYear: Number(`${ele[`paidYear${i + 1}`]}`) ||0,
            })
          ),
        }));
        const finalUpdatedList =
          !!updatedList.length &&
          updatedList.map((ele) => ({
            ...ele,
            acerpAmountTotal: ele.acerpAmountList.reduce((sum, current) => {
                return sum + current.paidYear;
            }, 0),
          }));
        setState((prevState) => ({
          ...prevState,
          acerpAmountList: finalUpdatedList,
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

  const columns = [
    { field: "auid", headerName: "Auid", flex: 1 },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "acerpAmountTotal", headerName: "Total Amount", flex: 1 },
    {
      field: "id",
      headerName: "View Amount",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <HtmlTooltip title="View Acerp Amount">
          <IconButton onClick={() => handleView(params)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "type", headerName: "Pay Type", flex: 1 },
    {
      field: "acerpAmountAttachPath",
      headerName: "Attachment",
      flex: 1,
      hide: true,
      type: "actions",
      getActions: (params) => [
        <HtmlTooltip title="View Acerp Attachment">
          <IconButton
            onClick={() => getUploadData(params.row?.acerpAmountAttachPath)}
            disabled={
              !params.row.acerpAmountAttachPath || params.row.type != "Waiver"
            }
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
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
    {
      field: "modifiedUsername",
      headerName: "Modified By",
      flex: 1,
    },
    {
      field: "modifiedDate",
      headerName: "Modified Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) =>
        (params.row.modifiedDate !== params.row.createdDate)
          ? moment(params.row.modifiedDate).format("DD-MM-YYYY")
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
              navigate(`/ACERPAmountForm`, {
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

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const setLoadingAndGetData = () => {
    getPaidAcerpAmountData();
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

  const handleView = (value) => {
    setState((prevState) => ({
      ...prevState,
      paidYearList: value.row?.acerpAmountList.filter((obj)=>value.row.program_type_name === "Yearly" ? (obj.id) % 2 : obj),
      isPaidYearModalOpen: !isPaidYearModalOpen,
    }));
  };



  const getUploadData = async (acerpAmountAttachPath) => {
    await axios(
      `/api/student/acerpAmountFileviews?fileName=${acerpAmountAttachPath}`,
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

  const handlePaidYearModal = () => {
    setState((prevState) => ({
      ...prevState,
      isPaidYearModalOpen: !isPaidYearModalOpen,
    }));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        try {
          const res = await axios.delete(
            `/api/student/deactivateAcerpAmount/${id}`
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
            `/api/student/activateAcerpAmount/${id}`
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
        <Tab value="ACERP Amount" label="ACERP Amount" />
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
          onClick={() => navigate("/AcerpAmountForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={acerpAmountList} columns={columns} />

        {!!isPaidYearModalOpen && (
          <ModalWrapper
            title="ACERP Amount"
            maxWidth={400}
            open={isPaidYearModalOpen}
            setOpen={() => handlePaidYearModal()}
          >
            <Box component="form" overflow="hidden">
              <Grid container>
                <Grid item xs={12} md={12}>
                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                  >
                    <Table
                      size="small"
                      aria-label="simple table"
                      style={{ width: "100%" }}
                    >
                      <TableHead>
                        <TableRow className={classes.bg}>
                          <TableCell sx={{ color: "white" }}>
                            Sem/Year
                          </TableCell>
                          <TableCell
                            sx={{ color: "white", textAlign: "center" }}
                          >
                            ACERP Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tableBody}>
                        {paidYearList.length &&
                          paidYearList.map((obj, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography variant="subtitle2">{`Sem ${
                                  obj.id
                                }`}</Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography variant="subtitle2">
                                  {obj.paidYear}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </ModalWrapper>
        )}

        {!!attachmentModal && (
          <ModalWrapper
            title="ACERP Attachment"
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

export default PaidAcerpAmountIndex;
