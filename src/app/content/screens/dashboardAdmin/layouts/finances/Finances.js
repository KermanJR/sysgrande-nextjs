import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArticleIcon from "@mui/icons-material/Article";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import PlanModal from "@/app/components/Modal/Admin/InventoryModal";
import ReportModal from "@/app/components/Modal/Admin/ReportModal";
import { fetchItems, fetchRegionals, deleteItemById} from "./API";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from './Finances.module.css'
import ExpenseModal from "@/app/components/Modal/Admin/CreateFinances";

export default function Finances() {
  const [plans, setPlans] = useState([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState([]);
  const [regionals, setRegionals] = useState([]);
  const [selectedRegional, setSelectedRegional] = useState('');
  const [newExpense, setNewExpense] = useState({
    type: "",
    description: "",
    eventDate: "",
    paymentDate: "",
    status: "",
    attachment: null,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPlanModal = (plan) => {
    console.log(plan)
    setCurrentPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentPlan(null);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewExpense((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSaveExpense = () => {
    setPlans((prev) => [...prev, newExpense]);
    setNewExpense({
      type: "",
      description: "",
      eventDate: "",
      paymentDate: "",
      status: "",
      attachment: null,
    });
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Itens", 10, 10);
  
    // Colunas do relatório
    const tableColumn = [
      "Nome", 
      "Quantidade", 
      "Descrição", 
      "Nº Patrimônio", 
      "Marca", 
      "Modelo", 
      "Condição", 
      "Localização", 
    ];
  
    const tableRows = [];
  
    filteredPlans.forEach(plan => {
      const planData = [
        plan.name, // Nome
        plan.quantity || "-", // Quantidade (com fallback para "-" se não houver valor)
        plan.description || "-", // Descrição
        plan.patrimonyNumber || "-", // Número de Patrimônio
        plan.brand || "-", // Marca
        plan.model || "-", // Modelo
        plan.condition || "-", // Condição
        plan.location || "-", // Localização
      ];
      tableRows.push(planData);
    });
  
    // Gera a tabela no PDF
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
  
    // Salva o PDF com o nome especificado
    doc.save("relatorio_itens.pdf");
  };
  



  return (
    <Box className={styles.plans}>
        <Typography
        typography="h4"
        style={{ fontWeight: "bold", color: "#1E3932" }}
      >
        Finanças
      </Typography>
      <Typography
        typography="label"
        style={{ padding: "0 0 1rem 0", color: "#1E3932", fontSize: ".875rem" }}
      >
        Gerencie todos os seus gastos e despesas
      </Typography>
      
      <TableContainer component={Paper}>
      <Box className={styles.plans__table__actions}>
            <Button
              variant="contained"
              style={{ background: "#fff", color: 'black', borderRadius: '2px'}}
              className={styles.plans__search__input}
              onClick={generatePdf}
            >
              <ArticleIcon />
              Gerar Relatório
            </Button>
            <Button
              variant="contained"
              style={{ background: "#fff", color: "#000", borderRadius: '2px'}}
              className={styles.plans__search__input}
              onClick={() => handleOpenPlanModal()}
            >
              <AddIcon />
              Novo Item
            </Button>
          </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data do Evento</TableCell>
              <TableCell>Data de Pagamento</TableCell>
              <TableCell>Situação</TableCell>
              <TableCell>Anexo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan, index) => (
              <TableRow key={index}>
                <TableCell>{plan.type}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>{plan.eventDate}</TableCell>
                <TableCell>{plan.paymentDate}</TableCell>
                <TableCell>{plan.status}</TableCell>
                <TableCell>
                  {plan.attachment ? (
                    <a href={URL.createObjectURL(plan.attachment)} target="_blank" rel="noreferrer">
                      Ver Anexo
                    </a>
                  ) : (
                    "Nenhum"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal para criar ou editar plano */}
      <ExpenseModal
        open={isPlanModalOpen}
        onClose={handleClosePlanModal}
        onSave={handleSaveExpense}
        item={currentPlan}
      />

      {/* Modal para gerar relatório */}
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
