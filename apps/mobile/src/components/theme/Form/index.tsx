import React from "react";
import { Formik, FormikConfig, FormikValues, useFormikContext } from "formik";
import { Box, BoxProps, Text } from "@/components/restyle";
import { TextInput } from "@/components/theme/TextInput";
import Button from "@/components/theme/Button";

type FormProps<T extends FormikValues> = FormikConfig<T> & {
  children: React.ReactNode;
  containerProps?: BoxProps;
};

export function Form<T extends FormikValues>({
  children,
  containerProps,
  ...props
}: FormProps<T>) {
  return (
    <Formik {...props}>
      {() => (
        <Box width="100%" alignItems="center" {...containerProps}>
          {children}
        </Box>
      )}
    </Formik>
  );
}

type FormInputProps = React.ComponentProps<typeof TextInput> & {
  name: string;
};

export function FormTextInput({ name, ...rest }: FormInputProps) {
  const { handleChange, handleBlur, values, errors, touched, isSubmitting } =
    useFormikContext<any>();

  const errorMessage =
    touched[name] && errors[name] ? (errors[name] as string) : null;

  return (
    <>
      <TextInput
        value={values[name]}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        editable={!isSubmitting}
        {...rest}
      />
      {errorMessage && (
        <Text
          maxWidth={450}
          mt="s"
          variant="label-error"
          color="error"
          paddingHorizontal="m"
        >
          {errorMessage}
        </Text>
      )}
    </>
  );
}

type FormSubmitProps = React.ComponentProps<typeof Button> & {
  text: string;
};

export function FormButton({
  text,
  disabled,
  variant = "primary",
  ...rest
}: FormSubmitProps) {
  const { handleSubmit, isSubmitting } = useFormikContext();

  return (
    <Button
      variant={variant}
      text={text}
      onPress={() => handleSubmit()}
      disabled={isSubmitting || disabled}
      {...rest}
    />
  );
}
