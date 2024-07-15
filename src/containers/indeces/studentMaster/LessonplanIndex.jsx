import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, IconButton, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import moment from "moment";

function LessonplanIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState({ yearId: 2 });
  const [academicYearOptions, setAcademicYearOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAcademicyear();
  }, []);

  useEffect(() => {
    getDataBasedOnAcYear();
  }, [values.yearId]);

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getDataBasedOnAcYear = async () => {
    if (values.yearId)
      await axios
        .get(`/api/academic/getLessonPlan/${values.yearId}`)
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((error) => console.error(error));
  };

  const handleChangeAdvance = async (name, newValue) => {
    getDataBasedOnAcYear();
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const columns = [
    { field: "ac_year", headerName: "AC Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "year_sem", headerName: "Year/Sem", flex: 1 },
    { field: "section_name", headerName: "Section", flex: 1 },
    { field: "subject_name_short", headerName: "Subject", flex: 1 },
    { field: "title_of_book", headerName: "Reference Book", flex: 1 },
    { field: "plan_date", headerName: "Plan Date" },
    { field: "contents", headerName: "Contents" },
    { field: "teaching_aid", headerName: "Teaching Aid" },
    { field: "empcode", headerName: "EMP Code" },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

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
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid container columnSpacing={6} marginBottom={2}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="yearId"
                label="Academic Year"
                options={academicYearOptions}
                value={values.yearId}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={9} textAlign="right">
              <Button
                onClick={() => navigate("/StudentMaster/LessonplanForm")}
                variant="contained"
                disableElevation
                sx={{ borderRadius: 2 }}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            </Grid>
          </Grid>

          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />

          <GridIndex rows={rows} columns={columns} />
        </FormWrapper>
      </Box>
    </>
  );
}

export default LessonplanIndex;
