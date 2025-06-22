import { Card, CardContent, Typography } from "@mui/material";

export default function TarjetaProducto({ titulo, descripcion }) {
  return (
    <Card sx={{ backgroundColor: "#333", color: "#fff", p: 2 }}>
      <CardContent>
        <Typography variant="h5" color="yellow">{titulo}</Typography>
        <Typography>{descripcion}</Typography>
      </CardContent>
    </Card>
  );
}