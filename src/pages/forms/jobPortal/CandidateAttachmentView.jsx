import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ApiUrl from "../../../services/Api";

const CandidateAttachmentView = () => {
  const { id, type } = useParams();
  const [file, setFile] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const file = await axios
      .get(`${ApiUrl}/employee/getAllApplicantDetails/${id}`)
      .then((res) => {
        if (type === "1") {
          return res.data.Job_Profile.Resume_Attachment.attachment_path;
        } else if (type === "2") {
          return res.data.Job_Profile.Higher_Education_Attachment
            .he_attachment_path;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    await axios(`${ApiUrl}/employee/jobFileviews?fileName=${file}`, {
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var url = URL.createObjectURL(file);
        setFile(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <iframe width="100%" style={{ height: "100vh" }} src={file}></iframe>
    </>
  );
};

export default CandidateAttachmentView;
