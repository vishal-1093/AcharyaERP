import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
  thTable: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#edeff7",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },
  yearTd: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "right",
  },
}));

function StudentRazorPayTransaction() {
  const [transactionData, setTransactionData] = useState([]);
  const [search, setSearch] = useState("");

  const classes = useStyles();
  const location = useLocation();
  const studentData = location?.state?.studentData;

  useEffect(() => {
    getStudentTransactionData();
  }, []);

  const getStudentTransactionData = async () => {
    try {
      const response = await axios.get(
        `/api/student/getTransactionDetails?studentId=3164`
      );
      setTransactionData(response.data.data);
      console.log(response);
    } catch {}
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8}>
          <Grid
            container
            justifyContent="flex-start"
            rowSpacing={2}
            alignItems="center"
          >
            <Grid item xs={12} md={12}>
              <Typography
                sx={{
                  backgroundColor: "tableBg.main",
                  color: "tableBg.textColor",
                  textAlign: "center",
                  padding: 1,
                }}
                variant="h6"
              >
                FEE RECEIPT
              </Typography>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th className={classes.th}> NAME : MEGHNA R</th>
                    <th className={classes.th}> AUID : AUID00024</th>
                    <th className={classes.th}>
                      EMAIL : meghana@acharya.ac.in
                    </th>
                  </tr>
                </thead>
              </table>
            </Grid>

            <Grid item xs={12} md={2.5} align="right">
              <CustomTextField
                label="Search"
                value={search}
                handleChange={handleSearch}
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th className={classes.thTable}> SL No.</th>
                    <th className={classes.thTable}>Order Id</th>
                    <th className={classes.thTable}>Payment Id</th>
                    <th className={classes.thTable}>Remarks</th>
                    <th className={classes.thTable}>Transaction Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData?.map((obj, i) => {
                    return (
                      <>
                        <tr key={i}>
                          <td className={classes.td}>{i + 1}</td>
                          <td className={classes.td}>{obj.orderId}</td>
                          <td className={classes.td}>{obj.paymentId}</td>
                          <td className={classes.td}>{obj.remarks}</td>
                          <td className={classes.td}>{obj.transactionDate}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentRazorPayTransaction;
