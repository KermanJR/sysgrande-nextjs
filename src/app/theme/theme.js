import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { Kanit } from "next/font/google"; // Usando a fonte Montserrat
import colors from "./color"; // Importando as cores definidas

// Configuração da fonte Montserrat
const montserrat = Kanit({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    text: colors.textPrimary,
  },
  typography: {
    fontFamily: montserrat.style.fontFamily,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 300 },
  },
  shape: {
    borderRadius: 8, // Bordas arredondadas para elementos
  },
  spacing: 8, // Espaçamento padrão entre os elementos
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove o texto em maiúsculas
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: colors.textPrimary.main,
        },
        h2: {
          color: colors.textPrimary.main,
        },
        body1: {
          color: colors.textPrimary.main,
        },
      },
    },
  },
});

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
