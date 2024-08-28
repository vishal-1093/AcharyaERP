import { useState, useEffect, lazy } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import ModalWrapper from "../../../components/ModalWrapper.jsx";
import { GenerateBonafide } from "./GenerateBonafide.jsx";
import { GenerateBonafideLetter } from "./GenerateBonafideLetter.jsx";
import { GenerateCourseCompletion } from "./GenerateCourseCompletion.jsx";
import { GenerateMediumOfInstruction } from "./GenerateMediumOfInstruction.jsx";
import moment from "moment";

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
    textTransform: "capitalize",
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
  studentDetail: null,
  studentBonafideDetail: [],
  semesterHeaderList: [],
  addOnSemesterHeaderList: [],
  isPrintBonafideModalOpen: false,
  bonafidePdfPath: null,
  bonafideAddOnDetail: [],
  schoolTemplate: null,
};

const ViewBonafide = () => {
  const [
    {
      studentDetail,
      studentBonafideDetail,
      semesterHeaderList,
      addOnSemesterHeaderList,
      isPrintBonafideModalOpen,
      bonafidePdfPath,
      bonafideAddOnDetail,
      schoolTemplate,
    },
    setState,
  ] = useState(initialState);
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const popupclass = useModalStyles();

  const templates = require.context("../../../assets", true);

  useEffect(() => {
    setCrumbs([
      {
        name:
          location.state.page == "Index"
            ? "ACERP Bonafide"
            : "ACERP Bonafide Form",
        link:
          location.state.page == "Index"
            ? "/AcerpBonafideIndex"
            : "/AcerpBonafideForm",
      },
      { name: "View" },
    ]);
    if (!!location.state)
      getStudentDetailByAuid(
        location.state.studentAuid,
        location.state.bonafideType
      );
  }, []);

  const getStudentDetailByAuid = async (studentAuid, bonafideType) => {
    try {
      const res = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${studentAuid}`
      );
      if (res.status === 200 || res.status === 201) {
        getBonafideDetails(studentAuid, bonafideType);
        setState((prevState) => ({
          ...prevState,
          studentDetail: res.data.data[0],
        }));

        if (bonafideType === "Bonafide Letter") {
          try {
            const image = templates(
              `./${res.data.data[0].org_type.toLowerCase()}${res.data.data[0].school_name_short.toLowerCase()}.jpg`
            );
            setState((prevState) => ({
              ...prevState,
              schoolTemplate: image,
            }));
          } catch (error) {
            setAlertMessage({
              severity: "error",
              message: "Unable to find the image !!",
            });
            setAlertOpen(true);
          }
        }
      }
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

  const getBonafideDetails = async (auid, bonafideType) => {
    try {
      const res = await axios.get(
        `/api/student/studentBonafideDetails?auid=${auid}&bonafide_type=${bonafideType}`
      );
      const lists = res.data.data;
      if (res?.status == 200 || res?.status == 201) {
        getBonafideAddOnDetail(auid, bonafideType, lists);
      }
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

  const getBonafideAddOnDetail = async (auid, bonafideType, bonafideDetail) => {
    try {
      const response = await axios.get(
        `/api/student/studentBonafideAddOnDetails?auid=${auid}&bonafide_type=${bonafideType}`
      );
      if (response.status == 200 || response.status == 201) {
        const lists = response.data.data;
        let filterSemesterHeader = [];

        const semesterHeaderLists = Array.from(
          { length: bonafideDetail[0]?.number_of_semester },
          (_, i) => `sem${i + 1}`
        );

        if (!!location.state.semRange) {
          filterSemesterHeader = semesterHeaderLists.slice(
            location.state.semRange?.from - 1,
            location.state.semRange?.to
          );
        } else {
          filterSemesterHeader = semesterHeaderLists;
        }

        let amountLists = [];
        for (let j = 0; j < bonafideDetail.length; j++) {
          let list = {};
          for (let i = 1; i <= bonafideDetail[0]?.number_of_semester; i++) {
            list[`sem${i}`] = bonafideDetail[j][`year${i}_amt`] || 0;
            list["particular"] = bonafideDetail[j]["voucher_head"] || "";
          }
          amountLists.push(list);
        }
        let addOnAmountLists = [];
        for (let j = 0; j < lists.length; j++) {
          let list = {};
          for (let i = 1; i <= lists[0]?.number_of_semester; i++) {
            list[`sem${i}`] = lists[j][`sem${i}`] || 0;
            list["particular"] = lists[j]["feeType"] || "";
          }
          addOnAmountLists.push(list);
        }
        const updatedSemesterHeaderLists = filterSemesterHeader.filter((key) =>
          amountLists.some((row) => row[key] !== 0)
        );
        const updatedAddOnSemesterHeaderLists = filterSemesterHeader.filter(
          (key) => addOnAmountLists.some((row) => row[key] !== 0)
        );
        setState((prevState) => ({
          ...prevState,
          semesterHeaderList: updatedSemesterHeaderLists,
          addOnSemesterHeaderList: updatedAddOnSemesterHeaderLists,
          studentBonafideDetail: bonafideDetail.map((ele) => ({
            ...ele,
            acerpAmount: amountLists,
          })),
          bonafideAddOnDetail: lists.map((el) => ({
            ...el,
            addOnAmountList: addOnAmountLists,
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
    }
  };

  const handlePrintModal = () => {
    setState((prevState) => ({
      ...prevState,
      isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
    }));
  };

  const printBonafide = async () => {
    if (location.state.bonafideType === "Provisional Bonafide") {
      const bonafidePrintResponse = await GenerateBonafide(
        studentBonafideDetail,
        studentDetail,
        semesterHeaderList,
        bonafideAddOnDetail,
        addOnSemesterHeaderList
      );
      if (!!bonafidePrintResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(bonafidePrintResponse),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    } else if (location.state.bonafideType === "Bonafide Letter") {
      const bonafideLetterPrintResponse = await GenerateBonafideLetter(
        studentBonafideDetail,
        studentDetail,
        semesterHeaderList,
        bonafideAddOnDetail,
        addOnSemesterHeaderList,
        schoolTemplate
      );
      if (!!bonafideLetterPrintResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(bonafideLetterPrintResponse),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    } else if (
      location.state.bonafideType === "Course Completion Certificate"
    ) {
      const bonafideCourseCompletionResponse = await GenerateCourseCompletion(
        studentBonafideDetail,
        studentDetail
      );
      if (!!bonafideCourseCompletionResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(
            bonafideCourseCompletionResponse
          ),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    } else if (location.state.bonafideType === "Medium of Instruction") {
      const bonafideCourseCompletionResponse =
        await GenerateMediumOfInstruction(studentBonafideDetail, studentDetail);
      if (!!bonafideCourseCompletionResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(
            bonafideCourseCompletionResponse
          ),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    }
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          width: { md: "20%", lg: "15%", xs: "68%" },
          position: "absolute",
          right: 30,
          marginTop: { xs: -2, md: -5 },
        }}
      >
        {studentBonafideDetail.length > 0 && (
          <Grid container>
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
      </Box>

      {studentBonafideDetail.length > 0 && (
        <Grid container mt={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={studentBonafideDetail[0]?.bonafide_type}
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
              {studentBonafideDetail[0]?.bonafide_type ==
                "Provisional Bonafide" && (
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
                            {`(Amount in ${
                              studentBonafideDetail[0]?.currency_type_name ==
                              "INR"
                                ? "Rupees"
                                : "USD"
                            })`}
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
                                          <td
                                            className={classes.yearTd}
                                            key={i}
                                          >
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
                        {!!bonafideAddOnDetail[0].other_fee_details_id && (
                          <Grid item xs={12} md={8} mt={2}>
                            <Typography
                              paragraph
                              sx={{ textAlign: "right", marginBottom: "0px" }}
                            >
                              {`(Amount in Rupees)`}
                            </Typography>
                            <table className={classes.table}>
                              <thead>
                                <tr>
                                  <th className={classes.th}>Particulars</th>
                                  {addOnSemesterHeaderList.length > 0 &&
                                    addOnSemesterHeaderList.map(
                                      (ele, index) => (
                                        <th className={classes.th} key={index}>
                                          {ele}
                                        </th>
                                      )
                                    )}
                                </tr>
                              </thead>
                              <tbody>
                                {bonafideAddOnDetail.length > 0 &&
                                  bonafideAddOnDetail[0]?.addOnAmountList?.map(
                                    (obj, index) => (
                                      <tr key={index}>
                                        <td className={classes.td}>
                                          {obj.particular}
                                        </td>
                                        {addOnSemesterHeaderList.length > 0 &&
                                          addOnSemesterHeaderList?.map(
                                            (el, i) => (
                                              <td
                                                className={classes.yearTd}
                                                key={i}
                                              >
                                                {obj[el]}
                                              </td>
                                            )
                                          )}
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
                                  {addOnSemesterHeaderList.length > 0 &&
                                    addOnSemesterHeaderList.map((li, i) => (
                                      <td className={classes.yearTd}>
                                        <b>
                                          {bonafideAddOnDetail[0]?.addOnAmountList?.reduce(
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
                        )}
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
                            &quot;NINI SKILLUP PVT LTD&quot; payable at
                            Bangalore.
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
                            *Please note that the given fee is applicable only
                            for the prescribed Academic Batch. Admission shall
                            be ratified only after the submission of all
                            original documents for verification and payment of
                            all the fee for the semester/year as prescribed in
                            the letter of offer. Failure to do so shall result
                            in the withdrawal of the Offer of Admission.
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
              )}

              {/* Bonafide Letter */}
              {studentBonafideDetail[0]?.bonafide_type == "Bonafide Letter" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid
                      xs={12}
                      md={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <img
                        style={{
                          width: "80%",
                          position: "relative",
                          border: "1px solid lightgray",
                        }}
                        src={schoolTemplate || null}
                      />
                      <div
                        style={{
                          width: "80%",
                          padding: "0 100px",
                          position: "absolute",
                          top: "460px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography paragraph fontSize="13px">
                          <b>RefNo:</b>{" "}
                          {`${studentBonafideDetail[0]?.bonafide_number}`}
                        </Typography>
                        <Typography paragraph fontSize="13px">
                          <b>Date:</b>{" "}
                          {`${moment(
                            studentBonafideDetail[0]?.created_Date
                          ).format("DD/MM/YYYY")}`}
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "80%",
                          position: "absolute",
                          top: "500px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          paragraph
                          align="center"
                          fontSize="13px"
                          display="inline-block"
                          borderBottom="1px solid"
                        >
                          TO WHOMSOEVER IT MAY CONCERN
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "80%",
                          padding: "0 100px",
                          position: "absolute",
                          top: "560px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          paragraph
                          fontSize="13px"
                          sx={{ textAlign: "justify" }}
                        >
                          This is to certify that 
                          {studentDetail?.candidate_sex == "Female" ? (
                            <b>MS.</b>
                          ) : (
                            <b>MR.</b>
                          )}{" "}
                          {<b>{studentDetail?.student_name || "-"}</b>},{" "}
                          <b>
                            {studentDetail?.candidate_sex == "Female"
                              ? "D/o."
                              : "S/o."}
                          </b>{" "}
                          <b>{studentDetail?.father_name || "-"}</b>, AUID No.
                          {" " + studentDetail?.auid || "-"} is admitted to 
                          {studentDetail?.school_name} for{" "}
                          {studentDetail?.current_year} Year/
                          {studentDetail?.current_sem} semester in 
                          {
                            <b>
                              {(studentDetail?.program_short_name || "-") +
                                "-" +
                                (studentDetail?.program_specialization_name ||
                                  "-")}
                            </b>
                          }
                           (course) during the Academic year{" "}
                          {studentDetail?.ac_year + " "}
                          (admitted through MANAGEMENT).The fee payable during
                          the Academic Batch {studentDetail?.academic_batch} is
                          given below.
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "80%",
                          padding: "0 100px",
                          position: "absolute",
                          top: "630px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          paragraph
                          sx={{ textAlign: "right", marginBottom: "0px" }}
                        >
                          {`(Amount in ${
                            studentBonafideDetail[0]?.currency_type_name ==
                            "INR"
                              ? "Rupees"
                              : "USD"
                          })`}
                        </Typography>
                      </div>
                      <div
                        style={{
                          width: "80%",
                          padding: "0 100px",
                          position: "absolute",
                          top: "650px",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            position: "relative",
                          }}
                        >
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
                                          <td
                                            className={classes.yearTd}
                                            key={i}
                                          >
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
                        </div>

                        <div
                          style={{
                            marginTop: "20px",
                            width: "100%",
                            position: "relative",
                          }}
                        >
                          {!!bonafideAddOnDetail[0].other_fee_details_id && (
                            <div
                              style={{
                                marginTop: "10px",
                                width: "100%",
                                position: "relative",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                              }}
                            >
                              <Typography
                                paragraph
                                sx={{ textAlign: "right", marginBottom: "0px" }}
                              >
                                (Amount in Rupees)
                              </Typography>
                            </div>
                          )}
                          {!!bonafideAddOnDetail[0].other_fee_details_id && (
                            <table className={classes.table}>
                              <thead>
                                <tr>
                                  <th className={classes.th}>Particulars</th>
                                  {addOnSemesterHeaderList.length > 0 &&
                                    addOnSemesterHeaderList.map(
                                      (ele, index) => (
                                        <th className={classes.th} key={index}>
                                          {ele}
                                        </th>
                                      )
                                    )}
                                </tr>
                              </thead>
                              <tbody>
                                {bonafideAddOnDetail.length > 0 &&
                                  bonafideAddOnDetail[0]?.addOnAmountList?.map(
                                    (obj, index) => (
                                      <tr key={index}>
                                        <td className={classes.td}>
                                          {obj.particular}
                                        </td>
                                        {addOnSemesterHeaderList.length > 0 &&
                                          addOnSemesterHeaderList?.map(
                                            (el, i) => (
                                              <td
                                                className={classes.yearTd}
                                                key={i}
                                              >
                                                {obj[el]}
                                              </td>
                                            )
                                          )}
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
                                  {addOnSemesterHeaderList.length > 0 &&
                                    addOnSemesterHeaderList.map((li, i) => (
                                      <td className={classes.yearTd}>
                                        <b>
                                          {bonafideAddOnDetail[0]?.addOnAmountList?.reduce(
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
                          )}
                        </div>
                        <div
                          style={{
                            width: "80%",
                            position: "absolute",
                            marginTop: "50px",
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography paragraph fontSize="13px">
                            The DD may be drawn in favour of &quot;ACHARYA
                            INSTITUTE OF TECHNOLOGY&quot; payable at Bangalore.
                          </Typography>
                        </div>
                        <div
                          style={{
                            width: "80%",
                            position: "absolute",
                            marginTop: "100px",
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography paragraph fontSize="13px">
                            *please note that the given fee is applicable only
                            for the prescribed Academic Batch.This Bonafide is
                            issued only for the purpose of Bank loan.
                          </Typography>
                        </div>
                        <div
                          style={{
                            width: "80%",
                            position: "absolute",
                            marginTop: "200px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography paragraph fontSize="13px">
                            <b>PRINCIPAL</b>
                            <br></br>
                            <b>AUTHORIZED SIGNATORY</b>
                          </Typography>
                          <Typography paragraph fontSize="11px" mt={4}>
                            Prepared By - Super Admin
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {/* Course Completion */}
              {studentBonafideDetail[0]?.bonafide_type ==
                "Course Completion Certificate" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        align="center"
                        fontSize="14px"
                        display="inline-block"
                        borderBottom="2px solid"
                      >
                        COURSE COMPLETION CERTIFICATE
                      </Typography>
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
                          <Typography paragraph style={{ textAlign: "center" }}>
                            This is to certify that the student mentioned below
                            has successfully completed the{" "}
                            {<b>{studentDetail?.program_short_name || "-"}</b>}{" "}
                            of{" "}
                            {
                              <b>
                                {studentDetail?.program_specialization_name ||
                                  "-"}
                              </b>
                            }{" "}
                            at {studentDetail?.school_name || "-"}, Bangalore,
                            affiliated with{" "}
                            {studentBonafideDetail[0]?.bonafide_number || "-"}{" "}
                            during the Academic Batch{" "}
                            <b>{studentDetail?.academic_batch || "-"}</b>
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
                        <Grid item xs={12} md={8}>
                          <Card>
                            <CardHeader
                              title="Student Details"
                              titleTypographyProps={{
                                variant: "subtitle2",
                              }}
                              sx={{
                                backgroundColor: "tableBg.main",
                                color: "tableBg.textColor",
                                textAlign: "center",
                                padding: 1,
                              }}
                            />
                            <CardContent>
                              <Grid container columnSpacing={2} rowSpacing={1}>
                                <DisplayContent
                                  label="AUID"
                                  value={studentDetail?.auid}
                                />
                                <DisplayContent
                                  label="Student Name"
                                  value={studentDetail?.student_name}
                                />
                                <DisplayContent
                                  label="USN"
                                  value={studentDetail?.usn ?? "-"}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="School"
                                  value={studentDetail?.school_name}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                                <DisplayContent
                                  label="Acharya Email"
                                  value={studentDetail?.acharya_email}
                                />
                                <DisplayContent
                                  label="Mobile No."
                                  value={studentDetail?.mobile}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {/* Medium of Instruction */}

              {studentBonafideDetail[0]?.bonafide_type ==
                "Medium of Instruction" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid item xs={12} align="center">
                      <Typography
                        variant="subtitle2"
                        align="center"
                        fontSize="14px"
                        display="inline-block"
                        borderBottom="2px solid"
                      >
                        MEDIUM OF INSTRUCTION CERTIFICATE
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
                            This is to certify that{" "}
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>MS.</b>
                            ) : (
                              <b>MR.</b>
                            )}{" "}
                            {<b>{studentDetail?.student_name || "-"},</b>}{" "}
                            {
                              <b>
                                {studentDetail?.candidate_sex == "Female"
                                  ? "D/o."
                                  : "S/o."}
                              </b>
                            }{" "}
                            {<b>{studentDetail?.father_name || "-"}</b>},
                            mentioned below was enrolled at{" "}
                            <b>{studentDetail?.school_name || "-"}</b>,
                            Bangalore, affiliated with{" "}
                            <b>
                              {studentBonafideDetail[0]?.bonafide_number || "-"}
                            </b>
                            .{" "}
                            {studentDetail?.candidate_sex == "Female"
                              ? "She"
                              : "He"}{" "}
                            completed the Programme{" "}
                            <b>{studentDetail?.program_short_name || "-"}</b>{" "}
                            with a specialization{" "}
                            <b>
                              {studentDetail?.program_specialization_name ||
                                "-"}
                            </b>{" "}
                            (course) during the Academic Batch{" "}
                            <b>{studentDetail?.academic_batch || "-"}</b>. The
                            medium of instruction throughout the Programme was
                            in English.
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
                        <Grid item xs={12} md={10} mt={2}>
                          <Card>
                            <CardHeader
                              title="Student Details"
                              titleTypographyProps={{
                                variant: "subtitle2",
                              }}
                              sx={{
                                backgroundColor: "tableBg.main",
                                color: "tableBg.textColor",
                                textAlign: "center",
                                padding: 1,
                              }}
                            />
                            <CardContent>
                              <Grid container columnSpacing={2} rowSpacing={1}>
                                <DisplayContent
                                  label="AUID"
                                  value={studentDetail?.auid}
                                />
                                <DisplayContent
                                  label="Student Name"
                                  value={studentDetail?.student_name}
                                />
                                <DisplayContent
                                  label="USN"
                                  value={studentDetail?.usn ?? "-"}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="School"
                                  value={studentDetail?.school_name}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                                <DisplayContent
                                  label="Acharya Email"
                                  value={studentDetail?.acharya_email}
                                />
                                <DisplayContent
                                  label="Mobile No."
                                  value={studentDetail?.mobile}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              )}
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
    </>
  );
};

export default ViewBonafide;
