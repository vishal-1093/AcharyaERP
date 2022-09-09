import { React, useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../components/CustomModal";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { Button } from "@mui/material";
function GroupIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/fetchAllgroupDetail?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios.delete(`${ApiUrl}/group/${id}`).then((res) => {
          if (res.status == 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        axios.delete(`${ApiUrl}/activateGroup/${id}`).then((res) => {
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
    { field: "group_name", headerName: "Group", flex: 1 },
    { field: "group_short_name", headerName: "Short Name", flex: 1 },
    { field: "group_priority", headerName: "Priority", flex: 1 },
    { field: "financials", headerName: "Financial Status", flex: 1 },
    { field: "balance_sheet_group", headerName: "Balance Sheet", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
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
          <Link to={`/GroupUpdate/${params.row.id}`}>
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
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Link to="/GroupCreation" style={{ textDecoration: "none" }}>
        <Button variant="contained">Create</Button>
      </Link>
      <GridIndex rows={rows} columns={columns} />
    </>
  );
}
export default GroupIndex;
