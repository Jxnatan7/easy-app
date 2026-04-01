import {
  RestyleTouchableOpacity,
  RestyleTouchableOpacityProps,
} from "@/components/restyle";

export type ChipProps = RestyleTouchableOpacityProps;

export const Chip = ({ children, ...props }: ChipProps) => {
  return (
    <RestyleTouchableOpacity variant="chip" {...props}>
      {children}
    </RestyleTouchableOpacity>
  );
};
