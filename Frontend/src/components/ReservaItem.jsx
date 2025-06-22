import { Card, CardContent, Typography } from "@mui/material";

export default function ReservaItem({ fecha, servicio, vehiculo }) {
  return (
    <Card sx={{ bgcolor: "#333", color: "#fff", mb: 2 }}>
      <CardContent>
        <Typography><strong>Fecha:</strong> {fecha}</Typography>
        <Typography><strong>Servicio:</strong> {servicio}</Typography>
        <Typography><strong>Vehículo:</strong> {vehiculo}</Typography>
      </CardContent>
    </Card>
  );
}