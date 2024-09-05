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
import CustomModal from "../../../components/CustomModal";
import { GenerateBonafide } from "./GenerateBonafide.jsx";
import { GenerateBonafideLetter } from "./GenerateBonafideLetter.jsx";
import { GenerateCourseCompletion } from "./GenerateCourseCompletion.jsx";
import { GenerateMediumOfInstruction } from "./GenerateMediumOfInstruction.jsx";
import { GenerateCharacterCertificate } from "./GenerateCharacterCertificate.jsx";
import { GenerateHigherStudy } from "./GenerateHigherStudy.jsx";
import { GenerateInternshipBonafide } from "./GenerateInternshipBonafide.jsx";
import { GeneratePassportBonafide } from "./GeneratePassportBonafide.jsx";
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

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  studentDetail: null,
  studentBonafideDetail: [],
  semesterHeaderList: [],
  addOnSemesterHeaderList: [],
  isPrintBonafideModalOpen: false,
  bonafidePdfPath: null,
  bonafideAddOnDetail: [],
  printModalOpen: false,
  modalContent: modalContents,
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
      printModalOpen,
      modalContent,
    },
    setState,
  ] = useState(initialState);
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const popupclass = useModalStyles();

  useEffect(() => {
    setCrumbs([
      {
        name: location.state.page == "Index" ? "Bonafide" : "Bonafide Form",
        link:
          location.state.page == "Index" ? "/BonafideIndex" : "/BonafideForm",
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

  const onPrint = () => {
    setPrintModalOpen();
    setModalContent("", "Do you want to print on physical letter head?", [
      { name: "Yes", color: "primary", func: () => printBonafide(true) },
      { name: "No", color: "primary", func: () => printBonafide(false) },
    ]);
  };

  const setPrintModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      printModalOpen: !printModalOpen,
    }));
  };

  const setModalContent = (title, message, buttons) => {
    setState((prevState) => ({
      ...prevState,
      modalContent: {
        ...prevState.modalContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const printBonafide = async (status) => {
    if (location.state.bonafideType === "Provisional Bonafide") {
      const bonafidePrintResponse = await GenerateBonafide(
        studentBonafideDetail,
        studentDetail,
        semesterHeaderList,
        bonafideAddOnDetail,
        addOnSemesterHeaderList,
        status
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
        status
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
        studentDetail,
        status
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
      const bonafideMediumOfInstructionResponse =
        await GenerateMediumOfInstruction(
          studentBonafideDetail,
          studentDetail,
          status
        );
      if (!!bonafideMediumOfInstructionResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(
            bonafideMediumOfInstructionResponse
          ),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    } else if (location.state.bonafideType === "Character Certificate") {
      const characterCertificateResponse = await GenerateCharacterCertificate(
        studentBonafideDetail,
        studentDetail,
        status
      );
      if (!!characterCertificateResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(characterCertificateResponse),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    } else if (location.state.bonafideType === "Study Certificate") {
      const higherStudyResponse = await GenerateHigherStudy(
        studentBonafideDetail,
        studentDetail,
        status
      );
      if (!!higherStudyResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(higherStudyResponse),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    } else if (location.state.bonafideType === "Internship Bonafide") {
      const internshipBonafideResponse = await GenerateInternshipBonafide(
        studentBonafideDetail,
        studentDetail,
        status
      );
      if (!!internshipBonafideResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(internshipBonafideResponse),
          isPrintBonafideModalOpen: !isPrintBonafideModalOpen,
        }));
      }
    } else if (location.state.bonafideType === "Passport Bonafide") {
      const passportBonafideResponse = await GeneratePassportBonafide(
        studentBonafideDetail,
        studentDetail,
        status
      );
      if (!!passportBonafideResponse) {
        setState((prevState) => ({
          ...prevState,
          bonafidePdfPath: URL.createObjectURL(passportBonafideResponse),
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
      {!!printModalOpen && (
        <CustomModal
          open={printModalOpen}
          setOpen={setPrintModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
      )}

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
                onClick={onPrint}
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
              {studentBonafideDetail[0]?.bonafide_type ==
                "Provisional Bonafide" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        mt={3}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography paragraph>
                            Ref: &nbsp;
                            <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                          </Typography>
                          <Typography paragraph>
                            Date: &nbsp;
                            <b>{`${moment(
                              studentBonafideDetail[0]?.created_Date
                            ).format("DD/MM/YYYY")}`}</b>
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
                        TO WHOM SO EVER IT MAY CONCERN
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12} mt={3}>
                      <Grid
                        container
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid item xs={12} md={8}>
                          <Typography className={classes.textJustify}>
                            This is to certify that 
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>Ms.</b>
                            ) : (
                              <b>Mr.</b>
                            )}{" "}
                            {<b>{studentDetail?.student_name || "-"}</b>},{" "}
                            {
                              <b>
                                {studentDetail?.candidate_sex == "Female"
                                  ? "D/o."
                                  : "S/o."}
                              </b>
                            }{" "}
                            {<b>{studentDetail?.father_name || "-"}</b>}, AUID
                            No. {<b>{studentDetail?.auid || "-"}</b>} is
                            provisionally admitted to 
                            {<b>{studentDetail?.school_name}</b>} in 
                            {
                              <b>
                                {(studentDetail?.program_short_name || "-") +
                                  "-" +
                                  (studentDetail?.program_specialization_name ||
                                    "-")}
                              </b>
                            }{" "}
                            on merit basis after undergoing the selection
                            procedure laid down by Acharya Institutes for the
                            Academic year {<b>{studentDetail?.ac_year}</b>},
                            subject to fulfilling the eligibility conditions
                            prescribed by the affiliating University. The fee
                            payable during the Academic Batch{" "}
                            {<b>{studentDetail?.academic_batch}</b>} is given
                            below.
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
                        <Grid item xs={12} md={8}>
                          <Typography>
                            &#8226; The DD may be drawn in favour of &quot;{" "}
                            {studentDetail?.school_name?.toUpperCase() || "-"}
                            &quot; payable at Bangalore.
                          </Typography>
                          <Typography mt={0.8}>
                            &#8226; ADD-ON PROGRAMME FEE DD may be drawn in
                            favour of &quot;NINI SKILLUP PVT LTD&quot; payable
                            at Bangalore.
                          </Typography>
                          <Typography mt={0.8}>
                            &#8226; Uniform &amp; Stationery fee to be paid
                            separately through ERP Portal.
                          </Typography>
                          <Typography mt={2}>
                            <b>
                              This Bonafide is issued only for the purpose of
                              Bank loan.
                            </b>
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
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2" fontSize="14px">
                            PRINCIPAL
                            <Typography variant="subtitle2" fontSize="14px">
                              AUTHORIZED SIGNATORY
                            </Typography>
                          </Typography>
                          <Typography paragraph pt={5}>
                            Prepared By -{" "}
                            {studentBonafideDetail[0]?.created_username || "-"}
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
                    <Grid container rowSpacing={1}>
                      <Grid xs={12} md={12}>
                        <Grid
                          container
                          mt={3}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography paragraph>
                              Ref: &nbsp;
                              <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                            </Typography>
                            <Typography paragraph>
                              Date: &nbsp;
                              <b>{`${moment(
                                studentBonafideDetail[0]?.created_Date
                              ).format("DD/MM/YYYY")}`}</b>
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
                          TO WHOM SO EVER IT MAY CONCERN
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
                          <Grid item xs={12} md={8}>
                            <Typography
                              paragraph
                              fontSize="13px"
                              sx={{ textAlign: "justify" }}
                            >
                              This is to certify that 
                              {studentDetail?.candidate_sex == "Female" ? (
                                <b>Ms.</b>
                              ) : (
                                <b>Mr.</b>
                              )}{" "}
                              {<b>{studentDetail?.student_name || "-"}</b>},{" "}
                              <b>
                                {studentDetail?.candidate_sex == "Female"
                                  ? "D/o."
                                  : "S/o."}
                              </b>{" "}
                              <b>{studentDetail?.father_name || "-"}</b>, AUID
                              No. {<b>{studentDetail?.auid || "-"}</b>} is
                              admitted to 
                              <b>{studentDetail?.school_name}</b> for{" "}
                              {studentDetail?.current_year} Year/
                              {studentDetail?.current_sem} semester in 
                              {
                                <b>
                                  {(studentDetail?.program_short_name || "-") +
                                    "-" +
                                    (studentDetail?.program_specialization_name ||
                                      "-")}
                                </b>
                              }{" "}
                              during the Academic year{" "}
                              {<b>{studentDetail?.ac_year + " "}</b>}
                              (admitted through MANAGEMENT). The fee payable
                              during the Academic Batch{" "}
                              {<b>{studentDetail?.academic_batch}</b>} is given
                              below.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            justifyContent: "center",
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
                                          <th
                                            className={classes.th}
                                            key={index}
                                          >
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
                                                return (
                                                  sum + Number(current[li])
                                                );
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
                          <Grid item xs={12} md={8}>
                            <Typography>
                              &#8226; The DD may be drawn in favour of
                              &quot;ACHARYA INSTITUTE OF TECHNOLOGY&quot;
                              payable at Bangalore.
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
                            <Typography
                              paragraph
                              className={classes.textJustify}
                            >
                              *please note that the given fee is applicable only
                              for the prescribed Academic Batch.This Bonafide is
                              issued only for the purpose of Bank loan.
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
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle2" fontSize="14px">
                              PRINCIPAL
                              <Typography variant="subtitle2" fontSize="14px">
                                AUTHORIZED SIGNATORY
                              </Typography>
                            </Typography>
                            <Typography paragraph pt={5}>
                              Prepared By -{" "}
                              {studentBonafideDetail[0]?.created_username ||
                                "-"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {/* Course Completion */}
              {studentBonafideDetail[0]?.bonafide_type ==
                "Course Completion Certificate" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        mt={3}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography paragraph>
                            Ref: &nbsp;
                            <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                          </Typography>
                          <Typography paragraph>
                            Date: &nbsp;
                            <b>{`${moment(
                              studentBonafideDetail[0]?.created_Date
                            ).format("DD/MM/YYYY")}`}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
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
                        <Grid item xs={12} md={8}>
                          <Typography
                            paragraph
                            style={{ textAlign: "justify" }}
                          >
                            This is to certify that the below mentioned student,{" "}
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>Ms.</b>
                            ) : (
                              <b>Mr.</b>
                            )}{" "}
                            {<b>{studentDetail?.student_name || "-"},</b>}{" "}
                            {
                              <b>
                                {studentDetail?.candidate_sex == "Female"
                                  ? "D/o."
                                  : "S/o."}
                              </b>
                            }{" "}
                            {<b>{studentDetail?.father_name || "-"}</b>}{" "}
                            enrolled at{" "}
                            <b>{studentDetail?.school_name || "-"}</b>,
                            Bangalore, affiliated to{" "}
                            <b>
                              {studentBonafideDetail[0]?.bonafide_number || "-"}
                            </b>
                            .{" "}
                            {studentDetail?.candidate_sex == "Female"
                              ? "She"
                              : "He"}{" "}
                            successfully completed the Programme{" "}
                            <b>{studentDetail?.program_short_name || "-"}</b>
                            {"-"}
                            <b>
                              {studentDetail?.program_specialization_name ||
                                "-"}
                            </b>{" "}
                            during the Academic Batch{" "}
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
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />

                                <DisplayContent
                                  label="Nationality"
                                  value={studentDetail?.CountryName || "-"}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
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
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle2" fontSize="14px">
                              PRINCIPAL
                              <Typography variant="subtitle2" fontSize="14px">
                                AUTHORIZED SIGNATORY
                              </Typography>
                            </Typography>
                            <Typography paragraph pt={5}>
                              Prepared By -{" "}
                              {studentBonafideDetail[0]?.created_username ||
                                "-"}
                            </Typography>
                          </Grid>
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
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        mt={3}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography paragraph>
                            Ref: &nbsp;
                            <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                          </Typography>
                          <Typography paragraph>
                            Date: &nbsp;
                            <b>{`${moment(
                              studentBonafideDetail[0]?.created_Date
                            ).format("DD/MM/YYYY")}`}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
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
                        <Grid item xs={12} md={8}>
                          <Typography className={classes.textJustify}>
                            This is to certify that the below mentioned student,{" "}
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>Ms.</b>
                            ) : (
                              <b>Mr.</b>
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
                            enrolled at{" "}
                            <b>{studentDetail?.school_name || "-"}</b>,
                            Bangalore, affiliated to{" "}
                            <b>
                              {studentBonafideDetail[0]?.bonafide_number || "-"}
                            </b>
                            .{" "}
                            {studentDetail?.candidate_sex == "Female"
                              ? "She"
                              : "He"}{" "}
                            completed the Programme{" "}
                            <b>{studentDetail?.program_short_name || "-"}</b>
                            {"-"}
                            <b>
                              {studentDetail?.program_specialization_name ||
                                "-"}
                            </b>{" "}
                            during the Academic Batch{" "}
                            <b>{studentDetail?.academic_batch || "-"}</b>.
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
                        <Grid item xs={12} md={8} mt={2}>
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
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />

                                <DisplayContent
                                  label="Nationality"
                                  value={studentDetail?.CountryName || "-"}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12} mt={3}>
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Grid item xs={12} md={8}>
                            <Typography className={classes.textJustify}>
                              <b>
                                The medium of instruction throughout the
                                Programme was in English.
                              </b>
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
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle2" fontSize="14px">
                              PRINCIPAL
                              <Typography variant="subtitle2" fontSize="14px">
                                AUTHORIZED SIGNATORY
                              </Typography>
                            </Typography>
                            <Typography paragraph pt={5}>
                              Prepared By -{" "}
                              {studentBonafideDetail[0]?.created_username ||
                                "-"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {/* Character Certificate */}

              {studentBonafideDetail[0]?.bonafide_type ==
                "Character Certificate" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        mt={3}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography paragraph>
                            Ref: &nbsp;
                            <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                          </Typography>
                          <Typography paragraph>
                            Date: &nbsp;
                            <b>{`${moment(
                              studentBonafideDetail[0]?.created_Date
                            ).format("DD/MM/YYYY")}`}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Typography
                        variant="subtitle2"
                        align="center"
                        fontSize="14px"
                        display="inline-block"
                        borderBottom="2px solid"
                      >
                        CHARACTER CERTIFICATE
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
                        <Grid item xs={12} md={8}>
                          <Typography className={classes.textJustify}>
                            This is to certify that the below mentioned student,{" "}
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>Ms.</b>
                            ) : (
                              <b>Mr.</b>
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
                            enrolled at{" "}
                            <b>{studentDetail?.school_name || "-"}</b>,
                            Bangalore, affiliated to{" "}
                            <b>
                              {studentBonafideDetail[0]?.bonafide_number || "-"}
                            </b>
                            .{" "}
                            {studentDetail?.candidate_sex == "Female"
                              ? "She"
                              : "He"}{" "}
                            completed the Programme{" "}
                            <b>{studentDetail?.program_short_name || "-"}</b>
                            {"-"}
                            <b>
                              {studentDetail?.program_specialization_name ||
                                "-"}
                            </b>{" "}
                            during the Academic Batch{" "}
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
                        <Grid item xs={12} md={8} mt={2}>
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
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />

                                <DisplayContent
                                  label="Nationality"
                                  value={studentDetail?.CountryName || "-"}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12} mt={3}>
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Grid item xs={12} md={8}>
                            <Typography
                              className={classes.textJustify}
                              sx={{ marginTop: "15px" }}
                            >
                              <b>
                                His conduct was found to be good during his stay
                                in this Institute.
                              </b>
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
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle2" fontSize="14px">
                              PRINCIPAL
                              <Typography variant="subtitle2" fontSize="14px">
                                AUTHORIZED SIGNATORY
                              </Typography>
                            </Typography>
                            <Typography paragraph pt={5}>
                              Prepared By -{" "}
                              {studentBonafideDetail[0]?.created_username ||
                                "-"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {/* Higher Study Certificate */}

              {studentBonafideDetail[0]?.bonafide_type ==
                "Study Certificate" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        mt={3}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography paragraph>
                            Ref: &nbsp;
                            <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                          </Typography>
                          <Typography paragraph>
                            Date: &nbsp;
                            <b>{`${moment(
                              studentBonafideDetail[0]?.created_Date
                            ).format("DD/MM/YYYY")}`}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Typography
                        variant="subtitle2"
                        align="center"
                        fontSize="14px"
                        display="inline-block"
                        borderBottom="2px solid"
                      >
                        HIGHER STUDIES CERTIFICATE
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
                        <Grid item xs={12} md={8}>
                          <Typography className={classes.textJustify}>
                            This is to certify that the below mentioned student,{" "}
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>Ms.</b>
                            ) : (
                              <b>Mr.</b>
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
                            enrolled at{" "}
                            <b>{studentDetail?.school_name || "-"}</b>,
                            Bangalore, affiliated to{" "}
                            <b>
                              {studentBonafideDetail[0]?.bonafide_number || "-"}
                            </b>
                            .{" "}
                            {studentDetail?.candidate_sex == "Female"
                              ? "She"
                              : "He"}{" "}
                            successfully completed the Programme{" "}
                            <b>{studentDetail?.program_short_name || "-"}</b>
                            {"-"}
                            <b>
                              {studentDetail?.program_specialization_name ||
                                "-"}
                            </b>{" "}
                            during the Academic Batch{" "}
                            <b>{studentDetail?.academic_batch || "-"}</b>. The
                            medium of instruction throughout the Programme was
                            in English.{" "}
                            {studentDetail?.candidate_sex == "Female"
                              ? "Her"
                              : "His"}{" "}
                            conduct was found to be good during{" "}
                            {studentDetail?.candidate_sex == "Female"
                              ? "her"
                              : "his"}{" "}
                            stay in this Institute.
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
                        <Grid item xs={12} md={8} mt={2}>
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
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />

                                <DisplayContent
                                  label="Nationality"
                                  value={studentDetail?.CountryName || "-"}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12} mt={3}>
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Grid item xs={12} md={8}>
                            <Typography
                              className={classes.textJustify}
                              sx={{ marginTop: "15px" }}
                            >
                              <b>
                                This certificate is issued based on the request
                                of the student for the purpose of Job/ Higher
                                studies.
                              </b>
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
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle2" fontSize="14px">
                              PRINCIPAL
                              <Typography variant="subtitle2" fontSize="14px">
                                AUTHORIZED SIGNATORY
                              </Typography>
                            </Typography>
                            <Typography paragraph pt={5}>
                              Prepared By -{" "}
                              {studentBonafideDetail[0]?.created_username ||
                                "-"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {/* Internship Bonafide */}
              {studentBonafideDetail[0]?.bonafide_type ==
                "Internship Bonafide" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        mt={3}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography paragraph>
                            Ref: &nbsp;
                            <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                          </Typography>
                          <Typography paragraph>
                            Date: &nbsp;
                            <b>{`${moment(
                              studentBonafideDetail[0]?.created_Date
                            ).format("DD/MM/YYYY")}`}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Typography
                        variant="subtitle2"
                        align="center"
                        fontSize="14px"
                        display="inline-block"
                        borderBottom="2px solid"
                      >
                        TO WHOM SO EVER IT MAY CONCERN
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
                        <Grid item xs={12} md={8}>
                          <Typography className={classes.textJustify}>
                            This is to certify that the below mentioned student,{" "}
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>Ms.</b>
                            ) : (
                              <b>Mr.</b>
                            )}{" "}
                            {<b>{studentDetail?.student_name || "-"},</b>}{" "}
                            {
                              <b>
                                {studentDetail?.candidate_sex == "Female"
                                  ? "D/o."
                                  : "S/o."}
                              </b>
                            }{" "}
                            {<b>{studentDetail?.father_name || "-"}</b>}, was
                            enrolled at{" "}
                            <b>{studentDetail?.school_name || "-"}</b>,
                            Bangalore, affiliated to{" "}
                            <b>
                              {studentBonafideDetail[0]?.bonafide_number || "-"}
                            </b>
                            . He is studying in{" "}
                            <b>{`${studentDetail?.current_year} year/${studentDetail?.current_sem} sem`}</b>
                            ,{" "}
                            <b>{`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}</b>
                            .
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
                        <Grid item xs={12} md={8} mt={2}>
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
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />

                                <DisplayContent
                                  label="Nationality"
                                  value={studentDetail?.CountryName || "-"}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} mt={3}>
                      <Grid
                        container
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Grid item xs={12} md={8}>
                          <Typography
                            className={classes.textJustify}
                            sx={{ marginTop: "15px" }}
                          >
                            <b>
                              This letter is given for the purpose of
                              internship.
                            </b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} mt={4}>
                          <Grid
                            container
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              md={8}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="subtitle2" fontSize="14px">
                                PRINCIPAL
                                <Typography variant="subtitle2" fontSize="14px">
                                  AUTHORIZED SIGNATORY
                                </Typography>
                              </Typography>
                              <Typography paragraph pt={5}>
                                Prepared By -{" "}
                                {studentBonafideDetail[0]?.created_username ||
                                  "-"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {/* Passport Bonafide */}
              {studentBonafideDetail[0]?.bonafide_type ==
                "Passport Bonafide" && (
                <CardContent>
                  <Grid container rowSpacing={1}>
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        mt={3}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography paragraph>
                            Ref: &nbsp;
                            <b>{`${studentBonafideDetail[0]?.bonafide_number}`}</b>
                          </Typography>
                          <Typography paragraph>
                            Date: &nbsp;
                            <b>{`${moment(
                              studentBonafideDetail[0]?.created_Date
                            ).format("DD/MM/YYYY")}`}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Typography
                        variant="subtitle2"
                        align="center"
                        fontSize="14px"
                        display="inline-block"
                        borderBottom="2px solid"
                      >
                        TO WHOM SO EVER IT MAY CONCERN
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
                        <Grid item xs={12} md={8}>
                          <Typography className={classes.textJustify}>
                            This is to certify that the below mentioned student,{" "}
                            {studentDetail?.candidate_sex == "Female" ? (
                              <b>Ms.</b>
                            ) : (
                              <b>Mr.</b>
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
                            enrolled at{" "}
                            <b>{studentDetail?.school_name || "-"}</b>,
                            Bangalore, affiliated to{" "}
                            <b>
                              {studentBonafideDetail[0]?.bonafide_number || "-"}
                            </b>
                            . He is studying in{" "}
                            <b>{`${studentDetail?.current_year} year/${studentDetail?.current_sem} sem`}</b>
                            ,{" "}
                            <b>{`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}</b>
                            .
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
                        <Grid item xs={12} md={8} mt={2}>
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
                                  label="Father Name"
                                  value={studentDetail?.father_name}
                                />
                                <DisplayContent
                                  label="DOA"
                                  value={moment(
                                    studentDetail?.date_of_admission
                                  ).format("DD-MM-YYYY")}
                                />
                                <DisplayContent
                                  label="Program"
                                  value={`${studentDetail?.program_short_name} - ${studentDetail?.program_specialization_short_name}`}
                                />
                                <DisplayContent
                                  label="Current Year/Sem"
                                  value={`${studentDetail?.current_year}/${studentDetail?.current_sem}`}
                                />
                                <DisplayContent
                                  label="Academic Batch"
                                  value={studentDetail?.academic_batch}
                                />

                                <DisplayContent
                                  label="Nationality"
                                  value={studentDetail?.CountryName || "-"}
                                />
                                <DisplayContent
                                  label="Admission Category"
                                  value={`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}
                                />
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} mt={3}>
                      <Grid
                        container
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Grid item xs={12} md={8}>
                          <Typography
                            className={classes.textJustify}
                            sx={{ marginTop: "15px" }}
                          >
                            <b>
                              This letter is given for the purpose of passport.
                            </b>
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
                        <Grid
                          item
                          xs={12}
                          md={8}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2" fontSize="14px">
                            PRINCIPAL
                            <Typography variant="subtitle2" fontSize="14px">
                              AUTHORIZED SIGNATORY
                            </Typography>
                          </Typography>
                          <Typography paragraph pt={5}>
                            Prepared By -{" "}
                            {studentBonafideDetail[0]?.created_username || "-"}
                          </Typography>
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
          title=""
          width="100%"
          open={isPrintBonafideModalOpen}
          setOpen={() => handlePrintModal()}
        >
          <Box borderRadius={3}>
            {!!bonafidePdfPath && (
              <object
                className={popupclass.objectTag}
                data={bonafidePdfPath}
                type="application/pdf"
                height={600}
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
