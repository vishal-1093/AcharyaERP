import { useState, useEffect, lazy } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DownloadIcon from '@mui/icons-material/Download';
import moment from "moment";
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs";
import axios from "../../../../services/Api";
import useAlert from "../../../../hooks/useAlert";
import { convertUTCtoTimeZone } from "../../../../utils/DateTimeUtils";
import { GenerateLockedBillingReport } from "./GenerateLockedBillingReport.jsx";
const GridIndex = lazy(() => import("../../../../components/GridIndex"));
const ModalWrapper = lazy(() => import("../../../../components/ModalWrapper"));
const CustomRadioButtons = lazy(() =>
  import("../../../../components/Inputs/CustomRadioButtons")
);

const initialValues = {
  approverStatus: null
};

const empId = sessionStorage.getItem("empId");

function RefreshmentBillingLockedIndex() {
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportPath, setReportPath] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [rowData, setRowData] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    vendor_id: [values.vendor_id !== ""],
    remarks: [values.remarks !== ""],
    approver_remarks: [values.approver_remarks !== ""],
    delivery_address: [values.delivery_address !== ""],
  };

  const errorMessages = {
    remarks: ["This field required"],
    vendor_id: ["This field required"],
    approver_remarks: ["This field required"],
    delivery_address: ["This field required"],
  };

  useEffect(() => {
    setCrumbs([
      { name: "Refreshment Billing Index"},
    ]);
    getIpAddress();
    getData();
  }, []);

  const getIpAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const responseData = await response.json();
      setIpAddress(responseData?.ip)
    } catch (error) {
      console.error(error)
    }
  };

  const getData = async () => {
    await axios
      .get(
        `api/fetchAllMealBillDetailsGrouped?page=0&page_size=100&sort=created_date`
      )
      .then((res) => {
        const list = res.data.data.Paginated_data.content.map((ele, i) => ({
          ...ele,
          index: i + 1
        }))
        setRows(list);
      })
      .catch((err) => console.error(err));
  };

  const openDataModal = async (data) => {
    setIsModalOpen(true);
    setRowData(data)
  };

  const columns = [
    {
      field: "index",
      headerName: "Sl.No.",
      flex: 1,
    },
    {
      field: "month_year",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    },
    {
      field: "vendor_name",
      headerName: "Vendor",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Catering bill",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="paragraph" color="primary"
          sx={{ cursor: "pointer" }}
          onClick={()=>onClickPrint(params.row,"amount")}>
          {params.row.total}
        </Typography>
      )
    },
    {
      field: "created_username",
      headerName: "Locked By",
      flex: 1,
    },
    {
      field: "lock_date",
      headerName: "Locked Date",
      flex: 1,
      hide:true,
      renderCell: (params) => (
        <>{moment(params.row?.lock_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      field: "approvedByUserName",
      headerName: "Approver",
      flex: 1,
      renderCell: (params) =>
        !!params.row?.approved_by ? (
          <Typography
            variant="paragraph"
            sx={{textAlign: "center" }}
          >
            {params.row?.approvedByUserName}
          </Typography>
        ) : (
          <IconButton onClick={() => openDataModal(params.row)}>
            <AddCircleIcon color="primary" />
          </IconButton>
        ),
    },
    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <>{moment(params.row?.approved_date).format("DD-MM-YYYY")}</>
      )
    },
    {
      field: "print",
      headerName: "Print",
      flex: 1,
      renderCell:(params)=>(
        <IconButton disabled={!params.row.approve_status} onClick={()=>onClickPrint(params.row,"print")}>
          <DownloadIcon color={!!params.row.approve_status ? "primary": "secondary"}/>
        </IconButton>
      )
    },
  ];

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApproverStatus = async () => {
    setLoading(true);
    rowData.approve_status = values.approverStatus == "true" ? true : false;
    rowData.meal_bill_id = rowData.id;
    rowData.approved_by = empId;
    rowData.approved_date = convertUTCtoTimeZone(new Date());
    rowData.approved_ipAddress = ipAddress;
    try {
      const res = await axios.put(`api/updateMealBill/${rowData?.id}`, rowData);
      if (res.status == 200 || res.status == 201) {
        setAlertMessage({
          severity: "success",
          message: `Catering bill is approved successfully.`,
        });
        setAlertOpen(true);
        getData();
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const onClickPrint = async (rowData,type) => {
    try {
      const res = await axios.get(`/api/fetchAllMealBillDetails?page=0&page_size=100&sort=created_date&bill_number=${rowData.bill_number}`);
      if(res.status == 200 || res.status == 201){
        const list = res.data.data.Paginated_data.content.reverse();
        const chunkArray = (array, chunkSize) =>
          Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
            array.slice(i * chunkSize, i * chunkSize + chunkSize)
          );
    
        // Chunk rows and columns into smaller arrays (e.g., 20 per page)
        const rowChunks = chunkArray(list, 60); // 30 rows per page
        const pages = [];
        rowChunks.forEach((rowChunk) => {
          pages.push({ rows: rowChunk});
        });
        const reportResponse = await GenerateLockedBillingReport(pages,rowData,type);
        if (!!reportResponse) {
          setReportPath(URL.createObjectURL(reportResponse));
          type === "print" ? setIsPrintModalOpen(!isPrintModalOpen): setIsAmountModalOpen(!isAmountModalOpen);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const modalData = () => {
    return (
      <>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={4}
          justifyContent="flexStart"
          alignItems="center"
          padding={1}
        >
          <Grid item xs={12} md={12}>
            <Grid container>
              <Grid item xs={12} md={12} mb={1}>
                <Typography>Status :</Typography>
              </Grid>
              <Grid item xs={12} md={12} mb={2}>
                <CustomRadioButtons
                  name="approverStatus"
                  label=""
                  value={values.approverStatus}
                  items={[
                    {
                      value: true,
                      label: "Approved",
                    },
                    {
                      value: false,
                      label: "Rejected",
                    },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} mb={3}>
            <Button
              variant="contained"
              disableElevation
              sx={{ position: "absolute", right: 40, borderRadius: 2 }}
              onClick={handleApproverStatus}
              disabled={loading || !values.approverStatus}
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
        </Grid>
      </>
    );
  };

  return (
    <>
      <ModalWrapper
        maxWidth={500}
        title="Locked Billing Approve"
        open={isModalOpen}
        setOpen={setIsModalOpen}
      >
        {modalData()}
      </ModalWrapper>

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

      <ModalWrapper
        title=""
        maxWidth={1000}
        open={isAmountModalOpen}
        setOpen={setIsAmountModalOpen}
      >
        <Box borderRadius={3}>
          {!!reportPath && (
            <object
              data={`${reportPath}#toolbar=0`}
              type="application/pdf"
              height= "450px"
              width= "100%"
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 1 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default RefreshmentBillingLockedIndex;
