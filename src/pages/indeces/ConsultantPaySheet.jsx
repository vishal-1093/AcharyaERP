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
} from "@mui/material";
import { checkFullAccess, convertToDMY } from "../../utils/DateTimeUtils";
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
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  console.log(rows, "rows", values);
  const navigate = useNavigate();
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  const getData = async () => {
    const month = moment(values.month).format("MM");
    const year = moment(values.month).format("YYYY");

    await axios
      .get(`/api/consoliation/getConsoliationList?month=${month}&year=${year}`)
      .then((res) => {
        console.log(res, "res");
        setIsSubmit(true);
        setRows(res?.data?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsSubmit(true);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCrumbs([{ name: "Consultant Payment Sheet" }]);
  }, []);

  const handleChangeAdvance = (name, newValue, id) => {
    const month = moment(values.month).format("MM");
    const year = moment(values.month).format("YYYY");
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
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async () => {
    getData();
  };

  const handleSave = async (params) => {
    const { empId } = params;
    const valueObject = values.find((item) => item.empId === empId);
    if (
      dayjs(values.month).isAfter(dayjs(values.contractTodata, "DD-MM-YYYY"))
    ) {
      setAlertMessage({
        severity: "error",
        message: "Month cannot be greater than contract to date",
      });
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`/api/consoliation/saveConsoliation`, valueObject);
      if (res.status === 200 || res.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Added contract payment",
        });
        // navigate(`/EmployeeContract/${valueObject.empId}`);
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
        message: "Something went wrong !!!",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRowId = (row) => row.empId;

  const columns = [
    {
      field: "institute",
      headerName: "School",
      flex: 1,
      hide: true,
    },
    {
      field: "jobType",
      headerName: "Job Type",
      flex: 1,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      hideable: false,
    },
    {
      field: "paymentAndStatus",
      headerName: "Payment & Status",
      flex: 1,
      hideable: false,
      renderCell: (params) => {
        const isDisabled = dayjs(values.month).isAfter(
          dayjs(params.row.toDate, "DD-MM-YYYY")
        );

        return (
          <Box display="flex" alignItems="center" gap={5}>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              value={
                values.find((item) => item.empId === params.row.empId)?.payingAmount ||
                ""
              }
              onChange={(e) =>
                handleChangeAdvance(
                  "payingAmount",
                  e.target.value,
                  params.row.empId
                )
              }
              disabled={isDisabled}
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
    },
  ];

  return (
    <>
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
                  <Button variant="contained" onClick={() => handleSubmit()}>
                    Save
                  </Button>
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
                      value={values.month}
                      handleChangeAdvance={handleChangeAdvanceDate}
                      views={["month", "year"]}
                      openTo="month"
                      inputFormat="MM/YYYY"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} align="right">
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={
                        isLoading ||
                        values.month === null ||
                        values.month === "Invalid Date"
                      }
                    >
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
    </>
  );
};

export default ConsultantPaySheet;
