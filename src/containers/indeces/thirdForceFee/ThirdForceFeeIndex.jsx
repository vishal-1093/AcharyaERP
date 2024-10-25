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
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../../components/CustomModal";
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

const modalContents = {
  title: "",
  message: "",
  buttons: [],
};

const initialState = {
  thirdPartyFeeList: [],
  modalOpen: false,
  modalContent: modalContents,
};

const ThirdForceFeeIndex = () => {
  const [{ thirdPartyFeeList, modalOpen, modalContent }, setState] =
    useState(initialState);
  const [tab, setTab] = useState("ThirdForceFee");
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

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
      flex: 2,
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
      valueGetter: (params) =>
        params.row.programSpecilization
          ? params.row.programSpecilization
          : "NA",
    },
    {
      field: "uniformNumber",
      headerName: "Auid Format",
      flex: 1,
      valueGetter: (params) =>
        params.row.uniformNumber ? params.row.uniformNumber : "NA",
    },
    {
      field: "total",
      headerName: "Total Amount",
      flex: 1,
    },
    { field: "createdBy", headerName: "Created By", flex: 1, hide: true },
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
      hide: true,
    },
    {
      field: "modifiedDate",
      headerName: "Modified Date",
      flex: 1,
      hide: true,
      type: "date",
      valueGetter: (params) =>
        params.row.modifiedDate !== params.row.createdDate
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
              navigate(`/ThirdForceFeeForm`, {
                state: params.row,
              })
            }
            disabled={!params.row.active}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <HtmlTooltip title="Make list inactive">
            <GridActionsCellItem
              icon={<Check />}
              label="Result"
              style={{ color: "green" }}
              onClick={() => handleActive(params)}
            >
              {params.active}
            </GridActionsCellItem>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title="Make list active">
            <GridActionsCellItem
              icon={<HighlightOff />}
              label="Result"
              style={{ color: "red" }}
              onClick={() => handleActive(params)}
            >
              {params.active}
            </GridActionsCellItem>
          </HtmlTooltip>
        ),
        ,
      ],
    },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Third Force Fee" }]);
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

  const handleActive = async (params) => {
    const otherFeeTemplateId = params.row.otherFeeTemplateId;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        try {
          const res = await axios.delete(
            `/api/otherFeeDetails/deleteOtherFeeTemplate?otherFeeTemplateId=${otherFeeTemplateId}`
          );
          if (res.status === 200) {
            closeModalAndGetData();
          }
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: "An error occured",
          });
          setAlertOpen(true);
        }
      } else {
        try {
          const res = await axios.get(
            `/api/otherFeeDetails/reactiveOtherFeetemplate?otherFeeTemplateId=${otherFeeTemplateId}`
          );
          if (res.status === 200) {
            closeModalAndGetData();
          }
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: "An error occured",
          });
          setAlertOpen(true);
        }
      }
    };
    params.row.active === true
      ? setModalContent("", "Do you want to make it Inactive?", [
          { name: "No", color: "primary", func: () => {} },
          { name: "Yes", color: "primary", func: handleToggle },
        ])
      : setModalContent("", "Do you want to make it Active?", [
          { name: "No", color: "primary", func: () => {} },
          { name: "Yes", color: "primary", func: handleToggle },
        ]);
  };

  const setModalContent = (title, message, buttons) => {
    setState((prevState) => ({
      ...prevState,
      modalContent: {
        ...prevState.modalContent,
        title: title,
        message: message,
        buttons: buttons,
      },
    }));
  };

  const setModalOpen = (val) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: val,
    }));
  };

  const closeModalAndGetData = () => {
    getThirdPartyData();
    setModalOpen(false);
  };

  return (
    <>
      <Tabs value={tab}>
        <Tab value="ThirdForceFee" label="Third Force Fee" />
      </Tabs>
      <Box sx={{ position: "relative", mt: 2 }}>
        {!!modalOpen && (
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />
        )}
        <Button
          onClick={() => navigate("/ThirdForceFeeForm")}
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

export default ThirdForceFeeIndex;
