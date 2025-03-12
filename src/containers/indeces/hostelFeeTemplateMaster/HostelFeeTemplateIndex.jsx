import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, IconButton, styled, Tooltip, tooltipClasses, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import StudentDetails from "../hostelDueIndex/StudentDetails";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

function HostelFeeTemplateIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [studentDetialsOpen, setStudentDetialsOpen] = useState(false);
  const [templateId, setTemplateId] = useState();

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
    { field: "template_name", headerName: "Template Name", flex: 1 },
    { field: "ac_year", headerName: "Acadamic Year", flex: 1 },
    {
      field: "hostel_room_type_id",
      headerName: "Room Type",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {occupancy.find(
              (occupancy) => occupancy.value === params.row?.hostel_room_type_id
            )?.label || ""}
          </>
        );
      },
    },
    { field: "currency_type_short_name", headerName: "Currency Type", flex: 1 },
    {
      field: "total_amount", headerName: "Template Amount", flex: 1, align: "right",
      headerAlign: "right"
    },
    {
      field: "minimum_amount", headerName: "Minimum Amount", flex: 1, align: "right",
      headerAlign: "right"
    },
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    { field: "hostel_block_short_name", headerName: "Hostel Block", flex: 1, hide: true },
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      hide: true,
      flex: 1,
      valueFormatter: (value) => moment(value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "count",
      headerName: "STD-List",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <HtmlTooltip title={params.row.count}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "primary.main",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
            onClick={() => handleChangeStudent(params)}
          >
            {params.row.count}
          </Typography>
        </HtmlTooltip>
      ),
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
              `/HostelFeeTemplateMaster/FeeTemplate/Update/${params.row.id}`
            )
          }
          sx={{ padding: 0 }}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "offer_status",
      headerName: "Offer Status",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.offer_status === true ? (
          <IconButton
            sx={{ color: "green", padding: 0 }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            sx={{ color: "red", padding: 0 }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
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
            sx={{ color: "green", padding: 0 }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            sx={{ color: "red", padding: 0 }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllHostelFeeTemplateDetails?page=${0}&page_size=${10000}&sort=createdDate`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };

  const onClosePopUp = () => {
    setStudentDetialsOpen(false);
  };
  const handleChangeStudent = (params) => {
    setTemplateId(params);
    setStudentDetialsOpen(true);
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/finance/HostelFeeTemplate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/activateHostelFeeTemplate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
        title: "Deactivate",
        message: "Do you want to make it Inactive?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      });
    setModalOpen(true);
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
          onClick={() => navigate("/HostelFeeTemplateMaster/FeeTemplate/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
      {studentDetialsOpen && (
        <ModalWrapper
          title={templateId?.row?.template_name}
          // maxWidth={1000}
          open={studentDetialsOpen}
          setOpen={onClosePopUp}
        >
          <StudentDetails templateId={templateId} />
        </ModalWrapper>
      )}
    </>
  );
}
export default HostelFeeTemplateIndex;
