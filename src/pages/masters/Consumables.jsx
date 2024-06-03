import { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../services/Api";

function Consumables() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [groupOptions, setGroupOptions] = useState([]);

  // Update the tab state when the URL changes
  useEffect(() => {
    getGroupData();
  }, []);

  const getGroupData = async () => {
    await axios
      .get(`/api/purchase/getGroupsForStockRegister`)
      .then((res) => {
        setGroupOptions(res.data.data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Grid container justifyContent="flex-start" columnSpacing={2}>
        {groupOptions?.map((tabItem, index) => {
          return (
            <>
              <Grid item key={index}>
                <Button
                  onClick={() => {
                    navigate(
                      `/Consumables/${tabItem?.groupName?.replaceAll(
                        " ",
                        ""
                      )}/${tabItem.groupId}`
                    );
                  }}
                  variant="none"
                  sx={{
                    backgroundColor: pathname.includes(
                      tabItem?.groupName?.replaceAll(" ", "")
                    )
                      ? "#D3D3D3"
                      : "",
                    "&:hover": {
                      backgroundColor: "none",
                    },
                  }}
                >
                  {tabItem.groupName}
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
