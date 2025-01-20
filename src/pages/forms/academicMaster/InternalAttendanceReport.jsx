import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import useAlert from "../../../hooks/useAlert";
import { Box, Typography } from "@mui/material";

function InternalAttendanceReport({ eventDetails }) {
  const [data, setData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stdRes = await axios.get(
        `/api/student/getInternalAttendanceDetailsOfStudent/${eventDetails.id}`
      );
      const stdResData = stdRes.data.data;
      setData(stdResData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Name", flex: 1 },
    {
      field: "present_status",
      headerName: "Attendance",
      flex: 1,
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ fontSize: 14 }}
        >
          Attendance Report
        </Typography>
        <GridIndex rows={data} columns={columns} />
      </Box>
    </>
  );
}

export default InternalAttendanceReport;
