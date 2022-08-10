import { React, useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Button } from "@mui/material";
import axios from "axios";
import ApiUrl from "../../services/Api";
function EmptypeIndex() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState();
  const [activateId, setActivateId] = useState(false);
  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/employee/fetchAllEmployeeTypeDetails?page=${0}&page_size=${100}&sort=createdDate`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleActive = async (params) => {
    setOpen(true);
    setActiveId(params.row);
    let ids = params.row.active;
    if (ids === false) {
      setActivateId(true);
    }
    if (ids === true) {
      setActivateId(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleActivee = async () => {
    let id = activeId.id;
    let check = activeId.active;

    if (check === true) {
      axios.delete(`${ApiUrl}/employee/EmployeeType/${id}`).then((Response) => {
        if (Response.status == 200) {
          getData();
          setOpen(false);
        }
      });
    } else {
      axios
        .delete(`${ApiUrl}/employee/activateEmployeeType/${id}`)
        .then((Response) => {
          if (Response.status == 200) {
            getData();
            setOpen(false);
          }
        });
    }
  };
  const columns = [
    { field: "empType", headerName: "Employee Type", flex: 1 },
    { field: "empTypeShortName", headerName: "Short Name", flex: 1 },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.createdDate),
    },
    {
      field: "created_by",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <Link to={`/EmptypeUpdate/${params.row.id}`}>
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
      <Dialog open={open}>
        <DialogContent>
          <DialogContentText sx={{ color: "black" }}>
            {activateId
              ? "Do you want to make it Active ?"
              : "Do you want to make it Inactive ?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleActivee()}
            variant="contained"
            size="small"
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            size="small"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}
export default EmptypeIndex;
