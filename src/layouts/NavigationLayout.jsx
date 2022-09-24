import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BreadcrumbsProvider from "../contexts/BreadcrumbsContextProvider";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ApiUrl from "../services/Api";
import axios from "axios";

function NavigationLayout() {
  const [modules, setModules] = useState({});
  const [activeModule, setActiveModule] = useState("");
  const [menuOpen, setMenuOpen] = useState({});
  const [activeSubMenu, setActiveSubMenu] = useState("");

  const location = useLocation();

  const userId = JSON.parse(localStorage.getItem("authenticate")).userId;

  // call all GET functions and construct the modules object consisting of all navigation data
  useEffect(() => {
    Promise.all([
      getSubMenuFromUser(),
      getRoleIds().then((roleIds) => getSubMenuFromRoles(roleIds)),
    ]).then((values) => {
      const subMenuIds = `${values[0]},`.concat(values[1]);
      getAllDetails(subMenuIds).then((allDetails) => {
        allDetails.forEach((obj) => {
          const modName = obj.module_name.toLowerCase();

          setActiveModule((prev) => (prev ? prev : modName));

          setModules((prev) => ({
            ...prev,
            [modName]: {
              ...prev[modName],
              [obj.menu_name]: prev[modName]
                ? {
                    ...prev[modName][obj.menu_name],
                    iconName: obj.menu_icon_name,
                    [obj.submenu_name]: obj.submenu_url,
                  }
                : {
                    iconName: obj.menu_icon_name,
                    [obj.submenu_name]: obj.submenu_url,
                  },
            },
          }));
        });
      });
    });
  }, []);

  // initialise all menus as closed
  useEffect(() => {
    if (modules)
      Object.keys(modules).forEach((mod) =>
        Object.keys(modules[mod]).forEach((menuName) => {
          setMenuOpen((prev) => ({ ...prev, [menuName]: false }));
        })
      );
  }, [modules]);

  // set active module and submenu using location pathname and open appropriate menu
  useEffect(() => {
    let path = location.pathname.slice(1);
    if (path.indexOf("/") !== -1) path = `/${path.slice(0, path.indexOf("/"))}`;
    else path = `/${path}`;

    if (modules)
      Object.keys(modules).forEach((mod) => {
        Object.keys(modules[mod]).forEach((menu) => {
          Object.keys(modules[mod][menu]).forEach((subMenu) => {
            if (path === modules[mod][menu][subMenu]) {
              setActiveModule(mod);
              setActiveSubMenu(subMenu);
              setMenuOpen((prev) => ({ ...prev, [menu]: true }));
            }
          });
        });
      });
  }, [location, modules]);

  const getSubMenuFromUser = async () => {
    let subMenusFromUser;

    await axios(`${ApiUrl}/getSubMenuDetails/${userId}`)
      .then(
        (res) =>
          (subMenusFromUser = res.data.data.SubMenuList.map(
            (obj) => obj.submenu_id
          ))
      )
      .catch((err) => console.error(err));

    return subMenusFromUser.toString();
  };
  const getRoleIds = async () => {
    let roleIds;

    await axios(`${ApiUrl}/findRoles/${userId}`)
      .then((res) => (roleIds = res.data.data.map((obj) => obj.role_id)))
      .catch((err) => console.error(err));

    return roleIds.toString();
  };
  const getSubMenuFromRoles = async (roleIds) => {
    let subMenusFromRoles = "";

    await axios(`${ApiUrl}/fetchSubMenuDetails/${roleIds}`)
      .then(
        (res) =>
          (subMenusFromRoles = subMenusFromRoles.concat(
            res.data.data.map((obj) => obj.submenu_ids)
          ))
      )
      .catch((err) => console.error(err));

    return subMenusFromRoles;
  };
  const getAllDetails = async (subMenuIds) => {
    let allDetails;

    await axios(`${ApiUrl}/allDetails/${subMenuIds}`)
      .then((res) => (allDetails = res.data.data))
      .catch((err) => console.error(err));

    return allDetails;
  };

  return (
    <>
      <Header
        moduleList={Object.keys(modules)}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      <div style={{ display: "flex" }}>
        <div style={{ width: 87 }}>
          <Sidebar
            menus={modules[activeModule]}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            activeSubMenu={activeSubMenu}
          />
        </div>

        <div style={{ width: "100%", padding: "87px 31px 0 0" }}>
          <BreadcrumbsProvider>
            <Outlet />
          </BreadcrumbsProvider>
        </div>
      </div>
    </>
  );
}

export default NavigationLayout;
