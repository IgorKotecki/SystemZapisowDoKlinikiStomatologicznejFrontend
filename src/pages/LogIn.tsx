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
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

import post from '../api/post';
import { showAlert } from '../utils/GlobalAlert';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '../utils/colors';

export default function LogIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!formData.email || !formData.password) {
      showAlert({ type: "error", message: t('fillAllFields') });
      setLoading(false);
      return;
    }
    try {
      const response = await post.loginUser(formData);
      const { accessToken, refreshToken, photoURL } = response;

      login(accessToken, refreshToken, photoURL);

      const decoded = jwtDecode(accessToken);
      // @ts-ignore
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Registered_user") navigate('/user/profile');
      if (role === "Receptionist") navigate('/receptionist/profile');
      if (role === "Doctor") navigate('/doctor/profile');

    } catch (err: any) {
      if (err.response?.status === 401) {
        showAlert({ type: "error", message: t('invalidCredentials') });
      } else {
        showAlert({ type: "error", message: t('errorOccurred') });
      }
    } finally { 
      setLoading(false);
      setFormData({ ...formData, password: '' });
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: colors.color1,
        display: 'flex',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 3, boxShadow: 5, height: 'fit-content' }}>
        <CardContent sx={{ p: 4 }}>

          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: colors.black }}>
            {t('login.title')}
          </Typography>

          <TextField
            label={t('login.email')}
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
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
            required
            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
          />
          <Link
            component={RouterLink}
            to="/resetpassword"
            underline="hover"
            sx={{ color: colors.color3 }}
          >
            {t('login.forgotPassword')}
          </Link>



          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={handleSubmit}
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
                component={RouterLink}
                to="/register"
                underline="hover"
                sx={{ color: colors.color3 }}
              >
                {t('login.register')}
              </Link>

            </Typography>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
