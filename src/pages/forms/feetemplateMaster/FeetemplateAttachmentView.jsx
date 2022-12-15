import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";
import { Grid } from "@mui/material";

function FeetemplateAttachmentView() {
  const [fileURL, setfileURL] = useState();

  const { id } = useParams();

  useEffect(() => {
    getUploadData();
  }, []);

  const getUploadData = async () => {
    await axios.get(`api/finance/FeeTemplate/${id}`).then((res) => {
      const path = res.data.data.fee_template_path;
      axios(`api/finance/FeeTemplateFileviews?fileName=${path}`, {
        method: "GET",
        responseType: "blob",
      })
        .then((res) => {
          const file = new Blob([res.data], { type: "application/pdf" });
          const url = URL.createObjectURL(file);
          setfileURL(url);
        })
        .catch((error) => {
          console.log(error);
        });
    });
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
          ""
        )}
      </Grid>
    </Grid>
  );
}

export default FeetemplateAttachmentView;
