import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Avatar,
  AvatarGroup,
  Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import styles from "./Tasks.module.css";
import { createTasks, updateTasks, fetchTasks, deleteTaskById } from "./API";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";

export default function TaskBoard() {

  const { company } = useCompany(); // Acessando a empresa selecionada do contexto
  const { user } = useContext(AuthContext);

  // Mock de usuários do sistema - substitua pela integração real
  const systemUsers = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', avatar: 'JS' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', avatar: 'MS' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', avatar: 'PC' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', avatar: 'AO' }
  ];

  // Estados
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [assignUserDialog, setAssignUserDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado inicial de uma nova tarefa
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    notes: "",
    assignedUsers: [],
    createdBy: ""
  });

  // Estado das colunas e tarefas
  const [columns, setColumns] = useState({
    todo: { 
      name: "À Fazer", 
      tasks: [],
      color: "#e3f2fd" 
    },
    inProgress: { 
      name: "Fazendo", 
      tasks: [],
      color: "#fff3e0"
    },
    review: { 
      name: "Em Revisão", 
      tasks: [],
      color: "#e8f5e9"
    },
    done: { 
      name: "Concluído", 
      tasks: [],
      color: "#f3e5f5"
    },
  });

  // Função para obter a cor baseada na prioridade
  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ef5350",
      medium: "#ffa726",
      low: "#66bb6a",
      default: "#78909c"
    };
    return colors[priority] || colors.default;
  };

   // Função para abrir o modal de edição
   const handleEditTask = (task, columnId) => {

    console.log(task)
    setIsEditing(true);
    setSelectedColumn(columnId);
    setTaskData({
      id: task._id,
      title: task.title,
      description: task.description || "",
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "",
      priority: task.priority || "",
      notes: task.notes || "",
      assignedUsers: task.assignedUsers || [],
      createdBy: task.createdBy || ""
    });
    setNewTaskDialog(true);
  };

  // Função para limpar o formulário
  const resetForm = () => {
    setTaskData({
      title: "",
      description: "",
      deadline: "",
      priority: "",
      notes: "",
      assignedUsers: [],
      createdBy: ""
    });
    setIsEditing(false);
    setSelectedColumn("");
    setNewTaskDialog(false);
  };

  // Função para lidar com o fechamento do modal
  const handleCloseDialog = () => {
    resetForm();
    setNewTaskDialog(false);
  };

  // Função para lidar com o fim do drag and drop
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks = Array.from(destColumn.tasks);

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks },
    });
  };

   // Função para buscar as tarefas da API e organizá-las nos blocos
   const fetchAndSetTasks = async () => {
    try {
      const tasks = await fetchTasks();

      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach((key) => {
        updatedColumns[key].tasks = [];
      });

      tasks.forEach((task) => {
        const status = task.status || "todo"; // Ajustar caso o status venha com outro nome
        if (updatedColumns[status]) {
          updatedColumns[status].tasks.push(task);
        }
      });

      setColumns(updatedColumns);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchAndSetTasks();
  }, []);

  console.log(user)


  const handleAddTask = async (columnId) => {
    if (taskData.title.trim()) {
      const column = columns[columnId];
      
      
      // Objeto de dados da tarefa para envio
      const taskPayload = {
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        priority: taskData.priority,
        notes: taskData.notes,
        assignedUsers: taskData.assignedUsers,
        createdBy: user?.name
      };
  
      try {
        let response

        if (taskData.id) {
          // Caso esteja editando uma tarefa existente
          response = await updateTasks(taskPayload, taskData.id);
          if (response) {
            toast.success("Tarefa atualizada com sucesso");
  
            // Atualiza a tarefa no bloco correspondente
            const updatedTasks = column.tasks.map((task) =>
              task.id === taskData.id ? { ...response, id: taskData.id } : task
            );
            setColumns({ ...columns, [columnId]: { ...column, tasks: updatedTasks } });
          } else {
            toast.error("Erro ao atualizar a tarefa");
          }
        } else {
          // Caso seja uma nova tarefa
          response = await createTasks(taskPayload);
          if (response) {
            toast.success("Tarefa criada com sucesso");
  
            // Adiciona a nova tarefa ao bloco
            const newTask = { id: response.id, ...response };
            const updatedTasks = [...column.tasks, newTask];
            setColumns({ ...columns, [columnId]: { ...column, tasks: updatedTasks } });
          } else {
            toast.error("Erro ao criar a tarefa");
          }
        }
      } catch (error) {
        toast.error("Erro ao salvar a tarefa");
        console.error("Erro:", error);
      }
  
      // Reset do formulário
      setTaskData({
        title: "",
        description: "",
        deadline: "",
        priority: "medium",
        notes: "",
        createdBy: "",
        assignedUsers: [],
      });
  
      setNewTaskDialog(false); // Fecha o diálogo
    } else {
      toast.error("O título da tarefa é obrigatório.");
    }
  };
  

 // Função para deletar uma tarefa
const handleDeleteTask = async (columnId, taskId) => {
  try {
    // Chamada à API para deletar a tarefa
    const response = await deleteTaskById(taskId); // `deleteTask` é uma função da API que realiza a exclusão
    if (response) {
      toast.success("Tarefa deletada com sucesso");

      // Atualizar as tarefas no estado local
      const column = columns[columnId];
      const updatedTasks = column.tasks.filter((task) => task.id !== taskId);
      setColumns({ ...columns, [columnId]: { ...column, tasks: updatedTasks } });
    } else {
      toast.error("Erro ao deletar a tarefa");
    }
  } catch (error) {
    console.error("Erro ao deletar a tarefa:", error);
    toast.error("Erro ao deletar a tarefa");
  }
};


  // Função para atribuir/desatribuir usuário
  const handleAssignUser = (userId) => {
    if (!selectedTask) return;

    const columnId = Object.keys(columns).find(colId => 
      columns[colId].tasks.some(task => task.id === selectedTask.id)
    );

    if (!columnId) return;

    const column = columns[columnId];
    const taskIndex = column.tasks.findIndex(task => task.id === selectedTask.id);
    
    if (taskIndex === -1) return;

    const updatedTask = { ...column.tasks[taskIndex] };
    
    // Toggle usuário (adiciona se não existe, remove se existe)
    const assignedUsers = updatedTask.assignedUsers || [];
    const userIndex = assignedUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      const userToAdd = systemUsers.find(u => u.id === userId);
      updatedTask.assignedUsers = [...assignedUsers, userToAdd];
    } else {
      updatedTask.assignedUsers = assignedUsers.filter(u => u.id !== userId);
    }

    const updatedTasks = [...column.tasks];
    updatedTasks[taskIndex] = updatedTask;

    setColumns({
      ...columns,
      [columnId]: { ...column, tasks: updatedTasks }
    });
  };

  // Handler para abrir o dialog de atribuição
  const openAssignDialog = (task) => {
    setSelectedTask(task);
    setAssignUserDialog(true);
  };

  return (
    <Box className={styles.plans}>
      {/* Header */}
      <Paper 
        elevation={2}
        sx={{
          p: 2,
          mb: 4,
          backgroundColor: "#fff",
          borderRadius: "10px"
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1E3932" }}>
          Quadro de Tarefas
        </Typography>
        <Typography 
          variant="body2"
          sx={{ color: "#1E3932", mt: 1 }}
        >
          Gerencie todas as tarefas da <Typography variant="p" fontWeight={"bold"}>{company?.name}</Typography>
        </Typography>
      </Paper>
      
      {/* Quadro de Tarefas */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" gap={2} justifyContent="space-between">
          {Object.entries(columns).map(([columnId, column]) => (
            <Paper 
              key={columnId} 
              sx={{ 
                width: 300, 
                p: 2, 
                borderRadius: "10px",

              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{column.name}</Typography>
                <Chip 
                  label={column.tasks.length} 
                  size="small" 
                  color="primary"
                />
              </Box>

              <Droppable droppableId={columnId}>
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    onClick={() => handleEditTask(column?.tasks[0], columnId)}
                    sx={{ 
                      minHeight: 200, 
                      backgroundColor: column.color,
                      borderRadius: "8px",
                      p: 1 
                    }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task._id.toString()} 
                        index={index}
                      >
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              mb: 1,
                              backgroundColor: "#fff",
                              boxShadow: 2,
                              "&:hover": {
                                boxShadow: 4
                              }
                            }}
                          >
                            {/* Cabeçalho da Tarefa */}
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {task.title}
                              </Typography>
                              <Box>
                                <Tooltip title="Atribuir Usuários">
                                  <IconButton 
                                    size="small"
                                    onClick={() => openAssignDialog(task)}
                                  >
                                    <PersonAddIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir Tarefa">
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleDeleteTask(columnId, task?._id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                            

                            {/* Usuários Atribuídos */}
                            {task.assignedUsers?.length > 0 && (
                              <Box mb={1}>
                                <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                                  {task.assignedUsers.map(user => (
                                    <Tooltip key={user.id} title={user.name}>
                                      <Avatar
                                        sx={{ width: 24, height: 24, fontSize: '0.8rem' }}
                                        alt={user.name}
                                      >
                                        {user.avatar}
                                      </Avatar>
                                    </Tooltip>
                                  ))}
                                </AvatarGroup>
                              </Box>
                            )}

                            {/* Data Limite */}
                            {task.deadline && (
                              <Box display="flex" alignItems="center" mb={1}>
                                <CalendarTodayIcon 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: "text.secondary" }} 
                                />
                                <Typography variant="caption">
                                  {new Date(task.deadline).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}

                            {/* Prioridade */}
                            <Box display="flex" gap={1}>
                              <Chip
                                size="small"
                                label={task.priority}
                                sx={{
                                  backgroundColor: getPriorityColor(task.priority),
                                  color: "#fff"
                                }}
                              />
                            </Box>

                           
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>

              {/* Botão Adicionar Tarefa */}
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedColumn(columnId);
                  setIsEditing(false);
                  setNewTaskDialog(true);
                }}
                sx={{ mt: 2, width: "100%" }}
              >
                Adicionar Tarefa
              </Button>
            </Paper>
          ))}
        </Box>
      </DragDropContext>

      {/* Dialog Nova Tarefa */}
      <Dialog 
        open={newTaskDialog} 
        onClose={() => setNewTaskDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nova Tarefa</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Título"
              fullWidth
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            />
            
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={2}
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />

            <TextField
              label="Data Limite"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={taskData.deadline}
              onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={taskData.priority}
                label="Prioridade"
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              >
                <MenuItem value="Low">Baixa</MenuItem>
                <MenuItem value="Medium">Média</MenuItem>
                <MenuItem value="High">Alta</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Anotações"
              fullWidth
              multiline
              rows={3}
              value={taskData.notes}
              onChange={(e) => setTaskData({ ...taskData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTaskDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddTask(selectedColumn)}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Atribuir Usuários */}
      <Dialog 
        open={assignUserDialog} 
        onClose={() => setAssignUserDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Atribuir Usuários</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {systemUsers.map(user => {
              const isAssigned = selectedTask?.assignedUsers?.some(u => u.id === user.id);
              
              return (
                <Box 
                  key={user.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    }
                  }}
                  onClick={() => handleAssignUser(user.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>{user.avatar}</Avatar>
                    <Box>
                      <Typography variant="subtitle2">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={isAssigned ? "Atribuído" : "Atribuir"}
                    size="small"
                    color={isAssigned ? "primary" : "default"}
                    sx={{ minWidth: 80 }}
                  />
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignUserDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}