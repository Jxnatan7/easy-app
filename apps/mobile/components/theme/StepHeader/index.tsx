import { Text, TextProps } from "@/components/restyle";

export const StepHeader = ({
  title = "",
  titleProps,
  subtitle = "",
  subtitleProps,
}: {
  title: string;
  titleProps?: TextProps;
  subtitle?: string;
  subtitleProps?: TextProps;
}) => {
  return (
    <>
      <Text
        variant="header"
        mt={{ smallPhone: "l", phone: "xxxl" }}
        {...titleProps}
      >
        {title}
      </Text>
      <Text
        variant="header2"
        mt="m"
        px="xl"
        mb={{ smallPhone: "xl", phone: "xxl" }}
        {...subtitleProps}
      >
        {subtitle}
      </Text>
    </>
  );
};
