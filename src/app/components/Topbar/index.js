import React, { useContext, useEffect } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import styles from "./Topbar.module.css";
import LogoSanegrande from "../../../../public/icons/logo-sanegrande.png";
import LogoEnterHome from "../../../../public/icons/logo-enterhome.png";
import Image from "next/image";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
import Person3Icon from '@mui/icons-material/Person3';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const { company, setSelectedCompany } = useCompany();

  

  // Definir empresa padrão caso não exista
  useEffect(() => {
    if (!company || !company.name) {
        setSelectedCompany({ name: "Sanegrande", id: 1 });
    }
}, [company, setSelectedCompany]);


  // Lista de empresas
  const companies = [
    { name: "Sanegrande", id: 1 },
    { name: "Enter Home", id: 2 },
  ];

  // Alterar empresa selecionada
  const handleCompanyChange = (event) => {
    const selectedCompany = companies.find((c) => c.id === event.target.value);
    setSelectedCompany(selectedCompany);
  };

  return (
    <Box className={styles.topbar}>
      <Box className={styles.topbar__boxLogo}>
        {company?.name == "Sanegrande" && (
          <Image
            alt="Logo - Sanegrande"
            src={LogoSanegrande.src}
            width={40}
            height={40}
            style={{
              objectFit: "contain",
              marginTop: "0rem",
              width: "40px",
              height: "50px",
            }}
          />
        )}

        {company?.name == "Enter Home" && (
          <Image
            alt="Logo - Enter Home"
            src={LogoEnterHome.src}
            width={70}
            height={70}
            style={{
              objectFit: "contain",
              marginTop: "0rem",
              width: "40px",
              height: "50px",
            }}
          />
        )}

        <Typography sx={{fontSize: '2.5rem', fontWeight: 'bold', color: '#1E3932'}}>{company?.name}</Typography>
      </Box>

      <Box className={styles.topbar__boxSecond}>
        {/* Menu suspenso para selecionar a empresa */}
        <Select
          value={company?.id || ""}
          onChange={handleCompanyChange}
          displayEmpty
          disableUnderline // Remove a underline padrão
          sx={{
            minWidth: 150,
            marginLeft: "4rem",
            "& .MuiSelect-icon": {
              color: "black", // Cor da setinha
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove a borda no estado normal
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove a borda no estado de hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove a borda no estado de foco
            },
          }}
        >
          <MenuItem value="" disabled>
            Selecione a empresa
          </MenuItem>
          {companies.map((comp) => (
            <MenuItem key={comp.id} value={comp.id}>
              {comp.name}
            </MenuItem>
          ))}
        </Select>

        <Box className={styles.topbar__boxUser}>
          <Person3Icon color="#0F548C" style={{ width: "20px", height: "20px", color: "#0F548C"}} />
          <Typography>
            {user ? user.name : "Minha Conta"}
          </Typography>
        </Box>

        <Box className={styles.topbar__boxLogout}>
          <LogoutIcon
            onClick={logout}
            style={{ width: "20px", height: "20px", cursor: "pointer", color: '#0F548C' }}
          />
          <Typography >Sair</Typography>
        </Box>
      </Box>
    </Box>
  );
}
