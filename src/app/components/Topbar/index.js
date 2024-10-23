import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import styles from './Topbar.module.css';
import LogoSanegrande from '../../../../public/icons/logo-sanegrande.png';
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from 'next/router';
import AuthContext from '@/app/context/AuthContext';

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <Box className={styles.topbar}>
      <Box className={styles.topbar__boxLogo}>
        <Image src={LogoSanegrande.src} width={40} height={40} style={{ objectFit: 'contain', marginTop: '0rem', width: '40px', height: '50px' }} />
        <Typography sx={{ color: 'white' }}>Sanegrande | Enterhome</Typography>
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
