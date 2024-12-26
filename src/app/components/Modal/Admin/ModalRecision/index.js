import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { fetchedEmployeesByCompany, createExpense, updateExpense } from "./API";
import InfoIcon from "@mui/icons-material/Info";
import { useCompany } from "@/app/context/CompanyContext";
import { IoMdCloseCircleOutline } from "react-icons/io";

const RescisaoModal = ({ open, onClose, onSave, item }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [terminationDate, setTerminationDate] = useState("");
  const [reason, setReason] = useState("");
  const [statusSendWarning, setStatusSendWarning] = useState("");
  const [statusASO, setStatusASO] = useState("");
  const [statusPaymentTermination, setStatusPaymentTermination] = useState("");
  const [severancePay, setSeverancePay] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [remainingVacations, setRemainingVacations] = useState("");
  const [FGTSBalance, setFGTSBalance] = useState("");
  const [fineFGTS, setFineFGTS] = useState("");
  const [INSSDeduction, setINSSDeduction] = useState("");
  const [incomeTaxDeduction, setIncomeTaxDeduction] = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentDeadlineTermination, setPaymentDeadlineTermination] =
    useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [createdBy, setCreatedBy] = useState(user?.name || "");
  const [updatedBy, setUpdatedBy] = useState(user?.name || "");
  const [amount, setAmount] = useState("");
  const [placaMoto, setPlacaMoto] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Pega o primeiro arquivo
    if (file) {
      setAttachment(file); // Atualiza o estado com o nome do arquivo
    }
  };

  useEffect(() => {
    if (item) {
      setAmount(item?.amount || "");
      setTerminationDate(item?.terminationDate || "");
      setReason(item?.reason || "");
      setSeverancePay(item?.severancePay || "");
      setNoticePeriod(item?.noticePeriod || "");
      setRemainingVacations(item?.remainingVacations || "");
      setFGTSBalance(item?.FGTSBalance || "");
      setFineFGTS(item?.fineFGTS || "");
      setINSSDeduction(item?.INSSDeduction || "");
      setIncomeTaxDeduction(item?.incomeTaxDeduction || "");
      setOtherDeductions(item?.otherDeductions || "");
      setTotalAmount(item?.totalAmount || "");
      setPaymentMethod(item?.paymentMethod || "");
      setStatus(item?.status || "Pendente");
      setDescription(item?.description || "");
      setAttachment(item?.attachment || null);
      setSelectedEmployee(item?.employee?._id || "");
      setCreatedBy(item?.createdBy || user?.name || "");
      setUpdatedBy(item?.updatedBy || user?.name || "");
      setStatusASO(item?.statusASO || "");
      setStatusPaymentTermination(item?.statusPaymentTermination || "");
      setStatusSendWarning(item?.statusSendWarning || "");
      setTerminationDate(item?.terminationDate?.split("T")[0] || null);
      setPaymentDeadlineTermination(
        item?.paymentDeadlineTermination?.split("T")[0] || null
      );
    } else {
      resetForm();
    }
  }, [item]);

  useEffect(() => {
    const loadEmployees = async () => {
      const employeesData = await fetchedEmployeesByCompany(company?.name);
      setEmployees(employeesData);
    };
    loadEmployees();
  }, [company]);

  const resetForm = () => {
    setTerminationDate("");
    setReason("");
    setStatusASO("");
    setStatusPaymentTermination("");
    setStatusSendWarning("");
    setSeverancePay("");
    setNoticePeriod("");
    setRemainingVacations("");
    setFGTSBalance("");
    setFineFGTS("");
    setINSSDeduction("");
    setIncomeTaxDeduction("");
    setOtherDeductions("");
    setTotalAmount("");
    setPaymentMethod("");
    setStatus("Pendente");
    setDescription("");
    setAttachment(null);
    setSelectedEmployee("");
    setCreatedBy(user?.name || "");
    setUpdatedBy(user?.name || "");
  };

  const handleTypeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleSaveExpense = async () => {
    const expenseData = new FormData();
    expenseData.append("employee", selectedEmployee);
    expenseData.append("type", "Termination");
    expenseData.append(
      "paymentDeadlineTermination",
      paymentDeadlineTermination
    );
    expenseData.append("terminationDate", terminationDate);
    expenseData.append("reason", reason);
    expenseData.append("statusPaymentTermination", statusPaymentTermination);
    expenseData.append("statusASO", statusASO);
    expenseData.append("statusSendWarning", statusSendWarning);
    expenseData.append("createdBy", user?.name); // Adicionando o usuário que criou
    expenseData.append("updateBy", user?.name); // Inicialmente, o usuário de criação é o mesmo para a atualização
    expenseData.append("company", company?.name);

    if (attachment) {
      expenseData.append("attachment", attachment);
    }

    try {
      let response;
      if (item) {
        expenseData.append("id", item?.id);
        response = await updateExpense(expenseData, item?.id);
        if (response) {
          onSave(response);
          toast.success("Rescisão atualizada com sucesso");
        } else {
          toast.error("Erro ao atualizar rescisão");
        }
      } else {
        response = await createExpense(expenseData);
        if (response) {
          onSave(response);
          toast.success("Despesa de rescisão criada com sucesso");
        }
      }
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar a despesa");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            component="P"
            sx={{ fontWeight: "bold", borderBottom: "1px solid #000" }}
          >
            {item ? "Editar Rescisão" : "Criar Nova Rescisão"}
          </Typography>
          <IconButton onClick={onClose} disabled={isSubmitting}>
            <IoMdCloseCircleOutline size={24} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Funcionário</InputLabel>
            <Select
              required={true}
              value={selectedEmployee}
              onChange={handleTypeChange}
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Data da Demissão"
            type="date"
            value={terminationDate}
            onChange={(e) => setTerminationDate(e.target.value)}
            fullWidth
            margin="normal"
            required={true}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Motivo</InputLabel>
            <Select
              required={true}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <MenuItem value="Demissão sem justa causa">
                Demissão sem justa causa
              </MenuItem>
              <MenuItem value="Demissão com justa causa">
                Demissão com justa causa
              </MenuItem>
              <MenuItem value="Pedido de demissão">Pedido de demissão</MenuItem>
              <MenuItem value="Término de contrato">
                Término de contrato
              </MenuItem>
              <MenuItem value="Aposentadoria">Aposentadoria</MenuItem>
              <MenuItem value="Baixa Produtividade">
                Baixa Produtividade
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status Envio Aviso</InputLabel>
            <Select
              required={true}
              value={statusSendWarning}
              onChange={(e) => setStatusSendWarning(e.target.value)}
            >
              <MenuItem value="Programado">Programado</MenuItem>
              <MenuItem value="Realizado">Realizado</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status ASO</InputLabel>
            <Select
              required={true}
              value={statusASO}
              onChange={(e) => setStatusASO(e.target.value)}
            >
              <MenuItem value="Programado">Programado</MenuItem>
              <MenuItem value="Realizado">Realizado</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Data do Pagamento Rescisão"
          type="date"
          required={true}
          value={paymentDeadlineTermination}
          onChange={(e) => setPaymentDeadlineTermination(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status Pagamento Rescisão</InputLabel>
            <Select
              required={true}
              value={statusPaymentTermination}
              onChange={(e) => setStatusPaymentTermination(e.target.value)}
            >
              <MenuItem value="Programado">Programado</MenuItem>
              <MenuItem value="Realizado">Realizado</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Exibe o nome do arquivo ou link para download se houver um arquivo */}
        {attachment ? (
          <Box>
            <Typography variant="body2">
              Arquivo:{" "}
              {attachment?.name
                ? attachment?.name
                : attachment.split("/").pop()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">Nenhum arquivo anexado.</Typography>
        )}

        {/* Campo de upload de arquivo */}
        <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
          {attachment ? "Substituir Arquivo" : "Adicionar Arquivo"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveExpense}
          fullWidth
          sx={{ mt: 3 }}
        >
          Salvar
        </Button>
      </Box>
    </Modal>
  );
};

export default RescisaoModal;
