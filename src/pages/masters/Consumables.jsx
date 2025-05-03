import { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../services/Api";

function Consumables() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [groupOptions, setGroupOptions] = useState([]);

  useEffect(() => {
    getGroupData();
  }, []);

  const getGroupData = async () => {
    try {
      const res = await axios.get(`/api/purchase/getGroupsForStockRegister`);
      const data = res.data.data;
      setGroupOptions(data);

      // If no tab is selected (not in pathname), navigate to the first tab
      if (data?.length > 0) {
        const firstTab = data[0];
        const formattedGroupName = firstTab.groupName.replaceAll(" ", "");
        const currentPath = `/Consumables/${formattedGroupName}/${firstTab.groupId}`;
        if (!pathname.includes(formattedGroupName)) {
          navigate(currentPath, { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container justifyContent="flex-start" columnSpacing={2}>
      {groupOptions?.map((tabItem, index) => {
        const formattedGroupName = tabItem?.groupName?.replaceAll(" ", "");
        const isSelected = pathname.includes(formattedGroupName);

        return (
          <Grid item key={index}>
            <Button
              onClick={() =>
                navigate(`/Consumables/${formattedGroupName}/${tabItem.groupId}`)
              }
              variant="none"
              sx={{
                backgroundColor: isSelected ? "#D3D3D3" : "",
                "&:hover": {
                  backgroundColor: isSelected ? "#D3D3D3" : "",
                },
              }}
            >
              {tabItem.groupName}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Consumables;
