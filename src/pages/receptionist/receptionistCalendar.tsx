import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  DialogContent,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { IDoctorAppointment } from "../../Interfaces/IDoctorAppointment";
import type { User } from "../../Interfaces/User";
import { CalendarMapper } from "../../mappers/CallenderMapper";
import i18n from "../../i18n";
import enLocale from '@fullcalendar/core/locales/en-gb';
import plLocale from '@fullcalendar/core/locales/pl';
import get from "../../api/get";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ReceptionistCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<IDoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(new Date().toISOString().split("T")[0]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IDoctorAppointment | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorsAppointemtAsync = async (date: string) => {
      const language = i18n.language;
      try {
        const response = await get.getAppointmentsForRecepcionist(language, date);
        setAppointments(CalendarMapper.ApiAppointmentsToDoctorAppointments(response));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctorsAppointemtAsync(currentWeekStart);
  }, [currentWeekStart, t]);

  const events = useMemo(
    () => appointments.map((a) => ({
      id: String(a.id),
      title: `${a.patientFirstName} ${a.patientLastName}`,
      start: `${a.date}T${a.timeStart}`,
      end: `${a.date}T${a.timeEnd}`,
      description: a.servicesName,
      extendedProps: a,
    })),
    [appointments]
  );

  const handleEventClick = (info: any) => {
    setSelectedAppointment(info.event.extendedProps as IDoctorAppointment);
    setOpenModal(true);
  };

  const goToAppointment = () => {
    setOpenModal(false);
    const info : User = {
      id: selectedAppointment?.patientId!,
      name: selectedAppointment?.patientFirstName!,
      surname: selectedAppointment?.patientLastName!,
      email: selectedAppointment?.patientEmail!,
      phoneNumber: selectedAppointment?.patienPhoneNumber!,
    } 
    navigate(`/receptionist/appointment`, { state: { user: info as User } });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box sx={{ flex: 1, p: 4, color: colors.white }}>
        <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
          {t("receptionistCalendar.title")}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ color: colors.color5 }} />
        ) : (
          <Box sx={{ backgroundColor: colors.white, color: colors.black, borderRadius: 3, p: 2 }}>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              allDaySlot={false}
              eventClick={handleEventClick}
              eventMouseEnter={(mouseEnterInfo) => {
                mouseEnterInfo.el.style.cursor = 'pointer';
              }}
              eventMouseLeave={(mouseLeaveInfo) => {
                mouseLeaveInfo.el.style.cursor = 'default';
              }}
              events={events}
              eventContent={(arg) => {
                return (
                  <div style={{ fontSize: '0.8em', lineHeight: '1.1em', overflow: 'hidden', height: '100%' }}>
                    <div><b>{arg.timeText}</b></div>
                    <div>{arg.event.title}</div>
                    <div style={{ fontSize: '0.73em' }}>
                      {arg.event.extendedProps.description.toString()}
                    </div>
                  </div>
                );
              }}
              eventDidMount={(info) => {
                const appointment = info.event.extendedProps;
                const tooltipText = `${appointment.description ?? ''}\nPacjent: ${appointment.patientFirstName} ${appointment.patientLastName}\nEmail: ${appointment.patientEmail}\nTelefon: ${appointment.patienPhoneNumber ?? ''}`;
                info.el.setAttribute('title', tooltipText);
              }}
              height="auto"
              locale={i18n.language === 'pl' ? plLocale : enLocale}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              slotLabelInterval={{ minutes: 30 }
              }
              slotDuration="00:30:00"
              slotLabelFormat={{ hour: 'numeric', minute: '2-digit' }}
              hiddenDays={[7, 0]}
              headerToolbar={{
                left: "today",
                center: "",
                right: "prev next"
              }}
              datesSet={(dateInfo) => {
                const startDateObj = new Date(dateInfo.start);
                startDateObj.setDate(startDateObj.getDate() + 1);
                const startDate = startDateObj.toISOString().split("T")[0];
                setCurrentWeekStart(startDate);
              }}
            />
          </Box>
        )}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          PaperProps={{
            sx: {
              backgroundColor: colors.color2,
              color: colors.white,
              borderRadius: 3,
              minWidth: 300,
              p: 4,
            },
          }}
        >
          <DialogTitle>
            <Typography component="h2" variant="h6" sx={{ color: colors.color5, mb: 2 }}>
              {t("receptionistCalendar.appointmentDetails")}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {t("receptionistCalendar.patient")}: {`${selectedAppointment?.patientFirstName} ${selectedAppointment?.patientLastName}`}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              {t("receptionistCalendar.date")}: {selectedAppointment?.date} {selectedAppointment?.timeStart} - {selectedAppointment?.timeEnd}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              {t("receptionistCalendar.services")}: {selectedAppointment?.servicesName.toString()}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenModal(false)
                setSelectedAppointment(null);
              }}
              sx={{ borderColor: colors.color3, color: colors.white }}
            >
              {t("receptionistCalendar.close")}
            </Button>
            <Button
              variant="contained"
              onClick={goToAppointment}
              sx={{ backgroundColor: colors.color3, color: colors.white }}
            >
              {t("receptionistCalendar.makeAppointment")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ReceptionistCalendar;
