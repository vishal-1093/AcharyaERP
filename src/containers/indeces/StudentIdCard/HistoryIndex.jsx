import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import PhotoUpload from "./PhotoUpload";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FormGroup from "@mui/material/FormGroup";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { RemarksForm } from "./RemarksForm";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

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
  studentHistoryList: [],
  loading: false,
  studentImagePath: "",
  studentId: null,
  isRemarksFormModalOpen: false,
  isAddPhotoModalOpen: false,
  viewLoading: false,
  studentDetail: null,
  page: null,
  pageSize: null,
  tempNo: null,
  isBucketModalOpen: false,
  studentBucketList: [],
};

function HistoryIndex() {
  const [state, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      page: 0,
      pageSize: 54,
      tempNo: 1,
    }));
    getStudentHistoryData();
    getBucketStudentList();
  }, []);

  const CustomButton = () => <SettingsIcon />;

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    {
      field: "student_name",
      headerName: "Student",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ textTransform: "capitalize", fontSize: "13px" }}>
          {params.row.student_name.toLowerCase()}
        </Typography>
      ),
    },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "date_of_admission", headerName: "DOA", flex: 1, hide: true },
    { field: "reporting_date", headerName: "DOR", flex: 1, hide: true },
    { field: "mobile", headerName: "Phone", flex: 1 },
    { field: "current_year", headerName: "Year", flex: 1 },
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
      field: "remarks",
      type: "actions",
      headerName: "Remarks",
      flex: 1,
      getActions: (params) => [
        <IconButton color="primary" onClick={() => onClickRemarkForm(params)}>
          {!params.row.remarks ? (
            <PlaylistAddIcon sx={{ fontSize: 22 }} />
          ) : (
            <VisibilityIcon />
          )}
        </IconButton>,
      ],
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
          disabled={
            !!params.row.studentIdCardBucketId ? true : JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId == 1
              ? false
              : JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId !==
                  1 && !params.row.remarks
              ? true
              : !!params.row.studentIdCardBucketId ? true : false
          }
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
    {
      field: "action",
      headerName: "Add To Bucket",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        !!params.row?.studentIdCardBucketId ? (
          <HtmlTooltip title="Already In Bucket">
            <RemoveCircleIcon
              fontSize="medium"
              color="secondary"
              onClick={() => addBucket(params.row)}
            />
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title="Add To Bucket">
            <IconButton
              onClick={() => addBucket(params.row)}
              disabled={!params.row.studentImagePath}
            >
              <AddCircleIcon fontSize="medium" color="primary" />
            </IconButton>
          </HtmlTooltip>
        ),
      ],
    },
  ];

  const handleBucketModal = () => {
    setState((prevState) => ({
      ...prevState,
      isBucketModalOpen: !state.isBucketModalOpen,
    }));
  };

  const setPageSize = (newPageSize) => {
    setState((prevState) => ({
      ...prevState,
      checked: false,
      pageSize: newPageSize,
      studentHistoryList: state.studentHistoryList.map((ele) => ({
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
      studentHistoryList: state.studentHistoryList?.map((ele) => ({
        ...ele,
        isSelected: false,
      })),
    }));
  };

  const handleCellCheckboxChange = (id) => (event) => {
    let updatedLists = state.studentHistoryList.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      studentHistoryList: updatedLists,
    }));
  };

  const handleHeaderCheckboxChange = (event) => {
    event.stopPropagation();
    const isCheckAnyStudentUploadPhotoOrNot = state.studentHistoryList?.some(
      (row) => row.studentImagePath
    );
    if (isCheckAnyStudentUploadPhotoOrNot) {
      for (
        let i = state.page * state.pageSize;
        i < state.pageSize * state.tempNo;
        i++
      ) {
        if (!!state.studentHistoryList[i]) {
          if(JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId == 1){
            state.studentHistoryList[i]["isSelected"] = !!state
            .studentHistoryList[i]?.studentImagePath && !state
            .studentHistoryList[i]?.studentIdCardBucketId
            ? event.target.checked
            : false;
          }else {
            state.studentHistoryList[i]["isSelected"] = !!state
            .studentHistoryList[i]?.studentImagePath && !state
            .studentHistoryList[i]?.studentIdCardBucketId && !!state
            .studentHistoryList[i]?.remarks
            ? event.target.checked
            : false;
          }
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

  const getStudentHistoryData = async () => {
    try {
      const res = await axios.get(`api/student/studentIdCardHistoryDetails`);
      if (res?.status == 200) {
        setState((prevState) => ({
          ...prevState,
          studentHistoryList: res?.data?.data.map((el, index) => ({
            ...el,
            id: index + 1,
            isSelected: false,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onAddPhoto = (params) => {
    setState((prevState) => ({
      ...prevState,
      studentId: params.row?.student_id,
      studentImagePath: params.row?.studentImagePath,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
    }));
  };

  const handleAddPhotoModal = () => {
    setState((prevState) => ({
      ...prevState,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
      studentImagePath: null,
      studentId: "",
    }));
  };

  const setViewLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      viewLoading: val,
    }));
  };

  const getBucketStudentList = async () => {
    try {
      const res = await axios.get(`/api/student/studentIdCardBucketDetails`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          studentBucketList: res.data.data?.map((ele, index) => ({
            id: index + 1,
            ...ele,
          })),
        }));
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const addBucket = async (params) => {
    if (state.studentBucketList?.length < 9) {
      let { student_id, current_year ,student_id_card_history_id} = params;
      try {
        let payload = {
          studentId: student_id,
          currentYear: current_year,
          studentIdCardHistoryId: student_id_card_history_id,
          active: true,
        };
        const res = await axios.post(`api/student/studentIdCardBucket`, [
          payload,
        ]);
        if (res.status == 200 || res.status == 201) {
          setAlertMessage({
            severity: "success",
            message: `Student added to bucket successfully !!`,
          });
          setAlertOpen(true);
          getBucketStudentList();
          getStudentHistoryData();
        }
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: "An error occured !!",
        });
        setAlertOpen(true);
      }
    } else {
      setAlertMessage({
        severity: "error",
        message: "You have already added maximum students !!",
      });
      setAlertOpen(true);
    }
  };

  const ViewIdCard = async () => {
    setViewLoading(true);
    const newBucketList =  state.studentBucketList?.map((ele) => ({ ...ele })).filter((el) => !!el.studentImagePath && !!el.student_id);
    const studentHistoryList = state.studentHistoryList?.map((ele) => ({ ...ele })).filter((el) => !!el.isSelected && !!el.student_id && !!el.studentImagePath);
    const selectedStudent = [...newBucketList,...studentHistoryList];

    let updatedStudentList = [];
    for (const student of selectedStudent) {
      try {
        if (!!student?.studentImagePath) {
          const studentImageResponse = await axios.get(
            `/api/student/studentImageDownload?student_image_attachment_path=${student.studentImagePath}`,
            { responseType: "blob" }
          );
          if (
            studentImageResponse.status === 200 ||
            studentImageResponse.status === 201
          ) {
            updatedStudentList.push({
              ...student,
              displayName: student.display_name,
              studentId: student.student_id,
              studentName: student.student_name,
              currentYear: student.current_year,
              programWithSpecialization: student.programWithSpecialization,
              validTillDate: student.valid_till,
              studentBlobImagePath: URL.createObjectURL(
                studentImageResponse?.data
              ),
            });
          }
        }
      } catch (error) {
        if (error.response && error.response.status == 404) {
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
    navigate(`/StudentIdCard/Print/view?tabId=2`, {
      state: updatedStudentList,
    });
    setViewLoading(false);
  };

  const onClickRemarkForm = (params) => {
    setState((prevState) => ({
      ...prevState,
      studentId: params.row?.student_id,
      studentDetail: params.row,
      receiptNo: params.row?.receipt_no || "",
      receiptDate: params.row?.receipt_date || "",
      remarks: params.row?.remarks || "",
      isRemarksFormModalOpen: !state.isRemarksFormModalOpen,
    }));
  };

  const handleRemarkFormModal = () => {
    setState((prevState) => ({
      ...prevState,
      isRemarksFormModalOpen: !state.isRemarksFormModalOpen,
      studentId: "",
      studentDetail: null,
    }));
  };

  const removeStudentFromBucket = async (rowData) => {
    try {
      if (!!rowData?.student_id_card_bucket_id) {
        const res = await axios.delete(
          `api/student/removeStudentDetailsFromBucket/${rowData?.student_id_card_bucket_id}`
        );
        if (res.status == 200 || res.status == 201) {
          getBucketStudentList();
          getStudentHistoryData();
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          sx={{
            marginRight: "35px",
            position: "absolute",
            right: 80,
            top: -57,
            borderRadius: 2,
          }}
          variant="contained"
          disableElevation
          disabled={state.studentBucketList?.length == 0}
          onClick={handleBucketModal}
        >
          Bucket
        </Button>
        <Button
          variant="contained"
          disableElevation
          disabled={state.studentBucketList?.length == 9 ? false : !state.studentHistoryList?.some((row) => row.isSelected ? true : false)}
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
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

        <DataGrid
          autoHeight={true}
          rowHeight={70}
          rows={state.studentHistoryList || []}
          columns={columns}
          onPageChange={handlePageChange}
          getRowId={(row) => row.id}
          pageSize={state.pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[9, 27, 54]}
          components={{
            Toolbar: GridToolbar,
            MoreActionsIcon: CustomButton,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={gridStyle}
          scrollbarSize={0}
          density="compact"
        />

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
              getData={getStudentHistoryData}
              handleAddPhotoModal={handleAddPhotoModal}
            />
          </ModalWrapper>
        )}

        {!!state.isRemarksFormModalOpen && (
          <ModalWrapper
            title={!!state.remarks ? "View Remarks" : "Please Fill The Remarks"}
            maxWidth={800}
            open={state.isRemarksFormModalOpen}
            setOpen={() => handleRemarkFormModal()}
          >
            <RemarksForm
              getData={getStudentHistoryData}
              studentId={state.studentId}
              receiptNo={state.receiptNo}
              receiptDate={state.receiptDate}
              remarks={state.remarks}
              studentDetail={state.studentDetail}
              handleRemarkFormModal={handleRemarkFormModal}
            />
          </ModalWrapper>
        )}

        {!!state.isBucketModalOpen && (
          <ModalWrapper
            title="Student Lists"
            maxWidth={800}
            open={state.isBucketModalOpen}
            setOpen={() => handleBucketModal()}
          >
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Auid</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.studentBucketList?.length > 0 &&
                    state.studentBucketList.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell scope="row">{row.auid}</TableCell>
                        <TableCell>{row.student_name}</TableCell>
                        <TableCell>{row.current_year}</TableCell>
                        <TableCell>
                          <HtmlTooltip title="Remove From Bucket">
                            <RemoveCircleIcon
                              sx={{ cursor: "pointer" }}
                              fontSize="medium"
                              color="secondary"
                              onClick={() => removeStudentFromBucket(row)}
                            />
                          </HtmlTooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ModalWrapper>
        )}
      </Box>
    </>
  );
}

export default HistoryIndex;
