import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";

const initialValues = {
  admissionCategory: [],
};

function TranscriptProgramIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const [res, CategoryRes] = await Promise.all([
        axios.get(
          `/api/academic/fetchAllProgramTranscriptDetails?page=${0}&page_size=${10000}&sort=created_date`
        ),
        axios.get("/api/student/concateFeeAdmissionSubCategoryDetail"),
      ]);
      const CategoryResData = CategoryRes.data.data;
      const categoryOptionData = [];
      CategoryResData.forEach((obj) => {
        categoryOptionData.push({
          value: obj.fee_admission_sub_category_id,
          label: obj.concateFullName,
        });
      });
      setRows(res.data.data.Paginated_data.content);
      setCategoryOptions(categoryOptionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response.data
          ? err.response.data.message
          : "Unable to fetch the data",
      });
      setAlertOpen(true);
    }
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios
          .delete(`/api/academic/ProgramTranscriptDetails/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/academic/activateProgramTranscriptDetails/${id}`)
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
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSelectAll = () => {
    setValues((prev) => ({
      ...prev,
      admissionCategory: categoryOptions.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = () => {
    setValues((prev) => ({ ...prev, admissionCategory: [] }));
  };

  const handleAdmissionCategory = (data) => {
    setRowData(data);
    setValues((prev) => ({
      ...prev,
      admissionCategory: data.fee_admission_sub_category_id || [],
    }));
    setModalWrapperOpen(true);
  };

  const handleCreate = async () => {
    const { admissionCategory } = values;
    if (admissionCategory.length === 0) {
      setModalWrapperOpen(true);
      getData();
      return;
    }
    try {
      setLoading(true);
      const assignmentData = await axios.get(
        `/api/academic/ProgramTranscriptDetails/${rowData.id}`
      );
      const updateData = assignmentData.data.data;
      updateData.fee_admission_sub_category_id = admissionCategory.toString();
      const putData = [updateData];
      const response = await axios.put(
        `/api/academic/ProgramTranscriptDetails/${rowData.id}`,
        putData
      );

      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "The admission category has been successfully assigned !!",
        });
        setAlertOpen(true);
        getData();
        setModalWrapperOpen(false);
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response.data
          ? err.response.data.message
          : "Error while submitting",
      });
      setAlertOpen(true);
      setModalWrapperOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "transcript", headerName: "Transcript", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "id",
      headerName: "Admission Category",
      flex: 1,
      renderCell: (params) => {
        const hasStudents =
          params.row.fee_admission_sub_category_id?.length > 0;
        const studentCount =
          params.row.fee_admission_sub_category_id?.split(",").length || 0;
        return (
          <IconButton onClick={() => handleAdmissionCategory(params.row)}>
            {hasStudents ? (
              <Badge
                badgeContent={studentCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    left: -10,
                  },
                }}
              />
            ) : (
              <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
            )}
          </IconButton>
        );
      },
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
     // type: "date",
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            icon={<Check />}
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            icon={<HighlightOff />}
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

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      {/* Admission Category Assignment  */}
      <ModalWrapper
        open={modalWrapperOpen}
        setOpen={setModalWrapperOpen}
        maxWidth={900}
      >
        <Box p={2}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <CheckboxAutocomplete
                name="admissionCategory"
                label="Admission Category"
                value={values.admissionCategory}
                options={categoryOptions}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                required
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* Grid Index  */}
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() =>
            navigate("/TranscriptMaster/TranscriptAssignment/Assign")
          }
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Assign
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default TranscriptProgramIndex;
