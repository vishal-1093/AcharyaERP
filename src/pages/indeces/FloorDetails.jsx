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

const FloorDetails = ({ blockId }) => {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    searchItem: "",
  });
  const [floorList, setFloorList] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/hostel/getHostelFloorDetails/${blockId?.row?.id}`);
      const data = Object.values(res?.data?.data).flat(); // Flatten the nested arrays
      setRows(data);
      setFloorList(data);
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
    setCrumbs([{ name: "Floor Details" }]);
  }, []);

  const handleChangeSearch = (e) => {
    const filteredRows = floorList.filter((obj) => {
      return Object.values(obj).some(item =>
        item?.toString().toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setRows(filteredRows);
  };

  const particulars = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];

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
            Floor Details
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell>Particulars</StyledTableCell>
            <StyledTableCell>Floor Name</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((obj, i) => (
              <TableRow key={i} >
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
                  <Typography variant="subtitle2" color="textSecondary" textAlign="center" >
                    {obj.floor_name}
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
                onChange={(e) => {
                  setValues({ ...values, searchItem: e.target.value });
                  handleChangeSearch(e);
                }}
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

export default FloorDetails;
