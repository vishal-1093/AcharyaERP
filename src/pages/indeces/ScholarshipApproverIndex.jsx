import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { IconButton } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Visibility } from "@mui/icons-material";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import { Print } from "@mui/icons-material";
import { GenerateScholarshipApplication } from "../forms/candidateWalkin/GenerateScholarshipApplication";

const OverlayLoader = lazy(() => import("../../components/OverlayLoader"));

const breadCrumbsList = [{ name: "Approve Scholarship" }];

function ScholarshipApproverIndex() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/student/getIsVerifiedDataForIndex",
        {
          params: { page: 0, page_size: 10000, sort: "created_date" },
        }
      );
      setRows(response.data.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleDownload = async (obj) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/ScholarshipAttachmentFileviews?fileName=${obj}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to download the document !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePrint = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "/api/student/getStudentDetailsBasedOnAuidAndStrudentId",
        { params: { auid: data.auid } }
      );
      const studentData = response.data.data[0];

      const schResponse = await axios.get(
        `/api/student/fetchScholarship2/${data.scholarship_id}`
      );
      const schData = schResponse.data.data[0];

      const blobFile = await GenerateScholarshipApplication(
        studentData,
        schData
      );

      if (blobFile) {
        window.open(URL.createObjectURL(blobFile));
      } else {
        setAlertMessage({
          severity: "error",
          message: "Failed to generate scholarship application print !!",
        });
        setAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to generate scholarship application print !!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable: false,
    },
    {
      field: "requested_by",
      headerName: "Requested By",
      flex: 1,
      hide: true,
    },
    {
      field: "requested_date",
      headerName: "Requested Date",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        moment(params.row.requested_date).format("DD-MM-YYYY LT"),
    },
    {
      field: "requested_scholarship",
      headerName: "Requested Amount",
      flex: 1,
    },
    {
      field: "verified_name",
      headerName: "Verified By",
      flex: 1,
      hide: true,
    },
    {
      field: "verified_date",
      headerName: "Verified Date",
      flex: 1,
      hide: true,
      renderCell: (params) =>
        moment(params.row.verified_date).format("DD-MM-YYYY LT"),
    },
    {
      field: "verified_amount",
      headerName: "Verified Amount",
      flex: 1,
    },
    {
      field: "verifier_remarks",
      headerName: "Verifier Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "scholarship_attachment_path",
      headerName: "Document",
      flex: 1,
      hide: true,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownload(params.row.scholarship_attachment_path)}
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" sx={{ fontSize: 20 }} />
        </IconButton>
      ),
    },
    {
      field: "id",
      headerName: "Application Print",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleGeneratePrint(params.row)}
          sx={{ padding: 0 }}
        >
          <Print color="primary" />
        </IconButton>
      ),
    },
    {
      field: "is_approved",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          label="Result"
          color="primary"
          onClick={() =>
            navigate(
              `/ScholarshipApproverForm/${params.row.auid}/${params.row.scholarship_id}`
            )
          }
          sx={{ padding: 0 }}
        >
          <AddBoxIcon />
        </IconButton>
      ),
    },
  ];

  return isLoading ? (
    <OverlayLoader />
  ) : (
    <GridIndex rows={rows} columns={columns} />
  );
}

export default ScholarshipApproverIndex;
