import React, { useState, useContext, useEffect } from "react";
import { Box, Button, TextField, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';  // Importando o hook de notificação
import styles from './login.module.css';
import { fetchRegionals } from "./API";
import LogoSanegrande from '../../../../../../public/icons/logo-sanegrande.png';
import Image from "next/image";

import { Montserrat } from 'next/font/google'
import Wave from "@/app/components/Footer/Wave";

const Ms = Montserrat({
    weight: ['400', '700'], // Defina os pesos necessários
    subsets: ['latin'], // Subconjuntos da fonte
  });
  

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRegional, setSelectedRegional] = useState(""); 
    const [regionais, setRegionais] = useState([]);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();  // Hook para exibir notificações

    // Carrega as regionais ao montar o componente
    useEffect(() => {
        const carregarRegionais = async () => {
            try {
                const data = await fetchRegionals();
                setRegionais(data); // Define as regionais no estado
            } catch (error) {
                console.error('Erro ao carregar regionais', error);
                enqueueSnackbar('Erro ao carregar regionais', { variant: 'error' });
            }
        };
        carregarRegionais();
    }, []);

    // Função para lidar com a mudança da regional
    const handleSelectedRegional = (event) => {
        setSelectedRegional(event.target.value);
    };


    console.log(selectedRegional)
    // Função para realizar Login
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("https://sysgrande-nodejs.onrender.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    codigoRegional: selectedRegional, // Enviar a regional selecionada no login
                }),
            });

            if (!response.ok) {
                throw new Error("Falha no login");
            }

            const data = await response.json();

            // Usar a função login do AuthContext para armazenar o token e detalhes do usuário
            login(data);

            enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });  // Exibir notificação de sucesso

            // Redirecionar para a página principal ou dashboard
            router.push("/dashboard/admin");
        } catch (error) {
            console.error("Erro no login:", error);
            enqueueSnackbar('Erro no login. Verifique suas credenciais.', { variant: 'error' });  // Exibir notificação de erro
        }
    };

    return (
        <Box className={`${styles.containerLogin}`}>
           
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignSelf: 'center',
                    alignItems: "center",
                    width: '40vh',
                    margin: '0 auto',
                    padding: 3,
                }}
                

            >
                <Image
                    src={LogoSanegrande}
                    width={50}
                    height={50}
                    style={{objectFit: 'contain'}}
                    alt="Logo - Sanegrande"
                />
                <Typography variant="h4" sx={{ mb: 2, color: '#5E899D'}}>
                    Sanegrande 
                </Typography>
                <TextField
                    label="Digite seu E-mail"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Digite sua senha"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <FormControl fullWidth margin="normal" style={{marginTop: '-.1rem'}}>
                    <InputLabel>Regional</InputLabel>
                    <Select
                        value={selectedRegional} // Agora o valor vem de selectedRegional
                        onChange={handleSelectedRegional} // Função para lidar com a seleção
                        label="Regional"
                    >
                        {regionais.map((regional) => (
                            <MenuItem key={regional.regionalCode} value={regional.regionalCode}>
                                {regional.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={(e)=>handleLogin(e)}  sx={{ mt: 2, padding: '.7rem 2.5rem', background: '#5E899D'}}>
                    Entrar
                </Button>
                
            </Box>
           <Wave/>
        </Box>
    );
};

export default LoginPage;
