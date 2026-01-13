import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Drawer,
  Switch,
  FormControlLabel,
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
import CancellationModal from "../../components/CancellationModal";
import { showAlert } from "../../utils/GlobalAlert";
import AppointmentDetailsDialogContent from "../../components/AppointmentDetailsDialogContent";

const ReceptionistCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<IDoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(new Date().toISOString().split("T")[0]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IDoctorAppointment | null>(null);
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [showCancelled, setShowCancelled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'zakończona':
        return '✓';
      case 'cancelled':
      case 'anulowana':
        return '✕';
      case 'planned':
      case 'zaplanowana':
        return '●';
      default:
        return '○';
    }
  };

  const fetchDoctorsAppointemtAsync = async (date: string, showCancelled: boolean, showCompleted: boolean) => {
    const language = i18n.language;
    try {
      const response = await get.getAppointmentsForRecepcionist(language, date, showCancelled, showCompleted);
      console.log('API Response:', response);
      setAppointments(CalendarMapper.ApiAppointmentsToDoctorAppointments(response));
      setLoading(false);
    } catch (err) {
      console.error(err);
      showAlert({ type: "error", message: t("receptionistCalendar.errorFetchingAppointments") });
    }
  };

  const fetchDoctors = async () => {
    try {
      const doctorsResponse = await get.getDoctors();
      setDoctors(doctorsResponse);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      showAlert({ type: "error", message: t("receptionistCalendar.errorFetchingDoctors") });
    }
  };
  useEffect(() => {
    fetchDoctorsAppointemtAsync(currentWeekStart, showCancelled, showCompleted);
    fetchDoctors();
  }, [currentWeekStart, t]);

  const switchDoctorColor = (doctorId: number) => {
    switch (doctorId) {
      case 6:
        return colors.doctor1;
      case 3006:
        return colors.doctor2;
      default:
        return colors.doctor3;
    };
  }

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
      phoneNumber: selectedAppointment?.patientPhoneNumber!,
    }
    navigate(`/receptionist/appointment`, { state: { user: info as User } });
  };

  const cancelAppointment = async () => {
    setOpenModal(false);
    setCancellationModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box sx={{ flex: 1, p: 4, color: colors.white }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("receptionistCalendar.title")}
          </Typography>
          <Button
            variant="contained"
            sx={{ ml: 2, color: colors.white, backgroundColor: colors.color3, '&:hover': { backgroundColor: colors.color4 } }}
            onClick={() => setDrawerOpen(true)}
          >
            {t("receptionistCalendar.options")}
          </Button>
        </Box>
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
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <b>{arg.timeText}</b>
                      <span style={{ fontSize: '1.8em' }}>{getStatusIcon(arg.event.extendedProps.status)}</span>
                    </div>
                    <div>{arg.event.title}</div>
                    <div style={{ fontSize: '0.73em' }}>
                      {arg.event.extendedProps.description.toString()}
                    </div>
                  </div>
                );
              }}
              eventDidMount={(info) => {
                const appointment = info.event.extendedProps as IDoctorAppointment;
                const tooltipText = `${appointment.services.map(service => service.name).join(", ") ?? ''}\nStatus: ${appointment.status}\nPacjent: ${appointment.patientFirstName} ${appointment.patientLastName}\nEmail: ${appointment.patientEmail}\nTelefon: ${appointment.patientPhoneNumber ?? ''}`;
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
              minWidth: 700,
              p: 4,
            },
          }}
        >
          <DialogTitle>
            <Typography component="h1" variant="h6" sx={{ color: colors.color5, fontWeight: "bold" }}>
              {t("receptionistCalendar.appointmentDetails")}
            </Typography>
          </DialogTitle>
          {selectedAppointment && (
            <AppointmentDetailsDialogContent
              selectedAppointmentDetail={CalendarMapper.DoctorAppointmentToApiAppointment(selectedAppointment)}
            />
          )}
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
              onClick={cancelAppointment}
              sx={{ backgroundColor: colors.cancelled, color: colors.white }}
            >
              {t("receptionistCalendar.cancelAppointment")}
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
        <CancellationModal
          open={cancellationModalOpen}
          onClose={() => setCancellationModalOpen(false)}
          appointmentGuid={selectedAppointment?.id || null}
          onSuccess={() => {
            setCancellationModalOpen(false);
            setOpenModal(false);
            fetchDoctorsAppointemtAsync(currentWeekStart, showCancelled, showCompleted);
            showAlert({ type: "success", message: t("doctorCalendar.cancelSuccess") });
          }}
        />
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, p: 2, backgroundColor: colors.color1, height: '100%' }}>
            <Typography variant="h6" sx={{ color: colors.color5, mb: 2 }}>
              {t("receptionistCalendar.options")}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: colors.white, p: 2, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.color1 }}>
                {t("receptionistCalendar.legend.title")}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.color1 }}>
                ● - {t("receptionistCalendar.legend.scheduled")}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.color1 }}>
                ✓ - {t("receptionistCalendar.legend.completed")}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.color1 }}>
                ✕ - {t("receptionistCalendar.legend.cancelled")}
              </Typography>
              {doctors.map(doctor => (
                <Typography key={doctor.id} variant="body2" sx={{ color: colors.color1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: switchDoctorColor(doctor.id) }} />
                  Dr. {doctor.name} {doctor.surname}
                </Typography>
              ))}
            </Box>
            <Box sx={{ mt: 4, borderTop: `1px solid ${colors.color3}`, pt: 2 }}></Box>
            <Typography variant="h6" sx={{ color: colors.color5, mb: 2 }}>
              {t("receptionistCalendar.filters")}
            </Typography>
            <FormControlLabel
              control={<Switch checked={showCancelled} onChange={async (e) => {
                var newValue = e.target.checked;
                setShowCancelled(newValue);
                await fetchDoctorsAppointemtAsync(currentWeekStart, newValue, showCompleted);
              }} />}
              label={t("receptionistCalendar.showCancelled")}
              sx={{ color: colors.white }}
            />
            <FormControlLabel
              control={<Switch checked={showCompleted} onChange={async (e) => {
                var newValue = e.target.checked;
                setShowCompleted(newValue);
                await fetchDoctorsAppointemtAsync(currentWeekStart, showCancelled, newValue);
              }} />}
              label={t("receptionistCalendar.showCompleted")}
              sx={{ color: colors.white }}
            />

          </Box>
        </Drawer>
      </Box>
    </Box >
  );
};

export default ReceptionistCalendar;
