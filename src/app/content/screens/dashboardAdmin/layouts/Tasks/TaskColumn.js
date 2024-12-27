// TaskColumn.js
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  Tooltip,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "./Tasks.module.css";

export const TaskColumn = ({
  columnId,
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onAssignUser,
  getPriorityColor,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        width: 350,
        p: 2,
        borderRadius: "10px",
        overflowY: "scroll",
      }}
      className={styles.scrollColumn}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="p" fontSize={".875rem"} fontWeight={"600"}>
          {column?.name}
        </Typography>
        <Chip label={column.tasks.length} size="small" color="primary" />
      </Box>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              minHeight: 200,
              backgroundColor: column.color,
              borderRadius: "8px",
              p: 1,
            }}
          >
            {column.tasks.map((task, index) => (
              <Draggable
                key={task._id}
                draggableId={task?.id?.toString()}
                index={index}
              >
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onEditTask(task, columnId)}
                    sx={{
                      p: 2,
                      mb: 1,
                      backgroundColor: "#fff",
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    {/* Task Header */}
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography
                        variant="p"
                        fontWeight="400"
                        fontSize={".875rem"}
                      >
                        {task.title}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Tooltip title="Atribuir Usuários">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignUser(task);
                            }}
                          >
                            <PersonAddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir Tarefa">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(columnId, task._id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Assigned Users */}
                    {task.assignedUsers?.length > 0 && (
                      <Box mb={1}>
                        <AvatarGroup
                          max={3}
                          sx={{ justifyContent: "flex-start" }}
                        >
                          {task.assignedUsers.map((user) => (
                            <Tooltip key={user.id} title={user.name}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: "0.8rem",
                                }}
                                alt={user.name}
                              >
                                {user.avatar}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </Box>
                    )}

                    {/* Deadline */}
                    {task.deadline && (
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        width={100}
                        borderRadius={"5px"}
                        p={0.2}
                        sx={{ background: theme.palette.warning.main }}
                      >
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="caption">
                          {new Date(task.deadline).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    {/* Prioridade */}
                    {/* Prioridade */}
                    <Box display="flex" gap={1}>
                      <Chip
                        size="small"
                        label={
                          task.priority?.toLowerCase() === "high"
                            ? "Alta"
                            : task.priority?.toLowerCase() === "medium"
                            ? "Média"
                            : task.priority?.toLowerCase() === "low"
                            ? "Baixa"
                            : task.priority
                        }
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: "#fff",
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

      {/* Add Task Button */}
      <Button
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => onAddTask(columnId)}
        sx={{ mt: 2, width: "100%" }}
      >
        Adicionar Tarefa
      </Button>
    </Paper>
  );
};
