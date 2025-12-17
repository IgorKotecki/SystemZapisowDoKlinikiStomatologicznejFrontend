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
                console.log("wysłane")
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

            <Box sx={{ py: 8, px: { xs: 2, md: 10 }, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    {t('home.ourServices')}
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress color="inherit" />
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {team.map((member, i) => (
                            // <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <Grid key={member.id} size={{ xs: 12, md: 4, sm: 4 }} component="div">
                                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                    
                                    <CardMedia
                                        component="img"
                                        height="350"
                                        image={`/images/doctors/${i + 1}.png`}
                                        alt={member.name}
                                        sx={{
                                            objectFit: 'cover',
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12
                                        }}
                                    />

                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {member.roleName}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {member.name} {member.surename}
                                        </Typography>

                                        {member.roleName === "Doctor" && (
                                            <Typography variant="body2" color="text.secondary">
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