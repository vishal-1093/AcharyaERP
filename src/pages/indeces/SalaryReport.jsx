import { useState, useEffect, lazy } from "react";
import {
  Box
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));

const initialState = {
  rows: [],
  loading: false,
};

const SalaryReport = () => {
  const [{ loading, rows }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setCrumbs([]);
    getData();
  }, []);

  const columns = [
    {
      field: "school",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "JANUARY",
      headerName: "Jan",
      flex: 1,
      type: "number"
    },
    {
      field: "FEBRUARY",
      headerName: "Feb",
      flex: 1,
      type: "number"
    },
    {
      field: "MARCH",
      headerName: "Mar",
      flex: 1,
      type: "number"
    },
    {
      field: "APRIL",
      headerName: "Apr",
      flex: 1,
      type: "number"
    },
    {
      field: "may",
      headerName: "May",
      flex: 1,
    },
    {
      field: "jun",
      headerName: "Jun",
      flex: 1,
    },
    {
      field: "jul",
      headerName: "Jul",
      flex: 1,
    },
    {
      field: "aug",
      headerName: "Aug",
      flex: 1,
    },

    {
      field: "sept",
      headerName: "Sept",
      flex: 1,
    },
    {
      field: "oct",
      headerName: "Oct",
      flex: 1,
    },
    {
      field: "nov",
      headerName: "Nov",
      flex: 1,
    },
    {
      field: "dec",
      headerName: "Dec",
      flex: 1,
    }
  ];

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getData = async () => {
    try {
      setLoading(true);
      const apiUrl = `/api/consoliation/masterAndEarnedSummary?year=2025`;
      const res = await axios.get(`${apiUrl}`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          rows: res.data.data.map((ele, index) => ({ ...ele, id: index + 1 })),
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

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
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

export default SalaryReport;
