import { useState, useMemo, useRef } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    CircularProgress,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import i18n from "../../i18n";
import enLocale from '@fullcalendar/core/locales/en-gb';
import plLocale from '@fullcalendar/core/locales/pl';
import type { CalendarDaySchedule as DaySchedule } from "../../Interfaces/CalendarDaySchedule";
import { CalendarMapper } from "../../mappers/CallenderMapper";
import { useEffect } from "react";
import { colors } from "../../utils/colors";
import get from "../../api/get";
import put from "../../api/put";

export default function DoctorDaySchedule() {
    const { t } = useTranslation();
    const [loading] = useState(false);
    const [daySchedule, setDaySchedule] = useState<DaySchedule[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRange, setSelectedRange] = useState<{ start: string; end: string, dayOfWeek: string } | null>(null);
    const calendarRef = useRef<any>(null);

    useEffect(() => {
        const fetchWeekScheme = async () => {
            try {
                const response = await get.getDoctorWeekSchedule();
                setDaySchedule(CalendarMapper.ApiDayScheduletoCalendar(response.daysSchemes));
            } catch (err) {
                console.error(err);
            }
        };
        fetchWeekScheme();
    }, []);


    const updateWeekScheme = async () => {
        const payload = {
            daysSchemes: CalendarMapper.CalendarDayScheduletoApi(daySchedule),
        };
        try {
            const response = await put.updateDoctorWeekSchedule(payload);

            console.log("Week scheme updated:", response);
        } catch (error: any) {
            console.error("Error updating week scheme:", error.response?.data || error.message);
        }
    };

    const events = useMemo(
        () => CalendarMapper.DayScheduletoEvents(daySchedule, t),
        [daySchedule, t]
    );

    useEffect(() => {
        if (!calendarRef.current) return;
        if (!events || events.length === 0) return;

        calendarRef.current.getApi().gotoDate(events[0].start);
    }, [events]);

    const handleSelect = (info: any) => {
        if (info.start.getDay() != info.end.getDay()) {
            return;
        }
        setSelectedRange({ start: info.startStr, end: info.endStr, dayOfWeek: info.start.getDay() });
        setOpenModal(true);
    };

    const handleAddFreeTime = () => {
        if (!selectedRange) return;
        const newEvent: DaySchedule = {
            dayOfWeek: selectedRange.dayOfWeek,
            start: selectedRange.start,
            end: selectedRange.end,
        };
        setDaySchedule([...daySchedule, newEvent]);
        setOpenModal(false);
        console.log(daySchedule);
    };

    const handleEventClick = (info: any) => {
        if (window.confirm(t("doctorDaySchedule.remove"))) {
            setDaySchedule((prev) => prev.filter((f) => f.dayOfWeek != info.event.id));
            console.log(info.event.id);
            console.log(daySchedule);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
            <UserNavigation />

            <Box sx={{ flex: 1, p: 4, color: colors.white }}>
                <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
                    {t("doctorDaySchedule.title")}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 3 }}>
                        {t("doctorDaySchedule.subtitle")}
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: colors.color3,
                            "&:hover": { backgroundColor: colors.color4 },
                        }}
                        onClick={updateWeekScheme}
                    >
                        {t("doctorDaySchedule.saveChanges")}
                    </Button>
                </Box>

                {loading ? (
                    <CircularProgress sx={{ color: colors.color5 }} />
                ) : (
                    <Box sx={{ backgroundColor: colors.white, color: colors.black, borderRadius: 3, p: 2 }}>
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            allDaySlot={false}
                            selectable={true}
                            select={handleSelect}
                            eventClick={handleEventClick}
                            events={events}
                            eventMouseEnter={(mouseEnterInfo) => {
                                mouseEnterInfo.el.style.cursor = 'pointer';
                            }}
                            eventMouseLeave={(mouseLeaveInfo) => {
                                mouseLeaveInfo.el.style.cursor = 'default';
                            }}
                            height="auto"
                            dayHeaderFormat={{ weekday: 'long' }}
                            locale={i18n.language === 'pl' ? plLocale : enLocale}
                            slotMinTime="08:00:00"
                            slotMaxTime="20:00:00"
                            slotLabelInterval={{ minutes: 30 }}
                            slotDuration="00:30:00"
                            slotLabelFormat={{ hour: 'numeric', minute: '2-digit' }}
                            hiddenDays={[0]}
                            headerToolbar={{
                                left: "",
                                center: "",
                                right: ""
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
                            {t("doctorDaySchedule.addScheduledTime")}
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
                            onClick={handleAddFreeTime}
                            sx={{ backgroundColor: colors.color3, color: colors.white }}
                        >
                            {t("doctorFreeDays.save")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
