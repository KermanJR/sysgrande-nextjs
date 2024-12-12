import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import {  Montserrat } from 'next/font/google'



const mt = Montserrat({
    weight: ['300','400', '700'],
    subsets: ['latin'],
  });
  
const theme = createTheme({
    typography: {
        fontFamily: mt.style.fontFamily, // aplica a fonte globalmente
    }
})


export default function Theme({children}){
  
    return(
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}