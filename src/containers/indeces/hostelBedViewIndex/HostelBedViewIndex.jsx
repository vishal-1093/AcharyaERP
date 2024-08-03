import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";

function HostelBedViewIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const occupancy = [
    { value: 1, label: "SINGLE OCCUPANCY" },
    { value: 2, label: "DOUBLE OCCUPANCY" },
    { value: 3, label: "TRIPLE OCCUPANCY" },
    { value: 4, label: "QUADRUPLE OCCUPANCY" },
    { value: 6, label: "SIXTAPLE OCCUPANCY" },
    { value: 7, label: "SEVEN OCCUPANCY" },
    { value: 8, label: "EIGHT OCCUPANCY" },
  ];
  const columns = [
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "AUID", headerName: "Auid", flex: 1 },
    { field: "Year/sem", headerName: "Year/sem", flex: 1 },
    { field: "acYear", headerName: "Ac Year", flex: 1 },
    { field: "blockName", headerName: "Block", flex: 1 },
    { field: "bedName", headerName: "Bed", flex: 1 },
    { field: "templateName", headerName: "Template", flex: 1 },
    { field: "floorName", headerName: "Floor", flex: 1 },
    // {
    //   field: "hostel_room_type_id",
    //   headerName: "Room Type",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {occupancy.find(
    //           (occupancy) => occupancy.value === params.row?.hostel_room_type_id
    //         )?.label || ""}
    //       </>
    //     );
    //   },
    // },
    { field: "FIXED", headerName: "Fixed", flex: 1 },
    { field: "Paid", headerName: "Paid", flex: 1 },
    { field: "DUE", headerName: "Due", flex: 1 },
    { field: "ASSIGNED DATE", headerName: "Assigned Date", flex: 1 },
    { field: "OCCUPIED DATE", headerName: "Occupied Date", flex: 1 },
    { field: "VACATE DATE", headerName: "Vacate Date", flex: 1 },
    { field: "Vacate", headerName: "Vacate", flex: 1 },
    { field: "Change Bed", headerName: "Change Bed", flex: 1 },

    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    // {
    //   field: "id",
    //   type: "actions",
    //   flex: 1,
    //   headerName: "Update",
    //   getActions: (params) => [
    //     <IconButton
    //       onClick={() =>
    //         navigate(
    //           `/HostelBedViewMaster/HostelBedView/Update/${params.row.id}`
    //         )
    //       }
    //       sx={{ padding: 0 }}
    //     >
    //       <EditIcon />
    //     </IconButton>,
    //   ],
    // },
    // {
    //   field: "offerStatus",
    //   headerName: "Offer Status",
    //   flex: 1,
    //   type: "actions",
    //   getActions: (params) => [
    //     params.row.active === true ? (
    //       <IconButton
    //         sx={{ color: "green", padding: 0 }}
    //         onClick={() => handleActive(params)}
    //       >
    //         <Check />
    //       </IconButton>
    //     ) : (
    //       <IconButton
    //         sx={{ color: "red", padding: 0 }}
    //         onClick={() => handleActive(params)}
    //       >
    //         <HighlightOff />
    //       </IconButton>
    //     ),
    //   ],
    // },
    // {
    //   field: "active",
    //   headerName: "Active",
    //   flex: 1,
    //   type: "actions",
    //   getActions: (params) => [
    //     params.row.active === true ? (
    //       <IconButton
    //         sx={{ color: "green", padding: 0 }}
    //         onClick={() => handleActive(params)}
    //       >
    //         <Check />
    //       </IconButton>
    //     ) : (
    //       <IconButton
    //         sx={{ color: "red", padding: 0 }}
    //         onClick={() => handleActive(params)}
    //       >
    //         <HighlightOff />
    //       </IconButton>
    //     ),
    //   ],
    // },
  ];
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/hostel/fetchAllHostelBedAssignment?page=${0}&pageSize=${10000}&sort=createdDate`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };

  // const handleActive = async (params) => {
  //   const id = params.row.id;

  //   const handleToggle = async () => {
  //     if (params.row.active === true) {
  //       await axios
  //         .delete(`/api/finance/HostelFeeTemplate/${id}`)
  //         .then((res) => {
  //           if (res.status === 200) {
  //             getData();
  //           }
  //         })
  //         .catch((err) => console.error(err));
  //     } else {
  //       await axios
  //         .delete(`/api/finance/activateHostelFeeTemplate/${id}`)
  //         .then((res) => {
  //           if (res.status === 200) {
  //             getData();
  //           }
  //         })
  //         .catch((err) => console.error(err));
  //     }
  //   };
  //   params.row.active === true
  //     ? setModalContent({
  //         title: "Deactivate",
  //         message: "Do you want to make it Inactive?",
  //         buttons: [
  //           { name: "Yes", color: "primary", func: handleToggle },
  //           { name: "No", color: "primary", func: () => {} },
  //         ],
  //       })
  //     : setModalContent({
  //         title: "",
  //         message: "Do you want to make it Active?",
  //         buttons: [
  //           { name: "Yes", color: "primary", func: handleToggle },
  //           { name: "No", color: "primary", func: () => {} },
  //         ],
  //       });
  //   setModalOpen(true);
  // };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/HostelBedViewMaster/HostelBedView/New")}
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
export default HostelBedViewIndex;
