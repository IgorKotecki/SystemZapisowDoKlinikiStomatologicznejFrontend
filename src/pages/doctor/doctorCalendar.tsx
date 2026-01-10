import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
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

const DoctorCalendar: React.FC = () => {
  const { t } = useTranslation();
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchDoctorWorkingHours = async (date: string) => {
      try {
        const response = await get.getDoctorWorkingHours(date);
        setWorkingHours(response);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctorWorkingHours(currentWeekStart);
  }, [currentWeekStart, t]);

  const events = useMemo(
    () => workingHours.map((wh) => ({
      title: `${t("doctorCalendar.workingHours")}`,
      start: `${wh.startTime}`,
      end: `${wh.endTime}`,
      description: "",
      extendedProps: wh,
    })),
    [workingHours]
  );

  const handleEventClick = (info: any) => {
    
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
                  <div style={{ fontSize: '0.8em', lineHeight: '1.1em', overflow: 'hidden' , height: '100%' }}>
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
      </Box>
    </Box>
  );
};

export default DoctorCalendar;
