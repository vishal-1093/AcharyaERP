import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Box, IconButton, CircularProgress } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalWrapper from "../../../components/ModalWrapper";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import PhotoUpload from "./PhotoUpload";
import { RemarksForm } from "./RemarksForm";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
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
  historyStaffList: [],
  empId: null,
  isAddPhotoModalOpen: false,
  empImagePath: null,
  isRemarksFormModalOpen: false,
  receiptNo: "",
  receiptDate: "",
  remarks: "",
  loading: false,
  page: null,
  pageSize: null,
  tempNo: null,
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
    getStaffHistoryData();
  }, []);

  const CustomButton = () => <SettingsIcon />;

  const getStaffHistoryData = async () => {
    await axios
      .get(`/api/employee/employeeIdCardHistoryDetails`)
      .then((res) => {
        if (res?.data?.data.length) {
          let list = res.data.data.map((el, index) => ({
            ...el,
            id: index + 1,
            isSelected: false,
          }));
          setState((prevState) => ({
            ...prevState,
            historyStaffList: list,
          }));
        }
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "empCode", headerName: "Emp Code", flex: 1 },
    { field: "employeeName", headerName: "Employee", flex: 1 },
    { field: "dateOfJoining", headerName: "DOJ", flex: 1 },
    { field: "designationShortName", headerName: "Designation", flex: 1 },
    { field: "email", headerName: "Email", flex: 1, hide: true },
    { field: "mobile", headerName: "Phone", flex: 1, hide: true },
    {
      field: "issuedDate",
      headerName: "Issued Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.issuedDate).format("DD-MM-YYYY"),
    },
    { field: "endDate", headerName: "Valid Till", flex: 1, hide: true },
    {
      field: "photo",
      headerName: "Photo",
      flex: 1,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onClickAddPhoto(params)}
            sx={{ borderRadius: 1 }}
          >
            Update
          </Button>
        );
      },
    },
    {
      field: "modifiedUsername",
      headerName: "Printed By",
      flex: 1,
      hide: true,
    },
    {
      field: "modifiedDate",
      headerName: "Printed Date",
      flex: 1,
      hide: true,
      type: "date",
      renderCell: (params) =>
        moment(params.row.modifiedDate).format("DD-MM-YYYY"),
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
            JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId == 1
              ? false
              : JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId !==
                  1 && !params.row.remarks
              ? true
              : false
          }
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  const onClickAddPhoto = (params) => {
    setState((prevState) => ({
      ...prevState,
      empId: params.row?.empId,
      empImagePath: params.row?.empImageAttachmentPath,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
    }));
  };

  const handleAddPhotoModal = () => {
    setState((prevState) => ({
      ...prevState,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
      empId: null,
      empImagePath: null,
    }));
  };

  const onClickRemarkForm = (params) => {
    setState((prevState) => ({
      ...prevState,
      empId: params.row?.empId,
      receiptNo: params.row?.receiptNo || "",
      receiptDate: params.row?.receiptDate || "",
      remarks: params.row?.remarks || "",
      isRemarksFormModalOpen: !state.isRemarksFormModalOpen,
    }));
  };

  const handleRemarkFormModal = () => {
    setState((prevState) => ({
      ...prevState,
      isRemarksFormModalOpen: !state.isRemarksFormModalOpen,
      empId: null,
    }));
  };

  const setPageSize = (newPageSize) => {
    setState((prevState) => ({
      ...prevState,
      checked: false,
      pageSize: newPageSize,
      historyStaffList: state.historyStaffList.map((ele) => ({
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
      historyStaffList: state.historyStaffList.map((ele) => ({
        ...ele,
        isSelected: false,
      })),
    }));
  };

  const handleCellCheckboxChange = (id) => (event) => {
    let updatedLists = state.historyStaffList.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      historyStaffList: updatedLists,
    }));
  };

  const handleHeaderCheckboxChange = (event) => {
    event.stopPropagation();
    const isSuperAdmin =
      JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId == 1;
    if (!isSuperAdmin) {
      const isCheckEmpRemarksOrNot = state.historyStaffList.some(
        (row) => row.remarks
      );
      if (isCheckEmpRemarksOrNot) {
        for (
          let i = state.page * state.pageSize;
          i < state.pageSize * state.tempNo;
          i++
        ) {
          if (!!state.historyStaffList[i]) {
            state.historyStaffList[i]["isSelected"] = !!state.historyStaffList[
              i
            ]?.remarks
              ? event.target.checked
              : false;
          }
        }
        setState((prevState) => ({
          ...prevState,
          checked: event.target.checked,
        }));
      }
    } else {
      let updatedLists = JSON.parse(JSON.stringify(state.historyStaffList)).map(
        (el) => ({
          ...el,
          isSelected: event.target.checked,
        })
      );
      setState((prevState) => ({
        ...prevState,
        checked: event.target.checked,
        historyStaffList: updatedLists,
      }));
    }
  };

  const headerCheckbox = (
    <Checkbox
      checked={state.checked}
      onClick={(e) => handleHeaderCheckboxChange(e)}
      indeterminate={state.historyStaffList.some((row) => row.isSelected)}
    />
  );

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const ViewIdCard = async () => {
    setLoading(true);
    const selectedStaff = state.historyStaffList.filter((el) => el.isSelected);
    let updatedStaffList = [];
    try {
      for (const staff of selectedStaff) {
        if (staff?.empImageAttachmentPath) {
          const staffImageResponse = await axios.get(
            `/api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${staff.empImageAttachmentPath}`,
            { responseType: "blob" }
          );
          if (
            staffImageResponse.status === 200 ||
            staffImageResponse.status === 201
          ) {
            updatedStaffList.push({
              id: staff.id,
              employee_name: staff.employeeName,
              designation_name: staff.designationName,
              dept_name: staff.departmentName,
              empcode: staff.empCode,
              emp_image_attachment_path: staff.empImageAttachmentPath,
              staffImagePath: URL.createObjectURL(staffImageResponse?.data),
              display_name: staff.displayName,
              phd_status: staff.phdStatus,
            });
          }
        }
      }
      navigate(`/StaffIdCard/Print/view?tabId=2`, { state: updatedStaffList });
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          variant="contained"
          disableElevation
          disabled={!state.historyStaffList.some((row) => row.isSelected)}
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          onClick={ViewIdCard}
        >
          {!!state.loading ? (
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
          rows={state.historyStaffList || []}
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

        {!!(state.isAddPhotoModalOpen && state.empId) && (
          <ModalWrapper
            title={!!state.empImagePath ? "Image Update" : "Image Upload"}
            maxWidth={800}
            open={state.isAddPhotoModalOpen}
            setOpen={() => handleAddPhotoModal()}
          >
            <PhotoUpload
              empId={state.empId}
              empImagePath={state.empImagePath}
              getData={getStaffHistoryData}
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
              getData={getStaffHistoryData}
              empId={state.empId}
              receiptNo={state.receiptNo}
              receiptDate={state.receiptDate}
              remarks={state.remarks}
              handleRemarkFormModal={handleRemarkFormModal}
            />
          </ModalWrapper>
        )}
      </Box>
    </>
  );
}

export default HistoryIndex;
