import { useEffect, useState } from "react";
import axios from "../../services/Api";
import { Box, Button, Grid, Menu, MenuItem } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import moment from "moment";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import { convertUTCtoTimeZone } from "../../utils/DateTimeUtils";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { CSVLink } from "react-csv";
import { makeStyles } from "@mui/styles";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ModalWrapper from "../../components/ModalWrapper";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "80%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  iframeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100% - 50px)",
    width: "100%",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  downloadButton: {
    marginTop: theme.spacing(2),
  },
}));

const today = new Date();

const initialValues = {
  month: convertUTCtoTimeZone(
    new Date(today.getFullYear(), today.getMonth() - 1)
  ),
  deptId: null,
  schoolId: null,
};

function SalarySheetMaster() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const classes = useStyles();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      flex: 1,
      hideable: false,
      renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    { field: "empcode", headerName: "Emp Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Employee Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "schoolShortName",
      headerName: "School",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "dept_name",
      headerName: "Department",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "designation_name",
      headerName: "Designation",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "job_type",
      headerName: "Job Type",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "employee_type",
      headerName: "Employee Type",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "salary_structure",
      headerName: "Salary Structure",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      valueFormatter: (value) => moment(value).format("DD-MM-YYYY"),
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      hideable: true,
      hide: true,
    },
    {
      field: "master_salary",
      headerName: "Master Pay",
      flex: 1,
      hideable: true,
    },
    {
      field: "basic",
      headerName: "Basic",
      flex: 1,
      hideable: true,
    },
    {
      field: "da",
      headerName: "DA",
      flex: 1,
      hideable: true,
    },
    {
      field: "hra",
      headerName: "HRA",
      flex: 1,
      hideable: true,
    },
    {
      field: "cca",
      headerName: "CCA",
      flex: 1,
      hideable: true,
    },
    {
      field: "spl_1",
      headerName: "Spl Pay",
      flex: 1,
      hideable: true,
    },
    {
      field: "ta",
      headerName: "TA",
      flex: 1,
      hideable: true,
    },
    {
      field: "er",
      headerName: "ER",
      flex: 1,
      hideable: false,
    },
    {
      field: "total_earning",
      headerName: "Gross",
      flex: 1,
      hideable: false,
    },
    {
      field: "pf",
      headerName: "EPF",
      flex: 1,
      hideable: false,
    },
    {
      field: "esi",
      headerName: "ESI",
      flex: 1,
      hideable: false,
    },
    {
      field: "pt",
      headerName: "PT",
      flex: 1,
      hideable: false,
    },
    {
      field: "advance",
      headerName: "Advance",
      flex: 1,
      hideable: false,
    },
    {
      field: "tds",
      headerName: "TDS",
      flex: 1,
      hideable: false,
      renderCell: (params) => <>{params.row.tds ?? 0}</>,
    },
    {
      field: "total_deduction",
      headerName: "Total Deduction",
      flex: 1,
      hideable: false,
    },
    {
      field: "netpay",
      headerName: "Net Pay",
      flex: 1,
      hideable: false,
    },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Salary Sheet Master" }]);
    getSchoolDetails();
    getSalarySheetMasterData();
  }, []);

  const getSalarySheetMasterData = async () => {
    try {
      let params = "";
      if (!!values.month && !values.schoolId && !values.dept) {
        params = `month=${moment(values.month).format("MM")}&year=${moment(
          values.month
        ).format("YYYY")}`;
      } else if(!!values.month && !!values.schoolId && !values.deptId){
        params = `month=${moment(values.month).format("MM")}&year=${moment(
          values.month
        ).format("YYYY")}&school_id=${values.schoolId}`
      }else if (!values.month && !!values.schoolId && !values.deptId) {
        params = `school_id=${values.schoolId}`;
      } else if (!values.month && !!values.schoolId && !!values.deptId) {
        params = `school_id=${values.schoolId}&dept_id=${values.deptId}`;
      } else if (!!(values.month && values.schoolId && values.deptId)) {
        params = `month=${moment(values.month).format("MM")}&year=${moment(
          values.month
        ).format("YYYY")}&school_id=${values.schoolId}&dept_id=${
          values.deptId
        }`;
      }

      if (!!params) {
        const res = await axios.get(
          `api/employee/getEmployeeMasterSalary?page=0&page_size=100000&${params}`
        );
        if (res.status == 200 || res.status == 201) {
          setEmployeeList(
            res.data.data.content?.length > 0 ? res.data.data.content : []
          );
        }
      } else {
        const res = await axios.get(
          `api/employee/getEmployeeMasterSalary?page=0&page_size=100000`
        );
        if (res.status == 200 || res.status == 201) {
          setEmployeeList(
            res.data.data.content?.length > 0 ? res.data.data.content : []
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const schoolList = res.data.data.map((obj) => ({
          value: obj.school_id,
          label: obj.school_name_short,
        }));
        setSchoolOptions(schoolList);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      getDepartmentOptions(newValue);
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getDepartmentOptions = async (schoolId) => {
    if (schoolId) {
      await axios
        .get(`/api/fetchdept1/${schoolId}`)
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.dept_id,
              label: obj.dept_name_short,
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSubmit = () => {
    getSalarySheetMasterData();
  };

  const handleExport = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    URL.revokeObjectURL(pdfUrl);
    setPdfUrl("");
  };

  const handleModalOpen = () => {
    generatePDF();
    setModalOpen(true);
  };

  function formatMonthYear(month, year) {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString().slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }

  const generatePDF = () => {
    const columnOrder = [
      "si_no",
      "empcode",
      "employee_name",
      "schoolShortName",
      "departmentShortName",
      "designationShortName",
      "date_of_joining",
      "master_salary",
      "pay_days",
      "basic",
      "da",
      "hra",
      "cca",
      "spl_1",
      "ta",
      "er",
      "gross_pay",
      "contribution_epf",
      "esi",
      "pt",
      "tds",
      "advance",
      "total_deduction",
      "netpay",
    ];

    const columnMappings = {
      si_no: "SI No",
      empcode: "Emp Code",
      employee_name: "Emp Name",
      departmentShortName: "Dept",
      designationShortName: "Designation",
      salary_structure: "Salary Structure",
      date_of_joining: "DoJ",
      master_salary: "Master Gross",
      pay_days: "PayD",
      basic: "Basic",
      er: "ER",
      total_earning: "Total Earning",
      tax: "Tax",
      total_deduction: "Total Deduction",
      pf: "PF",
      netpay: "Net Pay",
      advance: "Advance",
      monthYear: "MM-YY",
      hra: "HRA",
      da: "DA",
      cca: "CCA",
      ta: "TA",
      mr: "MR",
      fr: "FR",
      other_allow: "Other Allow",
      spl_1: "Spl 1",
      gross_pay: "Gross Pay",
      pt: "PT",
      esi: "ESI",
      tds: "TDS",
      advance1: "Adv",
      net_pay: "Net Pay",
      contribution_epf: "EPF",
      esi_contribution_employee: "ESI",
      schoolShortName: "School",
    };

    const doc = new jsPDF("landscape");
    const printTime = new Date().toLocaleString();
    const printText = `Print: ${moment(printTime).format(
      "D/M/YYYY, h:mm:ss A"
    )}`;

    let sclName = values.schoolId
      ? `${schoolOptions?.find((scl) => scl?.value === values.schoolId)?.label}`
      : "ACHARYA INSTITUTES";

    let name = !!values.month
      ? `Salary sheet for the Month of ${moment(values.month).format(
          "MMMM YYYY"
        )}`
      : `Salary sheet`;

    doc.setFontSize(14);
    const pageWidth = doc.internal.pageSize.getWidth();
    const sclNameWidth = doc.getTextWidth(sclName);
    const nameWidth = doc.getTextWidth(name);
    const sclNameX = (pageWidth - sclNameWidth) / 2;
    const nameX = (pageWidth - nameWidth) / 2;

    // Set text color and draw sclName centered
    doc.setTextColor(0, 0, 0);
    doc.text(sclName, sclNameX, 23);

    // Set text color and draw name centered
    doc.text(name, nameX, 30);
    // const printTextWidth = doc.getTextWidth(printText);
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    if (employeeList?.length > 0) {
      const tableColumn = columnOrder?.map((key) => columnMappings[key]);

      const tableRows = employeeList?.map((row, index) => {
        const formattedRow = columnOrder?.map((key) => {
          if (key === "si_no") return index + 1;
          if (key === "monthYear") return formatMonthYear(row.month, row.year);
          return row[key] !== undefined && row[key] !== null
            ? String(row[key])
            : "0";
        });
        return formattedRow;
      });

      const totalsRow = columnOrder?.map((key) => {
        if (
          key === "si_no" ||
          key === "empcode" ||
          key === "employee_name" ||
          key === "dept_name" ||
          key === "designation_name" ||
          key === "salary_structure" ||
          key === "date_of_joining" ||
          key === "monthYear" ||
          key === "schoolShortName"
        ) {
          return key === "date_of_joining" ? "Total" : "";
        } else {
          return employeeList
            ?.reduce((acc, row) => acc + (parseFloat(row[key]) || 0), 0)
            .toFixed(2);
        }
      });

      var totalPagesExp = "{total_pages_count_string}";
      doc.autoTable({
        margin: { top: 25 }, // Adding margin to the top of the table for space on every page
        didDrawPage: function (data) {
          // Add print date text to the bottom left
          var printText = `Print: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
          doc.text(
            printText,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10,
            { align: "left" }
          );

          // Add page number text to the bottom right
          var pageText = `Page ${doc.internal.getNumberOfPages()}`;
          doc.text(
            pageText,
            doc.internal.pageSize.width - data.settings.margin.right,
            doc.internal.pageSize.height - 10,
            { align: "right" }
          );
        },
        head: [tableColumn],
        body: [...tableRows, totalsRow],
        startY: 35,
        theme: "grid",
        styles: {
          fontSize: 5,
          cellPadding: 1,
          overflow: "linebreak",
          halign: "right", // Default alignment for all cells
          showHead: "firstPage",
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontSize: 5,
          halign: "center", // Ensure header alignment is set to center or your preference
        },
        willDrawCell: function (data) {
          if (data.row.index === tableRows.length) {
            doc.setTextColor(255, 255, 255);
          }
        },
        didParseCell: function (data) {
          // Apply specific style to the last row (totalsRow)
          if (data.row.index === tableRows.length) {
            data.cell.styles.fillColor = [52, 73, 94];
          }

          // Apply halign: "end" to specific columns, only for body cells
          const endAlignedColumns = [1, 2, 3, 4, 5, 6]; // Columns you want to align to the end
          if (
            data.section === "body" &&
            endAlignedColumns.includes(data.column.index)
          ) {
            data.cell.styles.halign = "start"; // Align to right
          }
        },
      });

      if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPagesExp);
      }

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } else {
      doc.text("No data available", 14, 40);
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    }
  };

  const generateExcel = () => {
    const columnOrder = [
      "si_no",
      "empcode",
      "employee_name",
      "dept_name",
      "designation_name",
      "salary_structure",
      "date_of_joining",
      "master_salary",
      "basic",
      "er",
      "total_earning",
      "tax",
      "total_deduction",
      "pf",
      "netpay",
      "advance",
      "monthYear",
      "hra",
      "da",
      "cca",
      "ta",
      "mr",
      "fr",
      "other_allow",
      "spl_1",
      "gross_pay",
      "pt",
      "esi",
      "tds",
      "advance1",
      "net_pay",
      "contribution_epf",
      "esi_contribution_employee",
      "schoolShortName",
    ];

    const processedRows = employeeList.map((row, index) => {
      const newRow = { ...row };
      newRow.si_no = index + 1;
      newRow.monthYear = `${row.month}-${row.year}`;
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(processedRows, {
      header: columnOrder,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const fileName = `${
      !!values.month
        ? `Salary sheet for the Month of ${moment(values.month).format(
            "MMMM YYYY"
          )}`
        : `Salary sheet`
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Box>
      <Grid container rowSpacing={4}>
        <Grid item xs={12} mt={2} mb={2}>
          <Grid container columnSpacing={4}>
            <Grid item xs={12} md={3}>
              <CustomDatePicker
                name="month"
                label="Month"
                value={values.month}
                handleChangeAdvance={handleChangeAdvance}
                views={["month", "year"]}
                openTo="month"
                inputFormat="MM/YYYY"
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="deptId"
                label="Department"
                value={values.deptId}
                options={!!values.schoolId ? departmentOptions : []}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!values.schoolId}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!values.month && !values.schoolId && !values.deptId}
              >
                Filter
              </Button>
            </Grid>
            <Grid item xs={12} md={2} align="right">
              <Button
                variant="contained"
                aria-controls="export-menu"
                aria-haspopup="true"
                onClick={handleExport}
                startIcon={<FileDownloadOutlinedIcon />}
                disabled={employeeList?.length == 0}
              >
                Export
              </Button>
              <Menu
                id="export-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <CSVLink
                    data={employeeList.map((row, index) => ({
                      ...row,
                      si_no: index + 1,
                      monthYear: `${row.month}-${row.year}`,
                    }))}
                    filename={
                      !!values.month
                        ? `Salary sheet for the Month of ${moment(
                            values.month
                          ).format("MMMM YYYY")}`
                        : `Salary sheet`
                    }
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Download CSV
                  </CSVLink>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleModalOpen();
                  }}
                >
                  Download PDF
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    generateExcel();
                  }}
                >
                  Download Excel
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ModalWrapper open={modalOpen} setOpen={handleModalClose} maxWidth={1200}>
        <Grid
          item
          xs={12}
          style={{
            height: "80vh",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100% - 50px)",
              width: "100%",
            }}
          >
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ position: "absolute", right: 40, bottom: 5, borderRadius: 2 }}
            className={classes.downloadButton}
            onClick={() => {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.download = `${`Salary sheet for the Month of ${moment(
                values.month
              ).format("MMMM YYYY")}`}.pdf`;
              link.click();
            }}
          >
            Download PDF
          </Button>
        </Grid>
      </ModalWrapper>
      <GridIndex rows={employeeList} columns={columns} />
    </Box>
  );
}

export default SalarySheetMaster;
