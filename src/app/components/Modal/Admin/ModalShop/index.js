import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  Grid,
  Tooltip,
  Paper,
  TableCell,
  TableRow,
  Table,
  TableContainer,
  TableHead,
  TableBody,
} from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from "@mui/icons-material/Info";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import NotificationManager from "@/app/components/NotificationManager/NotificationManager";
import {
  createPurchase,
  fetchedSuppliersByCompany,
  updatePurchase,
} from "./API";
import { DeleteIcon } from "lucide-react";
import { Edit } from "@mui/icons-material";



const PurchaseModal = ({ open, onClose, onSave, item }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();

  const [materialType, setMaterialType] = useState("");
  const [buyer, setBuyer] = useState("");
  const [supplier, setSupplier] = useState("");
  const [contact, setContact] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [entrancyPaymentDate, setEntrancyPaymentDate] = useState(""); // New state for entrance payment date
  const [entrancy, setEntrancy] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [installments, setInstallments] = useState("");
  const [installmentValue, setInstallmentValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [installmentDates, setInstallmentDates] = useState([]);

  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    type: "",
    quantity: "",
    unitPrice: "",
    totalPrice: "",
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItem, setEditingItem] = useState({});

  const renderItemsSection = () => {
   
  
    const handleEditItem = (item) => {
      console.log(item)
      setEditingItemId(item._id);
      setEditingItem(item);
    };
  
    const handleSaveEditedItem = () => {
      if (!editingItem.name || !editingItem.quantity || !editingItem.unitPrice) {
        NotificationManager.error("Por favor, preencha todos os campos do item");
        return;
      }
  
      const updatedItems = items.map(item => 
        item._id === editingItemId 
          ? { 
              ...editingItem, 
              totalPrice: (parseFloat(editingItem.quantity) * parseFloat(editingItem.unitPrice)).toFixed(2) 
            } 
          : item
      );
  
      setItems(updatedItems);
      calculateTotalPurchasePrice(updatedItems);
      setEditingItemId(null);
      setEditingItem({});
    };
  
    const handleCancelEdit = () => {
      setEditingItemId(null);
      setEditingItem({});
    };
  
    const handleEditItemChange = (field, value) => {
      setEditingItem(prev => ({
        ...prev, 
        [field]: value
      }));
    };
    return (
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Adicionar Item
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Nome do Item"
                value={currentItem.name}
                onChange={(e) => handleItemChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Tipo"
                value={currentItem.type}
                onChange={(e) => handleItemChange('type', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Quantidade"
                type="number"
                value={currentItem.quantity}
                onChange={(e) => handleItemChange('quantity', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Valor Unitário"
                type="number"
                value={currentItem.unitPrice}
                onChange={(e) => handleItemChange('unitPrice', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Valor Total"
                type="number"
                value={currentItem.totalPrice}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
               size="small"
                variant="contained"
                color="primary"
                onClick={handleAddItem}
                sx={{ mt: 0 }}
              >
                Adicionar
              </Button>
            </Grid>
          </Grid>
    
          {items.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Valor Unitário</TableCell>
                    <TableCell align="right">Valor Total</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      {editingItemId === item._id ? (
                        <>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={editingItem.name}
                              onChange={(e) => handleEditItemChange('name', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={editingItem.type}
                              onChange={(e) => handleEditItemChange('type', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={editingItem.quantity}
                              onChange={(e) => handleEditItemChange('quantity', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={editingItem.unitPrice}
                              onChange={(e) => handleEditItemChange('unitPrice', e.target.value)}
                            />
                          </TableCell>
                          <TableCell align="right">
                            R$ {(editingItem.quantity * editingItem.unitPrice).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={handleSaveEditedItem}
                            >
                              Salvar
                            </Button>
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">R$ {parseFloat(item.unitPrice).toFixed(2)}</TableCell>
                          <TableCell align="right">R$ {parseFloat(item.totalPrice).toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleEditItem(item)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(item._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>
    );
  };

  useEffect(() => {
    if (item) {
      console.log(item)
      setMaterialType(item?.materialType || "");
      setBuyer(item?.buyer || "");
      setEntrancy(item?.entrancy || "");
      setSupplier(item?.supplier || "");
      setQuantity(item?.quantity || "");
      setUnitPrice(item?.unitPrice || "");
      setSupplier(item?.supplier?._id || "");
      setTotalPrice(item?.totalPrice || "");
      setPaymentMethod(item?.paymentMethod || "");
      setInstallments(item?.installments || "");
      setEntrancyPaymentDate(item?.entrancyPaymentDate ? item.entrancyPaymentDate.split("T")[0] : ""); // Initialize entrance payment date
      setItems(item?.items || []);
      setInstallmentValue(item?.installmentValue || "");
      setDueDate(item?.dueDate ? item.dueDate.split("T")[0] : "");
      setPurchaseDate(
        item?.purchaseDate ? item.purchaseDate.split("T")[0] : ""
      );
      setDeliveryDate(
        item?.deliveryDate ? item.deliveryDate.split("T")[0] : ""
      );
      setAttachment(item?.attachment || null);
      setInstallmentDates(item?.installmentDates || []);
    } else {
      resetForm();
    }
  }, [item]);

  const resetForm = () => {
    setMaterialType("");
    setBuyer("");
    setSupplier("");
    setQuantity("");
    setUnitPrice("");
    setTotalPrice("");
    setPaymentMethod("");
    setInstallments("");
    setInstallmentValue("");
    setEntrancy("");
    setDueDate("");
    setPurchaseDate("");
    setDeliveryDate("");
    setEntrancyPaymentDate("");
    setAttachment(null);
    setInstallmentDates([]);
    setItems([]);
    setCurrentItem({
      name: "",
      type: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
    });
  };

  const handleItemChange = (field, value) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // Automatically calculate total price for the item
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? value : prev.quantity;
        const unitPrice = field === 'unitPrice' ? value : prev.unitPrice;
        if (quantity && unitPrice) {
          updated.totalPrice = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
        }
      }
      
      return updated;
    });
  };

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.quantity || !currentItem.unitPrice) {
      NotificationManager.error("Por favor, preencha todos os campos do item");
      return;
    }

    setItems(prev => [...prev, { ...currentItem, id: Date.now() }]);
    setCurrentItem({
      name: "",
      type: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
    });

    // Recalculate total purchase price
    calculateTotalPurchasePrice([...items, currentItem]);
  };

  const handleRemoveItem = (itemId) => {
    // Cria uma nova array excluindo o item com o ID especificado
    console.log(itemId)
    const updatedItems = items.filter(item => item._id !== itemId);
    setItems(updatedItems);
    // Recalcula o total após a remoção
    calculateTotalPurchasePrice(updatedItems);
  };
  // Function to calculate total purchase price
  const calculateTotalPurchasePrice = (currentItems) => {
  const total = currentItems.reduce((sum, item) => 
    sum + (parseFloat(item.totalPrice) || 0), 0
  );
  setTotalPrice(total.toFixed(2));
};

  useEffect(() => {
    if (installments > 0) {
      // Ajusta o array de datas de acordo com o número de parcelas
      const newDates = Array(parseInt(installments))
        .fill("")
        .map((_, index) => installmentDates[index] || "");
      setInstallmentDates(newDates);
    } else {
      setInstallmentDates([]);
    }
  }, [installments]);

  const handleInstallmentDateChange = (index, value) => {
    const newDates = [...installmentDates];
    newDates[index] = value;
    setInstallmentDates(newDates);
  };

  const handleFileDownload = (attachment) => {
    // Se o attachment for uma string (URL/path)
    if (typeof attachment === 'string') {
      // Cria um link temporário
      const link = document.createElement('a');
      link.href = attachment;
      // Extrai o nome do arquivo do path
      link.download = attachment.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // Se for um File object
    else if (attachment instanceof File) {
      const url = URL.createObjectURL(attachment);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  useEffect(() => {
    if (quantity && unitPrice) {
      const total = parseFloat(quantity) * parseFloat(unitPrice);
      setTotalPrice(total.toFixed(2));
    }
  }, [quantity, unitPrice]);

  useEffect(() => {
    if (totalPrice && installments && installments > 0) {
      // Converte os valores para número e subtrai a entrada do total
      const total = parseFloat(totalPrice);
      const entrada = parseFloat(entrancy) || 0; // caso entrada seja undefined/null
      const numParcelas = parseFloat(installments);

      // Calcula valor das parcelas (total - entrada) / número de parcelas
      const valorParcela = (total - entrada) / numParcelas;

      setInstallmentValue(valorParcela.toFixed(2));
    }
  }, [totalPrice, installments, entrancy]); // Adiciona entrancy como dependência

  useEffect(() => {
    const loadSuppliers = async () => {
      const employeesData = await fetchedSuppliersByCompany(company?.name);
      setSuppliers(employeesData);
    };
    loadSuppliers();
  }, [company]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      NotificationManager.error("Adicione pelo menos um item à compra");
      return;
    }
    const purchaseData = new FormData();

    // Validações básicas
    if (!materialType || !supplier) {
      NotificationManager.error(
        "Por favor, preencha todos os campos obrigatórios"
      );
      return;
    }

    // Dados básicos da compra
    purchaseData.append("materialType", materialType);
    purchaseData.append("items", JSON.stringify(items));
    purchaseData.append("buyer", company?.name || "");
    purchaseData.append("supplier", supplier);
   
    purchaseData.append("entrancy", entrancy);
   
    purchaseData.append("totalPrice", totalPrice);
    purchaseData.append("paymentMethod", paymentMethod);
    purchaseData.append("installments", installments);
    purchaseData.append("installmentValue", installmentValue);
    purchaseData.append("entrancyPaymentDate", entrancyPaymentDate ? new Date(entrancyPaymentDate).toISOString() : "");
    

    // Datas
    purchaseData.append(
      "dueDate",
      dueDate ? new Date(dueDate).toISOString() : ""
    );
    purchaseData.append(
      "purchaseDate",
      purchaseDate ? new Date(purchaseDate).toISOString() : ""
    );
    purchaseData.append(
      "deliveryDate",
      deliveryDate ? new Date(deliveryDate).toISOString() : ""
    );

    // Informações do usuário e empresa
    purchaseData.append("createdBy", user?.name || "");
    purchaseData.append("updatedBy", user?.name || ""); // Corrigido de updateBy para updatedBy
    purchaseData.append("company", company?.name || "");

    // Datas das parcelas
    if (installmentDates && Array.isArray(installmentDates)) {
      purchaseData.append("installmentDates", JSON.stringify(installmentDates));
    }

    // Anexo
    if (attachment instanceof File) {
      purchaseData.append("attachment", attachment);
    }

    try {
      let response;
      if (item) {
        response = await updatePurchase(purchaseData, item._id);
      } else {
        response = await createPurchase(purchaseData);
      }

      if (response?.data || response) {
        // Verifica se há dados na resposta
        onSave(response.data || response);
        NotificationManager.success(
          `Compra ${item ? "atualizada" : "criada"} com sucesso`
        );
        onClose();
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      NotificationManager.error(
        `Erro ao ${item ? "atualizar" : "criar"} a compra: ${
          error.message || "Erro desconhecido"
        }`
      );
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
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
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

        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          {item ? "Editar Compra" : "Adicionar Nova Compra"}
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tipo de Material"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              margin="normal"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Comprador"
              value={company.name}
              margin="normal"
              disabled
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={supplier}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSupplier(selectedId);
                  const selectedSupplier = suppliers.find(
                    (s) => s._id === selectedId
                  );
                  if (selectedSupplier?.contact) {
                    setContact(selectedSupplier.contact);
                  }
                }}
                label="Fornecedor"
                 size="small"
              >
                {suppliers.map((sup) => (
                  <MenuItem key={sup._id} value={sup._id}>
                    {sup.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {renderItemsSection()}

         
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Valor Total"
              type="number"
              value={totalPrice}
              InputProps={{ readOnly: true }}
              margin="normal"
               size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Forma de Pagamento</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Forma de Pagamento"
                 size="small"
              >
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
                <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
                <MenuItem value="Boleto">Boleto</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
                <MenuItem value="Entrada + Pix Parcelas">
                  Entrada + Pix Parcelas
                </MenuItem>
                <MenuItem value="Entrada + Boleto Parcelas">
                  Entrada + Boleto Parcelas
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Entrada"
              type="number"
               size="small"
              value={entrancy}
              onChange={(e) => setEntrancy(e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data do Pagamento da Entrada"
              type="date"
              size="small"
              value={entrancyPaymentDate}
              onChange={(e) => setEntrancyPaymentDate(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Quantidade de Parcelas"
              type="number"
              value={installments}
               size="small"
              onChange={(e) => setInstallments(e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Valor da Parcela"
              type="number"
               size="small"
              value={installmentValue}
              onChange={(e) => setInstallmentValue(e.target.value)}
              margin="normal"
            />
          </Grid>

          {installments > 0 && (
  <Grid item xs={12}>
    <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
      <Typography variant="subtitle1" gutterBottom>
        Datas das Parcelas
      </Typography>
      <Grid container spacing={2}>
        {installmentDates.map((date, index) => (
          <Grid item xs={12} md={4} key={index}>
            <TextField
              fullWidth
              size="small"
              label={`${index + 1}ª Parcela`}
              type="date"
              value={date ? new Date(date).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInstallmentDateChange(index, e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Grid>
)}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
               size="small"
              label="Data da Compra"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
               size="small"
              label="Data de Entrega"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {attachment && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            Arquivo: {attachment?.name ? attachment.name : attachment.split("/").pop()}
          </Typography>
          <IconButton
            onClick={() => window.open(attachment, '_blank')}
            size="small"
            color="primary"
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      )}
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          {attachment ? "Substituir Arquivo" : "Adicionar Arquivo"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PurchaseModal;
