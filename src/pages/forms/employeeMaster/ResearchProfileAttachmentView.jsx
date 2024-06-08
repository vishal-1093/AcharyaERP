import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../../services/Api";
import { Grid } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function ResearchProfileAttachmentView() {
  const [fileURL, setfileURL] = useState();

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const { approverScreen } = location.state;

  // useEffect(() => {
    // getUploadData();
    // setCrumbs([
    //   approverScreen
    //     ? { name: "Research Profile", link: "/ResearchProfile" }
    //     : {
    //         name: "Research Profile Attachment View",
    //         link: "/ResearchProfile/ResearchProfileAttachmentView",
    //       },
    // ]);
  // }, []);

  const getUploadData = async () => {
    await axios
      .get(`api/finance/FeeTemplate/${id}`)
      .then((res) => {
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
          .catch((error) => console.error(error));
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

export default ResearchProfileAttachmentView;
