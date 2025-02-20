import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../../../services/Api";
import GridIndex from "../../../../components/GridIndex";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Check, HighlightOff } from "@mui/icons-material";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../../components/CustomModal";

const PaysliplockIndex = () => {
  const navigate = useNavigate();
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 50,
    total: 0,
  });
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([{ name: "Payslip Lock" }]);
    getData();
  }, [paginationData.page, paginationData.pageSize]);

  const getData = () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));
    axios
      .get(
        `/api/employee/fetchPaySlipLockDateDetail?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=created_date`
      )
      .then((res) => {
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data.Paginated_data.content,
          total: res.data.data.Paginated_data.totalElements,
          loading: false,
        }));
      });
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

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/employee/deactivateSlipLockDate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/employee/activateSlipLockDate/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
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
  };

  const columns = [
    {
      field: "id",
      hide: true,
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    },
    {
      field: "month_year",
      headerName: "Pay Month",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/restrictwindow/paysliplock/edit/${params.row.id}`)
            }
          >
            {`${params.row.month}/${params.row.year}`}
          </Typography>
        );
      },
    },
    {
      field: "display_date",
      headerName: "Payslip Display date",
      flex: 1,
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_date",
      headerName: "Create At",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>
            {moment(params.created_date).format("DD-MM-YYYY")}
          </Typography>
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
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "green" }}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "red" }}
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
        onClick={() => navigate("/restrictwindow/paysliplock/create")}
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
      />
    </Box>
  );
};

export default PaysliplockIndex;
