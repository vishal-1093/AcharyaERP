import { useState, useEffect } from "react";
import { Tabs, Tab ,IconButton} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import axios from "../../../services/Api";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

// ResearchProfileAttachmentView

function ResearchProfile() {
  const [tab, setTab] = useState("Research Profile");
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const columns = [
    { field: "phdHolderPursuing", headerName: "PHD Status", flex: 1 },
    { field: "employee_name", headerName: "Employee Name", flex: 1 },
    {
      field: "employee_code",
      headerName: "Employee code",
      flex: 1,
      hide: true,
    },
    { field: "designation_name", headerName: "Designation", flex: 1 },
    { field: "dept_name", headerName: "Department", flex: 1 },
    {
      field: "instituteAffiliation",
      headerName: "Institute Affiliation",
      flex: 1,
      hide: true,
    },
    { field: "tenureStatus", headerName: "Tenure", flex: 1 },
    { field: "universityThesis", headerName: "University Thesis", flex: 1 },
    { field: "titleOfThesis", headerName: "Title Of Thesis", flex: 1 },

    { field: "phdRegisterDate", headerName: "Phd Register Date", flex: 1 },
    { field: "phdCompletedDate", headerName: "Phd Completed Date", flex: 1 },

    { field: "peerViewed", headerName: "Peer Viewed", flex: 1, hide: true },
    {
      field: "noOfConferences",
      headerName: "No Of Conferences",
      flex: 1,
      hide: true,
    },
    {
      field: "professionalOrganisation",
      headerName: "Professional Organization",
      flex: 1,
      hide: true,
    },
    {
      field: "partOfResearchProject",
      headerName: "Part Of Research Project",
      flex: 1,
      hide: true,
    },
    {
      field: "yesNumberOfProjects",
      headerName: "Number Of Projects",
      flex: 1,
      hide: true,
    },
    { field: "keywordsResearch", headerName: "keyword Research", flex: 1 },
    {
      field: "techniquesExpert",
      headerName: "Techniques Expert",
      flex: 1,
      hide: true,
    },
    {
      field: "currentProfessional",
      headerName: "Current Professional",
      flex: 1,
      hide: true,
    },
    {
      field: "areasOfExpertise",
      headerName: "Area Of Expertise",
      flex: 1,
      hide: true,
    },
    {
      field: "researchForCollaboration",
      headerName: "Research For Collaboration",
      flex: 1,
      hide: true,
    },
    {
      field: "googleScholar",
      headerName: "Google Scholar",
      flex: 1,
      hide: true,
    },
    {
      field: "googleScholar1",
      headerName: "Other Citation Database",
      flex: 1,
      hide: true,
    },
    {
      field: "researchAttachment",
      headerName: "Attachment",
      type: "actions",
      flex: 1,
      hide: true,
      getActions: (params) => [
          <IconButton
          // onClick={() =>
          //   navigate(`/researchProfileAttachmentView?fileName=${params.row?.researchAttachment}`, {
          //     state: { approverScreen: true },
          //   })
          // }
            color="primary"
          >
            <CloudDownloadIcon fontSize="small" />
          </IconButton>
      ],
    },
    { field: "createdUsername", headerName: "Created By", flex: 1, hide: true },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
  ];

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllProfileResearch?page=0&page_size=10&sort=createdDate`
      )
      .then((res) => {
        setRows(res?.data?.data?.Paginated_data?.content);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setCrumbs([{ name: "Research Profile" }]);
    getData();
  }, []);

  return (
    <>
      <Tabs value={tab}>
        <Tab value="Research Profile" label="Research Profile" />
      </Tabs>
      {/* {tab === "Mentor" && <ProctorheadIndex />} */}

      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/ResearchProfileForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default ResearchProfile;
