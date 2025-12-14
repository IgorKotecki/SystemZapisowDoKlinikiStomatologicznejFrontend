import { Paper } from "@mui/material";
import type { IDoctorAppointment } from "../Interfaces/IDoctorAppointment"
import { colors } from "../utils/colors";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

type AppointemtInfoRendererProps = {
    appointment: IDoctorAppointment;
}

export default function AppointemtInfoRenderer({ appointment }: AppointemtInfoRendererProps) {
    const {t} = useTranslation();

    return (
        <Box sx={{
            p: 4,
            pt: 1,
            borderRadius: 3,
            backgroundColor: colors.white,
            color: colors.black,
            display: "flex",
            flexDirection: "column",
            '& p': { m: 0.5 },
            height: 300,
        }}>

            <h2 style={{ color: colors.black }}>{t('appointmentInfo.title')}</h2>
            <p><strong>{t('appointmentInfo.patient')}:</strong> {appointment.patientFirstName} {appointment.patientLastName}</p>
            <p><strong>{t('appointmentInfo.phone')}:</strong> {appointment.patienPhoneNumber}</p>
            <p><strong>{t('appointmentInfo.email')}:</strong> {appointment.patientEmail}</p>
            <p><strong>{t('appointmentInfo.date')}:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>{t('appointmentInfo.time')}:</strong> {appointment.timeStart} - {appointment.timeEnd}</p>
            <p><strong>{t('appointmentInfo.service')}:</strong> {appointment.servicesName.toString()}</p>
        </Box>
    );
}