import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Checkbox,
  Typography,
  useTheme,
  Divider,
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import AuthContext from '@/app/context/AuthContext';

const defaultData = {
  title: '',
  description: '',
  deadline: '',
  priority: '',
  comments: [],
  checklist: [],
  labels: [],
  attachments: [],
  history: [], // Novo campo para o histórico
};


const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'code-block'],
    ['clean']
  ],
};

const TaskModal = ({ open, onClose, onSubmit, initialData, isEditing = false }) => {
  const [taskData, setTaskData] = useState(initialData || defaultData);
  const [activeTab, setActiveTab] = useState(0);
  const [comment, setComment] = useState('');
  const [checklistItem, setChecklistItem] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const {
    user
  } = useContext(AuthContext)

  const theme = useTheme()



  useEffect(() => {
    setTaskData(initialData || defaultData);
  }, [initialData]);

  const handleChange = (field) => (event) => {
    setTaskData({ ...taskData, [field]: event.target.value });
  };

  const handleEditorChange = (content) => {
    setTaskData({ ...taskData, description: content })
  };

  const addHistoryEvent = (event) => {
    setTaskData({
      ...taskData,
      history: [
        ...(taskData?.history || []), // Garante que `history` seja um array vazio se estiver undefined
        {
          user: user?.name, // Substitua pelo usuário autenticado
          event,
          details,
          date: new Date().toISOString()
        }
      ]
      
    });
  };

  const formatDetails = (details) => {
    return Object.entries(details).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <Box key={key} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </Typography>
            <Typography variant="body2" color="primary">
              {value.old} → {value.new}
            </Typography>
          </Box>
        );
      }
      return (
        <Box key={key} sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {key}:
          </Typography>
          <Typography variant="body2">{value}</Typography>
        </Box>
      );
    });
  };

  const getEventColor = (event) => {
    switch (event) {
      case 'Task Created':
        return 'success';
      case 'Task Updated':
        return 'info';
      case 'User Assigned':
        return 'primary';
      case 'User Unassigned':
        return 'warning';
      default:
        return 'default';
    }
  };
  

  /*useEffect(() => {
    if (isEditing) {
      addHistoryEvent('Tarefa editada');
    } else {
      addHistoryEvent('Tarefa criada');
    }
  }, [isEditing]);*/
  
  
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("pt-BR", { timeZone: "UTC" }); // Ajuste o idioma conforme necessário
  };


  const addComment = () => {
    if (comment.trim()) {
      setTaskData({
        ...taskData,
        comments: [...(taskData.comments || []), {
          text: comment,
          user: 'Usuário Atual',
          date: new Date().toISOString(),
        }]
      });
      setComment('');
    }
  };

  const addChecklistItem = () => {
    if (checklistItem.trim()) {
      setTaskData({
        ...taskData,
        checklist: [...(taskData.checklist || []), {
          text: checklistItem,
          completed: false,
        }]
      });
      setChecklistItem('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <TextField
          fullWidth
          value={taskData.title}
          onChange={handleChange('title')}
          variant="standard"
          placeholder="Título da Tarefa"
        />
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Detalhes" />
          <Tab label="Atividade" />
          <Tab label="Anexos" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ReactQuill 
                theme="snow"
                value={taskData.description}
                onChange={handleEditorChange}
                modules={modules}
                style={{ height: '200px', marginBottom: '50px' }}
              />
              
              <TextField
                type="date"
                label="Data Limite"
                InputLabelProps={{ shrink: true }}
                value={taskData.deadline}
                onChange={handleChange('deadline')}
              />

              <FormControl>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={taskData.priority}
                  onChange={handleChange('priority')}
                  label="Prioridade"
                >
                  <MenuItem value="Low">Baixa</MenuItem>
                  <MenuItem value="Medium">Média</MenuItem>
                  <MenuItem value="High">Alta</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

{activeTab === 1 && (
  <List sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
    {taskData?.history?.sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, index, arr) => (
      <React.Fragment key={index}>
        <ListItem sx={{ 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          py: 2,
          backgroundColor: index === 0 ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          borderRadius: index === 0 ? 1 : 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
            <Chip
              label={entry.event === 'Task Created' ? 'Tarefa Criada' :
                    entry.event === 'Task Updated' ? 'Tarefa Atualizada' :
                    entry.event === 'User Assigned' ? 'Usuário Atribuído' :
                    entry.event === 'User Unassigned' ? 'Usuário Removido' :
                    entry.event}
              color={index === 0 ? 'primary' : getEventColor(entry.event)}
              variant={index === 0 ? "filled" : "outlined"}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {new Date(entry.date).toLocaleString('pt-BR')}
            </Typography>
          </Box>
          {entry.details && (
            <Box sx={{ pl: 2, borderLeft: '2px solid', borderColor: 'divider', width: '100%' }}>
              {formatDetails(entry.details)}
            </Box>
          )}
        </ListItem>
        {index < arr.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </List>
)}
         
          {activeTab === 4 && (
            <Box>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setTaskData({
                      ...taskData,
                      attachments: [...(taskData.attachments || []), {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                      }]
                    });
                  }
                }}
              />
              <List>
                {taskData.attachments?.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AttachFile />
                    </ListItemIcon>
                    <ListItemText 
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSubmit(taskData)}>
          {isEditing ? 'Salvar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;