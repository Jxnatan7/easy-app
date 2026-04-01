import { Box, Text } from "@/components/restyle";

export const ListItemInfo = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string | React.ReactNode;
}) => {
  return (
    <Box flex={1} flexDirection="column" gap="s">
      <Text variant="listItemTitle">{title}</Text>
      {typeof subtitle === "string" ? (
        <Text variant="infoSubtitle">{subtitle}</Text>
      ) : (
        subtitle
      )}
    </Box>
  );
};
