import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box, IconButton } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";

function ServiceAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/ServiceType/getAllServiceDept?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios.delete(`/api/DepartmentAssignment/${id}`).then((res) => {
          if (res.status === 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        await axios
          .delete(`/api/activateDepartmentAssignment/${id}`)
          .then((res) => {
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
    { field: "ServiceTypeName", headerName: "Service Type Name", flex: 1 },
    { field: "DepartmentTagName", headerName: "Tag Name", flex: 1 },
    { field: "CreatedUserName", headerName: "Created By", flex: 1 },
    {
      field: "CreatedDate",
      headerName: "Created Date",
      flex: 1,

      valueGetter: (value, row) =>
        moment(row?.CreatedDate).format("DD-MM-YYYY"),
    },
    {
      field: "Active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (value, row) => [
        row?.Active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
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
      <Button
        onClick={() => navigate("/ServiceMaster/ServiceAssignment/New")}
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

export default ServiceAssignmentIndex;
