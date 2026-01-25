import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import post from '../api/post';
import { colors } from '../utils/colors';

export default function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'słabe' | 'średnie' | 'mocne' | ''>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            setPasswordStrength(evaluatePasswordStrength(value));
        }
    };

    const validate = () => {
        if (!formData.email.includes('@')) return t('error.invalidEmail');
        if (formData.password.length < 6) return t('error.shortPassword');
        if (formData.password !== formData.confirmPassword) return t('error.passwordsDontMatch');
        return null;
    };

    const evaluatePasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 6) score++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[\W_]/.test(password)) score++;
        if (password.length >= 10) score++;

        if (score <= 2) return 'słabe';
        if (score === 3 || score === 4) return 'średnie';
        return 'mocne';
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.firstName,
                surname: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password
            }
            await post.registerUser(payload);

            navigate('/register/gratulation');
        } catch (err: any) {
            setError(t('error.errorOccurred'));
        } finally {
            setLoading(false);
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
            <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3, boxShadow: 5, height: 'fit-content' }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: colors.black }}>
                            {t('register.title') || 'Rejestracja'}
                        </Typography>

                        <TextField
                            label={t('register.firstName') || 'Imię'}
                            name="firstName"
                            fullWidth
                            margin="normal"
                            value={formData.firstName}
                            onChange={handleChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        />

                        <TextField
                            label={t('register.lastName') || 'Nazwisko'}
                            name="lastName"
                            fullWidth
                            margin="normal"
                            value={formData.lastName}
                            onChange={handleChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        />

                        <TextField
                            label={t('register.email') || 'Email'}
                            name="email"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        />

                        <TextField
                            label={t('register.password') || 'Hasło'}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {formData.password && (
                            <Box sx={{ mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        passwordStrength === 'słabe'
                                            ? 33
                                            : passwordStrength === 'średnie'
                                                ? 66
                                                : 100
                                    }
                                    sx={{
                                        height: 8,
                                        borderRadius: 5,
                                        backgroundColor: '#eee',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor:
                                                passwordStrength === 'słabe'
                                                    ? 'red'
                                                    : passwordStrength === 'średnie'
                                                        ? 'orange'
                                                        : 'green'
                                        }
                                    }}
                                />
                                <Typography variant="body2" sx={{ mt: 0.5, color: '#555' }}>
                                    Siła hasła: {passwordStrength}
                                </Typography>
                            </Box>
                        )}


                        <TextField
                            label={t('register.confirmPassword') || 'Potwierdź hasło'}
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(prev => !prev)} edge="end">
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label={t('register.phone') || 'Numer telefonu'}
                            name="phoneNumber"
                            fullWidth
                            margin="normal"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        />

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
                            {loading ? t('register.loading') || 'Rejestracja...' : t('register.signUp') || 'Zarejestruj się'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                {t('register.haveAccount') || 'Masz już konto?'}{' '}
                                <Link href="/login" underline="hover" sx={{ color: colors.color3 }}>
                                    {t('register.login') || 'Zaloguj się'}
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
