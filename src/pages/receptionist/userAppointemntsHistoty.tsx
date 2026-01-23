import { colors } from "../../utils/colors";
import UserNavigation from "../../components/userComponents/userNavigation";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import AppointmentsDataGrid from "../../components/AppointementDataGrid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";
import type { Appointment } from "../../Interfaces/Appointment";
import { showAlert } from "../../utils/GlobalAlert";
import get from "../../api/get";
import put from "../../api/put";
import type { User } from "../../Interfaces/User";
import { useLocation } from "react-router-dom";

export default function UserAppointmentsHistory() {
    const location = useLocation();
    const { userId } = location.state as { userId: number };
    const { t, i18n } = useTranslation();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCancelled, setShowCancelled] = useState(true);
    const [showCompleted, setShowCompleted] = useState(true);
    const [showPlanned, setShowPlanned] = useState(true);

    const fetchAppointments = async (showCancelled: boolean, showCompleted: boolean, showPlanned: boolean) => {
        try {
            setLoading(true);
            const lang = i18n.language || "pl";
            const response = await get.getUserAppointments(lang, showCancelled, showCompleted, showPlanned, userId);
            setAppointments(response);
            if (response.length === 0) {
                showAlert({ type: "info", message: t("userAppointmentsHistory.noHistory") });
            }
        } catch (err) {
            showAlert({ type: "error", message: t("userAppointments.fetchError") });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(showCancelled, showCompleted, showPlanned);
    }, [i18n.language]);

    const handleCancelAppointment = async (appointment: Appointment) => {
        try {
            await put.cancellation({
                appointmentGuid: appointment.appointmentGroupId,
                reason: "",
            });
            showAlert({ type: "success", message: t("userAppointments.cancelSuccess") });
            await fetchAppointments(showCancelled, showCompleted, showPlanned);
        } catch (err: any) {
            let error = err.response?.data?.title ??
                err.response?.data?.Title ?? // PascalCase
                "GENERIC_ERROR";
            showAlert({ type: "error", message: t(error) });
        }
    };
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
                minHeight: "100vh",
                backgroundColor: colors.color1,
            }}
        >
            <UserNavigation />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    px: { xs: 2, md: 8 },
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: colors.white,
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 1500 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
                        {t("userAppointmentsHistory.title")}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            {t("userAppointmentsHistory.pageInfo")}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showCancelled}
                                        onChange={async (e) => {
                                            const newValue = e.target.checked;
                                            setShowCancelled(newValue);
                                            await fetchAppointments(newValue, showCompleted, showPlanned);
                                        }}
                                    />
                                }
                                label={t("receptionistCalendar.showCancelled")}
                                sx={{ color: colors.white }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showCompleted}
                                        onChange={async (e) => {
                                            const newValue = e.target.checked;
                                            setShowCompleted(newValue);
                                            await fetchAppointments(showCancelled, newValue, showPlanned);
                                        }}
                                    />
                                }
                                label={t("receptionistCalendar.showCompleted")}
                                sx={{ color: colors.white }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showPlanned}
                                        onChange={async (e) => {
                                            const newValue = e.target.checked;
                                            setShowPlanned(newValue);
                                            await fetchAppointments(showCancelled, showCompleted, newValue);
                                        }}
                                    />
                                }
                                label={t("receptionistCalendar.showPlanned")}
                                sx={{ color: colors.white }}
                            />
                        </Box>
                    </Box>

                    <AppointmentsDataGrid
                        appointments={appointments}
                        loading={loading}
                        onCancelAppointment={handleCancelAppointment}
                    />
                </Box>
            </Box>
        </Box>
    );
}