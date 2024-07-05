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
  Menu,
  MenuItem,
} from "@mui/material";
import { checkFullAccess, convertToDMY } from "../../utils/DateTimeUtils";
import moment from "moment";
import { CustomDataExport } from "../../components/CustomDataExport";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import FilterListIcon from "@mui/icons-material/FilterList";
import FormPaperWrapper from "../../components/FormPaperWrapper";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import ExportButton from "../../components/ExportButton";
import ExportButtonContract from "../../components/ExportButtonContract";
import { DataGrid, GridToolbarExport, GridToolbarContainer, useGridApiContext, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import jsPDF from 'jspdf';

const CustomExportButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const apiRef = useGridApiContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSV = () => {
    apiRef.current.exportDataAsCsv();
    handleClose();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const data = apiRef.current.getDataAsCsv(); // Or use other methods to get data
    doc.text('Your PDF content here', 10, 10);
    doc.save('table.pdf');
    handleClose();
  };

  const handlePrint = () => {
    setTimeout(()=>{
      window.print();
    },0)
    handleClose();
  };

  return (
    <>
      <Button color="primary" onClick={handleClick}>
        Export
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDownloadCSV}>Download as CSV</MenuItem>
        <MenuItem onClick={handleDownloadPDF}>Download PDF</MenuItem>
        <MenuItem onClick={handlePrint}>Print</MenuItem>
      </Menu>
    </>
  );
};



const ContractPaymentHistory = () => {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedMonth, setMonth] = useState({});
  const [isLoading, setLoading] = useState(false);

  const getData = async () => {
    const month = moment(selectedMonth.month).format("MM");
    const year = moment(selectedMonth.month).format("YYYY");

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
    setCrumbs([{ name: "Contract Payment History" }]);
  }, []);

  const handleChangeAdvanceDate = (name, newValue) => {
    setMonth((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getRowId = (row) => row?.empId;

  const handleSubmit = async () => {
    getData();
  };

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
    {
      field: "totalAmount",
      headerName: "Net Amount",
      flex: 1,
      hideable: false,
    },
    { field: "pan", headerName: "Pan No", flex: 1, hide: false },
    { field: "bank", headerName: "Bank", flex: 1, hide: true },
    { field: "accountNo", headerName: "Account No", flex: 1, hide: true },
    {
      field: "ifsc",
      headerName: "Ifsc",
      flex: 1,
      hide: true,
    },
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <CustomExportButton />
      </GridToolbarContainer>
    );
  };

  return (
    <>
      {isSubmit ? (
        <>
          <Grid
            container
            alignItems="baseline"
            columnSpacing={4}
            justifyContent="flex-end"
          >
            {rows.length > 0 && (
              <ExportButtonContract
                rows={rows}
                name={`Contract Payment Report for the Month of ${moment(
                  selectedMonth.month
                ).format("MMMM YYYY")}`}
              />
            )}
            <Grid item>
              <IconButton onClick={() => setIsSubmit(false)}>
                <FilterListIcon fontSize="large" color="primary" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <GridIndex
              rows={rows}
              columns={columns}
              getRowId={getRowId}
              // components={{
              //   Toolbar: CustomToolbar,
              // }}
            />
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
                  required
                />
              </Grid>
              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  onClick={handleSubmit}
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
    </>
  );
};

export default ContractPaymentHistory;
