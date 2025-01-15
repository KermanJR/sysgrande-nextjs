import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import * as XLSX from "xlsx";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";
import HeaderDashboard from "@/app/components/HeaderDashboard";
import { useCompany } from "@/app/context/CompanyContext";
import PurchaseModal from "@/app/components/Modal/Admin/ModalShop";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PDFDocument, rgb } from "pdf-lib";
import {
  deletePurchaseById,
  deleteSupplierById,
  fetchedPurchases,
  fetchedPurchasesByCompany,
  fetchedSuppliers,
} from "./API";
import SupplierModal from "@/app/components/Modal/Admin/ModalSuppliers";
import { formatCNPJ } from "@/app/utils/formatCNPJ";
import { formatPhone } from "@/app/utils/formatPhone";
import FilterDrawer from "@/app/components/FilterDrawer/FilterDrawer";

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
        aria-label="última página"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Suppliers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [setIsLoading, isLoading] = useState(false);
  const { company } = useCompany();
  const theme = useTheme();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    Fornecedor: "",
    CNPJ: "",
    Email: "",
    Telefone: "",
    Endereço: "",
  });

  const formatDate = (date) => {
    if (!date) return "-";
    const newDate = new Date(date);
    return newDate.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  useEffect(() => {
    if (company) {
      const loadSuppliers = async () => {
        try {
          const supplierData = await fetchedSuppliers(company.name);
          const activeSuppliers = supplierData.filter(
            (supplier) => !supplier.deletedAt
          );

          setSuppliers(activeSuppliers);
          setFilteredSuppliers(activeSuppliers);
        } catch (error) {
          console.error("Erro ao carregar compras", error);
          toast.error("Erro ao carregar as compras");
        }
      };

      loadSuppliers();
    }
  }, [company, suppliers.length]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPurchaseModal = (supplier = null) => {
    setCurrentPurchase(supplier); // Renomeie para currentSupplier se preferir
    setIsPurchaseModalOpen(true);
  };

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setCurrentPurchase(null);
  };

  const handleSavePurchase = (updatedSupplier) => {
    if (currentPurchase) {
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier._id === updatedSupplier._id ? updatedSupplier : supplier
        )
      );
    } else {
      setSuppliers((prevSuppliers) => [...prevSuppliers, updatedSupplier]);
    }
    setFilteredSuppliers(suppliers); // Atualiza a lista filtrada também
  };

  const handleDeletePurchase = async (id) => {
    const deleted = await deleteSupplierById(id);
    if (deleted) {
      setPurchases((prevItem) => prevItem.filter((item) => item.id !== id));
      setFilteredPurchases((prevExpense) =>
        prevExpense.filter((expense) => expense.id !== id)
      );
      toast.success("Fornecedor excluída com sucesso.");
    }
  };

  const handleFilterChange = (field) => (event) => {
    if (field === "reset") {
      setFilters({
        Fornecedor: "",
        CNPJ: "",
        Email: "",
        Telefone: "",
        Endereço: "",
      });
      setFilteredSuppliers(suppliers);
      return;
    }

    setFilters({
      ...filters,
      [field]: event.target.value,
    });
  };

  const applyFilters = () => {
    const filtered = employees.filter((emp) => {
      return (
        (!filters.Fornecedor || emp.Fornecedor === filters.Fornecedor) &&
        (!filters.CNPJ || emp.CNPJ === filters.CNPJ) &&
        (!filters.Email || emp.codigoRegional?.Email === filters.Email) &&
        (!filters.Telefone ||
          emp.codigoMunicipio?.Telefone === filters.Telefone) &&
        (!filters.Endereço || emp.codigoEquipe === filters.Endereço)
      );
    });
    setFilteredEmployess(filtered);
  };

  const buttonStyles = {
    backgroundColor: "#3A8DFF",
    color: "#ffffff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#3A8DFF",
    },
    position: 'sticky',
              top: 0,
              zIndex: 2 
  };

  // Função para formatar CNPJ
const formatCNPJ = (cnpj) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

// Função para formatar CEP
const formatCEP = (cep) => {
  return cep.replace(/^(\d{5})(\d{3})/, "$1-$2");
};

// Função para formatar telefone
const formatPhone = (phone) => {
  return phone.replace(/^(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
};

const handleExportPdf = () => {
  const now = new Date();
  const getCurrentMonthYear = () => {
    const months = [
      'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const date = new Date();
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const selectedData = filteredSuppliers
    .filter((supplier) => selectedSuppliers.includes(supplier._id));

  const baseHeaders = [
    "Nome",
    "CNPJ",
    "E-mail",
    "Telefone",
    "Endereço",
    "Bairro",
    "Cidade/UF",
    "CEP"
  ];

  const tableData = [];

  selectedData.forEach((supplier) => {
    const baseData = [
      supplier.name ? supplier.name : '-',
      supplier.cnpj ? formatCNPJ(supplier.cnpj) : '-',
      supplier.email ? supplier.email : '-',
      supplier.phone ? formatPhone(supplier.phone) : '-',
      `${supplier.address.street}, ${supplier.address.number}`,
      supplier.address.neighborhood ? supplier.address.neighborhood : '-',
      `${supplier.address.city}/${supplier.address.state}`,
      supplier.address.cep ? formatCEP(supplier.address.cep) : '-'
    ];
    tableData.push(baseData);
  });

  const doc = new jsPDF({
    orientation: 'landscape'
  });

  const primaryColor = [158, 197, 232];
  const borderColor = [0, 0, 0];
  const pageWidth = doc.internal.pageSize.width;
  
  // Configurações do título e logo
  const titleY = 15;
  const titleHeight = 15;
  const logoWidth = 48;
  const logoHeight = 10;
  const logoX = 20;
  const logoY = titleY + (titleHeight - logoHeight) / 2;

  // Desenhar retângulo cinza
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(0, 0, 0);
  doc.rect(14, titleY, pageWidth - 28, titleHeight, 'FD');

  // Adicionar logo
  company.name === 'Sanegrande' 
    ? doc.addImage('../../../../icons/logo-sanegrande-2.png', 'PNG', logoX, logoY, logoWidth, logoHeight)
    : doc.addImage('../../../../icons/logo-enterhome.png', 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Configurar e adicionar o título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  const title = `CONTROLE DE FORNECEDORES - ${getCurrentMonthYear()} - ${company.name === 'Sanegrande' ? 'SANEGRANDE CONSTRUTORA LTDA' : 'ENTER HOME'}`;
  doc.text(title, pageWidth / 2, titleY + titleHeight/2 + 1, { align: 'center' });

  // Data de geração
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(
    `Gerado em: ${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR")}`,
    pageWidth - 20,
    titleY + titleHeight + 5,
    { align: 'right' }
  );

  const tableConfig = {
    startY: titleY + titleHeight + 10,
    head: [baseHeaders],
    body: tableData,
    headStyles: {
      fillColor: primaryColor,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 6,
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 6,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center' },
      2: { cellWidth: 'auto' },
      3: { halign: 'center' },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 'auto' },
      6: { halign: 'center' },
      7: { halign: 'center' }
    },
    margin: { top: 50, right: 14, bottom: 20, left: 14 },
    tableLineWidth: 0.5,
    tableLineColor: borderColor,
    showHead: 'everyPage',
    theme: 'grid',
    styles: {
      cellPadding: 3,
      fontSize: 6,
      lineColor: borderColor,
      lineWidth: 0.3,
      overflow: 'linebreak',
      valign: 'middle'
    },
    didDrawPage: function(data) {
      const pageHeight = doc.internal.pageSize.height;
      
      // Informações do rodapé
      doc.setFontSize(6);
      doc.setTextColor(100);
      doc.text(
        company.name,
        14,
        pageHeight - 15
      );
      doc.text(
        `Página ${data.pageCount}`,
        pageWidth - 20,
        pageHeight - 15,
        { align: 'right' }
      );
    }
  };

  // Gerar a tabela
  doc.autoTable(tableConfig);

  // Adicionar sumário no final
  const finalY = doc.previousAutoTable.finalY || 280;

  // Adicionar total em negrito
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Total de Fornecedores: ${selectedData.length}`,
    pageWidth - 20,
    finalY + 12,
    { align: 'right' }
  );

  // Salvar o PDF
  const fileName = `cadastro_fornecedores_${getCurrentMonthYear().replace(' ', '_')}.pdf`;
  doc.save(fileName);
};

  const handleExportSelected = () => {
    const selectedData = filteredSuppliers.filter((emp) =>
      selectedSuppliers.includes(emp._id)
    );

    const now = new Date();
    const reportDate = `${now.toLocaleDateString(
      "pt-BR"
    )} ${now.toLocaleTimeString("pt-BR")}`;

    const wsData = [
      ["Relatório de Fornecedores"],
      [`Empresa: ${company.name}`],
      [`Gerado em: ${reportDate}`],
      [],
      ["Nome", "CNPJ", "E-mail", "Telefone", "Endereço"],
      ...selectedData.map((emp) => [
        emp.name,
        formatCNPJ(emp.cnpj),
        emp.email,
        formatPhone(emp.phone),
        emp.address.street +
          ", " +
          emp.address.number +
          " - " +
          emp.address.neighborhood +
          ", " +
          emp.address.city +
          "/" +
          emp.address.state +
          " - " +
          emp.address.cep,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Definindo estilos
    const headerStyle = {
      fill: { fgColor: { rgb: "9EC5E8" } },
      font: { bold: true, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const titleStyle = {
      font: { bold: true, size: 16, color: { rgb: "000000" } },
      alignment: { horizontal: "center" },
    };

    const infoStyle = {
      font: { size: 12 },
      alignment: { horizontal: "left" },
    };

    // Aplicando estilos
    ws["!cols"] = [
      { width: 30 }, // Nome
      { width: 20 }, // CNPJ
      { width: 30 }, // E-mail
      { width: 15 }, // Telefone
      { width: 50 }, // Endereço
    ];

    // Estilo do título
    ws["A1"] = { v: "Relatório de Fornecedores", s: titleStyle };
    ws["A2"] = { v: `Empresa: ${company.name}`, s: infoStyle };
    ws["A3"] = { v: `Gerado em: ${reportDate}`, s: infoStyle };

    // Estilo do cabeçalho
    const headerRange = XLSX.utils.decode_range("A5:E5");
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cell = XLSX.utils.encode_cell({ r: 4, c: col });
      ws[cell].s = headerStyle;
    }

    // Mesclando células do título
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Título
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Empresa
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Data
    ];

    // Criando e salvando o arquivo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fornecedores");

    // Configurações adicionais
    ws["!rows"] = [
      { hpt: 30 }, // Altura da linha do título
      { hpt: 25 }, // Altura da linha da empresa
      { hpt: 25 }, // Altura da linha da data
      { hpt: 20 }, // Linha vazia
      { hpt: 25 }, // Altura do cabeçalho
    ];

    XLSX.writeFile(wb, "fornecedores_selecionados.xlsx");
  };

  const formatAddress = (address) => {
    if (!address) return "-";

    const { street, number, complement, neighborhood, city, state, cep } =
      address;

    return `${street}, ${number} - ${neighborhood}, ${city}/${state} - CEP: ${cep}`;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        p: 2,
        mt: -6,
        ml: -3
      }}
    >
      <Dialog
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      >
        <DialogTitle>Exportar Fornecedores</DialogTitle>
        <DialogContent>Selecione o formato de exportação:</DialogContent>
        <DialogActions sx={{ margin: "0 auto", textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => {
              handleExportSelected();
              setIsExportModalOpen(false);
            }}
            startIcon={<ArticleIcon />}
          >
            Excel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleExportPdf();
              setIsExportModalOpen(false);
            }}
            startIcon={<PictureAsPdfIcon />}
          >
            PDF
          </Button>
        </DialogActions>
      </Dialog>
      <HeaderDashboard
        subtitle="Gerencie os fornecedores da empresa"
        title="Fornecedores"
      />

      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        employees={suppliers}
        buttonStyles={buttonStyles}
      />
<Box display="flex" gap={2} p={2} ml={-2} stickyHeader sx={{ minWidth: 1200, position: 'sticky', zIndex: 3 }}>
          <Button
            variant="contained"
            sx={buttonStyles}
            onClick={() => handleOpenPurchaseModal()}
            startIcon={<AddIcon />}
          >
            Novo Fornecedor
          </Button>

          {selectedSuppliers.length > 0 && (
            <>
              <Button
                variant="contained"
                startIcon={<ArticleIcon />}
                onClick={() => setIsExportModalOpen(true)}
              >
                Exportar Selecionados
              </Button>
              
            </>
          )}
        </Box>
     
<TableContainer 
  component={Paper} 
  sx={{ 
    maxHeight: 'calc(100vh - 250px)', // Altura máxima considerando o cabeçalho
    width: '100%',
    overflow: 'auto' // Habilita scroll em ambas direções quando necessário
  }}
>
       
        <Table stickyHeader sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{  position: 'sticky',}}>
                <Checkbox
                  checked={
                    selectedSuppliers.length === filteredSuppliers.length
                  }
                  indeterminate={
                    selectedSuppliers.length > 0 &&
                    selectedSuppliers.length < filteredSuppliers.length
                  }
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedSuppliers(
                        filteredSuppliers.map((emp) => emp._id)
                      );
                    } else {
                      setSelectedSuppliers([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", position: 'sticky',
              top: 0,
              zIndex: 2 }}>
                Fornecedor
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold",  position: 'sticky',
              top: 0,
              zIndex: 2 }}>
                Responsável
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: "bold",  position: 'sticky',
              top: 0,
              zIndex: 2 }}>
                E-mail
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", position: 'sticky',
              top: 0,
              zIndex: 2 }}>
                Telefone
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", position: 'sticky',
              top: 0,
              zIndex: 2 }}>
                CNPJ
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", position: 'sticky',
              top: 0,
              zIndex: 2 }}>
                Endereço
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold",  position: 'sticky',
              top: 0,
              zIndex: 2 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((supplier) => {
                let statusBgColor = "";
                if (supplier.status === "Paga") {
                  statusBgColor = "#8BE78B";
                } else if (supplier.status === "Pendente") {
                  statusBgColor = "#F6F794";
                } else if (supplier.status === "Atrasada") {
                  statusBgColor = "red";
                }

                return (
                  <TableRow key={supplier.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedSuppliers.includes(supplier._id)}
                        onChange={(event) => {
                          event.stopPropagation();
                          if (event.target.checked) {
                            setSelectedSuppliers([
                              ...selectedSuppliers,
                              supplier._id,
                            ]);
                          } else {
                            setSelectedSuppliers(
                              selectedSuppliers.filter(
                                (id) => id !== supplier._id
                              )
                            );
                          }
                        }}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell align="center">{supplier?.name 
                ? supplier?.name: '-'}</TableCell>
                    <TableCell align="center">{supplier?.contact 
                ? supplier?.contact: '-'}</TableCell>

                    <TableCell align="center">{supplier?.email 
                ? supplier?.email: '-'}</TableCell>
                    <TableCell align="center">
                    {supplier?.phone 
                ? formatPhone(supplier?.phone): '-'}
                    </TableCell>
                    <TableCell align="center">
                    {supplier?.cnpj 
                ? formatCNPJ(supplier?.cnpj): '-'}
                    </TableCell>
                    <TableCell align="center">
                    {supplier?.address 
                ? formatAddress(supplier?.address): '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Editar Compra">
                          <span>
                            <FaEdit
                              style={{ cursor: "pointer" }}
                              onClick={() => handleOpenPurchaseModal(supplier)}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <span>
                            <FaTrash
                              style={{ cursor: "pointer" }}
                              color="red"
                              onClick={() => handleDeletePurchase(supplier._id)}
                            />
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[4, 8, 12, { label: "Todos", value: -1 }]}
                colSpan={12}
                count={suppliers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "Linhas por página",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <SupplierModal
        open={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        onSave={handleSavePurchase}
        item={currentPurchase}
      />
    </Box>
  );
}
