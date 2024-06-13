import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../services/Api";
import { Grid } from "@mui/material";

function EmployeeTypeAttachmentView() {
  const [fileURL, setfileURL] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fileName = queryParams.get("fileName");

  useEffect(() => {
    getUploadData();
  }, []);

  const getUploadData = async () => {
    await axios(`api/employee/employeePermanentFileViews?fileName=${fileName}`, {
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        setfileURL(url);
      })
      .catch((error) => console.error(error));
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

export default EmployeeTypeAttachmentView;
