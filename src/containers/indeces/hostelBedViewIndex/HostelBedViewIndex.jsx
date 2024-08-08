import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import VacateBed from "./VacateBed";
import CancelBed from "./CancelBed";
import CancelIcon from "@mui/icons-material/Cancel";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChangeBed from "./ChangeBed";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
const initialValues = {
  foodType: "",
  occupiedDate: "",
};
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function HostelBedViewIndex({ tab }) {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [isLoading, setLoading] = useState(false);
  const [foodTypeOpen, setFoodTypeOpen] = useState(false);
  const [occupiedTypeOpen, setOccupiedTypeOpen] = useState(false);
  const [vacateBedOpen, setVacateBedOpen] = useState(false);
  const [cancelBedOpen, setCancelBedOpen] = useState(false);
  const [changeBedOpen, setChangeBedOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [rowDetails, setRowDetails] = useState();
  const { setAlertMessage, setAlertOpen } = useAlert();

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
  const foodTypeOptions = [
    { value: "VEG", label: "VEG" },
    { value: "NON-VEG", label: "NON-VEG" },
  ];
  const handleChangeFoodStatus = (params) => {
    setFoodTypeOpen(true);
    setRowDetails(params?.row);
    setValues({ foodType: params?.row?.foodStatus ?? "" });
  };
  const handleChangeOccupied = (params) => {
    setOccupiedTypeOpen(true);
    setRowDetails(params?.row);
    console.log(params?.row, "params?.row");
  };
  const handleVacateBed = (params) => {
    setVacateBedOpen(true);
    setRowDetails(params?.row);
  };
  const handleCancelBed = (params) => {
    setCancelBedOpen(true);
    setRowDetails(params?.row);
  };
  const handleChangeBed = (params) => {
    setChangeBedOpen(true);
    setRowDetails(params?.row);
  };
  const columns = [
    {
      field: "foodStatus",
      headerName: "Food Status",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row?.foodStatus !== null && params.row?.foodStatus !== "" ? (
          <div
            onClick={() => handleChangeFoodStatus(params)}
            style={{
              color: params.row?.foodStatus === "VEG" ? "green" : "red",
              cursor: "pointer",
            }}
          >
            {params.row?.foodStatus}
          </div>
        ) : (
          <IconButton
            onClick={() => handleChangeFoodStatus(params)}
            sx={{ padding: 0 }}
          >
            <AddCircleOutlineSharpIcon />
          </IconButton>
        ),
      ],
    },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "auid", headerName: "Auid", flex: 1 },
    {
      field: "Year/sem",
      headerName: "Year/sem",
      flex: 1,
      renderCell: (params) => {
        return (
          <>{`${params?.row?.currentYear} / ${params?.row?.currentSem}`}</>
        );
      },
    },
    { field: "acYear", headerName: "Ac Year", flex: 1 },
    { field: "blockName", headerName: "Block", flex: 1 },
    { field: "bedName", headerName: "Bed", flex: 1 },
    { field: "templateName", headerName: "Template", flex: 1 },
    // { field: "floorName", headerName: "Floor", flex: 1 },
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
    { field: "totalAmount", headerName: "Fixed", flex: 1, hide: true },
    {
      field: "Paid",
      headerName: "Paid",
      flex: 1,
      valueGetter: (params) => params.row.Paid || 0,
      hide: true,
    },
    {
      field: "DUE",
      headerName: "Due",
      flex: 1,
      valueGetter: (params) => params.row.DUE || 0,
    },
    {
      field: "created_date",
      headerName: "Assigned Date",
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    // {
    //   field: "fromDate",
    //   headerName: "Occupied Date",
    //   flex: 1,
    //   valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
    //   renderCell: (params) => moment(params.row.fromDate).format("DD-MM-YYYY"),
    // },
    {
      field: "fromDate",
      headerName: "Occupied Date",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.fromDate !== null ? (
          <div
            onClick={() => handleChangeOccupied(params)}
            // style={{
            //   cursor: "pointer",
            // }}
          >
            {moment(params?.row?.fromDate).format("DD-MM-YYYY")}
          </div>
        ) : (
          <IconButton
            onClick={() => handleChangeOccupied(params)}
            sx={{ padding: 0 }}
          >
            <AddCircleOutlineSharpIcon />
          </IconButton>
        ),
      ],
    },
    { field: "toDate", headerName: "Vacate Date", flex: 1, hide: true },
    {
      field: "vacate",
      headerName: "Vacate",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params?.row?.due != 0 && roleShortName !== "SAA" ? (
          <></>
        ) : (
          <IconButton
            // sx={{ color: "green", padding: 0 }}
            onClick={() => handleVacateBed(params)}
          >
            <ExitToAppIcon />
          </IconButton>
        ),
      ],
    },
    {
      field: "Change Bed",
      headerName: "Change Bed",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          // sx={{ color: "green", padding: 0 }}
          onClick={() => handleChangeBed(params)}
        >
          <ChangeCircleOutlinedIcon />
        </IconButton>,
      ],
    },
    {
      field: "Cancel Bed",
      headerName: "Cancel Bed",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton
          // sx={{ color: "red", padding: 0 }}
          onClick={() => handleCancelBed(params)}
        >
          <CancelIcon />
        </IconButton>,
      ],
    },
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    // {
    //   field: "created_date",
    //   headerName: "Created Date",
    //   flex: 1,
    //   valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
    //   renderCell: (params) =>
    //     moment(params.row.created_date).format("DD-MM-YYYY"),
    //   hide: true,
    // },
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
    //         // onClick={() => handleActive(params)}
    //       >
    //         <Check />
    //       </IconButton>
    //     ) : (
    //       <IconButton
    //         sx={{ color: "red", padding: 0 }}
    //         // onClick={() => handleActive(params)}
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
        `/api/hostel/fetchAllHostelBedAssignment?page=${0}&pageSize=${10000}&sort=createdDate${
          tab === "Bed View" ? "" : "&active=false"
        }`
      )
      .then((Response) => {
        onClosePopUp();
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  const onClosePopUp = () => {
    setFoodTypeOpen(false);
    setOccupiedTypeOpen(false);
    setVacateBedOpen(false);
    setCancelBedOpen(false);
    setChangeBedOpen(false);
    setValues(initialValues);
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
  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const updateFoodType = async () => {
    const temp = {};
    temp.hostelBlockId = rowDetails?.hostelBlockId;
    temp.hostelFloorId = rowDetails?.hostelFloorId;
    temp.hostelRoomId = rowDetails?.hostelRoomId;
    temp.acYearId = rowDetails?.acYearId;
    temp.hostelBedId = rowDetails?.hostelBedId;
    temp.studentId = rowDetails?.studentId;
    temp.hostelFeeTemplateId = rowDetails?.hostelFeeTemplateId;
    temp.fromDate = rowDetails?.fromDate;
    temp.toDate = rowDetails?.toDate;
    temp.foodStatus = values?.foodType;
    temp.vacateBy = 1;

    await axios
      .put(`/api/hostel/updateHostelBedAssignment/${rowDetails?.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Food Status updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        onClosePopUp();
        getData();
      })
      .catch((err) => console.error(err));
  };
  const updateOccupiedDate = async () => {
    const temp = {};
    temp.hostelBlockId = rowDetails?.hostelBlockId;
    temp.hostelFloorId = rowDetails?.hostelFloorId;
    temp.hostelRoomId = rowDetails?.hostelRoomId;
    temp.acYearId = rowDetails?.acYearId;
    temp.hostelBedId = rowDetails?.hostelBedId;
    temp.studentId = rowDetails?.studentId;
    temp.hostelFeeTemplateId = rowDetails?.hostelFeeTemplateId;
    temp.fromDate = moment(values?.occupiedDate).format("YYYY-MM-DD");
    temp.toDate = rowDetails?.toDate;
    temp.foodStatus = values?.foodType;
    temp.vacateBy = 1;

    await axios
      .put(`/api/hostel/updateHostelBedAssignment/${rowDetails?.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Occupied date updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        onClosePopUp();
        getData();
      })
      .catch((err) => console.error(err));
  };
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
      <ModalWrapper
        title="Food Type"
        maxWidth={600}
        open={foodTypeOpen}
        setOpen={() => onClosePopUp()}
      >
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="foodType"
              label="Select"
              options={foodTypeOptions}
              value={values.foodType}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={() => updateFoodType()}
              disabled={!values.foodType}
            >
              {isLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        title="Occupied Date"
        maxWidth={600}
        open={occupiedTypeOpen}
        setOpen={() => onClosePopUp()}
      >
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          <Grid item xs={12} md={4} mt={2}>
            <CustomDatePicker
              name="occupiedDate"
              label="Occupied Date"
              value={values.occupiedDate}
              minDate={new Date()}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={() => updateOccupiedDate()}
              disabled={!values.occupiedDate}
            >
              {isLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      {vacateBedOpen && (
        <ModalWrapper
          title={`Vacate Bed - ${rowDetails?.bedName}`}
          maxWidth={1000}
          open={vacateBedOpen}
          setOpen={onClosePopUp}
        >
          <VacateBed rowDetails={rowDetails} getData={getData} />
        </ModalWrapper>
      )}
      {changeBedOpen && (
        <ModalWrapper
          title={`Change Bed - ${rowDetails?.bedName}`}
          maxWidth={1000}
          open={changeBedOpen}
          setOpen={onClosePopUp}
        >
          <ChangeBed rowDetails={rowDetails} getData={getData} />
        </ModalWrapper>
      )}
      {cancelBedOpen && (
        <ModalWrapper
          title={`Cancel Bed - ${rowDetails?.bedName}`}
          maxWidth={1000}
          open={cancelBedOpen}
          setOpen={onClosePopUp}
        >
          <CancelBed rowDetails={rowDetails} getData={getData} />
        </ModalWrapper>
      )}
    </>
  );
}
export default HostelBedViewIndex;
