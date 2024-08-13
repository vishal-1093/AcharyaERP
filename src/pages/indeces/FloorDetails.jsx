import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import useAlert from "../../hooks/useAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    textAlign: "center",
    padding: 2,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
    padding: 3,
    border: "1px solid rgba(224, 224, 224, 1)",
    "&:nth-of-type(3)": {
      textAlign: "left",
    },
    "&:nth-of-type(4)": {
      width: "7%",
    },
    "&:nth-of-type(5)": {
      textAlign: "left",
    },
    "&:nth-of-type(6)": {
      textAlign: "left",
    },
  },
}));

const FloorDetails = ({ blockId }) => {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    searchItem: "",
  });
  const [floorList, setFloorList] = useState([]);
  const [wardensName, setWardensName] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [floorDetails, setFloorDetails] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/hostel/getHostelFloorDetails/${blockId?.row?.id}`
      );
      const data = Object.values(res?.data?.data).flat();
      setRows(data);
      setFloorList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    await axios
      .get(`/api/staffUserDetails`)
      .then((res) => {
        const userData = res.data.data.map((obj) => ({
          value: obj.id,
          label: obj.username,
        }));
        setWardensName(userData);
      })
      .catch((err) => console.error(err));
  };

  const getFloorDetails = async () => {
    await axios
      .get(`/api/hostel/HostelFloor/${selectedRow?.hostel_floor_id}`)
      .then((res) => {
        setFloorDetails(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
    getUserDetails();
  }, []);

  useEffect(() => {
    if (selectedRow?.hostel_floor_id) {
      getFloorDetails();
    }
  }, [selectedRow?.hostel_floor_id]);

  useEffect(() => {
    setCrumbs([{ name: "Floor Details" }]);
  }, []);

  const handleOpenPopup = (row) => {
    setSelectedRow(row);
    setSelectedWarden(row?.wardens_id);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedWarden(null);
  };

  const handleWardenChange = (event, newValue) => {
    setSelectedWarden(newValue);
  };

  const handleUpdateWarden = async () => {
    const temp = {};
    temp.hostelFloorId = floorDetails?.hostelFloorId;
    temp.floorName = floorDetails?.floorName;
    temp.hostelsBlockId = floorDetails?.hostelsBlockId;
    temp.wardensId = selectedWarden;
    temp.totalNoOfRooms = floorDetails?.totalNoOfRooms;
    temp.noOfRoomsFree = floorDetails?.noOfRoomsFree;
    temp.active = floorDetails?.active;
    await axios
      .put(`/api/hostel/HostelFloor/${floorDetails?.hostelFloorId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "warden updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        getData();
      })
      .catch((err) => console.error(err));
    handleClosePopup();
  };

  const particulars = [
    "Ground Floor",
    "1st Floor",
    "2nd Floor",
    "3rd Floor",
    "4th Floor",
  ];

  const tableData = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={6}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              Floor Details
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell>Particulars</StyledTableCell>
            <StyledTableCell>Floor Name</StyledTableCell>
            <StyledTableCell>Warden Name</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((obj, i) => (
              <TableRow key={i}>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {i + 1}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {particulars[i] || `${i}th Floor`}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    textAlign="center"
                  >
                    {obj.floor_name}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    textAlign="center"
                  >
                    {wardensName.find(
                      (warden) => warden.value === obj.wardens_id
                    )?.label || "No Warden Assigned"}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenPopup(obj)}
                    >
                      Update
                    </Button>
                  </Box>
                </StyledTableCellBody>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }} colSpan={6}>
                <Typography variant="subtitle2">No Records</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Grid item xs={12}>
        {tableData()}
      </Grid>
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Warden</DialogTitle>
        <DialogContent>
          <CustomAutocomplete
            name="wardensId"
            // label="Warden Name"
            value={selectedWarden}
            options={wardensName}
            handleChangeAdvance={handleWardenChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateWarden} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FloorDetails;
