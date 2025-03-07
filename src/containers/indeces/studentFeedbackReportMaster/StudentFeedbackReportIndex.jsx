import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

function StudentFeedbackReportIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "courseId", headerName: "Course", flex: 1 },
    { field: "windowPeriod", headerName: "Window Period", flex: 1 }
  ];
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
    .get(
        `/api/fetchAllFeedbackAllowForStudentDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res?.data?.data.Paginated_data?.content);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", marginTop: 3 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default StudentFeedbackReportIndex;
