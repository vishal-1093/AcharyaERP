import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GridIndex from "../../components/GridIndex";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const StudentDetailsByBatch = ({ eventDetails }) => {
  const [Data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const setCrumbs = useBreadcrumbs();

  const fetchData = async () => {
    let url = "";
    if (eventDetails.sectionAssignmentId !== null) {
      url = `api/academic/assignedStudentDetailsBySectionAssignmentId/${eventDetails?.sectionAssignmentId}`;
    } else {
      url = `api/academic/assignedStudentDetailsByBatchAssignmentId/${eventDetails?.batch_assignment_id}`;
    }

    const response = await axios.get(url);

    if (Array.isArray(response.data.data)) {
      const updatedData = response.data.data.map((item, index) => ({
        ...item,
        id: index,
        selected: false,
        present: "P",
      }));

      setData(updatedData);
    } else {
      console.error("Data is not an array.");
    }
  };

  useEffect(() => {
    fetchData();
    setCrumbs([
      { name: "Calendar", link: "/SchedulerMaster" },
      { name: "Student List" },
    ]);
  }, []);

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
  ];

  return <GridIndex rows={Data} columns={columns} />;
};
export default StudentDetailsByBatch;
