import { useState, useEffect, lazy } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { makeStyles } from "@mui/styles";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const CheckboxAutocomplete = lazy(() =>
  import("../../../components/Inputs/CheckboxAutocomplete")
);

const initialValues = {
  schoolId: null,
  categoryId: null,
  currencyTypeId: null,
  programId: null,
  programSpecializationId: [],
};

const initialValuesOne = {
  voucherId: "",
  boardId: null,
  aliasId: null,
  feetempSubAmtId: null,
  voucherHead: "",
  boardName: "",
  aliasName: "",
  remarks: "",
  receiveForAllYear: false,
  years: [],
};

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

function AddonFeeForm() {
  const [values, setValues] = useState(initialValues);
  const [acYearList, setAcYearList] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [programmeSpecializationList, setProgrammeSpecializationList] =
    useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [templateData, setTemplateData] = useState([initialValuesOne]);
  const [voucherOptions, setVoucherOptions] = useState([]);
  const [status, setStatus] = useState(false);

  const location = useLocation();
  const state = location?.state;
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getAcYearData();
    getSchoolData();
    getCurrencyType();
    getCateoryData();
    getProgramData();
    getTemplateDetails();
    getVoucherHeads();
    setCrumbs([
      { name: "Add-on Fee", link: "/Feetemplatemaster" },
      { name: "Create" },
    ]);
  }, []);

  useEffect(() => {
    getAllValues();
    getProgramSpecializations();
  }, [state]);

  console.log(state);

  const getAllValues = () => {
    setValues((prev) => ({
      ...prev,
      acYearId: state.ac_year_id,
      schoolId: state.school_id,
      programId: state.program_id,
      currencyTypeId: state.currency_type_id,
      categoryId: state.fee_admission_category_id,
      programSpecializationId: state?.program_specialization_id
        ?.split(",")
        .map((obj) => Number(obj)),
    }));
  };

  const handleChangeAdvanceOne = (name, newValue) => {
    const split = name.split("-");
    const index = parseInt(split[1]);
    const keyName = split[0];

    templateData.map((obj) => {
      if (index > 0 && obj.voucherId === newValue) {
        setAlertMessage({
          severity: "error",
          message: "Head is already selected",
        });
        setAlertOpen(true);
      }
    });

    setTemplateData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [keyName]: newValue };
        return obj;
      })
    );
  };

  const handleYears = (e, i, js) => {
    setTemplateData((prev) =>
      prev.map((obj, index) =>
        index === i
          ? {
              ...obj,
              years: obj.years.map((obj1, jindex) => {
                if (jindex === js)
                  return { ...obj1, [e.target.name]: e.target.value };
                return obj1;
              }),
            }
          : obj
      )
    );
  };

  const getOtherFeeDetails = async (year) => {
    const addonRes = await axios.get(
      `/api/otherFeeDetails/getOtherFeeDetailsData1?fee_template_id=${state.id}`
    );

    if (addonRes.data.length > 0) {
      const updateData = [];
      addonRes.data.forEach((obj) => {
        const allYears = [];
        year.forEach((years) => {
          allYears.push({
            key: years.key,
            ["feeYear" + years.key]: obj["sem" + years.key] || 0,
            value: years.value,
          });
        });

        updateData.push({
          otherFeeDetailsId: obj.id,
          otherFeeTemplateId: obj.other_fee_template_id,
          voucherId: obj.voucher_head_id,
          boardId: null,
          aliasId: null,
          feetempSubAmtId: null,
          voucherHead: obj.voucher_head_new_id,
          boardName: "",
          aliasName: "",
          remarks: "",
          receiveForAllYear: false,
          years: allYears,
        });
        setTemplateData(updateData);
        setStatus(true);
      });
    }
  };

  const getProgramSpecializations = async () => {
    if (state.school_id)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${state.school_id}`
        )
        .then((res) => {
          setProgrammeSpecializationList(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getVoucherHeads = async () => {
    await axios
      .get(`/api/finance/FetchVoucherHeadBasedOnType`)
      .then((res) => {
        const data = [];
        res.data.data.VoucherHeadDetails.forEach((obj) => {
          data.push({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
          });
        });
        setVoucherOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getAcYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcYearList(
          res.data.data.map((obj) => ({
            label: obj.ac_year,
            value: obj.ac_year_id,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolList(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCurrencyType = async () => {
    await axios
      .get(`/api/finance/CurrencyType`)
      .then((res) => {
        setCurrencyList(
          res.data.data.map((obj) => ({
            value: obj.currency_type_id,
            label: obj.currency_type_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCateoryData = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        setCategoryList(
          res.data.data.map((obj) => ({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    await axios
      .get(`/api/academic/Program`)
      .then((res) => {
        setProgramList(
          res.data.data.map((obj) => ({
            value: obj.program_id,
            label: obj.program_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getTemplateDetails = async () => {
    try {
      const templateResponse = await axios.get(
        `/api/finance/FetchAllFeeTemplateDetail/${state.id}`
      );

      const yearsemResponse = await axios.get(
        `/api/academic/FetchAcademicProgram/${templateResponse.data.data[0].ac_year_id}/${templateResponse.data.data[0].program_id}/${templateResponse.data.data[0].school_id}`
      );

      const yearSem = [];

      if (
        templateResponse.data.data[0].program_type_name.toLowerCase() ===
        "yearly"
      ) {
        for (
          let i = 1;
          i <= yearsemResponse.data.data[0].number_of_semester;
          i++
        ) {
          yearSem.push({
            key: i,

            value: "Sem" + "-" + i,
            ["feeYear" + i]: 0,
          });
        }
      } else if (
        templateResponse.data.data[0].program_type_name.toLowerCase() ===
        "semester"
      ) {
        for (
          let i = 1;
          i <= yearsemResponse.data.data[0].number_of_semester;
          i++
        ) {
          yearSem.push({ key: i, value: "Sem " + i, ["feeYear" + i]: 0 });
        }
      }
      setNoOfYears(yearSem);

      getOtherFeeDetails(yearSem);

      setTemplateData((prev) =>
        prev.map((obj) => ({ ...obj, years: yearSem }))
      );
    } catch (error) {
      setAlertMessage({ severity: "error", message: error });
      setAlertOpen(true);
    }
  };

  const addRow = () => {
    const newRow = {
      voucherId: "",
      boardId: null,
      aliasId: null,
      feetempSubAmtId: null,
      voucherHead: "",
      boardName: "",
      aliasName: "",
      remarks: "",
      receiveForAllYear: false,
      years: noOfYears,
    };

    setTemplateData((prev) => [...prev, newRow]);
  };

  const deleteRow = () => {
    const filterUser = [...templateData];
    filterUser.pop();
    setTemplateData(filterUser);
  };
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const actionAfterResponse = (res) => {
    if (res.status === 200 || res.status === 201) {
      navigate("/FeetemplateMaster", { replace: true });
      if (!location.state && !!res.data.data) {
        setAlertMessage({
          severity: "error",
          message: res.data.data,
        });
      } else if (!res.data.data) {
        setAlertMessage({
          severity: "success",
          message: `Third force fee ${
            !!location.state ? `updated` : `created`
          } successfully !!`,
        });
      }
    } else {
      setAlertMessage({ severity: "error", message: "Error Occured" });
    }
    setAlertOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const otherFeeDetailsDTOs = [];
      templateData.forEach((obj, i) => {
        const format = {};
        format.voucherHeadId = obj.voucherId;
        format.total = templateData[i].years.reduce((sum, total) => {
          return Number(sum) + Number(total["feeYear" + total.key]);
        }, 0);

        obj.years.forEach((obj1) => {
          format["sem" + obj1.key] = obj1["feeYear" + obj1.key];
        });

        otherFeeDetailsDTOs.push(format);
      });

      const payload = {
        acYearId: values.acYearId,
        schoolId: values.schoolId,
        programId: values.programId,
        feetype: "Add-on Programme Fee",
        programSpecializationId: values.programSpecializationId,
        fee_admission_category_id: values.categoryId,
        currency_type_id: values.currencyTypeId,
        fee_template_id: state.id,
      };

      payload.otherFeeDetailsDTOs = otherFeeDetailsDTOs;

      const response = await axios.post(
        `/api/otherFeeDetails/createOtherFees`,
        payload
      );
      if (response.status === 200 || response.status === 201) {
        navigate("/FeetemplateMaster", { replace: true });
        setAlertMessage({
          severity: "success",
          message: "Created Successfully",
        });
      } else {
        setAlertMessage({ severity: "error", message: "Error Occured" });
      }
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage({ severity: "error", message: error });
      setAlertOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const otherFeeDetailsDTOs = [];
      templateData.forEach((obj, i) => {
        const format = {};
        format.voucherHeadId = obj.voucherId;
        format.otherFeeDetailsId = obj.otherFeeDetailsId;
        format.otherFeeTemplateId = obj.otherFeeTemplateId;
        format.total = templateData[i].years.reduce((sum, total) => {
          return Number(sum) + Number(total["feeYear" + total.key]);
        }, 0);

        obj.years.forEach((obj1) => {
          format["sem" + obj1.key] = obj1["feeYear" + obj1.key];
        });

        otherFeeDetailsDTOs.push(format);
      });

      const response = await axios.put(
        `/api/otherFeeDetails/updateOtherFeeDetails?otherFeeTemplateId=${otherFeeDetailsDTOs?.[0]?.otherFeeTemplateId}`,
        otherFeeDetailsDTOs
      );
      if (response.status === 200 || response.status === 201) {
        navigate("/FeetemplateMaster", { replace: true });
        setAlertMessage({
          severity: "success",
          message: "Updated Successfully",
        });
      } else {
        setAlertMessage({ severity: "error", message: "Error Occured" });
      }
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage({ severity: "error", message: error });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <FormWrapper>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Ac Year"
              value={values.acYearId}
              options={acYearList}
              handleChangeAdvance={handleChangeAdvance}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolList}
              handleChangeAdvance={handleChangeAdvance}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programId"
              label="Program"
              value={values.programId}
              options={programList}
              handleChangeAdvance={handleChangeAdvance}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="categoryId"
              label="Category"
              value={values.categoryId}
              options={categoryList}
              handleChangeAdvance={handleChangeAdvance}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="currencyTypeId"
              label="Currency Type"
              value={values.currencyTypeId}
              options={currencyList}
              handleChangeAdvance={handleChangeAdvance}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomMultipleAutocomplete
              name="programSpecializationId"
              label="Program Specialization"
              value={values.programSpecializationId}
              options={programmeSpecializationList}
              handleChangeAdvance={handleChangeAdvance}
              handleSelectAll={handleSelectAll}
              handleSelectNone={handleSelectNone}
              disabled
              required
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TableContainer component={Paper} sx={{ overflow: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white", width: "25%" }}>
                      Voucher Head
                    </TableCell>
                    {noOfYears.length > 0 ? (
                      noOfYears.map((obj) => {
                        // if (obj.key >= state.lat_year_sem)
                        return (
                          <TableCell sx={{ color: "white" }}>
                            {obj.value}
                          </TableCell>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templateData.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <CustomAutocomplete
                            name={"voucherId" + "-" + i}
                            label=""
                            value={obj.voucherId}
                            handleChangeAdvance={handleChangeAdvanceOne}
                            options={voucherOptions}
                          />
                        </TableCell>

                        {templateData[i].years.map((obj1, j) => {
                          const year = j + 1;

                          return (
                            <>
                              <TableCell>
                                <CustomTextField
                                  name={"feeYear" + year}
                                  value={
                                    templateData[i].years[j][
                                      "feeYear" + obj1.key
                                    ]
                                  }
                                  handleChange={(e) => handleYears(e, i, j)}
                                  disabled={obj1.key < state.lat_year_sem}
                                />
                              </TableCell>
                            </>
                          );
                        })}

                        {/* <TableCell>
                          {templateData[i].years.reduce((sum, value) => {
                            return (
                              Number(sum) + Number(value["feeYear" + value.key])
                            );
                          }, 0)}
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="success"
              sx={{
                borderRadius: 2,
              }}
              onClick={addRow}
            >
              <AddIcon />
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
              }}
              onClick={deleteRow}
            >
              <RemoveIcon />
            </Button>
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              onClick={status ? handleUpdate : handleSubmit}
              variant="contained"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </>
  );
}
export default AddonFeeForm;
