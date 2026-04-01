import { createTheme } from "@shopify/restyle";
import pallete from "./pallete";

const lightColors = {
  ...pallete,
  mainBackground: pallete.backgroundLight,
  mainTitle: pallete.titleLight,
  mainText: pallete.textLight,
  buttonBackground: pallete.buttonBackgroundLight,
  inputBackground: pallete.inputBackgroundLight,
  inputText: pallete.inputTextLight,
  backgroundGradient0: pallete.gradientLight0,
  backgroundGradient1: pallete.gradientLight1,
  myMessageBackground: pallete.buttonBackgroundLight,
};

const darkColors: typeof lightColors = {
  ...pallete,
  mainBackground: pallete.backgroundDark,
  mainTitle: pallete.titleDark,
  mainText: pallete.textDark,
  buttonBackground: pallete.buttonBackgroundDark,
  inputBackground: pallete.inputBackgroundDark,
  inputText: pallete.inputTextDark,
  backgroundGradient0: pallete.gradientDark0,
  backgroundGradient1: pallete.gradientDark1,
  myMessageBackground: pallete.buttonBackgroundDark,
};

const theme = createTheme({
  breakpoints: {
    smallPhone: 0,
    phone: 400,
    tablet: 768,
    desktop: 1024,
  },
  colors: lightColors,
  spacing: {
    none: 0,
    xs: 4,
    s: 6,
    m: 16,
    l: 24,
    xl: 40,
    xxl: 64,
    xxxl: 80,
    xxxxl: 120,
  },
  imageVariants: {
    default: {
      width: 40,
      height: 40,
    },
    defaults: {
      width: 40,
      height: 40,
    },
    init: {
      width: 262,
      height: 271,
      marginTop: {
        smallPhone: 0,
        phone: "xxxxl",
      },
    },
  },
  containerVariants: {
    chip: {
      maxWidth: 300,
      height: 40,
      p: "s",
      borderRadius: 4,
      backgroundColor: "mainBackground",
    },
    defaults: {
      flex: 1,
      p: "m",
      pt: "xl",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    chat: {
      flex: 1,
      px: "l",
      pt: "xl",
      pb: "none",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    screen: {
      flex: 1,
      p: "m",
      pt: "xl",
      alignItems: "center",
      backgroundColor: "transparent",
    },
  },
  boxVariants: {
    screen: {
      flex: 1,
      backgroundColor: "mainBackground",
    },
  },
  pressableVariants: {
    input: {
      fontFamily: "MulishFont",
      backgroundColor: "inputBackgroundLight",
      color: "inputBackground",
      flex: 1,
      width: "100%",
      minHeight: 40,
      borderRadius: 6,
      p: "s",
      fontSize: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "s",
    },
    transparent: {
      backgroundColor: "transparent",
    },
    chip: {
      maxWidth: 400,
      alignItems: "center",
      justifyContent: "center",
      p: "s",
      borderRadius: 4,
      backgroundColor: "mainBackground",
      mr: "s",
    },
    default: {
      backgroundColor: "buttonBackgroundLight",
    },
    defaults: {
      backgroundColor: "buttonBackgroundLight",
    },
  },
  buttonVariants: {
    red: {
      backgroundColor: "finish",
      color: "buttonTextLight",
    },
    transparent: {
      backgroundColor: "transparent",
      color: "buttonTextGray",
    },
    chipDisabled: {
      width: 350,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      p: "s",
      borderRadius: 4,
      backgroundColor: "backgroundGrayLight",
      mr: "s",
      opacity: 0.5,
      color: "buttonTextLight",
    },
    chip: {
      width: 270,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      p: "xs",
      borderRadius: 4,
      backgroundColor: "backgroundGrayLight",
      color: "buttonTextLight",
      mr: "s",
    },
    icon: {
      backgroundColor: "transparent",
      color: "buttonTextLight",
      alignItems: "center",
      justifyContent: "center",
      width: 50,
      height: 50,
    },
    default: {
      backgroundColor: "buttonGradientPrimary1",
      color: "buttonTextLight",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 30,
      width: "85%",
      maxWidth: 450,
      height: {
        smallPhone: 50,
        phone: 60,
      },
    },
    defaults: {
      backgroundColor: "buttonBackgroundLight",
      color: "buttonTextLight",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 30,
      width: "85%",
      maxWidth: 450,
      height: {
        smallPhone: 50,
        phone: 60,
      },
    },
    primary: {
      backgroundColor: "buttonGradientPrimary1",
      color: "buttonTextLight",
      borderRadius: 30,
    },
    secondary: {
      backgroundColor: "buttonGradientSecondary1",
      color: "buttonTextDark",
      borderRadius: 30,
    },
    cameraOption: {
      width: {
        smallPhone: 40,
        phone: 50,
      },
      height: {
        smallPhone: 40,
        phone: 50,
      },
      borderRadius: 10,
      backgroundColor: "transparent",
      color: "buttonTextGray",
      borderWidth: 2,
      borderColor: "buttonBackgroundGray",
    },
  },
  textVariants: {
    "label-error": {
      width: "100%",
      fontFamily: "MulishFont",
      fontSize: 14,
      color: "error",
    },
    label: {
      color: "mainText",
      fontFamily: "MulishFontMedium",
      fontSize: 14,
    },
    header2: {
      color: "mainText",
      fontFamily: "MulishFontMedium",
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
    },
    messageTime: {
      fontFamily: "MulishFontMedium",
      fontSize: 12,
    },
    message: {
      fontFamily: "MulishFontMedium",
      fontSize: 16,
      lineHeight: 24,
    },
    containerHeader: {
      color: "mainText",
      fontFamily: "MulishFontBold",
      fontSize: 24,
    },
    button: {
      fontFamily: "MulishFontMedium",
      fontSize: {
        smallPhone: 16,
        phone: 18,
      },
      color: "buttonTextLight",
    },
    header: {
      color: "mainText",
      fontFamily: "MulishFontBold",
      fontSize: {
        smallPhone: 20,
        phone: 30,
      },
      textAlign: "center",
    },
    "sub-header": {
      color: "mainText",
      fontFamily: "MulishFontBold",
      fontSize: {
        smallPhone: 18,
        phone: 24,
      },
      textAlign: "center",
    },
    body: {
      fontFamily: "MulishFontMedium",
      color: "mainText",
      fontSize: {
        smallPhone: 14,
        phone: 16,
      },
      lineHeight: 24,
    },
    messageOption: {
      fontFamily: "MulishFontMedium",
      color: "textLight",
      fontSize: {
        smallPhone: 14,
        phone: 16,
      },
      lineHeight: 24,
    },
    defaults: {},
    infoTitle: {
      color: "mainText",
      fontFamily: "MulishFontBold",
      fontSize: 16,
    },
    listItemTitle: {
      color: "textLight",
      fontFamily: "MulishFontBold",
      fontSize: 16,
    },
    infoSubtitle: {
      fontFamily: "MulishFont",
      fontSize: 14,
      color: "textGray",
    },
  },
  textInputVariants: {
    iconRigth: {
      fontFamily: "MulishFont",
      backgroundColor: "inputBackgroundLight",
      color: "inputTextLight",
      flex: 1,
      height: 40,
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      p: "s",
      maxWidth: 450,
      fontSize: 16,
    },
    iconLeft: {
      fontFamily: "MulishFont",
      backgroundColor: "inputBackgroundLight",
      color: "inputTextLight",
      flex: 1,
      height: 40,
      maxWidth: 450,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 6,
      borderTopRightRadius: 6,
      p: "s",
      fontSize: 16,
    },
    default: {
      fontFamily: "MulishFontMedium",
      backgroundColor: "inputBackgroundLight",
      color: "inputTextLight",
      flex: 1,
      maxWidth: 450,
      height: 40,
      borderRadius: 6,
      p: "s",
      fontSize: 16,
    },
    primary: {
      fontFamily: "MulishFont",

      backgroundColor: "inputBackgroundLight",
      color: "inputTextLight",
    },
    secondary: {
      fontFamily: "MulishFont",

      backgroundColor: "inputBackgroundDark",
      color: "inputTextDark",
    },
    code: {
      fontFamily: "MulishFontBold",
      backgroundColor: "inputBackgroundLight",
      color: "inputText",
      width: {
        smallPhone: 30,
        phone: 35,
        desktop: 40,
      },
      height: {
        smallPhone: 30,
        phone: 35,
        desktop: 40,
      },
      borderRadius: "50%",
      textAlign: "center",
      fontSize: 40,
    },
  },
  flashListVariants: {
    messages: {
      backgroundColor: "transparent",
      width: "100%",
      maxHeight: 800,
    },
    defaults: {
      backgroundColor: "backgroundLight",
      width: "100%",
      maxWidth: 450,
      maxHeight: 800,
    },
    messageOptions: {
      width: "100%",
      backgroundColor: "transparent",
      height: 40,
      maxHeight: 40,
    },
  },
  cameraVariants: {
    defaults: {
      width: 40,
      height: 40,
    },
    code: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
  },
  buttonGradients: {
    primary: ["buttonGradientPrimary0", "buttonGradientPrimary1"],
    secondary: ["buttonGradientSecondary0", "buttonGradientSecondary1"],
    red: ["finish", "finish"],
    default: ["gradientLight0", "gradientLight1"],
    transparent: ["transparent", "transparent"],
  },
});

export type Theme = typeof theme;

export const darkTheme: Theme = {
  ...theme,
  colors: darkColors,
};

export default theme;
