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
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableCell1 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function SalaryStructureView({ id }) {
  const [data, setData] = useState([]);
  const [slabData, setSlabData] = useState([]);
  const [slabOpen, setSlabOpen] = useState();

  useEffect(() => {
    getData();
    getSlabDetails();
  }, []);

  const getData = async () => {
    axios(`/api/finance/getFormulaDetails/${id}`)
      .then((res) => {
        const temp = {};
        res.data.data.forEach((obj) => {
          temp[obj.slab_details_id] = false;
        });
        setSlabOpen(temp);
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getSlabDetails = async () => {
    await axios
      .get(`/api/getAllValues`)
      .then((res) => {
        setSlabData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSlabDetails = async (id) => {
    setSlabOpen((prev) => ({
      ...prev,
      [id]: slabOpen[id] === true ? false : true,
    }));
    // await axios
    //   .get(`/api/getAllValues`)
    //   .then((res) => {
    //     console.log(res.data.data);
    //     setSlabData(res.data.data.filter((obj) => obj.slab_details_id === id));
    //   })
    //   .catch((err) => console.error(err));
  };
  return (
    <>
      <Box>
        <Grid container rowSpacing={3}>
          <Grid item xs={12} mt={2}>
            {data.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Particulars</StyledTableCell>
                      <StyledTableCell>Category</StyledTableCell>
                      <StyledTableCell>Calculation</StyledTableCell>
                      <StyledTableCell>From Date</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell>Priority</StyledTableCell>
                      <StyledTableCell>Gross Limit</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data
                      .sort((a, b) => {
                        return a.priority - b.priority;
                      })
                      .map((obj, i) => (
                        <>
                          <TableRow key={i}>
                            <TableCell>{obj.voucher_head_short_name}</TableCell>
                            <TableCell>{obj.salary_category}</TableCell>
                            <TableCell>
                              {obj.salary_category === "slab" ? (
                                <IconButton
                                  onClick={() =>
                                    handleSlabDetails(obj.slab_details_id)
                                  }
                                >
                                  {slabOpen[obj.slab_details_id] ? (
                                    <VisibilityOffIcon color="primary" />
                                  ) : (
                                    <VisibilityIcon color="primary" />
                                  )}
                                </IconButton>
                              ) : (
                                obj.testing_expression
                              )}
                            </TableCell>
                            <TableCell>
                              {obj.from_date ? obj.from_date.slice(0, 7) : ""}
                            </TableCell>
                            <TableCell>{obj.category_name_type} </TableCell>
                            <TableCell>{obj.priority}</TableCell>
                            <TableCell>{obj.gross_limit}</TableCell>
                          </TableRow>
                          {obj.salary_category === "slab" ? (
                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={7}
                              >
                                <Collapse
                                  in={slabOpen[obj.slab_details_id]}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box sx={{ margin: 1 }}>
                                    <TableContainer component={Paper}>
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <StyledTableCell1>
                                              Minimium
                                            </StyledTableCell1>
                                            <StyledTableCell1>
                                              Maximum
                                            </StyledTableCell1>
                                            <StyledTableCell1>
                                              Amount
                                            </StyledTableCell1>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {slabData
                                            .filter(
                                              (fil) =>
                                                fil.slab_details_id ===
                                                obj.slab_details_id
                                            )
                                            .map((val, i) => (
                                              <TableRow key={i}>
                                                <TableCell>
                                                  {val.min_value}
                                                </TableCell>
                                                <TableCell>
                                                  {val.max_value}
                                                </TableCell>
                                                <TableCell>
                                                  {val.head_value}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="subtitle2" color="error" textAlign="center">
                Salary Heads are not assigned !!
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default SalaryStructureView;
