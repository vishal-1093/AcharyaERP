import { useState, useEffect } from "react";
import GridIndex from "../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CustomModal from "../components/CustomModal";
import axios from "../services/Api";
import moment from "moment";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const empID = JSON.parse(sessionStorage.getItem("userData"))?.emp_id

function HodEmployeeDetail() {
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state;

  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);



  useEffect(() => {
    if (state && state?.fromPath?.toLowerCase() === "/principal-dashboard") {
      setCrumbs([
        {
          name: "Dashboard",
          link: "/principal-dashboard",
        },
        { name: "Employee detail" },
      ]);
    } else {
      setCrumbs([
        {
          name: "Dashboard",
          link: "/hod-dashboard",
        },
        { name: "Employee detail" },
      ]);
    }
    getData();
  }, []);

  const getData = async () => {
    if (!state) {
      return;
    }

    const fromPath = state?.fromPath?.toLowerCase();

    try {
      if (fromPath === "/principal-dashboard") {
        const response = await axios.get(
          `/api/employee/getEmployeeDetailsDataBasedOnReportId/${empID}/${state?.task?.designation_id}`
        );
        setRows(response?.data?.data?.map((obj) => obj?.employeeDetails));
      } else {
        const response = await axios.get(
          `/api/employee/getEmployeeDetailsDataBasedOnEmpId/${state?.leave_approver1_emp_id}/${state?.designation_id}`
        );
        setRows(response?.data?.data?.map((obj) => obj?.employeeDetails));
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/ServiceType/${id}?active=false`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          });
      } else {
        await axios.delete(`/api/ServiceType/${id}?active=true`).then((res) => {
          if (res.status === 200) {
            getData();
            setModalOpen(false);
          }
        });
      }
    };
    params.row.active === true
      ? setModalContent({
        title: "",
        message: "Do you want to make it Inactive?",
        buttons: [
          { name: "No", color: "primary", func: () => { } },
          { name: "Yes", color: "primary", func: handleToggle },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "No", color: "primary", func: () => { } },
          { name: "Yes", color: "primary", func: handleToggle },
        ],
      });
  };
  const columns = [
    { field: "employee_name", headerName: "Employee", flex: 1 },
    { field: "empcode", headerName: "Code", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },

    { field: "designation_short_name", headerName: "Designation", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,

      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },

  ];

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <GridIndex rows={rows} columns={columns} getRowId={row => row.emp_id} />
    </Box>
  );
}

export default HodEmployeeDetail;
