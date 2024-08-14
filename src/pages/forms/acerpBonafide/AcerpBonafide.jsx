import { useState, lazy, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));

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
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
}));

const initialState = {
  auid: "",
  auidValue: "",
  paidType: "",
  paidTypeValue: "",
  loading: false,
  studentDetail: [],
  acerpAmountList: null,
  keysToSum: [],
  remarks: "",
  amountLoading: false,
  waiverAttachment: "",
};

const AcerpBonafide = () => {
  const [{ auid, auidValue, paidType, loading }, setState] =
    useState(initialState);
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "ACERP Bonafide" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const getStudentDetailByAuid = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/student/studentDetailsByAuid/${
          auid ? auid : location.state?.auid
        }`
      );
      if (res.status === 200 || res.status === 201) {
        // console.log("res=====", res);
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, md: 4 }}
          alignItems="center"
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name=""
              label="Bonafide Type"
              value={""}
              options={[]}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3} mr={4}>
            <CustomTextField
              name="auid"
              label="Auid"
              value={auid}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !auid || !paidType}
              onClick={getStudentDetailByAuid}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>

      {!!auidValue && (
        <div style={{ marginTop: "20px" }}>
          <StudentDetails id={auidValue} />
        </div>
      )}

      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Acerp Bonafide"
              titleTypographyProps={{
                variant: "subtitle2",
              }}
              sx={{
                backgroundColor: "rgba(74, 87, 169, 0.1)",
                color: "#46464E",
                textAlign: "center",
                padding: 1,
              }}
            />
            <CardContent>
              <Grid container rowSpacing={1}>
                <Grid xs={12} md={12}>
                  <Grid container mt={3}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2" fontSize="13px">
                        Ref: OL/2024/_______
                      </Typography>
                      <Typography variant="subtitle2" fontSize="13px">
                        Date:09-08-2024
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={3} align="center">
                  <Typography
                    variant="subtitle2"
                    align="center"
                    fontSize="14px"
                    display="inline-block"
                    borderBottom="2px solid"
                  >
                    TO WHOMSOEVER IT MAY CONCERN
                  </Typography>
                </Grid>

                <Grid item xs={12} md={12} mt={3}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Typography>
                        This is to certify that MS.CRESIDA V BIJU, D/o. BIJU VK,
                        AUID No. AIT24BECS009 is provisionally admitted
                        to ACHARYA INSTITUTE OF TECHNOLOGY in BE-COMPUTER
                        SCIENCE ENGG (course) on merit basis after undergoing
                        the selection procedure laid down by Acharya Institutes
                        for the Academic year 2024-2025, subject to fulfilling
                        the eligibility conditions prescribed by the affiliating
                        University. The fee payable during the Academic Batch
                        2024-2028 is given below.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={12} mt={4}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginLeft: "15px",
                    }}
                  >
                    <Grid item xs={12} md={8}>
                      <table className={classes.table}>
                        <thead>
                          <tr>
                            <th className={classes.th}>SL.No.</th>
                            <th className={classes.th}>Particular</th>
                            <th className={classes.th}>1 Year</th>
                            <th className={classes.th}>2 Year</th>
                            <th className={classes.th}>3 Year</th>
                            <th className={classes.th}>4 Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={classes.td}> 1</td>
                            <td className={classes.td}>
                              Campus Development Fee
                            </td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                          </tr>
                          <tr>
                            <td className={classes.td}>2</td>
                            <td className={classes.td}>Registration Fee</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                          </tr>
                          <tr>
                            <td className={classes.td}>3</td>
                            <td className={classes.td}>Tuition Fee</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                            <td className={classes.td}>10000</td>
                          </tr>
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={12} mt={4}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Typography>
                        The DD may be drawn in favour of &quot;ACHARYA INSTITUTE
                        OF TECHNOLOGY&quot; payable at Bangalore. ADD-ON
                        PROGRAMME FEE DD may be drawn in favour of &quot;NINI
                        SKILLUP PVT LTD&quot; payable at Bangalore. Uniform
                        &amp; Stationery fee to be paid separately through ERP
                        Portal. This Bonafide is issued only for the purpose of
                        Bank loan.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} mt={4}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Typography paragraph>
                        *Please note that the given fee is applicable only for
                        the prescribed Academic Batch. Admission shall be
                        ratified only after the submission of all original
                        documents for verification and payment of all the fee
                        for the semester/year as prescribed in the letter of
                        offer. Failure to do so shall result in the withdrawal
                        of the Offer of Admission.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} mt={4}>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontSize="14px">
                        PRINCIPAL
                      </Typography>
                      <Typography variant="subtitle2" fontSize="14px">
                        AUTHORIZED SIGNATORY
                      </Typography>
                      <Typography>PREPARED BY &lt; USERNAME&gt;</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AcerpBonafide;
