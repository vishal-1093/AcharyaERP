import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React, { useState } from "react";
import "./Sidebar.css";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const Sidebar = (props) => {
  console.log(props);
  const [selectedMenu, setSelectedMenu] = useState([props.menuitem]);

  const showHideMenu = () => {
    showMenu ? setShowMenu(false) : setShowMenu(true);
  };
  const [showMenu, setShowMenu] = useState(true);

  return (
    <>
      <Menu
        style={{
          width: 200,
          fontSize: 15,
          color: "#FFFFFF",
          background: "#003354",
        }}
        
        className="side-nav-menu"
        mode="inline"
        items={props.items}
        // color="inherit"
        theme={{ dark: "#003354" }}
        
      />
    </>
  );
};

export default Sidebar;
