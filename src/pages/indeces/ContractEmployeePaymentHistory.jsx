import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import {useParams } from "react-router-dom";
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
import ExportButtonContract from "../../components/ExportButtonContract";
import SearchIcon from "@mui/icons-material/Search";


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

const ContractEmployeePaymentHistory = () => {
  const [rows, setRows] = useState([]);
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    searchItem: "",
  });
  const [employeeList, setEmployeeList] = useState([]);


  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/api/consoliation/getConsoliationListByEmpId?empId=${id}`)
      .then((res) => {
        setRows(res?.data?.data);
        setEmployeeList(res?.data?.data)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCrumbs([{ name: "Contract Employee Payment History" }]);
  }, []);

  const handleChangeSearch = (e) => {
    const filteredRows = employeeList.filter((obj) => {
      const chk = [];
      Object.values(obj).forEach((item) => {
        if (item !== null) {
          chk.push(
            item.toString().toLowerCase().includes(e.target.value.toLowerCase())
          );
        } else {
          chk.push("");
        }
      });

      if (chk.includes(true) === true) {
        return obj;
      }
    });

    setRows(filteredRows);
  };

  const tableData = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={50}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              Contract Employee Payment Histor
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell>Code</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Inst</StyledTableCell>
            <StyledTableCell>Period</StyledTableCell>
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell>Pay D</StyledTableCell>
            <StyledTableCell>Monthly Fee</StyledTableCell>
            <StyledTableCell>TDS</StyledTableCell>
            <StyledTableCell>Net Amount</StyledTableCell>
            <StyledTableCell>Total Amount</StyledTableCell>
            <StyledTableCell>Pan No</StyledTableCell>
            <StyledTableCell>Bank</StyledTableCell>
            <StyledTableCell>Account No</StyledTableCell>
            <StyledTableCell>Ifsc</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((obj, i) => {
              return (
                <TableRow key={i}>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {i + 1}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.empCode}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {obj.employeeName?.toLowerCase()}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.institute}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.fromDate} to {obj.toDate}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.month} - {obj.year}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "success.main" }}
                    >
                      {obj.payday}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.payingAmount}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.tds}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.totalAmount}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {(Number(obj.totalAmount) || 0) +
                        (Number(obj.tds) || 0) +
                        (Number(obj.payingAmount) || 0)}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.pan}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.bank}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.accountNo}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.ifsc}
                    </Typography>
                  </StyledTableCellBody>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>
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
      <Grid
        container
        alignItems="baseline"
        columnSpacing={4}
        justifyContent="flex-end"
        marginBottom={5}
      >
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Grid
              item
              md={1}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {rows.length > 0 && (
                <ExportButtonContract
                  rows={rows}
                  name={`Contract Employee Payment History`}
                />
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                name="searchItem"
                values={values.searchItem}
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
      </Grid>
      <Grid item xs={12}>
        {tableData()}
      </Grid>
    </>
  );
};

export default ContractEmployeePaymentHistory;
