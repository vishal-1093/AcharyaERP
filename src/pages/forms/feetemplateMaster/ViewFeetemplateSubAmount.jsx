import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import FeeTemplateView from "../../../components/FeeTemplateView";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

function ViewFeetemplateSubAmount() {
  const [remarks, setRemarks] = useState([]);
  const [addonData, setAddonData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [uniqueFess, setUniqueFees] = useState([]);
  const [uniformNumber, setUniformNumber] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    getData();
    if (
      pathname.toLowerCase().includes("/viewfeetemplatesubamount/" + id + "/1")
    ) {
      setCrumbs([
        {
          name: "Feetemplate Master ",
          link: "FeetemplateMaster",
        },
        { name: "View Template" },
      ]);
    } else {
      setCrumbs([
        {
          name: "Feetemplate Approval Index",
          link: "FeetemplateApprovalIndex",
        },
        { name: "View Template" },
      ]);
    }
  }, []);

  const getData = async () => {
    try {
      const templateResponse = await axios.get(
        `/api/finance/FetchAllFeeTemplateDetail/${id}`
      );
      const templateData = templateResponse.data.data[0];
      setRemarks(templateResponse.data.data[0].remarks);

      axios
        .get(
          `/api/academic/FetchAcademicProgram/${templateData.ac_year_id}/${templateData.program_id}/${templateData.school_id}`
        )
        .then((res) => {
          const yearSem = [];

          if (templateData.program_type_name.toLowerCase() === "yearly") {
            for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
              yearSem.push({ key: i, value: "Sem " + i });
            }
          } else if (
            templateData.program_type_name.toLowerCase() === "semester"
          ) {
            for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
              yearSem.push({ key: i, value: "Sem " + i });
            }
          }

          setNoOfYears(yearSem);
        })
        .catch((err) => console.error(err));

      const addOnResponse = await axios.get(
        `/api/otherFeeDetails/getOtherFeeDetailsData?schoolId=${templateResponse.data.data[0].school_id}&acYearId=${templateResponse.data.data[0].ac_year_id}&programId=${templateResponse.data.data[0].program_id}&programSpecializationId=${templateResponse.data.data[0].program_specialization_id}`
      );

      setAddonData(addOnResponse);

      const uniqueItems = Array.from(
        new Map(
          addOnResponse.data.map((item) => [item.uniform_number, item])
        ).values()
      );

      const newObject = {};

      uniqueItems.map((item) => {
        newObject[item.uniform_number] = addOnResponse.data.filter(
          (obj) => obj.uniform_number === item.uniform_number
        );
      });

      setUniqueFees(newObject);
      setUniformNumber(uniqueItems);
    } catch (error) {
      console.error(error);
    }
  };

  const rowTotal = (uniformNumber) => {
    let total = 0;
    noOfYears.forEach((obj) => {
      total += uniqueFess[uniformNumber]
        .map((obj1) => obj1["sem" + obj.key])
        .reduce((a, b) => a + b);
    });
    return total;
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <Grid
        container
        rowSpacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <FeeTemplateView type={2} feeTemplateId={id} />
        </Grid>

        <Grid item xs={12} md={10} align="center">
          {uniformNumber.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead className={classes.bg}>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>AUID Format</TableCell>
                    <TableCell sx={{ color: "white" }}>Fee Type</TableCell>
                    {noOfYears.map((val, i) => {
                      return (
                        <TableCell
                          key={i}
                          align="right"
                          sx={{ color: "white" }}
                        >
                          {val.value}
                        </TableCell>
                      );
                    })}
                    <TableCell align="right" sx={{ color: "white" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniformNumber?.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{obj.uniform_number}</TableCell>
                        <TableCell>{obj.feetype}</TableCell>

                        {noOfYears.map((obj1, j) => {
                          return (
                            <TableCell align="right" key={j}>
                              {uniqueFess[obj.uniform_number].reduce(
                                (sum, value) => {
                                  return (
                                    Number(sum) +
                                    Number(value["sem" + obj1.key])
                                  );
                                },
                                0
                              )}
                            </TableCell>
                          );
                        })}

                        <TableCell align="right">
                          {rowTotal(obj.uniform_number)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} md={12} mt={2}>
          <Typography variant="subtitle2">Note : {remarks}</Typography>
        </Grid>
        <Grid item xs={12} md={12} mt={2}>
          <Button
            onClick={() => navigate(`/FeetemplatePdf/${id}`)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Print
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewFeetemplateSubAmount;
