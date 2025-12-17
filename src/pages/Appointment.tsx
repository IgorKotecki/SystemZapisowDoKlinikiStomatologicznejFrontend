import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import type { Service } from "../Interfaces/Service";
import type { Doctor } from "../Interfaces/Doctor";
import type { TimeBlock } from "../Interfaces/TimeBlock";
import { TextField, Grid } from "@mui/material";
import post from "../api/post";
import get from "../api/get";
import { Alert } from "@mui/material";

export default function Appointment() {
    const { t, i18n } = useTranslation();
    const [date, setDate] = useState<Date | null>(null);
    const [servicesIds, setServicesIds] = useState<number[]>([]);
    const [doctorId, setDoctorId] = useState<number | "">("");
    const [timeBlockId, setTimeBlockId] = useState<number | "">("");
    const [services, setServices] = useState<Service[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!servicesIds || !doctorId || !timeBlockId || !date) {
                setAlert({ type: 'error', message: t("userMakeAppointment.errorFields") });
                return;
            }

            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
                setAlert({ type: 'error', message: t("appointment.errorIncompleteForm") });
                return;
            }

            if (formData.email.indexOf("@") === -1) {
                setAlert({ type: 'error', message: t("appointment.errorInvalidEmail") });
                return;
            }

            if (formData.phone.match(/[^0-9+\-()\s]/)) {
                setAlert({ type: 'error', message: t("appointment.errorInvalidPhone") });
                return;
            }
    }


    useEffect(() => {

        const lang = i18n.language || "pl";

        const fetchServices = async () => {
            try {
                const response = await get.getUserServices(lang);
                console.log("Usługi:", response);
                setServices(response);
            } catch (err) {
                console.error("Błąd pobierania usług:", err);
                setServices([]);
            }
        };

        fetchServices();
    }, [i18n.language]);

    useEffect(() => {
        if (!servicesIds) {
            setDoctors([]);
            return;
        }

        const fetchDoctors = async () => {
            setLoadingDoctors(true);
            try {
                const response = await get.getDoctors();
                setDoctors(response);
            } catch (err) {
                console.error("Błąd pobierania lekarzy:", err);
                setDoctors([]);
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();
    }, [servicesIds]);

    useEffect(() => {
        if (!doctorId || !date) {
            setTimeBlocks([]);
            return;
        }

        const fetchTimeBlocks = async () => {
            setLoadingBlocks(true);
            try {
                const response = await get.getTimeBlocks(doctorId, date)

                setTimeBlocks(response);
            } catch (err) {
                console.error("Błąd pobierania bloków czasowych:", err);
                setTimeBlocks([]);
            } finally {
                setLoadingBlocks(false);
            }
        };

        fetchTimeBlocks();
    }, [doctorId, date]);

    const submitAppointment = async (e: React.FormEvent) => {
        e.preventDefault();

        var startTime = timeBlocks.find(t => t.doctorBlockId == timeBlockId)?.timeStart;

        var serv = services.filter(s => servicesIds.includes(s.id));

        var duration = 0;
        serv.forEach(s => duration += s.minTime);

        setAlert(null);
        try {

            validate();

            setLoading(true);

            const payload = {
                name: formData.firstName,
                surname: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                doctorId,
                startTime,
                duration,
                servicesIds,
            };

            await post.bookAppointmentGuest(payload)

            setAlert({ type: 'success', message: t("userMakeAppointment.success") });

            setServicesIds([]);
            setDoctorId("");
            setTimeBlockId("");
            setDate(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
            });
        } catch (err: any) {
            console.error(err);
            setAlert({ type: 'error', message: t("userMakeAppointment.errorOccurred") + err });
        } finally {
            setLoading(false);
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
                        {t("userMakeAppointment.title")}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 4 }}>
                        {t("userMakeAppointment.subtitle")}
                    </Typography>

                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: colors.color2,
                        }}
                    >
                        <form onSubmit={submitAppointment}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t("userMakeAppointment.date")}
                                    value={date}
                                    onChange={(newDate) => setDate(newDate)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: { backgroundColor: colors.white, borderRadius: 1, mt: 2, color: colors.black },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <InputLabel sx={{ color: colors.black }}>
                                    {t("userMakeAppointment.service")}
                                </InputLabel>
                                <Select
                                    multiple
                                    value={servicesIds}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setServicesIds(typeof value === 'string' ? value.split(',').map(Number) : value)
                                    }}
                                    sx={{ backgroundColor: colors.white }}
                                >
                                    {services.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={!servicesIds}
                            >
                                <InputLabel sx={{ color: colors.black }}>
                                    {t("userMakeAppointment.doctor")}
                                </InputLabel>
                                <Select
                                    value={doctorId}
                                    onChange={(e) => setDoctorId(Number(e.target.value))}
                                    sx={{ backgroundColor: colors.white }}
                                >
                                    {loadingDoctors ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} />
                                        </MenuItem>
                                    ) : (
                                        doctors.map((doc) => (
                                            <MenuItem key={doc.id} value={doc.id}>
                                                {doc.name} {doc.surname}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={!doctorId || !date}
                            >
                                <InputLabel sx={{ color: colors.black }}>
                                    {t("userMakeAppointment.hour")}
                                </InputLabel>

                                <Select
                                    value={timeBlockId}
                                    onChange={(e) => setTimeBlockId(Number(e.target.value))}
                                    sx={{ backgroundColor: colors.white }}
                                >
                                    {loadingBlocks ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} />
                                        </MenuItem>
                                    ) : (
                                        timeBlocks
                                            .filter((b) => b.isAvailable)
                                            .map((b) => {
                                                const time = new Date(b.timeStart).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                });

                                                return (
                                                    <MenuItem key={b.doctorBlockId} value={b.doctorBlockId}>
                                                        {time}
                                                    </MenuItem>
                                                );
                                            })
                                    )}
                                </Select>
                            </FormControl>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {/* <Grid item xs={12} sm={6}> */}
                                <Grid size={{ xs: 12, md: 6 }} component="div">
                                    <TextField
                                        name="firstName"
                                        label={t('appointment.firstName')}
                                        fullWidth
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={6}> */}
                                <Grid size={{ xs: 12, md: 6 }} component="div">
                                    <TextField
                                        name="lastName"
                                        label={t('appointment.lastName')}
                                        fullWidth
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={6}> */}
                                <Grid size={{ xs: 12, md: 6 }} component="div">
                                    <TextField
                                        name="email"
                                        label={t('appointment.email')}
                                        type="email"
                                        fullWidth
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={6}> */}
                                <Grid size={{ xs: 12, md: 6 }} component="div">
                                    <TextField
                                        name="phone"
                                        label={t('appointment.phone')}
                                        fullWidth
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                                    />
                                </Grid>
                            </Grid>

                            {alert && (
                                <Alert severity={alert.type} sx={{ mt: 2 }}>
                                    {alert.message}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 4,
                                    backgroundColor: colors.color3,
                                    color: colors.white,
                                    "&:hover": { backgroundColor: colors.color4 },
                                }}
                                disabled={loading}
                            >
                                {t("userMakeAppointment.submit")}
                            </Button>
                        </form>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
