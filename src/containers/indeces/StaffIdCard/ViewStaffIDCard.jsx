import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import ModalWrapper from "../../../components/ModalWrapper";
import { StaffIdCardPrint } from "./StaffIdCardPrint";
import StaffIdCard from "../../../assets/staff_new_id_card.jpg";
import { GenerateIdCard } from "./GenerateIdCard";
import { makeStyles } from "@mui/styles";
import JsBarcode from "jsbarcode";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import PrintIcon from "@mui/icons-material/Print";

const idCardImageStyles = makeStyles((theme) => ({
  idCardimage: {
    height: "320px",
    width: "220px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  userImage: {
    top: "90px",
    position: "absolute",
    width: "50px",
    height: "55px",
    left:"80px",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  userName: {
    top: "148px",
    position: "absolute",
    width: "175px",
    marginHorizontal: "auto",
    left: "16px",
    fontSize: "11px !important",
    fontWeight:"500 !important",
    color: "#000",
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    textTransform: "uppercase",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  userDesignation: {
    top: "164px",
    position: "absolute",
    width: "200px",
    marginHorizontal: "auto",
    left: "5px",
    fontSize: "10px !important",
    color: "#4d4d33",
    fontFamily: "Roboto",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  userDepartment: {
    top: "178px",
    position: "absolute",
    width: "190px",
    marginHorizontal: "auto",
    left: "10px",
    fontSize: "10px !important",
    color: "#4d4d33",
    fontFamily: "Roboto",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  userCode: {
    top: "192px",
    position: "absolute",
    width: "200px",
    marginHorizontal: "auto",
    left: "5px",
    fontSize: "10px !important",
    color: "#4d4d33",
    fontFamily: "Roboto",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  schoolDisplayName: {
    position: "absolute",
    width: "200px",
    marginHorizontal: "auto",
    left: "10px",
    fontSize: "11px !important",
    color: "#ffff",
    fontFamily: "Roboto",
    textTransform: "uppercase",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
}));

const initialState = {
  staffList: [],
  loading: false,
  isIdCardModalOpen: false,
  IdCardPdfPath: null,
};

const ViewStaffIdCard = () => {
  const [state, setState] = useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const IdCard = idCardImageStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(()=>{
    setCrumbs([
      { name: "Staff ID Card", link: "/StaffIdCard" },
      { name: "View" },
    ]);
  },[]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      staffList: location?.state,
    }));
  }, []);

  const generateBarcodeDataUrl = (value) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      width: 0.9,
      height: 30,
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

  const printStaffIdCard = async () => {
    setLoading(true);
    const selectedStaff = state.staffList.filter((el) => !!el.empcode);
    let updatedStaffList = [];
    try {
        for (const staff of selectedStaff) {
        if (!!staff?.emp_image_attachment_path) {
          const staffImageResponse = await axios.get(
            `/api/employee/employeeDetailsImageDownload?emp_image_attachment_path=${staff.emp_image_attachment_path}`,
            { responseType: "blob" }
          );
          if (!!staffImageResponse) {
            updatedStaffList.push({
              ...staff,
              staffImagePath: URL.createObjectURL(staffImageResponse?.data),
            });
          }
        }
      }
          if (!!updatedStaffList.length) {
            generateStaffIdCard(updatedStaffList);
          }
        setLoading(false);
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
    }
  };

  const generateStaffIdCard = async (updatedStaffList) => {
    const idCardResponse = await GenerateIdCard(updatedStaffList);
    if (!!idCardResponse) {
      setState((prevState) => ({
        ...prevState,
        IdCardPdfPath: URL.createObjectURL(idCardResponse),
        isIdCardModalOpen: !state.isIdCardModalOpen,
      }));
      if((searchParams.get('tabId')==1)) removeEmpAfterPrintIDCard();
    }
  };

  const removeEmpAfterPrintIDCard = async () => {
    let empForRemove = state.staffList.map((el) => ({
      empId: el.emp_id,
      active: true,
    }));
    try {
      await axios.post(
        `/api/employee/employeeIdCardCreationWithHistory`,
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

  const IDCardView = ({obj}) => (
    <div style={{ position: "relative" }}>
    <img src={StaffIdCard} className={IdCard.idCardimage}/>
    <img
      src={obj?.staffImagePath}
      className={IdCard.userImage}
    />
    <Typography className={IdCard.userName}>
      {`${
        obj?.phd_status !== null && obj?.phd_status === "holder"
          ? "Dr. "
          : ""
      }${obj?.employee_name}`}
    </Typography>
    <Typography
      className={IdCard.userDesignation}
      style={
        obj?.employee_name?.length >= 25
          ? { marginTop: "17px" }
          : { marginTop: "0x" }
      }
    >
      {obj?.designation_name}
    </Typography>
    <Typography
      className={IdCard.userDepartment}
      style={
        obj?.employee_name?.length >= 25
          ? { marginTop: "15px" }
          : { marginTop: "0px" }
      }
    >
      {obj?.dept_name}
    </Typography>
    <Typography
      className={IdCard.userCode}
      style={
        obj?.employee_name?.length >= 25
          ? { marginTop: "15px" }
          : obj?.dept_name?.length > 28 ? { marginTop: "15px" }: { marginTop: "0px" }
      }
    >
      {obj?.empcode}
    </Typography>
    <Typography
      className={IdCard.schoolDisplayName}
      style={
        obj?.display_name?.length > 31
          ? { top: "286px" }
          : { top: "292px" }
      }
    >
      {obj?.display_name}
    </Typography>
    <div
      style={{
        position: "absolute",
        top: "230px"
      }}
    >
      <img src={generateBarcodeDataUrl(obj?.empcode)} />
    </div>
  </div>
  )

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
            disabled={!state.staffList.length}
            onClick={printStaffIdCard}
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
        {!!state.staffList.length && (
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 3 }}>
            {state.staffList?.map((obj, index) => {
             return (
                <Grid item sm={12} md={3} key={`${index}-${new Date()}`}>
                  <IDCardView obj={obj}/>
                </Grid>
               );
            })}
          </Grid>
        )}

        {!!state.isIdCardModalOpen && (
          <ModalWrapper
            title="Staff ID Card"
            maxWidth={800}
            open={state.isIdCardModalOpen}
            setOpen={() => handlePrintModal()}
          >
            <StaffIdCardPrint
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
