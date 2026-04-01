import axiosClient from "@/api/axiosClient";

const CommunicationRequestService = {
  async listByUserId(userId: string, filterRequest: any) {
    const { data } = await axiosClient.post(
      `/communication-requests/search/${userId}`,
      filterRequest
    );
    return data;
  },

  async validate(id: string, status: string) {
    const { data } = await axiosClient.post(
      `/communication-requests/${id}/validate`,
      { status }
    );
    return data;
  },

  async create(payload: any) {
    const { data } = await axiosClient.post("/communication-requests", payload);
    return data;
  },
};

export default CommunicationRequestService;
