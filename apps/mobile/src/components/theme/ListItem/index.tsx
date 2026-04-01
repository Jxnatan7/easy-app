import {
  RestyleTouchableOpacity,
  RestyleTouchableOpacityProps,
} from "@/components/restyle";
import { ListItemIcon } from "../ListItemIcon";
import { ListItemInfo } from "../ListItemInfo";
export type ListItemProps = RestyleTouchableOpacityProps & {
  title: string;
  subtitle: string;
  hideIcon?: boolean;
  hideBorder?: boolean;
};

export const ListItem = ({
  title,
  hideIcon = false,
  hideBorder = false,
  subtitle,
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
      {...props}
    >
      {!hideIcon && <ListItemIcon />}
      <ListItemInfo title={title} subtitle={subtitle} />
    </RestyleTouchableOpacity>
  );
};
