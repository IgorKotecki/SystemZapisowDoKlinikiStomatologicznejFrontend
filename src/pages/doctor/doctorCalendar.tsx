import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  DialogTitle,
  DialogActions,
  Button,
  Dialog,
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
import { set } from "date-fns";

const DoctorCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(new Date().toISOString());
  const [openModal, setOpenModal] = useState(false);
  const calendarRef = React.useRef<FullCalendar>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [workingDay, setWorkingDay] = useState<Date | null>(null);

  useEffect(() => {
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

    const fetchAppointments = async (date: string) => {
      try {
        const language = i18n.language;
        const response = await get.getDoctorAppointments(language, date);
        setAppointments(response);
        setLoading(false);
      } catch (err) {
        showAlert({ type: 'error', message: t('globalAlert.errorLoadingData') });
        console.error(err);
      }
    };

    fetchDoctorWorkingHours(currentWeekStart);
    fetchAppointments(currentWeekStart);
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
        extendedProps: {
          ...a,
          type: 'appointment'
        },
      })),
    ],
    [workingHours, appointments]
  );


  const handleEventClick = (info: any) => {
    if (info.event.extendedProps.type === 'appointment') {
      return;
    }
    setOpenModal(true);
    setWorkingDay(info.event.start);
  };
  const handleDelete = async () => {
    try {
      await deleteApi.deleteWorkingHours(workingDay!.toISOString());
      setOpenModal(false);
    } catch (err : any) {
      console.error(err);
      let errorCode = err.response?.data?.title ??
                err.response?.data?.Title ?? // PascalCase
                "GENERIC_ERROR";
      showAlert({ type: 'error', message: t(errorCode) });
    } finally {
      setWorkingDay(null);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box sx={{ flex: 1, p: 4, color: colors.white }}>
        <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
          {t("doctorCalendar.title")}
        </Typography>
        <Typography  gutterBottom sx={{ color: colors.white }}>
          {t("doctorCalendar.subtitle")}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ color: colors.color5 }} />
        ) : (
          <Box sx={{ backgroundColor: colors.white, color: colors.black, borderRadius: 3, p: 2 }}>
            <FullCalendar
              ref={calendarRef}
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
                      {arg.event.extendedProps.description}
                    </div>
                  </div>
                );
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
              {t("doctorFreeDays.removeConfirm")}
            </Typography>
          </DialogTitle>
          <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
              sx={{ borderColor: colors.color3, color: colors.white }}
            >
              {t("doctorFreeDays.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{ backgroundColor: colors.color3, color: colors.white }}
            >
              {t("yes")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DoctorCalendar;
