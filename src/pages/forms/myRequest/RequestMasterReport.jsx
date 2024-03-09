import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import { convertDateFormat, convertDateYYYYMMDD, convertToDateandTime } from "../../../utils/Utils";
const initialValues = {
    dept_id: "",
    fromDate: "",
    toDate: "",
    status: "",
};
function AttendRequestMaster() {
    const [rows, setRows] = useState([]);
    const [modalContent, setModalContent] = useState({
        dept_id: "",
        fromDate: "",
        toDate: "",
        title: "",
        status: "",
        buttons: [],
    });
    const [modalOpen, setModalOpen] = useState(false);
    const setCrumbs = useBreadcrumbs();
    const [departmentOptions, setDepartmentOptions] = useState([]);

    const [values, setValues] = useState(initialValues);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getData();
        getDepartmentOptions()
        setCrumbs([{ name: " Master Service Report" }]);
    }, []);


    const handleSubmit = async () => {
      setIsLoading(true);
      let url = `/api/Maintenance/fetchAllPendingStatusDetails?dept_id=${values.dept_id}&complaintStatus=${values.status}&page=0&page_size=${10000}&sort=created_date`;
      if (values.fromDate && values.toDate) {
          url += `&fromDate=${convertDateYYYYMMDD(values.fromDate)}&toDate=${convertDateYYYYMMDD(values.toDate)}`;
      }
  
      // Make the axios request
      await axios
          .get(url)
          .then((res) => {
              console.log('res', res)
              setRows(res.data.data.Paginated_data.content);
              setIsLoading(false);
          })
          .catch((err) => console.error(err));
  };
  

    const getData = async (deptId) => {
        await axios
            .get(
                `/api/Maintenance/fetchAllPendingStatusDetails?complaintStatus=PENDING&page=0&page_size=${10000}&sort=created_date`
            )
            .then((res) => {
                setRows(res.data.data.Paginated_data.content);
            })
            .catch((err) => console.error(err));
    };

    const statusData = [
        { label: "Pending", value: "PENDING" },
        { label: "Under Process", value: "UNDERPROCESS" },
        { label: "Completed", value: "COMPLETED" },
    ]


    const handleChangeAdvance = async (name, newValue) => {
        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const getDepartmentOptions = async () => {

        await axios.get(`/api/getActiveDepartmentAssignmentBasedOnTag`)
            .then((res) => {
                setDepartmentOptions(
                    res.data.data.map((obj) => ({
                        value: obj.id,
                        label: obj.dept_name,
                    }))
                );
            })
            .catch((err) => console.error(err));
    };


    const getStatusCellStyle = (status) => {
        let text, color;
    
        switch (status.toUpperCase()) {
          case 'PENDING':
            text = 'Pending';
            color = 'red';
            break;
          case 'UNDERPROCESS':
            text = 'Under Process';
            color = 'red';
            break;
          case 'COMPLETED':
            text = 'Completed';
            color = 'green';
            break;
          default:
            text = status;
            color = 'black'; // Default color
            break;
        }
    
        return { color,text };
      };


    const columns = [
        { field: "serviceTicketId", headerName: "Ticket No", flex: 1 },
        { field: "dept_name", headerName: "Dept", flex: 1 },
    { field: "serviceTypeName", headerName: "Service", flex: 1 },
    
    
    {
      field: "complaintDetails",
      headerName: "Details",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.complaintDetails} arrow>
          <Typography
            variant="body2"
           
            sx={{
             
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
  
          >
            {params.row.complaintDetails.length > 15
              ? `${params.row.complaintDetails.slice(0, 18)}...`
              : params.row.complaintDetails}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "floorAndExtension",
      headerName: "Location",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.floorAndExtension} arrow>
          <Typography
            variant="body2"
           
            sx={{
             
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 150,
            }}
          >
            {params.row.floorAndExtension.length > 15
              ? `${params.row.floorAndExtension.slice(0, 18)}...`
              : params.row.floorAndExtension}
          </Typography>
        </Tooltip>
      ),
    },
   
    { field: "created_username", headerName: "Indents By", flex: 1 },
    {
      field: "createdDate", headerName: "Indents Date", flex: 1 ,
   renderCell: (params) =>
   (

     <Typography variant="body2">
    {params.row.createdDate ? convertToDateandTime(params.row.createdDate) : "--"}
   </Typography>
     
     )
 },
   {
      field: 'complaintStatus',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{fontWeight:"500"}} style={getStatusCellStyle(params.row.complaintStatus)}>
          
          {params.row.complaintStatus ? getStatusCellStyle(params.row.complaintStatus).text : "--"}
        </Typography>
      ),
    },
    
    { field: "complaintAttendedByName", headerName: "Rendered By", flex: 1 },
    { field: "dateOfClosed", headerName: "Closed on", flex: 1,
    renderCell: (params) =>
    (
      <Typography variant="body2">
     {params.row.dateOfClosed ? convertDateFormat(params.row.dateOfClosed) : "--"}
    </Typography>
    )
  },
  {
    field: "remarks",
    headerName: "Remarks",
    flex: 1,

    remarks: (params) =>(
      <Typography
      variant="subtitle2"
      color="primary"
      sx={{ cursor: "pointer",paddingLeft:0 }}
      >
    
     {params.row?.remarks ? params.row?.remarks : "--"}
     </Typography>
     )
  },
    ];

    return (
        <Box sx={{ position: "relative", mt: 3 }}>
            <FormWrapper>
                <Grid container columnSpacing={2} rowSpacing={2}>
                    <CustomModal
                        open={modalOpen}
                        setOpen={setModalOpen}
                        title={modalContent.title}
                        message={modalContent.message}
                        buttons={modalContent.buttons}
                    />

                    <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                            name="dept_id"
                            label="Department"
                            options={departmentOptions}
                            value={values.dept_id}
                            handleChangeAdvance={handleChangeAdvance}
                           
                        />

                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomAutocomplete
                            name="status"
                            label="Request Status"
                            value={values.status}
                            options={statusData}
                            handleChangeAdvance={handleChangeAdvance}
                          
                        />
                    </Grid>
                    <Grid item xs={12} md={2.5} >
                        <CustomDatePicker
                            name="fromDate"
                            label="From Date"
                            value={values.fromDate}
                            handleChangeAdvance={handleChangeAdvance}
                            
                        />
                    </Grid>
                    <Grid item xs={12} md={2.5} >
                        <CustomDatePicker
                            name="toDate"
                            label="To Date"
                            value={values.toDate}
                            handleChangeAdvance={handleChangeAdvance}
                            
                        />
                    </Grid>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disableElevation
                        sx={{ position: "absolute", right: 30, top: 30, borderRadius: 2 }}

                    >
                        GO
                    </Button>
                </Grid>
            </FormWrapper>
            <GridIndex rows={rows} columns={columns} />
        </Box>
    );
}

export default AttendRequestMaster;
