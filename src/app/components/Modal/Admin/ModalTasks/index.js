import { useContext, useEffect, useState } from 'react';
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
  
  

  /*useEffect(() => {
    if (isEditing) {
      addHistoryEvent('Tarefa editada');
    } else {
      addHistoryEvent('Tarefa criada');
    }
  }, [isEditing]);*/
  

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
          <Tab label="Checklist" />
          <Tab label="Etiquetas" />
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
             <Box>
             <TextField
               fullWidth
               placeholder="Escrever um comentário..."
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && comment.trim()) {
                   addHistoryEvent(comment.trim());
                   setComment('');
                 }
               }}
               variant="outlined"
               size="small"
               sx={{ marginBottom: 2 }}
             />
              <List>
      {taskData?.history?.map((entry, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={`${entry.user} - ${entry.event}`}
            secondary={
              <>
                <Typography component="span" variant="body2" color={theme.palette.text.primary}>
                  {new Date(entry.date).toLocaleString()}
                </Typography>
                {entry.details && (
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {JSON.stringify(entry.details)}
                  </Typography>
                )}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
           </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  value={checklistItem}
                  onChange={(e) => setChecklistItem(e.target.value)}
                  placeholder="Novo item do checklist..."
                />
                <Button onClick={addChecklistItem} sx={{ mt: 1 }}>
                  Adicionar
                </Button>
              </Box>
              <List>
                {taskData.checklist?.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Checkbox
                        checked={item.completed}
                        onChange={() => {
                          const newChecklist = [...taskData.checklist];
                          newChecklist[index].completed = !newChecklist[index].completed;
                          setTaskData({ ...taskData, checklist: newChecklist });
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Nova etiqueta..."
                />
                <Button 
                  onClick={() => {
                    if (newLabel.trim()) {
                      setTaskData({
                        ...taskData,
                        labels: [...(taskData.labels || []), newLabel]
                      });
                      setNewLabel('');
                    }
                  }} 
                  sx={{ mt: 1 }}
                >
                  Adicionar
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {taskData.labels?.map((label, index) => (
                  <Chip
                    key={index}
                    label={label}
                    onDelete={() => {
                      const newLabels = taskData.labels.filter((_, i) => i !== index);
                      setTaskData({ ...taskData, labels: newLabels });
                    }}
                  />
                ))}
              </Box>
            </Box>
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