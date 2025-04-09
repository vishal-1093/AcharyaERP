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
    top: "114px",
    left: "80px",
    width: "80px",
    height: "85px",
    position: "absolute",
  },
  userName: {
    top: "203px",
    position: "absolute",
    width: "186px",
    marginHorizontal: "auto",
    left: "28px",
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
    fontSize: "11px !important",
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
    left: "25px",
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
  studentBlockName: {
    position: "absolute",
    width: "200px",
    marginHorizontal: "auto",
    left: "18px",
    color: "#2e2d2d",
    fontFamily: "Roboto",
    fontSize: "14px !important",
    fontWeight: "500 !important",
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
    left: "20px",
    fontFamily: "Roboto",
    fontSize: "11px !important",
    fontWeight: "500 !important",
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
  return templateList.find((obj) => obj.school_name_short === school_name_short)
    ?.src;
};

const ViewHostelStudentIdCard = () => {
  const [state, setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const IdCard = idCardImageStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "ID Card"},
      { name: "Hostel", link: "/HostelStudentIdCard" },
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
        if (!!student?.studentImagePath && !!student?.fromDate) {
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
      removeStudentAfterPrintIDCard();
    }
  };

  const removeStudentAfterPrintIDCard = async () => {
    let empForRemove = state.studentList.map((el) => ({
      hostelBedAssignmentId: el.id,
      fromDate: el.fromDate,
      studentId: el.studentId,
      active: true,
    }));
    try {
      const res = await axios.put(
        `/api/hostel/updateHostelIdCard/${state.studentList.map(ele=>ele.id).join(", ")}`,
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
      </Box>

      <Box component="form" overflow="hidden" p={1}>
        {!!state.studentList.length && (
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 3 }}>
            {state.studentList?.map((obj, i) => {
              return (
                <Grid item sm={12} md={3} key={i}>
                  <div style={{ position: "relative" }}>
                    {!!obj.schoolId && (
                      <img
                        src={getTemplate("AIT")}
                        className={IdCard.idCardimage}
                      />
                    )}
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
                          ? { marginTop: "15px", top: "217px" }
                          : { marginTop: "0x", top: "217px" }
                      }
                    >
                      {obj.currentYear == 1
                        ? `1ST YEAR`
                        : obj.currentYear == 2
                        ? `2ND YEAR`
                        : obj.currentYear == 3
                        ? `3RD YEAR`
                        : obj.currentYear == 4
                        ? `4TH YEAR`
                        : obj.currentYear == 5
                        ? `5TH YEAR`
                        : obj.currentYear == 6
                        ? `6TH YEAR`
                        : obj.currentYear == 7
                        ? `7TH YEAR`
                        : obj.currentYear == 8
                        ? `8TH YEAR`
                        : obj.currentYear == 9
                        ? `9TH YEAR`
                        : obj.currentYear == 10
                        ? `10TH YEAR`
                        : ""}
                    </Typography>
                    <Typography
                      className={IdCard.studentDetail}
                      style={
                        obj.studentName?.length > 28
                          ? {
                              marginTop: "13px",
                              top: "232px",
                              textTransform: "uppercase",
                            }
                          : {
                              marginTop: "0px",
                              top: "232px",
                              textTransform: "uppercase",
                            }
                      }
                    >
                      {obj.auid}
                    </Typography>
                    <Typography
                      className={IdCard.studentUsn}
                      style={
                        obj.studentName?.length > 28
                          ? { marginTop: "15px", top: "247px" }
                          : { marginTop: "0px", top: "247px" }
                      }
                    >
                      {obj?.bedName} &nbsp;{!!obj?.foodStatus && <span style={obj.foodStatus?.toLowerCase() == "veg" ? {width:"10px",height:"10px",borderRadius:"50%",backgroundColor:"green"}:{width:"10px",height:"10px",borderRadius:"50%",backgroundColor:"red"}}></span>}
                    </Typography>
                     <div
                      style={
                        obj.studentName?.length > 28
                          ? {
                              position: "absolute",
                              top: "260px",
                              left: "35px",
                              marginTop: "15px",
                            }
                          : {
                              position: "absolute",
                              top: "260px",
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
                          ? { marginTop: "25px", top: "293px" }
                          : { marginTop: "10px", top: "293px" }
                      }
                    >
                      <Typography
                        className={IdCard.studentValidTillDate}
                        style={{ left: "44px" }}
                      >
                        Vacate Date :
                      </Typography>
                      <Typography
                        className={IdCard.studentValidTillDate}
                        style={{ left: "108px" }}
                      >
                        {obj.vacateDate}
                      </Typography>
                    </div>
                    <Typography
                      className={IdCard.studentBlockName}
                      style={
                        obj.studentName?.length > 28
                          ? { marginTop: "8px", top: "316px",textTransform: "uppercase", }
                          : obj.blockName?.length > 25 ?
                           { marginTop: "0px", top: "316px",textTransform: "uppercase", }:
                           { marginTop: "0px", top: "325px",textTransform: "uppercase", }
                      }
                    >
                      {obj.blockName}
                    </Typography>
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

export default ViewHostelStudentIdCard;
