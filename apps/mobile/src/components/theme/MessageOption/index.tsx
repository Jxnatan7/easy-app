import { RestyleTouchableOpacityProps, Text } from "@/components/restyle";
import { Chip } from "../Chip";
import { Dispatch } from "react";

export type MessageOptionProps = RestyleTouchableOpacityProps & {
  option: string;
  setMessageSelected: Dispatch<React.SetStateAction<string | undefined>>;
};

export const MessageOption = ({
  option,
  setMessageSelected,
  disabled,
  ...props
}: MessageOptionProps) => {
  return (
    <Chip
      {...props}
      onPress={() => setMessageSelected(option)}
      disabled={disabled}
      variant={disabled ? "chipDisabled" : "chip"}
    >
      <Text variant="messageOption" numberOfLines={1}>
        {option}
      </Text>
    </Chip>
  );
};
