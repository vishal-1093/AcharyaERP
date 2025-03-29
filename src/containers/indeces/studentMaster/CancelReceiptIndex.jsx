import { useState, useEffect,lazy } from "react";
import GridIndex from "../../../components/GridIndex";
import {
  Box,
  Grid,
  Button,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 270,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

const filterLists = [
  { label: "Today", value: "today" },
  { label: "1 Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "Custom Date", value: "custom" },
];

const initialValues = {
  filterList: filterLists,
  filter:filterLists[0].value,
  startDate: "",
  endDate: ""
};

function CancelReceiptIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getData(values.filterList[0].value);
  }, []);

  const getData = async (filterKey, endDate) => {
    setLoading(true);
        let params = null;
        if (filterKey == "custom" && !!endDate && !!values.startDate) {
          params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&start_date=${moment(
            values.startDate
          ).format("YYYY-MM-DD")}&end_date=${moment(endDate).format("YYYY-MM-DD")}`;
        } else if(filterKey !== "custom") {
          params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=${filterKey}`;
        }
        if(params){
          await axios
            .get(
              `/api/finance/fetchAllCancelledReceipts?${params}`
            )
            .then((res) => {
              setLoading(false);
              setRows(res.data.data.Paginated_data.content);
            })
            .catch((err) => {
              setLoading(false);
              console.error(err)
            });
        }
  };

  const columns = [
    { field: "receipt_type", headerName: "Type", flex: 1,hideable:false,renderCell:(params)=> (params.row.receipt_type == "HOS" ? "HOST" :
      params.row.receipt_type == "General" ? "GEN": params.row.receipt_type == "Registration Fee" ?
     "REGT": (params.row.receipt_type)?.toUpperCase())},
    {
      field: "fee_receipt",
      headerName: "Receipt No",
      flex: .8,
      hideable:false,
      align:"center"
    },
    {
      field: "date",
      headerName: "Date",
      flex: .8,
      hideable: false,
      type: "date",
      valueGetter: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "transaction_type",
      headerName: "Transaction Type",
      flex: 1,
      hide: true,
    },

    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable:false,
      valueGetter: (params) => (params.row.auid ? params.row.auid : "NA"),
    },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      hideable:false,
      renderCell: (params) => {
        return (
          <HtmlTooltip title={params.row.student_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.student_name || ""}
            </Typography>
          </HtmlTooltip>
        )
      },
    },
    {
      field: "fee_template_name",
      headerName: "Template",
      flex: 1,
      hideable:false,
      valueGetter: (params) =>
        params.row.fee_template_name ? params.row.fee_template_name : "NA",
      hide: true,
    },
    {
      field: "amount",
      headerName: "Paid",
      flex: .5,
      hideable:false,
      align:"center",
      valueGetter: (params) =>
        params.row.amount ? params.row.amount : params.row.amount,
    },

    {
      field: "cheque_dd_no",
      headerName: "Transaction Ref",
      flex: 1,
      hide:true,
      renderCell: (params) => {
        return params?.row?.cheque_dd_no?.length > 15 ? (
          <HtmlTooltip title={params.row.cheque_dd_no}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.cheque_dd_no.substr(0, 13) + "..."}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.cheque_dd_no}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.cheque_dd_no}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    { field: "transaction_date", headerName: "Transaction Date", flex: 1},
    { field: "bank_name", headerName: "Bank", flex: 1, hide: true },
    {
      field: "remarks",
      headerName: "Cancelled Remarks",
      flex: 1,
      hideable:false,
      renderCell: (params) => {
        return params?.row?.remarks?.length > 20 ? (
          <HtmlTooltip title={params.row.remarks}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.remarks.substr(0, 21) + "..."}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.remarks}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.remarks}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    {
      field: "created_date",
      headerName: "Cancelled Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "created_username", headerName: "Cancelled By", flex: 1,hideable:false },
  ];

  const setNullField = () => {
    setValues((prevState)=>({
      ...prevState,
      startDate:"",
      endDate:""
    }))
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if(name == "endDate"){
      getData("custom", newValue);
    }else if(name == "startDate" || newValue=="custom") {
    }else {
      getData(newValue, "");
      setNullField()
    }
  };

  return (
    <Box>
        <Grid
          container
          sx={{ display: "flex", justifyContent: "flex-end", gap: "10px",marginTop: { xs:2, md: -5 }}}
        >
          <Grid xs={12} md={2}>
            <CustomAutocomplete
              name="filter"
              label="filter"
              value={values.filter}
              options={values.filterList || []}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          {values.filter == "custom" && (
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                name="startDate"
                label="From Date"
                value={values.startDate}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
          {values.filter == "custom" && (
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                name="endDate"
                label="To Date"
                value={values.endDate}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!values.startDate}
                required
              />
            </Grid>
          )}
          <Grid xs={12} md={1}>
           <Button
           onClick={() => navigate("/Cancelfeereceipt")}
           variant="contained"
           disableElevation
           startIcon={<AddIcon />}
         >
          create
           </Button>
          </Grid>
        </Grid>
      <Box sx={{ position: "relative",marginTop:"10px"}}>
      <GridIndex rows={rows} columns={columns} loading={loading}/>
      </Box>
    </Box>
  );
}

export default CancelReceiptIndex;
