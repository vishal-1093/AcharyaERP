import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Box } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment/moment";
import { useLocation } from "react-router-dom";

const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;
const proctorHeadID = JSON.parse(sessionStorage.getItem("userData"))?.proctorHeadId;

function ProctorStudentHistory() {
  const [rows, setRows] = useState([]);
  const { pathname } = useLocation();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const baseUrl = `/api/proctor/fetchAllProctorStudentAssignmentHistoryDetail`;
      let params = {
        page: 0,
        page_size: 10000,
        sort: "created_date",
      };
  
      if (proctorHeadID === undefined || proctorHeadID === null) {
        return;
      }
  
      if (pathname?.toLowerCase() === "/mentormaster/history-head") {
        params.UserId = proctorHeadID;
        
        if (roleId !== 16 && params.UserId) {
          params.school_id = schoolID;
        }
      }
  
      const response = await axios.get(baseUrl, { params });
      setRows(response.data.data.Paginated_data.content);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const columns = [
    { field: "employee_name", headerName: "Mentor", flex: 1 },
    { field: "empcode", headerName: "Mentor Empcode", flex: 1 },
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "created_username", headerName: "De-Assigned By", flex: 1 },
    {
      field: "created_date",
      headerName: "De-Assigned Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />

        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default ProctorStudentHistory;
