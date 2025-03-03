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
    { field: "course_code", headerName: "Course Code", flex: 1 },
    {
      field: "feedback_window",
      headerName: "Feedback Window",
      flex: 1,
      renderCell: (params) => params.row.from_date && params.row.to_date ? `${moment(params.row.from_date).format("DD-MM-YYYY")} - ${moment(params.row.to_date).format("DD-MM-YYYY")}` : '----',
    },
  ];
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
    .get(
        `/api/student/getClassFeedbackAnswersDetailsData`
      )
      .then((res) => {
        const {data} = res?.data
        if(data?.length > 0) setRows(data);
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
        <GridIndex rows={rows} columns={columns} getRowId={row => row.course_id}/>
      </Box>
    </>
  );
}
export default StudentFeedbackReportIndex;
