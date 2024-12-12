import React, { useEffect, useState } from "react";
import {
  Box,
} from "@mui/material";
import styles from "./Init.module.css";
import { useContext } from "react";
import AuthContext from "@/app/context/AuthContext";
import { useCompany } from "@/app/context/CompanyContext";
export default function Init() {

  const { user, logout } = useContext(AuthContext);
  const { company, setSelectedCompany } = useCompany();

  return (
    <Box className={styles.init}>
      <Box className={styles.init__top}>
        <Box className={styles.init__notifications}></Box>
        {/*<Box className={styles.init__top__brown_1}>
          <PowerBIEmbed
            src={
              "https://app.powerbi.com/view?r=eyJrIjoiODU0YjQwNDAtNjQ0Ni00YWRiLTkxYzQtNjI1ODI0MWQwMjc5IiwidCI6IjA2NzM4ZjZiLTY3MjEtNDliMi05MDhiLWRkZWVkNTE4MjRmZiJ9&pageName=8307471add6fa5b0aa1a"
            }
          />
        </Box>*/}
      </Box>
    </Box>
  );
}
