import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Button, Box, IconButton } from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import PhotoUpload from "./PhotoUpload";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import PrintIcon from "@mui/icons-material/Print";
import axios from "../../../services/Api";

const initialState = {
  staffLists: [],
  isAddPhotoModalOpen: false,
  checked: false,
};

function PrintIndex() {
  const [state, setState] = useState(initialState);

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
            onClick={handleAddPhotoModal}
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
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: "createdUsername", headerName: "Created By", flex: 1, hide: true },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      type: "date",
    },
  ];

  const handleAddPhotoModal = () => {
    setState((prevState) => ({
      ...prevState,
      isAddPhotoModalOpen: !state.isAddPhotoModalOpen,
    }));
  };

  const handleHeaderCheckboxChange = (event) => {
    const updatedLists = state.staffLists.map((el) => ({
      ...el,
      isSelected: event.target.checked,
    }));
    setState((prevState) => ({
      ...prevState,
      checked: event.target.checked,
      staffLists: updatedLists,
    }));
  };

  const handleCellCheckboxChange = (id) => (event) => {
    const updatedLists = state.staffLists.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      staffLists: updatedLists,
    }));
  };

  const headerCheckbox = (
    <Checkbox
      checked={state.checked}
      onClick={handleHeaderCheckboxChange}
      indeterminate={state.staffLists.some((row) => row.isSelected)}
    />
  );

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        >
          <PrintIcon />
          &nbsp;&nbsp; Print
        </Button>
        <GridIndex rowHeight={70} rows={state.staffLists} columns={columns} />

        {!!state.isAddPhotoModalOpen && (
          <ModalWrapper
            title="Image Upload"
            maxWidth={800}
            open={state.isAddPhotoModalOpen}
            setOpen={() => handleAddPhotoModal()}
          >
            <PhotoUpload />
          </ModalWrapper>
        )}
      </Box>
    </>
  );
}

export default PrintIndex;
