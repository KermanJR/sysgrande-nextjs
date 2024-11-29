import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import styles from "./dashboard.module.css";
import Topbar from "@/app/components/Topbar";
import Init from "./layouts/initDashboard/init";
import Products from "./layouts/products/Products";
import Plans from "./layouts/Inventory/Inventory";
import Users from "./layouts/users/Users";
import Positions from "./layouts/positions/Positions";
import Clients from "./layouts/clients/Clients";
import About from "./layouts/aboutUs/About";
import SidebarAdmin from "@/app/components/Sidebar/admin";
import CategoriesProducts from "./layouts/categoriesProducts";
import ProfileAdmin from "./layouts/profile/ProfileAdmin";
import Permissions from "./layouts/permissions";
import Inventory from "./layouts/Inventory/Inventory";
import Finances from "./layouts/finances/Finances";
import Employees from "./layouts/employees/Employees";

export default function ScreenDashboardAdmin() {

  const [selectedComponent, setSelectedComponent] = useState("init");
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  
  const handleMenuClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const handleChangeMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  const components = {
    Início: <Init />,
    Financeiro: <Finances/>,
    Inventário: <Inventory/>,
    Funcionário: <Employees/>,
    Perfil: <ProfileAdmin/>,

  };

  return (
    <Box sx={{width: '100%'}}>
      <Topbar/>
      <Box display="flex" className={styles.dashboardContent}>
        <SidebarAdmin onMenuClick={handleMenuClick} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        <Box className={styles.content}>
          {components[selectedComponent]? components[selectedComponent]: <Init/>}
        </Box>
      </Box>
    </Box>
  );
}
