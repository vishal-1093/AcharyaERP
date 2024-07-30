import { useEffect, useRef, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ModalWrapper from "../../components/ModalWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import moment from "moment";

const initialValues = { comments: "" };

const requiredFields = ["comments"];

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function NoduesApproverIndex() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [modalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalCharacters = 200;
  const remainingCharacter = useRef(200);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    comments: [values.comments !== ""],
  };

  const errorMessages = {
    comments: ["This field is required"],
  };

  useEffect(() => {
    setCrumbs([
      { name: "No Due Approval" },
      { name: "History", link: "/nodue-history" },
    ]);
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllResignationDetailsBasedOnUserId?page=0&page_size=10000&sort=created_date&UserId=${userId}`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleApprove = (data) => {
    setRowData(data);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    if (e.target.value.length > totalCharacters) return;

    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    remainingCharacter.current = totalCharacters - e.target.value.length;
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const getIpAddress = await fetch("https://api.ipify.org?format=json")
      .then((data) => data.json())
      .then((res) => res.ip)
      .catch((err) => console.error(err));

    const resignationData = await axios
      .get(`/api/employee/resignation/${rowData.id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    if (resignationData.resignation_id) {
      resignationData.nodues_approve_status = 2;

      const postData = [
        {
          active: true,
          comments: values.comments,
          no_due_status: true,
          department_id: rowData.dept_id,
          employee_Id: rowData.emp_id,
          resignation_id: rowData.id,
          ip_address: getIpAddress,
        },
      ];

      setLoading(true);

      await axios
        .put(`/api/employee/resignation/${rowData.id}`, resignationData)
        .then((res) => {})
        .catch((err) => console.error(err));

      await axios
        .post(`/api/employee/noDuesAssignment`, postData)
        .then((res) => {
          if (res.data.success === true) {
            setAlertMessage({
              severity: "success",
              message: "Approved successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setModalOpen(false);
            getData();
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
          setModalOpen(false);
        });
    }
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "employee_name", headerName: "Emp Name", flex: 1 },
    { field: "designation_name", headerName: "Designation", flex: 1 },
    { field: "dept_name", headerName: "Department", flex: 1 },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
    },
    { field: "employee_reason", headerName: "Reason", flex: 1 },
    { field: "additional_reason", headerName: "Additional Reason", flex: 1 },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "requested_relieving_date",
      headerName: "Requested Date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.requested_relieving_date).format("DD-MM-YYYY"),
    },
    {
      field: "nodues_approve_status",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleApprove(params.row)}
          title="Approve"
          sx={{ padding: 0 }}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={700}
        title={rowData.employee_name + " ( " + rowData.empcode + " )"}
      >
        <Box p={2}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <CustomTextField
                    name="comments"
                    label="Comments"
                    value={values.comments}
                    handleChange={handleChange}
                    checks={checks.comments}
                    errors={errorMessages.comments}
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Typography variant="body2">
                    Characters Remaining {remainingCharacter.current}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                color="success"
                onClick={handleCreate}
                disabled={loading || !requiredFieldsValid()}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Approve"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <GridIndex rows={rows} columns={columns} />
    </>
  );
}

export default NoduesApproverIndex;
