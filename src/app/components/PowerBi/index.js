import React from 'react';
import { Box, Typography, Card } from '@mui/material';

const PowerBIEmbed = ({ title, width, height, src }) => {
  return (
    <Card sx={{boxShadow: 3, width: '100%', height: "420px", borderRadius: '8px'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ddd',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <iframe title="teste-sane" width="720" height="600.5" src={src} frameborder="0" allowFullScreen="true"></iframe>
      </Box>
    </Card>
  );
};

export default PowerBIEmbed;
