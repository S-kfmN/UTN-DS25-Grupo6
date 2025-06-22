import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ backgroundColor: "#000", color: "#fff" }}
    >
      <Navbar />
      
      {/* Main sin restricciones de ancho */}
      <Box component="main" sx={{ flexGrow: 1, px: 3, py: 4 }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}