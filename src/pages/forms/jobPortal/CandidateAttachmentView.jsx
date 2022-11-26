import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";

function CandidateAttachmentView() {
  const [file, setFile] = useState();

  const { id, type } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const file = await axios
      .get(`/api/employee/getAllApplicantDetails/${id}`)
      .then((res) => {
        if (type === "1") {
          return res.data.Job_Profile.Resume_Attachment.attachment_path;
        } else if (type === "2") {
          return res.data.Job_Profile.Higher_Education_Attachment
            .he_attachment_path;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    await axios(`/api/employee/jobFileviews?fileName=${file}`, {
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var url = URL.createObjectURL(file);
        setFile(url);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return <iframe width="100%" style={{ height: "100vh" }} src={file}></iframe>;
}

export default CandidateAttachmentView;
