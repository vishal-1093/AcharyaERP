import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Grid,
  Box,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Typography,
} from "@mui/material";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

import { makeStyles } from "@mui/styles";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
}));

function ClosingstockReport() {
  const [data, setData] = useState([]);

  const { id } = useParams();
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const rowData = location.state?.rowData;

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Closing Stock Report", link: "/Consumables" }]);
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/purchase/getDayWiseSummary?item_assignment_id=${id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box mt={2} p={3}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary">
              Item Name :{" "}
              {rowData.itemName +
                "-" +
                rowData?.itemDescription +
                "-" +
                data[0]?.uom}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} align="right">
            <Typography variant="h6" color="primary">
              Opening Balance : {data[0]?.openingBalance} ({data[0]?.uom})
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small">
                <TableHead className={classes.bg}>
                  <TableRow>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Sl. No.
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      GRN
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Issue
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Closing Stock ({data[0]?.uom})
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.table}>
                  {data
                    .sort((a, b) => moment(a.date) - moment(b.date))
                    .map((dataItem, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {moment(dataItem.date).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>{dataItem.grn}</TableCell>

                        <TableCell>{dataItem.stockIssue}</TableCell>
                        <TableCell>{dataItem.closingStock}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default ClosingstockReport;
