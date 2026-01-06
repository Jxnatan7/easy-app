import {
  Box,
  RestyleTouchableOpacity,
  RestyleTouchableOpacityProps,
  Text,
} from "@/components/restyle";
import { ListItemIcon } from "../ListItemIcon";
import { ListItemInfo } from "../ListItemInfo";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import { formatMessageDate } from "@/utils/dateFormat";
export type ListItemProps = RestyleTouchableOpacityProps & {
  item: any;
  hideIcon?: boolean;
  hideBorder?: boolean;
  status: string;
};

export const CommunicationRequestItemMessage = ({
  subtitle,
  messageTime,
}: {
  subtitle: string;
  messageTime: string;
}) => {
  return (
    <Box width="100%" flexDirection="row" gap="s">
      <Text flex={1} variant="infoSubtitle">
        {subtitle}
      </Text>
      <Text variant="infoSubtitle">{formatMessageDate(messageTime)}</Text>
    </Box>
  );
};

export const CommunicationRequestItem = ({
  item,
  hideIcon = false,
  hideBorder = false,
  status,
  ...props
}: ListItemProps) => {
  return (
    <RestyleTouchableOpacity
      width="100%"
      height={90}
      backgroundColor="backgroundLight"
      padding="m"
      borderBottomColor="borderGray"
      borderBottomWidth={hideBorder ? 0 : 1}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      gap="m"
      marginBottom="s"
      borderRadius={10}
      {...props}
    >
      {!hideIcon && (
        <ListItemIcon
          icon={
            <Ionicons
              name="chatbox-ellipses"
              size={35}
              color={
                status === "PENDING"
                  ? theme.colors.pending
                  : status === "ACCEPTED"
                    ? theme.colors.accepted
                    : theme.colors.rejected
              }
            />
          }
        />
      )}
      <ListItemInfo
        title={item.visitorName}
        subtitle={
          <CommunicationRequestItemMessage
            subtitle={item.initialMessage}
            messageTime={item.createdAt}
          />
        }
      />
    </RestyleTouchableOpacity>
  );
};
