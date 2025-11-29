import { Box, Typography, TextField, MenuItem, Button, Select, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import api from '../api/axios';
import { da } from 'date-fns/locale';
import Grid from '@mui/material/Grid';
import { colors } from '../utils/colors';

export default function Appointment() {
    const { t, i18n } = useTranslation();

    const [date, setDate] = useState<Date | null>(null);
    const [service, setService] = useState('');
    const [hour, setHour] = useState('');
    const [doctor, setDoctor] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [doctors, setDoctors] = useState<{ id: string, name: string }[]>([]);
    const [hours, setHours] = useState<string[]>([]);
    const [services, setServices] = useState<{ id: string, name: string }[]>([]);
    const [availableTimeBlocks, setAvailableTimeBlocks] = useState<any[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const validate = () => {
        if (!formData.firstName.trim()) return t('appointment.errorFirstName') || 'Podaj imię';
        if (!formData.lastName.trim()) return t('appointment.errorLastName') || 'Podaj nazwisko';
        if (!formData.email.includes('@')) return t('appointment.errorEmail') || 'Niepoprawny email';
        if (!formData.phone.trim()) return t('appointment.errorPhone') || 'Podaj numer telefonu';
        if (!service) return t('appointment.errorService') || 'Wybierz usługę';
        if (!doctor) return t('appointment.errorDoctor') || 'Wybierz lekarza';
        if (!hour) return t('appointment.errorHour') || 'Wybierz godzinę';
        return null;
    };

    // Funkcja wysyłająca dane:
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoadingServices(true);
        try {
            await api.post('/api/Appointment/guest', {
                name: formData.firstName,
                surname: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                doctorBlockId: [Number(hour)],
                service: { id: Number(service) }
            });

            alert(t('appointment.success') || 'Rezerwacja przyjęta');

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
            setService('');
            setDoctor('');
            setHour('');
            setDate(null);

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || (t('error.errorOccurred') || 'Wystąpił błąd'));
        } finally {
            setLoadingServices(false);
        }
    };


    //pobieranie nazw usług z back, uzaleznienie od wybranego jezyka w hederze
    useEffect(() => {
        const fetchServices = async () => {
            setLoadingServices(true);
            try {
                const response = await api.get(`/api/Service/UserServices`, {
                    params: { lang: i18n.language }
                });
                setServices(response.data);
            } catch (error) {
                console.error('Błąd przy pobieraniu usług:', error);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, [i18n.language]);

    //Pobieranie danych z back, uzaleznienie od wyboru daty z kalendarza
    useEffect(() => {
        if (!date) return;

        const fetchTimeBlocks = async () => {
            try {
                const response = await api.get('/api/TimeBlocks', {
                    params: {
                        Year: date.getFullYear(),
                        Month: date.getMonth() + 1,
                        Day: date.getDate()
                    }
                });

                const blocks = response.data;

                setAvailableTimeBlocks(blocks);

                const uniqueDoctors = Array.from(
                    new Map(
                        blocks
                            .filter(block => block.user && block.user.id != null)
                            .map(block => [String(block.user.id), {
                                id: String(block.user.id),
                                name: block.user.name,
                                surname: block.user.surname
                            }])
                    ).values()
                );

                setDoctors(uniqueDoctors);

            } catch (error) {
                console.error('Błąd przy pobieraniu bloków czasowych:', error);
            }
        };

        fetchTimeBlocks();
    }, [date]);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                flex: 1,
                px: { xs: 2, md: 8 },
                py: 6,
                backgroundColor: colors.color1,
                color: colors.white,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 900 }}>
                <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
                    {t('appointment.title')}
                </Typography>
                <form onSubmit={handleSubmit}>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label={t('appointment.date')}
                            value={date}
                            onChange={(newDate) => setDate(newDate)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: 'normal',
                                    sx: {
                                        backgroundColor: colors.white,
                                        borderRadius: 1
                                    }
                                }
                            }}
                        />
                    </LocalizationProvider>

                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{ color: colors.white }}>
                            {t('appointment.service')}
                        </InputLabel>
                        <Select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            label={t('appointment.service')}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        >
                            {services.map((s) => (
                                <MenuItem key={s.id} value={s.id}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{ color: colors.white }}>{t('appointment.doctor')}</InputLabel>
                        <Select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            label={t('appointment.doctor')}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        >
                            {doctors.map(doc => (
                                <MenuItem key={doc.id} value={doc.id}>
                                    {doc.name} {doc.surname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" disabled={!doctor}>
                        <InputLabel sx={{ color: colors.white }}>{t('appointment.hour')}</InputLabel>
                        <Select
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                            label={t('appointment.hour')}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        >
                            {availableTimeBlocks
                                .filter(block => block.isAvailable && String(block.user.id) === doctor)
                                .map(block => {
                                    const start = new Date(block.timeStart);
                                    const formattedTime = start.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });

                                    return (
                                        <MenuItem key={block.doctorBlockId} value={block.doctorBlockId}>
                                            {formattedTime}
                                        </MenuItem>
                                    );
                                })}
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

                    <TextField
                        name="message"
                        label={t('appointment.message')}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mt: 3, backgroundColor: colors.white, borderRadius: 1 }}
                        value={formData.message}
                        onChange={handleInputChange}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                            mt: 4,
                            backgroundColor: colors.color3,
                            color: colors.white,
                            '&:hover': {
                                backgroundColor: colors.color4
                            }
                        }}
                    >
                        {t('appointment.submit')}
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
