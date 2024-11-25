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
  MenuItem
} from "@mui/material";
import toast from "react-hot-toast";

const ExpenseModal = ({ open, onClose, onSave, expense }) => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [status, setStatus] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [valorEntrada, setValorEntrada] = useState("");  // Novo campo
  const [formaPagamento, setFormaPagamento] = useState("");  // Novo campo
  const [numParcelas, setNumParcelas] = useState("");  // Número de parcelas
  const [valorParcelas, setValorParcelas] = useState("");  // Valor das parcelas

  useEffect(() => {
    // Preenche o modal com os dados da despesa para edição
    if (expense) {
      setType(expense.type);
      setDescription(expense.description);
      setEventDate(expense.eventDate);
      setPaymentDate(expense.paymentDate);
      setStatus(expense.status);
      setAttachment(null); // O arquivo deve ser enviado novamente
      setValorEntrada(expense.valorEntrada || "");
      setFormaPagamento(expense.formaPagamento || "");
      setNumParcelas(expense.numParcelas || "");
      setValorParcelas(expense.valorParcelas || "");
    } else {
      resetForm();
    }
  }, [expense]);

  const resetForm = () => {
    setType("");
    setDescription("");
    setEventDate("");
    setPaymentDate("");
    setStatus("");
    setAttachment(null);
    setValorEntrada("");
    setFormaPagamento("");
    setNumParcelas("");
    setValorParcelas("");
  };

  const handleSave = () => {
    if (!type || !description || !eventDate || !paymentDate || !status || !formaPagamento || (formaPagamento === "Cartão" && (!numParcelas || !valorParcelas))) {
      toast.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    const expenseData = {
      type,
      description,
      eventDate,
      paymentDate,
      status,
      attachment,
      valorEntrada,
      formaPagamento,
      numParcelas,
      valorParcelas,
    };

    onSave(expenseData);
    toast.success("Despesa salva com sucesso");
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAttachment(file);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid black' }}>
          {expense ? "Editar Despesa" : "Adicionar Nova Despesa"}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Despesa</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Rescisão">Rescisão</MenuItem>
            <MenuItem value="Contratação">Contratação</MenuItem>
            <MenuItem value="Férias">Férias</MenuItem>
            <MenuItem value="Outros">Outros</MenuItem>
          </Select>
        </FormControl>

       
            <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
 <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <TextField
            label="Data do Evento"
            type="date"
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            />
       

        <TextField
          label="Data do Pagamento"
          type="date"
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
 </Box>
        <FormControl fullWidth margin="normal">
          <InputLabel>Situação</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Pago">Pago</MenuItem>
            <MenuItem value="Pendente">Pendente</MenuItem>
            <MenuItem value="Atrasado">Atrasado</MenuItem>
          </Select>
        </FormControl>

        

        <FormControl fullWidth margin="normal">
          <InputLabel>Forma de Pagamento</InputLabel>
          <Select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <MenuItem value="Pix">Pix</MenuItem>
            <MenuItem value="Cartão">Cartão</MenuItem>
            <MenuItem value="Boleto">Boleto</MenuItem>
            <MenuItem value="Dinheiro">Dinheiro</MenuItem>
          </Select>
        </FormControl>

        {formaPagamento === "Pix" && (
          <TextField
          label="Valor Entrada"
          type="number"
          fullWidth
          margin="normal"
          value={valorEntrada}
          onChange={(e) => setValorEntrada(e.target.value)}
        />
        )}

{formaPagamento === "Boleto" && (
          <TextField
          label="Valor Entrada"
          type="number"
          fullWidth
          margin="normal"
          value={valorEntrada}
          onChange={(e) => setValorEntrada(e.target.value)}
        />
        )}

{formaPagamento === "Dinheiro" && (
          <TextField
          label="Valor Entrada"
          type="number"
          fullWidth
          margin="normal"
          value={valorEntrada}
          onChange={(e) => setValorEntrada(e.target.value)}
        />
        )}

        {formaPagamento === "Cartão" && (
          <Box sx={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <TextField
              label="Número de Parcelas"
              type="number"
              fullWidth
              margin="normal"
              value={numParcelas}
              onChange={(e) => setNumParcelas(e.target.value)}
            />

            <TextField
              label="Valor de Cada Parcela"
              type="number"
              fullWidth
              margin="normal"
              value={valorParcelas}
              onChange={(e) => setValorParcelas(e.target.value)}
            />
          </Box>
        )}

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Anexar Arquivo
          <input
            type="file"
            hidden
            accept=".pdf, .png, .jpeg, .jpg"
            onChange={handleFileChange}
          />
        </Button>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salvar
          </Button>
          <Button variant="contained" color="primary" onClick={onClose} sx={{ ml: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExpenseModal;
