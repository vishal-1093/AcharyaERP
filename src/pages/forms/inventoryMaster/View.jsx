import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function ViewVendorPdf() {
  const { id } = useParams();
  const [fileUrl, setFileUrl] = useState(false);
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    axios
      .get(`/api/inventory/vendorAttachment/${id}`)
      .then((res) => {
        const path = res.data.data.vendor_attachment_path;
        axios
          .get(`/api/inventory/vendorFileDownload?fileName=${path}`, {
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
      .catch((error) => {
        console.error(error);
      });

    setCrumbs([
      { name: "Inventory Master", link: "/InventoryMaster/Vendor" },
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
export default ViewVendorPdf;
