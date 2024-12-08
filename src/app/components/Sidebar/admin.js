import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

import styles from "./Sidebar.module.css";
import { BsBoxSeam } from "react-icons/bs";
import { GrMenu } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";

const SidebarAdmin = ({ onMenuClick, isMenuOpen, setIsMenuOpen }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(""); // Novo estado para item selecionado

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
      <GrMenu
        className={styles.menu__hamburguer}
        onClick={handleMenuClick}
        style={{ cursor: "pointer" }}
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
          <ListItemText primary="Início" className={styles.icon__text} />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Inventário")}
          onClick={() => {
            onMenuClick("Inventário");
            updateURL("Inventário");
          }}
        >
          <BsBoxSeam className={styles.icon} color="#0F548C" />
          <ListItemText primary="Inventário" className={styles.icon__text} />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Financeiro")}
          onClick={() => {
            onMenuClick("Financeiro");
            updateURL("Financeiro");
          }}
        >

          <FaMoneyBillTransfer className={styles.icon} color="#0F548C" />
          <ListItemText primary="Financeiro" className={styles.icon__text} />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Funcionário")}
          onClick={() => {
            onMenuClick("Funcionário");
            updateURL("Funcionário");
          }}
        >

          <HiUsers className={styles.icon} color="#0F548C" />
          <ListItemText primary="Funcionários" className={styles.icon__text} />
        </ListItem>
      </List>
    </Box>
  ) : (
    <Box color="primary.contrastText" className={`${styles.sidebar_compressed}`}>
      <GrMenu
        className={styles.menu__hamburguer__compressed}
        onClick={handleMenuClick}
        style={{ cursor: "pointer", color: "#0F548C", width: '20px', marginLeft: '15px' }}
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
