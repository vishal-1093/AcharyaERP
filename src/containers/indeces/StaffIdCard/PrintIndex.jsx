import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Button, Box, IconButton } from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import PhotoUpload from "./PhotoUpload";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import PrintIcon from "@mui/icons-material/Print";

const data = [
  {
    id: "1",
    Auid: "001",
    name: "Test1",
    program: "Program1",
    email: "Email1@gmail.com",
    phone: "989899**",
    isSelected: false,
    createdUsername: "",
    createdDate: "",
  },
  {
    id: "2",
    Auid: "002",
    name: "Test2",
    program: "Program2",
    email: "Email2@gmail.com",
    phone: "989899**",
    isSelected: false,
    createdUsername: "",
    createdDate: "",
  },
  {
    id: "3",
    Auid: "003",
    name: "Test3",
    program: "Program3",
    email: "Email3@gmail.com",
    phone: "989899**",
    isSelected: false,
    createdUsername: "",
    createdDate: "",
  },
  {
    id: "4",
    Auid: "004",
    name: "Test4",
    program: "Program4",
    email: "Email4@gmail.com",
    phone: "989899**",
    isSelected: false,
    createdUsername: "",
    createdDate: "",
  },
  {
    id: "5",
    Auid: "005",
    name: "Test5",
    program: "Program5",
    email: "Email5@gmail.com",
    phone: "989899**",
    isSelected: false,
    createdUsername: "",
    createdDate: "",
  },
];

const initialState = {
  staffLists: [],
  isAddPhotoModalOpen: false,
  checked: false,
};

function PrintIndex() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      staffLists: data,
    }));
  }, []);

  const columns = [
    { field: "Auid", headerName: "AUID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },

    { field: "program", headerName: "Programme", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
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
              Upload
            </Button>
        );
      },
    },
    {
      field: "isSelected",
      headerName: "Select",
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
