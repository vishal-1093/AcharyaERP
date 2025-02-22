import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import { Box, Grid } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker")
);

function AddOnReportAll() {
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    { field: "index", headerName: "SL.No.", flex: 1 },
    { field: "emp_code", headerName: "Emp Code", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "school_name",
      headerName: "Institute",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Research Type",
      flex: 1,
    },
    {
      field: "approved",
      headerName: "Approved",
      flex: 1,
    },
    {
      field: "pay_month",
      headerName: "Pay Month",
      flex: 1,
    }
  ];

  useEffect(() => {
    const handler = setTimeout(() => {

      getData(date)
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [date]);

  const handleChangeAdvance = (name, newValue) => {
    setDate(newValue)
  };

  const getData = async (selectedDate) => {
    try {
      if (selectedDate) {
        setLoading(true);
        const res = await axios.get(`/api/employee/incentiveApproverReport?creditedMonth=${moment(selectedDate).format("MM")}&&creditedYear=${moment(selectedDate).format("YYYY")}`);
        if (res.status == 200 || res.status == 201) {
          setRows(res.data.data);
          setLoading(false);
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        columnSpacing={4}
        mt={2}
      >
        <Grid item xs={10} md={3}>
          <CustomDatePicker
            views={["month", "year"]}
            openTo="month"
            name="date"
            label="Select Month"
            inputFormat="MM/YYYY"
            helperText="mm/yyyy"
            value={date}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
      </Grid>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} loading={loading}/>
      </Box>
    </>
  );
}
export default AddOnReportAll;
