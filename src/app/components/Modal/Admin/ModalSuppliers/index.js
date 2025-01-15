import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import InputMask from 'react-input-mask';
import { IoMdCloseCircleOutline } from "react-icons/io";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import NotificationManager from "@/app/components/NotificationManager/NotificationManager";
import { createSupplier, updateSupplier } from './API';

const SupplierModal = ({ open, onClose, onSave, item }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    contact: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      cep: ''
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        cnpj: item.cnpj || '',
        email: item.email || '',
        phone: item.phone || '',
        contact: item.contact || '',
        address: {
          street: item.address?.street || '',
          number: item.address?.number || '',
          complement: item.address?.complement || '',
          neighborhood: item.address?.neighborhood || '',
          city: item.address?.city || '',
          state: item.address?.state || '',
          cep: item.address?.cep || ''
        }
      });
    } else {
      setFormData({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        contact: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          cep: ''
        }
      });
    }
  }, [item]);

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) return false;
    
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
    return resultado === parseInt(digitos.charAt(1));
  };

  const validatePhone = (phone) => {
    const phoneNumber = phone.replace(/[^\d]/g, '');
    return phoneNumber.length >= 10 && phoneNumber.length <= 11;
  };

  const validateCEP = (cep) => {
    const cepNumber = cep.replace(/[^\d]/g, '');
    return cepNumber.length === 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const searchCEP = async (cep) => {
    if (cep.length === 8) {
      try {
        setLoading(true);
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
              cep: cep
            }
          }));
        } else {
          NotificationManager.error('CEP não encontrado');
        }
      } catch (error) {
        NotificationManager.error('Erro ao buscar CEP');
      } finally {
        setLoading(false);
      }
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validações
      /*if (!formData.name || !formData.cnpj || !formData.email || !formData.phone) {
        NotificationManager.error('Preencha todos os campos obrigatórios');
        return;
      }*/

      /*const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        NotificationManager.error('Email inválido');
        return;
      }

      if (!validateCNPJ(formData.cnpj)) {
        NotificationManager.error('CNPJ inválido');
        return;
      }

      if (!validatePhone(formData.phone)) {
        NotificationManager.error('Telefone inválido');
        return;
      }

      if (!validateCEP(formData.address.cep)) {
        NotificationManager.error('CEP inválido');
        return;
      }*/

      const supplierData = {
        name: formData.name,
        cnpj: formData.cnpj.replace(/[^\d]/g, ''),
        email: formData.email,
        phone: formData.phone.replace(/[^\d]/g, ''),
        contact: formData.contact,
        company: company?.name,
        createdBy: user?.name,
        updateBy: user?.name,
        address: {
          street: formData.address.street,
          number: formData.address.number,
          complement: formData.address.complement || '',
          neighborhood: formData.address.neighborhood,
          city: formData.address.city,
          state: formData.address.state,
          cep: formData.address.cep.replace(/[^\d]/g, '')
        }
      };

      setLoading(true);
      const response = item 
        ? await updateSupplier(supplierData, item._id)
        : await createSupplier(supplierData);

      if (response && response._id) {  // Verifica se a resposta contém o _id do fornecedor
        onSave(response);  // Passa diretamente o objeto do fornecedor
        NotificationManager.success(`Fornecedor ${item ? 'atualizado' : 'criado'} com sucesso`);
        onClose();
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      NotificationManager.error(`Erro ao ${item ? 'atualizar' : 'criar'} fornecedor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        borderRadius: '5px',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <IoMdCloseCircleOutline />
        </IconButton>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          {item ? "Editar Fornecedor" : "Adicionar Novo Fornecedor"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                 size="small"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputMask
                mask="99.999.999/9999-99"
                value={formData.cnpj}
                 size="small"
                onChange={handleChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    label="CNPJ"
                    name="cnpj"
                    
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                 size="small"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputMask
                mask={formData.phone.length > 10 ? "(99) 99999-9999" : "(99) 9999-9999"}
                value={formData.phone}
                 size="small"
                onChange={handleChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    label="Telefone"
                    name="phone"
                     size="small"
                    
                  />
                )}
              </InputMask>
            </Grid>

            <Grid  item xs={12} md={6}>
            <TextField
                fullWidth
                label="Responsável"
                name="contact"
                 size="small"
                type="text"
                value={formData.contact}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputMask
                mask="99999-999"
                 size="small"
                value={formData.address.cep}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value.replace(/[^\d]/g, '').length === 8) {
                    searchCEP(e.target.value.replace(/[^\d]/g, ''));
                  }
                }}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                     size="small"
                    label="CEP"
                    name="address.cep"
                    
                  />
                )}
              </InputMask>

              
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Rua"
                 size="small"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Número"
                name="address.number"
                 size="small"
                value={formData.address.number}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Complemento"
                 size="small"
                name="address.complement"
                value={formData.address.complement}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bairro"
                 size="small"
                name="address.neighborhood"
                value={formData.address.neighborhood}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                 size="small"
                label="Cidade"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                 size="small"
                label="Estado"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Carregando...' : (item ? 'Atualizar' : 'Salvar')}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default SupplierModal;