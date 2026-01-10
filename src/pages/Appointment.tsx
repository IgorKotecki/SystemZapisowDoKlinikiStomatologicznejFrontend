import { Box, Button, Checkbox, CircularProgress, FormControl, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Paper, Select, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import type { Service } from "../Interfaces/Service";
import type { Doctor } from "../Interfaces/Doctor";
import type { TimeBlock } from "../Interfaces/TimeBlock";
import { TextField, Grid } from "@mui/material";
import post from "../api/post";
import get from "../api/get";
import { showAlert } from "../utils/GlobalAlert";

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
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [search, setSearch] = useState<string>("");
    const [loadingServices, setLoadingServices] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!servicesIds || servicesIds.length === 0 || !doctorId || !timeBlockId || !date) {
            showAlert({ type: 'error', message: t("userMakeAppointment.errorFields") });
            return false;
        }

        if (!formData.firstName || formData.firstName.trim() === "") {
            showAlert({ type: 'error', message: t("appointment.errorFirstName") });
            return false;
        }
        if (!formData.lastName || formData.lastName.trim() === "") {
            showAlert({ type: 'error', message: t("appointment.errorLastName") });
            return false;
        }
        if (!formData.email || formData.email.trim() === "") {
            showAlert({ type: 'error', message: t("appointment.errorEmail") });
            return false;
        }
        if (!formData.phone || formData.phone.trim() === "") {
            showAlert({ type: 'error', message: t("appointment.errorPhone") });
            return false;
        }

        if (formData.email.indexOf("@") === -1) {
            showAlert({ type: 'error', message: t("appointment.errorEmail") });
            return false;
        }

        if (formData.phone.match(/[^0-9+\-()\s]/)) {
            showAlert({ type: 'error', message: t("appointment.errorPhone") });
            return false;
        }

        return true;
    }


    useEffect(() => {

        const lang = i18n.language || "pl";

        const fetchServices = async () => {
            setLoadingServices(true);
            try {
                const response = await get.getUserServices(lang);
                console.log("Usługi:", response);
                setServices(response);
            } catch (err) {
                console.error("Błąd pobierania usług:", err);
                setServices([]);
            } finally {
                setLoadingServices(false);
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

        try {

            if (!validate()) {
                return;
            }

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

            showAlert({
                type: 'success',
                message: t("userMakeAppointment.successAlert"),
            });

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
            let errorCode = err.response?.data?.title ??
                err.response?.data?.Title ?? // PascalCase
                "GENERIC_ERROR";
            showAlert({
                type: 'error',
                message: t(errorCode),
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredRows = useMemo(
        () =>
            services.filter((service) =>
                service.name.toLowerCase().includes(search.toLowerCase())
            ),
        [search, services]
    );

    const toggleSelect = (id: number) => {
        setServicesIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
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
                            <Box sx={{ padding: 1 }}>
                                <TextField
                                    label={t("userMakeAppointment.search")}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "40vh", backgroundColor: colors.white, borderRadius: 1 }}>
                                {loadingServices ? (
                                    <CircularProgress />
                                ) : (
                                    <List dense sx={{ borderRadius: 1 }}>
                                        {filteredRows.map((row) => {
                                            const isSelected = servicesIds.includes(row.id);
                                            return (
                                                <ListItem key={row.id} divider disablePadding
                                                    sx={{ cursor: "pointer", borderRadius: 1 }}
                                                    alignItems="center">
                                                    <ListItemIcon sx={{ minWidth: 40, alignItems: "center", justifyContent: "center", paddingLeft: 2, borderRadius: 1 }}>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={isSelected}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            onChange={() => toggleSelect(row.id)}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={row.name}
                                                        secondary={row.description}
                                                        onClick={() => toggleSelect(row.id)}
                                                        sx={{ margin: 1 }}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                )}
                            </Box>
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
