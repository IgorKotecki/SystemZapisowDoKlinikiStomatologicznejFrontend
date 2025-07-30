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

export default function Team() {
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
                    textAlign: 'center'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: { xs: '70vh', md: '85vh' },
                        backgroundColor: 'rgba(0, 49, 65, 0.8)',
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}
                >
                    {/* Information displayed at about "Team" */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                        <Typography variant="h3" gutterBottom>
                            {t('teamPage.boldInformation')}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {t('teamPage.normalInformation')}
                        </Typography>

                    </Box>

                    {/* Buttons for information */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 1,
                        }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                backgroundColor: colors.color3,
                                '&:hover': { backgroundColor: colors.color4 },
                                textTransform: 'none',
                                px: 2
                            }}
                            onClick={() => navigate('/appointment')}
                        >
                            {t('book')}
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                backgroundColor: colors.color3,
                                '&:hover': { backgroundColor: colors.color4 },
                                textTransform: 'none',
                                px: 2
                            }}
                            onClick={() => navigate('/appointment')}
                        >
                            {t('phoneNumber')}
                        </Button>
                    </Box>

                </Box>
            </Box>

            <Box>

            </Box>

            <Box sx={{ py: 8, px: { xs: 2, md: 10 }, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    {t('home.ourServices') || 'ajdnkjansdjknajksnjdkansdjknas'}
                </Typography>
                <Grid container spacing={20} justifyContent="center">
                    {[1, 2, 3, 4].map((_, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="350"
                                    image={`/images/doctors/${i + 1}.png`}
                                    alt={`Service ${i + 1}`}
                                    loading="lazy"
                                    sx={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        borderTopLeftRadius: 12,
                                        borderTopRightRadius: 12,
                                        filter: 'brightness(1)', 
                                        transition: 'transform 0.3s ease, filter 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            filter: 'brightness(1.05)',
                                        }
                                    }}
                                />

                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {t(`teamPage.doctor.${i+1}`)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t(`teamPage.doctorInfo.${i+1}`)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
