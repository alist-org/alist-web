import { HopeThemeConfig } from "@hope-ui/solid";

const theme: HopeThemeConfig = {
  initialColorMode: "system",
  components: {
    Button: {
      baseStyle: {
        root: {
          _active: {
            transform: "scale(.95)",
            transition: "0.2s",
          },
          _focus: {
            boxShadow: "unset",
          },
        },
      },
      defaultProps: {
        root: {
          colorScheme: "info",
          variant: "subtle",
        },
      },
    },
  },
};

export default theme;
