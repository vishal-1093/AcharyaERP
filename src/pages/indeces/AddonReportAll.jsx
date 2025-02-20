import { useState, useEffect,lazy } from "react";
import axios from "../../services/Api";
import { Box, IconButton, Grid, Typography,Badge } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker")
);

const empId = sessionStorage.getItem("empId");

function AddOnReportAll() {
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

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
      field: "type",
      headerName: "Research Type",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
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
    getData();
  }, []);

  const handleChangeAdvance = (newValue) => {
    setDate(newValue)
  };

  const getData = async () => {
    try {
      const res = await axios.get(`/api/employee/incentiveApproverReport?creditedMonth=&creditedYear=2025`);
      console.log("res==========", res)
      if(res.status == 200 || res.status == 201){
        setRows(res.data.data)
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
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
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default AddOnReportAll;
