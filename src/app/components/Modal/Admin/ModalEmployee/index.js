import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";

const EmployeeModal = ({
  open,
  onClose,
  onSave,
  employee,
  departments,
  positions,
  regionals,
  municipalities,
  locations,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    status: "Inativo",
    codigoRegional: "",
    codigoMunicipio: "",
    company: "Sanegrande",
    codigoLocal: "",
    codigoEquipe: "",
    department: "",
    rankings: [],
  });

  const departmentsMock = [
    { id: 1, name: "Recursos Humanos" },
    { id: 2, name: "Tecnologia da Informação" },
    { id: 3, name: "Financeiro" },
  ];

  const positionsMock = [
    { id: 1, name: "Analista" },
    { id: 2, name: "Gerente" },
    { id: 3, name: "Coordenador" },
  ];

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
      });
    } else {
      resetForm();
    }
  }, [employee]);

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      status: "Inativo",
      codigoRegional: "",
      codigoMunicipio: "",
      company: "Sanegrande",
      codigoLocal: "",
      codigoEquipe: "",
      department: "",
      rankings: [],
    });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    onSave(formData);
    resetForm();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 700,
          margin: "auto",
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          mt: "5%",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {employee ? "Editar Funcionário" : "Criar Novo Funcionário"}
          </Typography>
          <IconButton onClick={onClose}>
            <IoMdCloseCircleOutline size={24} />
          </IconButton>
        </Box>
        <form>
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <TextField
              label="Nome Completo"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              label="Telefone"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <TextField
              label="Regional"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              label="Município"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              label="Localidade"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", gap: "1rem" }}>
            <TextField
              label="Equipe"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextField
              label="Empresa"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", gap: "1rem" }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Departamento</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
              >
                {departmentsMock.map((dep) => (
                  <MenuItem key={dep.id} value={dep.name}>
                    {dep.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Cargo</InputLabel>
              <Select
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
              >
                {positionsMock.map((pos) => (
                  <MenuItem key={pos.id} value={pos.name}>
                    {pos.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
              <MenuItem value="Afastado">Afastado</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              onClick={onClose}
              variant="outlined"
              color="secondary"
              sx={{ mr: 2 }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EmployeeModal;
