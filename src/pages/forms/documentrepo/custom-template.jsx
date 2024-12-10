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
const logos = require.context("../../../assets", true);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
)

const categoryTypeList = [
  { label: "Staff Related", value: "Staff Related" },
  { label: "Student Related", value: "Student Related" },
  { label: "Inter Office Note", value: "Inter Office Note" }
]

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
  const valueRef = useRef("");
  const prevValueRef = useRef("");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [schoolId, setSchoolId] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const [previewImage, setPreviewImage] = useState(`${logos(`./aisait.jpg`)}`);

  useEffect(() => {
    setCrumbs([
      { name: "Document Repo", link: "/document-repo" },
      { name: "Instant Template" },
    ]);
    getSchoolData();

    //Implementing the setInterval method
    const interval = setInterval(() => {
      if (valueRef.current === "") return;

      if (prevValueRef.current === valueRef.current) return;

      generatePdf();
    }, 10000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    generatePdf();
  }, [withLetterhead.current]);

  useEffect(() => {
    generatePdf();
  }, [previewImage]);

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
        setPreviewImage(
          `${logos(
            `./${`${schoolOrgType}${schoolShortName}`?.toLowerCase()}.jpg`
          )}`
        );
      }
    } else if (name == "categoryType") {
      setCategoryType(newValue)
    } else {
      setToEmp(newValue)
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setSubject(value)
  };

  const generatePdf = () => {
    if (loading) return;
    setLoading(true);
    const newDiv = `<div>${valueRef.current}</div>`;
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
      doc.addImage(previewImage, "JPEG", 0, 0, width, height);
    }

    let margin = [150, 0, 72, 30];
    if (withLetterhead.current === "no") {
      margin = [30, 0, 30, 30];
    }

    doc.html(parentDiv.outerHTML, {
      async callback(doc) {
        setPreviewPdf(doc.output("datauristring"));
        setLoading(false);
      },
      margin: margin,
      width: withLetterhead.current === "yes" ? 668 : 750,
      windowWidth: withLetterhead.current === "yes" ? 668 : 750,
      x: withLetterhead.current === "yes" ? 15 : 10,
      y: 0,
      html2canvas: { scale: 0.7 },
      autoPaging: "text",
    });

    prevValueRef.current = valueRef.current;
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
    prevValueRef.current = valueRef.current;
    valueRef.current = e;
  };

  const handleIsLetterHeadRequire = (value) => {
    setIsLetterHeadRequire(value);
    withLetterhead.current = value;
  };

  const savePdf = () => {
    if (valueRef.current === "")
      return alert("Please provide proper value to save.");
    if (categoryType === "Select Category")
      return alert("Please select category");

    const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
    const usertype = JSON.parse(
      sessionStorage.getItem("AcharyaErpUser")
    )?.roleName;

    const payload = {
      userId: null,
      userCode: "",
      categoryTypeId: null,
      categoryDetailId: null,
      content: valueRef.current,
      categoryShortName: categoryType,
      createdBy: userId,
      usertype: usertype,
      templateType: "INSTANT",
      schoolId: schoolId,
      withLetterHead: isLetterHeadRequire === "yes" ? true : false,
    };
    axios
      .post("/api/customtemplate/createCustomTemplate", payload)
      .then((res) => {
        navigate("/document-repo");
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
        sx={{ display: "flex", flexDirection: "row", gap: categoryType == "Inter Office Note" ? "8px" : "25px" }}
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
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
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
            value={categoryType}
            label="Category"
            handleChangeAdvance={handleChangeAdvance}
            options={categoryTypeList || []}
          />
        </Grid>
        {categoryType == "Inter Office Note" && <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="toEmp"
            value={toEmp}
            label="To Employee"
            handleChangeAdvance={handleChangeAdvance}
            options={employeeList || []}
          />
        </Grid>}
        {categoryType == "Inter Office Note" && <Grid item xs={12} md={3}>
          <CustomTextField
            name="subject"
            label="Subject"
            value={subject || ""}
            handleChange={handleChange}
            required
          />
        </Grid>}

        <Grid item xs={12} md={categoryType == "Inter Office Note" ? 1 : 5} align="right">
          <Button variant="outlined" startIcon={<SyncIcon />} onClick={generatePdf}>
            Sync
          </Button>
        </Grid>
        <Grid item xs={12} md={categoryType == "Inter Office Note" ? 1.5 : 2} align="right">
          <Button variant="contained" onClick={savePdf}>
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
