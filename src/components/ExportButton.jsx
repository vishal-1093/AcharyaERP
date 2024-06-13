import React, { useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
  } from "@mui/material";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
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
  }));

const ExportButton = ({ rows,name }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

const generatePDF = () => {
  const doc = new jsPDF("landscape");

const printTime = new Date().toLocaleString();
//  doc.setFontSize(10);
//  doc.setTextColor(128, 128, 128);
//  doc.text(`Attendance Report for the month of ${moment(name.month).format("MMMM YYYY")}`, 14, 18);
//  doc.text(`Print: ${printTime}`, 14, 10);

//for text right end side
 const reportTitle = `Attendance Report for the month of ${moment(name.month).format("MMMM YYYY")}`;
 const printText = `Print: ${printTime}`;

 // Set font size to a smaller size, e.g., 6
 doc.setFontSize(14);
 // Set text color to a desired color, e.g., gray (128, 128, 128)
 doc.setTextColor(128, 128, 128);

 // Calculate the text width to position it at the right end
 const pageWidth = doc.internal.pageSize.width;
 const reportTitleWidth = doc.getTextWidth(reportTitle);
 const printTextWidth = doc.getTextWidth(printText);

 // Add the text to the right end of the page
 doc.text(reportTitle, pageWidth - reportTitleWidth - 10, 18);
 doc.text(printText, pageWidth - printTextWidth - 10, 10);
 
  if (rows.length > 0) {
      const columnMappings = {
          empId: "Sl No",
          empCode: "Emp Code",
          employee_name: "Emp Name",
          designation: "Designation",
          institute: "Institute",
          day1: "1", day2: "2", day3: "3", day4: "4", day5: "5", day6: "6", day7: "7", day8: "8", day9: "9", day10: "10",
          day11: "11", day12: "12", day13: "13", day14: "14", day15: "15", day16: "16", day17: "17", day18: "18", day19: "19", day20: "20",
          day21: "21", day22: "22", day23: "23", day24: "24", day25: "25", day26: "26", day27: "27", day28: "28", day29: "29", day30: "30", day31: "31",
          payday: "Pay D",
          presentday: "Prs D",
          leaveTaken: "LVS",
          absentday: "Ab",
          generalWo: "GH/WO",
          date_of_joining:'DOJ'
      };

      const tableColumn = Object.keys(rows[0])
          .map((key) => columnMappings[key] || key)
          .map((key) => key.replace(/([a-z])([A-Z])/g, "$1 $2"));

      const tableRows = rows.map((row) => Object.values(row).map(String));
     var totalPagesExp = '{total_pages_count_string}'
      doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 28,
          theme: 'grid',
          styles: {
              fontSize: 4,
              cellPadding: 1,
              overflow: "linebreak",
              halign: "center",
              showHead: 'firstPage',
          },
          headStyles: {
              fillColor: [52, 73, 94],
              textColor: [255, 255, 255],
              fontSize: 5,
          },
          didDrawPage: function (data) {
            var str = 'Page ' + doc.internal.getNumberOfPages()
            if (typeof doc.putTotalPages === 'function') {
              str = str + ' of ' + totalPagesExp
            }
            doc.setFontSize(10)
            var pageSize = doc.internal.pageSize
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
            doc.text(str, data.settings.margin.left, pageHeight - 10)
          },
      });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp)
      }
      doc.save(`Attendance Report for the month of ${moment(name.month).format("MMMM YYYY")}`);
  } else {
      doc.text("No data available", 14, 40);
      doc.save(`Attendance Report for the month of ${moment(name.month).format("MMMM YYYY")}`);
  }
};
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `Attendance Report for the month of ${moment(name.month).format("MMMM YYYY")}`);
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
            data={rows}
            filename={`Attendance Report for the month of ${moment(name.month).format("MMMM YYYY")}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Download CSV
          </CSVLink>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            generatePDF();
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
    </>
  );
};

export default ExportButton;
