import { Box, Text } from "@/components/restyle";

export type EmptyListProps = {
  text?: string;
};

export const EmptyList = ({
  text = "Você ainda não possui um gerenciador e uma residência cadastrada, que tal criar uma?",
}: EmptyListProps) => {
  return (
    <Box style={{ backgroundColor: "transparent" }}>
      <Text textAlign="center" variant="infoTitle">
        {text}
      </Text>
    </Box>
  );
};
