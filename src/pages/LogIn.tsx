import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import post from '../api/post';

export default function LogIn() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [language, setLanguage] = useState(i18n.language || 'pl');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, userRole } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (e: any) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await post.loginUser(formData);
      const { accessToken, refreshToken } = response;

      login(accessToken, refreshToken);

      const decoded = jwtDecode(accessToken);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Registered_user") navigate('/user/profile');
      if (role === "Receptionist") navigate('/receptionist/profile');
      if (role === "Doctor") navigate('/doctor/profile');

    } catch (err: any) {
      if (err.response?.status === 401) {
        setError(t('error.userDataIncorrect'));
      } else {
        setError(t('error.errorOccurred'));
      }
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit}>
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
            <Link underline="hover"
              sx={{ color: colors.color3, cursor: 'pointer' }}
              onClick={() => navigate('/resetpassword')}>
              {t('login.forgotPassword')}
            </Link>

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                backgroundColor: colors.color3,
                '&:hover': { backgroundColor: colors.color4 },
                textTransform: 'none'
              }}
            >
              {loading ? t('login.loading') : t('login.signIn')}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                {t('login.noAccount')}{' '}
                <Link
                  underline="hover"
                  sx={{ color: colors.color3, cursor: 'pointer' }}
                  onClick={() => navigate('/register')}
                >
                  {t('login.register')}
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
