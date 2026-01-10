import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Paper,
  CircularProgress,
  Alert, // Import Alert
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { Service } from "../../Interfaces/Service";
import type { Doctor } from "../../Interfaces/Doctor";
import type { TimeBlock } from "../../Interfaces/TimeBlock";
import post from "../../api/post";
import get from "../../api/get";

export default function UserAppointmentPage() {
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

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const lang = i18n.language || "pl";
    const fetchServices = async () => {
      try {
        const response = await get.getUserServices(lang);
        setServices(response);
      } catch (err) {
        console.error("Błąd pobierania usług:", err);
        setServices([]);
      }
    };
    fetchServices();
  }, [i18n.language]);

  useEffect(() => {
    if (!servicesIds.length) {
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
        const response = await get.getTimeBlocks(doctorId, date);
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

    const startTime = timeBlocks.find((t) => t.doctorBlockId === timeBlockId)?.timeStart;
    const serv = services.filter((s) => servicesIds.includes(s.id));
    let duration = 0;
    serv.forEach((s) => (duration += s.minTime));

    if (!servicesIds.length || !doctorId || !timeBlockId || !date) {
      setNotification({
        type: "error",
        message: t("userMakeAppointment.errorFields"),
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        doctorId,
        startTime,
        duration,
        servicesIds,
      };

      await post.bookAppointmentRegistered(payload);
      setNotification({
        type: "success",
        message: t("userMakeAppointment.success"),
      });

      setServicesIds([]);
      setDoctorId("");
      setTimeBlockId("");
      setDate(null);
    } catch (err: any) {  
      console.error(err);
      const errorCode =
        err?.response?.data?.title ??
        err?.response?.data?.Title ?? // PascalCase
        "GENERIC_ERROR";
      setNotification({
        type: "error",
        message: t("userMakeAppointment.errorOccurred") + ": " + errorCode,
      });
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
                      sx: { backgroundColor: colors.white, borderRadius: 1, mt: 2 },
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
                    const value = e.target.value;
                    setServicesIds(typeof value === "string" ? value.split(",").map(Number) : value);
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
              <FormControl fullWidth sx={{ mt: 3 }} disabled={!servicesIds.length}>
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

              <FormControl fullWidth sx={{ mt: 3 }} disabled={!doctorId || !date}>
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

      {notification && (
        <Alert
          severity={notification.type}
          variant="filled"
          onClose={() => setNotification(null)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 2000,
            minWidth: 300,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {notification.message}
        </Alert>
      )}
    </Box>
  );
}