import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "axios";
import ApiUrl from "../../../services/Api";
function ProgramAssIndex() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const getData = async () => {
    await axios
      .get(
        `${ApiUrl}/academic/fetchAllProgramAssigmentDetail?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`${ApiUrl}/academic/ProgramAssigment/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
              setModalOpen(false);
            }
          });
      } else {
        await axios
          .delete(`${ApiUrl}/academic/activateProgramAssigment/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
              setModalOpen(false);
            }
          });
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };
  const columns = [
    { field: "ac_year", headerName: "Academic Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    { field: "graduation_name_short", headerName: "Graduation", flex: 1 },
    { field: "number_of_semester", headerName: "Semester", flex: 1 },
    { field: "number_of_years", headerName: "Year", flex: 1 },
    { field: "program_type_name", headerName: "Program Type", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "created_by",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <Link
            to={`/AcademicMaster/ProgramAssignment/Update/${params.row.id}`}
          >
            <GridActionsCellItem icon={<EditIcon />} label="Update" />
          </Link>
        );
      },
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <GridActionsCellItem
            icon={<Check />}
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
        ) : (
          <GridActionsCellItem
            icon={<HighlightOff />}
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
        ),
      ],
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Button
          onClick={() => navigate("/AcademicMaster/ProgramAssignment/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default ProgramAssIndex;
