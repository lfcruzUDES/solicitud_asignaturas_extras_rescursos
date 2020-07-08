/// <reference path="../GSS/sheet.ts" />
/// <reference path="../Tables/Tables.ts" />


/**
 * Descripción de las columnas de cada
 * hoja dentro del libro a usar.
 */
namespace Models {

    /**
     * Modelo de la tabla de respuestas.
     */
    export function ResponsesModel() {
        class Responses extends SHEET.ModelSheet {
            id_url_booK = SETTINGS.BOOK;
            sheet_name = SETTINGS.SHEET_RESPONSES;
            cols = TABLES.RESPONES_TABLE_FULL();

            constructor() {
                super();
                this.make();
            }

        }

        return new Responses();
    }

    /**
     * Modelo de la tabla de respuestas.
     */
    export function NotificationDataModel() {
        class NotificationData extends SHEET.ModelSheet {
            id_url_booK = SETTINGS.BOOK;
            sheet_name = SETTINGS.SHEET_NOTIFICATION_DATA;
            cols = TABLES.NOTIFICATION_DATA_TABLE;

            constructor() {
                super();
                this.make();
            }

        }

        return new NotificationData();
    }

    /**
     * Modelo de la tabla de respuestas.
     */
    export function DirectorsDataModel() {
        class DirectorsData extends SHEET.ModelSheet {
            id_url_booK = SETTINGS.BOOK;
            sheet_name = SETTINGS.SHEET_HISTORY;
            cols = TABLES.DIRECTORS_DATA_TABLE;

            constructor() {
                super();
                this.make();
            }

        }

        return new DirectorsData();
    }

    export function HistoryModel() {
        class HistoryData extends SHEET.ModelSheet {
            id_url_booK = SETTINGS.BOOK;
            sheet_name = SETTINGS.SHEET_DIRECTORS_DATA;
            cols = TABLES.HISTORY_TABLE;

            constructor() {
                super();
                this.make();
            }

        }

        return new HistoryData();
    }
}
