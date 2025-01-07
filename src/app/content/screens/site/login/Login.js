import React, { useContext } from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';
import styles from './login.module.css';
import Image from "next/image";
import LogoSanegrande from '../../../../../../public/icons/logo-sanegrande.png';
import Wave from "@/app/components/Footer/Wave";

const URL_LOCAL = 'http://localhost:5000/api/';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email inválido')
                .required('Email é obrigatório'),
            password: Yup.string()
                .min(6, 'Senha deve ter no mínimo 6 caracteres')
                .required('Senha é obrigatória')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await fetch(`${URL_LOCAL}login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Falha no login");
                }

                await login(data);
                enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
                await router.push("/dashboard/admin");
            } catch (error) {
                console.error("Erro no login:", error);
                enqueueSnackbar(error.message || 'Erro no login. Verifique suas credenciais.', { variant: 'error' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box className={styles.containerLogin}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignSelf: 'center',
                alignItems: "center",
                width: '40vh',
                margin: '0 auto',
                padding: 3,
            }}>
                <Image
                    src={LogoSanegrande}
                    width={50}
                    height={50}
                    style={{objectFit: 'contain'}}
                    alt="Logo - Sanegrande"
                />
                <Typography variant="h4" sx={{ mb: 2, color: '#5E899D' }}>
                    Sanegrande
                </Typography>
                <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Digite seu E-mail"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        disabled={formik.isSubmitting}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        type="password"
                        label="Digite sua senha"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        disabled={formik.isSubmitting}
                        sx={{ mb: 2 }}
                    />
                    <Button 
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={formik.isSubmitting}
                        sx={{ 
                            mt: 2, 
                            padding: '.7rem 2.5rem', 
                            background: '#5E899D'
                        }}
                    >
                        {formik.isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : 'Entrar'}
                    </Button>
                </form>
            </Box>
            <Wave />
        </Box>
    );
};

export default LoginPage;