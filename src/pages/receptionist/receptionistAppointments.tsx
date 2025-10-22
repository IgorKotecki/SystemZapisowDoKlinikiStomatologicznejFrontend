// import React, { useEffect, useState } from "react";
// import { Box, Typography, CircularProgress } from "@mui/material";
// import FullCalendar, { EventInput } from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useTranslation } from "react-i18next";
// import api from "../../api/axios";

// interface Appointment {
//   id: number;
//   patientFirstName: string;
//   patientLastName: string;
//   doctorName: string;
//   serviceName: string;
//   date: string; // ISO string
//   time: string; // "HH:mm"
// }

// export default function ReceptionistCalendar() {
//   const { t } = useTranslation();
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await api.get("/api/Appointment/All"); 
//         setAppointments(response.data);
//       } catch (error) {
//         console.error("Błąd przy pobieraniu wizyt:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const events: EventInput[] = appointments.map((a) => ({
//     id: String(a.id),
//     title: `${a.patientFirstName} ${a.patientLastName} - ${a.serviceName} (${a.doctorName})`,
//     start: new Date(`${a.date}T${a.time}`),
//     allDay: false,
//   }));

//   return (
//     <Box sx={{ flex: 1, p: 4, backgroundColor: "#f5f5f5" }}>
//       <Typography variant="h4" gutterBottom>
//         {t("receptionistCalendar.title") || "Kalendarz wizyt"}
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <FullCalendar
//           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//           initialView="timeGridWeek"
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,timeGridWeek,timeGridDay",
//           }}
//           allDaySlot={false}
//           events={events}
//           eventTimeFormat={{
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: false,
//           }}
//           slotMinTime="08:00:00"
//           slotMaxTime="18:00:00"
//           height="auto"
//         />
//       )}
//     </Box>
//   );
// }
