import React from "react";
import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { makeStyles } from "@mui/styles";

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

const CreatedGRN = () => {
  useEffect(() => {
    setCrumbs([
      {
        name: "GRN",
        link: "/itemmaster/GRN",
      },
    ]);
  }, []);

  const location = useLocation();
  const stockNo = location.state?.StockNo;
  const setCrumbs = useBreadcrumbs();
  const [data, setdata] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    handleView();
  }, []);

  const handleView = async (row) => {
    await axios
      .get(`/api/purchase/getListofDirectGRNById?grnNo=${stockNo}`)
      .then((res) => {
        setdata(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <Box mt={2} p={3}>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead className={classes.bg}>
              <TableRow>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Sl. No.
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Item Name
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  UOM
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Vendor Name
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  remarks
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Store Name
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Created By
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Issued Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.table}>
              {data.map((dataItem, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{dataItem.itemName}</TableCell>
                  <TableCell>{dataItem.quantity}</TableCell>
                  <TableCell>{dataItem.uom}</TableCell>
                  <TableCell>{dataItem.vendorName}</TableCell>
                  <TableCell>{dataItem.remarks}</TableCell>
                  <TableCell>{dataItem.storeName}</TableCell>
                  <TableCell>{dataItem.createdByUserName}</TableCell>
                  <TableCell>
                    {dataItem.createdDate
                      ? moment(dataItem.createdDate).format("DD-MM-YYYY")
                      : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default CreatedGRN;
