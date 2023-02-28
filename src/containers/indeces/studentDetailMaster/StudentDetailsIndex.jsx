import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress, IconButton } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  yearId: "",
};

function StudentDetailsIndex() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAcademicYearOptions();
    getData();
  }, []);

  const getAcademicYearOptions = async () => {
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

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "yearId") {
      getData(
        `/api/student/studentDetailsIndex/${newValue}?page=0&page_size=100&sort=createdDate`
      );
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const columns = [
    { field: "student_name", headerName: "Name", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },

    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "date_of_admission", headerName: "DOA", flex: 1 },
    {
      field: "fee_admission_category_short_name",
      headerName: "Admission Category",
      flex: 1,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Provision Certificate",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/StudentDetailsMaster/ProvisionCertificate/View/${params.row.id}`
            )
          }
        >
          <RemoveRedEyeIcon />
        </IconButton>,
      ],
    },
  ];

  const handleCreate = () => {
    if (values.yearId) {
      getData(
        `/api/student/studentDetailsIndex/${values.yearId}?page=0&page_size=100&sort=createdDate`
      );
    }
  };
  const getData = async (data) => {
    await axios
      .get(data)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1} marginTop={-5}>
        <FormWrapper>
          <Grid container columnSpacing={6} marginBottom={2}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="yearId"
                label="Academic Year"
                options={academicYearOptions}
                value={values.yearId}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleCreate}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong>{"Submit"}</strong>
                )}
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
export default StudentDetailsIndex;
