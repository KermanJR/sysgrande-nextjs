// Updated TaskBoard.js
import React, { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import styles from "./Tasks.module.css";
import {
  createTasks,
  updateTasks,
  fetchTasks,
  deleteTaskById,
  updateTaskStatus,
} from "./API";
import toast from "react-hot-toast";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import TaskModal from "../../../../../components/Modal/Admin/ModalTasks/index";
import { TaskColumn } from "./TaskColumn";
import AssignUserDialog from "./AssignUserTaks";

export default function TaskBoard() {
  const { company } = useCompany();
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  // States
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [assignUserDialog, setAssignUserDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    notes: "",
    assignedUsers: [],
    createdBy: "",
    company: "",
  });

  // Column state
  const [columns, setColumns] = useState({
    todo: {
      name: "À Fazer",
      tasks: [],
      color: "#e3f2fd",
    },
    inProgress: {
      name: "Fazendo",
      tasks: [],
      color: "#fff3e0",
    },
    review: {
      name: "Em Revisão",
      tasks: [],
      color: "#e8f5e9",
    },
    done: {
      name: "Concluído",
      tasks: [],
      color: "#f3e5f5",
    },
  });

  // Priority color helper
  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ef5350",
      medium: "#ffa726",
      low: "#66bb6a",
      default: "#78909c",
    };
    return colors[priority.toLowerCase()] || colors.default;
  };

  // Fetch tasks
  const fetchAndSetTasks = async () => {
    try {
      const tasks = await fetchTasks();
      const updatedColumns = { ...columns };

      Object.keys(updatedColumns).forEach((key) => {
        updatedColumns[key].tasks = [];
      });

      tasks.forEach((task) => {
        const status = task.status || "todo";
        if (updatedColumns[status]) {
          updatedColumns[status].tasks.push(task);
        }
      });

      setColumns(updatedColumns);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao carregar tarefas");
    }
  };

  useEffect(() => {
    fetchAndSetTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Se não houver destino ou a tarefa for solta no mesmo lugar
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Atualizar UI otimisticamente
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks = Array.from(destColumn.tasks);

    // Remover da origem e adicionar ao destino
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destination.droppableId };
    destTasks.splice(destination.index, 0, updatedTask);

    // Atualizar estado local imediatamente
    const newColumns = {
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks },
    };
    setColumns(newColumns);

    try {
      // Atualizar o status no backend
      await updateTaskStatus(movedTask._id, destination.droppableId);
      toast.success("Status da tarefa atualizado com sucesso");
    } catch (error) {
      // Se falhar, reverter UI ao estado anterior
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });

      toast.error("Erro ao atualizar status da tarefa");
      console.error("Erro ao atualizar status:", error);
    }
  };
  // Task handlers
  const handleAddOrUpdateTask = async (taskData) => {
    if (taskData.title.trim()) {
      const columnId = selectedColumn;
      const column = columns[columnId];

      const taskPayload = {
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        priority: taskData.priority,
        notes: taskData.notes,
        assignedUsers: taskData.assignedUsers,
        createdBy: user?.id,
        company: company?.name,
        status: "todo",
      };

      try {
        let response;
        if (taskData.id) {
          response = await updateTasks(taskPayload, taskData.id);
          if (response) {
            await fetchAndSetTasks(); // Refresh all tasks
            toast.success("Tarefa atualizada com sucesso");
            const updatedTasks = column.tasks.map((task) =>
              task.id === taskData.id ? { ...response, id: taskData.id } : task
            );
            setColumns({
              ...columns,
              [columnId]: { ...column, tasks: updatedTasks },
            });
          }
        } else {
          response = await createTasks(taskPayload);
          if (response) {
            toast.success("Tarefa criada com sucesso");
            const newTask = { id: response.id, ...response };
            const updatedTasks = [...column.tasks, newTask];
            setColumns({
              ...columns,
              [columnId]: { ...column, tasks: updatedTasks },
            });
          }
        }
        handleCloseDialog();
      } catch (error) {
        toast.error("Erro ao salvar a tarefa");
        console.error("Erro:", error);
      }
    } else {
      toast.error("O título da tarefa é obrigatório.");
    }
    setTaskData({
      title: "",
      description: "",
      deadline: "",
      priority: "",
      notes: "",
      assignedUsers: [],
      createdBy: "",
    });
  };

  const handleDeleteTask = async (columnId, taskId) => {
    try {
      const response = await deleteTaskById(taskId);
      if (response) {
        toast.success("Tarefa deletada com sucesso");
        const column = columns[columnId];
        const updatedTasks = column.tasks.filter((task) => task._id !== taskId);
        setColumns({
          ...columns,
          [columnId]: { ...column, tasks: updatedTasks },
        });
      }
    } catch (error) {
      console.error("Erro ao deletar a tarefa:", error);
      toast.error("Erro ao deletar a tarefa");
    }
  };

  const handleEditTask = (task, columnId) => {
    setIsEditing(true);
    setSelectedColumn(columnId);
    setTaskData({
      id: task._id,
      title: task.title,
      description: task.description || "",
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "",
      priority: task.priority || "",
      notes: task.notes || "",
      assignedUsers: task.assignedUsers || [],
      createdBy: task.createdBy || "",
    });
    setNewTaskDialog(true);
  };

  const handleCloseDialog = () => {
    setTaskData({
      title: "",
      description: "",
      deadline: "",
      priority: "",
      notes: "",
      assignedUsers: [],
      createdBy: "",
    });
    setIsEditing(false);
    setSelectedColumn("");
    setNewTaskDialog(false);
  };

  const handleAddNewTask = (columnId) => {
    setSelectedColumn(columnId);
    setIsEditing(false);
    setNewTaskDialog(true);
  };

  return (
    <Box className={styles.plans}>
      {/* Header */}
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
          Quadro de Tarefas
        </Typography>
        <Typography
          typography="label"
          style={{
            padding: "0 0 1rem 0",
            color: "#1E3932",
            fontSize: ".875rem",
          }}
        >
          Gerencie todas as tarefas da <Typography variant="p" >{company?.name}</Typography>
          <Typography variant="p" fontWeight={"bold"}>
            {" "}
            {company?.name}
          </Typography>
        </Typography>
      </Box>

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd} >
        <Box display="flex" gap={2} justifyContent="space-between" mt={4} sx={{
          borderRadius: '8px',
          height: '70vh'
        }}>
          {Object.entries(columns).map(([columnId, column]) => (
            <TaskColumn
              key={columnId}
              columnId={columnId}
              column={column}
              onAddTask={handleAddNewTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAssignUser={(task) => {
                setSelectedTask(task);
                setAssignUserDialog(true);
              }}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </Box>
      </DragDropContext>

      {/* Task Modal */}
      <TaskModal
        open={newTaskDialog}
        onClose={handleCloseDialog}
        onSubmit={handleAddOrUpdateTask}
        initialData={taskData}
        isEditing={isEditing}
      />

      <AssignUserDialog
        open={assignUserDialog}
        onClose={() => setAssignUserDialog(false)}
        task={selectedTask}
        onAssignUser={(userId) => {
          // Implement your assign user logic here
        }}
      />
    </Box>
  );
}
