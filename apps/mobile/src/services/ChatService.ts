import axiosClient from "@/api/axiosClient";

const ChatService = {
  async getMessages(chatId: string) {
    const { data } = await axiosClient.post(`/messages/${chatId}`, {
      page: 1,
      pageSize: 100,
      sortDirection: "asc",
    });

    return data;
  },
};

export default ChatService;
