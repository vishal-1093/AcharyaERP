import { useState, useEffect } from "react";
import GridIndex from "../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CustomModal from "../components/CustomModal";
import axios from "../services/Api";
import moment from "moment";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

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
    if(state) getData();
    setCrumbs([
        {
          name: "Dashboard",
          link: "/hod-dashboard",
        },
        { name: "Employee detail" },
      ]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/getEmployeeDetailsDataBasedOnEmpId/${state?.leave_approver1_emp_id}/${state?.designation_id}`)
      .then((res) => {
        setRows(res.data.data.map((obj)=>obj?.employeeDetails));
      })
      .catch((err) => console.error(err));
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
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
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

      valueGetter: (params) =>
        moment(params.row.createdDate).format("DD-MM-YYYY"),
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
      <GridIndex rows={rows} columns={columns} getRowId={row => row.emp_id}  />
    </Box>
  );
}

export default HodEmployeeDetail;
