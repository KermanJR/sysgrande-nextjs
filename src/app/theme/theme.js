import React from "react";
import { ThemeProvider } from "@mui/material";
import theme from './colors'

export default function Theme({children}){
    return(
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}