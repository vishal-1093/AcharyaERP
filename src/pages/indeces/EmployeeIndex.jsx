import { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import EmployeeDetailsView from "../../components/EmployeeDetailsView";
import { convertToDMY } from "../../utils/DateTimeUtils";

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
      field: "empTypeShortName",
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
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
      hideable: false,
    },
    {
      field: "date_of_joining",
      headerName: "DOJ Name",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.date_of_joining
              ? `${convertToDMY(params.row.date_of_joining.slice(0, 10))}`
              : ""}
          </>
        );
      },
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
