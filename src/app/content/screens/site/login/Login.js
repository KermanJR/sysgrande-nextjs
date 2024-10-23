import React, { useState, useContext, useEffect } from "react";
import { Box, Button, TextField, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';  // Importando o hook de notificação
import styles from './login.module.css';
import { fetchRegionals } from "./API";
import LogoSanegrande from '../../../../../../public/icons/logo-sanegrande.png';
import Image from "next/image";

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
            const response = await fetch("http://localhost:5000/api/login", {
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
            console.log(data)

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
        <Box className={styles.containerLogin}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignSelf: 'center',
                    alignItems: "center",
                    width: '50vh',
                    margin: '0 auto',
                    borderRadius: 2,
                    padding: 3,
                    boxShadow: 3,
                    backgroundColor: "#fff",
                }}
            >
                <Image
                    src={LogoSanegrande}
                    width={50}
                    height={50}
                    alt="Logo - Sanegrande"
                />
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Sanegrande
                </Typography>
                <TextField
                    label="E-mail"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Senha"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <FormControl fullWidth margin="normal">
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

                <Button variant="contained" color="primary" onClick={(e)=>handleLogin(e)} fullWidth sx={{ mt: 2 }}>
                    Entrar
                </Button>
            </Box>
            <Typography sx={{marginTop: '.5rem', fontSize: '.7rem'}}>V1.0 - Sysgrande</Typography>
        </Box>
    );
};

export default LoginPage;
