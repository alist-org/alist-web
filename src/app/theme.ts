import { globalCss, HopeThemeConfig } from "@hope-ui/solid";

const theme: HopeThemeConfig = {
  initialColorMode: "system",
  components: {
    Button: {
      baseStyle: {
        root: {
          borderRadius: "0.5rem",
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
    IconButton: {
      defaultProps: {
        colorScheme: "info",
      },
    },
    Input: {
      baseStyle: {
        input: {
          borderRadius: "0.5rem",
          _focus: {
            boxShadow: "unset",
          },
        },
      },
      defaultProps: {
        input: {
          variant: "filled",
        },
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: "0.5rem",
        _focus: {
          boxShadow: "unset",
        },
      },
      defaultProps: {
        variant: "filled",
      },
    },
    Checkbox: {
      defaultProps: {
        root: {
          colorScheme: "info",
          variant: "filled",
        },
      },
    },
    Switch: {
      defaultProps: {
        root: {
          colorScheme: "info",
        },
      },
    },
    Menu: {
      baseStyle: {
        content: {
          borderRadius: "0.5rem",
          minW: "unset",
          border: "unset",
        },
        item: {
          borderRadius: "0.5rem",
        },
      },
    },
    Notification: {
      baseStyle: {
        root: {
          borderRadius: "0.5rem",
          border: "unset",
        },
      },
    },
    Alert: {
      baseStyle: {
        root: {
          borderRadius: "0.5rem",
        }
      }
    }
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

export { theme };
