import { useEffect, useState } from "react";
import axios from "../../services/Api";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import moment from "moment";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import EditIcon from "@mui/icons-material/Edit";

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function SalaryLockIndex() {
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 50,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "lock_year", headerName: "Year", flex: 1 },
    {
      field: "lock_month",
      headerName: "Month",
      flex: 1,
    },
    {
      field: "leave_lock_date",
      headerName: "Leave Lock Date",
      flex: 1,
      renderCell: (params) =>
        params.row.leave_lock_date
          ? moment(params.row.leave_lock_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "payroll_lock_date",
      headerName: "Pay Roll Lock Date",
      flex: 1,
      renderCell: (params) =>
        params.row.payroll_lock_date
          ? moment(params.row.payroll_lock_date).format("DD-MM-YYYY")
          : "",
    },
    { field: "created_by", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "id",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate(`/SalaryLockForm/Update/${params.row.id}`)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === 1 ? (
          <IconButton
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

  useEffect(() => {
    setCrumbs([{ name: "Salary Lock" }]);
    getData();
  }, [paginationData.page, paginationData.pageSize, filterString]);

  const getData = async () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));

    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/lockScreen/getLockDatesList?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date${searchString}`
    )
      .then((res) => {
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data.Paginated_data.content,
          total: res.data.data.Paginated_data.totalElements,
          loading: false,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleOnPageChange = (newPage) => {
    setPaginationData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginationData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      params.row.active === 1
        ? await axios
            .delete(`/api/lockScreen/deleteLockDate/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getData();
              }
            })
            .catch((err) => console.error(err))
        : await axios
            .delete(`/api/lockScreen/activeLockDate/${id}`)
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
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

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
        onClick={() => navigate("/SalaryLockForm/New")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -47, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>

      <GridIndex
        rows={paginationData.rows}
        columns={columns}
        rowCount={paginationData.total}
        page={paginationData.page}
        pageSize={paginationData.pageSize}
        handleOnPageChange={handleOnPageChange}
        handleOnPageSizeChange={handleOnPageSizeChange}
        loading={paginationData.loading}
        handleOnFilterChange={handleOnFilterChange}
      />
    </Box>
  );
}

export default SalaryLockIndex;
