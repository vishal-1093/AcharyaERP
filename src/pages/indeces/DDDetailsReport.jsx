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
  loading:false
};

const DDDetailReport = () => {
  const [
    {
      ddLists,
      loading
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
    setCrumbs([{name:"Demand Draft Detail Report"}]);
    getData();
  }, []);

  const setLoading = (val) => {
    setState((prevState)=>({
      ...prevState,
      loading:val
    }))
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/finance/fetchAllDdDetails?page=0&page_size=1000000&sort=created_date`
      );
      if (res.status == 200 || res.status == 201) {
        setLoading(false);
        const list = res?.data?.data.Paginated_data.content;
        setState((prevState) => ({
          ...prevState,
          ddLists: list,
        }));
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name,newValue,rowValue) => {
    setState((prevState)=>({
      ...prevState,
      ddLists: ddLists.map((ele)=>({...ele,cleared_date:ele.id == rowValue.id ? (newValue) : ele.cleared_date }))
    }))
  };

  const renderDateEditCell = (params) => (
    !(params.row?.cleared_date && params.row?.cleared_status) ? (<Box>
      <CustomDatePicker
        name="cleared_date"
        label=""
        value={params.row.cleared_date}
        handleChangeAdvance={(name, value) => handleChangeAdvance(name, value, params.row)}
        helperText=""
        required />
    </Box>) : (moment(params.row.cleared_date).format("DD-MM-YYYY"))
  );


  const renderSubmitCell = (params) => (
    !(params.row?.cleared_date && params.row?.cleared_status) ? (<Box>
      <Button
        onClick={()=>onSubmit(params)}
        variant="contained"
        color="primary"
        sx={{ borderRadius: 1 }}
      >
        Save
      </Button>
    </Box>):<></>
  )

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
      field: "created_date",
      headerName: "Receipt Date",
      flex: 1,
      valueGetter: (value,row) =>
        moment(row?.created_date).format("DD-MM-YYYY")
    },
    {
      field: "school_name_short",
      headerName: "Inst",
      flex: 1
    },
    {
      field: "deposited_bank",
      headerName: "Deposited Bank",
      flex: 1,
    },
    {
      field: "cleared_date",
      headerName: "Cleared Date",
      flex: 1.4,
      headerAlign:"center",
      align:"center",
      renderCell: renderDateEditCell
    },
    {
      field: "submit",
      headerName: "",
      flex: 1,
      headerAlign:"center",
      align:"center",
      renderCell: renderSubmitCell
    }
  ];

  const onSubmit = async(params) => {
    try {
      let payload = {...params.row,dd_id:params.row.id,cleared_status:true}
      const res = await axios.put(`api/finance/updateDdDtails/${params.row?.id}`,payload);
      if(res.status == 200 || res.status == 201){
        setAlertMessage({
          severity: "success",
          message: `Cleared date updated successfully !!`,
        });
        setAlertOpen(true);
        getData();
      };
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  }

  return (
      <Box
        sx={{
          position: "relative"
        }}
      >
        <Box sx={{ position: "absolute", width: "100%"}}>
          <Box sx={{ postition: "relative" }}>
            <GridIndex rows={ddLists} columns={columns} columnVisibilityModel={columnVisibilityModel}
              setColumnVisibilityModel={setColumnVisibilityModel} rowHeight={60} loading={loading}/>
          </Box>
        </Box>
      </Box>
  );
};

export default DDDetailReport;
