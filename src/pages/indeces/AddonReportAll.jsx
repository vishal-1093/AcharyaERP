import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import { Box, Grid, Button, IconButton } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import VisibilityIcon from '@mui/icons-material/Visibility';
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { GenerateAddonReportAll } from "./GenerateAddonReportAll";
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker")
);
const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));

function AddOnReportAll() {
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(null);
  const [reportPath, setReportPath] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  setCrumbs([]);

  const getMonthName = (monthValue) => {
    if (monthValue == 1) return "Jan"
    else if (monthValue == 2) return "Feb"
    else if (monthValue == 3) return "Mar"
    if (monthValue == 4) return "Apr"
    else if (monthValue == 5) return "May"
    else if (monthValue == 6) return "Jun"
    if (monthValue == 7) return "Jul"
    else if (monthValue == 8) return "Aug"
    else if (monthValue == 9) return "Sept"
    if (monthValue == 10) return "Oct"
    else if (monthValue == 11) return "Nov"
    else if (monthValue == 12) return "Dec"
  };

  const columns = [
    { field: "id", headerName: "SL.No.", flex: .2 },
    {
      field: "",
      headerName: "Application Status",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} onClick={() => handleIncentive(params)} />
        </IconButton>
      ),
    },
    { field: "empcode", headerName: "Emp Code", flex: 1 },
    {
      field: "employee_name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "designation_short_name",
      headerName: "Designation",
      flex: 1,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
    },
    {
      field: "schoolShortName",
      headerName: "Institute",
      flex: .8,
    },
    {
      field: "attachment",
      headerName: "View",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton
          sx={{ padding: 0, color: "primary.main" }}
        >
          <VisibilityIcon sx={{ fontSize: 22 }} onClick={() => handleFile(params)} />
        </IconButton>
      ),
    },
    {
      field: "certificate_attachment",
      headerName: "Certificate View",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <IconButton
          disabled={params.row.researchType != "Conference"}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <VisibilityIcon sx={{ fontSize: 22 }} onClick={() => handleCertificateFile(params)} />
        </IconButton>
      ),
    },
    {
      field: "date",
      headerName: "Applied Date",
      flex: 1,
      renderCell: (params) => (
        <>{moment(params.row.date).format("DD-MM-YYYY")}</>
      )
    },
    {
      field: "researchType",
      headerName: "Research Type",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Approved Amount",
      flex: 1,
      align: "right"
    },
    {
      field: "credited_month",
      headerName: "Pay Month",
      flex: 1,
      renderCell: (params) => (
        <>{`${getMonthName(params.row?.credited_month)}-${params.row?.credited_year}`}</>
      )
    }
  ];

  useEffect(() => {
    const handler = setTimeout(() => {

      getData(date)
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [date]);

  const handleChangeAdvance = (name, newValue) => {
    setDate(newValue)
  };

  const handleIncentive = async (params) => {
    try {
      let apiUrl = "";
      let { emp_id, researchType, typeId } = params.row;

      researchType === "Publication" ?
        apiUrl = `api/employee/publicationBasedOnEmpId?emp_id=${emp_id}` :
        (researchType == "BookChapter") ?
          apiUrl = `api/employee/bookChapterBasedOnEmpId?emp_id=${emp_id}` :
          (researchType == "Conference") ?
            apiUrl = `api/employee/conferenceBasedOnEmpId?emp_id=${emp_id}` :
            (researchType == "Membership") ?
              apiUrl = `/api/employee/membershipBasedOnEmpId?emp_id=${emp_id}` :
              (researchType == "Grant") ?
                apiUrl = `/api/employee/grantsBasedOnEmpId?emp_id=${emp_id}` :
                (researchType == "Patent") ?
                  apiUrl = `/api/employee/patentBasedOnEmpId?emp_id=${emp_id}` :
                  apiUrl = ""

      const res = await axios.get(apiUrl);
      if (res.status == 200 || res.status == 201) {
        navigate("/addonAll-incentive-application", {
          state: {
            isApprover: false,
            tabName: (params.row.researchType).toUpperCase(),
            rowData: res.data.data.find((ele) => ele.id == typeId),
            urlName: "/addon-report-all",
          },
        })
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

  const handleFile = async (params) => {
    try {
      let apiUrl = "";
      let { emp_id, researchType, typeId } = params.row;

      researchType === "Publication" ?
        apiUrl = `api/employee/publicationBasedOnEmpId?emp_id=${emp_id}` :
        (researchType == "BookChapter") ?
          apiUrl = `api/employee/bookChapterBasedOnEmpId?emp_id=${emp_id}` :
          (researchType == "Conference") ?
            apiUrl = `api/employee/conferenceBasedOnEmpId?emp_id=${emp_id}` :
            (researchType == "Membership") ?
              apiUrl = `/api/employee/membershipBasedOnEmpId?emp_id=${emp_id}` :
              (researchType == "Grant") ?
                apiUrl = `/api/employee/grantsBasedOnEmpId?emp_id=${emp_id}` :
                (researchType == "Patent") ?
                  apiUrl = `/api/employee/patentBasedOnEmpId?emp_id=${emp_id}` :
                  apiUrl = ""

      const res = await axios.get(apiUrl);
      if (res.status == 200 || res.status == 201) {
        const filePath = res.data.data.find((ele) => ele.id == typeId);
        getAttachment(researchType, filePath);
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

  const handleCertificateFile = async (params) => {
    try {
      let apiUrl = "";
      let { emp_id, researchType, typeId } = params.row;

      apiUrl = `api/employee/conferenceBasedOnEmpId?emp_id=${emp_id}`

      const res = await axios.get(apiUrl);
      if (res.status == 200 || res.status == 201) {
        const filePath = res.data.data.find((ele) => ele.id == typeId);
        getCertificate(filePath?.attachment_cert_path);
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
  }

  const getAttachment = async (researchType, path) => {
    let apiUrl = "";
    let { attachment_path, attachment_paper_path } = path;

    researchType === "Publication" ?
      apiUrl = `/api/employee/publicationsFileviews?fileName=${attachment_path}` :

      (researchType == "BookChapter") ?
        apiUrl = `/api/employee/bookChapterFileviews?fileName=${attachment_path}` :

        (researchType == "Conference") ?
          apiUrl = `/api/employee/conferenceFileviews?fileName=${attachment_paper_path}` :

          (researchType == "Membership") ?
            apiUrl = `/api/employee/membershipFileviews?fileName=${attachment_path}` :

            (researchType == "Grant") ?
              apiUrl = `/api/employee/grantFileviews?fileName=${attachment_path}` :

              (researchType == "Patent") ?
                apiUrl = `/api/employee/patentFileviews?fileName=${attachment_path}` :

                apiUrl = ""

    await axios
      .get(apiUrl, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const getCertificate = async (path) => {
    await axios
      .get(`/api/employee/conferenceCertificateFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const getData = async (selectedDate) => {
    try {
      setLoading(true);
      let apiUrl = "";
      if (selectedDate) {
        apiUrl = `/api/employee/incentiveApproverReport?creditedMonth=${moment(selectedDate).format("MM")}&&creditedYear=${moment(selectedDate).format("YYYY")}`
      } else {
        apiUrl = `/api/employee/incentiveApproverReport`
      }
      const res = await axios.get(apiUrl);
      if (res.status == 200 || res.status == 201) {
        setRows(res.data.data?.map((ele, id) => ({ ...ele, id: id + 1 })));
        setLoading(false);
      }
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

  const onClickPrint = async () => {
    const chunkArray = (array, chunkSize) =>
      Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
        array.slice(i * chunkSize, i * chunkSize + chunkSize)
      );

    const rowChunks = chunkArray(rows, 25);
    const pages = [];
    rowChunks.forEach((rowChunk) => {
      pages.push({ rows: rowChunk });
    });

    const grandTotalApprovedAmount = rows.reduce((sum,acc) => (sum + Number(acc.amount)),0);
    const reportResponse = await GenerateAddonReportAll(pages, date,grandTotalApprovedAmount);
    if (!!reportResponse) {
      setReportPath(URL.createObjectURL(reportResponse));
      setIsPrintModalOpen(!isPrintModalOpen);
    }
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        columnSpacing={4}
        sx={{marginTop:{xs:2,md:-1}}}
      >
        <Grid item xs={10} md={3}>
          <CustomDatePicker
            views={["month", "year"]}
            openTo="month"
            name="date"
            label="Pay Month"
            inputFormat="MM/YYYY"
            helperText="mm/yyyy"
            value={date}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
        <Grid item xs={4} align="right">
          <IconButton disabled={!rows.length}>
            <Button variant="contained" color={!rows.length ? "secondary" : "primary"} onClick={onClickPrint}>Print</Button>
          </IconButton>
        </Grid>
      </Grid>
      <ModalWrapper
        title=""
        maxWidth={1000}
        open={isPrintModalOpen}
        setOpen={setIsPrintModalOpen}
      >
        <Box borderRadius={3}>
          {!!reportPath && (
            <object
              data={reportPath}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative"}}>
         <Box sx={{position:"absolute",width:"100%", marginTop: { xs:5, md: 1 }, }}>
        <GridIndex rows={rows} columns={columns} loading={loading} />
         </Box>
      </Box>
    </>
  );
}
export default AddOnReportAll;
