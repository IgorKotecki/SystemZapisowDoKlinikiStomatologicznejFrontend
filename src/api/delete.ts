import api from "./axios";

export const deleteService = async (serviceId: any) => {
    const response = await api.delete(`/api/Service/service/${serviceId}`) ;
    return response.data;
}

export default {
    deleteService,
};