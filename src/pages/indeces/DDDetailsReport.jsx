import { useState, useEffect, lazy } from "react";
import {
  Button,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  Box,
  Grid,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
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
  ddLists: [],
  modalOpen: false,
  modalContent: modalContents
};

const DDDetailReport = () => {
  const [
    {
      ddLists,
      modalOpen,
      modalContent
    },
    setState,
  ] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    modified_date: false,
    modified_username: false
  });

  useEffect(() => {
    setCrumbs([{name:"Demand Detail Report"}]);
    getData();
  }, []);

  const columns = [
    { field: "dd_number", headerName: "DD No", flex: 1 },
    { field: "dd_date", headerName: "DD Date", flex: 1,  valueGetter: (value,row) =>
      moment(row.dd_date).format("DD-MM-YYYY")},
    {
      field: "bank_name",
      headerName: "DD Bank",
      flex: 1,
    },
    { field: "dd_amount", headerName: "Amount", flex: 1 },
    {
      field: "receipt_type",
      headerName: "Receipt Type",
      flex: 0.6,
      hideable: false,
      renderCell: (params) =>
        params.row.receipt_type == "HOS"
          ? "HOST"
          : params.row.receipt_type == "General"
            ? "GEN"
            : params.row.receipt_type == "Registration Fee"
              ? "REGT"
              : params.row.receipt_type == "Bulk Fee"
                ? "BULK"
                : params.row.receipt_type == "Exam Fee" ? "EXAM" : params.row.receipt_type?.toUpperCase(),
    },
    {
      field: "fee_receipt",
      headerName: "Receipt No",
      flex: 1,
    },
    {
      field: "receipt_date",
      headerName: "Receipt Date",
      flex: 1,
      valueGetter: (value,row) =>
        moment(row.modified_date).format("DD-MM-YYYY")
    },
    {
      field: "school_name_short",
      headerName: "Inst",
      flex: 1
    },
    {
      field: "deposited_into",
      headerName: "Deposited Bank",
      flex: 1,
    }
  ];

  const getData = async () => {
    try {
      const res = await axios.get(
        `/api/finance/fetchAllDdDetails?page=0&page_size=1000000&sort=created_date`
      );
      if (res.status == 200 || res.status == 201) {
        const list = res?.data?.data.Paginated_data.content;
        setState((prevState) => ({
          ...prevState,
          ddLists: list,
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
        <Box sx={{ position: "absolute", width: "100%"}}>
          <GridIndex rows={ddLists} columns={columns} columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}/>
        </Box>
      </Box>
    </>
  );
};

export default DDDetailReport;
