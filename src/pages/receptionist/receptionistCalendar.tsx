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
        console.log('API Response:', response);
        setAppointments(CalendarMapper.ApiAppointmentsToDoctorAppointments(response));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctorsAppointemtAsync(currentWeekStart);
  }, [currentWeekStart, t]);

  const switchDoctorColor = (doctorId: number) => {
    switch(doctorId) {
      case 6:
        return colors.doctor1;
      case 3006:
        return colors.doctor2;
      default:
        return colors.doctor3;
  };}

  const events = useMemo(
    () => appointments.map((a) => ({
      id: String(a.id),
      title: `${a.patientFirstName} ${a.patientLastName}`,
      start: `${a.date}T${a.timeStart}`,
      end: `${a.date}T${a.timeEnd}`,
      description: `Doctor : ${a.doctor.name} ${a.doctor.surname}`,
      extendedProps: a,
      borderColor: colors.black,
      backgroundColor: switchDoctorColor(a.doctor.id),
      textColor: colors.black,
    })),
    [appointments]
  );

  const handleEventClick = (info: any) => {
    setSelectedAppointment(info.event.extendedProps as IDoctorAppointment);
    setOpenModal(true);
  };

  const goToAppointment = () => {
    setOpenModal(false);
    const info: User = {
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
          <Box sx={{ backgroundColor: colors.pureWhite, color: colors.black, borderRadius: 3, p: 2 }}>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              allDaySlot={false}
              eventClick={handleEventClick}
              slotEventOverlap={false}
              eventOverlap={false}
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
                const appointment = info.event.extendedProps as IDoctorAppointment;
                const tooltipText = `${appointment.servicesName.toString() ?? ''}\nPacjent: ${appointment.patientFirstName} ${appointment.patientLastName}\nEmail: ${appointment.patientEmail}\nTelefon: ${appointment.patienPhoneNumber ?? ''}`;
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
            <Typography component="h1" variant="h6" sx={{ color: colors.color5, fontWeight: "bold" }}>
              {t("receptionistCalendar.appointmentDetails")}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography >
              {t("receptionistCalendar.patient")}:
            </Typography>
            <Box sx={{ mb: 2, pl: 2, borderLeft: `4px solid ${colors.color3}` }}>
              <Typography >
                {`${selectedAppointment?.patientFirstName} ${selectedAppointment?.patientLastName}`}
              </Typography>
              <Typography >
                {selectedAppointment?.patientEmail}
              </Typography>
              <Typography >
                {selectedAppointment?.patienPhoneNumber}
              </Typography>
            </Box>
            <Typography >
              {t("receptionistCalendar.doctor")}:
            </Typography>
            <Box sx={{ mb: 2, pl: 2, borderLeft: `4px solid ${colors.color3}` }}>
              <Typography >
                {`${selectedAppointment?.doctor.name} ${selectedAppointment?.doctor.surname}`}
              </Typography>
            </Box>
            <Typography >
              {t("receptionistCalendar.date")} - {t("receptionistCalendar.time")}:
            </Typography>
            <Box sx={{ mb: 2, pl: 2, borderLeft: `4px solid ${colors.color3}` }}>
              <Typography >
                {selectedAppointment?.date}
              </Typography>
              <Typography >
                {selectedAppointment?.timeStart?.slice(0, 5)} - {selectedAppointment?.timeEnd?.slice(0, 5)}
              </Typography>
            </Box>
            <Typography >
              {t("receptionistCalendar.services")}
            </Typography>
            <Box sx={{ mb: 2, pl: 2, borderLeft: `4px solid ${colors.color3}` }}>
              {selectedAppointment?.servicesName.map((service, index) => (
                <Typography key={index}>
                  - {service}
                </Typography>
              ))}
            </Box>
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
