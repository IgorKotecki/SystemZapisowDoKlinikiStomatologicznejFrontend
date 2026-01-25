import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors } from '../utils/colors';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function ResetSuccess() {
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 420,
                    width: '100%',
                    padding: 4,
                    borderRadius: 3,
                    textAlign: 'center',
                    backgroundColor: colors.pureWhite,
                    height: 'fit-content',
                }}
            >
                <CheckCircleOutlineIcon
                    sx={{
                        fontSize: 80,
                        color: 'green',
                        mb: 2,
                    }}
                />

                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: colors.color1,
                        fontWeight: 600,
                    }}
                >
                    {t('resetSuccess.title')}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        color: colors.color1,
                        opacity: 0.8,
                    }}
                >
                    {t('resetSuccess.message')}
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{
                        backgroundColor: colors.color3,
                        '&:hover': { backgroundColor: colors.color4 },
                        textTransform: 'none',
                        padding: '12px',
                        fontSize: '16px',
                    }}
                >
                    {t('resetSuccess.goToLogin')}
                </Button>
            </Paper>
        </Box>
    );
}