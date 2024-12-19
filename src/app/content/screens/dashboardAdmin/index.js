import React, { useState } from "react";
import { Box } from "@mui/material";
import styles from "./dashboard.module.css";
import Init from "./layouts/initDashboard/init";
import SidebarAdmin from "@/app/components/Sidebar/admin";
import ProfileAdmin from "./layouts/profile/ProfileAdmin";
import Inventory from "./layouts/Inventory/Inventory";
import Finances from "./layouts/humansrec/HumansRec";
import Employees from "./layouts/employees/Employees";
import Termination from "./layouts/termination/Termination";
import Tasks from "./layouts/Tasks/Tasks";
import TaskBoard from "./layouts/Tasks/Tasks";
import HumansRec from "./layouts/humansrec/HumansRec";
import VacancyCheck from "./layouts/vacancyCheck/VacancyCheck";

export default function ScreenDashboardAdmin() {
  const [selectedComponent, setSelectedComponent] = useState("init");
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleMenuClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const components = {
    Início: <Init />,
    Férias: <Finances />,
    VacancyCheck: <VacancyCheck />,
    RecursosHumanos: <HumansRec />,
    Tarefas: <TaskBoard/>,
    Inventário: <Inventory />,
    Funcionário: <Employees />,
    Perfil: <ProfileAdmin />,
    Rescisão: <Termination />,
  };

  return (
    <Box className={styles.dashboardContent}>
      {/* Sidebar */}
      <Box className={styles.sidebar}>
        <SidebarAdmin
          onMenuClick={handleMenuClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </Box>
      
      {/* Content */}
      <Box className={styles.content}>
        {components[selectedComponent] ? (
          components[selectedComponent]
        ) : (
          <Init />
        )}
      </Box>
    </Box>
  );
}
