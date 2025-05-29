import { useState, useEffect, lazy } from "react";
import {
  Box, Grid
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
import moment from "moment";
import { convertToDateandTime } from "../../utils/Utils";
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker.jsx")
);
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));


const dateFilterList = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "1 Month" },
  { value: "custom", label: "Custom Date" },
];

const initialState = {
  rows: [],
  schoolId: null,
  schoolList: [],
  dateFilterName: dateFilterList[1].value,
  startDate: null,
  endDate: null,
  loading: false,
};

const ServiceIndentTransportReport = () => {
  const [{ rows, schoolId, loading, schoolList, dateFilterName, startDate, endDate }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setCrumbs([]);
    getSchoolData();
  }, []);

  useEffect(() => {
    (dateFilterName != "custom") && getData();
  }, [schoolId, dateFilterName]);

  useEffect(() => {
    (dateFilterName == "custom" && endDate) && getData();
  }, [schoolId, dateFilterName, startDate, endDate]);

  const columns = [
    {
      field: "school_name_short",
      headerName: "Inst",
      flex: 1,
      hideable: false
    },
    {
      field: "type_of_vehicle",
      headerName: "Type of Vehicle",
      flex: 1,
      hideable: false
    },
    {
      field: "reporting_place",
      headerName: "Reporting Place",
      flex: 1,
      hideable: false,
    },
    {
      field: "requesting_from_datetime",
      headerName: "PickUp Date&Time",
      flex: 1,
      valueGetter: (value, row) =>
        row.requesting_from_datetime ? convertToDateandTime(row.requesting_from_datetime) : "",

    },
    {
      field: "requesting_to_datetime",
      headerName: "Droping Date&Time",
      flex: 1,
      valueGetter: (value, row) =>
        row.requesting_to_datetime ? convertToDateandTime(row.requesting_to_datetime) : "",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
    },
    {
      field: "report_to_person",
      headerName: "Reporting Person",
      flex: 1,
      valueGetter: (value, row) =>
        row.report_to_person ? row.report_to_person : "",
    },
    {
      field: "place_of_visit",
      headerName: "Place Of Visit",
      flex: 1,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 1,
      hideable: false
    },
    {
      field: "request_status",
      headerName: "Request Status",
      flex: 1,
      hideable: false
    },
  ];

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res.data.data.map((ele) => ({ value: ele.school_id, label: ele.school_name }))
        }));
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const payload = {
        "school_id": schoolId,
        "date_range": dateFilterName,
        "start_date": startDate ? moment(startDate).format("YYYY-MM-DD") : null,
        "end_date": endDate ? moment(endDate).format("YYYY-MM-DD") : null
      };
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          params.append(key, value);
        }
      });
      const apiUrl = `/api/fetchAllTransportMaintenanceDetailsData?page=0&page_size=1000000&sort=created_date&${params.toString()}`;
      const res = await axios.get(`${apiUrl}`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          rows: res.data.data,
          loading: false
        }));
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "dateFilterName") {
      setState((prevState) => ({
        ...prevState,
        startDate: null,
        endDate: null
      }))
    }
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }))
  };

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      <Grid container rowSpacing={{ xs: 1, md: 0 }} columnSpacing={{ xs: 3 }} sx={{ marginTop: { xs: 2, md: 0 }, justifyContent: "flex-end" }}>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="schoolId"
            value={schoolId}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <CustomAutocomplete
            name="dateFilterName"
            value={dateFilterName}
            label="Date Filter"
            handleChangeAdvance={handleChangeAdvance}
            options={dateFilterList || []}
            required
          />
        </Grid>

        {dateFilterName == "custom" && <Grid item xs={12} md={1.5}>
          <CustomDatePicker
            name="startDate"
            label="From Date"
            value={startDate}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>}
        {dateFilterName == "custom" && <Grid item xs={12} md={1.5}>
          <CustomDatePicker
            name="endDate"
            label="To Date"
            value={endDate}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!startDate}
            required
          />
        </Grid>}
      </Grid>

      <Box mt={1} sx={{ position: "absolute", width: "100%" }}>
        <GridIndex rows={rows}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          loading={loading} />
      </Box>
    </Box>
  )

};

export default ServiceIndentTransportReport;
