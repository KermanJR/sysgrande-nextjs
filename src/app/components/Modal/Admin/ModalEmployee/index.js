import React, { useState, useEffect, useContext } from "react";
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
  FormHelperText,
} from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  fetchRegionals,
  fetchMunicipios,
  fetchLocals,
  createEmployee,
  updateEmployee,
} from "./API";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";

const EmployeeModal = ({ open, onClose, onSave, employee }) => {

  const { company, setSelectedCompany } = useCompany();

  const initialFormState = {
    name: "",
    codigoRegional: "",
    codigoMunicipio: "",
    company: "Sanegrande",
    codigoLocal: "",
    status: "Inativo",
    position: "",
    department: "",
    surname: "",
    phone: "",
    placaMoto: "",
    codigoEquipe: "",
    cnh: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionals, setRegionals] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Validação de campos
  const validateForm = () => {
    const newErrors = {};

    // Validação de nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validação de sobrenome
    if (!formData.surname.trim()) {
      newErrors.surname = "Sobrenome é obrigatório";
    }

    // Validação de telefone
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Formato inválido. Use: (XX) XXXXX-XXXX";
    }

    // Validação de placa da moto
    /*const placaRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    if (formData.placaMoto && !placaRegex.test(formData.placaMoto)) {
      newErrors.placaMoto = "Formato inválido. Use: ABC1D23";
    }*/

    // Validação de CNH
    /*const cnhRegex = /^\d{11}$/;
    if (formData.cnh && !cnhRegex.test(formData.cnh)) {
      newErrors.cnh = "CNH deve conter 11 dígitos numéricos";
    }*/

    // Validações de campos obrigatórios
    if (!formData.position) newErrors.position = "Cargo é obrigatório";
    if (!formData.department)
      newErrors.department = "Departamento é obrigatório";
    if (!formData.codigoRegional)
      newErrors.codigoRegional = "Regional é obrigatória";
    if (!formData.codigoMunicipio)
      newErrors.codigoMunicipio = "Município é obrigatório";
    if (!formData.codigoLocal)
      newErrors.codigoLocal = "Localidade é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatação do telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionalData, municipioData, localData] = await Promise.all([
          fetchRegionals(),
          fetchMunicipios(),
          fetchLocals(),
        ]);

        setRegionals(regionalData);
        setMunicipalities(municipioData);
        setLocations(localData);
      } catch (error) {
        toast.error("Erro ao carregar dados iniciais");
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  

  useEffect(() => {
    if (employee) {
      // Função auxiliar para formatar telefone existente
      const formatExistingPhone = (phone) => {
        if (!phone) return "";
        const numbers = phone.replace(/\D/g, "");
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      };

      setFormData({
        name: employee?.name || "",
        codigoRegional: employee?.codigoRegional?._id || "",
        codigoMunicipio: employee?.codigoMunicipio?._id || "",
        company: employee?.company || company?.name,
        codigoLocal: employee?.codigoLocal?._id || "",
        status: employee?.status || "Inativo",
        position: employee?.position || "",
        department: employee?.department || "",
        surname: employee?.surname || "",
        phone: formatExistingPhone(employee?.phone) || "", // Aplicando formatação ao carregar
        placaMoto: employee?.placaMoto?.toUpperCase() || "", // Garantindo maiúsculas
        codigoEquipe: employee?.codigoEquipe || "",
        cnh: employee?.cnh || "",
      });

      updateMunicipalities(employee.codigoRegional?._id);
      updateLocations(employee.codigoMunicipio?._id);
    } else {
      resetForm();
    }
  }, [employee]);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setFilteredMunicipalities([]);
    setFilteredLocations([]);
  };

  const handleChange = (field, value) => {
    let processedValue = value;

    // Aplicar formatações específicas
    if (field === "phone") {
      processedValue = formatPhone(value);
    } else if (field === "placaMoto") {
      processedValue = value.toUpperCase();
    } else if (field === "name" || field === "surname") {
      processedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Limpar erro do campo quando ele for alterado
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ""), // Remove formatação do telefone antes de enviar
        placaMoto: formData.placaMoto?.toUpperCase(), // Garante maiúsculas
      };

      const response = employee?._id
        ? await updateEmployee(employeeData, employee._id)
        : await createEmployee(employeeData);

      if (response) {
        onSave(response);
        toast.success(
          `Funcionário ${employee?._id ? "atualizado" : "criado"} com sucesso`
        );
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      toast.error(error.message || "Erro ao salvar funcionário");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMunicipalities = (regionalId) => {
    if (regionalId) {
      const filtered = municipalities.filter(
        (municipio) =>
          municipio.codigoRegional?._id === regionalId ||
          municipio.codigoRegional === regionalId
      );
      setFilteredMunicipalities(filtered);

      // Só limpa os campos se não estiver editando
      if (!employee) {
        setFormData((prev) => ({
          ...prev,
          codigoMunicipio: "",
          codigoLocal: "",
        }));
      }
    } else {
      setFilteredMunicipalities([]);
      setFormData((prev) => ({
        ...prev,
        codigoMunicipio: "",
        codigoLocal: "",
      }));
    }
  };

  const updateLocations = (municipioId) => {
    if (municipioId) {
      const filtered = locations.filter(
        (local) =>
          local.codigoMunicipio?._id === municipioId ||
          local.codigoMunicipio === municipioId
      );
      setFilteredLocations(filtered);

      // Só limpa o campo se não estiver editando
      if (!employee) {
        setFormData((prev) => ({ ...prev, codigoLocal: "" }));
      }
    } else {
      setFilteredLocations([]);
      setFormData((prev) => ({ ...prev, codigoLocal: "" }));
    }
  };

  useEffect(() => {
    updateMunicipalities(formData.codigoRegional);
  }, [formData.codigoRegional]);

  useEffect(() => {
    updateLocations(formData.codigoMunicipio);
  }, [formData.codigoMunicipio]);

  const positions = [
    "Coordenador",
    "Gerente",
    "Analista de RH",
    "Estagiário",
    "Analista de Dados",
    "Assistente Proc. Dados",
    "Supervisor Administrativo I",
    "Supervisor Administrativo II",
    "Responsável Técnico I",
    "Responsável Técnico II",
    "Supervisor de Regionais",
    "Funcionário de Campo",
    "Suporte Help Desk I",
    "Suporte Help Desk II",
    "Suporte Help Desk III",
  ];

  const departments = ["RH", "Administrativo", "Campo", "TI", "Financeiro"];

  return (
    <Modal
      open={open}
      onClose={!isSubmitting ? onClose : undefined}
      disableEscapeKeyDown={isSubmitting}
    >
      <Box
        sx={{
          width: 700,
          margin: "auto",
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          mt: "5%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2" sx={{fontWeight:'bold', borderBottom: '1px solid #000'}}>
            {employee?.name ? "Editar Funcionário" : "Criar Novo Funcionário"}
          </Typography>
          <IconButton onClick={onClose} disabled={isSubmitting}>
            <IoMdCloseCircleOutline size={24} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <TextField
            label="Primeiro Nome"
            fullWidth
            required
            type="text"
            margin="normal"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isSubmitting}
          />
          <TextField
            label="Sobrenome"
            fullWidth
            required
            margin="normal"
            type="text"
            value={formData.surname}
            onChange={(e) => handleChange("surname", e.target.value)}
            error={!!errors.surname}
            helperText={errors.surname}
            disabled={isSubmitting}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <TextField
            label="Telefone"
            fullWidth
            required
            type="text"
            margin="normal"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="(XX) XXXXX-XXXX"
            disabled={isSubmitting}
          />
          <TextField
            label="Placa Moto"
            fullWidth
            type="text"
            margin="normal"
            value={formData.placaMoto}
            onChange={(e) => handleChange("placaMoto", e.target.value)}
            error={!!errors.placaMoto}
            helperText={errors.placaMoto}
            placeholder="ABC1D23"
            disabled={isSubmitting}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <TextField
            label="Equipe"
            type="text"
            fullWidth
            margin="normal"
            value={formData.codigoEquipe}
            onChange={(e) => handleChange("codigoEquipe", e.target.value)}
            disabled={isSubmitting}
          />

          <TextField
            label="CNH"
            type="text"
            fullWidth
            margin="normal"
            value={formData.cnh}
            onChange={(e) => handleChange("cnh", e.target.value)}
            error={!!errors.cnh}
            helperText={errors.cnh}
            placeholder="11 dígitos"
            disabled={isSubmitting}
          />
        </Box>

        <FormControl fullWidth margin="normal" error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            disabled={isSubmitting}
          >
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
            <MenuItem value="Afastado">Afastado</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.position}
          required
        >
          <InputLabel>Cargo</InputLabel>
          <Select
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            disabled={isSubmitting}
          >
            {positions.map((position) => (
              <MenuItem key={position} value={position}>
                {position}
              </MenuItem>
            ))}
          </Select>
          {errors.position && (
            <FormHelperText>{errors.position}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.department}
          required
        >
          <InputLabel>Departamento</InputLabel>
          <Select
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            disabled={isSubmitting}
          >
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
          {errors.department && (
            <FormHelperText>{errors.department}</FormHelperText>
          )}
        </FormControl>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.codigoRegional}
            required
          >
            <InputLabel>Regional</InputLabel>
            <Select
              value={formData.codigoRegional}
              onChange={(e) => handleChange("codigoRegional", e.target.value)}
              disabled={isSubmitting}
            >
              {regionals.map((regional) => (
                <MenuItem key={regional._id} value={regional._id}>
                  {regional.name}
                </MenuItem>
              ))}
            </Select>
            {errors.codigoRegional && (
              <FormHelperText>{errors.codigoRegional}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.codigoMunicipio}
            required
          >
            <InputLabel>Município</InputLabel>
            <Select
              value={formData.codigoMunicipio}
              onChange={(e) => handleChange("codigoMunicipio", e.target.value)}
              disabled={!formData.codigoRegional || isSubmitting}
            >
              {filteredMunicipalities.map((municipio) => (
                <MenuItem key={municipio._id} value={municipio._id}>
                  {municipio.name}
                </MenuItem>
              ))}
            </Select>
            {errors.codigoMunicipio && (
              <FormHelperText>{errors.codigoMunicipio}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.codigoLocal}
            required
          >
            <InputLabel>Localidade</InputLabel>
            <Select
              value={formData.codigoLocal}
              onChange={(e) => handleChange("codigoLocal", e.target.value)}
              disabled={!formData.codigoMunicipio || isSubmitting}
            >
              {filteredLocations.map((local) => (
                <MenuItem key={local._id} value={local._id}>
                  {local.name}
                </MenuItem>
              ))}
            </Select>
            {errors.codigoLocal && (
              <FormHelperText>{errors.codigoLocal}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </Box>
    </Modal>
  );
};

export default EmployeeModal;
