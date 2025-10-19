import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Paper,
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

export default function UserAppointmentPage() {
  const { t, i18n } = useTranslation();

  const [date, setDate] = useState<Date | null>(null);
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("");
  const [hour, setHour] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; name: string; surname: string }[]>([]);
  const [availableTimeBlocks, setAvailableTimeBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pobieranie usług
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/api/Service/UserServices`, {
          params: { lang: i18n.language },
        });
        setServices(res.data);
      } catch (err) {
        console.error("Błąd przy pobieraniu usług:", err);
      }
    };
    fetchServices();
  }, [i18n.language]);

  // Pobieranie dostępnych bloków czasowych po wyborze daty
  useEffect(() => {
    if (!date) return;

    const fetchTimeBlocks = async () => {
      try {
        const res = await api.get("/api/TimeBlocks", {
          params: {
            Year: date.getFullYear(),
            Month: date.getMonth() + 1,
            Day: date.getDate(),
          },
        });

        const blocks = res.data;
        setAvailableTimeBlocks(blocks);

        const uniqueDoctors = Array.from(
          new Map(
            blocks
              .filter((block) => block.user && block.user.id != null)
              .map((block) => [
                String(block.user.id),
                {
                  id: String(block.user.id),
                  name: block.user.name,
                  surname: block.user.surname,
                },
              ])
          ).values()
        );

        setDoctors(uniqueDoctors);
      } catch (err) {
        console.error("Błąd przy pobieraniu bloków czasowych:", err);
      }
    };

    fetchTimeBlocks();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!service || !doctor || !hour || !date) {
      setError(t("userMakeAppointment.errorFields"));
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/Appointment/user", {
        doctorBlockId: [Number(hour)],
        service: { id: Number(service) },
      });

      alert(t("userMakeAppointment.success"));
      setService("");
      setDoctor("");
      setHour("");
      setDate(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t("userMakeAppointment.errorOccurred"));
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
            <form onSubmit={handleSubmit}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("userMakeAppointment.date")}
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      sx: { backgroundColor: colors.white, borderRadius: 1 },
                    },
                  }}
                />
              </LocalizationProvider>

              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: colors.white }}>
                  {t("userMakeAppointment.service")}
                </InputLabel>
                <Select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                >
                  {services.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" disabled={!date}>
                <InputLabel sx={{ color: colors.white }}>
                  {t("userMakeAppointment.doctor")}
                </InputLabel>
                <Select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                >
                  {doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      {doc.name} {doc.surname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" disabled={!doctor}>
                <InputLabel sx={{ color: colors.white }}>
                  {t("userMakeAppointment.hour")}
                </InputLabel>
                <Select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                >
                  {availableTimeBlocks
                    .filter(
                      (block) => block.isAvailable && String(block.user.id) === doctor
                    )
                    .map((block) => {
                      const start = new Date(block.timeStart);
                      const formattedTime = start.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <MenuItem key={block.doctorBlockId} value={block.doctorBlockId}>
                          {formattedTime}
                        </MenuItem>
                      );
                    })}
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
