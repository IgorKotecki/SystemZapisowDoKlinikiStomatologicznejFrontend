import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface ServiceDTO {
  id: number;
  name: string;
  description: string;
  lowPrice: number;
  highPrice: number;
  minTime: number;
  languageCode: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    color1: '#003141',
    color3: '#007987',
    color4: '#00b2b9',
    white: '#ffffff'
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || 'pl';
        const response = await api.get(`api/Service/UserServices?lang=${lang}`)
        const data: ServiceDTO[] = response.data;

        const randomized = data.length > 3 ? [...data].sort(() => Math.random() - 0.5).slice(0, 3) : data;
        setServices(randomized)
        console.log(randomized)
      } catch (error) {
        console.error('Error featchins services ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [i18n.language]);

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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {services.map((service, i) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={`/images/service${(i % 3) + 1}.jpg`}
                    alt={service.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {service.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {service.description.length > 150
                        ? service.description.slice(0, 150) + '...'
                        : service.description}
                    </Typography>
                    <Typography variant="subtitle2" color="text.primary">
                      {t('home.price')}: {service.lowPrice} - {service.highPrice} PLN
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box sx={{ py: 6, px: 2, backgroundColor: colors.color1, color: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          {t('home.testimonials')}
        </Typography>
        <Typography variant="body1" textAlign="center" maxWidth="700px" mx="auto">
          "Świetna obsługa, bardzo profesjonalnie i przyjaźnie!"
          <br />– Anna Kowalska
        </Typography>
      </Box>
    </Box>
  );
}