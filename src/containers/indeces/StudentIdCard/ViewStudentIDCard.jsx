import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import { StudentIdCardPrint } from "./StudentIdCardPrint";
import { GenerateIdCard } from "./GenerateIdCard";
import { makeStyles } from "@mui/styles";
import JsBarcode from "jsbarcode";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import PrintIcon from "@mui/icons-material/Print";
import templateList from "./SchoolImages";

const idCardImageStyles = makeStyles((theme) => ({
  idCardimage: {
    height: "370px",
    width: "230px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  userImage: {
    top: "85px",
    left: "75px",
    width: "80px",
    height: "85px",
    position: "absolute",
  },
  userName: {
    top: "178px",
    position: "absolute",
    width: "186px",
    marginHorizontal: "auto",
    left: "20px",
    color: "#000",
    fontFamily: "Roboto",
    fontSize: "10px !important",
    fontWeight: "600 !important",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  userDisplayName: {
    width: "150px",
    top: "38px",
    position: "absolute",
    marginHorizontal: "auto",
    color: "#000",
    fontFamily: "Roboto",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  studentDetail: {
    position: "absolute",
    width: "190px",
    marginHorizontal: "auto",
    left: "20px",
    fontSize: "10px !important",
    fontWeight: "500 !important",
    color: "#2e2d2d",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  studentUsn: {
    position: "absolute",
    width: "200px",
    marginHorizontal: "auto",
    left: "16px",
    fontFamily: "Roboto",
    fontSize: "10px !important",
    fontWeight: "600 !important",
    color: "#000",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  studentValidTillDateMain: {
    position: "absolute",
    width: "200px",
    marginHorizontal: "auto",
    left: "20px",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  studentValidTillDate: {
    position: "absolute",
    fontSize: "8px !important",
    fontWeight: "500 !important",
    color: "#000",
    fontFamily: "Roboto",
    textTransform: "uppercase",
  },
}));

const initialState = {
  studentList: [],
  schoolId: null,
  loading: false,
  isIdCardModalOpen: false,
  IdCardPdfPath: null,
};

const getTemplate = (school_name_short) => {
  return templateList.find((obj) => obj.school_name_short === school_name_short)?.src;
};

const ViewStaffIdCard = () => {
  const [state, setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const IdCard = idCardImageStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Student ID Card", link: "/StudentIdCard" },
      { name: "View" },
    ]);
    setState((prevState) => ({
      ...prevState,
      studentList: location?.state,
    }));
  }, []);
  
  const generateBarcodeDataUrl = (value) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      width: 0.9,
      height: 25,
      fontSize: 10,
      displayValue: false,
    });
    return canvas.toDataURL("image/png");
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handlePrintModal = () => {
    setState((prevState) => ({
      ...prevState,
      isIdCardModalOpen: !state.isIdCardModalOpen,
      IdCardPdfPath: "",
    }));
  };

  const printIdCard = async () => {
    setLoading(true);
    let updatedStudentList = [];
    try {
        for (const student of state.studentList) {
        if (!!student?.studentImagePath) {
          const studentImageResponse = await axios.get(
            `/api/student/studentImageDownload?student_image_attachment_path=${student.studentImagePath}`,
            { responseType: "blob" }
          );
          if (!!studentImageResponse) {
            updatedStudentList.push({
              ...student,
              studentImagePath: URL.createObjectURL(studentImageResponse?.data),
            });
          }
        }
      }
          if (!!updatedStudentList.length) {
            generateStudentIdCard(updatedStudentList);
          }
        setLoading(false);
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
        setLoading(false);
      }
  };

  const chunkArrayInGroups = (arr, size) => {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size));
    }
    return myArray;
  };

  const generateStudentIdCard = async (updatedStudentList) => {
    const chunksArr = chunkArrayInGroups(updatedStudentList, 9);
    const idCardResponse = await GenerateIdCard(chunksArr);
    if (!!idCardResponse) {
      setState((prevState) => ({
        ...prevState,
        IdCardPdfPath: URL.createObjectURL(idCardResponse),
        isIdCardModalOpen: !state.isIdCardModalOpen,
      }));
      if (searchParams.get("tabId") == 1) removeStudentAfterPrintIDCard();
    }
  };

  const removeStudentAfterPrintIDCard = async () => {
    let empForRemove = state.studentList.map((el) => ({
      studentId: el.studentId,
      validTill: el.validTillDate,
      currentYear: el.currentSem,
      active: true,
    }));
    try {
      await axios.post(
        `/api/student/studentIdCardCreationWithHistory`,
        empForRemove
      );
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response ? error.response.data.message : "Error",
      });
      setAlertOpen(true);
    }
  };

  const renderSupName = (year,supValue) => {
     return <span>{year}<sup>{supValue}</sup> YEAR</span>
  }

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            disableElevation
            disabled={!state.studentList.length}
            onClick={printIdCard}
          >
            {!!state.loading ? (
              <CircularProgress
                size={15}
                color="inherit"
                style={{ margin: "5px" }}
              />
            ) : (
              <PrintIcon />
            )}
            &nbsp;&nbsp; Print
          </Button>
        </div>
        {!!state.studentList.length && (
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 3 }}>
            {state.studentList?.map((obj, i) => {
              return (
                <Grid item sm={12} md={3} key={i}>
                  <div style={{ position: "relative" }}>
                    {!!obj.schoolId && (
                      <img
                        src={getTemplate(obj?.schoolNameShort)}
                        className={IdCard.idCardimage}
                      />
                    )}
                    <Typography
                      className={IdCard.userDisplayName}
                      style={
                        obj.displayName.length > 32
                          ? { left: "72px" }
                          : { left: "68px" }
                      }
                    >
                      {obj.displayName}
                    </Typography>
                    <img
                      src={obj?.studentBlobImagePath}
                      className={IdCard.userImage}
                    />
                    <Typography className={IdCard.userName}>
                      {obj.studentName}
                    </Typography>
                    <Typography
                      className={IdCard.studentDetail}
                      style={
                        obj.studentName?.length > 28
                          ? { marginTop: "15px", top: "192px"}
                          : { marginTop: "0x", top: "192px"}
                      }
                    >
                      {obj.currentYear == 1
                        ? "1st YEAR"
                        : obj.currentYear == 2
                        ? "2nd YEAR"
                        : obj.currentYear == 3
                        ? "3rd YEAR"
                        : obj.currentYear == 4
                        ? "4th YEAR"
                        : obj.currentYear == 5
                        ? "5th YEAR"
                        : obj.currentYear == 6
                        ? "6th YEAR"
                        : obj.currentYear == 7
                        ? "7th YEAR"
                        : obj.currentYear == 8
                        ? "8th YEAR"
                        : obj.currentYear == 9
                        ? "9th YEAR"
                        : obj.currentYear == 10
                        ? "10th YEAR"
                        : ""}
                    </Typography>
                    <Typography
                      className={IdCard.studentDetail}
                      style={
                        obj.studentName?.length > 28
                          ? { marginTop: "13px", top: "210px",textTransform:"uppercase"}
                          : { marginTop: "0px", top: "210px",textTransform:"uppercase"}
                      }
                    >
                      {obj.programWithSpecialization}
                    </Typography>
                    <Typography
                      className={IdCard.studentDetail}
                      style={
                        obj.studentName?.length > 28
                          ? { marginTop: "15px", top: "226px" }
                          : obj.programWithSpecialization.length > 28 ? {top: "240px" }: { marginTop: "0px", top: "226px" }
                      }
                    >
                      {obj.auid}
                    </Typography>
                    <Typography
                      className={IdCard.studentUsn}
                      style={
                        obj.studentName?.length > 28
                          ? { marginTop: "15px", top: "242px" }
                          : obj.programWithSpecialization.length > 28 ? {top: "250px" }: { marginTop: "0px", top: "242px" }
                      }
                    >
                      {obj.usn}
                    </Typography>
                    <div
                      style={
                        obj.studentName?.length > 28
                          ? {
                              position: "absolute",
                              top: "253px",
                              left: "35px",
                              marginTop: "15px",
                            }
                          : obj.programWithSpecialization.length > 28 ? {position: "absolute",
                            top: "253px",
                            left: "35px",
                            marginTop: "12px",}: {
                              position: "absolute",
                              top: "253px",
                              left: "30px",
                              marginTop: "0px",
                            }
                      }
                    >
                      <img src={generateBarcodeDataUrl(obj.auid)} />
                    </div>
                    <div
                      className={IdCard.studentValidTillDateMain}
                      style={
                        obj.studentName?.length > 28
                          ? { marginTop: "15px", top: "300px" }
                          : obj.programWithSpecialization.length > 28 ? {marginTop: "12px", top: "300px"}: { marginTop: "0px", top: "300px" }
                      }
                    >
                      <Typography
                        className={IdCard.studentValidTillDate}
                        style={{ left: "55px" }}
                      >
                        Valid Till :
                      </Typography>
                      <Typography
                        className={IdCard.studentValidTillDate}
                        style={{ left: "104px" }}
                      >
                        {obj.validTillDate}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        )}

        {!!state.isIdCardModalOpen && (
          <ModalWrapper
            title="Student ID Card"
            maxWidth={800}
            open={state.isIdCardModalOpen}
            setOpen={() => handlePrintModal()}
          >
            <StudentIdCardPrint
              state={state}
              handlePrintModal={handlePrintModal}
            />
          </ModalWrapper>
        )}
      </Box>
    </>
  );
};

export default ViewStaffIdCard;
