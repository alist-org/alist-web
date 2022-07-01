import { HopeThemeConfig } from "@hope-ui/solid";

const theme: HopeThemeConfig = {
  initialColorMode: "system",
  components:{
    Button: {
      defaultProps:{
        root: {
          colorScheme: "info"
        }
      }
    }
  }
}

export default theme;