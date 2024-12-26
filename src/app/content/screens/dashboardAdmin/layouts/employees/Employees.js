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
  Stack,
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
import { CircularProgress } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReportModal from "@/app/components/Modal/Admin/ReportModal";
import {
  fetchedEmployeesByCompany,
  deleteEmployeeById,
} from "./API";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from "./Employees.module.css";
import { useCompany } from "@/app/context/CompanyContext";
import EmployeeModal from "@/app/components/Modal/Admin/ModalEmployee";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";
import { EmployeeDetailView } from "@/app/components/DetailsUser";

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
  const [currentEmployee, setCurrentEmployee] = useState([]);
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
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const handleDeleteClick = (e, employee) => {
    e.stopPropagation();
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const buttonStyles = {
    backgroundColor: "#3A8DFF",
    color: "#ffffff",
    borderRadius: '8px',
    "&:hover": {
      backgroundColor: "#3A8DFF",
    },
  };

  // New state for enhanced features
  const [advancedFilters, setAdvancedFilters] = useState({
    department: "",
    position: "",
    status: "",
    location: "",
  });
  const [viewMode, setViewMode] = useState("list");


  useEffect(() => {
    if (company) {
      const loadEmployees = async () => {
        setIsLoading(true);
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
          setIsLoading(false);
        }
      };
      loadEmployees();
    }
  }, [company, currentEmployee]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPlanModal = (expense) => {
    setCurrentEmployee(expense);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleSaveExpense = () => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleDeleteEmployee = async (id) => {
    const deleted = await deleteEmployeeById(id);
    if (deleted) {
      const loadEmployees = async () => {
        const employeesData = await fetchedEmployeesByCompany(company.name);
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

  // New functions for enhanced features
  const handleAdvancedFilter = () => {
    const filtered = employees.filter((emp) => {
      return (
        (!advancedFilters.department ||
          emp.department === advancedFilters.department) &&
        (!advancedFilters.position ||
          emp.position === advancedFilters.position) &&
        (!advancedFilters.status || emp.status === advancedFilters.status) &&
        (!advancedFilters.location ||
          emp.codigoLocal?.name === advancedFilters.location)
      );
    });
    setFilteredEmployess(filtered);
  };

  const handleViewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setViewMode("detail");
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const now = new Date();
    const reportDate = `${now.toLocaleDateString(
      "pt-BR"
    )} ${now.toLocaleTimeString("pt-BR")}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório Funcionários", 10, 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Empresa: ${company.name}`, 10, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Gerado em: ${reportDate}`, 10, 30);

    const tableColumn = [
      "Nome",
      "Equipe",
      "Telefone",
      "Regional",
      "Município",
      "Localidade",
      "Placa Moto",
      "Departamento",
      "Cargo",
      "Status",
    ];

    const tableRows = filteredEmployess.map((emp) => [
      `${emp.name} ${emp.surname}`,
      emp.codigoEquipe,
      emp.phone,
      emp.codigoRegional?.name,
      emp.codigoMunicipio?.name,
      emp.codigoLocal?.name,
      emp.placaMoto,
      emp.department,
      emp.position,
      emp.status,
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 40 });
    doc.save("relatorio_funcionarios.pdf");
  };

  // Advanced Filters Section
  const AdvancedFiltersSection = () => (
    <Box
      sx={{
        mb: 2,
        mt: 4,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "row",
        justifyContent: "right",
      }}
    >
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Departamento</InputLabel>
          <Select
            value={advancedFilters.department}
            onChange={(e) =>
              setAdvancedFilters({
                ...advancedFilters,
                department: e.target.value,
              })
            }
          >
            <MenuItem value="">Todos</MenuItem>
            {Array.from(new Set(employees.map((emp) => emp.department))).map(
              (dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={advancedFilters.status}
            onChange={(e) =>
              setAdvancedFilters({ ...advancedFilters, status: e.target.value })
            }
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
            <MenuItem value="Afastado">Afastado</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Regional</InputLabel>
          <Select
            value={advancedFilters.location}
            onChange={(e) =>
              setAdvancedFilters({
                ...advancedFilters,
                location: e.target.value,
              })
            }
          >
            <MenuItem value="">Todas</MenuItem>
            {Array.from(
              new Set(employees.map((emp) => emp.codigoRegional?.name))
            ).map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={handleAdvancedFilter}
        >
          Aplicar Filtros
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box className={styles.plans}>
      <Box
        sx={{
          borderBottom: "1px solid #d9d9d9",
          borderRadius: "0",
          padding: ".0",
          marginTop: "-1rem",
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
          Gerencie todos os funcionários da <Typography variant="p" fontWeight={'bold'}> {company?.name}</Typography>
        </Typography>
      </Box>

      {/* Add Advanced Filters */}
      <AdvancedFiltersSection />

      {viewMode === "list" ? (
        <TableContainer className={styles.plans__table__container}>
          <Box display="flex" gap={2} p={2}>
            <Button
              variant="contained"
              sx={buttonStyles}
              onClick={generatePdf}
              startIcon={<ArticleIcon />}
            >
              Gerar Relatório
            </Button>
            <Button
              variant="contained"
              sx={buttonStyles}
              onClick={handleOpenPlanModal}
              startIcon={<AddIcon />}
            >
              Novo Funcionário
            </Button>
          </Box>
          <Table className={styles.plans__table}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Nome
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Equipe
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Telefone
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Regional
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Município
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Localidade
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Placa Moto
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Departamento
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Cargo
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading ? filteredEmployess
                ?.filter(
                  (employee) =>
                    employee?.codigoRegional && employee?.codigoLocal
                )
                .map((employee) => (
                  <TableRow
                    key={employee._id}
                    onClick={() => handleViewEmployeeDetails(employee)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <TableCell align="center">
                      {employee?.name} {employee?.surname}
                    </TableCell>
                    <TableCell align="center">
                      {employee?.codigoEquipe}
                    </TableCell>
                    <TableCell align="center">{employee?.phone}</TableCell>
                    <TableCell align="center">
                      {employee?.codigoRegional?.name}
                    </TableCell>
                    <TableCell align="center">
                      {employee?.codigoMunicipio?.name}
                    </TableCell>
                    <TableCell align="center">
                      {employee?.codigoLocal?.name}
                    </TableCell>
                    <TableCell align="center">{employee?.placaMoto}</TableCell>
                    <TableCell align="center">{employee?.department}</TableCell>
                    <TableCell align="center">{employee?.position}</TableCell>
                    <TableCell align="center">
                      <Box
                        style={{
                          backgroundColor: (() => {
                            switch (employee?.status) {
                              case "Ativo":
                                return "#C8E6C9";
                              case "Inativo":
                                return "#FFCDD2";
                              case "Afastado":
                                return "#FBBC04";
                              default:
                                return "#FFFFFF";
                            }
                          })(),
                          color: "#000",
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
                    <TableCell align="center">
                      <Box className={styles.plans__table__actions}>
                        <Tooltip title="Editar Funcionário">
                          <span>
                            <FaEdit
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPlanModal(employee);
                              }}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <span>
                            <FaTrash
                              style={{ cursor: "pointer" }}
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(e, employee);
                              }}
                            />
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )) : <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 100,
                    height: '400px',
                   
                  }}
                >
                <CircularProgress
                  size={30}
                  thickness={5}
                  sx={{// use a cor que combina com seu tema
                  }}
                />
              </Box>}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    { label: "Todos", value: -1 },
                  ]}
                  colSpan={11}
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
      ) : (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setViewMode("list")}
            sx={{ mb: 2 }}
          >
            Voltar para lista
          </Button>
          <EmployeeDetailView employee={selectedEmployee} />
        </Box>
      )}

      <EmployeeModal
        open={isPlanModalOpen}
        onClose={handleClosePlanModal}
        onSave={handleSaveExpense}
        employee={currentEmployee}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={() => handleDeleteEmployee(employeeToDelete._id)}
        employeeName={`${employeeToDelete?.name} ${employeeToDelete?.surname}`}
      />

      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </Box>
  );
}
