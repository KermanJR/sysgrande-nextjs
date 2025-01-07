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
  theme,
}) => {
  return (
    <Box
      sx={{
        width: 320,
        minWidth: 320,
        height: 'calc(100vh - 250px)',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `2px solid ${column.color}`,
          backgroundColor: theme.palette.background.default,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {column.icon} {column.name}
            </Typography>
            <Chip
              label={column.tasks.length}
              size="small"
              sx={{
                backgroundColor: column.color,
                color: '#fff',
                fontWeight: 500,
                minWidth: 28,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              backgroundColor: snapshot.isDraggingOver ? 
                theme.palette.action.hover : 
                theme.palette.background.paper,
              transition: 'background-color 0.2s ease',
              '::-webkit-scrollbar': {
                width: '6px',
              },
              '::-webkit-scrollbar-track': {
                background: theme.palette.background.paper,
              },
              '::-webkit-scrollbar-thumb': {
                background: theme.palette.primary.main,
                borderRadius: '3px',
              },
            }}
          >
            {column.tasks.map((task, index) => (
              <Draggable
                key={task._id}
                draggableId={task._id?.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onEditTask(task, columnId)}
                    elevation={snapshot.isDragging ? 8 : 1}
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ 
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          fontSize: '0.9rem'
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Atribuir Usuários">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignUser(task);
                            }}
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': { 
                                backgroundColor: theme.palette.primary.light + '20'
                              }
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
                            sx={{ 
                              color: theme.palette.error.main,
                              '&:hover': { 
                                backgroundColor: theme.palette.error.light + '20'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {task.assignedUsers?.length > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <AvatarGroup
                          max={3}
                          sx={{
                            '& .MuiAvatar-root': {
                              width: 28,
                              height: 28,
                              fontSize: '0.875rem',
                              border: `2px solid ${theme.palette.background.paper}`,
                            },
                          }}
                        >
                          {task.assignedUsers.map((user) => (
                            <Tooltip key={user.id} title={user.name}>
                              <Avatar alt={user.name}>{user.avatar}</Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {task.deadline && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            backgroundColor: theme.palette.warning.light + '20',
                            color: theme.palette.warning.dark,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="caption">
                            {new Date(task.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}

                      <Chip
                        size="small"
                        label={
                          task.priority?.toLowerCase() === "high" ? "Alta" :
                          task.priority?.toLowerCase() === "medium" ? "Média" :
                          task.priority?.toLowerCase() === "low" ? "Baixa" :
                          task.priority
                        }
                        sx={{
                          backgroundColor: getPriorityColor(task.priority) + '20',
                          color: getPriorityColor(task.priority),
                          fontWeight: 500,
                          '& .MuiChip-label': {
                            px: 1,
                          },
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

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => onAddTask(columnId)}
          fullWidth
          sx={{
            borderColor: column.color,
            color: column.color,
            '&:hover': {
              borderColor: column.color,
              backgroundColor: column.color + '10',
            },
          }}
        >
          Adicionar Tarefa
        </Button>
      </Box>
    </Box>
  );
};