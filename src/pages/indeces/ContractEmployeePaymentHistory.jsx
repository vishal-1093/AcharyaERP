import React, { useState, useEffect } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { checkFullAccess, convertToDMY } from "../../utils/DateTimeUtils";
import moment from "moment";
import { CustomDataExport } from "../../components/CustomDataExport";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import FilterListIcon from "@mui/icons-material/FilterList";
import FormPaperWrapper from "../../components/FormPaperWrapper";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import ExportButtonContract from "../../components/ExportButtonContract";

const ContractEmployeePaymentHistory = () => {
  const [rows, setRows] = useState([]);
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const [isLoading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/api/consoliation/getConsoliationListByEmpId?empId=${id}`)
      .then((res) => {
        setRows(res?.data?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCrumbs([{ name: "Contract Employee Payment History" }]);
  }, []);

  const getRowId = (row) => row?.empId;

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
      field: "institute",
      headerName: "Inst",
      flex: 1,
    },
    {
      field: "department",
      headerName: "Branch",
      flex: 1,
    },
    {
      field: "period",
      headerName: "Period",
      flex: 1,
      renderCell: (params) => {
        const periodText = `${params?.row?.fromDate} to ${params?.row?.toDate}`;
        return (
          <Tooltip title={periodText}>
            <Typography
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {periodText}
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      field: "Year",
      headerName: "Year",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {`${params?.row?.month}-${params?.row?.year}`}
          </>
        );
      },
    },
    {
      field: "payDays",
      headerName: "Pay Days",
      flex: 1,
    },
    {
      field: "payingAmount",
      headerName: "Monthly Fee",
      flex: 1,
    },
    { field: "tds", headerName: "TDS", flex: 1, hideable: false },
    // { field: "netPay", headerName: "Net Pay", flex: 1, hideable: false },
    {
      field: "totalAmount",
      headerName: "Net Amount",
      flex: 1,
      hideable: false,
    },
    { field: "pan", headerName: "Pan No", flex: 1, hideable: false },
    { field: "bank", headerName: "Bank", flex: 1, hideable: false },
    { field: "accountNo", headerName: "Account No", flex: 1, hideable: false },
    {
      field: "ifsc",
      headerName: "Ifsc",
      flex: 1,
      hideable: false,
    },
    {
      field: "remainingAmount",
      headerName: "Remaining Amount",
      flex: 1,
      hideable: false,
    },
  ];
  return (
    <>
      <Grid
        container
        alignItems="baseline"
        columnSpacing={4}
        justifyContent="flex-end"
        marginBottom={5}
      >
        {rows.length > 0 && (
          <ExportButtonContract
            rows={rows}
            name={`Contract Employee Payment History`}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <GridIndex rows={rows} columns={columns} getRowId={getRowId} />
      </Grid>
    </>
  );
};

export default ContractEmployeePaymentHistory;
