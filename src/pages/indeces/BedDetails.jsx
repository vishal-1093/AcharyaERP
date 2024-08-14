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
  TextField,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import SearchIcon from "@mui/icons-material/Search";
import BedIcon from "@mui/icons-material/Hotel"; 

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

const BedDetails = ({ hostelRoomId }) => {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    searchItem: "",
  });
  const [employeeList, setEmployeeList] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/hostel/getAllHostelBedDetails/${hostelRoomId?.row?.id}`);
      setRows(res?.data?.data);
      setEmployeeList(res?.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCrumbs([{ name: "Bed Details" }]); 
  }, []);

  const handleChangeSearch = (e) => {
    const filteredRows = employeeList.filter((obj) => {
      return Object.values(obj).some(item => 
        item?.toString().toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setRows(filteredRows);
  };

  const tableData = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={5}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              <BedIcon sx={{ verticalAlign: "middle", marginRight: 1 }} /> Bed Details
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell>Room Name</StyledTableCell>
            <StyledTableCell>Bed Name</StyledTableCell>
            <StyledTableCell>Standard Accessories</StyledTableCell>
            <StyledTableCell>Active</StyledTableCell>
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
                    {obj.room_name}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody >
                  <Typography variant="subtitle2" color="textSecondary" textAlign="center">
                    {obj.bed_name}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary">
                    {obj.standard_accessories}
                  </Typography>
                </StyledTableCellBody>
                <StyledTableCellBody>
                  <Typography variant="subtitle2" color="textSecondary" textAlign="center">
                    {obj.active ? 'Yes' : 'No'}
                  </Typography>
                </StyledTableCellBody>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }} colSpan={5}>
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
      {/* <Grid
        container
        alignItems="baseline"
        columnSpacing={4}
        justifyContent="flex-end"
        marginBottom={5}
      >
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={12} md={3}>
              <TextField
                name="searchItem"
                value={values.searchItem}
                onChange={handleChangeSearch}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}
      <Grid item xs={12}>
        {tableData()}
      </Grid>
    </>
  );
};

export default BedDetails;
