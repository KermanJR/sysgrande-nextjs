import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LogoSanegrande from "../../../../public/icons/logo-sanegrande.png";
import LogoEnterHome from "../../../../public/icons/logo-enterhome.png";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from "@mui/icons-material/Group";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useCompany } from "@/app/context/CompanyContext";
import AuthContext from "@/app/context/AuthContext";
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import TaskIcon from '@mui/icons-material/Task';
import styles from './Sidebar.module.css'

const SidebarAdmin = ({ onMenuClick, isMenuOpen, setIsMenuOpen }) => {
  const theme = useTheme(); // Aqui acessamos o tema
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const updateURL = (menuOption) => {
    if (typeof window !== "undefined") {
      window.location.hash = menuOption.toLowerCase();
    }
    setSelectedMenuItem(menuOption);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window?.location.hash.substring(1);
      setSelectedMenuItem(
        currentPath.charAt(0).toUpperCase() + currentPath.slice(1)
      );
    }
  }, []);

  // Estilização para o item selecionado
  const getListItemStyle = (menuOption) => ({
    backgroundColor:
      selectedMenuItem === menuOption ? theme.palette.grey[300] : "transparent",
    color:
      selectedMenuItem === menuOption
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
    borderRadius: "8px",
    marginBottom: "8px",
    height: "50px",
    display: "flex",
    alignItems: "center",
  });

  // Estilização para o ícone
  const getIconStyle = (menuOption) => ({
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    backgroundColor:
      selectedMenuItem === menuOption
        ? theme.palette.primary.contrastText
        : "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color:
      selectedMenuItem === menuOption
        ? theme.palette.grey[700]
        : theme.palette.grey[500],
  });

  // Estilização para o texto
  const getTextStyle = (menuOption) => ({
    color:
      selectedMenuItem === menuOption
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
    marginLeft: ".2rem",
  });

  const { user, logout } = useContext(AuthContext);
  const { company, setSelectedCompany } = useCompany();

  // Definir empresa padrão caso não exista
  useEffect(() => {
    if (!company || !company.name) {
      setSelectedCompany({ name: "Sanegrande", id: 1 });
    }
  }, [company, setSelectedCompany]);

  // Lista de empresas
  const companies = [
    { name: "Sanegrande", id: 1 },
    { name: "Enter Home", id: 2 },
  ];

  // Alterar empresa selecionada
  const handleCompanyChange = (event) => {
    const selectedCompany = companies.find((c) => c.id === event.target.value);
    setSelectedCompany(selectedCompany);
  };

  return isMenuOpen ? (
    <Box
      color="primary.contrastText"
      className={styles.sidebar}
      sx={{
        backgroundColor: theme.palette.background.paper,
        height: "auto",
        padding: "1rem",
        borderRight: `1px solid ${theme.palette.grey[300]}`,
        transition: "transform 0.3s",
        transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.grey[300]}`,
          padding: "1rem",
          position: "sticky"
        }}
      >
        {company?.name == "Sanegrande" && (
          <Image
            alt="Logo - Sanegrande"
            src={LogoSanegrande.src}
            width={40}
            height={40}
            style={{
              objectFit: "contain",
              marginTop: "0rem",
              width: "40px",
              height: "50px",
            }}
          />
        )}

        {company?.name == "Enter Home" && (
          <Image
            alt="Logo - Enter Home"
            src={LogoEnterHome.src}
            width={70}
            height={70}
            style={{
              objectFit: "contain",
              marginTop: "0rem",
              width: "40px",
              height: "50px",
            }}
          />
        )}
        <Select
          value={company?.id || ""}
          onChange={handleCompanyChange}
          displayEmpty
          disableUnderline // Remove a underline padrão
          sx={{
            "& .MuiSelect-icon": {
              color: theme.palette.primary.main, // Cor da setinha
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove a borda no estado normal
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove a borda no estado de hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove a borda no estado de foco
            },
            fontSize: "1.2rem",
            fontWeight: "600",
            color: theme.palette.grey[600],
          }}
        >
          {companies.map((comp) => (
            <MenuItem key={comp.id} value={comp.id}>
              {comp.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{padding: '.5rem 1rem', borderBottom: `1px solid ${theme.palette.grey[300]}`}}>
         <Typography>
                    Usuário: {user ? user.name : "Minha Conta"}
                  </Typography>
        </Box>
      
      <List>
        <ListItem
          button
          style={getListItemStyle("Início")}
          onClick={() => {
            onMenuClick("Início");
            updateURL("Início");
          }}
        >
          <Box style={getIconStyle("Início")}>
            <SpaceDashboardIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText primary="Início" style={getTextStyle("Início")} />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Calendário")}
          onClick={() => {
            onMenuClick("Calendário");
            updateURL("Calendário");
          }}
        >
          <Box style={getIconStyle("Calendário")}>
            <EventIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText primary="Calendário" style={getTextStyle("Calendário")} />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Tarefas")}
          onClick={() => {
            onMenuClick("Tarefas");
            updateURL("Tarefas");
          }}
        >
          <Box style={getIconStyle("Tarefas")}>
            <TaskIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText primary="Tarefas" style={getTextStyle("Tarefas")} />
        </ListItem>

        <ListItem
          button
          style={getListItemStyle("RecursosHumanos")}
          onClick={() => handleToggle()}
        >
          <Box style={getIconStyle("RecursosHumanos")}>
            <GroupIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText
            primary="Recursos Humanos"
            style={getTextStyle("RecursosHumanos")}
          />
          {open ? (
            <ExpandLess sx={{ fill: theme.palette.primary.main }} />
          ) : (
            <ExpandMore sx={{ fill: theme.palette.primary.main }} />
          )}
        </ListItem>
         {/* Submenu */}
         <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Férias");
                updateURL("Férias");
              }}
            >
              <ListItemText primary="Férias" style={getTextStyle("Férias")} />
            </ListItemButton>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Rescisão");
                updateURL("Rescisão");
              }}
            >
              <ListItemText primary="Rescisão" />
            </ListItemButton>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Afastamento");
                updateURL("Afastamento");
              }}
            >
              <ListItemText primary="Afastamento" />
            </ListItemButton>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Contratação");
                updateURL("Contratação");
              }}
            >
              <ListItemText primary="Contratação" />
            </ListItemButton>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Funcionário");
                updateURL("Funcionário");
              }}
            >
              <ListItemText primary="Funcionário" />
            </ListItemButton>
            
          </List>
        </Collapse>
      
        <ListItem
          button
          style={getListItemStyle("Financeiro")}
          onClick={() => handleToggle()}
        >
          <Box style={getIconStyle("Financeiro")}>
            <GroupIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText
            primary="Financeiro"
            style={getTextStyle("Financeiro")}
          />
          {open ? (
            <ExpandLess sx={{ fill: theme.palette.primary.main }} />
          ) : (
            <ExpandMore sx={{ fill: theme.palette.primary.main }} />
          )}
        </ListItem>

        {/* Submenu */}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("VacancyCheck");
                updateURL("Férias");
              }}
            >
              <ListItemText primary="Férias" style={getTextStyle("Férias")} />
            </ListItemButton>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Rescisão");
                updateURL("Rescisão");
              }}
            >
              <ListItemText primary="Rescisão" />
            </ListItemButton>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Afastamento");
                updateURL("Afastamento");
              }}
            >
              <ListItemText primary="Afastamento" />
            </ListItemButton>
            <ListItemButton
              style={{ paddingLeft: 55, color: theme.palette.text.primary }}
              onClick={() => {
                onMenuClick("Contratação");
                updateURL("Contratação");
              }}
            >
              <ListItemText primary="Contratação" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItem
          button
          style={getListItemStyle("Compras")}
          onClick={() => {
            onMenuClick("Compras");
            updateURL("Compras");
          }}
        >
          <Box style={getIconStyle("Compras")}>
            <ShoppingCartIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText
            primary="Compras"
            style={getTextStyle("Compras")}
          />
        </ListItem>
        
        <ListItem
          button
          style={getListItemStyle("Veículos")}
          onClick={() => {
            onMenuClick("Veículos");
            updateURL("Veículos");
          }}
        >
          <Box style={getIconStyle("Veículos")}>
            <DirectionsCarFilledIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText
            primary="Veículos"
            style={getTextStyle("Veículos")}
          />
        </ListItem>
        <ListItem
          button
          style={getListItemStyle("Inventário")}
          onClick={() => {
            onMenuClick("Inventário");
            updateURL("Inventário");
          }}
        >
          <Box style={getIconStyle("Inventário")}>
            <InventoryIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText
            primary="Inventário"
            style={getTextStyle("Inventário")}
          />
        </ListItem>
        <ListItem button style={getListItemStyle("Sair")} onClick={logout}>
          <Box style={getIconStyle("Sair")}>
            <LogoutIcon sx={{ width: "20px" }} />
          </Box>
          <ListItemText primary="Sair" style={getTextStyle("Sair")} />
        </ListItem>
      </List>
    </Box>
  ) : null;
};

export default SidebarAdmin;
