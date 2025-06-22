import { Box, Button, TextField, Typography } from "@mui/material";

export default function ContactoForm() {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 600,
        margin: "2rem auto",
        backgroundColor: "white",
        color: "black",
        padding: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Formulario de Contacto
      </Typography>

      <TextField label="Nombre" variant="filled" required fullWidth />
      <TextField label="Email" type="email" variant="filled" required fullWidth />
      <TextField label="Asunto" variant="filled" required fullWidth />
      <TextField
        label="Mensaje"
        multiline
        rows={4}
        variant="filled"
        required
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        sx={{ backgroundColor: "#ffcc00", color: "#000", fontWeight: "bold" }}
      >
        Enviar mensaje
      </Button>
    </Box>
  );
}