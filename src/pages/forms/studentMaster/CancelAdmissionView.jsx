import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const StudentDetails = lazy(() => import("../../../components/StudentDetails"));
const StudentFeeDetails = lazy(() =>
  import("../../../components/StudentFeeDetails")
);

const breadCrumbsList = [
  { name: "Cancelled Admissions", link: "/approve-canceladmission" },
];

function CancelAdmissionView() {
  const [data, setData] = useState([]);

  const { id, cancelId } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`/api/getCancelAdmission/${cancelId}`);
      const responseData = response.data.data;
      setData(responseData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";
      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
      setAlertOpen(true);
    }
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2} lg={1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Box>
      <Grid container rowSpacing={4} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <StudentDetails id={id} />
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Card>
            <CardHeader
              title="Cancellation Details"
              titleTypographyProps={{
                variant: "subtitle2",
              }}
              sx={{
                backgroundColor: "tableBg.main",
                color: "tableBg.textColor",
                textAlign: "center",
                padding: 1,
              }}
            />
            <CardContent>
              <Grid container columnSpacing={2} rowSpacing={1}>
                <DisplayContent
                  label="Cancel Initiated	By"
                  value={data.created_username}
                />
                <DisplayContent
                  label="Cancel Initiated	Date"
                  value={
                    data.created_date
                      ? moment(data.created_date).format("DD-MM-YYYY LT")
                      : ""
                  }
                />
                <DisplayContent label="Approved By" value={data.approved_by} />
                <DisplayContent
                  label="Approved Date"
                  value={
                    data.approved_date
                      ? moment(data.approved_date).format("DD-MM-YYYY LT")
                      : ""
                  }
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <StudentFeeDetails id={id} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CancelAdmissionView;
