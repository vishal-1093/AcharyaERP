import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  tableCellClasses,
  Button,
} from "@mui/material";
import FeeTemplateView from "../../../components/FeeTemplateView";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
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

function PreScholarshipVerifierForm() {
  const [values, setValues] = useState({ postData: "" });
  const [feeTemplateId, setFeeTemplateId] = useState();
  const [noOfYears, setNoOfYears] = useState([]);
  const [feeTemplateSubAmountData, setFeeTemplateSubAmountData] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState([]);
  const [scholarshipData, setScholarshipData] = useState([]);
  const userId = JSON.parse(localStorage.getItem("AcharyaErpUser")).userId;
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getCandidateDetails();
  }, [pathname]);

  const getCandidateDetails = async () => {
    // fetching feeTemplateId
    const feetemplateId = await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Index", link: "/PreScholarshipApproverIndex" },
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

    const yearSem = []; //in this array pushing the no of year or sem of the particular program
    const yearValue = {}; // creating an object for  maintaining the state of year or semwise values of 'values' usestate

    // iterating no of year or sem based on fee template sub amount
    // pushing the values to yearSem and yearValue variables
    if (feetemplateData.program_type_name.toLowerCase() === "yearly") {
      for (let i = 1; i <= programDetails.number_of_years; i++) {
        yearSem.push({ key: i.toString(), value: "Year " + i });
        yearValue["year" + i] = "";
      }
    } else if (feetemplateData.program_type_name.toLowerCase() === "semester") {
      for (let i = 1; i <= programDetails.number_of_semester; i++) {
        yearSem.push({ key: i.toString(), value: "Sem " + i });
        yearValue["year" + i] = "";
      }
    }
    setNoOfYears(yearSem);

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

  const checks = {};
  const errorMessages = {};

  // validation checks
  Object.keys(values.postData).forEach((obj) => {
    Object.keys(values.postData[obj]).forEach((obj1) => {
      checks[obj1 + obj] = [/^[ 0-9]+$/.test(values.postData[obj][obj1])];
      errorMessages[obj1 + obj] = ["Invalid amount"];
    });
  });

  const handleChange = (e) => {
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
  };

  const handleCreate = async () => {
    const verify = async () => {
      const temp = [];

      //creating post api data format
      Object.keys(values.postData).forEach((obj) => {
        noOfYears.forEach((obj1) => {
          temp.push({
            active: true,
            amount: values.postData[obj]["year" + obj1.key],
            scholarship_id: scholarshipData.scholarship_id,
            scholarship_year: Number(obj1.key),
            voucher_head_new_id: Number(obj),
          });
        });
      });

      // fetching and updating scholarship status data based approved status id
      const updateData = await axios
        .get(
          `/api/student/scholarshipapprovalstatus/${scholarshipData.scholarship_approved_status_id}`
        )
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });

      updateData.verified_by = userId;
      updateData.is_verified = "yes";

      const scholarshipTotal = []; // for storing total verified scholarship amount
      noOfYears.forEach((obj) => {
        const amt = temp
          .filter((obj1) => obj1.scholarship_year === Number(obj.key))
          .map((obj2) => (Number(obj2.amount) > 0 ? Number(obj2.amount) : 0));
        updateData["year" + obj.key + "_amount"] = amt.reduce((a, b) => a + b);
        scholarshipTotal.push(amt.reduce((a, b) => a + b));
      });
      updateData.verified_amount = scholarshipTotal.reduce((a, b) => a + b);

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
          navigate("/PreScholarshipVerifierIndex", { replace: true });
        })
        .catch((err) => {
          console.error(err);
        });
    };

    setModalContent({
      title: "",
      message: "Do you want to submit ?",
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

      <Box>
        <Grid container rowSpacing={2}>
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

          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Particulars</StyledTableCell>
                    {noOfYears.map((obj, i) => {
                      return (
                        <StyledTableCell key={i} align="right">
                          {obj.value}
                        </StyledTableCell>
                      );
                    })}
                    <StyledTableCell align="right">Total</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {feeTemplateSubAmountData.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {obj.voucher_head}
                          </Typography>
                        </TableCell>
                        {noOfYears.map((obj1, j) => {
                          return (
                            <TableCell key={j} align="right">
                              <Typography variant="body2" mb={1}>
                                {obj["year" + obj1.key + "_amt"]}
                              </Typography>

                              {/* textField Name : combinaton of voucherHeadId and year column */}
                              {/* checks and error message : combination of year column and voucherHeadId */}
                              <CustomTextField
                                name={
                                  obj.voucher_head_new_id +
                                  "-" +
                                  "year" +
                                  obj1.key
                                }
                                label=""
                                value={
                                  values["postData"][obj.voucher_head_new_id][
                                    "year" + obj1.key
                                  ]
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
                                    "year" + obj1.key + obj.voucher_head_new_id
                                  ]
                                }
                                errors={
                                  errorMessages[
                                    "year" + obj1.key + obj.voucher_head_new_id
                                  ]
                                }
                              />
                            </TableCell>
                          );
                        })}
                        <TableCell align="right">
                          <Typography variant="subtitle2" mb={1}>
                            {obj.total_amt}
                          </Typography>

                          <CustomTextField
                            name=""
                            label=""
                            value={
                              Object.values(values.postData).length > 0
                                ? Object.values(
                                    values.postData[obj.voucher_head_new_id]
                                  ).reduce((a, b) => {
                                    const x = Number(a) > 0 ? Number(a) : 0;
                                    const y = Number(b) > 0 ? Number(b) : 0;
                                    return x + y;
                                  })
                                : 0
                            }
                            sx={{
                              "& .MuiInputBase-root": {
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Approved Pre Scholarship
                      </Typography>
                    </TableCell>
                    {noOfYears.map((obj, i) => {
                      return (
                        <TableCell key={i} align="right">
                          <Typography variant="body2">
                            {scholarshipData["year" + i + "_amount"]
                              ? scholarshipData["year" + i + "_amount"]
                              : 0}
                          </Typography>
                        </TableCell>
                      );
                    })}
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {scholarshipData.approved_amount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} align="right">
            <Button variant="contained" onClick={handleCreate}>
              verify
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PreScholarshipVerifierForm;
