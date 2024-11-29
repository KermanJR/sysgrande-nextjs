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

const FeriasModal = ({ open, onClose, onSave, item }) => {
    const { user } = useContext(AuthContext);
    const { company } = useCompany();

    const [employeeName, setEmployeeName] = useState("");
    const [employeePosition, setEmployeePosition] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [holidayValue, setHolidayValue] = useState("");
    const [additionalPayments, setAdditionalPayments] = useState("");
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        if (item) {
            setEmployeeName(item?.employeeName || "");
            setEmployeePosition(item?.employeePosition || "");
            setStartDate(item?.startDate || "");
            setEndDate(item?.endDate || "");
            setHolidayValue(item?.holidayValue || "");
            setAdditionalPayments(item?.additionalPayments || "");
            setAttachment(item?.attachment || null);
        } else {
            resetForm();
        }
    }, [item]);

    const resetForm = () => {
        setEmployeeName("");
        setEmployeePosition("");
        setStartDate("");
        setEndDate("");
        setHolidayValue("");
        setAdditionalPayments("");
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

        expenseData.append("type", "Férias");
        expenseData.append("createdBy", user?.name);
        expenseData.append("updateBy", user?.name);
        expenseData.append("company", company?.name);
        expenseData.append("employeeName", employeeName);
        expenseData.append("employeePosition", employeePosition);
        expenseData.append("startDate", startDate);
        expenseData.append("endDate", endDate);
        expenseData.append("holidayValue", holidayValue);
        expenseData.append("additionalPayments", additionalPayments);

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
                    toast.success("Despesa de férias atualizada com sucesso");
                } else {
                    toast.error("Erro ao atualizar item");
                }
            } else {
                response = await createExpense(expenseData);
                if (response) {
                    onSave(response);
                    toast.success("Despesa de férias criada com sucesso");
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
                    {item ? "Editar Despesa de Férias" : "Adicionar Nova Despesa de Férias"}
                </Typography>

                <TextField
                    fullWidth
                    label="Funcionário em Férias"
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
                <TextField
                    fullWidth
                    label="Data de Início das Férias"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Data de Término das Férias"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Valor das Férias"
                    type="number"
                    value={holidayValue}
                    onChange={(e) => setHolidayValue(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Pagamentos Adicionais"
                    type="number"
                    value={additionalPayments}
                    onChange={(e) => setAdditionalPayments(e.target.value)}
                    margin="normal"
                />

                <Box sx={{ mt: 2 }}>
                    <Typography>Termo de Férias:</Typography>
                    <input type="file" onChange={handleFileChange} />
                    {attachment && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                                Arquivo: {attachment.name}{" "}
                                <Button variant="text" onClick={handleRemoveFile}>
                                    Remover
                                </Button>
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSaveExpense}>
                        Salvar
                    </Button>
                    <Button variant="outlined" color="error" onClick={onClose} sx={{ ml: 2 }}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FeriasModal;
