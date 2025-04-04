import { useState, useEffect, lazy } from "react";
import {
  Button,
  Box
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import axios from "../../services/Api";
import moment from "moment";
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker.jsx")
);
const GridIndex = lazy(() => import("../../components/GridIndex"));

const initialState = {
  ddLists: [],
};

const DDDetailReport = () => {
  const [
    {
      ddLists
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
  
  const renderDateEditCell = (params) => {
    return (
      <Box>
        <CustomDatePicker
          name="cleared_date"
          label=""
          value={params.row.cleared_date}
          handleChangeAdvance={(name, value) => handleChangeAdvance(name, value, params.row)}
          helperText=""
          required />
      </Box>
    );
  };

  const handleChangeAdvance = (name,newValue,rowValue) => {
    setState((prevState)=>({
      ...prevState,
      ddLists: ddLists.map((ele)=>({...ele,cleared_date:ele.id == rowValue.id ? (newValue) : ele.cleared_date }))
    }))
  }

  const columns = [
    { field: "dd_number", headerName: "DD No", flex: 1 },
    { field: "dd_date", headerName: "DD Date", flex: 1,  valueGetter: (value,row) =>
      moment(row.dd_date).format("DD-MM-YYYY")},
    {
      field: "bank_name",
      headerName: "DD Bank",
      flex: 1,
    },
    { field: "dd_amount", headerName: "Amount", flex: 1,type:"number" },
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
    },
    {
      field: "cleared_date",
      headerName: "Cleared Date",
      flex: 2,
      headerAlign:"center",
      align:"center",
      renderCell: renderDateEditCell
    },
    // {
    //   field: "id",
    //   headerName: "",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Box sx={{padding:"10px"}}>
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         sx={{ borderRadius: 1 }}
    //       >
    //         Submit
    //       </Button>
    //       </Box>
    //     );
    //   },
    // }
  ];

  const onSubmit = () => {
    console.log("list========",ddLists)
  }

  return (
      <Box
        sx={{
          position: "relative",
          marginTop: { xs: -1},
        }}
      >
        <Box sx={{ position: "absolute", width: "100%"}}>
          <Box sx={{ postition: "relative" }}>
            <GridIndex rows={ddLists} columns={columns} columnVisibilityModel={columnVisibilityModel}
              setColumnVisibilityModel={setColumnVisibilityModel} rowHeight={60}/>
          </Box>
          <Box align="right" sx={{ postition: "relative",marginTop:"-50px"}}>
            <Button
            onClick={onSubmit}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 1 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
  );
};

export default DDDetailReport;
