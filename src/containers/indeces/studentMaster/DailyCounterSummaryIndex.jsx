import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box,
  Button,
  Grid
} from "@mui/material";
import axios from "../../../services/Api.js";
import moment from "moment";
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);

const initialValues = {
  startDate: "",
  endDate: ""
};;

function DailyCounterSummaryIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getData("");
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFilter = (formValue) => {
    getData(formValue)
  };

  const getData = async (value) => {
    if (value.startDate && value.endDate) {
      let params = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&start_date=${moment(value.startDate).format("YYYY-MM-DD")}&end_date=${moment(value.endDate).format("YYYY-MM-DD")}`;
      await axios
        .get(`/api/finance/getFeeReceiptWiseAndUserWiseData?${params}`)
        .then((res) => {
          setRows(res.data.data.map((li, index) => ({ ...li, id: index + 1 })));
        })
        .catch((err) => console.error(err));
    }
  };

  const columns = [
    {
      field: "receipt_type", headerName: "Name", flex: 1,
    },
    {
      field: "total_paid_amount",
      headerName: "Cash",
      flex: 1,
    }
  ];

  return (
    <Box sx={{ position: "relative", mt: 7 }}>
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          right: 0,
          marginTop: { xs: -2, md: -6 },
        }}
      >
        <Grid container sx={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
          <Grid item xs={12} md={2}>
            <CustomDatePicker
              name="startDate"
              label="From Date"
              value={values.startDate}
              handleChangeAdvance={handleChangeAdvance}
              helperText=""
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomDatePicker
              name="endDate"
              label="To Date"
              value={values.endDate}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!values.startDate}
              helperText=""
              required
            />
          </Grid>
          <Grid xs={12} md={1} align="right">
            <Button
              onClick={() => handleFilter(values)}
              variant="contained"
              disabled={(!values.endDate)}
              disableElevation
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Box>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default DailyCounterSummaryIndex;
