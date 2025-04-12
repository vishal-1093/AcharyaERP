import { useState, useEffect } from "react";
import { Tabs, Tab, IconButton } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import GridIndex from "../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import axios from "../../services/Api";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import moment from "moment";

function ResearchProfileIndex() {
  const [tab, setTab] = useState("Research Profile");
  const [rows, setRows] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
      empcode: false,
      school_name_short:false,
      peerViewed: false,
      noOfConferences: false,
      professionalOrganisation: false,
      partOfResearchProject: false,
      yesNumberOfProjects:false,
      keywordsResearch:false,
      techniquesExpert:false,
      currentProfessional:false,
      areasOfExpertise:false,
      researchForCollaboration:false,
      googleScholar:false,
      otherCitationDatabase:false,
      linkedInLink:false,
      researchAttachment:false,
      createdUsername:false
    });
  const columns = [
    { field: "phdHolderPursuing", headerName: "PhD Status", flex: 1 },
    { field: "employee_name", headerName: "Employee", flex: 1 },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 1,
    },
    { field: "designation_short_name", headerName: "Designation", flex: 1 },
    { field: "dept_name_short", headerName: "Department", flex: 1 },
    {
      field: "school_name_short",
      headerName: "Institute",
      flex: 1,
    },
    { field: "tenureStatus", headerName: "PhD Tenure", flex: 1 },
    { field: "universityName", headerName: "University Studied", flex: 1 },
    { field: "titleOfThesis", headerName: "Title Of Thesis", flex: 1 },

    { field: "phdRegisterDate", headerName: "Register Date", flex: 1 ,
      valueGetter: (value, row) =>
        row.phdRegisterDate ? moment(row.phdRegisterDate).format("DD-MM-YYYY"):'-',
    },
    { field: "phdCompletedDate", headerName: "Completed Date", flex: 1,
      valueGetter: (value, row) =>
      row.phdCompletedDate? moment(row.phdCompletedDate).format("DD-MM-YYYY") : '-',
     },

    { field: "peerViewed", headerName: "Peer Viewed", flex: 1},
    {
      field: "noOfConferences",
      headerName: "No Of Conferences",
      flex: 1,
    },
    {
      field: "professionalOrganisation",
      headerName: "Professional Organization",
      flex: 1,
    },
    {
      field: "partOfResearchProject",
      headerName: "Part Of Research Project",
      flex: 1,
    },
    {
      field: "yesNumberOfProjects",
      headerName: "Number Of Projects",
      flex: 1,
    },
    { field: "keywordsResearch", headerName: "Keyword Research", flex: 1},
    {
      field: "techniquesExpert",
      headerName: "Techniques Expert",
      flex: 1,
    },
    {
      field: "currentProfessional",
      headerName: "Current Professional",
      flex: 1,
    },
    {
      field: "areasOfExpertise",
      headerName: "Area Of Expertise",
      flex: 1,
    },
    {
      field: "researchForCollaboration",
      headerName: "Research For Collaboration",
      flex: 1,
    },
    {
      field: "googleScholar",
      headerName: "Google Scholar",
      flex: 1,
    },
    {
      field: "otherCitationDatabase",
      headerName: "Other Citation Database",
      flex: 1,
    },
    {
      field: "linkedInLink",
      headerName: "Link",
      flex: 1,
      renderCell: (params) => <a href={params.row.linkedInLink} target="_blank" rel="noopener noreferrer">{params.row.linkedInLink}</a>
    },
    {
      field: "researchAttachment",
      headerName: "Attachment",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton
        disabled={!params.row?.researchAttachment}
          onClick={() =>
            navigate(
              `/ResearchProfileAttachmentView?fileName=${params.row?.researchAttachment}`,
              {
                state: { approverScreen: true },
              }
            )
          }
          color="primary"
        >
          <CloudDownloadIcon fontSize="small" />
        </IconButton>,
      ],
    },
    { field: "createdUsername", headerName: "Created By", flex: 1},
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.createdDate ? moment(row.createdDate).format("DD-MM-YYYY"):'-',
    },
  ];

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllProfileResearchForEmployee`
      )
      .then((res) => {
        setRows((res?.data?.data).reverse());
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (location?.state?.offerId && location?.state?.userId) {
      const { offerId, userId } = location.state;
      setCrumbs([{ name: "My Profile", link: `/EmployeeDetailsView/${userId}/${offerId}/profile` }]);
    } else {
      setCrumbs([{ name: "My Profile", link: `/MyProfile`  }]);
    }
    getData();
  }, [location]);

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/ResearchProfileForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -50, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <Box sx={{position:"absolute",width:"100%", }}>
          <GridIndex rows={rows} columns={columns} columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel} />
        </Box>
      </Box>
    </>
  );
}

export default ResearchProfileIndex;
