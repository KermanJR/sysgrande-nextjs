import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import styles from './Topbar.module.css';
import LogoSanegrande from '../../../../public/icons/logo-sanegrande.png';
import LogoEnterHome from '../../../../public/icons/logo-enterhome.png';
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from 'next/router';
import AuthContext from '@/app/context/AuthContext';
import { useCompany } from '@/app/context/CompanyContext'; // Importando o contexto de empresa
import SelectCompanyButton from "../Modal/Admin/SelectCompanyButton";



export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const { company } = useCompany(); // Acessando a empresa selecionada do contexto
  const router = useRouter();

  console.log(company)

  return (
    <Box className={styles.topbar}>
      <Box className={styles.topbar__boxLogo}>

        {
          company?.name == "Sanegrande" && (
            <Image
            src={LogoSanegrande.src}
            width={40}
            height={40}
            style={{ objectFit: 'contain', marginTop: '0rem', width: '40px', height: '50px' }}
          />
          )
        }

{
          company?.name == "Enterhome" && (
            <Image
            src={LogoEnterHome.src}
            width={40}
            height={40}
            style={{ objectFit: 'contain', marginTop: '0rem', width: '40px', height: '50px' }}
          />
          )
        }
       
        
        {/* Botões para selecionar a empresa */}
        <SelectCompanyButton companyData={{ name: 'Sanegrande', id: 1 }} />
        <SelectCompanyButton companyData={{ name: 'Enterhome', id: 2 }} />
      </Box>
      
      
      <Box className={styles.topbar__boxUser}>
        <FaUser color="white" style={{ width: '25px', height: '25px' }} />
        <Typography sx={{ color: 'white' }}>{user ? user.name : 'Minha Conta'}</Typography>
      </Box>
      
      <Box className={styles.topbar__boxLogout}>
        <IoMdLogOut onClick={logout} color="white" style={{ width: '40px', height: '30px', cursor: 'pointer' }} />
        <Typography sx={{ color: 'white' }}>Sair</Typography>
      </Box>
    </Box>
  );
}
