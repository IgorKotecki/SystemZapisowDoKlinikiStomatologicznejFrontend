import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Modal,
  Paper,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

interface Appointment {
  id: number;
  patientFirstName: string;
  patientLastName: string;
  serviceName: string;
  date: string;
  time: string;
}

const DoctorAppointments: React.FC = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);

  useEffect(() => {
    setAppointments([
      { id: 1, patientFirstName: "Jan", patientLastName: "Kowalski", serviceName: "Leczenie kanałowe", date: "2025-10-25", time: "09:00" },
      { id: 2, patientFirstName: "Anna", patientLastName: "Wiśniewska", serviceName: "Plomba", date: "2025-10-26", time: "10:30" },
    ]);
    setLoading(false);
  }, []);

  const events = useMemo(
    () => appointments.map((a) => ({
      id: String(a.id),
      title: `${a.patientFirstName} ${a.patientLastName}`,
      start: `${a.date}T${a.time}`,
      extendedProps: a,
    })),
    [appointments]
  );

  const handleEventClick = (info: any) => {
    setSelectedAppointment(info.event.extendedProps);
    setNote("");
    setSelectedTeeth([]);
  };

  const handleToothClick = (tooth: number) => {
    setSelectedTeeth((prev) =>
      prev.includes(tooth) ? prev.filter((t) => t !== tooth) : [...prev, tooth]
    );
  };

  const handleSaveNote = () => {
    alert(t("doctorCalendar.savedNote"));
    setSelectedAppointment(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box sx={{ flex: 1, p: 4, color: colors.white }}>
        <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
          {t("doctorCalendar.title")}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ color: colors.color5 }} />
        ) : (
          <Box sx={{ backgroundColor: colors.white, borderRadius: 3, p: 2 }}>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              allDaySlot={false}
              events={events}
              height="auto"
              eventClick={handleEventClick}
            />
          </Box>
        )}

        <Modal open={!!selectedAppointment} onClose={() => setSelectedAppointment(null)}>
          <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, p: 4, backgroundColor: colors.color2, color: colors.white, borderRadius: 3 }}>
            {selectedAppointment && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: colors.color5 }}>
                  {t("doctorCalendar.details")}
                </Typography>

                <Typography><b>{t("doctorCalendar.patient")}:</b> {selectedAppointment.patientFirstName} {selectedAppointment.patientLastName}</Typography>
                <Typography><b>{t("doctorCalendar.service")}:</b> {selectedAppointment.serviceName}</Typography>
                <Typography><b>{t("doctorCalendar.time")}:</b> {selectedAppointment.date} {selectedAppointment.time}</Typography>

                <Typography sx={{ mt: 2 }}>{t("doctorCalendar.addNote")}</Typography>
                <TextField fullWidth multiline rows={3} value={note} onChange={(e) => setNote(e.target.value)} sx={{ backgroundColor: colors.white, mt: 1, borderRadius: 1 }} />

                <Typography sx={{ mt: 3 }}>{t("doctorCalendar.selectTeeth")}</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {Array.from({ length: 32 }, (_, i) => i + 1).map((num) => (
                    <Grid item xs={2} key={num}>
                      <Button
                        variant={selectedTeeth.includes(num) ? "contained" : "outlined"}
                        onClick={() => handleToothClick(num)}
                        sx={{
                          minWidth: 40,
                          backgroundColor: selectedTeeth.includes(num) ? colors.color4 : "transparent",
                          color: selectedTeeth.includes(num) ? colors.white : colors.color5,
                        }}
                      >
                        {num}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" onClick={handleSaveNote} sx={{ backgroundColor: colors.color3 }}>
                    {t("doctorCalendar.save")}
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Modal>
      </Box>
    </Box>
  );
};

export default DoctorAppointments;
