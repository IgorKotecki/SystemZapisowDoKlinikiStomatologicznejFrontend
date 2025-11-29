import { Box, Typography, Button, Grid, IconButton, Container } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useTranslation } from 'react-i18next';
import { colors } from '../utils/colors';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <Box sx={{ bgcolor: colors.white, py: 6, mt: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent={"space-between"} component="div">
        {/* <Grid container spacing={6} justifyContent="space-between"> */}
          <Grid size={{ xs: 12, md: 5 }} component="div">
            <Typography variant="subtitle1" gutterBottom sx={{ color: colors.black }}>
              {t("footer.contact")}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.color6 }}>+1 23 456 78</Typography>
            <Typography variant="body2" sx={{ color: colors.color6 }}>paweł@szeliSzeliga.com</Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, color: colors.color6 }} gutterBottom>
              {t("footer.address")}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.color6 }}>
              Ul. Jakaś tam 12/23a, Warszawa 02-021
            </Typography>

            <Box sx={{ mt: 2 }}>
              <IconButton><InstagramIcon /></IconButton>
              <IconButton><FacebookIcon /></IconButton>
              <IconButton><TelegramIcon /></IconButton>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} component="div">
            <Box sx={{ mt: 2, height: { xs: 150, sm: 175, md: 200, lg: 250 }, width : {xs: 300, sm: 350, md: 400, lg: 500}}}>
              <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="100%"
                height="100%"
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
