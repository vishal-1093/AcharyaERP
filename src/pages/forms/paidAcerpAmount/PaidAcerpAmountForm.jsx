import { useState, lazy, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
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
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput")
);
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: "100%",
    margin: "20px 0",
  },
  tableBody: {
    height: 10,
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
  table: {
    "& .MuiTableCell-root": {
      minWidth: 100,
      border: "1px solid rgba(192,192,192,1)",
      fontSize: "15px",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: "50px",
    },
  },
}));

const initialState = {
  auid: "",
  auidValue: "",
  paidType: "Fee Paid",
  loading: false,
  studentDetail: [],
  acerpAmountList: null,
  keysToSum: [],
  remarks: "",
  amountLoading: false,
  waiverAttachment: "",
};

const requiredAttachmentFields = ["waiverAttachment"];

const PaidAcerpAmountForm = () => {
  const [
    {
      auid,
      auidValue,
      paidType,
      loading,
      studentDetail,
      acerpAmountList,
      keysToSum,
      remarks,
      amountLoading,
      waiverAttachment,
    },
    setState,
  ] = useState(initialState);
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    if (!!location.state && !!location.state?.auid) {
      getStudentDetailByAuid(
        location.state?.auid,
        location.state?.type,
        "created"
      );
    }
    setCrumbs([
      { name: "ACERP Amount", link: "/ACERPAmountIndex" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
  }, []);

  const checksAttachment = {
    waiverAttachment: [
      paidType === "Waiver" && waiverAttachment !== "",
      waiverAttachment && waiverAttachment?.name.endsWith(".pdf"),
      waiverAttachment?.size < 2000000,
    ],
  };

  const errorAttachmentMessages = {
    waiverAttachment: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "paidType") {
      setState((prevState) => ({
        ...prevState,
        studentDetail: [],
        acerpAmountList: null,
        remarks: "",
        waiverAttachment: "",
        [name]: value,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === "+" || event.key === "e") {
      event.preventDefault();
    }
  };

  const handleChangeFormField = (e, i) => {
    if (studentDetail.length > 0) {
      let { name, value } = e.target;
      const onChangeReqVal = JSON.parse(
        JSON.stringify(studentDetail[0].amountList)
      );
      onChangeReqVal[i][name] = !!value ? Number(value) : value;
      setState((prev) => ({
        ...prev,
        studentDetail: studentDetail.map((el) => ({
          ...el,
          amountList: onChangeReqVal,
        })),
      }));
      isFormValid();
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const checkCreatedOrNot = async (auid, paidType) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/student/checkAuidWithFeeTypeIsAlreadyPresentOrNot?auid=${auid}&type=${paidType}`
      );
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        getStudentDetailByAuid(auid, paidType, "notCreated");
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

  const getStudentDetailByAuid = async (auid, paidType, status) => {
    try {
      const res = await axios.get(`/api/student/studentDetailsByAuid/${auid}`);
      if (res.status === 200 || res.status === 201) {
        const amountList = Array.from(
          { length: res.data.data[0]?.number_of_semester },
          (_, i) => ({
            id: i + 1,
            acerpAmount: 0,
            amount: null,
          })
        );
        const newAmountList = amountList.filter((obj) =>
          res.data.data[0]?.program_type_name === "Yearly" ? obj.id % 2 : obj
        );
        const allKeysToSum = Array.from(
          { length: res.data.data[0]?.number_of_semester },
          (_, i) => `paidYear${i + 1}`
        );
        setState((prevState) => ({
          ...prevState,
          auidValue: auid ? auid : location.state?.auid,
          loading: false,
          acerpAmountList: null,
          keysToSum: allKeysToSum,
          studentDetail: res.data.data?.map((obj) => ({
            ...obj,
            amountList: newAmountList,
          })),
        }));
        if (status == "created")
          getAcerpAmountByAuid(auid, paidType, res.data.data, newAmountList);
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

  const getAcerpAmountByAuid = async (
    auid,
    paidType,
    studentData,
    amountList
  ) => {
    try {
      const res = await axios.get(
        `/api/student/getAcerpAmountByAuid?auid=${auid}&type=${paidType}`
      );
      if (res?.status === 200 || res?.status === 201) {
        if (!!res.data.data) {
          const updatedAmountList = amountList.map((ele, index) => {
            if (!!res.data.data && res.data.data[`paidYear${ele.id}`]) {
              return {
                ...ele,
                acerpAmount: Number(`${res.data.data[`paidYear${ele.id}`]}`),
                amount: Number(`${res.data.data[`paidYear${ele.id}`]}`),
              };
            }
            return ele;
          });

          setState((prevState) => ({
            ...prevState,
            loading: false,
            acerpAmountList: res?.data?.data,
            remarks: res?.data?.data?.remarks,
            paidType: res?.data?.data?.type,
            studentDetail: studentData?.map((obj) => ({
              ...obj,
              amountList: updatedAmountList,
            })),
          }));
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
      setLoading(false);
    }
  };

  const totalAmount =
    !!keysToSum.length &&
    keysToSum.reduce((sum, current) => {
      if (!!acerpAmountList) return sum + acerpAmountList[current];
    }, 0);

  const setAmountLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      amountLoading: val,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    setState((prevState) => ({
      ...prevState,
      [name]: newFile,
    }));
  };

  const handleFileRemove = (name) => {
    setState((prevState) => ({
      ...prevState,
      [name]: null,
    }));
  };

  const isAttachmentValid = () => {
    for (let i = 0; i < requiredAttachmentFields.length; i++) {
      const field = requiredAttachmentFields[i];
      if (Object.keys(checksAttachment).includes(field)) {
        const ch = checksAttachment[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const isFormValid = () => {
    const isValid = studentDetail[0]?.amountList.find(
      (el) => !!el.amount
    )?.amount;
    if (!!isValid) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = async () => {
    try {
      setAmountLoading(true);
      const paidYear = studentDetail[0]?.amountList.reduce(
        (acc, item, index) => {
          acc[`paidYear${item.id}`] = +Number(item.amount).toFixed(1);
          return acc;
        },
        {}
      );
      let payload = {
        type: paidType,
        auid: studentDetail[0]?.auid,
        studentId: studentDetail[0]?.student_id,
        remarks: remarks,
        active: true,
      };
      const finalPayload = { ...payload, ...paidYear };
      if (!!acerpAmountList?.acerpAmountId) {
        const res = await axios.put(
          "/api/student/updateAcerpAmountPartially",
          finalPayload
        );
        if (res.status == 200 || res.status == 201) {
          if (paidType === "Waiver" && !!waiverAttachment) {
            handleFileUpload(
              waiverAttachment,
              acerpAmountList?.acerpAmountId,
              "update"
            );
          } else {
            actionAfterResponse(res, "update");
          }
        }
      } else {
        const res = await axios.post(
          "/api/student/createAcerpAmount",
          finalPayload
        );
        if (res.status === 200 || res.status === 201) {
          if (paidType === "Waiver" && !!waiverAttachment) {
            handleFileUpload(
              waiverAttachment,
              res?.data?.data?.acerpAmountId,
              "create"
            );
          } else {
            actionAfterResponse(res, "create");
          }
        }
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response
          ? err.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setAmountLoading(false);
    }
  };

  const handleFileUpload = async (attachment, acerpAmountId, methodType) => {
    if (!!attachment && !!acerpAmountId) {
      try {
        const waiverAttachmentFile = new FormData();
        waiverAttachmentFile.append("acerpAmountId", acerpAmountId);
        waiverAttachmentFile.append("file", waiverAttachment);
        const res = await axios.post(
          "/api/student/acerpAmountUploadFile",
          waiverAttachmentFile
        );
        actionAfterResponse(res, methodType);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured !!",
        });
        setAlertOpen(true);
        setAmountLoading(false);
      }
    }
  };

  const actionAfterResponse = (res, methodType) => {
    if (res.status === 200 || res.status === 201) {
      navigate("/AcerpAmountIndex");
      setAlertMessage({
        severity: "success",
        message: `Acerp amount ${
          methodType == "update" ? "updated" : "created"
        } successfully !!`,
      });
    } else {
      setAlertMessage({ severity: "error", message: "Error Occured !!" });
    }
    setAlertOpen(true);
    setAmountLoading(false);
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      {!location.state && (
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, md: 4 }}
          alignItems="center"
          marginBottom={2}
        >
          <Grid item xs={12} md={3}>
            <CustomRadioButtons
              name="paidType"
              label="Pay Type"
              value={paidType}
              items={[
                { value: "Waiver", label: "Waiver" },
                { value: "Fee Paid", label: "Fee Paid" },
              ]}
              handleChange={handleChange}
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
              onClick={() => checkCreatedOrNot(auid, paidType)}
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
      )}

      {!!(auidValue && studentDetail.length > 0) && (
        <div>
          <StudentDetails id={auidValue} />
        </div>
      )}

      {/* ACERP amount,added and deducted ui */}
      {!!(studentDetail.length && studentDetail[0].amountList.length) && (
        <Grid container>
          <Grid item xs={12} md={12}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table
                size="small"
                aria-label="simple table"
                style={{ width: "100%" }}
              >
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white" }}>#</TableCell>
                    {studentDetail.length > 0 &&
                      studentDetail[0].amountList?.map((obj, index) => (
                        <TableCell sx={{ color: "white" }} key={index}>
                          {`Sem ${obj.id}`}
                        </TableCell>
                      ))}
                    <TableCell sx={{ color: "white" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">ACERP Amount</Typography>
                    </TableCell>
                    {studentDetail.length > 0 &&
                      studentDetail[0].amountList?.map((obj, index) => (
                        <TableCell key={index}>
                          <Typography variant="subtitle2">
                            {obj.acerpAmount}
                          </Typography>
                        </TableCell>
                      ))}
                    <TableCell>
                      <Typography variant="subtitle2">
                        {!!totalAmount ? totalAmount : 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">Amount</Typography>
                    </TableCell>
                    {studentDetail.length > 0 &&
                      studentDetail[0].amountList?.map((obj, index) => (
                        <TableCell key={index}>
                          <Typography variant="subtitle2">
                            <CustomTextField
                              name="amount"
                              label=""
                              value={obj.amount}
                              onKeyDown={handleKeyDown}
                              handleChange={(e) =>
                                handleChangeFormField(e, index)
                              }
                              type="number"
                            />
                          </Typography>
                        </TableCell>
                      ))}
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Grid
                container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "30px",
                  padding: "20px 10px",
                }}
              >
                <Grid item xs={12} md={3}>
                  <CustomTextField
                    name="remarks"
                    label="Remarks"
                    value={remarks}
                    handleChange={handleChange}
                    required
                    multiline
                    rows={3}
                  />
                </Grid>
                {paidType === "Waiver" && (
                  <Grid item xs={12} md={3}>
                    <CustomFileInput
                      name="waiverAttachment"
                      label="Pdf File Attachment"
                      helperText="PDF - smaller than 2 MB"
                      file={waiverAttachment || ""}
                      handleFileDrop={handleFileDrop}
                      handleFileRemove={handleFileRemove}
                      checks={checksAttachment.waiverAttachment}
                      errors={errorAttachmentMessages.waiverAttachment}
                      required
                    />
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    disabled={
                      amountLoading ||
                      !paidType ||
                      !remarks ||
                      (paidType == "Waiver" &&
                        !isAttachmentValid() &&
                        !acerpAmountList?.acerpAmountAttachPath) ||
                      !isFormValid()
                    }
                    onClick={onSubmit}
                  >
                    {amountLoading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>
                        {!!acerpAmountList?.acerpAmountId ? "Update" : "Submit"}
                      </strong>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PaidAcerpAmountForm;
