import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import useAlert from "../../../hooks/useAlert";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function InternalAttendanceReport({ eventDetails }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stdRes = await axios.get(
        `/api/academic/getInternalAttendanceDetailsOfStudentList/${eventDetails.internal_id}/${eventDetails.emp_ids}`
      );
      const updateData = stdRes.data.data.map((obj) => {
        return { ...obj, presentStatus: obj.present_status };
      });
      setData(updateData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAttendance = (rowData) => {
    const updateData = data.map((obj) => {
      if (obj.id === rowData.id) {
        return {
          ...obj,
          presentStatus: rowData.presentStatus === "P" ? "A" : "P",
        };
      }
      return obj;
    });
    setData(updateData);
  };

  const handleUpdate = async () => {
    try {
      const putData = [];
      data.forEach((obj) => {
        const { id: exam_attendance_id, presentStatus } = obj;
        putData.push({ exam_attendance_id, present_status: presentStatus });
      });
      const response = await axios.put(
        "api/academic/updateInternalAttendance",
        putData
      );
      if (!response.data.success) throw new Error();
      setAlertMessage({
        severity: "success",
        message: "Internal attendance has been updated successfully.",
      });
      setAlertOpen(true);
      fetchData();
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.message || "Failed to update attendance. Please try again.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Name", flex: 1 },
    {
      field: "present_status",
      headerName: "Attendance Status",
      flex: 1,
    },
  ];

  if (roleShortName === "SAA") {
    columns.push({
      field: "Present",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleChangeAttendance(params.row)}>
          <Avatar
            variant="square"
            sx={{
              backgroundColor:
                params.row.presentStatus === "P" ? "#a5d6a7" : "#ef9a9a",
              color: "headerWhite.main",
              width: 20,
              height: 20,
            }}
          >
            <Typography variant="subtitle2">
              {params.row.presentStatus === "P" ? "P" : "A"}
            </Typography>
          </Avatar>
        </IconButton>
      ),
    });
  }

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
        {roleShortName === "SAA" && (
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading}
            sx={{ alignSelf: "flex-end" }}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <Typography variant="subtitle2">Update</Typography>
            )}
          </Button>
        )}
      </Box>
    </>
  );
}

export default InternalAttendanceReport;
