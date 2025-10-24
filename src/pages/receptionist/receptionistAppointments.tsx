import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Modal,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
// import api from "../../api/axios"; 

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
  doctorName: string;
  serviceName: string;
  date: string; // ISO format
  time: string; // HH:mm
}

const ReceptionistCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // const response = await api.get("/api/Appointment/All");
        // setAppointments(response.data);
        setAppointments([
          {
            id: 1,
            patientFirstName: "Jan",
            patientLastName: "Kowalski",
            doctorName: "dr Nowak",
            serviceName: "Leczenie kanałowe",
            date: "2025-10-24",
            time: "09:00",
          },
          {
            id: 2,
            patientFirstName: "Anna",
            patientLastName: "Wiśniewska",
            doctorName: "dr Zieliński",
            serviceName: "Wybielanie",
            date: "2025-10-24",
            time: "10:30",
          },
          {
            id: 3,
            patientFirstName: "Piotr",
            patientLastName: "Nowicki",
            doctorName: "dr Kowal",
            serviceName: "Plomba",
            date: "2025-10-25",
            time: "11:00",
          },
        ]);
      } catch (error) {
        console.error("Błąd przy pobieraniu wizyt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const events = useMemo(() => {
  return appointments.map((a) => ({
    id: String(a.id),
    title: `${a.patientFirstName} ${a.patientLastName}`,
    start: `${a.date}T${a.time}`,
    extendedProps: a,
  }));
}, [appointments]);

  const handleEventClick = (info: any) => {
    const appointment = info.event.extendedProps as Appointment;
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => setSelectedAppointment(null);

  const handleCancelAppointment = (id: number) => {
    
    alert(t("receptionistCalendar.appointmentCancelled"));
    setSelectedAppointment(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        backgroundColor: colors.color1,
      }}
    >
      <UserNavigation />
      <Box
        sx={{
          flex: 1,
          p: 4,
          color: colors.white,
          backgroundColor: colors.color1,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
          {t("receptionistCalendar.title") || "Kalendarz wizyt"}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: colors.color5 }} />
          </Box>
        ) : (
          <Box sx={{ backgroundColor: colors.white, borderRadius: 3, p: 2 }}>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              allDaySlot={false}
              slotDuration="00:30:00"
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
              height="auto"
              events={events}
              eventClick={handleEventClick}
              eventMouseEnter={(info) => {
                const a = info.event.extendedProps as Appointment;
                const tooltip = document.createElement("div");
                tooltip.style.position = "absolute";
                tooltip.style.background = colors.color3;
                tooltip.style.color = colors.white;
                tooltip.style.padding = "6px 10px";
                tooltip.style.borderRadius = "6px";
                tooltip.style.fontSize = "12px";
                tooltip.style.zIndex = "9999";
                tooltip.innerHTML = `
                  <b>${a.patientFirstName} ${a.patientLastName}</b><br/>
                  ${a.serviceName}<br/>
                  ${a.doctorName}
                `;
                document.body.appendChild(tooltip);

                const move = (e: any) => {
                  tooltip.style.left = e.pageX + 10 + "px";
                  tooltip.style.top = e.pageY + 10 + "px";
                };
                document.addEventListener("mousemove", move);

                info.el.addEventListener("mouseleave", () => {
                  tooltip.remove();
                  document.removeEventListener("mousemove", move);
                });
              }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
            />
          </Box>
        )}

     
        <Modal open={!!selectedAppointment} onClose={handleCloseModal}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              p: 4,
              backgroundColor: colors.color2,
              color: colors.white,
              borderRadius: 3,
            }}
          >
            {selectedAppointment && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: colors.color5 }}>
                  {t("receptionistCalendar.details") || "Szczegóły wizyty"}
                </Typography>
                <Typography>
                  <b>{t("receptionistCalendar.patient") || "Pacjent"}:</b>{" "}
                  {selectedAppointment.patientFirstName}{" "}
                  {selectedAppointment.patientLastName}
                </Typography>
                <Typography>
                  <b>{t("receptionistCalendar.doctor") || "Lekarz"}:</b>{" "}
                  {selectedAppointment.doctorName}
                </Typography>
                <Typography>
                  <b>{t("receptionistCalendar.service") || "Zabieg"}:</b>{" "}
                  {selectedAppointment.serviceName}
                </Typography>
                <Typography>
                  <b>{t("receptionistCalendar.time") || "Godzina"}:</b>{" "}
                  {selectedAppointment.date} {selectedAppointment.time}
                </Typography>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#c62828",
                      "&:hover": { backgroundColor: "#b71c1c" },
                    }}
                    onClick={() =>
                      handleCancelAppointment(selectedAppointment.id)
                    }
                  >
                    {t("receptionistCalendar.cancel") || "Anuluj wizytę"}
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

export default ReceptionistCalendar;
