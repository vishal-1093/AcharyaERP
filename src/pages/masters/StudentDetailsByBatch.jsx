import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GridIndex from "../../components/GridIndex";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Typography } from "@mui/material";
import moment from "moment";
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

    console.log(response);

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

    {
      field: "reportind_date",
      headerName: "Reporting Date",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.reporting_date ? (
          <>{moment(params.row.reporting_date).format("DD-MM-YYYY")}</>
        ) : (
          <>
            <Typography variant="subtitle2">Not Reported</Typography>
          </>
        ),
      ],
    },
    {
      field: "current_sem",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_sem
          ? `${params.row.current_year}/${params.row.current_sem}`
          : "",
    },
  ];

  return <GridIndex rows={Data} columns={columns} />;
};
export default StudentDetailsByBatch;
