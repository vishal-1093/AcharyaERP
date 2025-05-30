import { useState, useEffect, lazy } from "react";
import {
  Box, Grid
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
import moment from "moment";
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker.jsx")
);
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));


const complaint_statusList = [
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
];

const dateFilterList = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "1 Month" },
  { value: "custom", label: "Custom Date" },
];

const initialState = {
  rows: [],
  school_id: null,
  schoolList: [],
  block_id: null,
  blockList: [],
  dept_id: null,
  serviceDeptList: [],
  complaint_status: complaint_statusList[0].value,
  date_range: dateFilterList[1].value,
  startDate: null,
  endDate: null,
  loading: false,
};

const ServiceIndentReport = () => {
  const [{ rows, school_id, loading, schoolList, block_id, blockList, dept_id, serviceDeptList, complaint_status, date_range, startDate, endDate }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    block_short_name:false,
    floorAndExtension:false,
    complaintStatus:false
  });

  useEffect(() => {
    setCrumbs([]);
    getSchoolData();
  }, []);

  useEffect(() => {
    (date_range != "custom") && getData();
  }, [school_id, block_id, dept_id, complaint_status, date_range]);

  useEffect(() => {
    (date_range == "custom" && endDate) && getData();
  }, [school_id, block_id, dept_id, complaint_status, date_range, startDate, endDate]);

  const columns = [
    {
      field: "serviceTicketId",
      headerName: "Ticket Id",
      flex: 1,
    },
    {
      field: "createdDate",
      headerName: "Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.createdDate ? moment(row.createdDate).format("DD-MM-YYYY") : "",
    },
    {
      field: "created_username",
      headerName: "Lodged By",
      flex: 1,
    },
    {
      field: "dept_name_short",
      headerName: "Service Type",
      flex: 1,
    },
    {
      field: "block_short_name",
      headerName: "Block",
      flex: 1,
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      valueGetter: (value, row) =>
        row.school_name_short ? row.school_name_short : "",
    },
    {
      field: "serviceTypeShortName",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "complaintDetails",
      headerName: "Details",
      flex: 1,
    },
    {
      field: "floorAndExtension",
      headerName: "Floor",
      flex: 1,
    },
    {
      field: "complaintAttendedByName",
      headerName: "Attended By",
      flex: 1,
    },
    {
      field: "dateOfClosed",
      headerName: "Attended On",
      flex: 1,
      valueGetter: (value, row) =>
        row.dateOfClosed ? moment(row.dateOfClosed).format("DD-MM-YYYY") : "",
    },
    {
      field: "complaintStatus",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 2,
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
        getBlockList()
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getBlockList = async () => {
    try {
      const res = await axios.get(`/api/blocks`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          blockList: res.data.data.map((ele) => ({ value: ele.block_id, label: ele.block_name }))
        }));
        getServiceDeptList()
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getServiceDeptList = async () => {
    try {
      const res = await axios.get(`/api/getActiveDepartmentAssignmentBasedOnTag`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          serviceDeptList: res.data.data.map((ele) => ({ value: ele.id, label: ele.dept_name }))
        }))
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
        "school_id": school_id,
        "block_id": block_id,
        "dept_id": dept_id,
        "complaint_status": complaint_status,
        "date_range": date_range,
        "start_date": startDate ? moment(startDate).format("YYYY-MM-DD") : null,
        "end_date": endDate ? moment(endDate).format("YYYY-MM-DD") : null
      };
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          params.append(key, value);
        }
      });
      const apiUrl = `/api/Maintenance/fetchAllMaintenanceDetailsData?page=0&page_size=1000000&sort=created_date&${params.toString()}`;
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
    if (name == "date_range") {
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
      <Grid container rowSpacing={{ xs: 1, md: 0 }} columnSpacing={{ xs: 3 }} sx={{ marginTop: { xs: 2, md: 0 }, justifyContent: "flex-start" }}>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="school_id"
            value={school_id}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="block_id"
            value={block_id}
            label="Block"
            handleChangeAdvance={handleChangeAdvance}
            options={blockList || []}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="dept_id"
            value={dept_id}
            label="Service Dept"
            handleChangeAdvance={handleChangeAdvance}
            options={serviceDeptList || []}
          />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <CustomAutocomplete
            name="complaint_status"
            value={complaint_status}
            label="Complaint Status"
            handleChangeAdvance={handleChangeAdvance}
            options={complaint_statusList || []}
            required
          />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <CustomAutocomplete
            name="date_range"
            value={date_range}
            label="Date Filter"
            handleChangeAdvance={handleChangeAdvance}
            options={dateFilterList || []}
            required
          />
        </Grid>

        {date_range == "custom" && <Grid item xs={12} md={1.5}>
          <CustomDatePicker
            name="startDate"
            label="From Date"
            value={startDate}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>}
        {date_range == "custom" && <Grid item xs={12} md={1.5}>
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

export default ServiceIndentReport;
