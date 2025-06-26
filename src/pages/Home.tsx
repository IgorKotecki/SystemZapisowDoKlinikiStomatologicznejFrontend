import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const colors = {
    color1: '#003141',
    color3: '#007987',
    color4: '#00b2b9',
    white: '#ffffff'
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', backgroundColor: colors.white }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: '70vh', md: '90vh' },
          backgroundImage: 'url("/images/dental-office.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: colors.white,
          textAlign: 'center',
          px: 2
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 49, 65, 0.8)',
            p: 4,
            borderRadius: 3,
            maxWidth: 600
          }}
        >
          <Typography variant="h3" gutterBottom>
            {t('home.welcomeTitle')}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {t('home.welcomeText')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              backgroundColor: colors.color3,
              '&:hover': { backgroundColor: colors.color4 },
              textTransform: 'none'
            }}
            onClick={() => navigate('/appointment')}
          >
            {t('book')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 10 }, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          {t('home.ourServices') || 'ajdnkjansdjknajksnjdkansdjknas'}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[1, 2, 3].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={`/images/service${i + 1}.jpg`}
                  alt={`Service ${i + 1}`}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ajdnkjansdjknajksnjdkansdjknas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ajdnkjansdjknajksnjdkansdjknas ajdnkjansdjknajksnjdkansdjknas ajdnkjansdjknajksnjdkansdjknas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ py: 6, px: 2, backgroundColor: colors.color1, color: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          {t('home.testimonials') || 'ajdnkjansdjknajksnjdkansdjknas'}
        </Typography>
        <Typography variant="body1" textAlign="center" maxWidth="700px" mx="auto">
          "ajdnkjansdjknajksnjdkansdjknas ajdnkjansdjknajksnjdkansdjknas ajdnkjansdjknajksnjdkansdjknas"
          <br />– ajdnkjansdjknajksnjdkansdjknas
        </Typography>
      </Box>
    </Box>
  );
}
