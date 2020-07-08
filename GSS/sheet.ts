/// <reference path="./book.ts"/>
/// <reference path="../Settings.ts" />

/**
 * Clases de las hojas de cálculo.
 */
namespace SHEET {
    // TYPES >>>
    type Spreadsheet_type = GoogleAppsScript.Spreadsheet.Spreadsheet;
    type Sheet_type = GoogleAppsScript.Spreadsheet.Sheet;
    type col = {
        name: string,
        data_type: string,
        col: string,
        verbose_name?: string,
        default?: any,
        // Choices [any, any ...]
        choices?: any[],
        max?: number,
        min?: number,
        auto_add?: any,
    }

    // TYPES <<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    /**
     * Mother Class Sheet
     */
    export class BaseSheet {
        id_url_booK: string = '';
        sheet_name: string = '';
        book!: Spreadsheet_type;
        sheet!: Sheet_type;


        /**
         * Connects with a Book.
         */
        book_conn(): Spreadsheet_type {
            if (!this.book) {
                if (this.id_url_booK) {
                    if (this.id_url_booK.indexOf('https://docs.google.com/spreadsheets/') >= 0) {
                        this.book = SpreadsheetApp.openByUrl(this.id_url_booK);
                    } else {
                        this.book = SpreadsheetApp.openById(this.id_url_booK);
                    }
                } else {
                    this.book = SpreadsheetApp.getActiveSpreadsheet();
                }
            }
            return this.book
        }


        /**
         * Gets a sheet from book with a name,
         * if not there are name return the current sheet.
         */
        sheet_conn(): Sheet_type {
            let ss = this.book_conn();
            if (this.sheet_name) {
                this.sheet = <Sheet_type>ss.getSheetByName(this.sheet_name);
            } else {
                this.sheet = ss.getActiveSheet();
            }
            return this.sheet;
        }


        /**
         * Inserts a new sheet, if already exists
         * return that sheet, and if there isn't name sheet
         * add a name default that is in the SETTINGS.
         * @param name_sheet : nombre de la nueva hoja a insertar.
         */
        insertSheet(name_sheet?: string): Sheet_type {
            let ss = this.book_conn();
            name_sheet = name_sheet ? name_sheet : this.sheet_name;
            if (name_sheet) {
                try {
                    return ss.insertSheet(name_sheet);

                } catch (error) {
                    return <Sheet_type>ss.getSheetByName(name_sheet);
                }
            } else {
                return <Sheet_type>ss.getSheetByName(SETTINGS.DEFAULT_NAMESHEET);
            }
        }

        get_book_sheet_names() {
            return this.book.getSheets()
                .map(el => el.getName());
        }

    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    /**
     * Sheet class, in this class we must add methods.
     */
    export class Sheet extends BaseSheet {

        /**
         * Return col as a simple array. This function by default not takes headers,
         * so the first row is discarted, but if as second param is pased a integer,
         * it will taked as a row where column starts.
         * @param col : number, in Google Sheets cols starts at 1 not in 0.
         */
        col_as_array(col: number, row: number = 2) {
            let values = this.sheet
                .getRange(row, col, this.sheet.getLastRow(), 1)
                .getValues();
            return values.map(el => el[0]);
        }

    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    /**
     * This class use a Base Model for create an array of
     * Models.
     */
    export class ModelSheet extends Sheet {

        name!: string;
        model = BASE_MODEL;
        cols_map = {};
        cols: col[];


        make() {
            this.book_conn();
            this.sheet_conn();
        }


        /**
         * Creates a map of cols, where each name
         * corresponde to one col number.
         */
        map_table() {
            if (!this.cols) {
                throw "The attribute cols is empty.";
            }
            let cols_map = {}
            for (let i = 0; i < this.cols.length; i++) {
                let name = this.cols[i].name;
                cols_map[name] = i;
                cols_map[`${i}`] = name;
            }

            this.cols_map = cols_map
            return cols_map;
        }


        /**
         * Creates a new object and returns it.
         * @param datas
         */
        create(datas: {}) {
            let obj_new = new this.model(this.sheet, this.cols);
            obj_new.set_datas(datas)
            obj_new.save();
            return obj_new;
        }

        /**
         * Change object of serach_params
         * to an array of arrays: [[number col, value to compare], ...]
         * @param search_params : object data
         */
        search_params_to_array(search_params: {}): [number, string][] {
            let cols_map = this.map_table();
            let params = []
            for (const param in search_params) {
                params.push(
                    [parseInt(cols_map[param]), search_params[param]]
                )
            }

            return params;
        }


        /**
         * Return a col_data if all search_params match with
         * his parallel item in the array col_data.
         * @param search_params : terms search.
         * @param col_data: data from a row.
         */
        search(search_params: [number, string][], col_data: string[][]) {
            let search_params_length = search_params.length;
            let counter_ok = 0;

            for (const param of search_params) {
                if (col_data[param[0]] === param[1]) {
                    counter_ok++;
                }
            }

            if (search_params_length === counter_ok) {
                return col_data;
            }
        }

        /**
         * Return the first item that match with search_params.
         * @param search_params : {key: value} params to search de wished item.
         */
        get(search_params: {}) {

            let params = this.search_params_to_array(search_params)

            let values = this.sheet.getDataRange().getValues();
            for (let i = 1; i < values.length; i++) {
                let data = this.search(params, values[i])
                if (data) {
                    return new this.model(this.sheet, this.cols, i + 1, data);
                }
            }
        }


        /**
         * Return the all items that match with search_params.
         * @param search_params : {key: value} params to search de wished item.
         */
        filter(search_params: {}) {
            let params = this.search_params_to_array(search_params)
            let datas = [];

            let values = this.sheet.getDataRange().getValues();
            for (let i = 1; i < values.length; i++) {
                let data = this.search(params, values[i])
                if (data) {
                    datas.push(
                        new this.model(this.sheet, this.cols, i + 1, data)
                    );
                }
            }

            return datas;
        }


        /**
         * Return all items.
         */
        all() {
            let datas = [];
            let values = this.sheet.getDataRange().getValues();
            for (let i = 1; i < values.length; i++) {
                datas.push(
                    new this.model(this.sheet, this.cols, i + 1, values[i])
                );
            }

            return datas;
        }

    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    /**
     * This class is a Model for each row in de table.
     */
    export class BASE_MODEL {

        /**
         * Hoja de cálculo
         */
        sheet!: GoogleAppsScript.Spreadsheet.Sheet;
        /**
         * Fila de la que proviene la información. Se le debe sumar 1.
         */
        row!: number;
        /**
         * Columnas: array de objetos con información de la columna.
         */
        cols!: col[];
        /**
         * Datos obtenidos directamente de la hoja de cálculo.
         */
        data_raw!: any[];
        /**
         * Se almacenan los datos creados por zip.
         */
        datas = {};

        ERRORS = {
            "TYPE_NOT_RECOGNIZED": "The type of element is not recognized",
            "MUST_BE_STRING_OR_NUMBER": "Only string or number is allowed",
            "MIN": "The value is smaller than the specified min",
            "MAX": "The value is greater than the specified max",
        }

        constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, cols: col[], row?: number | boolean, data_raw?: any[]) {
            if (sheet && cols) {
                this.row = row ? row : false;
                this.cols = this.add_col_number(cols);
                this.sheet = sheet;
                this.data_raw = data_raw ? data_raw : [];
                this.zip();
            } else {
                throw "This params are required: sheet, cols";
            }
        }


        /**
         * Agrega el número de la columna según la posición
         * del elemento del array.
         * @param cols : Columnas.
         */
        add_col_number(cols: col[]) {
            for (let i = 0; i < cols.length; i++) {
                cols[i].col = String(i);
            }

            return cols;
        }

        /**
         * La función zip se encarga de crear un objeto key:value
         * del array simple data_raw, que son los valores obtenidos
         * directamente de la hoja de cálculo. EL objeto obtenido
         * se crea según las opciones pasadas en el array de columnas,
         * donde name será la clave o claves del objeto.
         * Si data_raw no existe entonces las claves son las mismas, pero el
         * valor es un string vacío.
         */
        zip() {
            for (const col of this.cols) {
                let value = this.data_raw.length >= 1 ? this.data_raw[col.col] : '';
                this.datas[col.name] = value;
            }
        }

        /**
         * Guarda los valores del objeto obtenido
         * de la funcion zip en el array data_raw.
         * Este es el proceso previo a almacenamiento.
         */
        unzip() {
            for (const col of this.cols) {
                let value = this.datas[col.name];

                value = this.check_type(value, col);
                value = this.check_min(value, col);

                if (!this.datas[col.name] && col.default) {
                    value = col.default;
                }

                if (col.auto_add) {
                    value = col.auto_add;
                }

                this.data_raw[col.col] = value;
            }
        }

        /**
         * Guarda los datos en la hoja de cálculo.
         */
        save() {
            this.unzip();
            if (this.row) {
                let range = this.sheet.getRange(this.row, 1, 1, this.data_raw.length);
                range.setValues([this.data_raw]);
            } else {
                this.sheet.appendRow(this.data_raw);
            }
        }


        /**
         * Cuando ya existen datos en datas se usa este método
         * para reasignar los valores de un nuevo objeto con tados,
         * que debe contener las mismas claves de objeto.
         * @param new_datas
         */
        set_datas(new_datas: {}) {
            for (const data in new_datas) {
                if (this.datas.hasOwnProperty(data)) {
                    this.datas[data] = new_datas[data];
                }
            }

            return this.datas;
        }


        // COMPROBACIONES >>>

        check_type(val: any, col: col) {
            if (col.data_type === 'string') {
                return String(val);
            } else if (col.data_type === 'number') {
                return Number(val);
            } else if (col.data_type === 'boolean') {
                return Boolean(val);
            } else if (col.data_type === 'datetime') {
                return new Date(val);
            } else {
                throw this.ERRORS.TYPE_NOT_RECOGNIZED + this.format_value_error(val, col, col.data_type);
            }
        }

        check_min(val: string | number, col: col) {
            if (col.hasOwnProperty('min')) {
                if (col.data_type === 'string') {
                    if (col.min > val.length) {
                        throw this.ERRORS.MIN + this.format_value_error(val, col, col.data_type, col.min);
                    }
                } else if (col.data_type === 'number') {
                    if (Number(col.min) > Number(val)) {
                        throw this.ERRORS.MIN + this.format_value_error(val, col, col.data_type, col.min);
                    }
                }
            }

            return val;
        }

        check_max(val: string | number, col: col) {
            if (col.hasOwnProperty('max')) {
                if (col.data_type === 'string') {
                    if (col.max < val.length) {
                        throw this.ERRORS.MAX + this.format_value_error(val, col, col.data_type, col.max);
                    }
                } else if (col.data_type === 'number') {
                    if (Number(col.max) < Number(val)) {
                        throw this.ERRORS.MAX + this.format_value_error(val, col, col.data_type, col.max);
                    }
                }
            }
            return val;
        }

        // COMPROBACIONES <<<

        format_value_error(val: any, col: col, data_type: string, condition?: any) {
            return ` => COL_NAME: ${col.name}, DATA_TYPE: ${data_type}, VALUE: ${val}, ${condition ? 'CONDITION:' + condition : ''}.`
        }
    }

}