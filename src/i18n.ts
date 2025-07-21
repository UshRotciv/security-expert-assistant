import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "appTitle": "Design Center General Information Security Management Regulations",
          "searchPlaceholder": "Search keywords...",
          "descriptionLabel": "Description:",
          "digitalManagementLabel": "Digital File Storage and Management:",
          "physicalManagementLabel": "Physical File Storage and Management:",
          "accessRightsLabel": "Access Rights:",
          "externalCommunicationLabel": "External Communication Principles:",
          "language": "Language",
          "chinese": "中文",
          "english": "English"
        }
      },
      zh: {
        translation: {
          "appTitle": "設計中心通則資安管理辦法",
          "searchPlaceholder": "搜尋關鍵字...",
          "descriptionLabel": "說明:",
          "digitalManagementLabel": "數位檔案儲存與管理:",
          "physicalManagementLabel": "實體檔案儲存與管理:",
          "accessRightsLabel": "存取權限:",
          "externalCommunicationLabel": "對外溝通原則:",
          "language": "語言",
          "chinese": "中文",
          "english": "English"
        }
      }
    },
    lng: "zh", // default language
    fallbackLng: "zh",

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;