import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Box, CircularProgress } from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import PhotoUpload from "./PhotoUpload";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";

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
  staffLists: [],
  empId: null,
  isAddPhotoModalOpen: false,
  checked: false,
  loading: false,
  isIdCardModalOpen: false,
  IdCardPdfPath: "",
  empImagePath: null,
  page: null,
  pageSize: null,
  tempNo: null,
};

function PrintIndex() {
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
    getStaffData();
  }, []);

  const CustomButton = () => <SettingsIcon />;

  const getStaffData = async () => {
    await axios
      .get(`/api/employee/getEmployeeDetailsForIdCard`)
      .then((res) => {
        if (res?.data?.data.length) {
          let list = res?.data?.data
            .filter((el) => el.emp_type_short_name !== "CON")
            .map((el, index) => ({
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
      empImagePath: params.row?.emp_image_attachment_path,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
    }));
  };

  const handleAddPhotoModal = () => {
    setState((prevState) => ({
      ...prevState,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
      empImagePath: null,
    }));
  };

  const setPageSize = (newPageSize) => {
    setState((prevState) => ({
      ...prevState,
      checked: false,
      pageSize: newPageSize,
      staffLists: state.staffLists.map((ele) => ({
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
      staffLists: state.staffLists.map((ele) => ({
        ...ele,
        isSelected: false,
      })),
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
      for (
        let i = state.page * state.pageSize;
        i < state.pageSize * state.tempNo;
        i++
      ) {
        if (!!state.staffLists[i]) {
          state.staffLists[i]["isSelected"] = !!state.staffLists[i]
            ?.emp_image_attachment_path
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

  const ViewIdCard = async () => {
    setLoading(true);
    const selectedStaff = state.staffLists.filter((el) => el.isSelected);
    let updatedStaffList = [];
    for (const staff of selectedStaff) {
      try {
        if (staff?.emp_image_attachment_path) {
          const staffImageResponse = await axios.get(
            `/api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${staff.emp_image_attachment_path}`,
            { responseType: "blob" }
          );
          if (
            staffImageResponse.status === 200 ||
            staffImageResponse.status === 201
          ) {
            updatedStaffList.push({
              ...staff,
              staffImagePath: URL.createObjectURL(staffImageResponse?.data),
            });
          }
        }
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          setAlertMessage({
            severity: "error",
            message:
              "Something went wrong! Unable to find the Student Attachment !!",
          });
          setLoading(false);
          setAlertOpen(true);
          continue;
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong! Unable to find the Student Attachment !!",
          });
          setLoading(false);
        }
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };
    navigate(`/StaffIdCard/Print/view?tabId=1`, { state: updatedStaffList });
    setLoading(false);
  };

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          variant="contained"
          disableElevation
          disabled={!state.staffLists.some((row) => row.isSelected)}
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
          rows={state.staffLists || []}
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
              getData={getStaffData}
              handleAddPhotoModal={handleAddPhotoModal}
            />
          </ModalWrapper>
        )}
      </Box>
    </>
  );
}

export default PrintIndex;
