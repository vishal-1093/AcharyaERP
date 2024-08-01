import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Modal, IconButton } from "@mui/material";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 20,
    backgroundColor: theme.palette.primary.main,
    color: "rgba(0, 0, 0, 0.6)",
    padding: "10px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
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

const ExportButtonPayReport = ({ rows, name }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const classes = useStyles();

  const handleClick = (event) => {
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
      "dept_name",
      "designation_name",
      "salary_structure",
      "date_of_joining",
      "pay_days",
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

    const columnMappings = {
      si_no: "SI No",
      empcode: "Emp Code",
      employee_name: "Emp Name",
      dept_name: "Dept",
      designation_name: "Designation",
      salary_structure: "Salary Structure",
      date_of_joining: "DoJ",
      pay_days: "PayD",
      master_salary: "Master Salary",
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
    const printText = `Print: ${moment(printTime).format("D/M/YYYY, h:mm:ss A")}`;
    doc.setFontSize(14);
    const printTextWidth = doc.getTextWidth(printText);
    doc.setTextColor(0, 0, 0);
    doc.text(name, 14, 10);
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    if (rows?.length > 0) {
      const tableColumn = columnOrder?.map((key) => columnMappings[key]);

      const tableRows = rows?.map((row, index) => {
        const formattedRow = columnOrder?.map((key) => {
          if (key === 'si_no') return index + 1;
          if (key === 'monthYear') return formatMonthYear(row.month, row.year);
          return row[key] !== undefined && row[key] !== null ? String(row[key]) : "0";
        });
        return formattedRow;
      });

      const totalsRow = columnOrder?.map((key) => {
        if (key === "si_no" || key === "empcode" || key === "employee_name" || key === "dept_name" || key === "designation_name" || key === "salary_structure" || key === "date_of_joining" || key === "monthYear" || key === "schoolShortName") {
          return key === "date_of_joining" ? "Total" :  "";
        } else {
          return rows?.reduce((acc, row) => acc + (parseFloat(row[key]) || 0), 0).toFixed(2);
        }
      });

      var totalPagesExp = "{total_pages_count_string}";
      doc.autoTable({
        head: [tableColumn],
        body: [...tableRows, totalsRow],
        startY: 20,
        theme: "grid",
        styles: {
          fontSize: 4,
          cellPadding: 1,
          overflow: "linebreak",
          halign: "center",
          showHead: "firstPage",
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontSize: 4,
        },
        didDrawPage: function () {
          var str = "Page " + doc.internal.getNumberOfPages();
          if (typeof doc.putTotalPages === "function") {
            str = str + " of " + totalPagesExp;
          }
          doc.setFontSize(10);
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          var printTextX = pageWidth - printTextWidth + 3;
          doc.text(printText, printTextX, 10);
          var pageNumberX = pageWidth - doc.getTextWidth(str) + 10;
          doc.text(str, pageNumberX, pageHeight - 10);
        },
        willDrawCell: function (data) {
          if (data.row.index === tableRows.length) {
              doc.setTextColor(255, 255, 255) 
          }
        },
        didParseCell: function (data) {
          if (data.row.index === tableRows.length) {
            data.cell.styles.fillColor = [52, 73, 94]
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
      "pay_days",
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

    const processedRows = rows.map((row, index) => {
      const newRow = { ...row };
      newRow.si_no = index + 1;
      newRow.monthYear = `${row.month}-${row.year}`;
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(processedRows, { header: columnOrder });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const fileName = `${name}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <Button
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
        className={classes.button}
        startIcon={<FileDownloadOutlinedIcon />}
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
            data={rows.map((row, index) => ({
              ...row,
              si_no: index + 1,
              monthYear: `${row.month}-${row.year}`,
            }))}
            filename={name}
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
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        className={classes.modal}
        maxWidth={1000}
      >
        <Box className={classes.paper}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleModalClose}
          >
            <CloseIcon />
          </IconButton>
          <Box className={classes.iframeContainer}>
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className={classes.iframe}
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
              link.download = `${name}.pdf`;
              link.click();
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ExportButtonPayReport;
