import React from "react";
import { Badge, IconButton, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { UserProfile } from "../UserProfileIcon";

const NotificationBadge = ({ count = 0, onClick }) => {
  return (
    <Box
      sx={{
        height: '50px',
        width: "100%",
        boxSizing: 'border-box',
        padding: '0 1.2rem',
        display: "flex",
        flexDirection: "row",
        justifyContent: "right",
        textAlign: "right",
      }}
    >
        <Box>
        <IconButton
        size="large"
        aria-label="show notifications"
        color="inherit"
        onClick={onClick}
        sx={{}}
      >
        <Badge badgeContent={count} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
       
        </Box>
        <UserProfile />
    </Box>
  );
};

export default NotificationBadge;
