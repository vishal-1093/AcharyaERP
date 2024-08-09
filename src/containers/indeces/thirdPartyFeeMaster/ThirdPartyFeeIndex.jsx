import { useState, useEffect, lazy } from "react";
import {
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../services/Api";
import moment from "moment";
const GridIndex = lazy(() => import("../../../components/GridIndex"));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const initialState = {
  thirdPartyFeeList: [],
};

const ThirdPartyFeeIndex = () => {
  const [{ thirdPartyFeeList }, setState] = useState(initialState);
  const [tab, setTab] = useState("ThirdPartyFee");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([{ name: "Third Party Fee" }]);
    getThirdPartyData();
  }, []);

  const getThirdPartyData = async () => {
    try {
      const res = await axios.get(
        `/api/otherFeeDetails/getOtherFeetemplate?pageNo=0&pageSize=1000`
      );
      const lists = res?.data?.data?.content.map((ele, index) => ({
        ...ele,
        id: index + 1,
      }));
      setState((prevState) => ({
        ...prevState,
        thirdPartyFeeList: lists,
      }));
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const columns = [
    { field: "institute", headerName: "Institute", flex: 1 },
    {
      field: "acYear",
      headerName: "Academic Year",
      flex: 1,
    },
    {
      field: "feetype",
      headerName: "Fee Type",
      flex: 1,
    },
    {
      field: "program",
      headerName: "Program",
      flex: 1,
    },
    {
      field: "programSpecilization",
      headerName: "Program Specilization",
      flex: 1,
    },
    {
      field: "uniformNumber",
      headerName: "Uniform Number",
      flex: 1,
    },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) =>
        params.row.createdDate
          ? moment(params.row.createdDate).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      flex: 1,
    },
    {
      field: "modifiedDate",
      headerName: "Modified Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) =>
        params.row.modifiedDate
          ? moment(params.row.modifiedDate).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="Edit">
          <IconButton
            onClick={() =>
              navigate(`/ThirdPartyFeeForm`, {
                state: params.row,
              })
            }
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
  ];

  return (
    <>
      <Tabs value={tab}>
        <Tab value="ThirdPartyFee" label="Third Party Fee" />
      </Tabs>
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/ThirdPartyFeeForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={thirdPartyFeeList || []} columns={columns} />
      </Box>
    </>
  );
};

export default ThirdPartyFeeIndex;
