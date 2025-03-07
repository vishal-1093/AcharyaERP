import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import CustomModal from "../../components/CustomModal";
import axios from "../../services/Api";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import DOCView from "../../components/DOCView";
import ModalWrapper from "../../components/ModalWrapper";
import { SalaryBreakupModal } from "./IncrementFinalizedList";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme?.palette?.auzColor?.main,
    color: theme?.palette?.headerWhite?.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const initialValues = { fileName: "", deptId: "", month: null, schoolId: "", };

function IncrementApproveList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const [attachmentPath, setAttachmentPath] = useState();
  const [data, setData] = useState({});
  const [viewSalary, setViewSalary] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  function formatMonthYear(month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }

  const columns = [
    { field: "empCode", headerName: "Empcode", flex: 1 },
    { field: "employeeName", headerName: " Employee Name", flex: 1 },
    {
      field: "dateofJoining",
      headerName: "DOJ",
      flex: 1,
    },
    { field: "school_name_short", headerName: "Inst", flex: 1 },
    {
      field: "experience",
      headerName: "Experience",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">{params.row.experience}</Typography>
      ),
      hide: true,
    },
    // { field: "grossDifference", headerName: "Gross Difference ", flex: 1, hide: true },
    {
      field: "previousBasic",
      headerName: "Current Basic",
      flex: 1,
      hide: true,
    },
    {
      field: "previousDepartment",
      headerName: "Department",
      flex: 1,
      hide: true,
 //     type: "date",
      valueGetter: (value, row) =>
        row?.previousDepartment ? row?.previousDepartment : "--",
    },
    {
      field: "previousSplPay",
      headerName: "Current SplPay",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ paddingLeft: 0 }}>
          {params.row?.previousSplPay ? params.row?.previousSplPay : "-"}
        </Typography>
      ),
    },
    { field: "proposedDepartment", headerName: "Dept", flex: 1 },
    {
      field: "proposedDesignation",
      headerName: "Designation",
      flex: 1,
    },
    {
      field: "proposedSalaryStructure",
      headerName: "Salary Structure",
      flex: 1,
    },
    { field: "proposedBasic", headerName: "Basic", flex: 1,hide :true },
    { field: "proposedSplPay", headerName: "Special Pay", flex: 1,hide :true },
    { field: "proposedGrosspay", headerName: "Gross Pay", flex: 1,hide :true },
    { field: "proposedCtc", headerName: "CTC", flex: 1 ,hide :true},
    { field: "grossDifference", headerName: "Gross Incr", flex: 1 },
    { field: "ctcDifference", headerName: "CTC Incr", flex: 1 },
    {
      field: "month",
      headerName: "MM/YY",
      flex: 1,
      renderCell: (params) => {
        return <>{formatMonthYear(params?.row?.month, params?.row?.year)}</>;
      },
    },
    {
      field: "view",
      headerName: "Attachment",
      type: "actions",
      getActions: (params) => [
        params.row.attachmentPath !== null ? (
          <IconButton onClick={() => handleView(params)}>
            <Visibility fontSize="small" color="primary" />
          </IconButton>
        ) : (
          <>
          </>
        ),
      ],
    },
    {
      field: "view Salary",
      headerName: "Salary Breakup",
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleViewSalary(params)}>
          <Visibility fontSize="small" color="primary" />
        </IconButton>
      ],
    },
  ];

  useEffect(() => {
    getData();
    getSchoolDetails();
    setCrumbs([{ name: "Increment Approve List" }]);
  }, []);

  useEffect(() => {
    getDepartmentOptions();
    getData();
  }, [values.schoolId]);

  useEffect(() => {
    getData();
  }, [values.deptId, values.month]);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj?.school_id,
            label: obj?.school_name_short,
            school_name_short: obj?.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.dept_id,
              label: obj.dept_name,
              dept_name_short: obj?.dept_name_short,
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getData = async () => {
    try {
      let baseURL = `/api/incrementCreation/getIncrementApprovedList`;
      const params = new URLSearchParams();
      const month = values.month && moment(values.month).format("MM");

      if (values?.schoolId) params.append("school_id", values?.schoolId);
      if (values?.deptId) params.append("dept_id", values?.deptId);
      if (values.month) params.append("month", month);

      const response = await axios.get(`${baseURL}?${params.toString()}`);

      setRows(response.data.data);;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleView = async (params) => {
    setTemplateWrapperOpen(true)
    setAttachmentPath(params.row.attachmentPath)
    // await axios
    //   .get(
    //     `/api/incrementCreation/downloadIncrementCreationFile?fileName=${params.row.attachmentPath}`,
    //     {
    //       responseType: "blob",
    //     }
    //   )
    //   .then((res) => {
    //     const url = window.URL.createObjectURL(new Blob([res.data]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "application.pdf");
    //     document.body.appendChild(link);
    //     link.click();
    //   })
    //   .catch((err) => console.error(err));
    // await axios
    //   .get(
    //     `/api/incrementCreation/getIncrementByIncrementId?incrementId=${params.row.incrementCreationId}`
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {});
  };
  const handleViewSalary = async (params) => {
    setViewSalary(true)
    await axios
      .get(
        `/api/incrementCreation/getIncrementByIncrementId?incrementId=${params.row.incrementCreationId}`
      )
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => { });
  };
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  return (
    <>
      <Grid container justifyContent="flex-start" rowSpacing={2} columnSpacing={4} mt={1} mb={2}>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="schoolId"
            label="School"
            value={values.schoolId}
            options={schoolOptions}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="deptId"
            label="Department"
            value={values.deptId}
            options={departmentOptions}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!values?.schoolId}
          />
        </Grid>

        <Grid item xs={12} md={2} display="flex" alignItems="center">
          <CustomDatePicker
            name="month"
            label="Month"
            value={values.month}
            handleChangeAdvance={handleChangeAdvance}
            views={["month", "year"]}
            openTo="month"
            inputFormat="MM/YYYY"
            clearIcon={true}
          />
        </Grid>
      </Grid>
      <ModalWrapper
        open={templateWrapperOpen}
        setOpen={setTemplateWrapperOpen}
        maxWidth={1200}
      >
        <>
          {attachmentPath && <DOCView
            attachmentPath={`/api/incrementCreation/downloadIncrementCreationFile?fileName=${attachmentPath}`}
          />}
        </>
      </ModalWrapper>
      <SalaryBreakupModal viewSalary={viewSalary} setViewSalary={setViewSalary} salaryData={data} />
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Box sx={{ position: "relative", mt: 1 }}>
        <GridIndex
          rows={rows}
          columns={columns}
          getRowId={(row) => row.incrementCreationId}
        />
      </Box>
    </>
  );
}
export default IncrementApproveList;
