import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import SavingsIcon from '@mui/icons-material/Savings';
import FaceIcon from '@mui/icons-material/Face';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import styles from "./Sidebar.module.css";
import { BsBoxSeam } from "react-icons/bs";
import { GrMenu } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const SidebarAdmin = ({ onMenuClick, isMenuOpen, setIsMenuOpen }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(""); // Novo estado para item selecionado
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  const updateURL = (menuOption) => {
    if (typeof window !== "undefined") {
      window.location.hash = menuOption.toLowerCase(); // Atualiza o hash da URL
    }
    setSelectedMenuItem(menuOption); // Atualiza o item selecionado
  };
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window?.location.hash.substring(1);
      setSelectedMenuItem(currentPath.charAt(0).toUpperCase() + currentPath.slice(1));
    }
   
  }, []);

  const getListItemStyle = (menuOption) => ({
    borderLeft: selectedMenuItem === menuOption ? '4px solid #0F548C' : 'none', // Linha azul no item selecionado
    backgroundColor: selectedMenuItem === menuOption ? '#f0f0f0' : 'transparent', // Cor de fundo opcional para o item selecionado
    height: '50px'
  });

  return isMenuOpen ? (
    <Box
      color="primary.contrastText"
      className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
    >
      <LinearScaleIcon
        className={styles.menu__hamburguer}
        onClick={handleMenuClick}
        style={{ cursor: "pointer"}}
      />
      <List className={styles.menu__list}>
        <ListItem
          button
          style={getListItemStyle("Início")}
          onClick={() => {
            onMenuClick("Início");
            updateURL("Início");
          }}
          sx={{marginTop: '-1.4rem'}}
        >
          <SpaceDashboardIcon className={styles.icon} color="#0F548C" sx={{width: '20px'}}/>
          <ListItemText primary="Início" className={styles.icon__text}/>
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Inventário")}
          onClick={() => {
            onMenuClick("Inventário");
            updateURL("Inventário");
          }}
        >
          <InventoryIcon className={styles.icon} color="#0F548C" sx={{width: '20px'}}/>
          <ListItemText primary="Inventário" className={styles.icon__text} />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("")}
          onClick={() => {
            handleToggle();
            onMenuClick("");
          }}
        >

          <SavingsIcon className={styles.icon} color="#0F548C" sx={{width: '20px'}}/>
          <ListItemText primary="Financeiro" className={styles.icon__text} />
          {open ? <ExpandLess sx={{fill: '#0F548C'}}/> : <ExpandMore sx={{fill: '#0F548C'}}/>}
        </ListItem>

        {/* Submenu */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            style={{ paddingLeft: 55, color: 'black'}}
            onClick={() => {
              onMenuClick("Financeiro");
              updateURL("Financeiro");
            }}

          >
            <ListItemText primary="Férias" sx={{fontSize: '10px'}}/>
          </ListItemButton>
          <ListItemButton
            style={{ paddingLeft: 55, color: 'black'}}
            onClick={() => {
              onMenuClick("Rescisão");
              updateURL("Rescisão");
            }}

          >
            <ListItemText primary="Rescisão" sx={{fontSize: '10px'}}/>
          </ListItemButton>
          <ListItemButton
            style={{ paddingLeft: 55, color: 'black'}}
            onClick={() => {
              onMenuClick("Compras");
              updateURL("Compras");
            }}

          >
            <ListItemText primary="Compras" sx={{fontSize: '10px'}}/>
          </ListItemButton>
          
        </List>
      </Collapse>
        <ListItem
          button
          style={getListItemStyle("Funcionário")}
          onClick={() => {
            onMenuClick("Funcionário");
            updateURL("Funcionário");
          }}
        >

          <FaceIcon className={styles.icon} color="#0F548C" sx={{width: '20px'}}/>
          <ListItemText primary="Funcionários" className={styles.icon__text} />
        </ListItem>
      </List>
    </Box>
  ) : (
    <Box color="primary.contrastText" className={`${styles.sidebar_compressed}`}>
      <LinearScaleIcon
        className={styles.menu__hamburguer__compressed}
        onClick={handleMenuClick}
        style={{ cursor: "pointer", color: "#0F548C", width: '20px', marginLeft: '15px' }}
        sx={{marginTop: '1rem'}}
      />
      <List className={styles.menu__list}>
        <ListItem
          button
          style={getListItemStyle("Início")}
          onClick={() => {
            onMenuClick("Início");
            updateURL("Início");
          }}
      
        >
          <RxDashboard className={styles.icon} color="#0F548C" />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Inventário")}
          onClick={() => {
            onMenuClick("Inventário");
            updateURL("Inventário");
          }}
        >
          <BsBoxSeam className={styles.icon} />
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarAdmin;
