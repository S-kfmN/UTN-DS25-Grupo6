import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#000", borderBottom: "2px solid #ffcc00" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img src="/renault-logo.png" alt="Logo Renault" style={{ width: 60 }} />
          <Typography variant="h6" sx={{ color: "#ffcc00", fontWeight: "bold" }}>
            Lubricentro Renault
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={RouterLink} to="/" sx={{ color: "#fff" }}>Inicio</Button>
          <Button component={RouterLink} to="/reservar" sx={{ color: "#fff" }}>Reservar Turno</Button>
          <Button component={RouterLink} to="/servicios" sx={{ color: "#fff" }}>Servicios</Button>
          <Button component={RouterLink} to="/reservas" sx={{ color: "#fff" }}>Reservas</Button>
          <Button component={RouterLink} to="/contacto" sx={{ color: "#fff" }}>Contacto</Button>
          <Button variant="contained" sx={{ backgroundColor: "#ffcc00", color: "#000", fontWeight: "bold" }}>
            Iniciar Sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}