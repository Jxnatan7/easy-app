import { useRouter } from "expo-router";
import { EmptyList } from "../EmptyList";

export type CommunicationRequestListEmptyProps = {
  text?: string;
  showRedirect?: boolean;
};

export const CommunicationRequestListEmpty = ({
  text = "",
  showRedirect = true,
}: CommunicationRequestListEmptyProps) => {
  const { push } = useRouter();

  return <EmptyList text={text} />;
};
