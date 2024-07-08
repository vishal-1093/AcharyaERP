import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import PhotoUpload from "./PhotoUpload";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useNavigate } from "react-router-dom";
import { ValidTillForm } from "./ValidTillForm";
import moment from "moment";
const GridIndex = lazy(() => import("../../../components/GridIndex"));

const initialState = {
  studentLists: [],
  schoolList: [],
  programmeSpecializationList: [],
  academicYearList: [],
  academicYearId: null,
  schoolId: null,
  programSpecializationId: null,
  loading: false,
  viewLoading: false,
  studentId: null,
  studentImagePath: "",
  isAddPhotoModalOpen: false,
  isValidTillPopupOpen: false,
};

function PrintIndex() {
  const [state, setState] = useState([initialState]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    getSchoolData();
    getAcademicYearData();
  }, []);

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "studentName", headerName: "Student", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "dateOfAdmission", headerName: "DOA", flex: 1, hide: true },
    { field: "reportingDate", headerName: "DOR", flex: 1, hide: true },
    { field: "mobile", headerName: "Phone", flex: 1 },
    { field: "currentYear", headerName: "Year", flex: 1 },
    {
      field: "photo",
      headerName: "Photo",
      flex: 1,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onAddPhoto(params)}
            sx={{ borderRadius: 1 }}
          >
            {params.row?.studentImagePath ? "Update" : "Upload"}
          </Button>
        );
      },
    },
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
          checked={params.value}
          disabled={!params.row.studentImagePath}
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  const getAcademicYearData = async () => {
    await axios
      .get(`api/academic/academic_year`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          academicYearList: res?.data?.data.map((el) => ({
            ...el,
            label: el.ac_year,
            value: el.ac_year_id,
          })),
        }));
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`api/institute/school`);
      if (res?.data?.data?.length) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res?.data?.data.map((el) => ({
            ...el,
            label: el.school_name,
            value: el.school_id,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProgrammeAndSpecializationData = async (schoolId) => {
    try {
      if (!!schoolId) {
        const res = await axios.get(
          `api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
        );
        if (res?.data?.data?.length) {
          setState((prevState) => ({
            ...prevState,
            programmeSpecializationList: res?.data?.data.map((el) => ({
              ...el,
              label: el.specialization_with_program1,
              value: el.program_specialization_id,
            })),
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProgramSpecialization = () => {
    setState((prevState) => ({
      ...prevState,
      programmeSpecializationList: [],
      programSpecializationId: null,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      handleProgramSpecialization();
      getProgrammeAndSpecializationData(newValue);
    }
    setState((prev) => ({ ...prev, [name]: newValue }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const getDataOnFilter = async () => {
    setLoading(true);
    try {
      if (
        !!(
          state.schoolId &&
          state.programSpecializationId &&
          state.academicYearId
        )
      ) {
        const res = await axios.get(
          `/api/student/studenDetailsForIdCard?schoolId=${state.schoolId}&programSpecializationId=${state.programSpecializationId}&academicYearId=${state.academicYearId}`
        );
        if (res.status === 200 || res.status === 201) {
          setState((prevState) => ({
            ...prevState,
            studentLists: res?.data?.data.map((ele, index) => ({
              ...ele,
              id: index + 1,
              isSelected: false,
            })),
          }));
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const onClearFilter = () => {
    setState((prevState) => ({
      ...prevState,
      schoolId: null,
      academicYearId: null,
      programSpecializationId: null,
    }));
  };

  const handleCellCheckboxChange = (id) => (event) => {
    let updatedLists = state.studentLists.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      studentLists: updatedLists,
    }));
  };

  const handleHeaderCheckboxChange = (event) => {
    event.stopPropagation();
    const isCheckAnyStudentUploadPhotoOrNot = state.studentLists?.some(
      (row) => row.studentImagePath
    );
    if (isCheckAnyStudentUploadPhotoOrNot) {
      let updatedLists = JSON.parse(JSON.stringify(state.studentLists))?.map(
        (el) => ({
          ...el,
          isSelected: !!el.studentImagePath ? event.target.checked : false,
        })
      );
      setState((prevState) => ({
        ...prevState,
        checked: event.target.checked,
        studentLists: updatedLists,
      }));
    }
  };

  const headerCheckbox = (
    <Checkbox
      checked={state.checked}
      onClick={(e) => handleHeaderCheckboxChange(e)}
      indeterminate={state.studentLists?.some((row) => row.isSelected)}
    />
  );

  const onAddPhoto = (params) => {
    setState((prevState) => ({
      ...prevState,
      studentId: params.row?.studentId,
      studentImagePath: params.row?.studentImagePath,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
    }));
  };

  const handleAddPhotoModal = () => {
    setState((prevState) => ({
      ...prevState,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
      studentImagePath: null,
    }));
  };

  const setViewLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      viewLoading: val,
    }));
  };

  const handleValidTillFormPopup = () => {
    setState((prevState) => ({
      ...prevState,
      isValidTillPopupOpen: !state.isValidTillPopupOpen,
    }));
  };

  const getValidTillFormData = (validTillDate) => {
    ViewIdCard(validTillDate);
  };

  const ViewIdCard = async (validTillDate) => {
    handleValidTillFormPopup();
    setViewLoading(true);
    const selectedStudent = state.studentLists
      .map((el) => ({
        ...el,
        validTillDate: moment(validTillDate).format("MMM YY"),
      }))
      .filter((el) => !!el.isSelected && !!el.studentId);
    let updatedStudentList = [];
    try {
      for (const student of selectedStudent) {
        if (!!student?.studentImagePath) {
          const studentImageResponse = await axios.get(
            `/api/student/studentImageDownload?student_image_attachment_path=${student.studentImagePath}`,
            { responseType: "blob" }
          );
          if (!!studentImageResponse) {
            updatedStudentList.push({
              ...student,
              studentBlobImagePath: URL.createObjectURL(
                studentImageResponse?.data
              ),
              schoolId: state.schoolId,
            });
          }
        }
      }
      navigate(`/StudentIdCard/Print/view?tabId=1`, {
        state: updatedStudentList,
      });
      setViewLoading(false);
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error",
      });
      setAlertOpen(true);
      setViewLoading(false);
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1} mt={2}>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="academicYearId"
              value={state.academicYearId}
              label="Academic Year"
              handleChangeAdvance={handleChangeAdvance}
              options={state.academicYearList || []}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              value={state.schoolId}
              label="School"
              handleChangeAdvance={handleChangeAdvance}
              options={state.schoolList || []}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpecializationId"
              value={state.programSpecializationId}
              label="Programme And Specialization"
              disabled={!state.schoolId}
              handleChangeAdvance={handleChangeAdvance}
              options={state.programmeSpecializationList || []}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              disableElevation
              disabled={
                !(
                  state.academicYearId &&
                  state.schoolId &&
                  state.programSpecializationId
                )
              }
              onClick={getDataOnFilter}
            >
              {!!state.loading ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Filter</strong>
              )}
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              disableElevation
              disabled={
                !(
                  state.academicYearId &&
                  state.schoolId &&
                  state.programSpecializationId
                )
              }
              onClick={onClearFilter}
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                disableElevation
                disabled={!state.studentLists?.some((row) => row.isSelected)}
                onClick={handleValidTillFormPopup}
              >
                {!!state.viewLoading ? (
                  <CircularProgress
                    size={15}
                    color="inherit"
                    style={{ margin: "5px" }}
                  />
                ) : (
                  "View"
                )}
              </Button>
            </div>
            <GridIndex
              rowHeight={70}
              rows={state.studentLists || []}
              columns={columns}
            />
          </Grid>
        </Grid>
        {!!(state.isAddPhotoModalOpen && state.studentId) && (
          <ModalWrapper
            title={!!state.studentImagePath ? "Image Update" : "Image Upload"}
            maxWidth={800}
            open={state.isAddPhotoModalOpen}
            setOpen={() => handleAddPhotoModal()}
          >
            <PhotoUpload
              studentId={state.studentId}
              studentImagePath={state.studentImagePath}
              getData={getDataOnFilter}
              handleAddPhotoModal={handleAddPhotoModal}
            />
          </ModalWrapper>
        )}
        {!!state.isValidTillPopupOpen && (
          <ModalWrapper
            title="Valid Till Form"
            maxWidth={500}
            open={state.isValidTillPopupOpen}
            setOpen={() => handleValidTillFormPopup()}
          >
            <ValidTillForm
              handleValidTillFormPopup={handleValidTillFormPopup}
              getValidTillFormData={getValidTillFormData}
            />
          </ModalWrapper>
        )}
      </Box>
    </>
  );
}

export default PrintIndex;
