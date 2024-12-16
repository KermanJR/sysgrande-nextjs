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

  const [terminationDate, setTerminationDate] = useState("");
  const [reason, setReason] = useState("");
  const [severancePay, setSeverancePay] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [remainingVacations, setRemainingVacations] = useState("");
  const [FGTSBalance, setFGTSBalance] = useState("");
  const [fineFGTS, setFineFGTS] = useState("");
  const [INSSDeduction, setINSSDeduction] = useState("");
  const [incomeTaxDeduction, setIncomeTaxDeduction] = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentDeadline, setPaymentDeadline] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [createdBy, setCreatedBy] = useState(user?.name || "");
  const [updatedBy, setUpdatedBy] = useState(user?.name || "");
  const [amount, setAmount] = useState("");

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
      setPaymentDeadline(item?.paymentDeadline || "");
      setPaymentMethod(item?.paymentMethod || "");
      setStatus(item?.status || "Pendente");
      setDescription(item?.description || "");
      setAttachment(item?.attachment || null);
      setSelectedEmployee(item?.employee || "");
      setCreatedBy(item?.createdBy || user?.name || "");
      setUpdatedBy(item?.updatedBy || user?.name || "");
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
    setSeverancePay("");
    setNoticePeriod("");
    setRemainingVacations("");
    setFGTSBalance("");
    setFineFGTS("");
    setINSSDeduction("");
    setIncomeTaxDeduction("");
    setOtherDeductions("");
    setTotalAmount("");
    setPaymentDeadline("");
    setPaymentMethod("");
    setStatus("Pendente");
    setDescription("");
    setAttachment(null);
    setSelectedEmployee("");
    setCreatedBy(user?.name || "");
    setUpdatedBy(user?.name || "");
  };

  console.log(item)

  const handleSaveExpense = async () => {
    const expenseData = new FormData();

    expenseData.append("amount", totalAmount);
    expenseData.append("employee", selectedEmployee);
    expenseData.append("type", "Termination");
    expenseData.append("terminationDate", terminationDate);
    expenseData.append("reason", reason);
    expenseData.append("severancePay", severancePay);
    expenseData.append("noticePeriod", noticePeriod);
    expenseData.append("remainingVacations", remainingVacations);
    expenseData.append("FGTSBalance", FGTSBalance);
    expenseData.append("fineFGTS", fineFGTS);
    expenseData.append("INSSDeduction", INSSDeduction);
    expenseData.append("incomeTaxDeduction", incomeTaxDeduction);
    expenseData.append("otherDeductions", otherDeductions);
    expenseData.append("totalAmount", totalAmount);
    expenseData.append("paymentDeadline", paymentDeadline);
    expenseData.append("paymentMethod", paymentMethod);
    expenseData.append("status", status);
    expenseData.append("description", description);
    expenseData.append("createdBy", user?.name); // Adicionando o usuário que criou
    expenseData.append("updateBy", user?.name); // Inicialmente, o usuário de criação é o mesmo para a atualização
    expenseData.append("company", company?.name);

    if (attachment) {
      expenseData.append("attachment", attachment);
    }

    try {
      let response;
      if (item) {
        expenseData.append("id", item.id);
        response = await createExpense(expenseData);
        if (response) {
          onSave(response);
          toast.success("Despesa de rescisão atualizada com sucesso");
        } else {
          toast.error("Erro ao atualizar item");
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
        {/* Botão para fechar o modal */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <IoMdCloseCircleOutline />
        </IconButton>
        <Typography variant="h6" component="h2" gutterBottom>
          {item ? "Editar Despesa de Rescisão" : "Nova Despesa de Rescisão"}
        </Typography>

        <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
        <FormControl fullWidth margin="normal">
            <InputLabel>Funcionário</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        <TextField
            label="Data de Rescisão"
            type="date"
            value={terminationDate}
            onChange={(e) => setTerminationDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

        </Box>
       
        <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
        <FormControl fullWidth margin="normal">
            <InputLabel>Motivo</InputLabel>
            <Select
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
              <MenuItem value="Outros">Outros</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Valor Rescisão"
            type="number"
            value={severancePay}
            onChange={(e) => setSeverancePay(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Box>
          

          <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <TextField
                label="Aviso Prévio (dias)"
                type="number"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Férias Restantes"
                type="number"
                value={remainingVacations}
                onChange={(e) => setRemainingVacations(e.target.value)}
                fullWidth
                margin="normal"
            />
          </Box>
          
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <TextField
                label="Saldo FGTS"
                type="number"
                value={FGTSBalance}
                onChange={(e) => setFGTSBalance(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Multa FGTS"
                type="number"
                value={fineFGTS}
                onChange={(e) => setFineFGTS(e.target.value)}
                fullWidth
                margin="normal"
            />
          </Box>
          
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <TextField
                label="Dedução INSS"
                type="number"
                value={INSSDeduction}
                onChange={(e) => setINSSDeduction(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Dedução IR"
                type="number"
                value={incomeTaxDeduction}
                onChange={(e) => setIncomeTaxDeduction(e.target.value)}
                fullWidth
                margin="normal"
            />

          </Box>
          
          <TextField
            label="Outras Deduções"
            type="number"
            value={otherDeductions}
            onChange={(e) => setOtherDeductions(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Valor Total"
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prazo para Pagamento"
            type="date"
            value={paymentDeadline}
            onChange={(e) => setPaymentDeadline(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            {attachment ? "Alterar Anexo" : "Adicionar Anexo"}
            <input
              type="file"
              hidden
              onChange={(e) => setAttachment(e.target.files[0])}
            />
          </Button>
          {attachment && (
            <Typography
              variant="body2"
              sx={{ mt: 1, textAlign: "center" }}
            >
              Arquivo: {attachment.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveExpense}
            fullWidth
            sx={{ mt: 3}}
          >
            Salvar
          </Button>
          </Box>
    </Modal>
  );
};

export default RescisaoModal;