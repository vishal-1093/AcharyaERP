import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { HighlightOff } from "@mui/icons-material";
import { Button, Grid, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import EmployeeSalaryApprove from "./EmployeeSalaryApprove";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import CustomModal from "../../components/CustomModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const initialValues = { remarks: "" };

const EmployeeSalaryApproverIndex = () => {
  const [rows, setRows] = useState([]);
  const [showSalary, setShowSalary] = useState(false);
  const [empId, setEmpId] = useState();
  const [offerId, setOfferId] = useState();
  const [showCancel, setShowCancel] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllNewJoineeDetailsData?page=${0}&page_size=${100000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
    setCrumbs([{ name: "New Joinee Details" }]);
  }, []);

  const handleShowSalary = (params) => {
    setShowSalary(true);
    setEmpId(params.row.id);
    setOfferId(params.row.offer_id);
  };

  const handleShowReject = (params) => {
    setShowCancel(true);
    setEmpId(params.row.id);
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRejectSalary = async () => {
    const temp = {};
    temp.emp_id = empId;
    temp.new_join_status = 2;
    temp.cancel_remark = values.remarks;

    await axios
      .put(`/api/employee/updateNewJoineeDetails/${empId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Rejected" });
          setAlertOpen(true);
          setShowCancel(false);
          getData();
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  const handleApprove = async (params) => {
    setModalOpen(true);
    const id = params.row.id;
    const handleToggle = async () => {
      const temp = {};
      temp.emp_id = id;
      temp.new_join_status = 1;

      await axios
        .put(`/api/employee/updateNewJoineeDetails/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({ severity: "success", message: "Approved" });
            setAlertOpen(true);
            setModalOpen(false);
            getData();
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response.data.message,
          });
          setAlertOpen(true);
        });
    };

    setModalContent({
      title: "",
      message: "Are you sure you want to approve ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const columns = [
    { field: "empcode", headerName: "Staff Code", flex: 1, hideable: false },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hide: true,
    },

    {
      field: "employee_name",
      headerName: "Staff Name",
      width: 220,
      hideable: false,
      flex: 1,
    },

    {
      field: "empTypeShortName",
      headerName: "Type",
      flex: 1,
      hideable: false,
      hide: true,
    },
    {
      field: "job_type",
      headerName: "JobType",
      flex: 1,
    },

    { field: "email", headerName: "Email", flex: 1, hide: true },
    {
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
    },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
      hideable: false,
      valueGetter: (params) =>
        moment(params.row.date_of_joining).format("DD-MM-YYYY"),
    },
    {
      field: "ctc",
      headerName: "CTC",
      flex: 1,
    },

    {
      field: "grosspay_ctc",
      headerName: "Gross",
      flex: 1,
    },

    {
      field: "view",
      headerName: "View Salary",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => handleShowSalary(params)}
              color="primary"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </>
        );
      },
    },
    {
      field: "salary_approval",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => handleApprove(params)} color="primary">
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </>
        );
      },
    },
    {
      field: "reject",
      headerName: "Reject",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => handleShowReject(params)} color="error">
              <HighlightOff fontSize="small" />
            </IconButton>
          </>
        );
      },
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
      <GridIndex rows={rows} columns={columns} />
      <ModalWrapper
        title="Salary Break Up"
        open={showSalary}
        setOpen={setShowSalary}
        maxWidth={900}
      >
        <EmployeeSalaryApprove empId={empId} offerId={offerId} />
      </ModalWrapper>
      <ModalWrapper
        title=""
        open={showCancel}
        setOpen={setShowCancel}
        maxWidth={400}
      >
        <Grid
          container
          rowSpacing={2}
          justifyContents="center"
          alignItems="center"
          mt={2}
        >
          <Grid item xs={12}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              sx={{ borderRadius: 2, marginLeft: 2 }}
              color="error"
              onClick={handleRejectSalary}
            >
              Reject
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
};

export default EmployeeSalaryApproverIndex;
