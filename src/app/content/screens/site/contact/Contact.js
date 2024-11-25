import React from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import TopBar from "@/app/components/Topbar/TopbarSite";
import Footer from "@/app/components/Footer/Footer";
import styles from "./contact.module.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Image from "next/image";
import ImageContact from "../../../../../../public/siteImages/sobre.png";

const Contato = () => {
  return (
    <div>
      <TopBar />

      <Box className={styles.header}>
        <MapContainer
          center={[-20.4697107, -54.6201212]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[-20.4697107, -54.6201212]}>
            <Popup>
              Av. Salgado Filho, 2187 - Vila Gloria
              <br />
              Campo Grande - MS
              <br />
              79005-300
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
      <Container>
        <Grid container spacing={4} style={{ marginTop: "2rem" }}>
          <Grid item xs={12} md={6}>
            <Paper
              className={styles.contactInfo}
              style={{
                height: "180px",
                backgroundColor: "#1E3932",
                color: "white",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: ".5rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RoomIcon
                  style={{
                    marginRight: "8px",
                    height: "100px",
                    widht: "100px",
                  }}
                />
                <Box>
                  <Typography variant="h6" className={styles.infoTitle}>
                    ENDEREÇO
                  </Typography>
                  <Typography variant="body1" className={styles.infoText}>
                    Av. Salgado Filho, 2187 - Vila Gloria Campo Grande - MS
                    79005-300
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              className={styles.contactInfo}
              style={{
                height: "180px",
                backgroundColor: "#815839",
                color: "white",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: ".5rem",
                  alignItems: 'center',
                  justifyContent: "left",
                }}
              >
                <PhoneIcon
                  style={{
                    marginRight: "8px",
                    widht: "100px",
                  }}
                />
                <Box>
                  <Typography variant="h6" className={styles.infoTitle}>
                    TELEFONE
                  </Typography>
                  <Typography variant="body1" className={styles.infoText}>
                    0800 909 7000
                  </Typography>
                </Box>
              </Box>

              <Box
                style={{
                    marginTop: '1rem',
                  display: "flex",
                  gap: ".5rem",
                  alignItems: 'center',
                }}
              >
              <EmailIcon
                  style={{
                    marginRight: "8px",
                    widht: "100px",
                  }}
                />
                <Box>
                <Typography variant="h6" className={styles.infoTitle}>
                EMAIL
              </Typography>
              <Typography variant="body1" className={styles.infoText}>
                coffeecode@contato.com.br
              </Typography>
                </Box>


              </Box>

              
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} style={{ marginTop: "4rem" }}>
            <Typography variant="h6" className={styles.formTitle}>
              Nossa cafeteria é pioneira na produção de cafés especiais no
              Brasil.
            </Typography>
            <Typography
              variant="h5"
              style={{ marginTop: "2rem", fontWeight: "bold" }}
            >
              Torrefação 100% própria.
            </Typography>
            <Image
              src={ImageContact.src}
              width={500}
              height={300}
              style={{ borderRadius: "4px", objectFit: "contain" }}
            />
          </Grid>
          <Grid item xs={12} md={6} style={{ marginTop: "4rem" }}>
            <Paper className={styles.contactForm}>
              <Typography variant="h6" className={styles.formTitle}>
                Entre em contato conosco
              </Typography>
              <form noValidate autoComplete="off">
                <TextField
                  label="Nome Completo"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  className={styles.textField}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  className={styles.textField}
                />
                <TextField
                  label="DDD"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  className={styles.textField}
                />
                <TextField
                  label="Telefone"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  className={styles.textField}
                />
                <TextField
                  label="Mensagem"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  className={styles.textField}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.submitButton}
                  style={{ background: "#2C544A" }}
                >
                  Enviar
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default Contato;
