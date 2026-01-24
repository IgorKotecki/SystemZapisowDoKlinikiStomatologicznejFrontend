import React, { useState, useEffect, useMemo } from "react";
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
  Alert,
  TextField,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  ListItemIcon,
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
  const [search, setSearch] = useState("");
  const [loadingServices, setLoadingServices] = useState(true);

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
      setLoadingServices(true);
      try {
        const response = await get.getUserServices(lang);
        setServices(response);
      } catch (err) {
        console.error("Błąd pobierania usług:", err);
        setServices([]);
      } finally {
        setLoadingServices(false);
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
        err?.response?.data?.Title ??
        "GENERIC_ERROR";
      setNotification({
        type: "error",
        message: t(errorCode),
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(
    () =>
      services.filter((service) =>
        service.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, services]
  );

  const toggleSelect = (id: number) => {
    setServicesIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
                      sx: { backgroundColor: colors.white, borderRadius: 1 },
                    },
                  }}
                />
              </LocalizationProvider>
              <Box sx={{ padding: 1 }}>
                <TextField
                  label={t("userMakeAppointment.search")}
                  variant="outlined"
                  size="small"
                  fullWidth
                  margin="normal"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                />
              </Box>
              <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "40vh", backgroundColor: colors.white, borderRadius: 1 }}>
                {loadingServices ? (
                  <CircularProgress />
                ) : (
                  <List dense sx={{ borderRadius: 1 }}>
                    {filteredRows.map((row) => {
                      const isSelected = servicesIds.includes(row.id);
                      return (
                        <ListItem
                          key={row.id}
                          divider
                          disablePadding
                          sx={{ cursor: "pointer", borderRadius: 1 }}
                          alignItems="center"
                          secondaryAction={
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 2 }}>
                              <Typography variant="body2" fontWeight="bold" color="primary">
                                {row.lowPrice ?? row.highPrice} PLN
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.minTime * 30} min
                              </Typography>
                            </Box>
                          }
                        >
                          <ListItemIcon sx={{ minWidth: 40, alignItems: "center", justifyContent: "center", paddingLeft: 2, borderRadius: 1 }}>
                            <Checkbox
                              edge="start"
                              checked={isSelected}
                              tabIndex={-1}
                              disableRipple
                              onChange={() => toggleSelect(row.id)}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={row.name}
                            secondary={row.description}
                            onClick={() => toggleSelect(row.id)}
                            sx={{ margin: 1 }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Box>
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

                    (() => {
                      const availableBlocks = timeBlocks.filter((b) => b.isAvailable);

                      if (availableBlocks.length === 0) {
                        return (
                          <MenuItem disabled>
                            <Typography variant="body2" color="textSecondary">
                              {t("userMakeAppointment.noAvailableHours")}
                            </Typography>
                          </MenuItem>
                        );
                      }

                      return availableBlocks.map((b) => {
                        const time = new Date(b.timeStart).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <MenuItem key={b.doctorBlockId} value={b.doctorBlockId}>
                            {time}
                          </MenuItem>
                        );
                      });
                    })()
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
            bottom: 16,
            right: 16,
            zIndex: 1500,
            minWidth: 300
          }}
        >
          {notification.message}
        </Alert>
      )}
    </Box>
  );
}