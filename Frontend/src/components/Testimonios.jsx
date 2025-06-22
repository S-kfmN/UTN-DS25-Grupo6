import { Box, Typography, Card, CardContent } from "@mui/material";

export default function Testimonios() {
  const testimonios = [
    "Excelente atención y rapidez",
    "Muy profesional, lo recomiendo",
    "Volveré sin dudas",
  ];

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>Testimonios de Clientes</Typography>
      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        {testimonios.map((texto, index) => (
          <Card key={index} sx={{ maxWidth: 300, bgcolor: "#333", color: "#fff" }}>
            <CardContent>
              <Typography>"{texto}"</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}