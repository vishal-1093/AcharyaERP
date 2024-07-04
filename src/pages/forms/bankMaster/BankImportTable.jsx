import {
  Box,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  styled,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { useNavigate } from "react-router";
import { lazy } from "react";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function BankImportTable({ values, tableData }) {
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    const temp = [];

    tableData.map((obj, i) => {
      temp.push({
        active: true,
        amount: obj.amount,
        cheque_dd_no: obj.cheque_dd_no,
        deposited_bank_id: values.bankId,
        start_row: values.startRow,
        end_row: values.endRow,
        school_id: values.schoolId,
        transaction_date: obj.transaction_date,
        transaction_no: obj.transaction_no,
        voucher_head_new_id: values.voucherHeadNewId,
      });
    });

    await axios
      .post(`/api/student/saveBankImportTransaction`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Imported Successfully",
          });
          setAlertOpen(true);
          navigate(`/BankMaster/Import`, { replace: true });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response.data.message,
        });
        setAlertOpen(true);
      });
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              color="error"
              onClick={handleReload}
              style={{ marginRight: "10px", borderRadius: 10 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              style={{ borderRadius: 10 }}
              onClick={handleCreate}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} md={8} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 100 }}>
                      Import Date
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>
                      Transaction Date
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>
                      Transaction No
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>
                      Cheque/DD No
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100 }}>
                      Amount
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCell>
                          {convertDateToString(values.fileImportedDate)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {obj.transaction_date}
                        </StyledTableCell>
                        <StyledTableCell>{obj.transaction_no}</StyledTableCell>
                        <StyledTableCell>{obj.cheque_dd_no}</StyledTableCell>
                        <StyledTableCell>{obj.amount}</StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default BankImportTable;
