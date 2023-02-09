namespace SETTINGS {
  // export const BOOK = 'https://docs.google.com/spreadsheets/d/1aUyxHQenmUM1o4D0Ebzs8Bk2DCrwCyhFM4SYzFBVVVU/edit';

  // Para desarrollo
  export const BOOK =
    "https://docs.google.com/spreadsheets/d/1aUyxHQenmUM1o4D0Ebzs8Bk2DCrwCyhFM4SYzFBVVVU/edit";
  export const SHEET_RESPONSES = "Respuestas";
  export const SHEET_NOTIFICATION_DATA = "Coordinadores";
  export const SHEET_DIRECTORS_DATA = "Directores";
  export const SHEET_HISTORY = "Historial";

  export const CAREERS_NAMES_SHORT = ["DI", "GST", "IMA", "NTR"];
  export const SUBJECTS_BY_CAREER = 5;

  /**
   * Plantilla del formato.
   */
  export const FORMAT_TEMPLATE_URL =
    "https://docs.google.com/presentation/d/19SUv6Xx95cRhB4dXzNuYklQx_yeU81zmyn_kICb2nIk/edit";
  export const FORMAT_TEMPLATE_ID =
    "19SUv6Xx95cRhB4dXzNuYklQx_yeU81zmyn_kICb2nIk";
  export const FOLDER_FORMATS_FILLED = "1Qww6jza4QzDY4YR3vdcGLViN11Hm_GgJ";

  /**
   * Marcadores a sustituir.
   */
  export const MARKS = {
    name: "",
    enrollment: "",
    day: "",
    month: "",
    year: "",
    coordinator: "",
    academic_director: "",
    administrative_director: "",
  };

  /**
   * EMAILS DATA
   */
  export const EMAIL_SUBJECT =
    "UDES Universidad | Nueva solicitud de asignaturas extras/recursos";
  export const EMAIL_BODY_FILE = "Templates/Emails/base";

  /**
   * Directores de área los que va dirigido el documento.
   */
  export const DIRECTOR_AREA = {
    admin: "Administración",
    academic: "Academia",
  };
}
