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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import PowerBIEmbed from "@/app/components/PowerBi";
import { BarChart, PieChart } from "@mui/x-charts";
import AuthContext from "@/app/context/AuthContext";
import { fetchedCollectorsByCompany } from "@/app/content/screens/dashboardAdmin/layouts/coletors/API"; 
import { fetchedPurchasesByCompany } from "@/app/content/screens/dashboardAdmin/layouts/shop/API"; 
import { useCompany } from "@/app/context/CompanyContext";
import styles from "./Init.module.css";
import HeaderDashboard from "@/app/components/HeaderDashboard";

export default function Init() {
  const { user, logout } = useContext(AuthContext);
  const { company } = useCompany();
  const [collectors, setCollectors] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [powerBISrc, setPowerBISrc] = useState(
    "https://app.powerbi.com/reportEmbed?reportId=f404ec3e-8c21-4f67-876d-28b6fcb79e7b&autoAuth=true&ctid=06738f6b-6721-49b2-908b-ddeed51824ff"
  );
  const theme = useTheme();

  // Carregar coletores e compras da API
  useEffect(() => {
    const loadData = async () => {
      if (company?.name) {
        const collectorsData = await fetchedCollectorsByCompany(company.name);
        setCollectors(collectorsData);

        const purchasesData = await fetchedPurchasesByCompany(company.name);
        setPurchases(purchasesData);
      }
    };
    loadData();
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

  // Filtrar as próximas compras
  const getUpcomingPurchases = () => {
    const now = new Date();
    return purchases
      .filter((purchase) => {
        const nextPurchaseDate = new Date(purchase.nextPurchaseDate);
        return nextPurchaseDate > now;
      })
      .sort((a, b) => new Date(a.nextPurchaseDate) - new Date(b.nextPurchaseDate))
      .slice(0, 5); // Limita a 5 compras
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
        height: "100vh",
        overflowY: "scroll", 
        padding: '0 1rem 0 0',
        mt: '-1.8rem'
      }}
    >
    <HeaderDashboard title="Início"/>
      {/* Cards de Resumo */}
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                Coletores
              </Typography>
      <Grid container spacing={3} sx={{ marginBottom: "2rem" }}>
        {Object.entries(getCollectorStatusData()).map(([status, count]) => (
          <Grid item xs={12} sm={4} key={status}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                fill: 'white'
              }}
            >
              <CardContent>
                <Typography  sx={{ marginBottom: "0.5rem", color: 'white',   fill: 'white', fontSize: '1.3rem'}}>
                  {status}
                </Typography>
                <Typography  sx={{ fontWeight: "bold", fontSize: '1.3rem' }}>
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

      {/* Próximas Compras */}
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          marginBottom: "2rem",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Próximas Compras
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Material</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fornecedor</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Data Próx. Compra</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getUpcomingPurchases().map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell>{purchase.materialType}</TableCell>
                    <TableCell>{purchase.supplier.name}</TableCell>
                    <TableCell>
                      {new Date(purchase.nextPurchaseDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {purchase.totalPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Power BI Embed */}
      <Card
        sx={{
          width: '100%',
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