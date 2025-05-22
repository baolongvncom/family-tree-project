// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";
import { VTreeview } from "vuetify/labs/VTreeview";
import { VTimePicker } from "vuetify/labs/VTimePicker";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VTreeview,
      VTimePicker,
    },
  });
  app.vueApp.use(vuetify);
});
