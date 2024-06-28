import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Button, Box, CircularProgress } from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import PhotoUpload from "./PhotoUpload";
import {GenerateIdCard} from "./GenerateIdCard";
import {StaffIdCardPrint} from "./StaffIdCardPrint";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import PrintIcon from "@mui/icons-material/Print";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";

const initialState = {
  staffLists: [],
  empId: null,
  isAddPhotoModalOpen: false,
  checked: false,
  loading: false,
  isIdCardModalOpen:false,
  IdCardPdfPath:""
};

function PrintIndex() {
  const [state, setState] = useState(initialState);
  const [pageSize, setPageSize] = useState(10);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getStaffData();
  }, []);

  const getStaffData = async () => {
    await axios
      .get(`/api/employee/getEmployeeDetailsForIdCard`)
      .then((res) => {
        if (res?.data?.data.length) {
          let list = res.data.data.map((el, index) => ({
            ...el,
            id: index + 1,
            isSelected: false,
          }));
          setState((prevState) => ({
            ...prevState,
            staffLists: list,
          }));
        }
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    { field: "employee_name", headerName: "Employee", flex: 1 },
    { field: "date_of_joining", headerName: "DOJ", flex: 1 },
    { field: "dept_name_short", headerName: "Department", flex: 1 },
    { field: "designation_short_name", headerName: "Designation", flex: 1 },
    { field: "email", headerName: "Email", flex: 1, hide: true },
    { field: "mobile", headerName: "Phone", flex: 1, hide: true },
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
            {params.row.emp_image_attachment_path ? "Update" : "Upload"}
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
          disabled={!params.row.emp_image_attachment_path}
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  const onClickAddPhoto = (params) => {
    setState((prevState) => ({
      ...prevState,
      empId: params.row?.emp_id,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
    }));
  };

  const handleAddPhotoModal = () => {
    setState((prevState) => ({
      ...prevState,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
    }));
  };

  const handleCellCheckboxChange = (id) => (event) => {
    let updatedLists = state.staffLists.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      staffLists: updatedLists,
    }));
  };

  const handleHeaderCheckboxChange = (event) => {
    event.stopPropagation();
    const isCheckAnyEmployeeUploadPhotoOrNot = state.staffLists.some(
      (row) => row.emp_image_attachment_path
    );
    if (isCheckAnyEmployeeUploadPhotoOrNot) {
      let updatedLists = JSON.parse(JSON.stringify(state.staffLists)).map(
        (el) => ({
          ...el,
          isSelected: !!el.emp_image_attachment_path
            ? event.target.checked
            : false,
        })
      );
      setState((prevState) => ({
        ...prevState,
        checked: event.target.checked,
        staffLists: updatedLists,
      }));
    }
  };

  const headerCheckbox = (
    <Checkbox
      checked={state.checked}
      onClick={(e) => handleHeaderCheckboxChange(e)}
      indeterminate={state.staffLists.some((row) => row.isSelected)}
    />
  );

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handlePrintModal = ()=>{
    setState((prevState)=>({
      ...prevState,
      isIdCardModalOpen:!state.isIdCardModalOpen
    }))
  };

  const printStaffIdCard = async () => {
    setLoading(true);
    const selectedStaff = state.staffLists.filter((el)=>!!el.isSelected);
    let updatedStaffList =[];
    for (const staff of selectedStaff) {
      try {
          if (!!staff?.emp_image_attachment_path) {
            const staffImageResponse = await axios.get(
              `/api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${staff.emp_image_attachment_path}`,
              { responseType: "blob" }
            );
            if (!!staffImageResponse) {
              updatedStaffList.push({
                ...staff,
                staffImagePath: URL.createObjectURL(staffImageResponse?.data),
              });
            }
            if(!!updatedStaffList.length){
              generateStaffIdCard(updatedStaffList)
            }
          }
          setLoading(false);
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response
            ? error.response.data.message
            : "Error",
        });
        setAlertOpen(true);
      }
  }
};

const generateStaffIdCard = async(updatedStaffList) =>{
  const idCardResponse = await GenerateIdCard(updatedStaffList);
  if(!!idCardResponse){
    setState((prevState)=>({
      ...prevState,
      IdCardPdfPath:URL.createObjectURL(idCardResponse),
      isIdCardModalOpen: !state.isIdCardModalOpen
    }))
  }
}
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          variant="contained"
          disableElevation
          disabled={!state.staffLists.some((row) => row.isSelected)}
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          onClick={printStaffIdCard}
        >
          {!!state.loading ? (
            <CircularProgress
              size={15}
              color="inherit"
              style={{ margin: "5px" }}
            />
          ) : (
            <PrintIcon />
          )}
          &nbsp;&nbsp; Print
        </Button>
        <GridIndex
          rowHeight={70}
          rows={state.staffLists}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
        />

        {!!(state.isAddPhotoModalOpen && state.empId) && (
          <ModalWrapper
            title="Image Upload"
            maxWidth={800}
            open={state.isAddPhotoModalOpen}
            setOpen={() => handleAddPhotoModal()}
          >
            <PhotoUpload
              empId={state.empId}
              getStaffData={getStaffData}
              handleAddPhotoModal={handleAddPhotoModal}
            />
          </ModalWrapper>
        )}

        {(!!state.isIdCardModalOpen) && (
          <ModalWrapper
            title="Employee Id Card"
            maxWidth={600}
            open={state.isIdCardModalOpen}
            setOpen={() => handlePrintModal()}
          >
            <StaffIdCardPrint
              state={state}
            />
          </ModalWrapper>
        )}
      </Box>
    </>
  );
}

export default PrintIndex;
