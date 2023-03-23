import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Grid, Box, tableCellClasses, styled } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import { useParams, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FormWrapper from "../../../components/FormWrapper";
import Divider from "@mui/material/Divider";

const styles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
  },
  tableContainer: {
    borderRadius: 40,
    maxWidth: "100%",
    margin: "30px 0",
  },
  paperStyle: {
    position: "relative",
    padding: "22px",
    borderRadius: "30px !important",
    background: "white",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  },
  tableBody: {
    height: 10,
  },

  table: {
    "& .MuiTableCell-root": {
      minWidth: 100,
      border: "1px solid rgba(192,192,192,1)",
      fontSize: "15px",
      marginRight: "auto",
      marginLeft: "5px",
      marginTop: "50px",
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function ViewFeeTemplate() {
  const [feeTemplateData, SetFeeTemplateData] = useState([]);
  const [vocherHeadDetails, SetvocherHeadDetails] = useState([]);
  const [paymentSlotDetails, SetpaymentSlotDetails] = useState([]);

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const classes = styles();

  useEffect(() => {
    getTemplateData();
    getvocherHeadDetails();
    getPaymentSlotDetails();
  }, []);

  useEffect(() => {
    if (pathname.toLowerCase() === `/hostelfeemaster/hostelfee/view/${id}`) {
      setCrumbs([
        { name: "HostelFeeMaster", link: "/HostelFeeMaster/HostelFees" },
        { name: "Hostel Fee" },
        { name: "View" },
      ]);
    } else {
      getTemplateData();
    }
  }, [pathname]);

  const getTemplateData = async () => {
    await axios
      .get(`/api/finance/HostelFeeTemplateDetails/${id}`)
      .then((res) => {
        SetFeeTemplateData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };
  const getvocherHeadDetails = async () => {
    await axios
      .get(`/api/finance/hostelHeadWiseAmtOnFeeTemplateId/${id}`)
      .then((res) => {
        SetvocherHeadDetails(res.data.data);
      })
      .catch((err) => console.error(err));
  };
  const getPaymentSlotDetails = async () => {
    await axios
      .get(`/api/finance/HostelFeeTemplateSlotsOnFeeTemplateId/${id}`)
      .then((res) => {
        SetpaymentSlotDetails(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          className={classes.paperStyle}
          rowSpacing={1}
          columnSpacing={{ xs: 2, md: 2 }}
        >
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">Fee Template</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {feeTemplateData.template_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">School</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {feeTemplateData.school_name_short}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">Academic Year</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {feeTemplateData.ac_year}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">Occupancy Type</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {feeTemplateData.roomType}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">Block Name</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {feeTemplateData.hostel_block_short_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2">Currency Type</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="textSecondary">
              {feeTemplateData.currency_type_short_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Divider></Divider>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              rowSpacing={4}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Particulars </StyledTableCell>
                        <StyledTableCell>Amount </StyledTableCell>
                        <StyledTableCell>Advance </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vocherHeadDetails.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>{obj.voucher_head_short_name}</TableCell>
                            <TableCell>{obj.amount}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableCell>
                      <Typography variant="subtitle2">Total</Typography>
                    </TableCell>

                    <TableCell>{feeTemplateData.total_amount}</TableCell>
                    <TableCell>{feeTemplateData.advance_amount}</TableCell>
                  </Table>
                </TableContainer>
                <Grid item xs={12} md={12}>
                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                  >
                    <Table aria-label="simple table" size="small">
                      <TableHead style={{ background: "#D3D3D3" }}>
                        <TableRow>
                          <StyledTableCell>Payment Slots </StyledTableCell>
                          <StyledTableCell>Due Date </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paymentSlotDetails.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{obj.minimum_amount}</TableCell>
                              <TableCell>
                                {convertToDMY(obj.due_date)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}
export default ViewFeeTemplate;
