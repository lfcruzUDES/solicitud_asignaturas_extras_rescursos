/// <reference path="../Settings.ts" />


namespace TABLES {

    type col = {
        name: string,
        data_type: string,
        col?: string,
        verbose_name?: string,
        default?: any,
        choices?: {},
        max?: number,
        min?: number,
        auto_add?: any,
    }

    /**
     * Tabla de la hoja de respuestas.
     */
    const RESPONSES_TABLE: col[] = [
        { name: 'datetime', data_type: 'datetime', verbose_name: 'Marca temporal' },
        { name: 'email', data_type: 'string', verbose_name: 'Dirección de correo electrónico' },
        { name: 'name', data_type: 'string', verbose_name: 'Nombre completo del alumno:' },
        { name: 'career', data_type: 'string', verbose_name: 'Matrícula:' }
    ];

    /**
     * Crea una tabla de la hoja de respuestas,
     * agregando automáticamente las columnas según las
     * carreras en SETTINGS.CAREERS_NAMES_SHORT y la
     * cantidad de campos en SETTINGS.SUBJECTS_BY_CAREER.
     */
    export function RESPONES_TABLE_FULL() {
        let table: col[] = [...RESPONSES_TABLE];
        for (const career of SETTINGS.CAREERS_NAMES_SHORT) {
            for (let i = 0; i < SETTINGS.SUBJECTS_BY_CAREER; i++) {
                table.push({
                    name: `${career}${i + 1}`,
                    data_type: 'string',
                });
            }
        }

        table.push({
            name: `status`,
            data_type: 'boolean',
            default: false
        });

        return table;
    }

    /**
     * Tabla de la hoja de Correos de notificación.
     */
    export const NOTIFICATION_DATA_TABLE: col[] = [
        { name: 'career', data_type: 'string', verbose_name: 'Oferta académica' },
        { name: 'email', data_type: 'string', verbose_name: 'Correo' },
        { name: 'coordinator', data_type: 'string', verbose_name: 'Coordinador' }
    ];

    /**
     * Tabla de la hoja de directores.
     */
    export const DIRECTORS_DATA_TABLE: col[] = [
        { name: 'area', data_type: 'string', verbose_name: 'Área' },
        { name: 'name', data_type: 'string', verbose_name: 'Nombre' }
    ];
}
