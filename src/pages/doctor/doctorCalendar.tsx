import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  DialogTitle,
  DialogActions,
  Button,
  Dialog,
  Drawer,
  FormControlLabel,
  Switch,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import i18n from "../../i18n";
import enLocale from '@fullcalendar/core/locales/en-gb';
import plLocale from '@fullcalendar/core/locales/pl';
import get from "../../api/get";
import type { WorkingHours } from "../../Interfaces/WorkingHours";
import type { Appointment } from "../../Interfaces/Appointment";
import { showAlert } from "../../utils/GlobalAlert";
import deleteApi from "../../api/delete";
import post from "../../api/post";
import type { EventApi } from "@fullcalendar/core/index.js";
import CancellationModal from "../../components/CancellationModal";
import { applayStatusColor } from "../../utils/colorsUtils";
import AppointmentDetailsDialogContent from "../../components/AppointmentDetailsDialogContent";
import type { User } from "../../Interfaces/User";
import { useNavigate } from "react-router-dom";

const DoctorCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(new Date().toISOString());
  const [openModal, setOpenModal] = useState(false);
  const calendarRef = React.useRef<FullCalendar>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [workingDay, setWorkingDay] = useState<EventApi | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string, dayOfWeek: string } | null>(null);
  const [addTimeModalOpen, setAddTimeModalOpen] = useState(false);
  const [cancelationModalOpen, setCancelationModalOpen] = useState(false);
  const [showCancelled, setShowCancelled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchDoctorWorkingHours = async (date: string) => {
    try {
      const response = await get.getDoctorWorkingHours(date);
      setWorkingHours(response);
      setLoading(false);
    } catch (err) {
      showAlert({ type: 'error', message: t('globalAlert.errorLoadingData') });
      console.error(err);
    }
  };

  const fetchAppointments = async (date: string, showCancelled: boolean, showCompleted: boolean) => {
    try {
      const language = i18n.language;
      const response = await get.getDoctorAppointments(language, date, showCancelled, showCompleted);
      setAppointments(response);
      setLoading(false);
    } catch (err) {
      showAlert({ type: 'error', message: t('globalAlert.errorLoadingData') });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctorWorkingHours(currentWeekStart);
    fetchAppointments(currentWeekStart, showCancelled, showCompleted);
  }, [currentWeekStart, t]);

  const events = useMemo(
    () => [
      ...workingHours.map((wh) => ({
        title: t("doctorCalendar.workingHours"),
        start: wh.startTime,
        end: wh.endTime,
        description: "",
        extendedProps: {
          ...wh,
          type: 'workingHours'
        },
        backgroundColor: 'rgba(14, 172, 0, 0.5)',
      })),
      ...appointments.map((a) => ({
        title: `${a.user.name} ${a.user.surname}`,
        description: a.services.map((s: any) => s.name).toString(),
        start: a.startTime,
        end: a.endTime,
        backgroundColor: applayStatusColor(a.status),
        extendedProps: {
          ...a,
          type: 'appointment'
        },
      })),
    ],
    [workingHours, appointments]
  );


  const handleEventClick = (info: any) => {
    const eventType = info.event.extendedProps.type;

    if (eventType === 'workingHours') {
      setWorkingDay(info.event);
      setOpenModal(true);
    } else if (eventType === 'appointment') {
      setSelectedAppointment(info.event.extendedProps);
      setOpenDetailDialog(true);
    }
  };

  const handleDelete = async () => {
    if (!workingDay) return;
    setDeleting(true);
    try {
      if (!workingDay || !workingDay.start || !workingDay.end) {
        throw new Error('Invalid working day data');
      }

      const payload = {
        startTime: workingDay.extendedProps.startTime,
        endTime: workingDay.extendedProps.endTime,
      };

      console.log('Payload being sent:', payload);

      await deleteApi.deleteWorkingHours(payload);

      showAlert({ type: 'success', message: t('doctorCalendar.removeWorkingHoursSuccess') });
      await fetchDoctorWorkingHours(currentWeekStart);
      setOpenModal(false);
      setWorkingDay(null);
    } catch (err: any) {
      console.error(err);
      let errorCode = err.response?.data?.title ??
        err.response?.data?.Title ??
        "GENERIC_ERROR";
      showAlert({ type: 'error', message: t(errorCode) });
    } finally {
      setTimeout(() => {
        setDeleting(false);
      }, 500);
    }
  };

  const handleSelect = (info: any) => {
    if (info.start.getDay() != info.end.getDay()) {
      return;
    }
    setSelectedRange({ start: info.startStr, end: info.endStr, dayOfWeek: info.start.getDay() });
    setAddTimeModalOpen(true);
  };

  const handleAddWorkingHours = async () => {
    if (!selectedRange) return;
    setAdding(true);
    try {
      const payload = {
        startTime: selectedRange?.start,
        endTime: selectedRange?.end,
      };
      await post.createNewWorkingHours(payload);

      showAlert({ type: 'success', message: t('doctorCalendar.addWorkingHoursSuccess') });

      await fetchDoctorWorkingHours(currentWeekStart);
      setSelectedRange(null);
      setAddTimeModalOpen(false);
    } catch (err: any) {
      console.error(err);
      let errorCode = err.response?.data?.title ??
        err.response?.data?.Title ?? // PascalCase
        "GENERIC_ERROR";
      showAlert({ type: 'error', message: t(errorCode) });
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 500);
    }
  };

  const goToAppointment = () => {
    setOpenModal(false);
    const info: User = {
      id: selectedAppointment?.user.id!,
      name: selectedAppointment?.user.name!,
      surname: selectedAppointment?.user.surname!,
      email: selectedAppointment?.user.email!,
      phoneNumber: selectedAppointment?.user.phoneNumber!,
    }
    navigate(`/receptionist/appointment`, { state: { user: info as User } });
  };

  const cancelAppointment = async () => {
    if (!selectedAppointment) return;
    if (selectedAppointment.status === "Cancelled" || selectedAppointment.status === "Anulowana") {
      showAlert({ type: "error", message: t("userAppointments.alreadyCancelled") });
      return;
    }
    if (selectedAppointment.status === "Completed" || selectedAppointment.status === "Zakończona") {
      showAlert({ type: "error", message: t("userAppointments.alreadyCompleted") });
      return;
    }
    setOpenDetailDialog(false);
    setCancelationModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box sx={{ flex: 1, p: 4, color: colors.white }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
              {t("doctorCalendar.title")}
            </Typography>
            <Typography gutterBottom sx={{ color: colors.white }}>
              {t("doctorCalendar.subtitle")}
            </Typography>
          </Box>
          <Button onClick={() => setDrawerOpen(true)} variant="contained" sx={{ backgroundColor: colors.color3, color: colors.white, textTransform: 'none', ":hover": { backgroundColor: colors.color4 } }}>
            {t("receptionistCalendar.options")}
          </Button>
        </Box>


        {loading ? (
          <CircularProgress sx={{ color: colors.color5 }} />
        ) : (
          <Box sx={{ backgroundColor: colors.pureWhite, color: colors.black, borderRadius: 3, p: 2 }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              allDaySlot={false}
              selectable={true}
              timeZone="local"
              select={handleSelect}
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
                      {arg.event.extendedProps.description}
                    </div>
                  </div>
                );
              }}
              eventDidMount={(info) => {
                if (info.event.extendedProps.type === 'workingHours') {
                  return;
                }
                const appointment = info.event.extendedProps as Appointment;
                const tooltipText = `${appointment.status}\nPacjent: ${appointment.user.name} ${appointment.user.surname}\nEmail: ${appointment.user.email}\nTelefon: ${appointment.user.phoneNumber ?? ''}`;
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
                center: "title",
                right: "prev next"
              }}
              datesSet={(dateInfo) => {
                const startDateObj = new Date(dateInfo.start);
                startDateObj.setDate(startDateObj.getDate() + 1);
                const startDate = startDateObj.toISOString();
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
              width: 300,
              p: 4,
            },
          }}
        >
          <DialogTitle>
            <Typography component="h2" variant="h6" sx={{ color: colors.color5, mb: 2 }}>
              {t("doctorCalendar.removeConfirm")}
            </Typography>
          </DialogTitle>
          <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
              sx={{ borderColor: colors.color3, color: colors.white }}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={deleting}
              sx={{ backgroundColor: colors.color3, color: colors.white }}
            >
              {t("yes")}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={addTimeModalOpen}
          onClose={() => setAddTimeModalOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: colors.color2,
              color: colors.white,
              borderRadius: 3,
              width: 300,
              p: 4,
            },
          }}
        >
          <DialogTitle>
            <Typography component="h2" variant="h6" sx={{ color: colors.color5, mb: 2 }}>
              {t("doctorCalendar.addConfirm")}
            </Typography>
          </DialogTitle>
          <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setAddTimeModalOpen(false)}
              sx={{ borderColor: colors.color3, color: colors.white }}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleAddWorkingHours}
              disabled={adding}
              sx={{ backgroundColor: colors.color3, color: colors.white }}
            >
              {t("yes")}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
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
              selectedAppointmentDetail={selectedAppointment}
            />
          )}
          <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenDetailDialog(false);
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
          open={cancelationModalOpen}
          onClose={() => setCancelationModalOpen(false)}
          appointmentGuid={selectedAppointment?.appointmentGroupId || null}
          onSuccess={() => {
            setCancelationModalOpen(false);
            setOpenDetailDialog(false);
            fetchAppointments(currentWeekStart, showCancelled, showCompleted);
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
              <Typography variant="body2" sx={{ color: colors.color1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'gray' }} />
                - {t("receptionistCalendar.legend.cancelled")}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.color1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'green' }} />
                - {t("receptionistCalendar.legend.completed")}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.color1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3788D8' }} />
                - {t("receptionistCalendar.legend.scheduled")}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.color1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(14, 172, 0, 0.5)' }} />
                - {t("doctorCalendar.workingHours")}
              </Typography>
            </Box>
            <Box sx={{ mt: 4, borderTop: `1px solid ${colors.color3}`, pt: 2 }}></Box>
            <Typography variant="h6" sx={{ color: colors.color5, mb: 2 }}>
              {t("receptionistCalendar.filters")}
            </Typography>
            <FormControlLabel
              control={<Switch checked={showCancelled} onChange={async (e) => {
                var newValue = e.target.checked;
                setShowCancelled(newValue);
                await fetchAppointments(currentWeekStart, newValue, showCompleted);
              }} />}
              label={t("receptionistCalendar.showCancelled")}
              sx={{ color: colors.white }}
            />
            <FormControlLabel
              control={<Switch checked={showCompleted} onChange={async (e) => {
                var newValue = e.target.checked;
                setShowCompleted(newValue);
                await fetchAppointments(currentWeekStart, showCancelled, newValue);
              }} />}
              label={t("receptionistCalendar.showCompleted")}
              sx={{ color: colors.white }}
            />
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default DoctorCalendar;
