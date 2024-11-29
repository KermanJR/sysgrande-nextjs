import React, { useState, useEffect, useContext } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import FeriasModal from "../ModalVacancy/index"; // Importar o modal de férias
import RescisaoModal from "../ModalRecision/index"; // Importar o modal de rescisão
import OutrasDespesasModal from "../AnothersFinances";

const ExpenseModal = ({ open, onClose, onSave, item }) => {
    const { user } = useContext(AuthContext);
    const { company } = useCompany();

    // Estado para controle do tipo de despesa
    const [selectedType, setSelectedType] = useState("");
    const [openSpecificModal, setOpenSpecificModal] = useState(false);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setOpenSpecificModal(true);
    };

    const handleClose = () => {
        setSelectedType(""); // Limpar tipo de despesa
        setOpenSpecificModal(false); // Fechar modal específico
        onClose(); // Fechar o modal principal
    };

    // Modal Principal para Seleção do Tipo de Despesa
    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "40%",
                        bgcolor: "background.paper",
                        borderRadius: "5px",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Selecione o Tipo de Despesa
                    </Typography>

                    <FormControl fullWidth>
                        <InputLabel>Tipo de Despesa</InputLabel>
                        <Select
                            value={selectedType}
                            onChange={handleTypeChange}
                            label="Tipo de Despesa"
                        >
                            <MenuItem value="Ferias">Férias</MenuItem>
                            <MenuItem value="Rescisao">Rescisão</MenuItem>
                            <MenuItem value="Outros">Outros</MenuItem>
                            {/* Adicione outros tipos de despesas conforme necessário */}
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleClose}>
                            Fechar
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modais Específicos - Férias e Rescisão */}
            {selectedType === "Ferias" && (
                <FeriasModal
                    open={openSpecificModal}
                    onClose={handleClose}
                    onSave={onSave}
                    item={item}
                />
            )}
            {selectedType === "Rescisao" && (
                <RescisaoModal
                    open={openSpecificModal}
                    onClose={handleClose}
                    onSave={onSave}
                    item={item}
                />
            )}
            {selectedType === "Outros" && (
                <OutrasDespesasModal
                    open={openSpecificModal}
                    onClose={handleClose}
                    onSave={onSave}
                    item={item}
                />
            )}

        </>
    );
};

export default ExpenseModal;
