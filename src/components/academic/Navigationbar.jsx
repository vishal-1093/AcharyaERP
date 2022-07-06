import { useState, useEffect } from "react";
import ApiUrl from "../../services/Api";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  Container,
} from "@mui/material";

import acharyaLogo from "../../images/acharyaLogo.jpeg";
import studentimage from "../academic/student.jpg";
import Sidebar from "./Sidebar";
import axios from "axios";

const Navigationbar = () => {
  const [showMenu] = useState(true);
  const [showEmployee, setShowEmployee] = useState(true);
  const [moduleColor, setModuleColor] = useState("Nothing");
  const [btnStyle] = useState({
    color: "#1B1B1F",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    marginLeft: "5%",
  });
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const showSideBar = () => {
    setShowEmployee(!showEmployee);
  };

  const updateModuleBackground = (module) => {
    console.log(module, "update BackgroundColor");
    setModuleColor(module);
  };
  const [userId] = useState(
    JSON.parse(localStorage.getItem("authenticate")).userId
  );

  const [setroleSubmenu] = useState([]);
  const [ModuleList, setModuleList] = useState([]);
  const [MenuList, setMenuList] = useState([]);
  const [SubmenuList, setSubmenuList] = useState([]);
  const [MenuList1, setMenuList1] = useState([]);
  const [setSubmenuList1] = useState([]);

  const getUserSubmenu = async () => {
    var usersubmenu = await axios
      .get(`${ApiUrl}/getSubMenuDetails/${userId}`)
      .then((response) => {
        let user = [];
        response.data.data.SubMenuList.map((u) => {
          user.push(u.submenu_id);
        });
        return user;
      });

    var getRoles = await axios
      .get(`${ApiUrl}/findRoles/${userId}`)
      .then((response) => {
        let roles = [];
        response.data.data.map((u) => {
          roles.push(u.submenu_id);
        });
        return roles;
      });

    var rolesList = getRoles.toString();
    var rolesubmenu = await axios
      .get(`${ApiUrl}/fetchSubMenuDetails/${rolesList}`)
      .then((response) => {
        let role = [];

        if (response.data.data.length) {
          response.data.data.map((r) => {
            role.push(r.submenu_ids);
          });
        }
        return role;
      });

    rolesubmenu.map((rs) => {
      let splitIds = rs.split(",");
      splitIds.map((si) => {
        usersubmenu.push(si);
      });
    });

    var allIds = usersubmenu.toString();

    var allDetails = await axios
      .get(`${ApiUrl}/allDetails/${allIds}`)
      .then((response) => {
        let module = [];
        let menu = [];
        let submenu = [];
        response.data.data.map((m) => {
          let check = module.findIndex((obj) => obj.id === m.module_id);

          if (check === -1) {
            module.push({ name: m.module_name, id: m.module_id });
          }

          menu.push({
            moduleId: m.module_id,
            menuId: m.menu_id,
            menuName: m.menu_name,
          });

          submenu.push({
            menuId: m.menu_id,
            submenuId: m.submenu_id,
            submenuName: m.submenu_name,
          });
        });

        setModuleList(module);
        setMenuList(menu);
        setSubmenuList(submenu);
      });
  };

  const getRoleSubmenu = async () => {
    axios.get(`${ApiUrl}/fetchSubMenuDetails/${3}`).then((response) => {
      setroleSubmenu(response.data.data);
    });
  };
  console.log(ModuleList);
  useEffect(() => {
    getUserSubmenu();
  }, []);

  const handleMenu = (id) => {
    let abc = [];
    MenuList.map((m, index) => {
      if (m.moduleId === id) {
        SubmenuList.map((sl, inx) => {
          if (sl.menuId === m.menuId) {
            abc.push(
              getItem(m.menuName, index, "", [getItem(sl.submenuName, inx)])
            );
          }
        });
      }
    });
    console.log(abc);
    setMenuList1(abc);
  };

  const handlesubMenu = (id) => {
    let abc = [];
    SubmenuList.map((m) => {
      if (m.menuId === id) {
        abc.push(m);
      }
    });
    setSubmenuList1(abc);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography noWrap href="/">
              <img
                src={acharyaLogo}
                alt="avatar Logo"
                style={{ backgroundColor: "#ffff" }}
              />
            </Typography>

            <div
              style={{
                border: "0.5px solid gray",
                transform: "translateX(30px)",
                height: "15px",
              }}
            ></div>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Menu
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              ></Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {showMenu && (
                <>
                  <div className="module_navigationBar">
                    {ModuleList.map((page) => (
                      <button
                        key={page.id}
                        className="navbarBtn list-items"
                        style={
                          page.name === moduleColor
                            ? { color: "#FFFFFF", backgroundColor: "#5F5E62" }
                            : null
                        }
                        onClick={(event) => {
                          handleMenu(page.id);
                          updateModuleBackground(page.name);
                        }}
                        // sx={btnStyle}

                        value={page.name}
                        // color="primary"
                        id={page.name}
                        padding="10px"
                      >
                        {page.name ? page.name : ""}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "20px",
                }}
              >
                <p
                  style={{
                    fontWeight: "600",
                    // color: "#4a148c",
                    color: "#000080",
                    fontSize: "15px",
                    marginBottom: " 0px",
                  }}
                >
                  Hi Valluri
                </p>
                <img
                  src={studentimage}
                  style={{ width: "30px", borderRadius: "50%", height: "30px" }}
                  alt=""
                />
              </div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Sidebar
        style={{
          background: "#002766",
          height: "100vh",
          color: "white",
        }}
        items={MenuList1}
      ></Sidebar>
    </>
  );
};
export default Navigationbar;
