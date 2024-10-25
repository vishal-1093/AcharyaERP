import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
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
import SearchIcon from "@mui/icons-material/Search";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function CustomTable({ tableHeaders, tableBody }) {
  const [values, setValues] = useState({ searchItem: "" });
  const [rows, setRows] = useState([]);

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "File",
    sheet: "File",
  });

  useEffect(() => {
    setRows(tableBody);
  }, [tableBody]);

  const exportPdf = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      theme: "grid",
      columns: tableHeaders,
      body: rows.map((obj) => Object.values(obj)),
    });
    doc.save("file.pdf");
  };

  const handleChange = (e) => {
    const filteredRows = tableBody.filter((obj) => {
      const chk = Object.values(obj).map((item) =>
        item !== null
          ? item.toLowerCase().includes(e.target.value.toLowerCase())
          : ""
      );

      if (chk.includes(true) === true) {
        return obj;
      }
    });

    setRows(filteredRows);
  };

  return (
    <Box mt={4}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12} align="right">
          {/* <IconButton>
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={true}
            id="account-menu"
            // open={open}
            // onClose={handleClose}
            // onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>My account</MenuItem>

            <MenuItem>Add another account</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>  */}

          <Stack direction="row" spacing={1} justifyContent="right">
            <Button variant="contained" size="small" onClick={onDownload}>
              Export to Excel
            </Button>

            <Button variant="contained" size="small" onClick={exportPdf}>
              Export to PDF
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={12} md={6}>
              <TextField
                name="searchItem"
                values={values.searchItem}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={3}>
            <Table size="small" ref={tableRef}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((obj, i) => {
                    return <StyledTableCell key={i}>{obj}</StyledTableCell>;
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length > 0 ? (
                  rows.map((obj, i) => {
                    return (
                      <StyledTableRow key={i}>
                        {Object.values(obj).map((item, j) => {
                          return <TableCell key={j}>{item}</TableCell>;
                        })}
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <StyledTableRow>
                    <TableCell
                      colSpan={tableHeaders.length}
                      sx={{ textAlign: "center" }}
                    >
                      <Typography variant="subtitle2">
                        No Records Found
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CustomTable;
