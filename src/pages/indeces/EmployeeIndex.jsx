import { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import EmployeeDetailsView from "../../components/EmployeeDetailsView";

function EmployeeIndex() {
  const [rows, setRows] = useState([]);
  const [empId, setEmpId] = useState();
  const [offerId, setOfferId] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Employee Index" }]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllEmployeeDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleDetails = (params) => {
    setEmpId(params.row.id);
    setOfferId(params.row.offer_id);
    setModalOpen(true);
  };

  const columns = [
    {
      field: "employee_name",
      headerName: "Employee Name",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDetails(params)}
            >
              {params.row.employee_name}
            </Typography>
          </>
        );
      },
    },
    { field: "empcode", headerName: "Employee Code", flex: 1, hideable: false },
    {
      field: "emp_type_short_name",
      headerName: "Employee Type",
      flex: 1,
      hideable: false,
    },
    { field: "email", headerName: "Email", flex: 1, hideable: false },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hideable: false,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
      hideable: false,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      hideable: false,
    },
    {
      field: "ctc",
      headerName: "CTC",
      flex: 1,
      hideable: false,
    },
    {
      field: "created_by",
      headerName: "Update",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() => navigate(`/employeeupdateform/${params.row.id}`)}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    { field: "shiftName", headerName: "Shift Name", flex: 1, hide: true },
    { field: "gender", headerName: "Gender", flex: 1, hide: true },
    { field: "religion", headerName: "Religion", flex: 1, hide: true },
    {
      field: "preferred_name_for_email",
      headerName: "Preferred Name",
      flex: 1,
      hide: true,
    },
    { field: "aadhar", headerName: "Aadhar", flex: 1, hide: true },
    { field: "pf_no", headerName: "PF", flex: 1, hide: true },
    { field: "uan_no", headerName: "UAN", flex: 1, hide: true },
    {
      field: "leave_approver1",
      headerName: "Leave Approver 1",
      flex: 1,
      hide: true,
    },
    {
      field: "leave_approver2",
      headerName: "Leave Approver 2",
      flex: 1,
      hide: true,
    },
    {
      field: "bank_account_holder_name",
      headerName: "Bank Account Name",
      flex: 1,
      hide: true,
    },
    { field: "bank_account_no", headerName: "Bank", flex: 1, hide: true },
    { field: "bank_name", headerName: "Bank", flex: 1, hide: true },
    { field: "bank_ifsccode", headerName: "IFSC", flex: 1, hide: true },
    { field: "bank_branch", headerName: "Branch", flex: 1, hide: true },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <EmployeeDetailsView empId={empId} offerId={offerId} />
      </ModalWrapper>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default EmployeeIndex;
