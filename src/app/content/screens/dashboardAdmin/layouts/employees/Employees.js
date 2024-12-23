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
  Rating,
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
import {
  fetchedExpenses,
  deleteExpenseById,
  fetchedEmployeesByCompany,
  deleteEmployeeById,
} from "./API";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from "./Employees.module.css";
import ExpenseModal from "@/app/components/Modal/Admin/CreateFinances";
import { useCompany } from "@/app/context/CompanyContext";
import EmployeeModal from "@/app/components/Modal/Admin/ModalEmployee";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="primeira página"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="página anterior"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="próxima página"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Employees() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployess, setFilteredEmployess] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    type: "",
    description: "",
    eventDate: "",
    paymentDate: "",
    status: "",
    attachment: null,
  });
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o loading

  const { company } = useCompany(); // Acessando a empresa selecionada do contexto

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Adiciona 0 à esquerda, se necessário
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses começam em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (company) {
      const loadEmployees = async () => {
        setIsLoading(true); // Ativa o loading
        try {
          const employeesData = await fetchedEmployeesByCompany(company.name);
          const activeEmployees = employeesData.filter(
            (employee) => !employee.deletedAt
          );
          setEmployees(activeEmployees);
          setFilteredEmployess(activeEmployees);
        } catch (error) {
          console.error("Erro ao carregar funcionários", error);
        } finally {
          setIsLoading(false); // Desativa o loading após a requisição
        }
      };
      loadEmployees();
    }
  }, [company]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPlanModal = (expense) => {
    console.log(expense);
    setCurrentExpense(expense);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentExpense(null);
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

  const handleDeleteEmployee = async (id) => {
    const deleted = await deleteEmployeeById(id);
    if (deleted) {
      // Recarrega os funcionários após a exclusão
      const loadEmployees = async () => {
        const employeesData = await fetchedEmployeesByCompany(company.name); // Passe o nome da empresa
        // Filtra os funcionários que não têm a data de exclusão (soft delete)
        const activeEmployees = employeesData.filter(
          (employee) => !employee.deletedAt
        );
        setEmployees(activeEmployees);
        setFilteredEmployess(activeEmployees);
      };

      loadEmployees();
      toast.success("Funcionário deletado com sucesso!");
    } else {
      toast.error("Erro ao deletar o funcionário!");
    }
  };

  const generatePdf = () => {
    const doc = new jsPDF();

    // Obter a data e hora atual no formato desejado
    const now = new Date();
    const reportDate = `${now.toLocaleDateString(
      "pt-BR"
    )} ${now.toLocaleTimeString("pt-BR")}`;

    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório Financeiro", 10, 10);

    // Nome da empresa
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Empresa: ${company.name}`, 10, 20);

    // Data e hora de geração do relatório
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Gerado em: ${reportDate}`, 10, 30);

    // Colunas do relatório
    const tableColumn = [
      "Tipo",
      "Descrição",
      "Data Evento",
      "Data Pagamento",
      "Valor",
      "Forma Pag.",
      "Situação",
      "Criado por",
    ];

    const tableRows = [];

    // Preencher as linhas da tabela
    filteredEmployess.forEach((expense) => {
      const planData = [
        expense?.type,
        expense?.description || "-",
        formatDateToDDMMYYYY(expense?.eventDate),
        formatDateToDDMMYYYY(expense?.paymentDate),
        expense?.amount.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        }),
        expense?.paymentMethod,
        expense?.status,
        expense?.createdBy,
      ];
      tableRows.push(planData);
    });

    // Calcular o total da coluna "Valor"
    const totalAmount = filteredEmployess?.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Gera a tabela no PDF
    doc.autoTable(tableColumn, tableRows, { startY: 40 });

    // Adicionar o total ao final
    const finalY = doc.lastAutoTable.finalY + 10; // Posição logo abaixo da tabela
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: ${totalAmount.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      })}`,
      10,
      finalY
    );

    // Salva o PDF com o nome especificado
    doc.save("relatorio_itens.pdf");
  };

  console.log(employees);

  return (
    <Box className={styles.plans}>
      <Box
        sx={{
          border: "1px solid #d9d9d9",
          borderRadius: "10px",
          padding: ".5rem",
        }}
      >
        <Typography
          typography="h4"
          style={{ fontWeight: "bold", color: "#1E3932" }}
        >
          Funcionários
        </Typography>
        <Typography
          typography="label"
          style={{
            padding: "0 0 1rem 0",
            color: "#1E3932",
            fontSize: ".875rem",
          }}
        >
          Gerencie todos os funcionários da sua empresa
        </Typography>
      </Box>

     

      <TableContainer className={styles.plans__table__container}>
        <Box className={styles.plans__table__actions_download_new}>
          <Button
            variant="contained"
            style={{ background: "#fff", color: "black", borderRadius: "2px" }}
            className={styles.plans__search__input}
            onClick={generatePdf}
          >
            <ArticleIcon />
            Gerar Relatório
          </Button>
          <Button
            variant="contained"
            style={{ background: "#fff", color: "#000", borderRadius: "2px" }}
            className={styles.plans__search__input}
            onClick={() => handleOpenPlanModal()}
          >
            <AddIcon />
            Novo Item
          </Button>
        </Box>
        <Table className={styles.plans__table}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Nome
              </TableCell>
             
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Empresa
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Cargo
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Departamento
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Avaliação
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            
            {employees
              ?.filter(
                (employee) => employee?.codigoRegional && employee?.codigoLocal
              )
              .map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell align="center">{employee?.name}</TableCell>
                  <TableCell align="center">{employee?.company}</TableCell>
                  <TableCell align="center">{employee?.position}</TableCell>
                  <TableCell align="center">{employee?.department}</TableCell>
                  

                 
                  <TableCell align="center">
                    <Box
                      style={{
                        backgroundColor: (() => {
                          switch (employee?.status) {
                            case "Ativo":
                              return "#C8E6C9"; // Verde claro
                            case "Inativo":
                              return "#FFCDD2"; // Vermelho claro
                            case "Afastado":
                              return "#BBDEFB"; // Azul claro
                            default:
                              return "#FFFFFF"; // Branco, caso não tenha status
                          }
                        })(),
                        color: "#000", // Cor do texto para garantir contraste
                        height: "35px",
                        borderRadius: "9px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {employee?.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{employee?.rankings}</TableCell>

                  {employee?.rankings?.map((item, index) => (
        <Box key={index} style={{ marginBottom: '10px' }}>
          <Typography variant="h4">{`${item.mes} ${item.ano}`}</Typography>
          <Rating
            name={`avaliacao-${index}`}
            value={item.nota / 2} // O componente Rating do MUI vai de 0 a 5 estrelas
            precision={0.5} // Para uma precisão de meia estrela
            readOnly // Torna as estrelas somente leitura (apenas para exibição)
          />
          <Typography variant="p">{item.observacao}</Typography>
        </Box>
      ))}
                  <TableCell align="center">
                    <Box className={styles.plans__table__actions}>
                      <Tooltip title="Editar Item">
                        <span>
                          <FaEdit
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenPlanModal(employee)} // Passando 'employee' ao invés de 'expense'
                          />
                        </span>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <span>
                          <FaTrash
                            style={{ cursor: "pointer" }}
                            color="red"
                            onClick={() => handleDeleteEmployee(employee._id)} // Corrigido para 'employee._id'
                          />
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={5}
                count={filteredEmployess.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "Linhas por página",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* Modal para criar ou editar plano */}
      <EmployeeModal
        open={isPlanModalOpen}
        onClose={handleClosePlanModal}
        onSave={handleSaveExpense}
        item={currentExpense}
      />

      {/* Modal para gerar relatório */}
      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
