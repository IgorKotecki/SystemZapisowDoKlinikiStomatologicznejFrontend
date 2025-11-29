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
import { colors } from "../../utils/colors";
import type { Service } from "../../Interfaces/Service";
import type { Doctor } from "../../Interfaces/Doctor";
import type { TimeBlock } from "../../Interfaces/TimeBlock";

export default function UserAppointmentPage() {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState<Date | null>(null);
  const [servicesIds, setServicesIds] = useState<number[]>([]);
  const [doctorId, setDoctorId] = useState<number | "">("");
  const [timeBlocksIds, setTimeBlocksIds] = useState<Set<number>>(new Set())
  const [timeBlockId, setTimeBlockId] = useState<number | "">("");
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/api/Service/UserServices`, {
          params: { lang: i18n.language },
        });
        console.log("Usługi:", res.data);
        setServices(res.data);
      } catch (err) {
        console.error("Błąd pobierania usług:", err);
        setServices([]);
      }
    };

    fetchServices();
  }, [i18n.language]);

  useEffect(() => {
    if (!servicesIds) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await api.get(`/api/Doctor`);
        setDoctors(res.data);
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
        const res = await api.get(`/api/GetTimeBlocks/${doctorId}`, {
          params: {
            Year: date.getFullYear(),
            Month: date.getMonth() + 1,
            Day: date.getDate(),
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
    try {
    if (!servicesIds || !doctorId || !timeBlockId || !date) {
      setError(t("userMakeAppointment.errorFields"));
      return;
    }

    setLoading(true);

    let timeBlockCounter = 0;
    servicesIds.forEach(s => {
      const service = services.find(sdto => sdto.id == s);
      if (service) {
        timeBlockCounter += service.minTime;
      }
    }
    );
    console.log(timeBlockCounter);
    console.log(timeBlocks);
    
    var baseTimeBlock = timeBlocks.find(tb => tb.doctorBlockId == timeBlockId)
    for (let index = 0; index < timeBlockCounter; index++) {
      var curTimeBlock = timeBlocks.find(tb => tb.doctorBlockId == timeBlockId + index)
      console.log(timeBlockId + index)
      if(curTimeBlock){
        if(curTimeBlock.isAvailable){
          if(baseTimeBlock?.timeStart.split("T")[0] == curTimeBlock.timeStart.split("T")[0]){
          setTimeBlocksIds(prev => new Set(prev).add(timeBlockId + index))
          }else{
        throw new Error(`wymagany czas dla danych usług (${timeBlockCounter * 30} minut) przekracza czas pracy lekarza`)
          }
        }else{
          throw new Error(`nie dostępne terminy dla usług o czasie trwania (${timeBlockCounter * 30} minut)`)
        }
      }else{
        throw new Error(`nie isnieje block czasowy odpowidni aby pomiescic ilosc usług`)
      }
      
    }
    console.log(timeBlocks);
    console.log(timeBlocksIds)
      const token = localStorage.getItem("token");
      if (!token) return;

      await api.post(`/api/Appointment/user/book`, {
        doctorBlocksIds : timeBlocksIds,
        servicesIds,
      });

      alert(t("userMakeAppointment.success"));

      setServicesIds([]);
      setDoctorId("");
      setTimeBlockId("");
      setDate(null);
    } catch (err: any) {
      console.error(err);
      setError(t("userMakeAppointment.errorOccurred") + err);
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
                      sx: { backgroundColor: colors.white, borderRadius: 1, mt: 2, color: colors.black },
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
                    const value = e.target.value
                    setServicesIds(typeof value === 'string' ? value.split(',').map(Number) : value)
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
              <FormControl
                fullWidth
                sx={{ mt: 3 }}
                disabled={!servicesIds}
              >
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

              <FormControl
                fullWidth
                sx={{ mt: 3 }}
                disabled={!doctorId || !date}
              >
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
