import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LogIn() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [language, setLanguage] = useState(i18n.language || 'pl');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (e: any) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const colors = {
    color1: '#003141',
    color3: '#007987',
    color4: '#00b2b9',
    white: '#ffffff'
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: colors.color1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 3, boxShadow: 5 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: colors.color1 }}>
            {t('login.title')}
          </Typography>

          <TextField
            label={t('login.email')}
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
          />

          <TextField
            label={t('login.password')}
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: colors.color3,
              '&:hover': { backgroundColor: colors.color4 },
              textTransform: 'none'
            }}
          >
            {t('login.signIn')}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              {t('login.noAccount')}{' '}
              <Link href="/Register" underline="hover" sx={{ color: colors.color3 }}>
                {t('login.register')}
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
