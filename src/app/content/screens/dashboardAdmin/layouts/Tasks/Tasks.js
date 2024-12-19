import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Paper, Typography, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "./Tasks.module.css";

export default function TaskBoard() {
  const [newTask, setNewTask] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");


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

  // Adicionar nova tarefa
  const handleAddTask = (columnId) => {
    if (newTask.trim()) {
      const column = columns[columnId];
      const updatedTasks = [...column.tasks, { id: Date.now(), content: newTask }];
      setColumns({ ...columns, [columnId]: { ...column, tasks: updatedTasks } });
      setNewTask("");
    }
  };

  const [columns, setColumns] = useState({
    todo: { name: "À Fazer", tasks: [] },
    inProgress: { name: "Fazendo", tasks: [] },
    review: { name: "Em Revisão", tasks: [] },
    done: { name: "Concluído", tasks: [] },
  });

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
                Férias
              </Typography>
              <Typography
                typography="label"
                style={{
                  padding: "0 0 1rem 0",
                  color: "#1E3932",
                  fontSize: ".875rem",
                }}
              >
                Gerencie todas as tarefas da empresa
              </Typography>
            </Box>
      
    <DragDropContext onDragEnd={onDragEnd} sx={{border: '1px solid red'}}>
      <Box display="flex" gap={2} justifyContent="space-between" marginTop={5}>
        
        {Object.entries(columns).map(([columnId, column]) => (
          <Paper key={columnId} sx={{ width: 300, p: 2, backgroundColor: "#fff" }}>
            <Typography variant="h6" mb={2}>
              {column.name}
            </Typography>

            {/* Área Drop */}
            <Droppable droppableId={columnId}>
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ minHeight: 200, backgroundColor: "#f9f9f9", p: 1 }}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            p: 1,
                            mb: 1,
                            backgroundColor: "#e3f2fd",
                            boxShadow: 2,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{task.content}</Typography>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>

            {/* Adicionar Tarefa */}
            <Box mt={2}>
              <TextField
                label="Nova Tarefa"
                size="small"
                fullWidth
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddTask(columnId)}
                sx={{ mt: 1 }}
              >
                Adicionar
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </DragDropContext>
    </Box>
  );
}
