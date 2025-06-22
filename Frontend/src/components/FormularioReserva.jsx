import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";

export default function FormularioReserva() {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "white",
        color: "black",
        padding: 4,
        borderRadius: 2,
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Formulario de Reserva
      </Typography>

      <TextField
        label="Nombre Completo"
        variant="filled"
        required
        fullWidth
      />

      <TextField
        label="Teléfono"
        type="tel"
        variant="filled"
        required
        fullWidth
      />

      <TextField
        label="DNI"
        variant="filled"
        required
        fullWidth
      />

      <TextField
        select
        label="Servicio"
        defaultValue=""
        required
        variant="filled"
        fullWidth
      >
        <MenuItem value="" disabled>—Tipo Servicio—</MenuItem>
        <MenuItem value="aceite">Cambio de Aceite</MenuItem>
        <MenuItem value="filtro">Limpieza de Filtro</MenuItem>
        <MenuItem value="niveles">Revisión de Niveles</MenuItem>
      </TextField>

      <TextField
        label="Fecha"
        type="date"
        required
        InputLabelProps={{ shrink: true }}
        variant="filled"
        fullWidth
      />

      <TextField
        label="Patente del vehículo"
        variant="filled"
        required
        fullWidth
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 2 }}>
        <Button type="reset" variant="outlined" color="inherit" fullWidth>
          Limpiar
        </Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#ffcc00", color: "#000" }} fullWidth>
          Confirmar Reserva
        </Button>
      </Box>
    </Box>
  );
}