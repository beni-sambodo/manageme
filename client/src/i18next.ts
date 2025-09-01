// src/Locales/i18next.js
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import En from "./Locales/en.json";
import Uz from "./Locales/uz.json";
import Ru from "./Locales/ru.json";

const DEFAULT_LOCALE = localStorage.getItem("ln") || "uz";
i18next.use(initReactI18next).init({
  lng: DEFAULT_LOCALE || "uz",
  fallbackLng: "en",
  debug: false,
  defaultNS: "ns1",
  resources: {
    en: { ns1: En },
    uz: { ns1: Uz },
    ru: { ns1: Ru },
  },
});

export default i18next;
