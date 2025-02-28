import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import PowerBIEmbed from "@/app/components/PowerBi";
import { BarChart, PieChart } from "@mui/x-charts";
import AuthContext from "@/app/context/AuthContext";
import { fetchedCollectorsByCompany } from "@/app/content/screens/dashboardAdmin/layouts/coletors/API"; 
import { useCompany } from "@/app/context/CompanyContext";
import styles from "./Init.module.css";

export default function Init() {
  const { user, logout } = useContext(AuthContext);
  const { company } = useCompany();
  const [collectors, setCollectors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [powerBISrc, setPowerBISrc] = useState(
    "https://app.powerbi.com/reportEmbed?reportId=f404ec3e-8c21-4f67-876d-28b6fcb79e7b&autoAuth=true&ctid=06738f6b-6721-49b2-908b-ddeed51824ff"
  );
  const theme = useTheme();

  // Carregar coletores da API
  useEffect(() => {
    const loadCollectors = async () => {
      if (company?.name) {
        const collectorsData = await fetchedCollectorsByCompany(company.name);
        setCollectors(collectorsData);
      }
    };
    loadCollectors();
  }, [company]);

  // Dados para gráficos
  const getCollectorStatusData = () => {
    const statusCount = {
      Ativo: 0,
      Inativo: 0,
      "Em Manutenção": 0,
    };
    collectors.forEach((collector) => {
      statusCount[collector.status]++;
    });
    return statusCount;
  };

  const getCollectorConditionData = () => {
    const conditionCount = {
      Novo: 0,
      Bom: 0,
      Regular: 0,
      Ruim: 0,
    };
    collectors.forEach((collector) => {
      conditionCount[collector.condition]++;
    });
    return Object.entries(conditionCount).map(([label, value], id) => ({
      id,
      value,
      label,
    }));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handlePowerBIChange = (src) => {
    setPowerBISrc(src);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          marginBottom: "2rem",
        }}
      >
        {/* Informações do Usuário */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #ddd",
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user?.name || "Usuário"}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography
                sx={{ fontSize: "1.2rem", color: theme.palette.common.white }}
              >
                {user?.name?.charAt(0) || "U"}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "text.primary" }}
            >
              Olá, {user?.name}!
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
              {user?.role || "Usuário"}
            </Typography>
          </Box>
        </Box>

        {/* Ícone de Notificações e Menu de Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <IconButton
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <NotificationsIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <LogoutIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ marginBottom: "2rem" }}>
        {Object.entries(getCollectorStatusData()).map(([status, count]) => (
          <Grid item xs={12} sm={4} key={status}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.common.white,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
                  {status}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ marginBottom: "2rem" }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                Status dos Coletores
              </Typography>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: Object.keys(getCollectorStatusData()),
                  },
                ]}
                series={[
                  {
                    data: Object.values(getCollectorStatusData()),
                    color: theme.palette.primary.main,
                  },
                ]}
                width={500}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                Condição dos Coletores
              </Typography>
              <PieChart
                series={[
                  {
                    data: getCollectorConditionData(),
                    colors: [
                      theme.palette.primary.main,
                      theme.palette.secondary.main,
                      theme.palette.success.main,
                      theme.palette.error.main,
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Power BI Embed */}
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Relatórios Power BI
          </Typography>
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Button
              variant="contained"
              onClick={() =>
                handlePowerBIChange(
                  "https://app.powerbi.com/reportEmbed?reportId=f404ec3e-8c21-4f67-876d-28b6fcb79e7b&autoAuth=true&ctid=06738f6b-6721-49b2-908b-ddeed51824ff"
                )
              }
              sx={{
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Relatório 1
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                handlePowerBIChange(
                  "https://app.powerbi.com/reportEmbed?reportId=outro-relatorio-id&autoAuth=true&ctid=06738f6b-6721-49b2-908b-ddeed51824ff"
                )
              }
              sx={{
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              Relatório 2
            </Button>
          </Box>
          <PowerBIEmbed src={powerBISrc} />
        </CardContent>
      </Card>
    </Box>
  );
}