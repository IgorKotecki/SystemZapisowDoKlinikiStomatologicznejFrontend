import type { ApiDaySchedule } from "../Interfaces/ApiDaySchedule";
import type { CalendarDaySchedule } from "../Interfaces/CalendarDaySchedule";
import { formatISO, startOfWeek, addDays, setHours, setMinutes } from "date-fns";
import { colors } from "../utils/colors";
import type { IDoctorAppointment } from "../Interfaces/IDoctorAppointment";
import type { Appointment } from "../Interfaces/Appointment";

export class CalendarMapper {
  static ApiDayScheduletoCalendar(apiData: ApiDaySchedule[]): CalendarDaySchedule[] {
    return apiData.map(e => ({
      dayOfWeek: e.dayOfWeek.toString(),
      start: `1970-01-01T${e.startHour}`,
      end: `1970-01-01T${e.endHour}`,
    }));
  }

  static CalendarDayScheduletoApi(calendarData: CalendarDaySchedule[]): ApiDaySchedule[] {
    return calendarData.map(e => ({
      dayOfWeek: Number(e.dayOfWeek),
      startHour: e.start.slice(11, 16) + ":00",
      endHour: e.end.slice(11, 16) + ":00",
    }));
  }

  static DayScheduletoEvents(daySchedule: CalendarDaySchedule[], t: (key: string) => string) {
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
        backgroundColor: colors.greenTooth,
        borderColor: colors.claenderBorder,
        textColor: colors.white,
      };
    });
  }
  private static ApiAppointmentToDoctorAppointment(apiAppointment: Appointment): IDoctorAppointment {
    return {
      id: apiAppointment.appointmentGroupId,
      patientId: apiAppointment.user.id,
      patientFirstName: apiAppointment.user.name,
      patientLastName: apiAppointment.user.surname,
      services: apiAppointment.services,
      date: apiAppointment.startTime.split("T")[0],
      timeStart: apiAppointment.startTime.split("T")[1],
      timeEnd: apiAppointment.endTime.split("T")[1],
      patientEmail: apiAppointment.user.email,
      patientPhoneNumber: apiAppointment.user.phoneNumber,
      additionalInformation: apiAppointment.additionalInformation,
      status: apiAppointment.status,
      doctor: apiAppointment.doctor,
      cancellationReason: apiAppointment.cancellationReason,
      notes: apiAppointment.notes,
    };
  }

  public static DoctorAppointmentToApiAppointment(doctorAppointment: IDoctorAppointment): Appointment {
    return {
      appointmentGroupId: doctorAppointment.id,
      user: {
        id: doctorAppointment.patientId,
        name: doctorAppointment.patientFirstName,
        surname: doctorAppointment.patientLastName,
        email: doctorAppointment.patientEmail,
        phoneNumber: doctorAppointment.patientPhoneNumber,
      },
      startTime: `${doctorAppointment.date}T${doctorAppointment.timeStart}`,
      endTime: `${doctorAppointment.date}T${doctorAppointment.timeEnd}`,
      doctor: doctorAppointment.doctor,
      services: doctorAppointment.services,
      status: doctorAppointment.status,
      additionalInformation: doctorAppointment.additionalInformation,
      cancellationReason: doctorAppointment.cancellationReason,
      notes: doctorAppointment.notes,
    };
  }

  static ApiAppointmentsToDoctorAppointments(apiAppointments: Appointment[]): IDoctorAppointment[] {
    return apiAppointments.map(appointment => this.ApiAppointmentToDoctorAppointment(appointment));
  }
}