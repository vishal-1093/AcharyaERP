import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const styles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
  tableBody: {
    height: 10,
  },
  bg: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

function FeetemplateSubAmountHistory() {
  const [historyDetails, setHistoryDetails] = useState([]);
  const [subamountHistory, setSubamountHistory] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const classes = styles();
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    fetchAllfeeTemplateSubamountHistoryDetails();
    fetchAllfeeTemplateHistoryDetails();
    getFeetemplateDetail();
    setCrumbs([
      {
        name: "Fee template Approval Index",
        link: "/FeetemplateApprovalIndex",
      },
    ]);
  }, []);

  const fetchAllfeeTemplateHistoryDetails = async () => {
    await axios
      .get(`/api/finance/FetchFeeTemplateHistoryDetail/${id}`)
      .then((res) => {
        setHistoryDetails(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchAllfeeTemplateSubamountHistoryDetails = async () => {
    await axios
      .get(`/api/finance/fetchAllFeeTemplateSubAmountHistory/${id}`)
      .then((res) => {
        setSubamountHistory(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getFeetemplateDetail = async () => {
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${id}`)
      .then((res) => {
        const test = res.data.data[0];

        axios
          .get(
            `/api/academic/FetchAcademicProgram/${res.data.data[0].ac_year_id}/${res.data.data[0].program_id}/${res.data.data[0].school_id}`
          )
          .then((res) => {
            const years = [];

            if (test.program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= res.data.data[0].number_of_years; i++) {
                years.push({ key: i, value: "Year" + i });
              }
            } else if (test.program_type_name.toLowerCase() === "semester") {
              for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
                years.push({ key: i, value: "Sem" + i });
              }
            }
            setNoOfYears(years);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <Grid container alignItems="center">
        <Grid item xs={12} md={12} align="center" className={classes.bg}>
          <Typography variant="subtitle2">
            Fee Template Sub Amount History
          </Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead style={{ color: "#D3D3D3" }}>
                <TableRow>
                  <TableCell> Heads</TableCell>
                  {subamountHistory.board_unique_name ? (
                    <TableCell>Board </TableCell>
                  ) : (
                    <></>
                  )}

                  <TableCell>Alias</TableCell>
                  {noOfYears.map((obj, i) => {
                    return <TableCell key={i}>{obj.value}</TableCell>;
                  })}
                  <TableCell>Approved Date</TableCell>
                  <TableCell>Approved Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subamountHistory.map((obj, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{obj.voucher_head}</TableCell>
                      {subamountHistory.board_unique_name ? (
                        <TableCell>{obj.board_unique_name}</TableCell>
                      ) : (
                        <></>
                      )}

                      <TableCell>{obj.alias_name}</TableCell>
                      {noOfYears.map((val, i) => {
                        return (
                          <TableCell key={i}>
                            {obj["year" + val.key + "_amt"]}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        {obj.approved_date
                          ? moment(obj.approved_date).format("DD-MM-YYYY")
                          : ""}
                      </TableCell>
                      <TableCell>
                        {obj.approved_status ? "true" : "false"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={12} mt={2} align="center" className={classes.bg}>
          <Typography variant="subtitle2">Fee Template History</Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table width="125%" size="small">
              <TableHead style={{ color: "#D3D3D3" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>AC Year</TableCell>
                  <TableCell>School</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Sub-Category</TableCell>
                  <TableCell>Fee Term</TableCell>
                  <TableCell>Currency </TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Modified By</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>Modified Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyDetails.map((obj, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{obj.fee_template_name}</TableCell>
                      <TableCell>{obj.ac_year}</TableCell>
                      <TableCell>{obj.school_name_short}</TableCell>
                      <TableCell>{obj.program_short_name}</TableCell>
                      <TableCell>{obj.program_specialization}</TableCell>
                      <TableCell>
                        {obj.fee_admission_category_short_name}
                      </TableCell>
                      <TableCell>
                        {obj.fee_admission_sub_category_name}
                      </TableCell>
                      <TableCell>{obj.program_type_name}</TableCell>
                      <TableCell>{obj.currency_type_name}</TableCell>
                      <TableCell>{obj.remarks}</TableCell>
                      <TableCell>{obj.modified_username}</TableCell>
                      <TableCell>{obj.fth_approved_name}</TableCell>
                      <TableCell>
                        {obj.modified_date
                          ? moment(obj.modified_date).format("DD-MM-YYYY")
                          : ""}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
export default FeetemplateSubAmountHistory;
