import { Box } from "@mui/material";
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
import Alert from '@mui/material/Alert';
import put from "../../api/put";
import get from "../../api/get";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";

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
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

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

    useEffect(() => {

        const lang = i18n.language || "pl";

        const fetchStatusesAsync = async () => {
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
        const fetchTeethData = async () => {
            try {
                if (!state) return;
                const response = await get.getTeethModel(state.appointment.patientId, lang)
                setTeeth(response);
            } catch (error) {
                console.error("Błąd pobierania danych o zębach:", error);
            }
        };

        const fetchAddInfoData = async () => {
            try {
                const response = await get.getAdditionalInformation(lang);
                setAddInfo(response);
            } catch (error) {
                console.error("Błąd pobierania danych o dodatkowych informacjach:", error);
            }
        };

        fetchTeethData();
        fetchStatusesAsync();
        fetchAddInfoData();
        setLoading(false);
    }, [t]);

    const saveChanges = async () => {
        try {
            const payload = {
                userId: state?.appointment.patientId,
                teeth: teeth.map(tooth => ({
                    toothNumber: tooth.toothNumber,
                    statusId: tooth.status ? tooth.status.statusId : null,
                })),
            };
            await put.updateTeethModel(payload);
            console.log("Zmiany zebów zapisane:");

            const appointmentPayload = {
                Id: state?.appointment.id,
                AddInformationIds: checked.map(info => info.id),
            };

            console.log(appointmentPayload);
            

            await put.updateAditianalInformationToAppointment(appointmentPayload);
            console.log("Dodatkowe informacje zapisane:");

            const statusPayload = {
                "appointmentId": state?.appointment.id,
                "statusId": 3, // Completed
            };

            await put.updateAppointmentStatus(statusPayload);
            console.log("Status wizyty zapisany:");

            setAlert({ type: 'success', message: t('doctorAppointmentConsole.saveSuccess') });
        } catch (error) {
            console.error("Błąd zapisywania zmian:", error);
            setAlert({ type: 'error', message: t('doctorAppointmentConsole.saveError') });
        }
    };

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
                        <Button onClick={saveChanges}>
                            {t("doctorAppointmentConsole.saveChanges")}
                        </Button>
                    </Box>
                </Grid>
                <Grid size={12}>
                    <TeethModel teeth={teeth} selectedTooth={selectedTooth} setSelectedTooth={setSelectedTooth} />
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
            {alert && (
                <Alert severity={alert.type} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                    {alert.message}
                </Alert>
            )}
        </Box>
    );
}