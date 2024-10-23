import React, { useEffect } from "react";
import useHistory from "react-router-dom";

//COMPONENTS
import { Box, Collapse, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";

//STYLES
import styles from './Sidebar.module.css'

//ICONS
import { AiOutlineUser } from "react-icons/ai";
import { BiSolidCoffeeBean } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { BsPersonVcardFill } from "react-icons/bs";
import { BsBoxSeam } from "react-icons/bs";
import { PiUsersFour } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";
import { GrMenu } from "react-icons/gr";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const SidebarClient = ({ onMenuClick, isMenuOpen, setIsMenuOpen }) => {

  const [open, setOpen] = React.useState(true);
  const [typeUser, setTypeUser] = React.useState("");

  const handleClick = () => {
    setOpen(!open);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const updateURL = (menuOption) => {
    window.location.hash = menuOption.toLowerCase(); 
  };

  function verifyUserPosition(){
    let init;
  }

  useEffect(()=>{
    let url = window.location.href;
    if(url.includes('cliente')){
      setTypeUser("cliente")
    }else if(url.includes('admin')){
      setTypeUser("admin")
    }
  }, [typeUser])

  console.log(typeUser)

  return (
    isMenuOpen ?
    <Box
      color="primary.contrastText"
      className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
    >
      <GrMenu className={styles.menu__hamburguer} onClick={handleMenuClick} style={{cursor: 'pointer'}}/>
      <List className={styles.menu__list}>
        <ListItem button onClick={() => {onMenuClick("Planos"); updateURL("planos")}}>
          <AiOutlineUser className={styles.icon} />
          <ListItemText primary="Meus Planos" className={styles.icon__text}/>
        </ListItem>
        <ListItem button onClick={() => {onMenuClick("Produtos"); updateURL("produtos")}}>
          <BiSolidCoffeeBean className={styles.icon}/>
          <ListItemText primary="Meus Produtos" className={styles.icon__text} />
        </ListItem>
        <ListItem button onClick={() => {onMenuClick("Perfil"); updateURL("perfil")}}>
          <PiUsersFour className={styles.icon}/>
          <ListItemText primary="Meus Dados" className={styles.icon__text}/>
        </ListItem>
      </List>
    </Box>:
    
    <Box
      color="primary.contrastText"
      className={`${styles.sidebar_compressed}`}
    >
      <GrMenu className={styles.menu__hamburguer__compressed} onClick={handleMenuClick} style={{cursor: 'pointer'}}/>
      <List className={styles.menu__list}>
        <ListItem button onClick={() => {onMenuClick("Planos"); updateURL("planos")}}>
          <AiOutlineUser className={styles.icon} />
        </ListItem>
        <ListItem button onClick={() => {onMenuClick("Produtos"); updateURL("produtos")}}>
          <BiSolidCoffeeBean className={styles.icon}/>
        </ListItem>
        <ListItem button onClick={() => {onMenuClick("Perfil"); updateURL("perfil")}}>
          <PiUsersFour className={styles.icon}/>
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarClient;
