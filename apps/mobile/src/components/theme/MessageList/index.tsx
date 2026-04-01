import { RestyleFlashListProps } from "@/components/restyle";
import { FlashList } from "../FlashList";

export type MessageListProps = RestyleFlashListProps;

export const MessageList = ({ ...props }: MessageListProps) => {
  return <FlashList {...props} variant="messages" />;
};
