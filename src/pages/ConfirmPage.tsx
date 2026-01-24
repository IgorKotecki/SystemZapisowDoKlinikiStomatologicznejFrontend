import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, Divider, Container, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import get from "../api/get";

interface ServiceTranslation {
    id: number;
    namePL: string;
    nameEN: string;
}

const AppointmentSummary: React.FC = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [fetchedServices, setFetchedServices] = useState<ServiceTranslation[]>([]);
    const [loading, setLoading] = useState(true);

    const { appointmentData, doctorName, doctorSurename } = location.state || {};

    useEffect(() => {
        const fetchAllServices = async () => {
            if (!appointmentData?.servicesIds || appointmentData.servicesIds.length === 0) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const servicePromises = appointmentData.servicesIds.map((id: number) =>
                    get.getServiceNameTrans(id)
                );
                
                const results = await Promise.all(servicePromises);
                setFetchedServices(results);
            } catch (err) {
                console.error("Błąd pobierania nazw usług:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllServices();
    }, [appointmentData?.servicesIds]);

    if (!appointmentData) {
        return (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
                <Typography>{t("summary.noData")}</Typography>
                <Button onClick={() => navigate("/")} sx={{ mt: 2 }} variant="contained">
                    {t("summary.backHome")}
                </Button>
            </Container>
        );
    }

    const getServiceName = (service: ServiceTranslation) => {
        const lang = i18n.language.split('-')[0].toLowerCase(); 
        return lang === "en" ? service.nameEN : service.namePL;
    };

    return (
        <Box sx={{ backgroundColor: colors.color1, minHeight: '100vh', py: 8 }}>
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />

                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: colors.color1 }}>
                        {t("summary.title")}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {t("summary.subtitle")} <br />
                        <strong>{appointmentData.email}</strong>
                    </Typography>

                    <Box sx={{ textAlign: 'left', backgroundColor: '#f9f9f9', p: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                            {t("summary.details")}
                        </Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
                            <CalendarTodayIcon sx={{ mr: 2, color: colors.color2 }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">{t("summary.date")}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {new Date(appointmentData.startTime).toLocaleString(i18n.language, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary">{t("summary.doctor")}</Typography>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            {(doctorName + " " + doctorSurename)}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">{t("summary.services")}</Typography>
                        <Box sx={{ mb: 2 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="caption">{t("common.loading", "Ładowanie...")}</Typography>
                                </Box>
                            ) : fetchedServices.length > 0 ? (
                                fetchedServices.map((service) => (
                                    <Typography key={service.id} variant="body1" sx={{ fontWeight: 'medium' }}>
                                        • {getServiceName(service)}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body1" color="error">{t("summary.errorServices")}</Typography>
                            )}
                        </Box>

                        <Typography variant="body2" color="text.secondary">{t("summary.duration")}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {appointmentData.duration * 30} min
                        </Typography>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/")}
                        sx={{ 
                            mt: 4, 
                            backgroundColor: colors.color2, 
                            py: 1.5, 
                            borderRadius: 2, 
                            '&:hover': { backgroundColor: colors.color3 } 
                        }}
                    >
                        {t("summary.backHome")}
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default AppointmentSummary;