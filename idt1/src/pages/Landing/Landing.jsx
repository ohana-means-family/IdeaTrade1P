// idt1/src/pages/Landing/Landing.jsx
import { Button, Container, Typography } from "@mui/material";

export default function Landing() {
  return (
    <Container sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h3" fontWeight="bold">
        Idea Trade
      </Typography>

      <Typography sx={{ mt: 2, color: "text.secondary" }}>
        Special features for our customers
      </Typography>

      <Button variant="contained" sx={{ mt: 4 }}>
        Try Free Tools
      </Button>
    </Container>
  );
}
