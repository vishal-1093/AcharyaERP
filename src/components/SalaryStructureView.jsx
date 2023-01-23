import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Box,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function SalaryStructureView({ id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    axios(`/api/finance/getFormulaDetails/${id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={1}>
          <Grid item xs={12} mt={2}>
            {data.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {/* <StyledTableCell>Structure</StyledTableCell> */}
                      <StyledTableCell>Particulars</StyledTableCell>
                      <StyledTableCell>Category</StyledTableCell>
                      <StyledTableCell>Calculation</StyledTableCell>
                      <StyledTableCell>From Date</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell>Priority</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((obj, i) => (
                      <TableRow key={i}>
                        {/* <TableCell>{obj.salary_structure}</TableCell> */}
                        <TableCell>{obj.voucher_head_short_name}</TableCell>
                        <TableCell>{obj.salary_category}</TableCell>
                        <TableCell>
                          {obj.salary_category === "slab" ? (
                            <VisibilityIcon
                            // onClick={() => handleSlabDetailsId(val)}
                            />
                          ) : (
                            obj.testing_expression
                          )}
                        </TableCell>
                        <TableCell>
                          {obj.from_date ? obj.from_date.slice(0, 7) : ""}
                        </TableCell>
                        <TableCell>{obj.category_name_type} </TableCell>
                        <TableCell>{obj.priority}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default SalaryStructureView;
