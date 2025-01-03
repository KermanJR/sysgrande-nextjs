import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useState } from "react";

// Employee Detail View Component
export const EmployeeDetailView = ( {employee} )=>{

    console.log(employee)
const [activeTab, setActiveTab] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);

  console.log(activeTab)

  const [evaluations, setEvaluations] = useState([
    {
      month: 'Janeiro 2024',
      performance: 85,
      attendance: 95,
      productivity: 88,
      comments: 'Bom desempenho geral, precisa melhorar comunicação.',
      evaluator: 'João Silva'
    },
    // Adicione mais avaliações conforme necessário
  ]);
    
return(
  <Box sx={{ width: "100%", typography: "body1" }}>
    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
      <Tab label="Informações Pessoais" icon={<WorkIcon />} />
      <Tab label="Presença" icon={<AccessTimeIcon />} />
      <Tab label="Treinamentos" icon={<SchoolIcon />} />
      <Tab label="Documentos" icon={<AssignmentIcon />} />
      <Tab label="Avaliações" icon={<AssessmentIcon />} />
    </Tabs>

    {activeTab == 0 && (
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Avatar sx={{ width: 100, height: 100 }}>
            {employee?.name}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {employee?.name} {employee?.surname}
            </Typography>
            <Typography variant="subtitle1">{employee?.position}</Typography>
            <Chip
              label={employee?.status}
              color={
                employee?.status === "Ativo"
                  ? "success"
                  : employee?.status === "Inativo"
                  ? "error"
                  : "warning"
              }
            />
          </Box>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Departamento</Typography>
            <Typography>{employee?.department}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Telefone</Typography>
            <Typography>{employee?.phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Regional</Typography>
            <Typography>{employee?.codigoRegional?.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Município</Typography>
            <Typography>{employee?.codigoMunicipio?.name}</Typography>
          </Grid>
        </Grid>
      </Box>
    )}

    {activeTab === 1 && (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Registro de Presença
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Entrada</TableCell>
                <TableCell>Saída</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={record.status === "Presente" ? "success" : "error"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )}

    {activeTab === 2 && (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Treinamentos e Certificações
        </Typography>
        <Grid container spacing={2}>
          {trainingData.map((training, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">{training.name}</Typography>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  Concluído em: {training.completionDate}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={training.progress}
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    )}

    {activeTab === 3 && (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Documentos do Funcionário
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Contrato de Trabalho</Typography>
                <Button variant="contained" size="small">
                  Visualizar
                </Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Documentos Pessoais</Typography>
                <Button variant="contained" size="small">
                  Visualizar
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    )}

    
  </Box>
)}
