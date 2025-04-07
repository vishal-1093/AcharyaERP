import { useState, useEffect,lazy } from "react";
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
const GridIndex = lazy(() => import("../../../components/CardGridIndex"));

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
  tempNo: 1,
};

function HistoryIndex() {
  const [state, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 54,
  });
  const navigate = useNavigate();
  const columnVisibilityModel = {email:false,mobile:false,issuedDate:false,modifiedUsername:false,modifiedDate:false};

  useEffect(() => {
    getStaffHistoryData();
  }, []);

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
    { field: "empCode", headerName: "Emp Code", flex: 1,hideable:false },
    { field: "employeeName", headerName: "Employee", flex: 1,hideable:false  },
    { field: "dateOfJoining", headerName: "DOJ", flex: 1,hideable:false  },
    { field: "designationShortName", headerName: "Designation", flex: 1,hideable:false  },
    { field: "email", headerName: "Email", flex: 1},
    { field: "mobile", headerName: "Phone", flex: 1 },
    {
      field: "issuedDate",
      headerName: "Issued Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.issuedDate).format("DD-MM-YYYY"),
    },
    { field: "endDate", headerName: "Valid Till", flex: 1, hideable:false},
    {
      field: "photo",
      headerName: "Photo",
      flex: 1,
      hideable:false ,
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
      flex: 1
    },
    {
      field: "modifiedDate",
      headerName: "Printed Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.modifiedDate).format("DD-MM-YYYY"),
    },
    {
      field: "remarks",
      type: "actions",
      headerName: "Remarks",
      flex: 1,
      hideable:false,
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

  const handlePageChange = (params) => {
    setState((prevState) => ({
      ...prevState,
      checked: false,
      tempNo: params.page !=0 ? 2 * params.page : 1,
      historyStaffList: state.historyStaffList.map((ele) => ({
        ...ele,
        isSelected: false,
      })),
    }));
    setPaginationModel(params)
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
          let i = paginationModel.page * paginationModel.pageSize;
          i < paginationModel.pageSize * state.tempNo;
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
      for (
        let i = paginationModel.page * paginationModel.pageSize;
        i < paginationModel.pageSize * state.tempNo;
        i++
      ) {
      if (!!state.historyStaffList[i]) {
        state.historyStaffList[i]["isSelected"] = event.target.checked
      }
    }
    setState((prevState) => ({
      ...prevState,
      checked: event.target.checked
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
    const selectedStaff = state.historyStaffList.filter((el) => el.isSelected);
    let updatedStaffList = [];
    for (const staff of selectedStaff) {
      setLoading(true);
    try {
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
              dept_name: staff.departmentNameShort,
              empcode: staff.empCode,
              emp_image_attachment_path: staff.empImageAttachmentPath,
              staffImagePath: URL.createObjectURL(staffImageResponse?.data),
              display_name: staff.displayName,
              phd_status: staff.phdStatus,
            });
          }
        }
      }catch (error) {
      if (error && error.response && error.response.status === 404) {
        setAlertMessage({
          severity: "error",
          message:
            "Something went wrong! Unable to find the Student Attachment !!",
        });
        setAlertOpen(true);
        continue;
      } else {
        setAlertMessage({
          severity: "error",
          message: "Something went wrong! Unable to find the Student Attachment !!",
        });
      }
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  }
  setLoading(false);
   navigate(`/StaffIdCard/Print/view?tabId=2`, { state: updatedStaffList });
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
        
        <Box sx={{ position: "relative", height: "450px", overflow: "auto" }}>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <GridIndex rows={state.historyStaffList || []} columns={columns}
              columnVisibilityModel={columnVisibilityModel} paginationModel={paginationModel} handlePageChange={handlePageChange} />
          </Box>
        </Box>

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
