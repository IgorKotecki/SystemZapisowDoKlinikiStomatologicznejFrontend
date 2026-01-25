import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import type { IDoctorAppointment } from "../../Interfaces/IDoctorAppointment";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { Status } from "../../Interfaces/Status";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import ToothStatusComponent from "../../components/ToothStatusComponent";
import type { ToothData } from "../../Interfaces/ToothData"
import TeethModel from "../../components/TeethModel";
import LoadingScreen from "../../components/Loading";
import AppointemtInfoRenderer from "../../components/AppointmentInfoRenderer";
import { Grid } from "@mui/material";
import AddInfoRenderer from "../../components/AddInfoRenderer";
import type { AddInfo } from "../../Interfaces/AddInfo";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import put from "../../api/put";
import get from "../../api/get";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import { showAlert } from "../../utils/GlobalAlert";
import type { Appointment } from "../../Interfaces/Appointment";
import post from "../../api/post";

export default function DoctorAppointmentsConsole() {
    const location = useLocation();
    const state = location.state as { appointment: IDoctorAppointment } | null;
    const [statusesByCategories, setStatusesByCategories] = useState<Map<string, Status[]>>()
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const { t } = useTranslation();
    const [teeth, setTeeth] = useState<ToothData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);
    const [addInfo, setAddInfo] = useState<AddInfo[]>([]);
    const [checked, setChecked] = useState<AddInfo[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [note, setNote] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [historyAppointments, setHistoryAppointments] = useState<Appointment[]>([]);
    const [completing, setCompleting] = useState(false);
    const [creatingModel, setCreatingModel] = useState(false);

    const onStatusChange = (status: Status) => {
        console.log("Selected status:", status);
        if (selectedTooth) {
            setTeeth((prevTeeth) =>
                prevTeeth.map((tooth) =>
                    tooth.toothNumber === selectedTooth.toothNumber
                        ? { ...tooth, status }
                        : tooth
                )
            );
        }
        console.log(teeth);

        setSelectedStatus(null);
        setSelectedTooth(null);
    };

    const goBack = () => {
        window.history.back();
    }

    const fetchHistoryAppointments = async () => {
        if (!state) return;
        console.log(state.appointment.patientId);
        try {
            const lang = i18n.language || "pl";
            const response = await get.getUserAppointments(lang, false, true, false, state?.appointment.patientId);
            setHistoryAppointments(response as Appointment[]);
        } catch (err) {
            console.error("Failed to fetch history appointments");
        }
    };
    const fetchStatusesAsync = async (lang: string) => {
        try {
            const response = await get.getToothStatuses(lang);
            const map = new Map<string, Status[]>();
            for (const key in response) {
                map.set(key, response[key]);
            }
            setStatusesByCategories(map);
        } catch (err) {
            console.error("Failed to fetch statuses");
        }
    };
    const fetchTeethData = async (lang: string) => {
        try {
            if (!state) return;
            const response = await get.getTeethModel(state.appointment.patientId, lang)
            setTeeth(response);
        } catch (error) {
            console.error("Błąd pobierania danych o zębach:", error);
        }
    };

    const fetchAddInfoData = async (lang: string) => {
        try {
            const response = await get.getAdditionalInformation(lang);
            setAddInfo(response);
        } catch (error) {
            console.error("Błąd pobierania danych o dodatkowych informacjach:", error);
        }
    };

    useEffect(() => {
        const lang = i18n.language || "pl";
        fetchTeethData(lang);
        fetchStatusesAsync(lang);
        fetchAddInfoData(lang);
        setChecked(state?.appointment.additionalInformation || []);
        setLoading(false);
    }, [t]);

    const saveChanges = async () => {
        try {
            setSaving(true);
            const payload = {
                userId: state?.appointment.patientId,
                teeth: teeth.map(tooth => ({
                    toothNumber: tooth.toothNumber,
                    statusId: tooth.status ? tooth.status.statusId : null,
                })),
                appointmentGuid: state?.appointment.id,
            };
            await put.updateTeethModel(payload);

            const appointmentPayload = {
                Id: state?.appointment.id,
                AddInformationIds: checked.map(info => info.id),
            };

            console.log(appointmentPayload);

            await put.updateAditianalInformationToAppointment(appointmentPayload);
            console.log("Dodatkowe informacje zapisane:");

            showAlert({ type: 'success', message: t('doctorAppointmentConsole.saveSuccess') });
        } catch (err: any) {
            console.error(err);
            let errorCode = err.response?.data?.title ??
                err.response?.data?.Title ??
                "GENERIC_ERROR";
            showAlert({
                type: 'error',
                message: t(errorCode),
            });
        } finally {
            setSaving(false);
        }
    };

    const completeAppointmentModal = () => {
        setConfirmOpen(true);
    }

    const completeAppointment = async () => {
        setCompleting(true);
        await saveChanges();
        try {
            if (!state) return;
            const payload = {
                appointmentGroupId: state.appointment.id,
                notes: note,
            };
            await put.completeAppointment(payload);
            showAlert({ type: 'success', message: t('doctorAppointmentConsole.completeSuccess') });
            setConfirmOpen(false);
            setNote("");
            goBack();
        } catch (err: any) {
            console.error(err);
            let errorCode = err.response?.data?.title ??
                err.response?.data?.Title ??
                "GENERIC_ERROR";
            showAlert({
                type: 'error',
                message: t(errorCode),
            });
        } finally {
            setCompleting(false);
        }
    };

    const createTeethModel = async () => {
        setCreatingModel(true);
        try {
            if (!state) return;
            const payload = {
                userId: state.appointment.patientId,
            };
            await post.createTeethModel(payload);
            fetchTeethData(i18n.language || "pl");
        } catch (error) {
            showAlert({ type: 'error', message: t('doctorAppointmentConsole.createModelError') });
            console.error("Błąd tworzenia modelu zębów:", error);
        } finally {
            setTimeout(() => {
                setCreatingModel(false);
            }, 3000); 
        }
    }

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (!state) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <Box sx={
            {
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                minHeight: "100vh",
                backgroundColor: colors.color1
            }
        }>
            <UserNavigation />
            <Grid container
                sx={{
                    padding: 4,
                    alignContent: 'flex-start'
                }}
                rowSpacing={2}
                columnSpacing={2}
            >
                <Grid size={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                            <IconButton onClick={goBack} color="inherit">
                                <CloseIcon sx={{ color: colors.color5, height: 40, width: 40 }} />
                            </IconButton>
                            <Typography variant="h4" sx={{ color: colors.color5 }}>
                                {t("doctorAppointmentConsole.title")}
                            </Typography>
                        </Box>
                        <Box sx={{ justifyContent: "center", gap: 1, display: "flex" }}>
                            <Button onClick={async () => {
                                await fetchHistoryAppointments();
                                setOpenDrawer(true)
                            }
                            }
                                variant="outlined"
                                sx={{ color: colors.color5, borderColor: colors.color5, textTransform: 'none', ":hover": { borderColor: colors.color4 } }}>
                                {t("doctorAppointmentConsole.showHistory")}
                            </Button>
                            <Button onClick={saveChanges} disabled={saving} variant="contained" sx={{ backgroundColor: colors.color3, color: colors.white, textTransform: 'none', ":hover": { backgroundColor: colors.color4 } }}>
                                {saving ? <CircularProgress size={24} color="inherit" /> : t("doctorAppointmentConsole.saveChanges")}
                            </Button>
                            <Button onClick={completeAppointmentModal} variant="contained" sx={{ backgroundColor: colors.color3, color: colors.white, textTransform: 'none', ":hover": { backgroundColor: colors.color4 } }}>
                                {t("doctorAppointmentConsole.completeAppointment")}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={12}>
                    <TeethModel teeth={teeth} selectedTooth={selectedTooth} setSelectedTooth={setSelectedTooth} creatingModel={creatingModel} createModel={createTeethModel} />
                </Grid>
                <Grid size={4}>
                    <AppointemtInfoRenderer appointment={state.appointment} />
                </Grid>
                <Grid size={4}>
                    <AddInfoRenderer addInfo={addInfo} checked={checked} setChecked={setChecked} setAddInfo={setAddInfo} />
                </Grid>
                <Grid size={4}>
                    <ToothStatusComponent statusesByCategories={statusesByCategories} selectedStatus={selectedStatus} onStatusChange={onStatusChange} />
                </Grid>
            </Grid>
            <Dialog
                open={confirmOpen}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.color2,
                        color: colors.white,
                        borderRadius: 3,
                        p: 2,
                        minWidth: { xs: "90%", sm: 400 }
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h5" sx={{ color: colors.white, fontWeight: "bold" }}>
                        {t("doctorAppointmentConsole.completeTitle")}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2, opacity: 0.8 }}>
                        {t("doctorAppointmentConsole.completeSubtitle")}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder={t("doctorAppointmentConsole.notePlaceholder")}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        sx={{
                            backgroundColor: colors.white,
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: colors.color3 },
                                "&:hover fieldset": { borderColor: colors.color4 },
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => {
                            setConfirmOpen(false);
                            setNote("");
                        }}
                        sx={{ color: colors.white, textTransform: "none" }}
                    >
                        {t("global.cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={completeAppointment}
                        disabled={completing}
                        sx={{
                            backgroundColor: colors.color3,
                            color: colors.white,
                            textTransform: "none",
                            px: 4,
                            "&:hover": { backgroundColor: colors.color4 }
                        }}
                    >
                        {completing ? <CircularProgress size={24} color="inherit" /> : t("global.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                anchor="right"
            >
                <Box sx={{ width: { xs: 300, sm: 400 }, p: 3, backgroundColor: colors.color2, height: '100%' }}>
                    <Typography variant="h5" sx={{ color: colors.color5, mb: 2 }}>
                        {t("doctorAppointmentConsole.historyTitle")}
                    </Typography>
                    {historyAppointments.length === 0 ? (
                        <Typography sx={{ color: colors.color5 }}>
                            {t("doctorAppointmentConsole.noHistory")}
                        </Typography>
                    ) : (
                        historyAppointments.map((appointment) => (
                            <Box
                                key={appointment.appointmentGroupId}
                                sx={{
                                    mb: 2,
                                    p: 2.5,
                                    border: `2px solid ${colors.color4}`,
                                    borderRadius: 3,
                                    backgroundColor: colors.white,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: colors.color3
                                        }}
                                    />
                                    <Typography sx={{ color: colors.black, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {new Date(appointment.startTime).toLocaleDateString(`${i18n.language}`, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, ml: 2 }}>
                                    <Typography sx={{ color: colors.color3, fontWeight: '600' }}>
                                        🕐 {appointment.startTime.slice(11, 16)} - {appointment.endTime.slice(11, 16)}
                                    </Typography>
                                </Box>

                                <Box sx={{ ml: 2, mb: appointment.notes ? 1.5 : 0 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: colors.color3,
                                            textTransform: 'uppercase',
                                            fontWeight: '600',
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        {t("userAppointments.services")}:
                                    </Typography>
                                    <Typography sx={{ color: colors.black, mt: 0.5 }}>
                                        {appointment.services.map(service => service.name).join(" • ")}
                                    </Typography>
                                </Box>

                                {appointment.notes && (
                                    <Box
                                        sx={{
                                            mt: 1.5,
                                            pt: 1.5,
                                            borderTop: `1px dashed ${colors.color4}40`,
                                            ml: 2
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: colors.color3,
                                                textTransform: 'uppercase',
                                                fontWeight: '600',
                                                letterSpacing: 0.5
                                            }}
                                        >
                                            📝 {t("userAppointments.note")}:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: colors.black,
                                                mt: 0.5,
                                                fontStyle: 'italic',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            {appointment.notes}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ))
                    )}
                </Box>
            </Drawer>

        </Box>
    );
}