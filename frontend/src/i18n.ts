import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./locale/en.json";
import rsJSON from "./locale/rs.json";

i18next.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    rs: { ...rsJSON },
  },
  lng: "en",
});
