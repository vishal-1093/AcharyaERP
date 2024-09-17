import { useState, lazy, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
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
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: "100%",
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
  voucherHeadList: [],
  remarks: "",
  loading: false,
};

const FinancialyearBudgetForm = () => {
  const [{ voucherHeadList, remarks, loading }, setState] =
    useState(initialState);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      {
        name: location.state.page === "Index" ? "Budget" : "Budget Filter",
        link:
          location.state.page === "Index" ? "/budget-index" : "/budget-filter",
      },
      { name: location.state.page === "Index" ? "Update" : "Create" },
    ]);
    if (!!location.state) {
      getBudgetDetails();
    }
  }, []);

  const getBudgetDetails = async () => {
    try {
      const res = await axios.get(
        `api/finance/getAllBudgetDetailsData/${
          !!location.state?.formValue?.financial_year_id
            ? location.state?.formValue?.financial_year_id
            : location.state?.financial_year_id
        }/${
          !!location.state?.formValue?.school_id
            ? location.state?.formValue?.school_id
            : location.state?.school_id
        }/${
          !!location.state?.formValue?.dept_id
            ? location.state?.formValue?.dept_id
            : location.state?.dept_id
        }`
      );
      if (res.status == 200 || res.status == 201) {
        if (res.data.data.length > 0) {
          setCrumbs([
            {
              name:
                location.state.page === "Index" ? "Budget" : "Budget Filter",
              link:
                location.state.page === "Index"
                  ? "/budget-index"
                  : "/budget-filter",
            },
            { name: "Update" },
          ]);
          const lists = res.data.data.map((obj, index) => ({
            id: index + 1,
            ledger_id: obj.ledger_id,
            voucher_head_new_id: obj.voucher_head_new_id,
            group: obj.ledger_name,
            voucherHead: obj.voucher_head,
            proposed_amount: obj.proposed_amount,
            recommended_amount: obj.recommended_amount,
            approved_amount: obj.approved_amount,
            lock_status: obj.lock_status,
          }));
          setState((prevState) => ({
            ...prevState,
            voucherHeadList: lists,
            remarks: res.data.data[0]?.remark,
          }));
        } else {
          getBudgetData();
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
    }
  };

  const getBudgetData = async () => {
    try {
      const res = await axios.get(
        "api/finance/getVoucherHeadDataBasedOnBudget"
      );
      if (res.status == 200 || res.status == 201) {
        if (res.data.data.length > 0) {
          setCrumbs([
            {
              name:
                location.state.page === "Index" ? "Budget" : "Budget Filter",
              link:
                location.state.page === "Index"
                  ? "/budget-index"
                  : "/budget-filter",
            },
            { name: "Create" },
          ]);
          const lists = res.data.data.map((obj, index) => ({
            id: index + 1,
            ledger_id: obj.ledger_id,
            voucher_head_new_id: obj.voucherHeadNewId,
            group: obj.ledger_name,
            voucherHead: obj.voucherHead,
            proposed_amount: null,
            recommended_amount: null,
            approved_amount: null,
          }));
          setState((prevState) => ({
            ...prevState,
            voucherHeadList: lists,
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
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleChangeFormField = (e, i) => {
    if (voucherHeadList.length > 0) {
      let { name, value } = e.target;
      const onChangeReqVal = JSON.parse(JSON.stringify(voucherHeadList));
      onChangeReqVal[i][name] = !!value ? Number(value) : value;
      setState((prev) => ({
        ...prev,
        voucherHeadList: onChangeReqVal,
      }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === "+" || event.key === "e") {
      event.preventDefault();
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        financial_year_id: !!location.state.financial_year_id
          ? location.state.financial_year_id
          : location.state.formValue?.financial_year_id,
        emp_id: null,
        school_id: !!location.state.school_id
          ? location.state.school_id
          : location.state.formValue?.school_id,
        dept_id: !!location.state.dept_id
          ? location.state.dept_id
          : location.state.formValue?.dept_id,
        remark: remarks,
        active: true,
      };
      if (voucherHeadList.length > 0) {
        payload["ledgerItems"] = voucherHeadList;
      }
      const res = await axios.post(`api/finance/createBudget`, payload);
      actionAfterResponse(res);
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

  const actionAfterResponse = (res) => {
    if ((res.status = 200 || res.status == 201)) {
      setLoading(false);
      navigate("/budget-index", { replace: true });
      setAlertMessage({
        severity: "success",
        message: `Budget created successfully !!`,
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      {voucherHeadList.length > 0 && !!location.state.formValue && (
        <Grid
          container
          mb={2}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: { xs: -1, md: -5 },
          }}
        >
          <Grid item xs={12} md={3}>
            <CustomTextField
              name={""}
              label=""
              value={location.state.formValue?.financial_year}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name={""}
              label=""
              value={location.state.formValue?.school_name}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name={""}
              label=""
              value={location.state.formValue?.dept_name}
            />
          </Grid>
        </Grid>
      )}
      <Box component="form" overflow="hidden" pb={1}>
        {voucherHeadList.length > 0 && (
          <Grid container>
            <Grid item xs={12} md={12}>
              <TableContainer
                component={Paper}
                className={classes.tableContainer}
                sx={{ overflow: "auto" }}
              >
                <Table
                  size="small"
                  aria-label="simple table"
                  style={{ width: "100%" }}
                >
                  <TableHead>
                    <TableRow className={classes.bg}>
                      <TableCell sx={{ color: "white" }}>Groups</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        Expenditure Heads
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        HOD Proposal
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        Principal Recommendation
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        Management Approval
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.tableBody}>
                    {voucherHeadList.map((obj, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <CustomTextField
                            name={"group"}
                            label=""
                            value={obj.group || ""}
                            disabled
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name={"voucherHead"}
                            label=""
                            value={obj.voucherHead || ""}
                            disabled
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name={"proposed_amount"}
                            label=""
                            value={
                              !!obj.proposed_amount ? obj.proposed_amount : ""
                            }
                            onKeyDown={handleKeyDown}
                            handleChange={(e) =>
                              handleChangeFormField(e, index)
                            }
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name={"recommended_amount"}
                            label=""
                            value={
                              obj.recommended_amount != null
                                ? obj.recommended_amount
                                : ""
                            }
                            onKeyDown={handleKeyDown}
                            handleChange={(e) =>
                              handleChangeFormField(e, index)
                            }
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name={"approved_amount"}
                            label=""
                            value={
                              obj.approved_amount != null
                                ? obj.approved_amount
                                : ""
                            }
                            onKeyDown={handleKeyDown}
                            handleChange={(e) =>
                              handleChangeFormField(e, index)
                            }
                            type="number"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
        {!!voucherHeadList.length && (
          <Grid
            container
            mt={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} md={4}>
              <CustomTextField
                name={"remarks"}
                label="Remarks"
                value={remarks || ""}
                handleChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            {!voucherHeadList[0]?.lock_status && (
              <Grid item xs={12} md={1}>
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  disabled={loading || !remarks}
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
            )}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default FinancialyearBudgetForm;
