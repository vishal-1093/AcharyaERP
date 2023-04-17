import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import EditIcon from "@mui/icons-material/Edit";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../../components/CustomModal";

function SalaryStructureAssignmentIndex() {
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
        `/api/finance/fetchAllSalaryStructureDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      params.row.active === true
        ? await axios
            .delete(`/api/Roles/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getData();
              }
            })
            .catch((err) => console.error(err))
        : await axios
            .delete(`/api/activateRoles/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getData();
              }
            })
            .catch((err) => console.error(err));
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
    setModalOpen(true);
  };

  const columns = [
    {
      field: "salary_structure",
      headerName: "Salary Structure",
      flex: 1,
    },
    {
      field: "voucher_head_short_name",
      headerName: "Particulars",
      flex: 1,
    },
    {
      field: "category_name_type",
      headerName: "Type",
      flex: 1,
    },

    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      renderCell: (params) => {
        return params.row.from_date
          ? params.row.from_date.slice(0, 7).split("-").reverse().join("-")
          : "";
      },
    },
    {
      field: "salary_category",
      headerName: "Calculation Type",
      flex: 1,
    },
    {
      field: "percentage",
      headerName: "Percentage %",
      flex: 1,
    },
    {
      field: "gross_limit",
      headerName: "Gross Limit",
      flex: 1,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/SalaryMaster/SalaryStructureAssignment/Update/${params.row.id}`
            )
          }
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
            style={{ color: "green" }}
            onClick={() => {
              handleActive(params);
            }}
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
          onClick={() =>
            navigate("/SalaryMaster/SalaryStructureAssignment/New")
          }
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

export default SalaryStructureAssignmentIndex;
