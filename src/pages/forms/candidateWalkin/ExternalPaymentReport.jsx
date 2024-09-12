import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
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
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
      padding: 5,
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

const StyledTableCells = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    textAlign: "center",
  },
}));

function ExternalPaymentReport() {
  const [values, setValues] = useState({ searchItem: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [rows, setRows] = useState([]);

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const getData = async () => {
    await axios
      .get(`/api/student/feeHeadAmountRestrictionPaidDetails/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "External Payment Report" },
          {
            name: res.data.data?.feeHeadAmountRestrictionDetail[0]?.voucherHead,
          },
        ]);
        const temp = [];

        res.data.data.clickPaymentDetails.forEach((obj) => {
          temp.push({
            name: obj.restriction_amount_payer,
            email: obj.payer_email,
            mobile: obj.mobile,
            auid: obj.auid_or_other_info,
            orderId: obj.merchant_trans_id,
            date: moment(obj.sign_time).format("DD-MM-YYYY hh:mm:ss"),
            amount: obj.amount,
            gateway: "Click Me",
          });
        });

        res.data.data.paymeTransactionDetails.forEach((obj) => {
          let tempDate = new Date(obj.normal_performed_time);
          tempDate.setMinutes(tempDate.getMinutes() + 330);
          tempDate = new Date(tempDate);

          temp.push({
            name: obj.restriction_amount_payer,
            email: obj.payer_email,
            mobile: obj.mobile,
            auid: obj.auid_or_other_info,
            orderId: obj.order_id,
            date: moment(tempDate).format("DD-MM-YYYY hh:mm:ss"),
            amount: obj.amount / 100,
            gateway: "Pay Me",
          });
        });

        setTotal(temp.map((obj) => obj.amount).reduce((a, b) => a + b));
        setData(temp);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const filteredRows = data.filter((obj) => {
      const chk = Object.values(obj).map((item) =>
        item !== null
          ? item.toString().toLowerCase().includes(e.target.value.toLowerCase())
          : ""
      );

      if (chk.includes(true) === true) {
        return obj;
      }
    });

    setRows(filteredRows);
  };

  return (
    <Box m={4}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Grid item xs={12} md={4}>
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
            <Table size="small" className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sl No</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Mobile No.</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Other Info</StyledTableCell>
                  <StyledTableCell>Transaction/Order ID</StyledTableCell>
                  <StyledTableCell>Transaction Date</StyledTableCell>
                  <StyledTableCell>Payment Gateway</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.length > 0 ? (
                  <>
                    {rows?.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <StyledTableCells>{i + 1}</StyledTableCells>
                          <StyledTableCells
                            sx={{ textAlign: "left !important" }}
                          >
                            {obj.name}
                          </StyledTableCells>
                          <StyledTableCells>{obj.mobile}</StyledTableCells>
                          <StyledTableCells
                            sx={{ textAlign: "left !important" }}
                          >
                            {obj.email}
                          </StyledTableCells>
                          <StyledTableCells>{obj.auid}</StyledTableCells>
                          <StyledTableCells>{obj.orderId}</StyledTableCells>
                          <StyledTableCells>{obj.date}</StyledTableCells>
                          <StyledTableCells>{obj.gateway}</StyledTableCells>
                          <StyledTableCells
                            sx={{ textAlign: "right !important" }}
                          >
                            {obj.amount}
                          </StyledTableCells>
                        </TableRow>
                      );
                    })}

                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2">Total</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="subtitle2">{total}</Typography>
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2">No Records</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExternalPaymentReport;
