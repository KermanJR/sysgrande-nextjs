import React, { useState, useEffect, useContext } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button
} from "@mui/material";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { createExpense } from "../CreateFinances/API";
import { useCompany } from "@/app/context/CompanyContext";

const RescisaoModal = ({ open, onClose, onSave, item }) => {
    const { user } = useContext(AuthContext);
    const { company } = useCompany();

    const [employeeName, setEmployeeName] = useState("");
    const [employeePosition, setEmployeePosition] = useState("");
    const [admissionDate, setAdmissionDate] = useState("");
    const [terminationDate, setTerminationDate] = useState("");
    const [terminationReason, setTerminationReason] = useState("");
    const [terminationPenalty, setTerminationPenalty] = useState("");
    const [provisions, setProvisions] = useState("");
    const [deductions, setDeductions] = useState("");
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        if (item) {
            setEmployeeName(item?.employeeName || "");
            setEmployeePosition(item?.employeePosition || "");
            setAdmissionDate(item?.admissionDate || "");
            setTerminationDate(item?.terminationDate || "");
            setTerminationReason(item?.terminationReason || "");
            setTerminationPenalty(item?.terminationPenalty || "");
            setProvisions(item?.provisions || "");
            setDeductions(item?.deductions || "");
            setAttachment(item?.attachment || null);
        } else {
            resetForm();
        }
    }, [item]);

    const resetForm = () => {
        setEmployeeName("");
        setEmployeePosition("");
        setAdmissionDate("");
        setTerminationDate("");
        setTerminationReason("");
        setTerminationPenalty("");
        setProvisions("");
        setDeductions("");
        setAttachment(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttachment(file); // Atualiza o estado com o arquivo selecionado
        }
    };

    const handleRemoveFile = () => {
        setAttachment(null); // Remove o arquivo selecionado
    };

    const handleSaveExpense = async () => {
        const expenseData = new FormData();

        expenseData.append("type", "Rescisão");
        expenseData.append("createdBy", user?.name);
        expenseData.append("updateBy", user?.name);
        expenseData.append("company", company?.name);
        expenseData.append("employeeName", employeeName);
        expenseData.append("employeePosition", employeePosition);
        expenseData.append("admissionDate", admissionDate);
        expenseData.append("terminationDate", terminationDate);
        expenseData.append("terminationReason", terminationReason);
        expenseData.append("terminationPenalty", terminationPenalty);
        expenseData.append("provisions", provisions);
        expenseData.append("deductions", deductions);

        if (attachment) {
            expenseData.append("attachment", attachment);
        }

        try {
            let response;
            if (item) {
                expenseData.append("id", item.id);
                response = await createExpense(expenseData); // Envia o FormData para o servidor
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
                    height: 'auto',
                    transform: "translate(-50%, -50%)",
                    width: "60%",
                    bgcolor: "background.paper",
                    borderRadius: "5px",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {item ? "Editar Despesa de Rescisão" : "Adicionar Nova Despesa de Rescisão"}
                </Typography>

                <Box sx={{display: 'flex', gap: '1rem'}}>
                <TextField
                    fullWidth
                    label="Funcionário Rescindido"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Cargo do Funcionário"
                    value={employeePosition}
                    onChange={(e) => setEmployeePosition(e.target.value)}
                    margin="normal"
                />
                </Box>
                
                <Box sx={{display: 'flex', gap: '1rem'}}>
                <TextField
                    fullWidth
                    label="Data de Admissão"
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Data de Demissão"
                    type="date"
                    value={terminationDate}
                    onChange={(e) => setTerminationDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                </Box>
                <TextField
                    fullWidth
                    label="Motivo da Rescisão"
                    value={terminationReason}
                    onChange={(e) => setTerminationReason(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Valor da Multa Rescisória"
                    type="number"
                    value={terminationPenalty}
                    onChange={(e) => setTerminationPenalty(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Proventos"
                    type="number"
                    value={provisions}
                    onChange={(e) => setProvisions(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Descontos"
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    margin="normal"
                />

                <Box sx={{ mt: 2 }}>
                    <Typography>Termo de Rescisão:</Typography>
                    <input type="file" onChange={handleFileChange} />
                    {attachment && (
                        <Button onClick={handleRemoveFile} sx={{ mt: 1 }}>
                            Remover Anexo
                        </Button>
                    )}
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button onClick={handleSaveExpense} variant="contained" color="primary">
                        {item ? "Atualizar" : "Salvar"}
                    </Button>
                    <Button variant="outlined" color="error" onClick={onClose} sx={{ ml: 2 }}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RescisaoModal;
