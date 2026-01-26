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
import { useEffect, useState } from 'react';
import { colors } from '../utils/colors';
import type { TeamMembers } from '../Interfaces/TeamMembers';
import get from '../api/get';

export default function Team() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [team, setTeam] = useState<TeamMembers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const featchTeam = async () => {
            setLoading(true);
            try {
                const data: TeamMembers[] = await get.getTeamMembers();
                setTeam(data)
            } catch (error) {
                console.error('Error feating team ', error)
            } finally {
                setLoading(false);
            }
        }
        featchTeam();
    }, []);

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: colors.white, overflowX: 'hidden' }}>
            <Box
                sx={{
                    width: '100%',
                    height: { xs: '70vh', md: '85vh' },
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 49, 65, 0.75)',
                        p: { xs: 3, md: 8 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Box sx={{ maxWidth: '800px' }}>
                        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2, color: colors.color5 }}>
                            {t('teamPage.boldInformation')}
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                            {t('teamPage.normalInformation')}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: colors.color3,
                                    "&:hover": { backgroundColor: colors.color4 },
                                    textTransform: "none",
                                    px: 4, py: 1.5, fontSize: "1.1rem", fontWeight: "bold"
                                }}
                                onClick={() => navigate('/appointment')}
                            >
                                {t('book')}
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: colors.white,
                                    color: colors.white,
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)", borderColor: colors.color5 },
                                    textTransform: "none",
                                    px: 4, py: 1.5, fontSize: "1.1rem"
                                }}
                                onClick={() => window.location.href = `tel:${t('phoneNumberValue')}`}
                            >
                                {t('phoneNumber')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ py: 12, px: { xs: 3, md: 10 }, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h3" textAlign="center" sx={{ mb: 2, fontWeight: 'bold', color: colors.color1 }}>
                    {t('home.ourServices')}
                </Typography>
                <Box sx={{ width: '80px', height: '4px', backgroundColor: colors.color4, mx: 'auto', mb: 8 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: colors.color3 }} />
                    </Box>
                ) : (
                    <Grid container spacing={6} justifyContent="center">
                        {team.map((member) => (
                            <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }} component="div" sx={{ display: 'flex' }}>
                                <Card
                                    sx={{
                                        borderRadius: 4,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'translateY(-10px)' }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={member.photoURL}
                                        alt={member.name}
                                        sx={{
                                            height: 700,
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'top',
                                        }}
                                    />

                                    <CardContent sx={{ p: 4, flexGrow: 1, textAlign: 'center' }}>
                                        <Typography variant="overline" sx={{ color: colors.color3, fontWeight: 'bold', letterSpacing: 1.5 }}>
                                            {member.roleName}
                                        </Typography>

                                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, mb: 1, color: colors.color1 }}>
                                            {member.name} {member.surename}
                                        </Typography>

                                        {member.roleName === "Doctor" && (
                                            <Typography variant="body1" sx={{ color: colors.color2, fontWeight: 500 }}>
                                                {i18n.language === 'pl'
                                                    ? member.specializationPl
                                                    : member.specializationEn
                                                }
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}