import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import {  Kanit, Nunito } from 'next/font/google'



const roboto = Kanit({
    weight: ['300','400', '700'],
    subsets: ['latin'],
  });
  
const theme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily, // aplica a fonte globalmente
    }
})


export default function Theme({children}){
  
    return(
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}