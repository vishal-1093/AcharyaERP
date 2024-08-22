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
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import ModalWrapper from "../../../components/ModalWrapper.jsx";
import FormWrapper from "../../../components/FormWrapper.jsx";
import { GenerateBonafide } from "./GenerateBonafide.jsx";
import moment from "moment";
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);

const useModalStyles = makeStyles((theme) => ({
  objectTag: {
    width: "100%",
    position: "relative",
    textAlign: "center",
  },
}));

const useStyles = makeStyles((theme) => ({
  textJustify: {
    textAlign: "justify",
    width: "100%",
    margin: "0 auto",
  },
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
  yearTd: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "right",
  },
}));

const initialState = {
  bonafideTypeId: "",
  auid: "",
  bonafideTypeList: [],
  loading: false,
  studentDetail: null,
  studentBonafideDetail: [],
  semesterHeaderList: [],
  isPrintBonafideModalOpen: false,
  bonafidePdfPath: null,
  columnsToHide: [],
};

const BonafideForm = () => {
  const [
    {
      bonafideTypeId,
      auid,
      bonafideTypeList,
      loading,
      studentDetail,
      studentBonafideDetail,
      semesterHeaderList,
      isPrintBonafideModalOpen,
      bonafidePdfPath,
      columnsToHide,
    },
    setState,
  ] = useState(initialState);
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const popupclass = useModalStyles();

  useEffect(() => {
    setCrumbs([
      { name: "ACERP Bonafide", link: "/AcerpBonafideIndex" },
      { name: !!location.state ? "View" : "Create" },
    ]);
    if (!!location.state) getStudentDetailByAuid(location.state.auid);
    if (!location.state) getBonafideTypeList();
  }, []);

  const getBonafideTypeList = async () => {
    try {
      const res = await axios.get("api/categoryTypeDetailsOnBonafide");
      const lists = res?.data?.data.map((obj) => ({
        label: obj.category_detail,
        value: obj.category_details_id,
      }));
      setState((prevState) => ({
        ...prevState,
        bonafideTypeList: lists,
      }));
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

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

  const getStudentDetailByAuid = async (studentAuid) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${studentAuid}`
      );
      if (res.status === 200 || res.status === 201) {
        bonafideTypeList.length > 0 && !location.state
          ? createStudentBonafide()
          : getBonafideDetails(
              location.state.auid,
              location.state.bonafide_type
            );
        setState((prevState) => ({
          ...prevState,
          studentDetail: res.data.data[0],
        }));
        setLoading(false);
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

  const createStudentBonafide = async () => {
    try {
      const bonafideType = bonafideTypeList.find(
        (ele) => ele.value === bonafideTypeId
      ).label;
      const payload = {
        active: true,
        auid: auid,
        bonafide_type: bonafideType,
        hostel_fee_template_id: null,
        from_sem: null,
        to_sem: null,
      };
      const res = await axios.post("/api/student/studentBonafide", payload);
      if (res.status == 200 || res.status == 201) {
        setAlertMessage({
          severity: "success",
          message: `Student bonafide created successfully`,
        });
        setAlertOpen(true);
        getBonafideDetails(auid, bonafideType);
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

  const getBonafideDetails = async (auid, bonafideType) => {
    try {
      const res = await axios.get(
        `/api/student/studentBonafideDetails?auid=${auid}&bonafide_type=${bonafideType}`
      );
      const lists = res.data.data;
      if (res?.status == 200 || res?.status == 201) {
        const semesterHeaderLists = Array.from(
          { length: lists[0]?.number_of_semester },
          (_, i) => `sem${i + 1}`
        );
        let amountLists = [];
        for (let j = 0; j < lists.length; j++) {
          let list = {};
          for (let i = 1; i <= lists[0]?.number_of_semester; i++) {
            list[`sem${i}`] = lists[j][`year${i}_amt`] || 0;
            list["particular"] = lists[j]["voucher_head"] || "";
          }
          amountLists.push(list);
        }
        const updatedSemesterHeaderLists = semesterHeaderLists.filter((key) =>
          amountLists.some((row) => row[key] !== 0)
        );
        setState((prevState) => ({
          ...prevState,
          semesterHeaderList: updatedSemesterHeaderLists,
          columnsToHide: columnsToHide,
          studentBonafideDetail: lists.map((ele) => ({
            ...ele,
            acerpAmount: amountLists,
          })),
        }));
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

  const handlePrintModal = () => {
    setState((prevState) => ({
      ...prevState,
      isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
    }));
  };

  const printBonafide = async () => {
    const bonafidePrintResponse = await GenerateBonafide(
      studentBonafideDetail,
      studentDetail,
      semesterHeaderList
    );
    if (!!bonafidePrintResponse) {
      setState((prevState) => ({
        ...prevState,
        bonafidePdfPath: URL.createObjectURL(bonafidePrintResponse),
        isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
      }));
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      {!location.state && (
        <FormWrapper>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, md: 4 }}
            alignItems="center"
          >
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="bonafideTypeId"
                label="Bonafide Type"
                value={bonafideTypeId || ""}
                options={bonafideTypeList || []}
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
                disabled={loading || !auid || !bonafideTypeId}
                onClick={() => getStudentDetailByAuid(auid)}
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
      )}

      {!!studentBonafideDetail.length > 0 && (
        <Grid container mb={2}>
          <Grid xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={printBonafide}
            >
              <strong>Print</strong>
            </Button>
          </Grid>
        </Grid>
      )}

      {!!studentBonafideDetail.length > 0 && (
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Student Bonafide"
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
                          {`Ref: ${studentBonafideDetail[0]?.bonafide_number}`}
                        </Typography>
                        <Typography variant="subtitle2" fontSize="13px">
                          {`Date: ${moment(
                            studentBonafideDetail[0]?.created_Date
                          ).format("DD/MM/YYYY")}`}
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
                        <Typography className={classes.textJustify}>
                          This is to certify that 
                          {studentDetail?.candidate_sex == "Female" ? (
                            <b>MS.</b>
                          ) : (
                            <b>MR.</b>
                          )}{" "}
                          {<b>{studentDetail?.student_name || "-"}</b>},{" "}
                          {studentDetail?.candidate_sex == "Female"
                            ? "D/o."
                            : "S/o."}{" "}
                          {studentDetail?.father_name || "-"}, AUID No.
                          {" " + studentDetail?.auid || "-"} is provisionally
                          admitted to 
                          {<b>{studentDetail?.school_name}</b>} in 
                          {
                            <b>
                              {(studentDetail?.program_short_name || "-") +
                                "-" +
                                (studentDetail?.program_specialization_name ||
                                  "-")}
                            </b>
                          }
                           (course) on merit basis after undergoing the
                          selection procedure laid down by Acharya Institutes
                          for the Academic year {studentDetail?.ac_year},
                          subject to fulfilling the eligibility conditions
                          prescribed by the affiliating University. The fee
                          payable during the Academic Batch{" "}
                          {studentDetail?.academic_batch} is given below.
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
                        <Typography
                          paragraph
                          sx={{ textAlign: "right", marginBottom: "0px" }}
                        >
                          (Amount in Rupee)
                        </Typography>
                        <table className={classes.table}>
                          <thead>
                            <tr>
                              <th className={classes.th}>Particulars</th>
                              {semesterHeaderList.length > 0 &&
                                semesterHeaderList.map((ele, index) => (
                                  <th className={classes.th} key={index}>
                                    {ele}
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {studentBonafideDetail.length > 0 &&
                              studentBonafideDetail[0]?.acerpAmount.map(
                                (obj, index) => (
                                  <tr key={index}>
                                    <td className={classes.td}>
                                      {obj.particular}
                                    </td>
                                    {semesterHeaderList.length > 0 &&
                                      semesterHeaderList.map((el, i) => (
                                        <td className={classes.yearTd} key={i}>
                                          {obj[el]}
                                        </td>
                                      ))}
                                  </tr>
                                )
                              )}
                            <tr>
                              <td
                                className={classes.td}
                                style={{ textAlign: "center" }}
                              >
                                <b>Total</b>
                              </td>
                              {semesterHeaderList.length > 0 &&
                                semesterHeaderList.map((li, i) => (
                                  <td className={classes.yearTd}>
                                    <b>
                                      {studentBonafideDetail[0]?.acerpAmount.reduce(
                                        (sum, current) => {
                                          return sum + Number(current[li]);
                                        },
                                        0
                                      )}
                                    </b>
                                  </td>
                                ))}
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
                          The DD may be drawn in favour of &quot;ACHARYA
                          INSTITUTE OF TECHNOLOGY&quot; payable at Bangalore.
                        </Typography>
                        <Typography mt={0.8}>
                          ADD-ON PROGRAMME FEE DD may be drawn in favour of
                          &quot;NINI SKILLUP PVT LTD&quot; payable at Bangalore.
                        </Typography>
                        <Typography mt={0.8}>
                          Uniform &amp; Stationery fee to be paid separately
                          through ERP Portal.
                        </Typography>
                        <Typography mt={0.8}>
                          This Bonafide is issued only for the purpose of Bank
                          loan.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} mt={2}>
                    <Grid
                      container
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Grid item xs={12} md={6}>
                        <Typography paragraph className={classes.textJustify}>
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
                        <Typography mt={1}>
                          PREPARED BY &lt; USERNAME&gt;
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {!!isPrintBonafideModalOpen && (
        <ModalWrapper
          title="Student Bonafide"
          maxWidth={800}
          open={isPrintBonafideModalOpen}
          setOpen={() => handlePrintModal()}
        >
          <Box borderRadius={3} maxWidth={1000} maxHeight={400}>
            {!!bonafidePdfPath && (
              <object
                className={popupclass.objectTag}
                data={bonafidePdfPath}
                type="application/pdf"
                height="600"
              >
                <p>
                  Your web browser doesn't have a PDF plugin. Instead you can
                  download the file directly.
                </p>
              </object>
            )}
          </Box>
        </ModalWrapper>
      )}
    </Box>
  );
};

export default BonafideForm;
