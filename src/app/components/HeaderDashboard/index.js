import React, { useContext, useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Fade,
  ListItemIcon,
  useTheme
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";

const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};



const HeaderDashboard = ({ title, subtitle, notificationCount = 0, onNotificationClick, onLogout }) => {
  const { user } = useContext(AuthContext);
  const { company } = useCompany();
  
  const theme = useTheme();

  const [selectedCompany, setSelectedCompany] = useState("");
  const [animate, setAnimate] = useState(false);
  // States for menus
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  // Profile menu handlers
  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  // Notification menu handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
    if (onNotificationClick) onNotificationClick();
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  useEffect(() => {
    if (company?.name !== selectedCompany) {
      setSelectedCompany(company.name || "");
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [company, selectedCompany]);

  return (
    <Fade in={true} timeout={700}>
    <Box
      sx={{
        height: "64px",
        width: "100%",
        boxSizing: "border-box",
        padding: "0",
        mt: 6,
        mb: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.primary.main}`

      }}
    >
      {/* Title and Subtitle */}
      <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: .5,
          pb: 3,
        }}>
        <Typography  variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              lineHeight: 1.2,
              textShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
            }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle} {" "} {company?.name}
        </Typography>
      </Box>

      {/* Icons Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Notifications */}
        <Tooltip title="Notificações" arrow>
          <IconButton
            size="large"
            onClick={handleNotificationClick}
            sx={{
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Badge
              badgeContent={notificationCount}
              color="error"
              max={99}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.common.white,
                  fontWeight: "bold",
                  animation: notificationCount > 0 ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)" },
                  },
                },
              }}
            >
              <NotificationsIcon color="action" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Profile Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "8px",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
          onClick={handleProfileClick}
        >
          <Avatar
            src={user?.profilePicture}
            alt={user?.name}
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              fontSize: "1rem",
              fontWeight: "bold",
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[2],
            }}
          >
            {getInitials(user?.name)}
          </Avatar>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileClose}
          TransitionComponent={Fade}
          sx={{
            "& .MuiPaper-root": {
              width: 220,
              borderRadius: "12px",
              mt: 1.5,
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={handleProfileClose}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            Meu Perfil
          </MenuItem>

          <MenuItem onClick={handleProfileClose}>
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Configurações
          </MenuItem>

          <Divider />

          <MenuItem onClick={onLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Sair
          </MenuItem>
        </Menu>
      </Box>
    </Box>
    </Fade>
  );
};

export default HeaderDashboard;