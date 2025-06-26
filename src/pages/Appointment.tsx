import { Box, Typography, TextField, MenuItem, Button, Grid, Select, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Appointment() {
    const { t } = useTranslation();

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const colors = {
        color1: '#003141',
        color2: '#004f5f',
        color3: '#007987',
        color4: '#00b2b9',
        color5: '#00faf1',
        white: '#ffffff',
        black: '#000000'
    };

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
                    <InputLabel sx={{ color: colors.white }}>{t('appointment.service')}</InputLabel>
                    <Select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        label={t('appointment.service')}
                        sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                    >
                        <MenuItem value="cleaning">{t('appointment.cleaning')}</MenuItem>
                        <MenuItem value="filling">{t('appointment.filling')}</MenuItem>
                        <MenuItem value="whitening">{t('appointment.whitening')}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: colors.white }}>{t('appointment.hour')}</InputLabel>
                    <Select
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        label={t('appointment.hour')}
                        sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                    >
                        <MenuItem value="09:00">09:00</MenuItem>
                        <MenuItem value="10:00">10:00</MenuItem>
                        <MenuItem value="11:30">11:30</MenuItem>
                        <MenuItem value="14:00">14:00</MenuItem>
                        <MenuItem value="16:00">16:00</MenuItem>
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
                        <MenuItem value="kowalski">{t('appointment.drKowalski')}</MenuItem>
                        <MenuItem value="nowak">{t('appointment.drNowak')}</MenuItem>
                        <MenuItem value="szeliga">{t('appointment.drSzeliga')}</MenuItem>
                    </Select>
                </FormControl>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="firstName"
                            label={t('appointment.firstName')}
                            fullWidth
                            value={formData.firstName}
                            onChange={handleInputChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="lastName"
                            label={t('appointment.lastName')}
                            fullWidth
                            value={formData.lastName}
                            onChange={handleInputChange}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
            </Box>
        </Box>
    );
}
