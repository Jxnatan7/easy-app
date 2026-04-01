import {
  RestyleTouchableOpacity,
  RestyleTouchableOpacityProps,
} from "@/components/restyle";

export type IconButtonProps = {
  icon: React.ReactNode;
} & RestyleTouchableOpacityProps;

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
  return (
    <RestyleTouchableOpacity variant="icon" {...props}>
      {icon}
    </RestyleTouchableOpacity>
  );
};
