import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BuildIcon from "@mui/icons-material/Build";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import ptBR from "date-fns/locale/pt-BR";
import toast from "react-hot-toast";
import {
  fetchedEmployeesByCompany,
  createCollector,
  updateCollector,
} from "./API";
import { useCompany } from "@/app/context/CompanyContext";

const initialFormState = {
  mei: "",
  registration: "",
  model: "Motorola Moto G34",
  status: "Inativo",
  condition: "",
  description: "",
  employee: "",
  company: "",
  lastMaintenance: null,
};

export default function CollectorModal({ open, onClose, onSave, collector }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [activeSection, setActiveSection] = useState("dados");
  const { company } = useCompany();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (collector) {
      setFormData({
        ...initialFormState,
        ...collector,
        lastMaintenance: collector.lastMaintenance
          ? new Date(collector.lastMaintenance)
          : null,
      });
    } else {
      resetForm();
    }
  }, [collector]);

  useEffect(() => {
    const loadEmployees = async () => {
      if (company?.name) {
        const employeesData = await fetchedEmployeesByCompany(company.name);
        setEmployees(employeesData);
      }
    };
    loadEmployees();
  }, [company]);

  const resetForm = () => {
    setFormData({ ...initialFormState, company: company?.name });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação básica
    const newErrors = {};
    if (!formData.mei) newErrors.mei = "IMEI é obrigatório";
    if (!formData.registration) newErrors.registration = "Matrícula é obrigatória";
    if (!formData.condition) newErrors.condition = "Condição é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        lastMaintenance: formData.lastMaintenance?.toISOString(), // Converter data para ISO
      };

      if (collector?._id) {
        await updateCollector(payload, collector._id);
      } else {
        await createCollector(payload);
      }

      onSave();
      onClose();
      toast.success(
        collector ? "Coletor atualizado com sucesso!" : "Coletor criado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao salvar coletor:", error);
      toast.error(error.message || "Erro ao salvar coletor");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        elevation: 5,
        sx: { 
          borderRadius: '10px',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box 
          sx={{ 
            backgroundColor: '#79A6D3',
            py: 2, 
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" component="h2" sx={{ color: 'white', fontWeight: 500 }}>
            {collector ? "Editar Coletor" : "Novo Coletor"}
          </Typography>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ color: 'white' }}
            aria-label="fechar"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 3, py: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                }}
              >
                <Button
                  onClick={() => setActiveSection('dados')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: activeSection === 'dados' ? '#79A6D3' : 'transparent',
                    color: activeSection === 'dados' ? 'white' : '#666',
                    '&:hover': {
                      backgroundColor: activeSection === 'dados' ? '#4A7185' : '#f5f5f5',
                    },
                  }}
                  startIcon={<AssignmentIndIcon />}
                >
                  Dados Pessoais
                </Button>
                <Button
                  onClick={() => setActiveSection('dispositivo')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: activeSection === 'dispositivo' ? '#79A6D3' : 'transparent',
                    color: activeSection === 'dispositivo' ? 'white' : '#666',
                    '&:hover': {
                      backgroundColor: activeSection === 'dispositivo' ? '#4A7185' : '#f5f5f5',
                    },
                  }}
                  startIcon={<PhoneAndroidIcon />}
                >
                  Dispositivo
                </Button>
                <Button
                  onClick={() => setActiveSection('status')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: activeSection === 'status' ? '#79A6D3' : 'transparent',
                    color: activeSection === 'status' ? 'white' : '#666',
                    '&:hover': {
                      backgroundColor: activeSection === 'status' ? '#4A7185' : '#f5f5f5',
                    },
                  }}
                  startIcon={<BuildIcon />}
                >
                  Status
                </Button>
              </Paper>
            </Box>

            {activeSection === 'dados' && (
              <Box>
                <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                  <AssignmentIndIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                  Informações do Funcionário
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" error={!!errors.employee} variant="outlined">
                      <InputLabel>Funcionário</InputLabel>
                      <Select
                        value={formData.employee}
                        onChange={(e) =>
                          setFormData({ ...formData, employee: e.target.value })
                        }
                        required
                        label="Funcionário"
                      >
                        {employees.map((employee) => (
                          <MenuItem key={employee._id} value={employee._id}>
                            {employee.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Matrícula"
                      variant="outlined"
                      margin="dense"
                      value={formData.registration}
                      onChange={(e) =>
                        setFormData({ ...formData, registration: e.target.value })
                      }
                      error={!!errors.registration}
                      helperText={errors.registration}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeSection === 'dispositivo' && (
              <Box>
                <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                  <PhoneAndroidIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                  Informações do Dispositivo
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="IMEI"
                      variant="outlined"
                      margin="dense"
                      value={formData.mei}
                      onChange={(e) =>
                        setFormData({ ...formData, mei: e.target.value })
                      }
                      error={!!errors.mei}
                      helperText={errors.mei}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Modelo"
                      variant="outlined"
                      margin="dense"
                      value={formData.model}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeSection === 'status' && (
              <Box>
                <Typography variant="subtitle1" component="h3" sx={{ mb: 2, fontWeight: 500, color: '#424242' }}>
                  <BuildIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom', color: '#5E899D' }} />
                  Status e Condição
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        label="Status"
                      >
                        <MenuItem value="Ativo">Ativo</MenuItem>
                        <MenuItem value="Inativo">Inativo</MenuItem>
                        <MenuItem value="Em Manutenção">Em Manutenção</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" variant="outlined">
                      <InputLabel>Condição</InputLabel>
                      <Select
                        value={formData.condition}
                        onChange={(e) =>
                          setFormData({ ...formData, condition: e.target.value })
                        }
                        label="Condição"
                        error={!!errors.condition}
                        required
                      >
                        <MenuItem value="Novo">Novo</MenuItem>
                        <MenuItem value="Bom">Bom</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Ruim">Ruim</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                      <DatePicker
                        label="Última Manutenção"
                        value={formData.lastMaintenance}
                        onChange={(newDate) =>
                          setFormData({ ...formData, lastMaintenance: newDate })
                        }
                        slotProps={{ textField: { fullWidth: true, margin: "dense", variant: "outlined" } }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      variant="outlined"
                      margin="dense"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} disabled={isSubmitting} variant="outlined">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ backgroundColor: '#79A6D3', '&:hover': { backgroundColor: '#79A6D3' } }}
            >
              {isSubmitting ? "Salvando..." : collector ? "Atualizar" : "Salvar"}
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
}