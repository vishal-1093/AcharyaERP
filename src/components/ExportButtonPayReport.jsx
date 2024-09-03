import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Modal,
  IconButton,
  Grid,
} from "@mui/material";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import ModalWrapper from "./ModalWrapper";

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

const ExportButtonPayReport = ({ rows, name, sclName }) => {
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
    if (rows?.length > 0) {
      const tableColumn = columnOrder?.map((key) => columnMappings[key]);

      const tableRows = rows?.map((row, index) => {
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
          return rows
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
            doc.text(printText, data.settings.margin.left, doc.internal.pageSize.height - 10, { align: 'left' });
            
            // Add page number text to the bottom right
            var pageText = `Page ${doc.internal.getNumberOfPages()}`;
            doc.text(pageText, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
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
        // didDrawPage: function () {
        //   var str = "Page " + doc.internal.getNumberOfPages();
        //   if (typeof doc.putTotalPages === "function") {
        //     str = str + " of " + totalPagesExp;
        //   }
        //   doc.setFontSize(10);
        //   var pageSize = doc.internal.pageSize;
        //   var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        //   var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          
        //   // Adjust printTextX to position it at the bottom left
        //   var printTextX = 10; 
        //   doc.text(printText, printTextX, pageHeight - 10);
      
        //   // Position the page number at the bottom right
        //   var pageNumberX = pageWidth - doc.getTextWidth(str) - 10;
        //   doc.text(str, pageNumberX, pageHeight - 10);
        // },
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

    const worksheet = XLSX.utils.json_to_sheet(processedRows, {
      header: columnOrder,
    });
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
              link.download = `${name}.pdf`;
              link.click();
            }}
          >
            Download PDF
          </Button>
        </Grid>
      </ModalWrapper>
    </>
  );
};

export default ExportButtonPayReport;
