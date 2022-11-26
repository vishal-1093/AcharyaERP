import { useState, useEffect } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";

const styles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: 880,
    marginLeft: "120px",
  },
}));

function SlabDefinitionDetails() {
  const [data, setData] = useState([]);

  const classes = styles();

  useEffect(() => {
    getSlabData();
  }, []);

  const getSlabData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllSlabDetails?page=${0}&page_size=${10}&sort=created_date`
      )
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table>
        <TableHead
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.headerWhite.main,
          }}
        >
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Short Name</TableCell>
            <TableCell>Heads</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((val, i) => (
            <TableRow key={i}>
              <TableCell>{val.slab_details_name}</TableCell>
              <TableCell> {val.slab_details_short_name}</TableCell>
              <TableCell>
                {val.voucher_heads
                  ? val.voucher_heads.split(",").join("+")
                  : ""}
              </TableCell>
              <TableCell>{val.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SlabDefinitionDetails;
