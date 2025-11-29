import { Box, Typography, Button, Grid, IconButton, Container } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={{ bgcolor: '#f5f5f5', py: 6, mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="space-between">         

          <Grid size={{ xs: 12, md: 5 }} component="div">
            <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
              Dentysta
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: '#77767c' }}>
              Dentist cos tu jeszcze na pewno fajnego bedzie
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>{t('dropLine')}</Button>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} component="div">
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'black' }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ color: '#77767c' }}>+1 23 456 78</Typography>
            <Typography variant="body2" sx={{ color: '#77767c' }}>paweł@szeliSzeliga.com</Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, color: 'black' }} gutterBottom>
              Address
            </Typography>
            <Typography variant="body2" sx={{ color: '#77767c' }}>
              Ul. Jakaś tam 12/23a, Warszawa 02-021
            </Typography>

            <Box sx={{ mt: 2 }}>
              <IconButton><InstagramIcon /></IconButton>
              <IconButton><FacebookIcon /></IconButton>
              <IconButton><TelegramIcon /></IconButton>
            </Box>

            <Box sx={{ mt: 2 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
