import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from '../utils/colors';

export const RegisterGratulation: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                backgroundColor: colors.color1,
                display: 'flex',
                justifyContent: 'center',
                p: 2,
            }}>
            <Box sx={{ textAlign: 'center', color: colors.white, backgroundColor: colors.white, p: 4, borderRadius: 2, boxShadow: 3, height: 'fit-content' }}>
                <Typography variant="h4" gutterBottom sx={{ color: colors.black, mb: 2 }}>
                    {t('registration.gratulationTitle')}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: colors.black, mb: 4 }}>
                    {t('registration.gratulationMessage')}
                </Typography>
                <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{
                        mt: 3,
                        backgroundColor: colors.color3,
                        '&:hover': { backgroundColor: colors.color4 },
                        textTransform: 'none'
                    }}
                >
                    {t('registration.goToLogin')}
                </Button>

            </Box>
        </Box>
    );
};
export default RegisterGratulation;