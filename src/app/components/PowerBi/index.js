import React, { useRef } from "react";
import { Box, Typography, Card, IconButton } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen"; // Ícone de tela cheia
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"; // Ícone de sair da tela cheia

const PowerBIEmbed = ({ title, width, height, src }) => {
  const iframeRef = useRef(null); // Referência para o iframe

  // Função para entrar no modo de tela cheia
  const enterFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari e Opera
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
      }
    }
  };

  // Função para sair do modo de tela cheia
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari e Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  };

  // Verificar se está em modo de tela cheia
  const isFullscreen = () => {
    return !!document.fullscreenElement;
  };

  return (
    <Card sx={{ boxShadow: 3, width: '40%', height: "350px", borderRadius: '0', position: 'relative' }}>
      {/* Botão de tela cheia */}
      <IconButton
        onClick={isFullscreen() ? exitFullscreen : enterFullscreen}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        aria-label={isFullscreen() ? "Sair da tela cheia" : "Tela cheia"}
      >
        {isFullscreen() ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>

      {/* Iframe do Power BI */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ddd',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <iframe
          ref={iframeRef}
          title={title}
          width="720" height="600.5" 
          src={src}
          frameBorder="0"
          allowFullScreen="true"
        />
      </Box>
    </Card>
  );
};

export default PowerBIEmbed;