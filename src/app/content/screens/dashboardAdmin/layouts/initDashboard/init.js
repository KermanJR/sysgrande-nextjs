import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import styles from "./Init.module.css";
import { SiCoffeescript } from "react-icons/si";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { FaUsersLine } from "react-icons/fa6";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TfiUser, TfiWrite } from "react-icons/tfi";
import { fetchProducts, fetchUsers, fetchOrders } from './API'; 

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box >
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Init() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      const productsFromApi = await fetchProducts();
      setProducts(productsFromApi);
    };

    const getUsers = async () => {
      const usersFromApi = await fetchUsers();
      setTotalUsers(usersFromApi.length);
    };

    const getOrders = async () => {
      const ordersFromApi = await fetchOrders();
      setTotalOrders(ordersFromApi.length);
    };

    getProducts();
    getUsers();
    getOrders();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  return (
    <Box className={styles.init}>
      <Box className={styles.init__top}>
        <Box className={styles.init__top__brown_1} style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifiContent: 'center', alignItems:' center', width: '100%'}}>
          <Box>
         
          </Box>
          <Box>
          <Typography variant="h6"></Typography>
          <Typography variant="h4">{}</Typography>
          </Box>
         
        </Box>
        <Box className={styles.init__top__brown_2} style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifiContent: 'center', alignItems:' center', width: '100%'}}>
          <Box>
          
          </Box>
          <Box>
          <Typography variant="h6"></Typography>
          <Typography variant="h4">{}</Typography>
          </Box>
        
        </Box>
        <Box className={styles.init__top__brown_3} style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifiContent: 'center', alignItems:' center', width: '100%'}}>
        <Box>
          
          </Box>
          <Box>
          <Typography variant="h6"></Typography>
          <Typography variant="h4">{}</Typography>
          </Box>
         
        </Box>
      </Box>

      <TableContainer component={Paper} className={styles.init__table}>
        <Typography
          typography="h6"
          style={{ fontWeight: "bold", color: "#1E3932" }}
        >
          Serviços executados
        </Typography>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>N°</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Quantidade</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Estado de Conservação</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Localização</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Marca</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Modelo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Nº</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : products
            ).map((product) => (
              <TableRow key={product.id}>
                <TableCell style={{ width: 60, height: 60 }}>
                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {product.id}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {product.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {product.description}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {product.bar_code}
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {product.quantity} Un.
                </TableCell>
                <TableCell style={{ width: 160 }} align="left">
                  {Number(product.price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={7}
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "Linhas por página",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
