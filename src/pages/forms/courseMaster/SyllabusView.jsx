import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";
import { Grid } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function SyllabusView() {
  const [fileURL, setfileURL] = useState();

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getUploadData();
    setCrumbs([
      { name: "Syllabus Index", link: "SyllabusIndex" },
      {
        name: "View",
      },
    ]);
  }, []);

  const getUploadData = async () => {
    await axios
      .get(`api/academic/syllabus/${id}`)
      .then((res) => {
        const path = res.data.data.syllabus_path;
        axios(`api/academic/syllabusViews?fileName=${path}`, {
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

export default SyllabusView;
