import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { colors } from '../utils/colors';
import { useState } from 'react';
import ImageSlider from '../components/ImageSlider';
import MetamorphosisDetails from '../components/MetamorphosisDetails';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = {
    before: "/images/Przed.png",
    after: "/images/Po.png"
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', backgroundColor: colors.white }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: '70vh', md: '90vh' },
          backgroundImage: 'url("/images/tło.png")',
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
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
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
              textTransform: 'none',
              px: 4,
              borderRadius: '25px',
              fontWeight: 'bold'
            }}
            onClick={() => navigate('/appointment')}
          >
            {t('header.book')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: 2, backgroundColor: colors.color1, color: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', color: colors.color5 }}>
          {t('metamorphosis.title')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          <ImageSlider
            beforeImage={images.before}
            afterImage={images.after}
          />

          <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 800 }}>
            <Typography variant="body1" sx={{ color: colors.white, mb: 3, opacity: 0.8 }}>
              {t('metamorphosis.shortDescription')}
            </Typography>

            <Button
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              sx={{
                backgroundColor: colors.color3,
                color: colors.white,
                fontWeight: 'bold',
                borderRadius: '20px',
                px: 4,
                '&:hover': { backgroundColor: colors.color4 }
              }}
            >
              {t('metamorphosis.readMore')}
            </Button>
          </Box>
        </Box>
      </Box>


      <MetamorphosisDetails
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        beforeImage={images.before}
        afterImage={images.after}
      />
    </Box>
  );
}