import React, { useEffect, useState } from 'react';
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
  Tooltip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { fetchUsers } from './API'; 
const AssignUserDialog = ({ 
  open, 
  onClose, 
  task, 
  onAssignUser 
}) => {
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme()

  // Fetch users when the modal opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchUsers()
        .then((data) => {
          setSystemUsers(data); // Atualiza os usuários com os dados da API
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao buscar usuários:', error);
          setLoading(false);
        });
    }
  }, [open]);

  // Function to check if a user is assigned to the task
  const isUserAssigned = (userId) => {
    return task?.assignedUsers?.some((u) => u.id === userId);
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
        <Typography variant="caption" color={theme.palette.text.secondary}>
          Tarefa: {task?.title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            {systemUsers.map((user) => {
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
                        {user.name[0]}{user.name.split(' ')[1]?.[0]} {/* Iniciais do nome */}
                      </Avatar>
                    </Tooltip>
                    
                    <Box>
                      <Typography variant="subtitle2">
                        {user.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={theme.palette.text.secondary}
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
        )}
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
