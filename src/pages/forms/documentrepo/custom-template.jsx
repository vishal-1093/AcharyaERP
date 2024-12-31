import React, { useEffect, useRef, useState, lazy } from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import Editor from "./quill";
import jsPDF from "jspdf";
import SyncIcon from "@mui/icons-material/Sync";
import useAlert from "../../../hooks/useAlert";
import axios from "../../../services/Api";
import { useNavigate } from "react-router";
import { debounce } from 'lodash';
import moment from "moment";
const logos = require.context("../../../assets", true);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);
const loggedInUser = JSON.parse(sessionStorage.getItem("empId"));

const categoryTypeList = [
  { label: "Staff", value: "Staff" },
  { label: "Student", value: "Student" },
  { label: "Inter Office Note", value: "ION" }
];

const CustomTemplate = () => {
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const [loading, setLoading] = useState(false);
  const [previewPdf, setPreviewPdf] = useState("");
  const [isLetterHeadRequire, setIsLetterHeadRequire] = useState("yes");
  const [categoryType, setCategoryType] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [toEmp, setToEmp] = useState("");
  const [subject, setSubject] = useState("");
  const withLetterhead = useRef("yes");
  const [htmlContent, setHtmlContent] = useState("");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [schoolId, setSchoolId] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const [empDetails, setEmployeeDetails] = useState([]);
  const [previewImage, setPreviewImage] = useState(`${logos(`./aisait.jpg`)}`);

  useEffect(() => {
    setCrumbs([
      { name: "Document Repo", link: "/document-repo" },
      { name: "Outward" },
      { name: "Create" },
    ]);
    getSchoolData();
  }, []);

  useEffect(() => {
    generatePdf(previewImage);
  }, [withLetterhead.current]);

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`api/institute/getSchoolDetails`);
      if (res?.data?.data?.length) {
        setSchoolList(
          res?.data?.data.map((el) => ({
            ...el,
            label: el.school_name_short,
            value: el.id,
            orgType: el.org_type,
            shortName: el.school_name_short,
          }))
        );
        getEmployeeData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeeData = async () => {
    try {
      const res = await axios.get(`api/employee/getAllActiveEmployeeDetails`);
      if (res?.data?.data?.length) {
        setEmployeeList(
          res?.data?.data.map((el) => ({
            ...el,
            label: el.employee_name,
            value: el.emp_id
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      const schoolOrgType = schoolList?.find(
        (ele) => ele.value == newValue
      )?.orgType;
      const schoolShortName = schoolList?.find(
        (ele) => ele.value == newValue
      )?.shortName;
      setSchoolId(newValue);
      if (!!schoolOrgType && !!schoolShortName) {
        generatePdf(`${logos(
          `./${`${schoolOrgType}${schoolShortName}`?.toLowerCase()}.jpg`
        )}`);
        setPreviewImage(
          `${logos(
            `./${`${schoolOrgType}${schoolShortName}`?.toLowerCase()}.jpg`
          )}`
        );
      }
    } else if (name == "categoryType") {
      setCategoryType(newValue)
    } else {
      setToEmp(newValue);
      debouncedSearch(newValue);
    }
  };

  const debouncedSearch = debounce(async (empId) => {
    try {
      const res = await axios.get(`/api/employee/getDeptAndDesignationBasedOnEmpId/${loggedInUser},${empId}`);
      if (res.status == 200 || res.status == 201) {
        setEmployeeDetails(res.data.data)
      }
    } catch (error) {
      console.error(error);
    }
  }, 1000);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setSubject(value)
  };

  const tableContent = (submittedDateTime, ipAddress) => {
    let data = `<table style="width:750px;border: 1px solid #000;border-collapse: collapse;font-family: arial, sans-serif">
          <tr>
            <th style="width:350px;border: 1px solid #000;text-align:left;padding-left:10px;color:#444544"><h3>From:</h3>
            <h3 style="padding:5px 0px 0px 30px">${empDetails[0]?.employee_name}</h3>
            <h3 style="padding:5px 0px 8px 30px">${empDetails[0]?.designation_name}</h3>
            <h3 style="padding:0px 0px 8px 30px;">${empDetails[0]?.dept_name_short}, &nbsp; ${empDetails[0]?.school_name_short}</h3>
            </th>
            <th style="width:350px;border: 1px solid #000;text-align:left;padding-left:10px;color:#444544"><h3>To:</h3>
              <h3 style="padding:5px 0px 0px 30px">${empDetails[1]?.employee_name}</h3>
              <h3 style="padding:5px 0px 8px 30px">${empDetails[1]?.designation_name}</h3>
              <h3 style="padding:0px 0px 8px 30px">${empDetails[1]?.dept_name_short}, &nbsp; ${empDetails[1]?.school_name_short}</h3>
            </th>
          </tr
      </table>
      <table style="width:750px;border-collapse: collapse;font-family: arial, sans-serif">
          <tr>
            <th style="padding:10px ;border:1px solid #000;text-align:center;display:flex;justify-content:center;gap:10px"><h3>Subject:</h3><h3 style="color:#444544">${subject}</h3></th>
          </tr>
      </table>
         <table style="width:750px;border: 1px solid #000;border-collapse: collapse;font-family: arial, sans-serif">
          <tr>
           <td style="padding:15px;text-align:justify">${htmlContent}</td>
          </tr>
          <tr>
           <td></td>
          </tr>
          <tr>
           <td style="padding:15px;text-align:justify">
           <p>Yours Truly,</p>
           <p style="margin-top:5px">${empDetails[0]?.employee_name}</p>
           <p>Submitted Date & Time: <b>${submittedDateTime || ""}</b></p>
           <p>IP Address: <b>${ipAddress}</b></hp>
           </td>
          </tr>
      </table>
      `;
    return data;
  };

  const generatePdf = (schoolPreviewImage) => {
    if (loading) return;
    setLoading(true);
    const newDiv = categoryType === "ION" ? `<div>${tableContent("", "")}</div>` : `<div>${htmlContent}</div>`;
    const doc = new jsPDF("p", "pt", "letter");

    const parser = new DOMParser();
    const doc_ = parser.parseFromString(newDiv, "text/html");
    const parentDiv = doc_.body.children[0];
    const parnetDivChildrens = parentDiv.children;

    for (const _children of parnetDivChildrens) {
      const hasClassName = isNodeHasClassName(_children);
      if (hasClassName) {
        replaceClassNameWithStyle(_children);
      }

      const childs = _children.children;
      if (childs.length > 0) {
        for (const child of childs) {
          const hasClassName = isNodeHasClassName(child);
          if (hasClassName) {
            replaceClassNameWithStyle(child);
          }
        }
      }
    }

    if (withLetterhead.current === "yes") {
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(schoolPreviewImage, "JPEG", 0, 0, width, height);
    } else {
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(`${logos(`./aisjmj.jpg`)}`, "JPEG", 0, 0, width, height);
    }

    let margin = [150, 0, 72, 30];

    doc.html(parentDiv.outerHTML, {
      async callback(doc) {
        setPreviewPdf(doc.output("datauristring"));
        setLoading(false);
      },
      margin: margin,
      width: 750,
      windowWidth: 750,
      x: 15,
      y: 0,
      html2canvas: { scale: 0.7 },
      autoPaging: "text",
    });
  };

  const isNodeHasClassName = (node) => {
    return node.classList.length;
  };

  const replaceClassNameWithStyle = (node) => {
    const classNames = node.classList;
    for (const className of classNames) {
      if (className === "ql-indent-1") {
        node.style.textIndent = "20px";
      } else if (className === "ql-indent-2") {
        node.style.textIndent = "40px";
      } else if (className === "ql-indent-3") {
        node.style.textIndent = "60px";
      } else if (className === "ql-indent-4") {
        node.style.textIndent = "80px";
      } else if (className === "ql-indent-5") {
        node.style.textIndent = "100px";
      } else if (className === "ql-indent-6") {
        node.style.textIndent = "120px";
      } else if (className === "ql-indent-7") {
        node.style.textIndent = "140px";
      } else if (className === "ql-indent-8") {
        node.style.textIndent = "160px";
      }
    }

    return node;
  };

  const handleTypedData = (e) => {
    setHtmlContent(e.replace(/  /g, '&nbsp;&nbsp;'))
  };

  const handleIsLetterHeadRequire = (value) => {
    setIsLetterHeadRequire(value);
    withLetterhead.current = value;
  };

  const savePdf = () => {
    const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
    const usertype = JSON.parse(
      sessionStorage.getItem("AcharyaErpUser")
    )?.roleName;
    const payload = {
      userId: null,
      userCode: "",
      categoryTypeId: null,
      categoryDetailId: null,
      content: categoryType === "ION" ? tableContent(moment().format('DD-MM-YY, h:mm a'), "152.59.223.237") : htmlContent,
      categoryShortName: categoryType || categoryTypeList[0]?.value,
      createdBy: userId,
      usertype: usertype,
      templateType: "INSTANT",
      school_id: schoolId || schoolList[0]?.value,
      withLetterHead: isLetterHeadRequire === "yes" ? true : false,
    };
    axios
      .post("/api/customtemplate/createCustomTemplate", payload)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          navigate("/document-repo");
          setAlertMessage({
            severity: "success",
            message: `Custom template created successfully !!`,
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "An error occured",
        });
        setAlertOpen(true);
      });
  };

  return (
    <Grid container sx={{ display: "flex", flexDirection: "column" }} mt={2}>
      <Grid
        container
        sx={{ display: "flex", flexDirection: "row", gap: categoryType == "ION" ? "8px" : "25px" }}
      >
        <Grid item xs={12} md={1}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              With Letterhead
            </InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={isLetterHeadRequire}
              label="With Letterhead"
              onChange={(e) => handleIsLetterHeadRequire(e.target.value)}
            >
              <MenuItem value="yes">Institute</MenuItem>
              <MenuItem value="no">Common</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={1}>
          <CustomAutocomplete
            name="schoolId"
            value={schoolId || schoolList[0]?.value}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="categoryType"
            value={categoryType || categoryTypeList[0]?.value}
            label="Category"
            handleChangeAdvance={handleChangeAdvance}
            options={categoryTypeList || []}
          />
        </Grid>
        {categoryType == "ION" && <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="toEmp"
            value={toEmp}
            label="To Employee"
            handleChangeAdvance={handleChangeAdvance}
            options={employeeList || []}
          />
        </Grid>}
        {categoryType == "ION" && <Grid item xs={12} md={3}>
          <CustomTextField
            name="subject"
            label="Subject"
            value={subject || ""}
            handleChange={handleChange}
            required
          />
        </Grid>}

        <Grid item xs={12} md={categoryType == "ION" ? 1 : 5} align="right">
          <Button variant="outlined" startIcon={<SyncIcon />} onClick={() => generatePdf(previewImage)}>
            Sync
          </Button>
        </Grid>
        <Grid item xs={12} md={categoryType == "ION" ? 1.5 : 2} align="right">
          <Button variant="contained" onClick={savePdf} disabled={categoryType == "ION" && (!toEmp || !subject)}>
            Save / Lock
          </Button>
        </Grid>
      </Grid>
      <Grid container sx={{ display: "flex", flexDirection: "row" }} mt={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Editor
            placeholder="Write Something"
            saveData={(e) => handleTypedData(e)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} sx={{ position: "relative" }}>
          {loading && (
            <CircularProgress
              sx={{
                position: "absolute",
                width: "100%",
                top: "42%",
                left: "50%",
              }}
            />
          )}
          <object
            style={{ width: "100%", minHeight: "50em" }}
            data={`${previewPdf}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
          >
            <p>Unable to preview the document</p>
          </object>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomTemplate;
