import { useState, useEffect } from "react";
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
        const semesterHeaderLists = Array.from(
          { length: bonafideDetail[0]?.number_of_semester },
          (_, i) => `sem${i + 1}`
        );

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
        const updatedSemesterHeaderLists = semesterHeaderLists.filter((key) =>
          amountLists.some((row) => row[key] !== 0)
        );
        const updatedAddOnSemesterHeaderLists = semesterHeaderLists.filter(
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
        schoolTemplate
      );
      if (!!bonafideLetterPrintResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(bonafideLetterPrintResponse),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      {studentBonafideDetail.length > 0 && (
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

      {studentBonafideDetail.length > 0 && (
        <Grid container>
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

export default ViewBonafide;
