import type { ApiDaySchedule } from "../Interfaces/ApiDaySchedule";
import type { CalendarDaySchedule } from "../Interfaces/CalendarDaySchedule";
import { formatISO, startOfWeek, addDays, setHours, setMinutes } from "date-fns";

export class CalendarMapper {
    static toCalendar(apiData: ApiDaySchedule[]): CalendarDaySchedule[] {
        return apiData.map(e => ({
            dayOfWeek: e.dayOfWeek.toString(),
            start: `1970-01-01T${e.startHour}`,
            end: `1970-01-01T${e.endHour}`,
        }));
    }

    static toApi(calendarData: CalendarDaySchedule[]): ApiDaySchedule[] {
        return calendarData.map(e => ({
            dayOfWeek: Number(e.dayOfWeek),
            startHour: e.start.slice(11, 16),
            endHour: e.end.slice(11, 16),
        }));
    }

    static toEvents(daySchedule: CalendarDaySchedule[], t: (key: string) => string) {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); 

    return daySchedule.map(f => {
      const dayOffset = Number(f.dayOfWeek); 
      const date = addDays(weekStart, dayOffset);

      const [startHour, startMinute] = f.start.slice(11, 16).split(":").map(Number);
      const [endHour, endMinute] = f.end.slice(11, 16).split(":").map(Number);

      const startDate = setMinutes(setHours(date, startHour), startMinute);
      const endDate = setMinutes(setHours(date, endHour), endMinute);

      return {
        id: f.dayOfWeek.toString(),
        title: t("doctorDaySchedule.scheduledTime"),
        start: formatISO(startDate),
        end: formatISO(endDate),
        backgroundColor: "#4caf50",
        borderColor: "#388e3c",
        textColor: "#fff",
      };
    });
  }
}