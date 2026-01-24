import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { Appointment } from "../../Interfaces/Appointment";
import get from "../../api/get";
import put from "../../api/put";
import { showAlert } from "../../utils/GlobalAlert";
import LoadingScreen from "../../components/Loading";
import AppointmentsDataGrid from "../../components/AppointementDataGrid";

export default function VisitsHistoryPage() {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelled, setShowCancelled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  

  const fetchAppointments = async (showCancelled: boolean, showCompleted: boolean) => {
    try {
      setLoading(true);
      const lang = i18n.language || "pl";
      const response = await get.getUserAppointments(lang, showCancelled, showCompleted, true);
      setAppointments(response);
    } catch (err) {
      showAlert({ type: "error", message: t("userAppointments.fetchError") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(showCancelled, showCompleted);
  }, [i18n.language]);

  const handleCancelAppointment = async (appointment: Appointment) => {
    try {
    await put.cancellation({
      appointmentGuid: appointment.appointmentGroupId,
      reason: "",
    });
    showAlert({ type: "success", message: t("userAppointments.cancelSuccess") });
    await fetchAppointments(showCancelled, showCompleted);
    } catch (err: any) {
      let error = err.response?.data?.title ??
        err.response?.data?.Title ?? // PascalCase
        "GENERIC_ERROR";
      showAlert({ type: "error", message: t(error) });
    }
  };

  if (loading) return <LoadingScreen />;

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
            {t("userAppointments.title")}
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
              {t("userAppointments.pageInfo")}
            </Typography>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={showCancelled}
                    onChange={async (e) => {
                      const newValue = e.target.checked;
                      setShowCancelled(newValue);
                      await fetchAppointments(newValue, showCompleted);
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
                      await fetchAppointments(showCancelled, newValue);
                    }}
                  />
                }
                label={t("receptionistCalendar.showCompleted")}
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