export const formatMessageDate = (date: string) =>
  new Date(date).toTimeString().slice(0, 5);
