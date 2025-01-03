import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  Typography,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useCompany } from "@/app/context/CompanyContext";
import AuthContext from "@/app/context/AuthContext";
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  EventNote as CalendarIcon,
  AssignmentTurnedIn as TasksIcon,
  Group as UsersIcon,
  AccountBalanceWallet as WalletIcon,
  ShoppingCart as CartIcon,
  DirectionsCarFilled as CarIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { theme } from "@/app/theme";

// Componentes estilizados
const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '8px',
  margin: '4px 0',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  ...(active && {
    backgroundColor: theme.palette.primary.light,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '40px',
  color: theme.palette.grey[700],
}));

const SidebarAdmin = ({ onMenuClick, isMenuOpen }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const { user, logout } = useContext(AuthContext);
  const { company, setSelectedCompany } = useCompany();


  const companies = [
    { name: "Sanegrande", id: "1", logo: "/icons/logo-sanegrande.png" },
    { name: "Enter Home", id: "2", logo: "/icons/logo-enterhome.png" }
  ];

  const updateURL = (menuOption) => {
    if (typeof window !== "undefined") {
      window.location.hash = menuOption.toLowerCase();
    }
    setSelectedMenuItem(menuOption);
  };

  const toggleSubmenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  useEffect(() => {
    if (!company?.name) {
      setSelectedCompany({ name: "Sanegrande", id: "1" });
    }
  }, [company, setSelectedCompany]);

  if (!isMenuOpen) return null;

  return (
    <Box
      sx={{
        width: 300,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header com Logo e Seletor de Empresa */}
<Box
  sx={{
    p: 3,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  }}
>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1400px',
      margin: '0 auto',
    }}
  >
    {/* Container da Esquerda - Logo e Select */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.02)',
          padding: '8px',
        }}
      >
        <Image
          src={company?.name === "Sanegrande" ? "/icons/logo-sanegrande.png" : "/icons/logo-enterhome.png"}
          alt={`Logo - ${company?.name}`}
          width={40}
          height={40}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      <Select
        value={company?.id || ""}
        onChange={(e) => {
          const selectedCompany = companies.find(c => c.id === e.target.value);
          setSelectedCompany(selectedCompany);
        }}
        displayEmpty
        variant="standard"
        sx={{
          '& .MuiSelect-select': {
            paddingRight: '32px',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1E2432',
            letterSpacing: '-0.01em',
          },
          '& .MuiSelect-icon': {
            color: '#1E2432',
            right: 0,
            transition: 'transform 0.2s ease-in-out',
          },
          '&:hover .MuiSelect-icon': {
            transform: 'translateY(2px)',
          },
          '& .MuiInput-underline:before': {
            borderBottom: 'none',
          },
          '& .MuiInput-underline:after': {
            borderBottom: 'none',
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: 'none',
          },
          minWidth: '200px',
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              '& .MuiMenuItem-root': {
                padding: '12px 16px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              },
            },
          },
        }}
      >
        {companies.map((comp) => (
          <MenuItem 
            key={comp.id} 
            value={comp.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#1E2432',
              }}
            >
              {comp.name}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </Box>

    {/* Você pode adicionar elementos à direita aqui se necessário */}
  </Box>
</Box>

      {/* Menu Principal */}
      <List sx={{ flex: 1, overflow: 'auto', px: 2 }}>
        {/* Item Início */}
        <StyledListItemButton
          active={selectedMenuItem === "Início"}
          onClick={() => {
            onMenuClick("Início");
            updateURL("Início");
          }}
        >
          <StyledListItemIcon>
            <DashboardIcon />
          </StyledListItemIcon>
          <ListItemText primary="Início" />
        </StyledListItemButton>

        {/* Item Calendário */}
        <StyledListItemButton
          active={selectedMenuItem === "Calendário"}
          onClick={() => {
            onMenuClick("Calendário");
            updateURL("Calendário");
          }}
        >
          <StyledListItemIcon>
            <CalendarIcon />
          </StyledListItemIcon>
          <ListItemText primary="Calendário" />
        </StyledListItemButton>

        {/* Item Tarefas */}
        <StyledListItemButton
          active={selectedMenuItem === "Tarefas"}
          onClick={() => {
            onMenuClick("Tarefas");
            updateURL("Tarefas");
          }}
        >
          <StyledListItemIcon>
            <TasksIcon />
          </StyledListItemIcon>
          <ListItemText primary="Tarefas" />
        </StyledListItemButton>

        {/* Submenu RH */}
        <Box>
          <StyledListItemButton
            onClick={() => toggleSubmenu('rh')}
            active={selectedMenuItem.startsWith("RH")}
          >
            <StyledListItemIcon>
              <UsersIcon />
            </StyledListItemIcon>
            <ListItemText primary="Recursos Humanos" />
            {openMenus.rh ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </StyledListItemButton>
          <Collapse in={openMenus.rh} timeout="auto">
            <List component="div" disablePadding>
              {["Férias", "Rescisão", "Afastamento", "Contratação", "Funcionário"].map((item) => (
                <StyledListItemButton
                  key={item}
                  sx={{ pl: 6 }}
                  active={selectedMenuItem === item}
                  onClick={() => {
                    onMenuClick(item);
                    updateURL(item);
                  }}
                >
                  <ListItemText primary={item} />
                </StyledListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>

        {/* Submenu Financeiro */}
        <Box>
          <StyledListItemButton
            onClick={() => toggleSubmenu('financeiro')}
            active={selectedMenuItem.startsWith("Financeiro")}
          >
            <StyledListItemIcon>
              <WalletIcon />
            </StyledListItemIcon>
            <ListItemText primary="Financeiro" />
            {openMenus.financeiro ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </StyledListItemButton>
          <Collapse in={openMenus.financeiro} timeout="auto">
            <List component="div" disablePadding>
              {["Contas a Pagar", "Contas a Receber", "Fluxo de Caixa", "Relatórios"].map((item) => (
                <StyledListItemButton
                  key={item}
                  sx={{ pl: 6 }}
                  active={selectedMenuItem === item}
                  onClick={() => {
                    onMenuClick(item);
                    updateURL(item);
                  }}
                >
                  <ListItemText primary={item} />
                </StyledListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>

        {/* Demais itens do menu */}
        {[
          { icon: <CartIcon />, label: "Compras" },
          { icon: <CarIcon />, label: "Veículos" },
          { icon: <InventoryIcon />, label: "Inventário" },
        ].map((item) => (
          <StyledListItemButton
            key={item.label}
            active={selectedMenuItem === item.label}
            onClick={() => {
              onMenuClick(item.label);
              updateURL(item.label);
            }}
          >
            <StyledListItemIcon>
              {item.icon}
            </StyledListItemIcon>
            <ListItemText primary={item.label} />
          </StyledListItemButton>
        ))}
      </List>

      {/* Footer com botão de Logout */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <StyledListItemButton onClick={logout}>
          <StyledListItemIcon>
            <LogoutIcon />
          </StyledListItemIcon>
          <ListItemText primary="Sair" />
        </StyledListItemButton>
      </Box>
    </Box>
  );
};

export default SidebarAdmin;