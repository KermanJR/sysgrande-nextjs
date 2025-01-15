import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';

const FilterPurchases = ({ 
  open, 
  onClose, 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  purchases,
  buttonStyles 
}) => {
 
  const handleFilterChange = (field) => (event) => {
    if (field === 'reset') {
      onFilterChange({
        materialType: '',
        supplier: '',
        startDate: null,
        endDate: null
      });
      return;
    }
  
    const value = event?.target?.value ?? event;
    
    // Se for um campo de data, converte para o formato ISO
    if (field === 'startDate' || field === 'endDate') {
      onFilterChange({
        ...filters,
        [field]: value ? new Date(value).toISOString() : null
      });
    } else {
      onFilterChange({
        ...filters,
        [field]: value
      });
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros Avançados
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
        <TextField
  label="Data de Compra Inicial"
  type="date"
  value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
  onChange={handleFilterChange('startDate')}
  InputLabelProps={{
    shrink: true,
  }}
  fullWidth
/>

<TextField
  label="Data de Compra Final"
  type="date"
  value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
  onChange={handleFilterChange('endDate')}
  InputLabelProps={{
    shrink: true,
  }}
  fullWidth
  inputProps={{
    min: filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : '',
  }}
/>

          <FormControl fullWidth>
            <InputLabel>Material</InputLabel>
            <Select
              value={filters.materialType || ''}
              onChange={handleFilterChange('materialType')}
              label="Material"
            >
              <MenuItem value="">Todos</MenuItem>
              {[...new Set(purchases.map(emp => emp.materialType))]
                .filter(Boolean)
                .map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Fornecedor</InputLabel>
            <Select
              value={filters.supplier || ''}
              onChange={handleFilterChange('supplier')}
              label="Fornecedor"
            >
              <MenuItem value="">Todos</MenuItem>
              {[...new Set(purchases.map(emp => emp.supplier.name))]
                .filter(Boolean)
                .map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleFilterChange('reset')()}
              
            >
              Limpar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              sx={buttonStyles}
            >
              Aplicar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default FilterPurchases;