import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import moment from "moment";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import FormPaperWrapper from "../../components/FormPaperWrapper";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import FilterListIcon from "@mui/icons-material/FilterList";
import dayjs from "dayjs";
import useAlert from "../../hooks/useAlert";

const ConsultantPaySheet = () => {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState([]);
  const [selectedMonth, setMonth] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const roleShortName = JSON.parse(
    sessionStorage.getItem("AcharyaErpUser")
  )?.roleShortName;

  const navigate = useNavigate();
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  const getData = async () => {
    const month = moment(selectedMonth.month).format("MM");
    const year = moment(selectedMonth.month).format("YYYY");

    await axios
      .get(`/api/consoliation/getConsultants?month=${month}&year=${year}`)
      .then((res) => {
        const data = res?.data?.data?.filter((obj) => {
          const toDate = dayjs(obj.toDate, "DD-MM-YYYY");
          const selectedDate = dayjs(selectedMonth.month);
          return (
            toDate.isAfter(selectedDate, "month") ||
            toDate.isSame(selectedDate, "month")
          );
        });
        setRows(data);
        setIsSubmit(true);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setValues([]);
      });
  };

  useEffect(() => {
    setCrumbs([{ name: "Consultant Payment" }]);
  }, [setCrumbs]);

  const handleChangeAdvance = (name, newValue, id) => {
    const month = Number(moment(selectedMonth.month).format("MM"));
    const year = Number(moment(selectedMonth.month).format("YYYY"));
    setValues((prev) => {
      const newValues = [...prev];
      const index = newValues.findIndex((item) => item.empId === id);
      const newValueObject = {
        ...newValues[index],
        [name]: newValue,
        empId: id,
        month: month,
        year: year,
      };
      if (index !== -1) {
        newValues[index] = newValueObject;
      } else {
        newValues.push(newValueObject);
      }
      return newValues;
    });
  };

  const handleChangeAdvanceDate = (name, newValue) => {
    setMonth((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async () => {
    getData();
  };

  const handleSave = async (params) => {
    const { empId, toDate ,remainingAmount} = params?.row;
    const valueObject = values?.find((item) => item.empId === empId);
    if (!valueObject || valueObject?.payingAmount === "") {
      setAlertMessage({
        severity: "error",
        message: "Please enter the amount",
      });
      setAlertOpen(true);
      return;
    }
    if(valueObject?.payingAmount >= remainingAmount ){
      setAlertMessage({
        severity: "error",
        message: "paying amount not greater then Remaining Amount",
      });
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/consoliation/saveConsoliation`,
        valueObject
      );
      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Added contract payment",
        });
        getData();
      } else {
        setAlertMessage({
          severity: "error",
          message: res?.message,
        });
      }
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err?.response ? err.response.data?.message : "Error",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleUpdate = async (params) => {
    const { empId, toDate } = params?.row;
    const valueObject = values?.find((item) => item.empId === empId);
    if (!valueObject || valueObject?.payingAmount === "") {
      setAlertMessage({
        severity: "error",
        message: "Please enter the amount",
      });
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/consoliation/updateConsoliation`,
        valueObject
      );
      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Updated contract payment",
        });
      } else {
        setAlertMessage({
          severity: "error",
          message: res?.message,
        });
      }
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err?.response ? err.response.data?.message : "Error",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getRowId = (row) => row?.empId;

  function formatMonthYear(month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }
  
  const columns = [
    {
      field: "empCode",
      headerName: "Emp Code",
      flex: 1,
    },
    {
      field: "employeeName",
      headerName: "Emp Name",
      flex: 1,
    },
    {
      field: "schoolName",
      headerName: "school",
      flex: 1,
    },
    
  
    {
      field: "period",
      headerName: "Period",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {`${params?.row?.fromDate} to ${params?.row?.toDate}`}
          </>
        );
      },
    },
    {
      field: "paydays",
      headerName: "PayD",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.paydays}
          </>
        );
      },
    },
    {
      field: "consoliatedAmount",
      headerName: "Consoliated Amount",
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "right",
            width: 100,
          }}>
            {params?.row?.consoliatedAmount}
          </div>
        );
      },
    },
  ];
  if (roleShortName === "SAA") {
    columns.push({
      field: "payment",
      headerName: "Paid Amount",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        const value =
          values.find((item) => item.empId === params.row.empId)
            ?.payingAmount ??
          params?.row?.payingAmount ??
          "";
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              type="number"
              variant="standard"
              size="small"
              inputProps={{ min: 0 }}
              value={value}
              onChange={(e) =>
                handleChangeAdvance(
                  "payingAmount",
                  e.target.value,
                  params.row.empId
                )
              }
            />
            {/* <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleSave(params)}
            >
              Save
            </Button> */}
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleUpdate(params)}
            >
              Update
            </Button>
          </Box>
        );
      },
    },{
      field: "remainingAmount",
      headerName: "Remaining Amount",
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "right",
              width: 100,
            }}
          >
            {params.row?.remainingAmount ?? 0}
          </div>
        );
      },
    },{
      field: "Year",
      headerName: "Pay Month",
      flex: 1,
      renderCell: (params) => {
        const month = moment(selectedMonth.month).format("MM");
        const year = moment(selectedMonth.month).format("YYYY");
        return (
          <>
             {formatMonthYear(month, year)}
          </>
        );
      },
    },
  );
  } else {
    columns.push({
      field: "payment",
      headerName: "Paid Amount",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        const valueFromParams = params?.row?.payingAmount ?? "";
        const valueFromState =
          values.find((item) => item.empId === params.row.empId)
            ?.payingAmount ?? "";

        return valueFromParams !== "" && valueFromParams !== null ? (
          <>{valueFromParams}</>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              type="number"
              variant="standard"
              size="small"
              inputProps={{ min: 0 }}
              value={valueFromState}
              onChange={(e) =>
                handleChangeAdvance(
                  "payingAmount",
                  e.target.value,
                  params.row.empId
                )
              }
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleSave(params)}
            >
              Save
            </Button>
          </Box>
        );
      },
    },{
      field: "remainingAmount",
      headerName: "Remaining Amount",
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "right",
              width: 100,
            }}
          >
            {params.row?.remainingAmount ?? 0}
          </div>
        );
      },
    },{
      field: "Year",
      headerName: "Pay Month",
      flex: 1,
      renderCell: (params) => {
        const month = moment(selectedMonth.month).format("MM");
        const year = moment(selectedMonth.month).format("YYYY");
        return (
          <>
             {formatMonthYear(month, year)}
          </>
        );
      },
    },);
  }

  return (
    <Box m={{ sm: 2 }}>
      <Grid container rowSpacing={4}>
        {isSubmit ? (
          <>
            <Grid
              container
              alignItems="baseline"
              columnSpacing={4}
              justifyContent="flex-end"
            >
              <Grid item>
                <Typography variant="h6" component="div">
                  {selectedMonth?.month
                    ? moment(selectedMonth.month).format("MM/YYYY")
                    : ""}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => setIsSubmit(false)}>
                  <FilterListIcon fontSize="large" color="primary" />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <GridIndex rows={rows} columns={columns} getRowId={getRowId} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <FormPaperWrapper>
              <Grid container columnSpacing={4} rowSpacing={3}>
                <Grid item xs={12} md={4}>
                  <CustomDatePicker
                    name="month"
                    label="Month"
                    value={selectedMonth?.month}
                    handleChangeAdvance={handleChangeAdvanceDate}
                    views={["month", "year"]}
                    openTo="month"
                    inputFormat="MM/YYYY"
                    disableFuture
                    required
                  />
                </Grid>
                <Grid item xs={12} align="right">
                  <Button variant="contained" onClick={handleSubmit}>
                    {isLoading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      "GO"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </FormPaperWrapper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ConsultantPaySheet;
