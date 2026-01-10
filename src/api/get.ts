import api from "./axios";

export const getUserAppointments = async (lang: string) => {
  const response = await api.get(`/api/Appointment/registered/appointments?lang=${lang}`);
  return response.data;
}

export const getDoctorAppointments = async (lang: string, date: string) => {
  const response = await api.get(`/api/Appointment/doctor/appointments?lang=${lang}&date=${date}`);
  return response.data;
}

export const getAdditionalInformation = async (lang: string) => {
  const response = await api.get(`/api/Appointment/doctor/additional-information?lang=${lang}`);
  return response.data;
}

export const getDoctorWeekSchedule = async () => {
  const response = await api.get(`/api/Doctor/week-scheme`);
  return response.data;
}

export const getDoctors = async () => {
  const response = await api.get(`/api/Doctor`);
  return response.data;
}

export const getUserServices = async (lang: string) => {
  const response = await api.get(`/api/Service/user-services?lang=${lang}`);
  return response.data;
}

export const getAllServices = async (lang: string) => {
  const response = await api.get(`/api/Service/services?lang=${lang}`);
  return response.data;
}

export const getTeamMembers = async () => {
  const response = await api.get(`/api/Team/members`);
  return response.data;
}

export const getTimeBlocks = async (doctorId: number, date: Date) => {
  const response = await api.get(`/api/time-blocks/${doctorId}`, {
    params: {
      Year: date.getFullYear(),
      Month: date.getMonth() + 1,
      Day: date.getDate(),
    },
  });
  console.log(response.data);

  return response.data;
}

export const getTeethModel = async (userId: number, lang: string) => {
  const response = await api.get(`/api/Tooth/teeth-model?userId=${userId}&&lang=${lang}`);
  return response.data['teeth'];
}

export const getToothStatuses = async (lang: string) => {
  const response = await api.get(`/api/Tooth/statuses?lang=${lang}`);
  return response.data['statusesByCategories'];
}

export const getUserDetails = async () => {
  const response = await api.get(`/api/User`);
  return response.data;
}

export const getUserById = async (userId: number) => {
  const response = await api.get(`/api/User/${userId}`);
  return response.data;
}

export const getAppointmentsForRecepcionist = async (lang: string, date: string) => {
  const response = await api.get(`/api/Appointment/receptionist/appointments?lang=${lang}&date=${date}`);
  return response.data;
}

export const getReceptionistServices = async (lang: string) => {
  const response = await api.get(`/api/Service/receptionist-services?lang=${lang}`);
  return response.data;
}
export const getAllUsers = async () => {
  const response = await api.get(`/api/User/all-users`);
  return response.data;
}

export const getCloudinarySignature = async () => {
  const response = await api.get(`/api/Cloudinary/signature`);
  return response.data;
}

export const getServiceById = async (serviceId: number) => {
  const response = await api.get(`/api/Service/edit/${serviceId}`);
  return response.data;
}

export const getServiceCategories = async () => {
  const response = await api.get(`/api/Service/serviceCategories`);
  return response.data;
}
export const getDoctorWorkingHours = async (date: string) => {
  const response = await api.get(`/api/time-blocks/working-hours`, {
    params: {
      date: date,
    },
  });
  return response.data;
}

export default {
  getUserAppointments,
  getDoctorAppointments,
  getAdditionalInformation,
  getDoctorWeekSchedule,
  getDoctors,
  getUserServices,
  getAllServices,
  getTeamMembers,
  getTimeBlocks,
  getTeethModel,
  getToothStatuses,
  getUserDetails,
  getAppointmentsForRecepcionist,
  getReceptionistServices,
  getAllUsers,
  getCloudinarySignature,
  getServiceById,
  getServiceCategories,
  getDoctorWorkingHours,
  getUserById,
};