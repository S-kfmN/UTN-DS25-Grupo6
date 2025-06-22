import { Box, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "center",
        py: 3,
        borderTop: "1px solid #ffcc00",
        mt: "auto",
      }}
    >
      <Typography variant="body2" component="p">
        &copy; 2025 Lubricentro Renault. Todos los derechos reservados.
      </Typography>
      <MuiLink
        href="#"
        underline="hover"
        sx={{ color: "#ffcc00", display: "block", mt: 1 }}
      >
        Términos y condiciones
      </MuiLink>
    </Box>
  );
}