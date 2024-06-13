import {
  Box,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
  Typography,
  IconButton,
  TableBody,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import FeeTemplateView from "../../../components/FeeTemplateView";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import axios from "../../../services/Api";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { makeStyles } from "@mui/styles";
import CustomModal from "../../../components/CustomModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
    },
  },
});

const initialValues = { postData: "", remarks: "" };

function PreScholarshipVerifierForm() {
  const [values, setValues] = useState(initialValues);
  const [feeTemplateId, setFeeTemplateId] = useState();
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [scholarshipData, setScholarshipData] = useState([]);
  const [showScholarship, setShowScholarship] = useState(false);
  const [total, setTotal] = useState();
  const [showTotal, setShowTotal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [verifiedTotal, setVerifiedTotal] = useState();
  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser")).userId;

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const classes = useStyles();

  const checks = {};
  const errorMessages = {};

  useEffect(() => {
    getCandidateDetails();
  }, [pathname]);

  useEffect(() => {
    // Calculating total verified amount of all year/sem
    let temp = 0;

    Object.values(values.postData).map((obj) => {
      const val = Object.values(obj).reduce((a, b) => {
        const x = Number(a) > 0 ? Number(a) : 0;
        const y = Number(b) > 0 ? Number(b) : 0;
        return x + y;
      });

      temp += val;
    });
    setVerifiedTotal(temp);

    // Verified amount validation
    if (handleVerifiedAmount() === false) {
      setAlertMessage({
        severity: "error",
        message: "Verified amount is more than approved amount !!!",
      });
      setAlertOpen(true);
    }
  }, [values.postData]);

  const getCandidateDetails = async () => {
    // fetching feeTemplateId
    const feetemplateId = await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Index", link: "/PreScholarshipVerifierIndex" },
          { name: res.data.data[0].candidate_name },
          { name: "Verify" },
        ]);
        setFeeTemplateId(res.data.data[0].fee_template_id);
        return res.data.data[0].fee_template_id;
      })
      .catch((err) => console.error(err));

    // fetching feeTemplateSubAmount
    const feeTemplateSubAmount = await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${feetemplateId}`)
      .then((res) => {
        setFeeTemplateSubAmountData(res.data.data);
        return res.data.data;
      })
      .catch((err) => console.error(err));

    // fetching feeTemplateData
    const feetemplateData = await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${feetemplateId}`)
      .then((res) => {
        setTotal(res.data.data[0].fee_year_total_amount);
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    // for fetching program is yearly or semester
    const programDetails = await axios
      .get(
        `/api/academic/FetchAcademicProgram/${feetemplateData.ac_year_id}/${feetemplateData.program_id}/${feetemplateData.school_id}`
      )
      .then((res) => {
        return res.data.data[0];
      })
      .catch((err) => console.error(err));

    //yearSem : No of year or sem of the particular program
    //yearValue : Maintaining the state of year or semwise values of 'values' usestate
    //showYearSem : Expanding to enter scholarship

    const yearSem = [];
    const yearValue = {};
    const showYearSem = {};

    if (feetemplateData.program_type_name.toLowerCase() === "yearly") {
      for (let i = 1; i <= programDetails.number_of_years; i++) {
        yearSem.push({ key: i.toString(), value: "Year " + i });
        yearValue["year" + i] = "";
        showYearSem["year" + i] = false;
      }
    } else if (feetemplateData.program_type_name.toLowerCase() === "semester") {
      for (let i = 1; i <= programDetails.number_of_semester; i++) {
        yearSem.push({ key: i.toString(), value: "Sem " + i });
        yearValue["year" + i] = "";
        showYearSem["year" + i] = false;
      }
    }

    setNoOfYears(yearSem);
    setShowScholarship(showYearSem);

    //temp : for updating initial values to the values usestate
    //tempSubAmount : updating year/sem amount to validate.
    // (scholarship amount should be less than fee template sub amount)

    const temp = {};
    const tempSubAmount = {};

    feeTemplateSubAmount.forEach((obj) => {
      temp[obj.voucher_head_new_id] = yearValue;
      const yearwiseAmt = {};
      yearSem.forEach((obj1) => {
        yearwiseAmt["year" + obj1.key] = obj["year" + obj1.key + "_amt"];
      });
      tempSubAmount[obj.voucher_head_new_id] = yearwiseAmt;
    });

    setValues((prev) => ({
      ...prev,
      ["postData"]: temp,
    }));

    setYearwiseSubAmount(tempSubAmount);

    //fetching scholarship data
    await axios
      .get(`/api/student/fetchscholarship/${id}`)
      .then((res) => {
        axios
          .get(
            `/api/student/fetchScholarship2/${res.data.data[0].scholarship_id}`
          )
          .then((res) => {
            setScholarshipData(res.data.data[0]);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleScholarship = (name) => {
    setShowScholarship((prev) => ({
      ...prev,
      [name]: showScholarship[name] === true ? false : true,
    }));
  };

  // validation checks
  Object.keys(values.postData).forEach((obj) => {
    Object.keys(values.postData[obj]).forEach((obj1) => {
      checks[obj1 + obj] = [/^[ 0-9]+$/.test(values.postData[obj][obj1])];
      errorMessages[obj1 + obj] = ["Invalid amount"];
    });
  });

  const handleChange = (e) => {
    if (e.target.name === "remarks") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      // splitName[0] : voucherHeadId
      // splitName[1] : textField name for example (year1,year2...)

      const splitName = e.target.name.split("-");

      setValues((prev) => ({
        ...prev,
        ["postData"]: {
          ...prev.postData,
          [splitName[0]]: {
            ...prev.postData[splitName[0]],
            [splitName[1]]:
              Number(e.target.value) >
              yearwiseSubAmount[splitName[0]][splitName[1]]
                ? yearwiseSubAmount[splitName[0]][splitName[1]]
                : e.target.value,
          },
        },
      }));
    }
  };

  const handleVerifiedAmount = () => {
    const verifiedTemp = {};
    noOfYears.forEach((obj) => {
      verifiedTemp["year" + obj.key] = Object.values(values.postData)
        .map((obj1) => obj1["year" + obj.key])
        .reduce((a, b) => {
          const x = Number(a) > 0 ? Number(a) : 0;
          const y = Number(b) > 0 ? Number(b) : 0;
          return x + y;
        });
    });

    const verifiedChecks = [];

    noOfYears.forEach((obj) => {
      if (
        verifiedTemp["year" + obj.key] >
        scholarshipData["year" + obj.key + "_amount"]
      ) {
        verifiedChecks.push(false);
      } else {
        verifiedChecks.push([true]);
      }
    });

    if (verifiedChecks.includes(false) === true) {
      return false;
    } else {
      return true;
    }
  };

  const handleCreate = async () => {
    const verify = async () => {
      const temp = [];

      //creating post api data format
      Object.keys(values.postData).forEach((obj) => {
        noOfYears.forEach((obj1) => {
          if (Number(values.postData[obj]["year" + obj1.key]) > 0) {
            temp.push({
              active: true,
              amount: values.postData[obj]["year" + obj1.key],
              scholarship_id: scholarshipData.scholarship_id,
              scholarship_year: Number(obj1.key),
              voucher_head_new_id: Number(obj),
            });
          }
        });
      });

      // fetching and updating scholarship status data based approved status id
      const updateData = await axios
        .get(
          `/api/student/scholarshipapprovalstatus/${scholarshipData.scholarship_approved_status_id}`
        )
        .then((res) => res.data.data)
        .catch((err) => console.error(err));

      updateData.verified_by = userId;
      updateData.is_verified = "yes";
      updateData.verified_date = new Date();
      updateData.verified_amount = verifiedTotal;
      updateData.verifier_remarks = values.remarks;

      noOfYears.forEach((obj) => {
        updateData["year" + obj.key + "_amount"] = Object.values(
          values.postData
        )
          .map((obj1) => obj1["year" + obj.key])
          .reduce((a, b) => {
            const x = Number(a) > 0 ? Number(a) : 0;
            const y = Number(b) > 0 ? Number(b) : 0;
            return x + y;
          });
      });

      // creating put api data format
      const scholarshipTemp = {};
      scholarshipTemp["sas"] = updateData;

      await axios
        .post(`/api/student/scholarshipHeadWiseAmountDetails`, temp)
        .then((res) => {})
        .catch((err) => console.error(err));

      await axios
        .put(
          `/api/student/updateScholarshipStatus/${scholarshipData.scholarship_id}`,
          scholarshipTemp
        )
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Scholarship verified successfully",
          });
          setAlertOpen(true);
          navigate("/PreGrantVerifyMaster", { replace: true });
        })
        .catch((err) => console.error(err));
    };

    setModalContent({
      title: "",
      message:
        verifiedTotal < scholarshipData.prev_approved_amount
          ? "Verified scholarship is not matching with approved scholarship, Do you want to continue ?"
          : "Do you want to submit ?",
      buttons: [
        { name: "Yes", color: "primary", func: verify },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Box component="form" p={1}>
        <FormPaperWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12}>
              {/* Fee template details  */}
              {feeTemplateId ? (
                <>
                  <Grid item xs={12}>
                    <FeeTemplateView feeTemplateId={feeTemplateId} type={1} />
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </Grid>

            {/* Fee template sub amount  &  pre scholarship */}
            <Grid item xs={12}>
              <TableContainer>
                <Table size="small" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell width="10%">
                        <Typography variant="subtitle2">Particulars</Typography>
                      </StyledTableCell>
                      {noOfYears.map((obj, i) => {
                        return (
                          <StyledTableCell
                            key={i}
                            align={
                              showScholarship["year" + obj.key] === true
                                ? "center"
                                : "right"
                            }
                            colSpan={
                              showScholarship["year" + obj.key] === true
                                ? 2
                                : ""
                            }
                          >
                            <Typography variant="subtitle2">
                              {obj.value}
                            </Typography>

                            {showScholarship["year" + obj.key] === true ? (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleScholarship("year" + obj.key)
                                }
                              >
                                <ArrowLeftIcon sx={{ color: "white" }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleScholarship("year" + obj.key)
                                }
                              >
                                <ArrowRightIcon sx={{ color: "white" }} />
                              </IconButton>
                            )}
                          </StyledTableCell>
                        );
                      })}
                      <StyledTableCell
                        align="center"
                        sx={{
                          borderRightStyle: showTotal === true ? "hidden" : "",
                        }}
                      >
                        <Typography variant="subtitle2">Total</Typography>

                        {showTotal === true ? (
                          <IconButton
                            size="small"
                            onClick={() => setShowTotal(!showTotal)}
                          >
                            <ArrowLeftIcon sx={{ color: "white" }} />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => setShowTotal(!showTotal)}
                          >
                            <ArrowRightIcon sx={{ color: "white" }} />
                          </IconButton>
                        )}
                      </StyledTableCell>
                      {showTotal === true ? (
                        <StyledTableCell align="center">
                          <Typography variant="subtitle2">Total</Typography>
                          <Typography variant="subtitle2">
                            Scholarship
                          </Typography>
                        </StyledTableCell>
                      ) : (
                        <></>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {feeTemplateSubAmountData.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <Typography variant="body2">
                              {obj.voucher_head + obj.voucher_head_new_id}
                            </Typography>
                          </TableCell>
                          {noOfYears.map((obj1, j) => {
                            return (
                              <>
                                <TableCell
                                  key={j}
                                  align="right"
                                  sx={{
                                    borderRightStyle:
                                      showScholarship["year" + obj1.key] ===
                                      true
                                        ? "hidden"
                                        : "",
                                  }}
                                >
                                  {obj["year" + obj1.key + "_amt"]}

                                  {/* textField Name : combinaton of voucherHeadId and year column */}
                                  {/* checks and error message : combination of year column and voucherHeadId */}
                                </TableCell>
                                {showScholarship["year" + obj1.key] === true ? (
                                  <TableCell width="10%">
                                    <CustomTextField
                                      name={
                                        obj.voucher_head_new_id +
                                        "-" +
                                        "year" +
                                        obj1.key
                                      }
                                      label=""
                                      value={
                                        values["postData"][
                                          obj.voucher_head_new_id
                                        ]["year" + obj1.key]
                                      }
                                      handleChange={handleChange}
                                      sx={{
                                        "& .MuiInputBase-root": {
                                          "& input": {
                                            textAlign: "right",
                                          },
                                        },
                                      }}
                                      checks={
                                        checks[
                                          "year" +
                                            obj1.key +
                                            obj.voucher_head_new_id
                                        ]
                                      }
                                      errors={
                                        errorMessages[
                                          "year" +
                                            obj1.key +
                                            obj.voucher_head_new_id
                                        ]
                                      }
                                    />
                                  </TableCell>
                                ) : (
                                  <></>
                                )}
                              </>
                            );
                          })}
                          <TableCell align="right">
                            <Typography variant="subtitle2" mb={1}>
                              {obj.total_amt}
                            </Typography>
                          </TableCell>
                          {showTotal === true ? (
                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                {Object.values(values.postData).length > 0
                                  ? Object.values(
                                      values.postData[obj.voucher_head_new_id]
                                    ).reduce((a, b) => {
                                      const x = Number(a) > 0 ? Number(a) : 0;
                                      const y = Number(b) > 0 ? Number(b) : 0;
                                      return x + y;
                                    })
                                  : 0}
                              </Typography>
                            </TableCell>
                          ) : (
                            <></>
                          )}
                        </TableRow>
                      );
                    })}
                    {/* total template amount */}
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">Total</Typography>
                      </TableCell>
                      {noOfYears.map((obj, i) => {
                        return (
                          <>
                            <TableCell
                              key={i}
                              align="right"
                              sx={{
                                borderRightStyle:
                                  showScholarship["year" + obj.key] === true
                                    ? "hidden"
                                    : "",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {feeTemplateSubAmountData.length > 0 ? (
                                  feeTemplateSubAmountData[0][
                                    "fee_year" + obj.key + "_amt"
                                  ]
                                ) : (
                                  <></>
                                )}
                              </Typography>
                            </TableCell>
                            {showScholarship["year" + obj.key] === true ? (
                              <TableCell width="10%" align="right">
                                <Typography variant="subtitle2">
                                  {Object.values(values["postData"])
                                    .map((obj1) => obj1["year" + obj.key])
                                    .reduce((a, b) => {
                                      const x = Number(a) > 0 ? Number(a) : 0;
                                      const y = Number(b) > 0 ? Number(b) : 0;
                                      return x + y;
                                    })}
                                </Typography>
                              </TableCell>
                            ) : (
                              <></>
                            )}
                          </>
                        );
                      })}

                      <TableCell align="right">
                        <Typography variant="subtitle2">{total}</Typography>
                      </TableCell>
                      {showTotal === true ? (
                        <TableCell align="right">
                          <Typography variant="subtitle2">
                            {verifiedTotal}
                          </Typography>
                        </TableCell>
                      ) : (
                        <></>
                      )}
                    </TableRow>

                    {/* Verify scholarship */}
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">
                          Verified Scholarship
                        </Typography>
                      </TableCell>
                      {noOfYears.map((obj, i) => {
                        return (
                          <TableCell
                            key={i}
                            align="right"
                            colSpan={
                              showScholarship["year" + obj.key] === true
                                ? 2
                                : ""
                            }
                          >
                            <Typography variant="subtitle2">
                              {Object.values(values["postData"])
                                .map((obj1) => obj1["year" + obj.key])
                                .reduce((a, b) => {
                                  const x = Number(a) > 0 ? Number(a) : 0;
                                  const y = Number(b) > 0 ? Number(b) : 0;
                                  return x + y;
                                })}
                            </Typography>
                          </TableCell>
                        );
                      })}
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle2" align="right">
                          {verifiedTotal}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* Approved scholarship  */}
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">
                          Approved Pre Scholarship
                        </Typography>
                      </TableCell>
                      {noOfYears.map((obj, i) => {
                        return (
                          <TableCell
                            key={i}
                            align="right"
                            colSpan={
                              showScholarship["year" + obj.key] === true
                                ? 2
                                : ""
                            }
                          >
                            <Typography variant="subtitle2">
                              {scholarshipData["year" + obj.key + "_amount"]
                                ? scholarshipData["year" + obj.key + "_amount"]
                                : 0}
                            </Typography>
                          </TableCell>
                        );
                      })}
                      <TableCell align="right" colSpan={2}>
                        <Typography variant="subtitle2">
                          {scholarshipData.prev_approved_amount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
                multiline
                rows={3}
                checks={checks.remarks}
                errors={errorMessages.remarks}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={
                  !handleVerifiedAmount() ||
                  verifiedTotal <= 0 ||
                  values.remarks === ""
                }
              >
                verify
              </Button>
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default PreScholarshipVerifierForm;
