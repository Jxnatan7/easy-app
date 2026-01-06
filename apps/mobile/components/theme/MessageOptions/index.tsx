import { RestyleFlashListProps, Text } from "@/components/restyle";
import { FlashList } from "../FlashList";
import { MessageOption } from "../MessageOption";
import { Dispatch } from "react";

export type MessageOptionsProps = Partial<RestyleFlashListProps> & {
  messageSelected?: string;
  setMessageSelected: Dispatch<React.SetStateAction<string | undefined>>;
};

const options = [
  "Oi, tudo bem? Como você está?",
  "Opa, tudo certo por aí?",
  "Olá! Como vai o seu dia?",
  "Oi! Tudo joia?",
  "E aí, como estão as coisas?",
  "Opa, tudo bem? Passando para dar um oi.",
  "Oi, tudo certinho?",
  "Olá! Como você tem passado?",
  "E aí, tudo na paz?",
  "Oi! Como vai essa força?",
];

export const MessageOptions = ({
  messageSelected,
  setMessageSelected,
  ...props
}: MessageOptionsProps) => {
  return (
    <>
      <Text maxWidth={450} width="100%" textAlign="left" variant="label" mb="s">
        Sugestões:
      </Text>
      <FlashList
        keyExtractor={(item, index) => index.toString()}
        variant="messageOptions"
        data={options}
        renderItem={({ item }: any) => (
          <MessageOption
            option={item}
            setMessageSelected={setMessageSelected}
            disabled={item === messageSelected}
          />
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        marginBottom="s"
        {...props}
      />
    </>
  );
};
