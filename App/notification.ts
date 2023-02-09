/// <reference path="../GEmail/Email.ts" />
/// <reference path="../Settings.ts" />

namespace SEND {
  /**
   * Envía una notificación al coordinador
   * de una nueva solicitud de asignaturas.
   * @param email_coorinator : email del coordinador.
   * @param data_response : datos de la solicitud.
   */
  export function noti(email_coorinator: string, data_response: {}) {
    let body = EMAIL.get_body_from_file(SETTINGS.EMAIL_BODY_FILE, [
      data_response,
    ]);
    EMAIL.send_email(email_coorinator, SETTINGS.EMAIL_SUBJECT, body);
  }
}
