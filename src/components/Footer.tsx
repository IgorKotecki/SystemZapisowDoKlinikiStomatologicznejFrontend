import { Box, Typography, Grid, IconButton, Container } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useTranslation } from 'react-i18next';
import { colors } from '../utils/colors';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: colors.white, py: 6}}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent={"space-between"} component="div">
        {/* <Grid container spacing={6} justifyContent="space-between"> */}
          <Grid size={{ xs: 12, md: 5 }} component="div">
            <Typography variant="subtitle1" gutterBottom sx={{ color: colors.black }}>
              {t("footer.contact")}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.color6 }}>+48 223 456 778</Typography>
            <Typography variant="body2" sx={{ color: colors.color6 }}>dentalClinic.s27030@gmail.com</Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, color: colors.color6 }} gutterBottom>
              {t("footer.address")}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.color6 }}>
              Ul. Przykładowa 12/23a, Warszawa 02-021
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1332.6503434859428!2d20.993321037159877!3d52.22355529169011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc96ae8df4f5%3A0xfd5f36ad75e9e7f5!2sPolsko-Japo%C5%84ska%20Akademia%20Technik%20Komputerowych!5e0!3m2!1spl!2spl!4v1764507429952!5m2!1spl!2spl"
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
