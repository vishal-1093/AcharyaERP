import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import axios from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const gridStyle = {
  mb: 7,

  ".MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeaders": {
    background: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
  },
  ".MuiDataGrid-row": {
    background: "#FEFBFF",
    borderbottom: "1px solid #767680",
  },
};

const initialState = {
  acYearId: null,
  acYearList: [],
  blockId: null,
  blockList: [],


  studentLists: [],
  schoolList: [],
  programmeSpecializationList: [],
  academicYearList: [],
  currentYearOrSem: null,
  schoolId: null,
  programSpecializationId: null,
  programSpecializationDetail: null,
  loading: false,
  viewLoading: false,
  studentId: null,
  studentImagePath: "",
  isAddPhotoModalOpen: false,
  isValidTillPopupOpen: false,
  page: null,
  pageSize: null,
  tempNo: null,
};

function HostelStudentIdCardIndex() {
  const [state, setState] = useState([initialState]);
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([
      { name: "ID Card", link: "/IdCardPrint" },
      { name: "Hostel Student" }
    ]);
    setState((prevState) => ({
      ...prevState,
      page: 0,
      pageSize: 54,
      tempNo: 1,
    }));
    getAcademicYearData();
    getBlockData();
  }, []);

  const CustomButton = () => <SettingsIcon />;

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    {
      field: "studentName",
      headerName: "Student",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ textTransform: "capitalize" }}>
          {params.row.studentName.toLowerCase()}
        </Typography>
      ),
    },
    { field: "usn", headerName: "USN", flex: 1, hide: true },
    { field: "bedName", headerName: "Bed Name", flex: 1 },
    { field: "blockName", headerName: "Block Name", flex: 1 },
    { field: "dateOfAdmission", headerName: "DOA", flex: 1, hide: true },
    { field: "reportingDate", headerName: "DOR", flex: 1, hide: true },
    { field: "mobile", headerName: "Phone", flex: 1, hide: true },
    {
      field: "currentYear", headerName: "Year/Sem", flex: 1, renderCell: (params) => {
        return (
          <Typography>{`${params.row?.currentYear}/${params.row?.currentSem}`}</Typography>
        );
      }
    },
    {
      field: "fromDate", headerName: "Reported On", flex: 1, renderCell: (params) => {
        return (
          <Typography>{!!params.row.fromDate ? moment(params.row.fromDate).format("DD-MM-YYYY"):""}</Typography>
        );
      }
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
          disabled={!params.row.student_image_path || !params.row.fromDate}
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
          acYearList: res?.data?.data.map((el) => ({
            ...el,
            label: el.ac_year,
            value: el.ac_year_id,
          })),
        }));
      })
      .catch((err) => console.error(err));
  };

  const getBlockData = async () => {
    try {
      const res = await axios.get(`/api/hostel/HostelBlocks`);
      if (res?.data?.data?.length) {
        setState((prevState) => ({
          ...prevState,
          blockList: res?.data?.data.map((el) => ({
            ...el,
            label: el.blockName,
            value: el.hostelBlockId,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
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
      if (!!(state.acYearId && state.blockId)) {
        const res = await axios.get(
          `api/hostel/getStudentDetailDataBasedOnBlock/${state.acYearId}/${state.blockId}`
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
      acYearId: null,
      blockId: null
    }));
  };

  const setPageSize = (newPageSize) => {
    setState((prevState) => ({
      ...prevState,
      checked: false,
      pageSize: newPageSize,
      studentLists: state.studentLists.map((ele) => ({
        ...ele,
        isSelected: false,
      })),
    }));
  };

  const handlePageChange = (params) => {
    setState((prevState) => ({
      ...prevState,
      checked: false,
      page: !!params ? params : 0,
      tempNo: !!params ? 2 * params : 1,
      studentLists: state.studentLists.map((ele) => ({
        ...ele,
        isSelected: false,
      })),
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
      (row) => row.student_image_path
    );
    if (isCheckAnyStudentUploadPhotoOrNot) {
      for (
        let i = state.page * state.pageSize;
        i < state.pageSize * state.tempNo;
        i++
      ) {
        if (!!state.studentLists[i]) {
          state.studentLists[i]["isSelected"] = !!state.studentLists[i]
            ?.student_image_path && !!state.studentLists[i]
              ?.fromDate
            ? event.target.checked
            : false;
        }
      }
      setState((prevState) => ({
        ...prevState,
        checked: event.target.checked,
      }));
    }
  };

  const headerCheckbox = (
    <Checkbox
      checked={!!state.checked ? true : false}
      onClick={(e) => handleHeaderCheckboxChange(e)}
      indeterminate={state.studentLists?.some((row) => row.isSelected)}
    />
  );

  const setViewLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      viewLoading: val,
    }));
  };

  const ViewIdCard = async () => {
    setViewLoading(true);
    const selectedStudent = state.studentLists.filter((el) => !!el.isSelected && !!el.studentId && !!el.student_image_path);
    let updatedStudentList = [];
    for (const student of selectedStudent) {
      try {
        let date = new Date(student.fromDate);
        date.setMonth(date.getMonth() + 10);
        date.setDate(date.getDate()-1);
        if (!!student?.student_image_path) {
          const studentImageResponse = await axios.get(
            `/api/student/studentImageDownload?student_image_attachment_path=${student.student_image_path}`,
            { responseType: "blob" }
          );
          if (
            studentImageResponse.status === 200 ||
            studentImageResponse.status === 201
          ) {
            updatedStudentList.push({
              ...student,
              vacateDate: moment(date.toISOString().split("T")[0]).format("DD MMM YYYY"),
              studentImagePath: student.student_image_path,
              studentBlobImagePath: URL.createObjectURL(
                studentImageResponse?.data
              ),
            });
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          continue;
        } else {
          setAlertMessage({
            severity: "error",
            message:
              "Something went wrong! Unable to find the Student Attachment !!",
          });
        }
        setAlertOpen(true);
        setViewLoading(false);
      } finally {
      }
    }
    navigate(`/HostelStudentIdCard/View`, {
      state: updatedStudentList,
    });
    setViewLoading(false);
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1} mt={1}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              value={state.acYearId}
              label="Academic Year"
              handleChangeAdvance={handleChangeAdvance}
              options={state.acYearList || []}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="blockId"
              value={state.blockId}
              label="Block"
              handleChangeAdvance={handleChangeAdvance}
              options={state.blockList || []}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              disableElevation
              disabled={
                !(
                  state.acYearId &&
                  state.blockId
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
                  state.acYearId &&
                  state.blockId
                )
              }
              onClick={onClearFilter}
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={12} md={4} align="right">
            <Button
              variant="contained"
              disableElevation
              disabled={!state.studentLists?.some((row) => row.isSelected)}
              onClick={ViewIdCard}
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
          </Grid>

          <Grid item xs={12}>
            <DataGrid
              autoHeight={true}
              rowHeight={70}
              rows={state.studentLists || []}
              columns={columns}
              onPageChange={handlePageChange}
              getRowId={(row) => row.id}
              pageSize={state.pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[9, 27, 54]}
              slots={{
                toolbar: GridToolbar,
                moreActionsIcon: CustomButton,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={gridStyle}
              scrollbarSize={0}
              density="compact"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default HostelStudentIdCardIndex;