import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ModalWrapper from "../../../components/ModalWrapper";
import DeptHodForm from "../../../pages/forms/academicMaster/DeptHodForm";
import useAlert from "../../../hooks/useAlert";

function DepartmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [hodModalOpen, setHodModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/fetchAllDeptDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios.delete(`/api/dept/${id}`).then((res) => {
          if (res.status === 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        await axios.delete(`/api/activateDept/${id}`).then((res) => {
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
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleAddHod = (data) => {
    setRowData(data);
    setHodModalOpen(true);
  };

  const columns = [
    { field: "dept_name", headerName: "Department", flex: 1 },
    { field: "dept_name_short", headerName: "Short Name", flex: 1 },
    { field: "web_status", headerName: "Web Status", flex: 1 },
    {
      field: "common_service",
      headerName: "Service Tag",
      valueGetter: (value, row) => (row.common_service ? "Yes" : "No"),
      flex: 1,
    },
    {
      field: "comments",
      headerName: "Comments",
      flex: 1,
      hide: true,
    },
    {
      field: "hod_id",
      headerName: "No Due HOD",
      flex: 1,
      renderCell: (params) =>
        params.row.hod_id ? (
          <IconButton onClick={() => handleAddHod(params.row)}>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ textTransform: "capitalize" }}
            >
              {params.row.hodUserName}
            </Typography>
          </IconButton>
        ) : params.row.no_dues_status ? (
          <IconButton onClick={() => handleAddHod(params.row)}>
            <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ) : (
          <></>
        ),
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/AcademicMaster/Department/Update/${params.row.id}`)
          }
          sx={{ padding: 0 }}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            sx={{ padding: 0, color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            sx={{ padding: 0, color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        open={hodModalOpen}
        setOpen={setHodModalOpen}
        maxWidth={600}
        title={rowData.dept_name}
      >
        <DeptHodForm
          setHodModalOpen={setHodModalOpen}
          deptId={rowData.id}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          getData={getData}
          rowData={rowData}
        />
      </ModalWrapper>

      <Button
        onClick={() => navigate("/AcademicMaster/Department/New")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default DepartmentIndex;
