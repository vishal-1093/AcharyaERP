import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Grid } from "@mui/material";

function ViewLeavePDF() {
  const { id } = useParams();
  const [fileURL, setfileURL] = useState();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getUploadData();
  }, []);
  const getUploadData = async () => {
    await axios
      .get(`/api/LeaveType/${id}`)
      .then((res) => {
        const path = res.data.data.leave_type_path;
        axios(`api/leaveTypeFileviews?fileName=${path}`, {
          method: "GET",
          responseType: "blob",
        })
          .then((res) => {
            const file = new Blob([res.data], { type: "application/pdf" });
            const url = URL.createObjectURL(file);
            setfileURL(url);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        {fileURL ? (
          <iframe
            width="100%"
            style={{ height: "100vh" }}
            src={fileURL}
          ></iframe>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
export default ViewLeavePDF;
