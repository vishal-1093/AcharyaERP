import { useState, useEffect } from "react";
import { Box, Tabs, Tab, Button, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import GroupIndex from "../../containers/indeces/accountMaster/GroupIndex";
import LedgerIndex from "../../containers/indeces/accountMaster/LedgerIndex";
import TallyheadIndex from "../../containers/indeces/accountMaster/TallyheadIndex";
import VoucherIndex from "../../containers/indeces/accountMaster/VoucherIndex";
import OpeningBalanceUpdateIndex from "../../containers/indeces/accountMaster/OpeningBalanceUpdateIndex";
import ExpenditureIndex from "../../containers/indeces/inventoryMaster/Expenditure";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import Expenditure from "../../containers/indeces/inventoryMaster/Expenditure";
import FixedAssets from "../../containers/indeces/inventoryMaster/FixedAssets";
import ButtonGroup from "@mui/material/ButtonGroup";

const tabsData = [
  {
    label: "Group",
    value: "Group",
    component: GroupIndex,
  },
  {
    label: "Ledger",
    value: "Ledger",
    component: LedgerIndex,
  },
  {
    label: "Tallyhead",
    value: "Tallyhead",
    component: TallyheadIndex,
  },
  {
    label: "Voucher Head",
    value: "Voucherhead",
    component: VoucherIndex,
  },
  {
    label: "Opening Balance",
    value: "OpeningBalance",
    component: OpeningBalanceUpdateIndex,
  },
];

function Consumables({ groupName }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL

  const [tab, setTab] = useState("Expenditure");
  const [groupOptions, setGroupOptions] = useState([]);

  const [dynamicFunctions, setDynamicFunctions] = useState({});

  // Update the tab state when the URL changes
  useEffect(() => {
    getGroupData();
  }, []);

  const getGroupData = async () => {
    await axios
      .get(`/api/group`)
      .then((res) => {
        setGroupOptions(res.data.data);
        const functionsObject = {};
        res.data.data.forEach((obj) => {
          functionsObject[obj.group_name] = () => {
            setTab(obj.group_name.replaceAll(" ", ""));
          };
        });
        setDynamicFunctions(functionsObject);
      })
      .catch((error) => console.error(error));
  };

  console.log(tab);

  return (
    <>
      <Grid container justifyContent="flex-start" columnSpacing={2}>
        {groupOptions?.map((tabItem) => {
          return (
            <>
              <Grid item>
                <Button
                  onClick={() => {
                    setTab(tabItem.group_name.replaceAll(" ", ""));
                    navigate(
                      `/Consumables/${tabItem.group_name.replaceAll(" ", "")}/${
                        tabItem.group_id
                      }`
                    );
                  }}
                  variant="none"
                  sx={{
                    backgroundColor:
                      tabItem.group_name.replaceAll(" ", "") === tab
                        ? "green"
                        : "",
                    "&:hover": {
                      backgroundColor: "none",
                    },
                  }}
                >
                  {tabItem.group_name}
                </Button>
              </Grid>
            </>
          );
        })}
      </Grid>
    </>
  );
}

export default Consumables;
