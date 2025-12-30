import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { colors } from '../utils/colors';
import type { Service } from '../Interfaces/Service';

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);


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