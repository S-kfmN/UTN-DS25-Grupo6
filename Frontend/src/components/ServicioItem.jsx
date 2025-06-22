import { Card, CardContent, Typography } from "@mui/material";

export default function ServicioItem({ titulo, descripcion }) {
  return (
    <Card sx={{ backgroundColor: "#333", color: "#fff", p: 2, maxWidth: 250 }}>
      <CardContent>
        <Typography variant="h6" color="#ffcc00" gutterBottom>{titulo}</Typography>
        <Typography>{descripcion}</Typography>
      </CardContent>
    </Card>
  );
}
