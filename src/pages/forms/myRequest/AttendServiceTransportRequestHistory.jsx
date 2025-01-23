import { useEffect, lazy } from "react";
import { useLocation } from "react-router-dom";
import {Box} from '@mui/material';
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const ServiceTransportView = lazy(() => import("./ServiceTransportView"));

function AttendServiceRequest() {
  const location = useLocation();
  const rowData = location?.state?.row;
  const setCrumbs = useBreadcrumbs();
  
  useEffect(() => {
    setCrumbs([
      { name: "Service History Transport", link: "/ServiceRenderTransport/AttendHistory" },
      { name: "View Vehicle Indent" }
    ]);
  }, []);

  return (
      <ServiceTransportView id={rowData?.id} />
  );
}

export default AttendServiceRequest;
