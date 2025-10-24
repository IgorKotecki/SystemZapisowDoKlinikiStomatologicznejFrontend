import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  CircularProgress,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import UserNavigation from "../../components/userComponents/userNavigation";

export default function ReceptionistAppointment() {
  const { t, i18n } = useTranslation();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; name: string; surname: string }[]>([]);
  const [availableTimeBlocks, setAvailableTimeBlocks] = useState<any[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("");
  const [hour, setHour] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    color1: "#003141",
    color2: "#004f5f",
    color3: "#007987",
    color4: "#00b2b9",
    color5: "#00faf1",
    white: "#ffffff",
  };

  // 🔹 Pobranie użytkowników z backendu
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/User");
        setUsers(res.data);
      } catch (err) {
        console.error("Błąd pobierania użytkowników:", err);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Pobranie usług
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/api/Service/UserServices`, {
          params: { lang: i18n.language },
        });
        setServices(res.data);
      } catch (err) {
        console.error("Błąd pobierania usług:", err);
      }
    };
    fetchServices();
  }, [i18n.language]);

  // 🔹 Pobranie bloków czasowych po wyborze daty
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
              .filter((b: any) => b.user && b.user.id != null)
              .map((b: any) => [
                String(b.user.id),
                { id: String(b.user.id), name: b.user.name, surname: b.user.surname },
              ])
          ).values()
        );
        setDoctors(uniqueDoctors);
      } catch (err) {
        console.error("Błąd pobierania bloków czasowych:", err);
      }
    };
    fetchTimeBlocks();
  }, [date]);

  // 🔹 Zapis wizyty
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !service || !doctor || !hour) {
      setError(t("receptionistAppointment.errorFillAll") || "Uzupełnij wszystkie pola.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/Appointment", {
        userId: selectedUser.id,
        doctorBlockId: [Number(hour)],
        service: { id: Number(service) },
      });
      alert(t("receptionistAppointment.success"));
      setSelectedUser(null);
      setService("");
      setDoctor("");
      setHour("");
      setDate(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t("receptionistAppointment.errorOccurred"));
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
      {/* 🔹 Lewa nawigacja */}
      <UserNavigation />

      {/* 🔹 Główna zawartość */}
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
        <Box sx={{ width: "100%", maxWidth: 1000 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("receptionistAppointment.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t("receptionistAppointment.subtitle")}
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
              {/* Wybór użytkownika */}
              <Autocomplete
                options={users}
                getOptionLabel={(u) => `${u.name} ${u.surname} (${u.email})`}
                value={selectedUser}
                onChange={(_, newValue) => setSelectedUser(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("receptionistAppointment.selectUser")}
                    fullWidth
                    margin="normal"
                    sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                  />
                )}
              />

              {/* Data */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("receptionistAppointment.date")}
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  disabled={!selectedUser}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      sx: { backgroundColor: colors.white, borderRadius: 1 },
                    },
                  }}
                />
              </LocalizationProvider>

              {/* Usługa */}
              <FormControl fullWidth margin="normal" disabled={!selectedUser}>
                <InputLabel sx={{ color: colors.white }}>
                  {t("receptionistAppointment.service")}
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

              {/* Lekarz */}
              <FormControl fullWidth margin="normal" disabled={!selectedUser || !date}>
                <InputLabel sx={{ color: colors.white }}>
                  {t("receptionistAppointment.doctor")}
                </InputLabel>
                <Select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                >
                  {doctors.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name} {d.surname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Godzina */}
              <FormControl fullWidth margin="normal" disabled={!selectedUser || !doctor}>
                <InputLabel sx={{ color: colors.white }}>
                  {t("receptionistAppointment.hour")}
                </InputLabel>
                <Select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                >
                  {availableTimeBlocks
                    .filter((b) => b.isAvailable && String(b.user.id) === doctor)
                    .map((b) => {
                      const start = new Date(b.timeStart);
                      const formattedTime = start.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <MenuItem key={b.doctorBlockId} value={b.doctorBlockId}>
                          {formattedTime}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

              {error && <Typography sx={{ color: "red", mt: 1 }}>{error}</Typography>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!selectedUser || loading}
                sx={{
                  mt: 3,
                  backgroundColor: colors.color3,
                  color: colors.white,
                  "&:hover": { backgroundColor: colors.color4 },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t("receptionistAppointment.submit")}
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
