import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  Tooltip
} from '@mui/material';

const AssignUserDialog = ({ 
  open, 
  onClose, 
  task, 
  onAssignUser,
  systemUsers = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', avatar: 'JS' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', avatar: 'MS' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', avatar: 'PC' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', avatar: 'AO' }
  ]  // You can pass this as a prop instead of hardcoding
}) => {
  // Function to check if a user is assigned to the task
  const isUserAssigned = (userId) => {
    return task?.assignedUsers?.some(u => u.id === userId);
  };

  // Function to handle user click
  const handleUserClick = (userId) => {
    onAssignUser(userId);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        <Typography variant="h6">Atribuir Usuários</Typography>
        <Typography variant="caption" color="text.secondary">
          Tarefa: {task?.title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {systemUsers.map(user => {
            const isAssigned = isUserAssigned(user.id);
            
            return (
              <Box 
                key={user.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  },
                  transition: 'background-color 0.2s ease'
                }}
                onClick={() => handleUserClick(user.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Tooltip title={`${user.name} (${user.email})`}>
                    <Avatar 
                      sx={{ 
                        bgcolor: isAssigned ? 'primary.main' : 'grey.400',
                        width: 40, 
                        height: 40 
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                  </Tooltip>
                  
                  <Box>
                    <Typography variant="subtitle2">
                      {user.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={isAssigned ? "Atribuído" : "Atribuir"}
                  size="small"
                  color={isAssigned ? "primary" : "default"}
                  sx={{ 
                    minWidth: 85,
                    '&:hover': {
                      backgroundColor: isAssigned ? 'primary.dark' : 'action.hover'
                    }
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          size="medium"
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUserDialog;