import { globalCss, HopeThemeConfig } from "@hope-ui/solid";

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
    Input: {
      baseStyle: {
        input: {
          _focus: {
            boxShadow: "unset",
          },
        },
      },
      defaultProps: {
        input: {
          variant: "filled"
        }
      }
    },
  },
};

export const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
  },
  "#root": {
    height: "$full",
  },
});

export default theme;
