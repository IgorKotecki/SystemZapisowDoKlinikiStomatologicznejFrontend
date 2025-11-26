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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import UserNavigation from "../../components/userComponents/userNavigation";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

interface ServiceDTO {
  id: number;
  name: string;
  lowPrice: number;
  highPrice: number;
  minTime: number;
  description: string | null;
  category: string | null;
}

interface DoctorDTO {
  id: number;
  name: string;
  surname: string;
}

interface TimeBlockDTO {
  doctorBlockId: number;
  timeStart: string;
  timeEnd: string;
  isAvailable: boolean;
  user: DoctorDTO;
}

export default function UserAppointmentPage() {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState<Date | null>(null);
  const [serviceId, setServiceId] = useState<number | "">("");
  const [doctorId, setDoctorId] = useState<number | "">("");
  const [timeBlockId, setTimeBlockId] = useState<number | "">("");
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlockDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const claims = JSON.parse(localStorage.getItem("claims") || "{}");
  const userId = claims?.id || claims?.sub;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/api/Service/UserServices`, {
          params: { lang: i18n.language },
        });
        setServices(res.data);
      } catch (err) {
        console.error("Błąd pobierania usług:", err);
        setServices([]);
      }
    };

    fetchServices();
  }, [i18n.language]);

  useEffect(() => {
    if (!serviceId) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await api.get(`/api/Doctor/by-service/${serviceId}`);
        setDoctors(res.data);
      } catch (err) {
        console.error("Błąd pobierania lekarzy:", err);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [serviceId]);

  useEffect(() => {
    if (!doctorId || !date) {
      setTimeBlocks([]);
      return;
    }

    const fetchTimeBlocks = async () => {
      setLoadingBlocks(true);
      try {
        const res = await api.get("/api/TimeBlocks", {
          params: {
            Year: date.getFullYear(),
            Month: date.getMonth() + 1,
            Day: date.getDate(),
            DoctorId: doctorId,
          },
        });

        setTimeBlocks(res.data);
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

    setError(null);

    if (!serviceId || !doctorId || !timeBlockId || !date) {
      setError(t("userMakeAppointment.errorFields"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const claims = decodeJwt(token);
      const userId = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];


      await api.post(`/api/Appointment/user/${userId}/book`, {
        doctorId,
        timeBlockId,
        serviceIds: [serviceId],
      });

      alert(t("userMakeAppointment.success"));

      setServiceId("");
      setDoctorId("");
      setTimeBlockId("");
      setDate(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || t("userMakeAppointment.errorOccurred"));
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
                <InputLabel sx={{ color: colors.white }}>
                  {t("userMakeAppointment.service")}
                </InputLabel>
                <Select
                  value={serviceId}
                  onChange={(e) => setServiceId(Number(e.target.value))}
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
                disabled={!serviceId}
              >
                <InputLabel sx={{ color: colors.white }}>
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
                <InputLabel sx={{ color: colors.white }}>
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
              {error && (
                <Typography sx={{ mt: 2, color: "#ff8080" }}>{error}</Typography>
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
