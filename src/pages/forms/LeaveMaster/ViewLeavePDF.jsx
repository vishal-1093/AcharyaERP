import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function ViewLeavePDF() {
  const { id } = useParams();
  const [fileUrl, setFileUrl] = useState(false);
  const setCrumbs = useBreadcrumbs();

  useEffect(async () => {
    await axios
      .get(`/api/LeaveType/${id}`)
      .then((res) => {
        const path = res.data.data.leave_type_path;
        axios
          .get(`/api/leaveTypeFileviews?fileName=${path}`, {
            responseType: "blob",
          })
          .then((res) => {
            const file = new Blob([res.data], { type: "application/pdf" });
            let url = URL.createObjectURL(file);
            setFileUrl(url);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => console.error(error));

    setCrumbs([
      { name: "Leave Master", link: "/LeaveMaster" },
      { name: "View" },
    ]);
  }, []);
  return (
    <>
      {fileUrl ? (
        <iframe
          src={fileUrl}
          style={{ width: "90vw", height: "80vh" }}
        ></iframe>
      ) : (
        ""
      )}
    </>
  );
}
export default ViewLeavePDF;
