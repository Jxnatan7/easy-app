import { Box, Text } from "@/components/restyle";
import { formatMessageDate } from "@/theme/utils/dateFormat";

export type MessageProps = {
  content: string;
  timestamp: string;
  isMyMessage: boolean;
};

export const Message = ({
  content = "Message default",
  timestamp = "14:25",
  isMyMessage = false,
}: MessageProps) => {
  return (
    <Box
      minHeight={60}
      maxWidth="90%"
      backgroundColor={
        isMyMessage ? "myMessageBackground" : "otherMessageBackground"
      }
      borderBottomLeftRadius={isMyMessage ? 16 : 0}
      borderBottomRightRadius={isMyMessage ? 0 : 16}
      borderTopLeftRadius={16}
      borderTopRightRadius={16}
      mb="m"
      padding="m"
      flexDirection="column"
      justifyContent="center"
      alignSelf={isMyMessage ? "flex-end" : "flex-start"}
      gap="s"
    >
      <Text
        flexWrap="wrap"
        variant="message"
        color={isMyMessage ? "myMessageColor" : "otherMessageColor"}
      >
        {content}
      </Text>
      <Text
        flexWrap="wrap"
        variant="messageTime"
        color={isMyMessage ? "myMessageColor" : "otherMessageColor"}
        alignSelf={isMyMessage ? "flex-end" : "flex-start"}
      >
        {formatMessageDate(timestamp)}
      </Text>
    </Box>
  );
};
