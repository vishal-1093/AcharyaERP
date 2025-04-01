import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: "auto",
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

const initialValues = {
  acYearId: null,
};

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

const rows = [
  {
    ac_year: "2024-2025",
    school_name: "AIT",
    board_name: "KEA",
    feetemplate_name: "TEST1234",
    neft_no: "Test@1234",
    receipt_no: 12,
    amount: 5000000,
  },
];

function PaidAtBoardStdList() {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setSelectAll(studentDetailsOptions.every((obj) => obj.checked));
  }, [studentDetailsOptions]);

  useEffect(() => {
    getAcademicyear();
  }, []);

  useEffect(() => {
    getDataBasedOnAcYear();
  }, [values.acYearId]);

  const getAcademicyear = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      const ids = [];
      response.data.data
        .filter((val) => {
          return val.current_year >= 2023;
        })
        .forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
          ids.push(obj.current_year);
        });

      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === 2024
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        yearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };

  const getDataBasedOnAcYear = async () => {
    if (!values.acYearId) return;

    let url;

    url = `/api/academic/getLessonPlan/${values.yearId}`;

    try {
      const response = await axios.get(url);
      setRows(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (id) => (event) => {
    const studentUpdatedList = studentDetailsOptions.map((obj) =>
      obj.id === id ? { ...obj, checked: event.target.checked } : obj
    );
    setStudentDetailsOptions(studentUpdatedList);
  };

  const handleHeaderCheckboxChange = (e) => {
    const allStudentsSelected = studentDetailsOptions.map((obj) => ({
      ...obj,
      checked: e.target.checked,
    }));

    setStudentDetailsOptions(allStudentsSelected);
  };

  const columns = [
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      sortable: false,
      renderHeader: () => (
        <FormGroup>
          {" "}
          <FormControlLabel control={headerCheckbox} />
        </FormGroup>
      ),
      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={params.row.checked}
          onChange={handleCheckboxChange(params.row.id)}
        />
      ),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
    },
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
    },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
    },
    {
      field: "reporting_date",
      headerName: "Reported Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.reporting_date
          ? moment(row.reporting_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "current",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (value, row) =>
        row.current_year + "/" + row.current_sem,
    },
    {
      field: "eligible_reported_status",
      headerName: "Reported",
      flex: 1,
      valueGetter: (value, row) =>
        row.eligible_reported_status
          ? ELIGIBLE_REPORTED_STATUS[row.eligible_reported_status]
          : "",
    },
  ];

  const headerCheckbox = (
    <Checkbox
      checked={selectAll}
      onClick={(e) => handleHeaderCheckboxChange(e)}
    />
  );

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/LessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getDataBasedOnAcYear();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateLessonPlan/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getDataBasedOnAcYear();
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

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Grid
          container
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={2}
          alignItems="center"
        >
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="acYearId"
              label="Balance"
              value={values.acYearId}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="acYearId"
              label="Amount"
              value={values.acYearId}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="acYearId"
              label="Paying Now Total"
              value={values.acYearId}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomTextField
              name="acYearId"
              label="Remarks"
              value={values.acYearId}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <GridIndex rows={rows} columns={columns} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PaidAtBoardStdList;
