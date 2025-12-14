import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import type { IDoctorAppointment } from "../../Interfaces/IDoctorAppointment";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { Status } from "../../Interfaces/Status";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import api from "../../api/axios";
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

    useEffect(() => {
        const fetchStatusesAsync = async () => {
            try {
                const lang = i18n.language || "pl";
                const response = await api.get(`/api/Tooth/Statuses?language=${lang}`);
                const res = response.data['statusesByCategories'];
                const map = new Map<string, Status[]>();
                for (const key in res) {
                    map.set(key, res[key]);
                }
                setStatusesByCategories(map);
            } catch (err) {
                console.error("Failed to fetch statuses");
            }
        };
        const fetchTeethData = async () => {
            try {
                const response = await api.post("/api/Tooth/ToothModel", {
                    userId: state?.appointment.patientId,
                    Language: i18n.language.toLowerCase()
                });
                console.log("Dane o zębach:", response.data);
                setTeeth(response.data.teeth);
            } catch (error) {
                console.error("Błąd pobierania danych o zębach:", error);
            }
        };
        const fetchAddInfoData = async () => {
            try {
                const lang = i18n.language || "pl";
                const response = await api.get(`/api/Appointment/AddInfo?lang=${lang}`);
                console.log("Dane o dodatkowych informacjach:", response.data);
                setAddInfo(response.data);
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
            await api.put("/api/Tooth/UpdateToothModel", payload);
            console.log("Zmiany zebów zapisane:");

            const appointmentPayload = {
                Id: state?.appointment.id,
                AddInformationIds: checked.map(info => info.id),
            };
            await api.put("/api/Appointment/AddInfoToAppointment", appointmentPayload);
            console.log("Dodatkowe informacje zapisane:");
            
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
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
            <UserNavigation />
            <Grid container sx={{ padding: 2}} spacing={2}>
                <Grid size={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
                        {t("doctorAppointmentConsole.title")}
                    </Typography>
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
                    <AddInfoRenderer addInfo={addInfo} checked={checked} setChecked={setChecked} setAddInfo={setAddInfo}/>
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